import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PenTool,
  Sparkles,
  RotateCcw,
  Coins,
  Trophy,
  Lightbulb,
  Check,
  AlertCircle,
  Languages,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Printer,
  HelpCircle,
  Award,
  ClipboardCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Layers,
  ListOrdered,
  Zap,
  Upload,
  FileUp,
  BookMarked,
} from 'lucide-react';
import {
  CreativeHomeworkAssignment,
  CreativeSubmissionRecord,
  GradeLevel,
  SavedReportSummary,
} from '../types';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { AppTheme, getThemeConfig } from '../utils/theme';
import {
  loadCreativeHomeworks,
  saveCreativeSubmission,
  subscribeToCrossTabUpdates,
} from '../utils/firebase';
import { escapePrintHtml, getPrintBrandLogosHtml, printRawHtmlDocument } from '../utils/printWorksheet';
import {
  KATHA_SHILPI_FORMATS,
  PRIMARY_GENRE_TABS,
  PrimaryGenreTabId,
  WritingFormatId,
  WritingFormatSpec,
  ModelExample,
} from '../data/kathaShilpiData';
import {
  KATHA_SHILPI_INNOVATIONS,
  InnovativeExample,
} from '../data/kathaShilpiInnovations';

interface StoryBuilderProps {
  grade: GradeLevel;
  onAddWordCoins: (coins: number) => void;
  bilingualMode: boolean;
  currentUser?: { uid?: string; email: string; userName?: string; grade?: GradeLevel; section?: string } | null;
  theme?: AppTheme;
  preselectedHomework?: CreativeHomeworkAssignment | null;
  onCreativeSubmissionSaved?: (submission: CreativeSubmissionRecord) => void;
  initialSubTab?: StudioSubTab;
  onRecordWrongAnswer?: (
    topicOrId: string,
    topicNameHindi?: string,
    topicNameEnglish?: string,
    questionText?: string
  ) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  focusMode?: boolean;
}

type StudioSubTab = 'format' | 'examples' | 'exercises' | 'writer';
type PatraSubType = 'patra_formal' | 'patra_informal';

interface KathaReviewResult {
  submissionMode?: 'typed' | 'handwritten';
  transcribedText?: string;
  genreId: string;
  wordCount: number;
  hindiTitle: string;
  hindiTranslation: string;
  overallScore: number;
  rubricScores: {
    format: number;
    content: number;
    language: number;
    vyakaranVartani?: number;
    praroop?: number;
    shabdavaliBhav?: number;
  };
  level: string;
  isMeaningful: boolean;
  coinsAwarded: number;
  formatChecklist: {
    elementHindi: string;
    elementEnglish: string;
    present: boolean;
    noteHindi: string;
  }[];
  spellingCorrections: {
    originalWord: string;
    correctedWord: string;
    explanationHindi: string;
  }[];
  structureFeedback?: string;
  vocabularySuggestions?: {
    originalHindi?: string;
    upgradedHindi: string;
    muhavaraOrSynonym: string;
    usageNoteHindi: string;
  }[];
  feedbackHindi: string;
  feedbackEnglish: string;
  strengthsHindi: string[];
  strengthsEnglish: string[];
  improvementTipsHindi: string[];
  improvementTipsEnglish: string[];
}

const ALL_GRADES: GradeLevel[] = ['कक्षा 5', 'कक्षा 6', 'कक्षा 7', 'कक्षा 8', 'कक्षा 9', 'कक्षा 10'];

export const StoryBuilder: React.FC<StoryBuilderProps> = ({
  grade,
  onAddWordCoins,
  bilingualMode,
  currentUser,
  theme = 'indigo',
  preselectedHomework,
  onCreativeSubmissionSaved,
  initialSubTab,
  onRecordWrongAnswer,
  onRecordReport,
  focusMode = false,
}) => {
  const themeConfig = getThemeConfig(theme);
  const normEmail = (currentUser?.email || '').trim().toLowerCase();

  const [primaryTab, setPrimaryTab] = useState<PrimaryGenreTabId>('nibandh');
  const [patraSubType, setPatraSubType] = useState<PatraSubType>('patra_formal');
  const [subTab, setSubTab] = useState<StudioSubTab>(initialSubTab || 'format');
  const [showFormatTags, setShowFormatTags] = useState<boolean>(true);

  const activeFormatId: WritingFormatId =
    primaryTab === 'patra' ? patraSubType : (primaryTab as WritingFormatId);
  const spec: WritingFormatSpec = KATHA_SHILPI_FORMATS[activeFormatId];
  const innovations = KATHA_SHILPI_INNOVATIONS[activeFormatId];
  const currentGradeSpec = spec.gradeSpecs[grade];

  // Exercise State (per format key)
  const [fillSelections, setFillSelections] = useState<Record<string, number>>({});
  const [fillChecked, setFillChecked] = useState<Record<string, boolean>>({});
  const [fillHintsOpen, setFillHintsOpen] = useState<Record<string, boolean>>({});

  const [errLineSelections, setErrLineSelections] = useState<Record<string, number>>({});
  const [errFixSelections, setErrFixSelections] = useState<Record<string, number>>({});
  const [errChecked, setErrChecked] = useState<Record<string, boolean>>({});

  // Innovative Exercise State: Sequence Builder & Creative Challenges
  const [seqOrders, setSeqOrders] = useState<Record<string, string[]>>({});
  const [seqChecked, setSeqChecked] = useState<Record<string, boolean>>({});
  const [creativeSelections, setCreativeSelections] = useState<Record<string, number>>({});
  const [creativeChecked, setCreativeChecked] = useState<Record<string, boolean>>({});

  // Anti-coin-farming set of already rewarded exercise item IDs
  const rewardedIdsStorageKey = normEmail
    ? `shabdshilp_ks_rewarded_${normEmail}`
    : 'shabdshilp_ks_rewarded_guest';
  const [rewardedExerciseIds, setRewardedExerciseIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(rewardedIdsStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedReportToast, setSavedReportToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(rewardedIdsStorageKey);
      setRewardedExerciseIds(saved ? JSON.parse(saved) : {});
    } catch {
      setRewardedExerciseIds({});
    }
  }, [rewardedIdsStorageKey]);

  const markExerciseRewarded = (itemId: string, coins: number) => {
    if (rewardedExerciseIds[itemId]) return false;
    const updated = { ...rewardedExerciseIds, [itemId]: true };
    setRewardedExerciseIds(updated);
    try {
      localStorage.setItem(rewardedIdsStorageKey, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
    onAddWordCoins(coins);
    triggerCoinBurst();
    return true;
  };

  // AI Writer State (per user & active format)
  const draftStorageKey = normEmail
    ? `shabdshilp_ks_draft_${normEmail}_${activeFormatId}`
    : `shabdshilp_ks_draft_guest_${activeFormatId}`;

  const [inputLanguage, setInputLanguage] = useState<'english' | 'hindi'>('english');
  const [compositionTitle, setCompositionTitle] = useState<string>('');
  const [compositionText, setCompositionText] = useState<string>(() => {
    try {
      return localStorage.getItem(draftStorageKey) || '';
    } catch {
      return '';
    }
  });
  const [loadedDraftKey, setLoadedDraftKey] = useState<string>(draftStorageKey);
  const [selectedPromptHint, setSelectedPromptHint] = useState<string | null>(null);

  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<KathaReviewResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Handwritten OCR upload & Homework linking state
  const [writerMode, setWriterMode] = useState<'typed' | 'handwritten'>('typed');
  const [assignedHomeworks, setAssignedHomeworks] = useState<CreativeHomeworkAssignment[]>([]);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{
    dataUrl: string;
    mimeType: string;
    fileName: string;
    sizeBytes: number;
  } | null>(null);
  const [submissionSavedBanner, setSubmissionSavedBanner] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const refreshHomeworks = () => {
      loadCreativeHomeworks()
        .then((list) => {
          if (!mounted || !Array.isArray(list)) return;
          const studentSec = currentUser?.section || 'सेक्शन A';
          const filtered = (list as CreativeHomeworkAssignment[]).filter(
            (hw) =>
              hw &&
              hw.isActive !== false &&
              (!hw.grade || hw.grade === grade) &&
              (!hw.section ||
                hw.section === studentSec ||
                hw.section === 'सभी सेक्शन (All Sections)')
          );
          setAssignedHomeworks(filtered);
        })
        .catch(() => {});
    };
    refreshHomeworks();
    const unsub = subscribeToCrossTabUpdates(refreshHomeworks);
    return () => {
      mounted = false;
      unsub();
    };
  }, [grade, currentUser?.section]);

  useEffect(() => {
    if (!preselectedHomework) return;
    if (
      preselectedHomework.genreId === 'patra_formal' ||
      preselectedHomework.genreId === 'patra_informal'
    ) {
      setPrimaryTab('patra');
      setPatraSubType(preselectedHomework.genreId);
    } else if (
      preselectedHomework.genreId &&
      preselectedHomework.genreId in KATHA_SHILPI_FORMATS
    ) {
      setPrimaryTab(preselectedHomework.genreId as PrimaryGenreTabId);
    }
    setSubTab('writer');
    setSelectedHomeworkId(preselectedHomework.id);
    setCompositionTitle(preselectedHomework.titleHindi);
    setSelectedPromptHint(
      `${preselectedHomework.instructionsHindi} (शब्द-सीमा: ~${preselectedHomework.wordLimit} | अंतिम तिथि: ${preselectedHomework.dueDate})`
    );
  }, [preselectedHomework]);

  useEffect(() => {
    try {
      setCompositionText(localStorage.getItem(draftStorageKey) || '');
    } catch {
      setCompositionText('');
    }
    setLoadedDraftKey(draftStorageKey);
    setReviewResult(null);
    setErrorMsg(null);
    setSubmissionSavedBanner(null);
    if (!preselectedHomework) {
      setSelectedPromptHint(null);
    }
  }, [draftStorageKey]);

  useEffect(() => {
    if (loadedDraftKey !== draftStorageKey) return;
    try {
      localStorage.setItem(draftStorageKey, compositionText);
    } catch {
      // Ignore storage error
    }
  }, [compositionText, draftStorageKey, loadedDraftKey]);

  const wordCount = compositionText.trim()
    ? compositionText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Ordered examples with current grade band first
  const orderedExamples = useMemo(() => {
    const isJunior = grade === 'कक्षा 5' || grade === 'कक्षा 6' || grade === 'कक्षा 7';
    const targetBand = isJunior ? 'कक्षा 5–7' : 'कक्षा 8–10';
    return [...spec.examples].sort((a, b) => {
      if (a.gradeBand === targetBand && b.gradeBand !== targetBand) return -1;
      if (b.gradeBand === targetBand && a.gradeBand !== targetBand) return 1;
      return 0;
    });
  }, [spec.examples, grade]);

  const orderedInnovativeExamples = useMemo(() => {
    const isJunior = grade === 'कक्षा 5' || grade === 'कक्षा 6' || grade === 'कक्षा 7';
    const targetBand = isJunior ? 'कक्षा 5–7' : 'कक्षा 8–10';
    return [...innovations.innovativeExamples].sort((a, b) => {
      if (a.gradeBand === targetBand && b.gradeBand !== targetBand) return -1;
      if (b.gradeBand === targetBand && a.gradeBand !== targetBand) return 1;
      return 0;
    });
  }, [innovations.innovativeExamples, grade]);

  const isSequenceCorrect = (seqId: string): boolean => {
    const seqEx = innovations.sequenceExercise;
    if (seqEx.id !== seqId) return false;
    const placed = seqOrders[seqId] || [];
    if (placed.length !== seqEx.shuffledSteps.length) return false;
    const stepMap = new Map(seqEx.shuffledSteps.map((s) => [s.id, s]));
    return placed.every((stepId, idx) => stepMap.get(stepId)?.correctOrder === idx);
  };

  // Exercise metrics for current format (Strictly attempted vs skipped)
  const exerciseStats = useMemo(() => {
    const totalFill = spec.fillBlanks.length;
    const totalErr = spec.errorIdentification.length;
    const totalSeq = 1;
    const totalCreative = innovations.creativeExercises.length;
    const total = totalFill + totalErr + totalSeq + totalCreative;

    let attempted = 0;
    let correct = 0;

    spec.fillBlanks.forEach((fb) => {
      if (fillChecked[fb.id] && typeof fillSelections[fb.id] === 'number') {
        attempted++;
        if (fillSelections[fb.id] === fb.correctIndex) correct++;
      }
    });

    spec.errorIdentification.forEach((er) => {
      if (
        errChecked[er.id] &&
        typeof errLineSelections[er.id] === 'number' &&
        typeof errFixSelections[er.id] === 'number'
      ) {
        attempted++;
        if (
          errLineSelections[er.id] === er.errorLineIndex &&
          errFixSelections[er.id] === er.correctCorrectionIndex
        ) {
          correct++;
        }
      }
    });

    const seqEx = innovations.sequenceExercise;
    const placedSeq = seqOrders[seqEx.id] || [];
    if (seqChecked[seqEx.id] && placedSeq.length === seqEx.shuffledSteps.length) {
      attempted++;
      const stepMap = new Map(seqEx.shuffledSteps.map((s) => [s.id, s]));
      if (placedSeq.every((sid, idx) => stepMap.get(sid)?.correctOrder === idx)) {
        correct++;
      }
    }

    innovations.creativeExercises.forEach((cr) => {
      if (creativeChecked[cr.id] && typeof creativeSelections[cr.id] === 'number') {
        attempted++;
        if (creativeSelections[cr.id] === cr.correctIndex) correct++;
      }
    });

    const skipped = Math.max(0, total - attempted);
    const accuracyAttemptedPct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { total, attempted, correct, skipped, accuracyAttemptedPct };
  }, [
    spec,
    innovations,
    fillChecked,
    fillSelections,
    errChecked,
    errLineSelections,
    errFixSelections,
    seqChecked,
    seqOrders,
    creativeChecked,
    creativeSelections,
  ]);

  const handleSelectFillOption = (fbId: string, idx: number) => {
    if (fillChecked[fbId]) return;
    setFillSelections((prev) => ({ ...prev, [fbId]: idx }));
  };

  const handleVerifyFillBlank = (fbId: string) => {
    const fb = spec.fillBlanks.find((x) => x.id === fbId);
    const chosen = fillSelections[fbId];
    if (!fb || typeof chosen !== 'number') return;

    setFillChecked((prev) => ({ ...prev, [fbId]: true }));
    if (chosen === fb.correctIndex) {
      markExerciseRewarded(fb.id, 1);
    } else if (onRecordWrongAnswer) {
      onRecordWrongAnswer(
        spec.topicKey,
        spec.shortTitleHindi,
        spec.titleEnglish,
        `${fb.beforeBlankHindi} ___ ${fb.afterBlankHindi}`
      );
    }
  };

  const handleVerifyErrorItem = (errId: string) => {
    const errItem = spec.errorIdentification.find((x) => x.id === errId);
    const chosenLine = errLineSelections[errId];
    const chosenFix = errFixSelections[errId];
    if (!errItem || typeof chosenLine !== 'number' || typeof chosenFix !== 'number') return;

    setErrChecked((prev) => ({ ...prev, [errId]: true }));
    const bothRight =
      chosenLine === errItem.errorLineIndex && chosenFix === errItem.correctCorrectionIndex;
    if (bothRight) {
      markExerciseRewarded(errItem.id, 2);
    } else if (onRecordWrongAnswer) {
      onRecordWrongAnswer(spec.topicKey, spec.shortTitleHindi, spec.titleEnglish, errItem.titleHindi);
    }
  };

  const handleToggleSequenceStep = (seqId: string, stepId: string) => {
    if (seqChecked[seqId]) return;
    setSeqOrders((prev) => {
      const current = prev[seqId] || [];
      if (current.includes(stepId)) {
        return { ...prev, [seqId]: current.filter((id) => id !== stepId) };
      }
      return { ...prev, [seqId]: [...current, stepId] };
    });
  };

  const handleClearSequence = (seqId: string) => {
    if (seqChecked[seqId]) return;
    setSeqOrders((prev) => ({ ...prev, [seqId]: [] }));
  };

  const handleVerifySequence = (seqId: string) => {
    const seqEx = innovations.sequenceExercise;
    if (seqEx.id !== seqId) return;
    const placed = seqOrders[seqId] || [];
    if (placed.length !== seqEx.shuffledSteps.length) return;

    setSeqChecked((prev) => ({ ...prev, [seqId]: true }));
    if (isSequenceCorrect(seqId)) {
      markExerciseRewarded(seqEx.id, 2);
    } else if (onRecordWrongAnswer) {
      onRecordWrongAnswer(
        spec.topicKey,
        spec.shortTitleHindi,
        spec.titleEnglish,
        seqEx.titleHindi
      );
    }
  };

  const handleVerifyCreative = (crId: string) => {
    const cr = innovations.creativeExercises.find((c) => c.id === crId);
    const chosen = creativeSelections[crId];
    if (!cr || typeof chosen !== 'number') return;

    setCreativeChecked((prev) => ({ ...prev, [crId]: true }));
    if (chosen === cr.correctIndex) {
      markExerciseRewarded(cr.id, 1);
    } else if (onRecordWrongAnswer) {
      onRecordWrongAnswer(
        spec.topicKey,
        spec.shortTitleHindi,
        spec.titleEnglish,
        cr.questionHindi
      );
    }
  };

  const handleResetExercises = () => {
    const nextFillSel = { ...fillSelections };
    const nextFillChk = { ...fillChecked };
    spec.fillBlanks.forEach((f) => {
      delete nextFillSel[f.id];
      delete nextFillChk[f.id];
    });
    setFillSelections(nextFillSel);
    setFillChecked(nextFillChk);

    const nextErrLine = { ...errLineSelections };
    const nextErrFix = { ...errFixSelections };
    const nextErrChk = { ...errChecked };
    spec.errorIdentification.forEach((e) => {
      delete nextErrLine[e.id];
      delete nextErrFix[e.id];
      delete nextErrChk[e.id];
    });
    setErrLineSelections(nextErrLine);
    setErrFixSelections(nextErrFix);
    setErrChecked(nextErrChk);

    const seqId = innovations.sequenceExercise.id;
    setSeqOrders((prev) => {
      const next = { ...prev };
      delete next[seqId];
      return next;
    });
    setSeqChecked((prev) => {
      const next = { ...prev };
      delete next[seqId];
      return next;
    });

    const nextCrSel = { ...creativeSelections };
    const nextCrChk = { ...creativeChecked };
    innovations.creativeExercises.forEach((cr) => {
      delete nextCrSel[cr.id];
      delete nextCrChk[cr.id];
    });
    setCreativeSelections(nextCrSel);
    setCreativeChecked(nextCrChk);
  };

  const handleSaveExerciseReport = () => {
    if (!onRecordReport || exerciseStats.attempted === 0) return;
    const now = new Date();
    onRecordReport({
      id: `ks_${activeFormatId}_${Date.now()}`,
      sourceType: 'katha_shilpi',
      titleHindi: `कथा शिल्पी अभ्यास: ${spec.titleHindi}`,
      titleEnglish: `Katha Shilpi Practice: ${spec.titleEnglish}`,
      grade,
      score: exerciseStats.correct,
      maxScore: exerciseStats.total,
      attemptedCount: exerciseStats.attempted,
      unansweredCount: exerciseStats.skipped,
      percentage: Math.round((exerciseStats.correct / Math.max(1, exerciseStats.total)) * 100),
      wordCoinsEarned: 0,
      weakAreasHindi:
        exerciseStats.correct < exerciseStats.attempted ? [spec.shortTitleHindi] : [],
      strongAreasHindi:
        exerciseStats.correct > 0 ? [spec.shortTitleHindi] : [],
      adviceSummaryHindi:
        exerciseStats.skipped > 0
          ? `आपने ${exerciseStats.total} में से ${exerciseStats.attempted} अभ्यास प्रश्न हल किए (${exerciseStats.skipped} छूटे), जिनमें ${exerciseStats.correct} सही रहे।`
          : `सभी ${exerciseStats.total} प्रारूप एवं त्रुटि-पहचान प्रश्नों में ${exerciseStats.correct} सही रहे!`,
      date: now.toLocaleDateString('hi-IN'),
      timestamp: now.toISOString(),
    });
    setSavedReportToast('अभ्यास रिपोर्ट सफलतापूर्वक आपकी प्रगति सूची में सहेजी गई!');
    setTimeout(() => setSavedReportToast(null), 3500);
  };

  const handleLoadWriterPrompt = (wpId: string) => {
    const wp = spec.writerPrompts.find((p) => p.id === wpId);
    if (!wp) return;
    setCompositionTitle(wp.titleHindi);
    setCompositionText(inputLanguage === 'hindi' ? wp.hindiStarter : wp.englishStarter);
    setSelectedPromptHint(wp.promptHindi);
    setReviewResult(null);
    setErrorMsg(null);
  };

  const handleWriteInnovativePrompt = (inn: InnovativeExample) => {
    setCompositionTitle(inputLanguage === 'hindi' ? inn.titleHindi : inn.titleEnglish);
    setSelectedPromptHint(
      `${inn.promptHindi} (नवाचारी तकनीक: ${inn.innovationTechniqueHindi})`
    );
    setReviewResult(null);
    setErrorMsg(null);
    setSubTab('writer');
  };

  const persistCreativePortfolioSubmission = async (
    data: KathaReviewResult,
    mode: 'typed' | 'handwritten',
    rawDraftText: string,
    fileMeta?: { fileName: string; mimeType: string }
  ) => {
    const linkedHw = assignedHomeworks.find((h) => h.id === selectedHomeworkId);
    const submissionId = `csub_${activeFormatId}_${Date.now()}`;
    const record: CreativeSubmissionRecord = {
      id: submissionId,
      ...(linkedHw ? { homeworkId: linkedHw.id, teacherEmail: linkedHw.teacherEmail } : {}),
      studentUid: currentUser?.uid,
      studentEmail: normEmail || 'student@shabdshilp.com',
      studentName: currentUser?.userName || 'विद्यार्थी',
      grade,
      section: currentUser?.section || 'सेक्शन A',
      genreId: activeFormatId,
      titleHindi: data.hindiTitle || compositionTitle.trim() || spec.titleHindi,
      submissionMode: mode,
      ...(fileMeta ? { fileName: fileMeta.fileName, mimeType: fileMeta.mimeType } : {}),
      transcribedText:
        mode === 'handwritten'
          ? data.transcribedText || data.hindiTranslation
          : rawDraftText || data.hindiTranslation,
      overallScore: Math.min(100, Math.max(0, Number(data.overallScore || 0))),
      rubricScores: {
        format: Number(data.rubricScores?.format || 7),
        content: Number(data.rubricScores?.content || 7),
        language: Number(data.rubricScores?.language || 7),
        ...(typeof data.rubricScores?.vyakaranVartani === 'number'
          ? { vyakaranVartani: data.rubricScores.vyakaranVartani }
          : {}),
        ...(typeof data.rubricScores?.praroop === 'number'
          ? { praroop: data.rubricScores.praroop }
          : {}),
        ...(typeof data.rubricScores?.shabdavaliBhav === 'number'
          ? { shabdavaliBhav: data.rubricScores.shabdavaliBhav }
          : {}),
      },
      grammarErrors: Array.isArray(data.spellingCorrections) ? data.spellingCorrections : [],
      ...(data.structureFeedback ? { structureFeedback: data.structureFeedback } : {}),
      ...(Array.isArray(data.vocabularySuggestions)
        ? { vocabularySuggestions: data.vocabularySuggestions }
        : {}),
      feedbackHindi: data.feedbackHindi || '',
      ...(data.feedbackEnglish ? { feedbackEnglish: data.feedbackEnglish } : {}),
      status: 'Submitted',
      coinsAwarded: Number(data.coinsAwarded || 0),
      submittedAt: new Date().toISOString(),
    };

    try {
      await saveCreativeSubmission(record);
      onCreativeSubmissionSaved?.(record);
      setSubmissionSavedBanner(
        linkedHw
          ? `गृहकार्य "${linkedHw.titleHindi}" हेतु आपकी रचना सहेजी गई और शिक्षक पोर्टल पर भेजी गई ✅`
          : 'आपकी रचना रिपोर्ट व शिक्षक समीक्षा पोर्टफोलियो में सुरक्षित सहेजी गई ✅'
      );
    } catch (err) {
      console.warn('Creative submission save fallback:', err);
      onCreativeSubmissionSaved?.(record);
    }
  };

  const handleHandwrittenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const rawMime = (file.type || '').toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const resolvedMime =
      rawMime === 'image/jpg'
        ? 'image/jpeg'
        : rawMime ||
          (ext === 'jpg' || ext === 'jpeg'
            ? 'image/jpeg'
            : ext === 'png'
            ? 'image/png'
            : ext === 'pdf'
            ? 'application/pdf'
            : '');

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(resolvedMime)) {
      setErrorMsg('केवल JPG, PNG या PDF प्रारूप में ही हस्तलिखित कॉपी अपलोड करें।');
      return;
    }

    const MAX_BYTES = 6 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setErrorMsg('फ़ाइल का आकार 6 MB से कम होना चाहिए। कृपया छोटी फ़ाइल चुनें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setErrorMsg('फ़ाइल पढ़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        return;
      }
      setUploadedFile({
        dataUrl,
        mimeType: resolvedMime,
        fileName: file.name,
        sizeBytes: file.size,
      });
    };
    reader.onerror = () => {
      setErrorMsg('फ़ाइल पढ़ने में समस्या आई। कृपया पुनः अपलोड करें।');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeHandwritten = async () => {
    setErrorMsg(null);
    setSubmissionSavedBanner(null);
    if (!uploadedFile) {
      setErrorMsg('कृपया पहले अपनी हस्तलिखित कॉपी (JPG, PNG या PDF) अपलोड करें।');
      return;
    }

    const linkedHw = assignedHomeworks.find((h) => h.id === selectedHomeworkId);
    setIsReviewing(true);
    try {
      const response = await fetch('/api/ai/katha-shilpi-handwritten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: uploadedFile.dataUrl,
          mimeType: uploadedFile.mimeType,
          fileName: uploadedFile.fileName,
          genreId: activeFormatId,
          title: compositionTitle.trim() || linkedHw?.titleHindi || '',
          grade,
          wordLimit: linkedHw?.wordLimit || 120,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.transcribedText) {
        setErrorMsg(
          data?.error || 'हस्तलिखित कॉपी पढ़ने व समीक्षा करने में समस्या आई। कृपया स्पष्ट फ़ोटो अपलोड करें।'
        );
        return;
      }

      setReviewResult(data);
      if (data.coinsAwarded > 0) {
        onAddWordCoins(data.coinsAwarded);
        triggerCelebration();
        triggerCoinBurst();
      }
      await persistCreativePortfolioSubmission(data, 'handwritten', data.transcribedText, {
        fileName: uploadedFile.fileName,
        mimeType: uploadedFile.mimeType,
      });

      if (onRecordReport) {
        const now = new Date();
        const overallPct = Math.min(100, Math.max(0, Math.round(Number(data.overallScore || 0))));
        onRecordReport({
          id: `ks_hw_${activeFormatId}_${Date.now()}`,
          sourceType: 'katha_shilpi',
          titleHindi: `हस्तलिखित रचना: ${data.hindiTitle || spec.titleHindi}`,
          titleEnglish: `Handwritten OCR Review: ${spec.titleEnglish}`,
          grade,
          score: Math.round(overallPct / 10),
          maxScore: 10,
          attemptedCount: 10,
          unansweredCount: 0,
          percentage: overallPct,
          wordCoinsEarned: Number(data.coinsAwarded || 0),
          weakAreasHindi: overallPct < 70 ? [spec.shortTitleHindi] : [],
          strongAreasHindi: overallPct >= 70 ? [spec.shortTitleHindi] : [],
          adviceSummaryHindi:
            data.feedbackHindi || `${spec.shortTitleHindi} हस्तलिखित समीक्षा पूर्ण (${overallPct}% अंक)।`,
          date: now.toLocaleDateString('hi-IN'),
          timestamp: now.toISOString(),
        });
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Handwritten OCR review error:', err);
      setErrorMsg('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleAnalyzeComposition = async () => {
    setErrorMsg(null);
    setSubmissionSavedBanner(null);
    if (wordCount < 5) {
      setErrorMsg(
        'कृपया मूल्यांकन के लिए कम से कम 5 शब्दों की रचना लिखें। (Please write at least 5 words first.)'
      );
      return;
    }

    setIsReviewing(true);
    try {
      const response = await fetch('/api/ai/katha-shilpi-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genreId: activeFormatId,
          title: compositionTitle.trim(),
          compositionText: compositionText.trim(),
          inputLanguage,
          grade,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.hindiTranslation) {
        setErrorMsg(
          data?.error || 'रचना का अनुवाद और समीक्षा प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
        );
        return;
      }

      setReviewResult(data);
      if (data.coinsAwarded > 0) {
        onAddWordCoins(data.coinsAwarded);
        triggerCelebration();
        triggerCoinBurst();
      }
      await persistCreativePortfolioSubmission(data, 'typed', compositionText.trim());

      if (onRecordReport) {
        const now = new Date();
        const overallPct = Math.min(100, Math.max(0, Math.round(Number(data.overallScore || 0))));
        const scoreOutOfTen = Math.round(overallPct / 10);
        onRecordReport({
          id: `ks_writer_${activeFormatId}_${Date.now()}`,
          sourceType: 'katha_shilpi',
          titleHindi: `कथा शिल्पी रचना: ${data.hindiTitle || spec.titleHindi}`,
          titleEnglish: `Katha Shilpi Composition: ${spec.titleEnglish}`,
          grade,
          score: scoreOutOfTen,
          maxScore: 10,
          attemptedCount: 10,
          unansweredCount: 0,
          percentage: overallPct,
          wordCoinsEarned: Number(data.coinsAwarded || 0),
          weakAreasHindi: overallPct < 70 ? [spec.shortTitleHindi] : [],
          strongAreasHindi: overallPct >= 70 ? [spec.shortTitleHindi] : [],
          adviceSummaryHindi:
            data.feedbackHindi || `${spec.shortTitleHindi} रचना समीक्षा पूर्ण (${overallPct}% अंक)।`,
          date: now.toLocaleDateString('hi-IN'),
          timestamp: now.toISOString(),
        });
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Katha Shilpi AI review error:', err);
      setErrorMsg('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setIsReviewing(false);
    }
  };

  const handlePrintGuideAndExamples = () => {
    const blueprintHtml = spec.blueprintLines
      .map(
        (b) => `
        <div style="margin-bottom:8px; text-align:${b.alignment === 'center' ? 'center' : 'left'};">
          <div style="font-size:11px; color:#4338ca; font-weight:700;">[${escapePrintHtml(b.labelHindi)}]</div>
          <div style="font-size:12.5px; white-space:pre-line; ${b.isBold ? 'font-weight:700;' : ''}">${escapePrintHtml(b.samplePlaceholder)}</div>
        </div>
      `
      )
      .join('');

    const examplesHtml = orderedExamples
      .map((ex, i) => {
        const blocksHtml = ex.blocks
          .map(
            (blk) => `
            <div style="margin-bottom:7px; text-align:${blk.alignment === 'center' ? 'center' : 'left'};">
              <span style="display:inline-block; font-size:10px; font-weight:700; color:#4338ca; background:#eef2ff; padding:1px 6px; border-radius:4px; margin-bottom:2px;">${escapePrintHtml(blk.tagHindi)}</span>
              <div style="font-size:12.5px; white-space:pre-line; ${blk.isHeading ? 'font-weight:800;' : ''}">${escapePrintHtml(blk.textHindi)}</div>
            </div>
          `
          )
          .join('');

        return `
          <div style="border:1px solid #cbd5e1; border-radius:10px; padding:12px 14px; margin-bottom:14px; page-break-inside:avoid;">
            <div style="font-size:13.5px; font-weight:800; color:#1e1b4b; margin-bottom:4px;">उदाहरण ${i + 1} (${escapePrintHtml(ex.gradeBand)}): ${escapePrintHtml(ex.titleHindi)}</div>
            <div style="font-size:11.5px; color:#475569; margin-bottom:8px;"><strong>प्रश्न:</strong> ${escapePrintHtml(ex.promptHindi)}</div>
            <div style="${spec.isBoxed ? 'border:2px solid #0f172a; padding:12px; background:#fff;' : 'border-left:3px solid #6366f1; padding-left:12px;'}">
              ${blocksHtml}
            </div>
            <div style="font-size:11px; color:#065f46; background:#ecfdf5; padding:6px 8px; border-radius:6px; margin-top:8px;">
              <strong>परीक्षक टिप्पणी:</strong> ${escapePrintHtml(ex.examinerNoteHindi)}
            </div>
          </div>
        `;
      })
      .join('');

    const innovativeHtml = orderedInnovativeExamples
      .map((ex, i) => {
        const blocksHtml = ex.blocks
          .map(
            (blk) => `
            <div style="margin-bottom:7px; text-align:${blk.alignment === 'center' ? 'center' : 'left'};">
              <span style="display:inline-block; font-size:10px; font-weight:700; color:#92400e; background:#fef3c7; padding:1px 6px; border-radius:4px; margin-bottom:2px;">${escapePrintHtml(blk.tagHindi)}</span>
              <div style="font-size:12.5px; white-space:pre-line; ${blk.isHeading ? 'font-weight:800;' : ''}">${escapePrintHtml(blk.textHindi)}</div>
            </div>
          `
          )
          .join('');

        return `
          <div style="border:1.5px solid #f59e0b; border-radius:10px; padding:12px 14px; margin-bottom:14px; page-break-inside:avoid; background:#fffbeb;">
            <div style="font-size:11px; font-weight:800; color:#b45309; margin-bottom:3px;">✨ नवाचारी शैली: ${escapePrintHtml(ex.innovationTechniqueHindi)} (${escapePrintHtml(ex.gradeBand)})</div>
            <div style="font-size:13.5px; font-weight:800; color:#1e1b4b; margin-bottom:4px;">नवाचारी उदाहरण ${i + 1}: ${escapePrintHtml(ex.titleHindi)}</div>
            <div style="font-size:11.5px; color:#475569; margin-bottom:8px;"><strong>प्रश्न:</strong> ${escapePrintHtml(ex.promptHindi)}</div>
            <div style="${spec.isBoxed ? 'border:2px solid #0f172a; padding:12px; background:#fff;' : 'border-left:3px solid #d97706; padding-left:12px; background:#fff; padding:10px;'}">
              ${blocksHtml}
            </div>
            <div style="font-size:11px; color:#78350f; background:#fef3c7; padding:6px 8px; border-radius:6px; margin-top:8px;">
              <strong>यह क्यों खास है:</strong> ${escapePrintHtml(ex.whyItStandsOutHindi)}
            </div>
          </div>
        `;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(spec.titleHindi)} — ICSE प्रारूप, आदर्श एवं नवाचारी उदाहरण</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc { font-family: 'Noto Sans Devanagari', Arial, sans-serif; color:#0f172a; max-width:820px; margin:0 auto; line-height:1.55; }
    h1 { font-size:18px; color:#1e1b4b; margin:0; }
    h2 { font-size:14px; color:#312e81; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:16px 0 8px 0; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; border-bottom:2px solid #4338ca; padding-bottom:10px; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        ${getPrintBrandLogosHtml(46)}
        <div>
          <h1>${escapePrintHtml(spec.titleHindi)}</h1>
          <div style="font-size:11.5px; color:#475569;">${escapePrintHtml(grade)} • ICSE पाठ्यक्रम • शब्द-सीमा: ${escapePrintHtml(currentGradeSpec.wordLimitHindi)} • अंक: ${escapePrintHtml(currentGradeSpec.marksHindi)}</div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;"><strong>शब्दशिल्प (ShabdShilp)</strong><br />कथा शिल्पी AI</div>
    </div>
    <h2>१. सटीक ICSE प्रारूप खाका (${spec.isBoxed ? 'बॉक्स अनिवार्य' : 'मानक संरेखण'})</h2>
    <div style="${spec.isBoxed ? 'border:2px solid #0f172a; padding:12px;' : 'border:1px solid #cbd5e1; padding:12px; border-radius:8px;'}">
      ${blueprintHtml}
    </div>
    <h2>२. हल किए गए आदर्श उदाहरण (Standard Model Examples)</h2>
    ${examplesHtml}
    <h2>३. ✨ नवाचारी व रचनात्मक उदाहरण (Innovative ICSE Examples)</h2>
    ${innovativeHtml}
  </div>
</body>
</html>`;

    printRawHtmlDocument(html, {
      title: `${spec.shortTitleHindi} — ICSE प्रारूप, उदाहरण व नवाचारी उदाहरण`,
      subtitle: `${grade} • ${currentGradeSpec.wordLimitHindi}`,
      filenameSlug: `katha-shilpi-${activeFormatId}`,
    });
  };

  const handlePrintExercisesSheet = () => {
    const blanksHtml = spec.fillBlanks
      .map(
        (fb, idx) => `
        <div style="border:1px solid #cbd5e1; border-radius:8px; padding:10px; margin-bottom:10px; page-break-inside:avoid;">
          <div style="font-size:11px; color:#4338ca; font-weight:700;">रिक्त स्थान ${idx + 1} (${escapePrintHtml(fb.contextLabelHindi)})</div>
          <div style="font-size:13px; margin:4px 0 6px 0;">${escapePrintHtml(fb.beforeBlankHindi)} <strong>____________</strong> ${escapePrintHtml(fb.afterBlankHindi)}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; font-size:12px;">
            ${fb.options.map((o, oi) => `<div>(${String.fromCharCode(65 + oi)}) ${escapePrintHtml(o.textHindi)}</div>`).join('')}
          </div>
        </div>
      `
      )
      .join('');

    const errorsHtml = spec.errorIdentification
      .map(
        (er, idx) => `
        <div style="border:1px solid #cbd5e1; border-radius:8px; padding:10px; margin-bottom:12px; page-break-inside:avoid;">
          <div style="font-size:12.5px; font-weight:800; color:#9f1239; margin-bottom:4px;">त्रुटि पहचान ${idx + 1}: ${escapePrintHtml(er.titleHindi)}</div>
          <div style="${er.isBoxedDraft ? 'border:1.5px solid #0f172a; padding:8px; margin-bottom:6px;' : 'background:#f8fafc; padding:8px; border-radius:6px; margin-bottom:6px;'}">
            ${er.lines.map((ln, li) => `<div style="font-size:12px; margin-bottom:3px;"><strong>(${li + 1})</strong> ${escapePrintHtml(ln.textHindi)}</div>`).join('')}
          </div>
          <div style="font-size:11.5px;"><strong>सही सुधार विकल्प:</strong></div>
          ${er.correctionOptions.map((c, ci) => `<div style="font-size:11.5px; margin-left:8px;">(${String.fromCharCode(65 + ci)}) ${escapePrintHtml(c.textHindi)}</div>`).join('')}
        </div>
      `
      )
      .join('');

    const seqEx = innovations.sequenceExercise;
    const seqHtml = `
      <div style="border:1px solid #f59e0b; border-radius:8px; padding:10px; margin-bottom:12px; page-break-inside:avoid; background:#fffbeb;">
        <div style="font-size:12.5px; font-weight:800; color:#92400e; margin-bottom:4px;">प्रारूप क्रम-निर्धारण पहेली: ${escapePrintHtml(seqEx.titleHindi)}</div>
        <div style="font-size:11.5px; color:#475569; margin-bottom:6px;">${escapePrintHtml(seqEx.instructionHindi)} (सही क्रम संख्या 1 से ${seqEx.shuffledSteps.length} लिखें)</div>
        ${seqEx.shuffledSteps
          .map(
            (st) => `<div style="font-size:12px; padding:4px 8px; background:#fff; border:1px solid #fde68a; border-radius:6px; margin-bottom:4px;">[ ___ ] <strong>${escapePrintHtml(st.labelHindi)}:</strong> ${escapePrintHtml(st.sampleSnippetHindi)}</div>`
          )
          .join('')}
      </div>
    `;

    const creativeHtml = innovations.creativeExercises
      .map(
        (cr, idx) => `
        <div style="border:1px solid #cbd5e1; border-radius:8px; padding:10px; margin-bottom:10px; page-break-inside:avoid;">
          <div style="font-size:11px; font-weight:800; color:#7c3aed;">नवाचारी चुनौती ${idx + 1}: ${escapePrintHtml(cr.challengeTypeHindi)}</div>
          <div style="font-size:11.5px; color:#475569; margin:3px 0;">${escapePrintHtml(cr.scenarioHindi)}</div>
          <div style="font-size:12.5px; font-weight:700; margin-bottom:5px;">${escapePrintHtml(cr.questionHindi)}</div>
          ${cr.options.map((o, oi) => `<div style="font-size:11.5px; margin-left:8px;">(${String.fromCharCode(65 + oi)}) ${escapePrintHtml(o.textHindi)}</div>`).join('')}
        </div>
      `
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapePrintHtml(spec.shortTitleHindi)} अभ्यास पत्र</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm; }
    .ss-print-doc { font-family: 'Noto Sans Devanagari', Arial, sans-serif; color:#0f172a; max-width:820px; margin:0 auto; line-height:1.5; }
    h1 { font-size:18px; color:#1e1b4b; margin:0; }
    h2 { font-size:14px; color:#312e81; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:16px 0 8px 0; }
  </style>
</head>
<body>
  <div class="ss-print-doc">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; border-bottom:2px solid #4338ca; padding-bottom:10px; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        ${getPrintBrandLogosHtml(46)}
        <div>
          <h1>अभ्यास कार्यपत्रक: ${escapePrintHtml(spec.titleHindi)}</h1>
          <div style="font-size:11.5px; color:#475569;">${escapePrintHtml(grade)} • ICSE प्रारूप, त्रुटि शोधन व नवाचारी चुनौतियाँ</div>
        </div>
      </div>
      <div style="text-align:right; font-size:11px; white-space:nowrap;"><strong>शब्दशिल्प (ShabdShilp)</strong><br />कथा शिल्पी AI</div>
    </div>
    <h2>भाग क — रिक्त स्थान भरो (Fill in the Blanks)</h2>
    ${blanksHtml}
    <h2>भाग ख — त्रुटि पहचान एवं सुधार (Error Identification)</h2>
    ${errorsHtml}
    <h2>भाग ग — ✨ नवाचारी अभ्यास (क्रम-निर्धारण व सृजनात्मक चुनौतियाँ)</h2>
    ${seqHtml}
    ${creativeHtml}
  </div>
</body>
</html>`;

    printRawHtmlDocument(html, {
      title: `अभ्यास पत्र: ${spec.shortTitleHindi}`,
      subtitle: `${grade} • रिक्त स्थान, त्रुटि पहचान व नवाचारी चुनौतियाँ`,
      filenameSlug: `katha-shilpi-exercises-${activeFormatId}`,
    });
  };

  const renderAuthenticExample = (ex: ModelExample) => (
    <div
      key={ex.id}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[11px] font-black border border-indigo-200">
              {ex.gradeBand}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              लगभग {ex.wordCountApprox} शब्द
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 font-hindi">
            {ex.titleHindi}
          </h4>
          {bilingualMode && (
            <p className="text-xs text-slate-500 italic">{ex.titleEnglish}</p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs sm:text-sm text-indigo-950 font-medium">
          <strong className="font-black text-indigo-800">प्रश्न: </strong>
          {ex.promptHindi}
          {bilingualMode && (
            <span className="block text-xs text-indigo-700/80 mt-1 italic">{ex.promptEnglish}</span>
          )}
          {ex.hintPoints && ex.hintPoints.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ex.hintPoints.map((hp, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-[11px] font-bold text-indigo-800"
                >
                  • {hp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Authentic Format Render (Boxed vs Left-Aligned vs Standard Prose) */}
        <div
          className={`p-5 sm:p-6 rounded-2xl transition-all space-y-3 ${
            spec.isBoxed
              ? 'border-2 border-slate-900 bg-white shadow-inner'
              : 'border border-slate-200 bg-slate-50/40'
          }`}
        >
          {spec.isBoxed && showFormatTags && (
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 text-right -mt-2 mb-1">
              [अनिवार्य आयताकार बॉक्स सीमा-रेखा / Mandatory Box Border]
            </div>
          )}

          {ex.blocks.map((blk, bIdx) => (
            <div
              key={bIdx}
              className={`space-y-1 ${blk.alignment === 'center' ? 'text-center' : 'text-left'}`}
            >
              {showFormatTags && (
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100/90 text-indigo-800 text-[10px] font-black border border-indigo-200">
                    {blk.tagHindi}
                    {bilingualMode ? ` (${blk.tagEnglish})` : ''}
                  </span>
                </div>
              )}
              <div
                className={`font-hindi text-slate-900 whitespace-pre-line leading-relaxed ${
                  blk.isHeading ? 'text-base sm:text-lg font-black' : 'text-sm sm:text-base'
                }`}
              >
                {blk.textHindi}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-black text-emerald-900">ICSE परीक्षक की टिप्पणी: </strong>
            {ex.examinerNoteHindi}
            {bilingualMode && (
              <span className="block text-emerald-800/80 italic mt-0.5">{ex.examinerNoteEnglish}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInnovativeExample = (inn: InnovativeExample, idx: number) => (
    <div
      key={inn.id}
      className="bg-white rounded-3xl border-2 border-amber-300/90 shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/70 to-indigo-50/70 border-b border-amber-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              <span>नवाचारी उदाहरण {idx + 1}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 text-[11px] font-black border border-indigo-200">
              {inn.gradeBand}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
              लगभग {inn.wordCountApprox} शब्द
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 font-hindi">
            {inn.titleHindi}
          </h4>
          {bilingualMode && (
            <p className="text-xs text-slate-600 italic">{inn.titleEnglish}</p>
          )}
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-amber-300 text-[11px] font-black text-amber-900">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>नवाचार तकनीक: {inn.innovationTechniqueHindi}</span>
            {bilingualMode && (
              <span className="font-semibold text-amber-700">({inn.innovationTechniqueEnglish})</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleWriteInnovativePrompt(inn)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <PenTool className="w-3.5 h-3.5 text-amber-300" />
          <span>इस नवाचारी शैली में लिखें</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-slate-900 font-medium">
          <strong className="font-black text-amber-900">प्रश्न: </strong>
          {inn.promptHindi}
          {bilingualMode && (
            <span className="block text-xs text-amber-800/80 mt-1 italic">{inn.promptEnglish}</span>
          )}
        </div>

        {/* Authentic ICSE Format Render preserved inside innovative examples */}
        <div
          className={`p-5 sm:p-6 rounded-2xl transition-all space-y-3 ${
            spec.isBoxed
              ? 'border-2 border-slate-900 bg-white shadow-inner'
              : 'border border-amber-200/80 bg-slate-50/40'
          }`}
        >
          {spec.isBoxed && showFormatTags && (
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 text-right -mt-2 mb-1">
              [सटीक ICSE बॉक्स प्रारूप में नवाचारी प्रस्तुति]
            </div>
          )}

          {inn.blocks.map((blk, bIdx) => (
            <div
              key={bIdx}
              className={`space-y-1 ${blk.alignment === 'center' ? 'text-center' : 'text-left'}`}
            >
              {showFormatTags && (
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[10px] font-black border border-amber-300">
                    {blk.tagHindi}
                    {bilingualMode ? ` (${blk.tagEnglish})` : ''}
                  </span>
                </div>
              )}
              <div
                className={`font-hindi text-slate-900 whitespace-pre-line leading-relaxed ${
                  blk.isHeading ? 'text-base sm:text-lg font-black' : 'text-sm sm:text-base'
                }`}
              >
                {blk.textHindi}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-black text-indigo-900">यह नवाचार क्यों प्रभावी है: </strong>
              {inn.whyItStandsOutHindi}
              {bilingualMode && (
                <span className="block text-indigo-800/80 italic mt-0.5">{inn.whyItStandsOutEnglish}</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-black text-emerald-900">ICSE परीक्षक की टिप्पणी: </strong>
              {inn.examinerNoteHindi}
              {bilingualMode && (
                <span className="block text-emerald-800/80 italic mt-0.5">{inn.examinerNoteEnglish}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={
        focusMode
          ? 'w-full max-w-none space-y-4 animate-in fade-in duration-300'
          : 'max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300'
      }
    >
      {!focusMode && (
      <>
      {/* Top Studio Hero Banner - Synced with App Theme */}
      <div
        className={`${themeConfig.featureBannerGradient} ${
          themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'
        } rounded-3xl p-6 sm:p-7 shadow-md border ${themeConfig.featureBannerBorder} relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/mail.google_a65ce30f.png"
                alt="शब्दशिल्प (ShabdShilp) Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-center bg-[#091124] border border-white/25 shadow-lg shrink-0"
              />
              <div className="space-y-1.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${
                    themeConfig.isLightBanner
                      ? 'bg-slate-950/10 border-slate-950/20 text-slate-950'
                      : 'bg-white/15 border-white/20 text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ICSE हिंदी रचना एवं लेखन स्टूडियो • {grade}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-serif-display">
                  कथा शिल्पी AI (ICSE Composition Studio)
                </h2>
              </div>
            </div>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                themeConfig.isLightBanner ? 'text-slate-900 font-medium' : 'text-slate-100/90'
              }`}
            >
              नवीनतम <strong>ICSE पाठ्यक्रम व प्रारूप</strong> के अनुसार सभी 7 विधाएँ — <strong>निबंध, कहानी, अनुच्छेद, पत्र (औपचारिक/अनौपचारिक), सूचना, डायरी और विज्ञापन</strong> — सटीक खाका, हल उदाहरण, रिक्त स्थान व त्रुटि पहचान अभ्यास तथा AI मूल्यांकन सहित।
            </p>
            {bilingualMode && (
              <p
                className={`text-xs italic ${
                  themeConfig.isLightBanner ? 'text-slate-800' : 'text-amber-200/90'
                }`}
              >
                Complete ICSE Hindi composition workbench: exact board formats, solved examples, fill-in-the-blanks, error identification, and AI English-to-Hindi / Hindi grading.
              </p>
            )}
          </div>

          <div
            className={`px-4 py-3.5 rounded-2xl border text-xs shrink-0 space-y-1.5 ${
              themeConfig.isLightBanner
                ? 'bg-white/75 border-slate-950/15 text-slate-950'
                : 'bg-black/30 border-white/15 text-white'
            }`}
          >
            <div className="font-black text-sm flex items-center gap-2">
              <Award className={`w-4 h-4 ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>सक्रिय विधा ({grade}):</span>
            </div>
            <div className="font-bold">
              {spec.shortTitleHindi} —{' '}
              <span className={themeConfig.isLightBanner ? 'text-indigo-900' : 'text-amber-300'}>
                {currentGradeSpec.statusLabelHindi}
              </span>
            </div>
            <div className="text-[11px] opacity-85">
              शब्द-सीमा: <strong>{currentGradeSpec.wordLimitHindi}</strong> • अंक: <strong>{currentGradeSpec.marksHindi}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Format Selector Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>१. लेखन विधा चुनें (Select ICSE Format — All 7 Genres)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {grade} के मुख्य विषय <span className="text-emerald-700 font-bold">● मुख्य</span> द्वारा चिह्नित हैं
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PRIMARY_GENRE_TABS.map((tab) => {
            const isSelected = primaryTab === tab.id;
            const tabSpec = KATHA_SHILPI_FORMATS[tab.defaultFormatId];
            const gradeStatus = tabSpec.gradeSpecs[grade].status;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPrimaryTab(tab.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} ${themeConfig.primaryBorder} shadow-sm`
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      gradeStatus === 'core'
                        ? isSelected && !themeConfig.isLightBanner
                          ? 'bg-amber-300'
                          : 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                    title={tabSpec.gradeSpecs[grade].statusLabelHindi}
                  />
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? themeConfig.isLightBanner
                          ? 'bg-slate-950/15 text-slate-950'
                          : 'bg-white/20 text-white'
                        : gradeStatus === 'core'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {gradeStatus === 'core' ? 'मुख्य' : 'अभ्यास'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black leading-snug font-hindi">{tab.labelHindi}</div>
                  {bilingualMode && (
                    <div
                      className={`text-[10px] leading-tight mt-0.5 truncate ${
                        isSelected
                          ? themeConfig.isLightBanner
                            ? 'text-slate-900'
                            : 'text-indigo-100'
                          : 'text-slate-500'
                      }`}
                    >
                      {tab.labelEnglish}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dedicated Formal vs Informal Toggle when Patra is Selected */}
        {primaryTab === 'patra' && (
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-slate-700">पत्र का प्रकार चुनें:</span>
              <button
                type="button"
                onClick={() => setPatraSubType('patra_formal')}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  patraSubType === 'patra_formal'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                औपचारिक पत्र (Formal Letter)
              </button>
              <button
                type="button"
                onClick={() => setPatraSubType('patra_informal')}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  patraSubType === 'patra_informal'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                अनौपचारिक पत्र (Informal Letter)
              </button>
            </div>
            <div className="text-[11px] font-semibold text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
              {patraSubType === 'patra_formal'
                ? 'नियम: "विषय:" अनिवार्य • अभिवादन नहीं • प्रधानाचार्य/संपादक/अधिकारी हेतु'
                : 'नियम: "विषय:" वर्जित • "अभिवादन" अनिवार्य • माता-पिता/मित्र/भाई-बहन हेतु'}
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {focusMode && (
        <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-black border border-indigo-200">
              {spec.shortTitleHindi}
            </span>
            <span className="text-slate-600 font-semibold">
              {grade} · शब्द-सीमा: <strong className="text-slate-900">{currentGradeSpec.wordLimitHindi}</strong> · अंक: <strong className="text-slate-900">{currentGradeSpec.marksHindi}</strong>
            </span>
          </div>
          {primaryTab === 'patra' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPatraSubType('patra_formal')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                  patraSubType === 'patra_formal'
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                औपचारिक पत्र
              </button>
              <button
                type="button"
                onClick={() => setPatraSubType('patra_informal')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                  patraSubType === 'patra_informal'
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                अनौपचारिक पत्र
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4 Sub-Tabs: Format | Examples | Exercises | AI Writer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'format' as StudioSubTab, hi: '१. सटीक प्रारूप व अंक', en: 'Format & Marks', icon: FileText },
            { id: 'examples' as StudioSubTab, hi: '२. उदाहरण व नवाचारी उदाहरण', en: 'Examples & Innovative', icon: BookOpen },
            { id: 'exercises' as StudioSubTab, hi: '३. अभ्यास व नवाचारी अभ्यास', en: 'Exercises & Drills', icon: ClipboardCheck },
            { id: 'writer' as StudioSubTab, hi: '४. AI रचना व समीक्षा', en: 'AI Writer & Review', icon: PenTool },
          ].map((st) => {
            const Icon = st.icon;
            const active = subTab === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubTab(st.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center gap-2 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-indigo-600'}`} />
                <span>{st.hi}</span>
                {bilingualMode && <span className="opacity-75 font-semibold hidden md:inline">· {st.en}</span>}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={subTab === 'exercises' ? handlePrintExercisesSheet : handlePrintGuideAndExamples}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600" />
          <span>{subTab === 'exercises' ? 'प्रिंट अभ्यास पत्र' : 'प्रिंट प्रारूप व उदाहरण'}</span>
        </button>
      </div>

      {/* ==================== TAB 1: ACCURATE ICSE FORMAT & SYLLABUS ==================== */}
      {subTab === 'format' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* Left: Authentic Visual Blueprint Sheet */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 text-[11px] font-black border border-indigo-200">
                  {spec.badgeHindi}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5 font-hindi">
                  {spec.titleHindi} — मानक ICSE प्रारूप खाका
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{spec.summaryHindi}</p>
                {bilingualMode && (
                  <p className="text-xs text-slate-500 italic mt-0.5">{spec.summaryEnglish}</p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span>संरेखण व ढाँचा नियम: {spec.alignmentRuleHindi}</span>
                {bilingualMode && (
                  <span className="block text-[11px] font-medium text-amber-800 mt-0.5">
                    {spec.alignmentRuleEnglish}
                  </span>
                )}
              </div>
            </div>

            {/* Visual Paper / Box Frame */}
            <div
              className={`p-5 sm:p-6 rounded-2xl space-y-3.5 ${
                spec.isBoxed
                  ? 'border-2 border-slate-900 bg-white shadow-inner'
                  : 'border border-slate-300 bg-slate-50/50'
              }`}
            >
              {spec.isBoxed && (
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-right -mt-2">
                  [परीक्षा कॉपी में यह संपूर्ण भाग स्पष्ट बॉक्स के अंदर लिखें]
                </div>
              )}

              {spec.blueprintLines.map((line) => (
                <div
                  key={line.id}
                  className={`p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1 ${
                    line.alignment === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  <div className="text-[11px] font-black text-indigo-700">
                    {line.labelHindi}
                    {bilingualMode && (
                      <span className="font-semibold text-slate-500"> · {line.labelEnglish}</span>
                    )}
                  </div>
                  <div
                    className={`font-hindi text-sm text-slate-900 whitespace-pre-line ${
                      line.isBold ? 'font-extrabold' : 'font-medium'
                    }`}
                  >
                    {line.samplePlaceholder}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    {line.requiredNoteHindi}
                    {bilingualMode && <span className="italic"> ({line.requiredNoteEnglish})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Class Syllabus Matrix, Marking Scheme, Do's & Don'ts */}
          <div className="lg:col-span-5 space-y-5">
            {/* Grade-Specific Requirement Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black text-slate-900">
                  ICSE कक्षा-वार पाठ्यक्रम व शब्द-सीमा (कक्षा 5–10)
                </h4>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
                <div className="font-black text-indigo-950">
                  आपकी चयनित कक्षा ({grade}): {currentGradeSpec.statusLabelHindi}
                </div>
                <div className="text-indigo-900 font-semibold">
                  शब्द-सीमा: {currentGradeSpec.wordLimitHindi} • निर्धारित अंक: {currentGradeSpec.marksHindi}
                </div>
                <div className="text-indigo-800">{currentGradeSpec.noteHindi}</div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-black">
                    <tr>
                      <th className="px-3 py-2">कक्षा</th>
                      <th className="px-3 py-2">स्थिति</th>
                      <th className="px-3 py-2">शब्द-सीमा</th>
                      <th className="px-3 py-2">अंक</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ALL_GRADES.map((g) => {
                      const gs = spec.gradeSpecs[g];
                      const activeRow = g === grade;
                      return (
                        <tr key={g} className={activeRow ? 'bg-amber-50/80 font-bold' : 'bg-white'}>
                          <td className="px-3 py-2 text-slate-900 whitespace-nowrap">{g}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                                gs.status === 'core'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {gs.statusLabelHindi}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{gs.wordLimitHindi}</td>
                          <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{gs.marksHindi}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ICSE Marking Scheme */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-slate-900">
                ICSE अंक विभाजन (Marking Rubric)
              </h4>
              <div className="space-y-2">
                {spec.markingScheme.map((ms, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{ms.partHindi}</div>
                      {bilingualMode && <div className="text-[11px] text-slate-500">{ms.partEnglish}</div>}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-black whitespace-nowrap">
                      {ms.weightHindi}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>क्या करें (ICSE Do&apos;s)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {spec.dosHindi.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>क्या न करें (Common Mistakes to Avoid)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {spec.dontsHindi.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SOLVED EXAMPLES -> INNOVATIVE EXAMPLES -> EXERCISES CTA ==================== */}
      {subTab === 'examples' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header & Format Tags Toggle */}
          <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                {spec.titleHindi} — १. आदर्श उदाहरण → २. नवाचारी उदाहरण → ३. अभ्यास
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {grade} के स्तर के अनुरूप पहले मानक बोर्ड उदाहरण देखें, फिर रचनात्मक व नवाचारी उदाहरण समझकर अभ्यास हल करें।
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFormatTags((p) => !p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showFormatTags
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {showFormatTags ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showFormatTags ? 'संरचना टैग: दिख रहे हैं' : 'संरचना टैग: छिपे हैं'}</span>
            </button>
          </div>

          {/* Part 1: Standard ICSE Solved Examples */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                १
              </span>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  आदर्श बोर्ड उदाहरण (Standard ICSE Solved Examples)
                </h4>
                <p className="text-xs text-slate-500">
                  परीक्षा में पूर्ण अंक दिलाने वाले सटीक, पारंपरिक ICSE प्रारूप मॉडल
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {orderedExamples.map((ex) => renderAuthenticExample(ex))}
            </div>
          </div>

          {/* Part 2: Innovative Examples (Immediately following Standard Examples) */}
          <div className="space-y-4 pt-4 border-t-2 border-dashed border-amber-300">
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-indigo-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  २
                </span>
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>नवाचारी व रचनात्मक उदाहरण (Innovative ICSE Examples)</span>
                  </h4>
                  <p className="text-xs text-slate-700 mt-0.5">
                    साधारण लेखन से हटकर मौलिक दृष्टिकोण, आत्मकथात्मक शैली, आधुनिक विषय व प्रभावशाली प्रस्तुति वाले उदाहरण — पूर्णतः सटीक ICSE प्रारूप के भीतर!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {orderedInnovativeExamples.map((inn, idx) => renderInnovativeExample(inn, idx))}
            </div>
          </div>

          {/* Part 3 CTA: Proceed directly to Exercises */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                अगला चरण — अभ्यास व नवाचारी चुनौतियाँ
              </div>
              <h4 className="text-base sm:text-lg font-black">
                आदर्श और नवाचारी उदाहरण देख लिए? अब अपनी प्रारूप व रचनात्मक समझ परखें!
              </h4>
              <p className="text-xs text-slate-300">
                {spec.shortTitleHindi} के {exerciseStats.total} इंटरैक्टिव अभ्यास (रिक्त स्थान, त्रुटि पहचान, क्रम-निर्धारण पहेली व सृजनात्मक चुनौतियाँ) हल करें।
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubTab('exercises')}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
            >
              <span>३. अभ्यास व नवाचारी अभ्यास पर जाएँ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: FILL-IN-THE-BLANKS, ERROR IDENTIFICATION & INNOVATIVE EXERCISES ==================== */}
      {subTab === 'exercises' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Fair Attempt Summary Banner */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {spec.shortTitleHindi} — इंटरैक्टिव अभ्यास व नवाचारी चुनौतियाँ
              </h3>
              <p className="text-xs text-slate-600">
                प्रत्येक सही हल किए प्रश्न पर आपको केवल एक बार <strong>WordCoins</strong> मिलते हैं; छूटे प्रश्न रिपोर्ट में &lsquo;अनुत्तरित (Skipped)&rsquo; दिखेंगे।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 tabular-nums">
                प्रयास: {exerciseStats.attempted}/{exerciseStats.total} • सही: {exerciseStats.correct}
                {exerciseStats.skipped > 0 && ` • छूटे: ${exerciseStats.skipped}`}
              </div>
              {onRecordReport && (
                <button
                  type="button"
                  disabled={exerciseStats.attempted === 0}
                  onClick={handleSaveExerciseReport}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  प्रगति रिपोर्ट सहेजें
                </button>
              )}
              <button
                type="button"
                onClick={handleResetExercises}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>
          </div>

          {savedReportToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{savedReportToast}</span>
            </div>
          )}

          {/* Section A: Fill in the Blanks */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black">
                    क
                  </span>
                  <span>रिक्त स्थान भरो (Fill in the Blanks — ICSE Format & Language)</span>
                </h4>
                {bilingualMode && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the accurate ICSE format term, salutation, or cohesive connector for each blank (+1 WordCoin each).
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spec.fillBlanks.map((fb, idx) => {
                const chosen = fillSelections[fb.id];
                const isChecked = Boolean(fillChecked[fb.id]);
                const isCorrect = isChecked && chosen === fb.correctIndex;
                const hintOpen = Boolean(fillHintsOpen[fb.id]);

                return (
                  <div
                    key={fb.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isChecked
                        ? isCorrect
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-rose-50/60 border-rose-300'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                          {idx + 1}. {fb.contextLabelHindi}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFillHintsOpen((prev) => ({ ...prev, [fb.id]: !prev[fb.id] }))
                          }
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>संकेत</span>
                        </button>
                      </div>

                      {hintOpen && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                          <strong>संकेत:</strong> {fb.hintHindi}
                        </div>
                      )}

                      <p className="text-sm font-hindi text-slate-900 leading-relaxed">
                        {fb.beforeBlankHindi}
                        <span
                          className={`inline-block px-2.5 py-0.5 mx-1 rounded-lg border-b-2 font-black ${
                            typeof chosen === 'number'
                              ? isChecked
                                ? isCorrect
                                  ? 'bg-emerald-100 border-emerald-600 text-emerald-900'
                                  : 'bg-rose-100 border-rose-600 text-rose-900'
                                : 'bg-indigo-100 border-indigo-600 text-indigo-900'
                              : 'bg-white border-slate-400 text-slate-400'
                          }`}
                        >
                          {typeof chosen === 'number'
                            ? fb.options[chosen].textHindi
                            : '__________'}
                        </span>
                        {fb.afterBlankHindi}
                      </p>

                      <div className="grid grid-cols-1 gap-1.5">
                        {fb.options.map((opt, oIdx) => {
                          const selected = chosen === oIdx;
                          const rightOpt = isChecked && oIdx === fb.correctIndex;
                          const wrongChosen = isChecked && selected && !rightOpt;

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isChecked}
                              onClick={() => handleSelectFillOption(fb.id, oIdx)}
                              className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                rightOpt
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : wrongChosen
                                  ? 'bg-rose-600 text-white border-rose-700'
                                  : selected
                                  ? 'bg-indigo-600 text-white border-indigo-700'
                                  : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200'
                              }`}
                            >
                              <span>
                                ({String.fromCharCode(65 + oIdx)}) {opt.textHindi}
                                {bilingualMode && (
                                  <span className="opacity-80 font-normal"> · {opt.textEnglish}</span>
                                )}
                              </span>
                              {rightOpt && <Check className="w-4 h-4 shrink-0" />}
                              {wrongChosen && <XCircle className="w-4 h-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={typeof chosen !== 'number'}
                        onClick={() => handleVerifyFillBlank(fb.id)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                      >
                        उत्तर जाँचें (Verify)
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800 space-y-0.5">
                        <div className={`font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isCorrect ? '✅ बिल्कुल सही! (+1 WordCoin)' : '❌ अशुद्ध चयन — नियम समझें:'}
                        </div>
                        <div>{fb.explanationHindi}</div>
                        {bilingualMode && <div className="text-slate-500 italic">{fb.explanationEnglish}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Error Identification & Correction */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-black">
                  ख
                </span>
                <span>त्रुटि पहचान एवं सुधार (Error Identification & Correction)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                चरण १: नीचे दिए गए अशुद्ध प्रारूप में <strong>गलत पंक्ति</strong> पर क्लिक करें। चरण २: <strong>सही ICSE सुधार</strong> चुनकर जाँचें (+2 WordCoins प्रति प्रश्न)।
              </p>
            </div>

            <div className="space-y-5">
              {spec.errorIdentification.map((er, idx) => {
                const chosenLine = errLineSelections[er.id];
                const chosenFix = errFixSelections[er.id];
                const isChecked = Boolean(errChecked[er.id]);
                const lineRight = isChecked && chosenLine === er.errorLineIndex;
                const fixRight = isChecked && chosenFix === er.correctCorrectionIndex;
                const allRight = lineRight && fixRight;

                return (
                  <div
                    key={er.id}
                    className={`p-5 rounded-3xl border space-y-4 ${
                      isChecked
                        ? allRight
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-rose-50/40 border-rose-300'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black mr-2">
                          त्रुटि अभ्यास {idx + 1} • {er.gradeBand}
                        </span>
                        <h5 className="text-sm sm:text-base font-black text-slate-900 inline">
                          {er.titleHindi}
                        </h5>
                        <p className="text-xs text-slate-600 mt-0.5">{er.instructionHindi}</p>
                      </div>
                    </div>

                    {/* Step 1: Clickable Draft Lines */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-black text-indigo-800 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" />
                        <span>चरण १: अशुद्ध पंक्ति पहचानें (Click the flawed line):</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl bg-white space-y-2 ${
                          er.isBoxedDraft
                            ? 'border-2 border-slate-800'
                            : 'border border-slate-300'
                        }`}
                      >
                        {er.lines.map((ln, li) => {
                          const selected = chosenLine === li;
                          const isActualErrorLine = isChecked && li === er.errorLineIndex;
                          const isFalsePositive = isChecked && selected && !isActualErrorLine;

                          return (
                            <button
                              key={ln.id}
                              type="button"
                              disabled={isChecked}
                              onClick={() =>
                                setErrLineSelections((prev) => ({ ...prev, [er.id]: li }))
                              }
                              className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm font-hindi transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                isActualErrorLine
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                                  : isFalsePositive
                                  ? 'bg-rose-100 border-rose-500 text-rose-950'
                                  : selected
                                  ? 'bg-amber-100 border-amber-500 text-slate-950 font-bold ring-1 ring-amber-400'
                                  : 'bg-slate-50/70 hover:bg-indigo-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div>
                                <span className="font-black text-indigo-700 mr-2">
                                  [{li + 1}{ln.tagHindi ? ` · ${ln.tagHindi}` : ''}]
                                </span>
                                <span>{ln.textHindi}</span>
                              </div>
                              {isActualErrorLine && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-700 text-white shrink-0">
                                  यहाँ त्रुटि थी
                                </span>
                              )}
                              {selected && !isChecked && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-600 text-white shrink-0">
                                  चयनित
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Select Accurate Revision */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-black text-indigo-800">
                        चरण २: उस त्रुटि का सटीक ICSE सुधार चुनें (Select accurate correction):
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {er.correctionOptions.map((cOpt, ci) => {
                          const selected = chosenFix === ci;
                          const rightChoice = isChecked && ci === er.correctCorrectionIndex;
                          const wrongChoice = isChecked && selected && !rightChoice;

                          return (
                            <button
                              key={ci}
                              type="button"
                              disabled={isChecked}
                              onClick={() =>
                                setErrFixSelections((prev) => ({ ...prev, [er.id]: ci }))
                              }
                              className={`w-full text-left p-3 rounded-xl border text-xs font-hindi transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                rightChoice
                                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                                  : wrongChoice
                                  ? 'bg-rose-600 text-white border-rose-700'
                                  : selected
                                  ? 'bg-indigo-600 text-white border-indigo-700 font-bold'
                                  : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200'
                              }`}
                            >
                              <span className="whitespace-pre-line">
                                ({String.fromCharCode(65 + ci)}) {cOpt.textHindi}
                                {bilingualMode && (
                                  <span className="block text-[11px] opacity-80 font-sans mt-0.5">
                                    {cOpt.textEnglish}
                                  </span>
                                )}
                              </span>
                              {rightChoice && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={typeof chosenLine !== 'number' || typeof chosenFix !== 'number'}
                        onClick={() => handleVerifyErrorItem(er.id)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                      >
                        त्रुटि और सुधार जाँचें (Check Answer)
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                        <div className={`font-black ${allRight ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {allRight
                            ? '🎉 बिल्कुल सटीक! आपने गलत पंक्ति और सही ICSE सुधार दोनों पहचाने (+2 WordCoins)'
                            : `⚠️ ${!lineRight ? 'गलत पंक्ति चयनित हुई। ' : ''}${!fixRight ? 'सुधार विकल्प अशुद्ध था। ' : ''}नियम देखें:`}
                        </div>
                        <p>{er.explanationHindi}</p>
                        {bilingualMode && <p className="text-slate-500 italic">{er.explanationEnglish}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: Innovative Exercises (Format Sequencer + Creative Challenges) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/90 shadow-sm space-y-6">
            <div className="border-b border-amber-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                  ग
                </span>
                <span>✨ नवाचारी अभ्यास (Innovative Format Sequencer &amp; Creative Challenges)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                केवल रटने के बजाय प्रारूप के भागों को सही क्रम में सजाएँ और सृजनात्मक रूपांतरण चुनौतियाँ हल करें!
              </p>
            </div>

            {/* C.1: Click-to-Order Sequence Puzzle */}
            {(() => {
              const seqEx = innovations.sequenceExercise;
              const placedIds = seqOrders[seqEx.id] || [];
              const isChecked = Boolean(seqChecked[seqEx.id]);
              const seqRight = isChecked && isSequenceCorrect(seqEx.id);
              const stepById = new Map(seqEx.shuffledSteps.map((s) => [s.id, s]));
              const sortedCorrectSteps = [...seqEx.shuffledSteps].sort(
                (a, b) => a.correctOrder - b.correctOrder
              );

              return (
                <div
                  className={`p-5 rounded-3xl border space-y-4 ${
                    isChecked
                      ? seqRight
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-rose-50/40 border-rose-300'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 text-[10px] font-black mr-2 inline-flex items-center gap-1">
                        <ListOrdered className="w-3 h-3" />
                        <span>क्रम-निर्धारण पहेली • {seqEx.gradeBand}</span>
                      </span>
                      <h5 className="text-sm sm:text-base font-black text-slate-900 inline">
                        {seqEx.titleHindi}
                      </h5>
                      <p className="text-xs text-slate-600 mt-1">{seqEx.instructionHindi}</p>
                      {bilingualMode && (
                        <p className="text-[11px] text-slate-500 italic">{seqEx.instructionEnglish}</p>
                      )}
                    </div>

                    {!isChecked && placedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleClearSequence(seqEx.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        क्रम खाली करें
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Shuffled Source Cards */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-black text-indigo-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>चरण १: इन अव्यवस्थित खंडों पर सही क्रम से क्लिक करें:</span>
                      </div>
                      <div className="space-y-2">
                        {seqEx.shuffledSteps.map((st) => {
                          const orderPos = placedIds.indexOf(st.id);
                          const isPlaced = orderPos !== -1;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              disabled={isChecked}
                              onClick={() => handleToggleSequenceStep(seqEx.id, st.id)}
                              className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                isPlaced
                                  ? 'bg-indigo-100/80 border-indigo-400 text-indigo-950 opacity-75'
                                  : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-900 shadow-2xs'
                              }`}
                            >
                              <div>
                                <div className="font-black text-indigo-800">{st.labelHindi}</div>
                                <div className="font-hindi text-slate-700 mt-0.5">{st.sampleSnippetHindi}</div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                                  isPlaced
                                    ? 'bg-indigo-700 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isPlaced ? `#${orderPos + 1} (चयनित)` : '+ जोड़ें'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Student's Ordered Format Preview */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-black text-amber-900">
                        चरण २: आपका निर्मित ICSE प्रारूप ({placedIds.length}/{seqEx.shuffledSteps.length}):
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border-2 border-dashed border-slate-300 min-h-[210px] space-y-2">
                        {placedIds.length === 0 ? (
                          <div className="text-xs text-slate-400 text-center py-14">
                            बाईं ओर से प्रारूप के भागों को सही ICSE क्रम में चुनें...
                          </div>
                        ) : (
                          placedIds.map((sid, idx) => {
                            const st = stepById.get(sid);
                            if (!st) return null;
                            const stepMatches = isChecked && st.correctOrder === idx;
                            const stepMismatch = isChecked && st.correctOrder !== idx;
                            return (
                              <button
                                key={sid}
                                type="button"
                                disabled={isChecked}
                                onClick={() => handleToggleSequenceStep(seqEx.id, sid)}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                                  stepMatches
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                                    : stepMismatch
                                    ? 'bg-rose-100 border-rose-500 text-rose-950'
                                    : 'bg-slate-50 hover:bg-rose-50 border-slate-200 cursor-pointer'
                                }`}
                              >
                                <div>
                                  <span className="font-black text-indigo-800 mr-1.5">
                                    {idx + 1}. {st.labelHindi}:
                                  </span>
                                  <span className="font-hindi text-slate-800">{st.sampleSnippetHindi}</span>
                                </div>
                                {!isChecked && (
                                  <span className="text-[10px] text-slate-400 shrink-0">हटाएँ</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {!isChecked ? (
                    <button
                      type="button"
                      disabled={placedIds.length !== seqEx.shuffledSteps.length}
                      onClick={() => handleVerifySequence(seqEx.id)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                    >
                      प्रारूप क्रम जाँचें (+2 WordCoins)
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
                      <div className={`font-black ${seqRight ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {seqRight
                          ? '🎉 शाबाश! आपने ICSE प्रारूप के सभी अंग बिल्कुल सही क्रम में सजाए! (+2 WordCoins)'
                          : '⚠️ क्रम में त्रुटि थी। सटीक ICSE क्रम नीचे देखें:'}
                      </div>
                      <p className="text-slate-800">{seqEx.explanationHindi}</p>
                      {!seqRight && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                          <div className="font-black text-emerald-900 text-[11px]">सटीक क्रम:</div>
                          {sortedCorrectSteps.map((cs, ci) => (
                            <div key={cs.id} className="text-[11px] text-emerald-950">
                              <strong>{ci + 1}. {cs.labelHindi}</strong> — {cs.sampleSnippetHindi}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* C.2: Creative Transformation & Hook Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {innovations.creativeExercises.map((cr, idx) => {
                const chosen = creativeSelections[cr.id];
                const isChecked = Boolean(creativeChecked[cr.id]);
                const isRight = isChecked && chosen === cr.correctIndex;

                return (
                  <div
                    key={cr.id}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                      isChecked
                        ? isRight
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-rose-50/60 border-rose-300'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-black border border-purple-200">
                          सृजनात्मक चुनौती {idx + 1}: {cr.challengeTypeHindi}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{cr.gradeBand}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-hindi">
                        {cr.scenarioHindi}
                        {bilingualMode && (
                          <span className="block text-[11px] text-slate-500 italic mt-0.5 font-sans">
                            {cr.scenarioEnglish}
                          </span>
                        )}
                      </div>

                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {cr.questionHindi}
                      </div>

                      <div className="space-y-1.5">
                        {cr.options.map((opt, oi) => {
                          const selected = chosen === oi;
                          const rightOpt = isChecked && oi === cr.correctIndex;
                          const wrongChosen = isChecked && selected && !rightOpt;

                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={isChecked}
                              onClick={() =>
                                setCreativeSelections((prev) => ({ ...prev, [cr.id]: oi }))
                              }
                              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-hindi transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                rightOpt
                                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                                  : wrongChosen
                                  ? 'bg-rose-600 text-white border-rose-700'
                                  : selected
                                  ? 'bg-indigo-600 text-white border-indigo-700 font-bold'
                                  : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-200'
                              }`}
                            >
                              <span>
                                ({String.fromCharCode(65 + oi)}) {opt.textHindi}
                                {bilingualMode && (
                                  <span className="block text-[10px] opacity-80 font-sans mt-0.5">
                                    {opt.textEnglish}
                                  </span>
                                )}
                              </span>
                              {rightOpt && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                              {wrongChosen && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={typeof chosen !== 'number'}
                        onClick={() => handleVerifyCreative(cr.id)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                      >
                        चुनौती जाँचें (+1 WordCoin)
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800 space-y-0.5">
                        <div className={`font-black ${isRight ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isRight ? '✨ बेहतरीन रचनात्मक चयन! (+1 WordCoin)' : '❌ यह विकल्प कम प्रभावी था — कारण देखें:'}
                        </div>
                        <div>{cr.explanationHindi}</div>
                        {bilingualMode && <div className="text-slate-500 italic">{cr.explanationEnglish}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: AI WRITER & HANDWRITTEN OCR GRADER ==================== */}
      {subTab === 'writer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Prompt Starters, Homework Selector & Mode Toggle */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {spec.titleHindi} — कथा शिल्पी AI लेखन व हस्तलिखित समीक्षा स्टूडियो
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  चाहें तो सीधे टाइप करें या अपनी <strong>हस्तलिखित कॉपी (JPG, PNG, PDF)</strong> अपलोड करके सटीक OCR ट्रांसक्रिप्शन, व्याकरण-वर्तनी, प्रारूप व शब्दावली समीक्षा पाएँ।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setWriterMode('typed');
                      setErrorMsg(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      writerMode === 'typed'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>टाइपिंग (Typed)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWriterMode('handwritten');
                      setErrorMsg(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      writerMode === 'handwritten'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>हस्तलिखित कॉपी अपलोड</span>
                  </button>
                </div>

                {writerMode === 'typed' && (
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setInputLanguage('english')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        inputLanguage === 'english'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      English → Hindi
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputLanguage('hindi')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        inputLanguage === 'hindi'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      हिंदी में लिखें
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Assigned Creative Homework Selector (when active homeworks exist) */}
            {assignedHomeworks.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4 text-indigo-700" />
                    <span>शिक्षक द्वारा दिया गया गृहकार्य चुनें (Link Homework Submission — Optional):</span>
                  </div>
                  <select
                    value={selectedHomeworkId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedHomeworkId(nextId);
                      const hw = assignedHomeworks.find((h) => h.id === nextId);
                      if (hw) {
                        setCompositionTitle(hw.titleHindi);
                        setSelectedPromptHint(
                          `${hw.instructionsHindi} (शब्द-सीमा: ~${hw.wordLimit} | अंतिम तिथि: ${hw.dueDate})`
                        );
                      }
                    }}
                    className="text-xs font-bold bg-white border border-indigo-300 rounded-xl px-3 py-1.5 text-slate-900 cursor-pointer"
                  >
                    <option value="">स्वतंत्र अभ्यास (Free Practice — Not Linked)</option>
                    {assignedHomeworks.map((hw) => (
                      <option key={hw.id} value={hw.id}>
                        {hw.titleHindi} ({hw.dueDate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Quick Exam Prompts (Typed Mode) */}
            {writerMode === 'typed' && (
              <div className="space-y-2">
                <div className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>अभ्यास प्रश्न चुनें (Optional Quick ICSE Prompts):</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {spec.writerPrompts.map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => handleLoadWriterPrompt(wp.id)}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-300 text-left transition-all cursor-pointer flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          {wp.gradeBand}
                        </span>
                        <div className="text-xs font-black text-slate-900 mt-1">{wp.titleHindi}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{wp.promptHindi}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedPromptHint && (
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-medium">
                <strong>चयनित निर्देश / प्रश्न:</strong> {selectedPromptHint}
              </div>
            )}

            {/* Required Format Elements Reminder Strip */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-1.5">
              <div className="text-[11px] font-black text-amber-900">
                इस विधा के अनिवार्य ICSE प्रारूप बिंदु (लक्ष्य शब्द-सीमा: {currentGradeSpec.wordLimitHindi}):
              </div>
              <div className="flex flex-wrap gap-2">
                {spec.formatChecklistItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-[11px] font-bold text-slate-800"
                  >
                    ✓ {item.labelHindi}
                    {bilingualMode ? ` (${item.labelEnglish})` : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="flex items-center justify-between gap-3 flex-wrap pb-2 border-b border-slate-100">
              <div className="flex-1 min-w-[220px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {writerMode === 'handwritten' || inputLanguage === 'hindi'
                    ? 'शीर्षक / विषय (Title):'
                    : 'Title / Topic in English (Optional):'}
                </label>
                <input
                  type="text"
                  value={compositionTitle}
                  onChange={(e) => setCompositionTitle(e.target.value)}
                  placeholder={
                    writerMode === 'handwritten' || inputLanguage === 'hindi'
                      ? `जैसे: ${spec.examples[0]?.titleHindi || 'मेरा विषय'}`
                      : `e.g. ${spec.examples[0]?.titleEnglish || 'My Composition'}`
                  }
                  className="w-full text-base font-bold text-slate-900 border-b border-slate-300 focus:border-indigo-600 focus:outline-hidden pb-1 bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                {writerMode === 'typed' && (
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 tabular-nums">
                    {wordCount} शब्द (लक्ष्य: {currentGradeSpec.wordLimitHindi})
                  </span>
                )}
                {(compositionText || compositionTitle || reviewResult || uploadedFile) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompositionTitle('');
                      setCompositionText('');
                      setUploadedFile(null);
                      setReviewResult(null);
                      setErrorMsg(null);
                      setSubmissionSavedBanner(null);
                      setSelectedPromptHint(null);
                    }}
                    className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    title="साफ़ करें (Clear)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {writerMode === 'typed' ? (
              <textarea
                value={compositionText}
                onChange={(e) => setCompositionText(e.target.value)}
                rows={10}
                placeholder={
                  inputLanguage === 'hindi'
                    ? `यहाँ ${spec.shortTitleHindi} के सटीक ICSE प्रारूप में अपनी रचना लिखें...`
                    : `Write your ${spec.titleEnglish} in English here... AI will translate it accurately into ICSE Hindi format and evaluate it.`
                }
                className="w-full text-sm sm:text-base p-4 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/40 text-slate-900 leading-relaxed placeholder:text-slate-400 font-hindi"
              />
            ) : (
              /* HANDWRITTEN UPLOAD DROPZONE & PREVIEW */
              <div className="space-y-4">
                <label className="block border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                    onChange={handleHandwrittenFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    अपनी हस्तलिखित हिंदी कॉपी अपलोड करें (Upload Handwritten Work)
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    समर्थित प्रारूप: <strong>JPG, PNG या PDF</strong> (अधिकतम 6 MB)। साफ़ रोशनी में ली गई फ़ोटो चुनें।
                  </p>
                </label>

                {uploadedFile && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {uploadedFile.mimeType.startsWith('image/') ? (
                        <img
                          src={uploadedFile.dataUrl}
                          alt="Uploaded handwritten preview"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 flex flex-col items-center justify-center text-[11px] font-black shrink-0">
                          <FileText className="w-6 h-6 mb-1" />
                          <span>PDF</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {uploadedFile.fileName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {(uploadedFile.sizeBytes / 1024).toFixed(0)} KB · {uploadedFile.mimeType}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">
                          ✓ OCR विश्लेषण हेतु तैयार
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer self-start sm:self-center"
                    >
                      हटाएँ
                    </button>
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submissionSavedBanner && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submissionSavedBanner}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                प्रारूप की पूर्णता, शब्द-सीमा व मौलिक गुणवत्ता के आधार पर <strong>1–25 WordCoins</strong> अर्जित करें।
              </div>
              {writerMode === 'typed' ? (
                <button
                  type="button"
                  onClick={handleAnalyzeComposition}
                  disabled={isReviewing || wordCount < 5}
                  className={`w-full sm:w-auto px-6 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} ${themeConfig.primaryTextOnBg} font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isReviewing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>ICSE प्रारूप व गुणवत्ता जाँच हो रही है...</span>
                    </>
                  ) : (
                    <>
                      <Languages className="w-4 h-4" />
                      <span>
                        {inputLanguage === 'english'
                          ? 'ICSE हिंदी में अनुवाद व समीक्षा पाएँ'
                          : 'वर्तनी, प्रारूप व अंक समीक्षा पाएँ'}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAnalyzeHandwritten}
                  disabled={isReviewing || !uploadedFile}
                  className={`w-full sm:w-auto px-6 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} ${themeConfig.primaryTextOnBg} font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isReviewing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>हस्तलिखित OCR व समीक्षा हो रही है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>हस्तलिखित कॉपी पढ़वाएँ व विस्तृत समीक्षा पाएँ</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* AI Review Results Card */}
          {reviewResult && (
            <div
              ref={resultRef}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-indigo-200/80 shadow-md space-y-6 animate-in fade-in duration-300"
            >
              {/* Top Score & Coins Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>{reviewResult.level}</span>
                  </div>
                  <h4 className="text-xl font-black text-white">
                    {spec.shortTitleHindi} — {reviewResult.submissionMode === 'handwritten' ? 'हस्तलिखित OCR एवं ICSE मूल्यांकन' : 'ICSE मूल्यांकन एवं परिष्कृत रूप तैयार है!'}
                  </h4>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-indigo-200">
                    <span>
                      कुल अंक: <strong className="text-amber-300 text-sm">{reviewResult.overallScore}/100</strong>
                    </span>
                    <span>•</span>
                    <span>प्रारूप: <strong>{reviewResult.rubricScores.format}/10</strong></span>
                    <span>•</span>
                    <span>विषयवस्तु: <strong>{reviewResult.rubricScores.content}/10</strong></span>
                    <span>•</span>
                    <span>भाषा-वर्तनी: <strong>{reviewResult.rubricScores.language}/10</strong></span>
                  </div>
                </div>

                <div className="bg-black/30 border border-amber-400/40 px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
                  <Coins className="w-7 h-7 text-amber-400" />
                  <div>
                    <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">
                      WordCoins पुरस्कार
                    </div>
                    <div className="text-2xl font-black text-amber-300">+{reviewResult.coinsAwarded} Coins</div>
                  </div>
                </div>
              </div>

              {/* 1. Transcribed Text (from Handwritten OCR) */}
              {reviewResult.transcribedText && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h5 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-700" />
                      <span>१. पढ़ा गया हस्तलिखित पाठ (Transcribed Text — As Read by OCR)</span>
                    </h5>
                    <span className="text-[11px] font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {reviewResult.wordCount} शब्द पढ़े गए
                    </span>
                  </div>
                  <div className="text-sm sm:text-base text-slate-900 font-hindi leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-amber-200">
                    {reviewResult.transcribedText}
                  </div>
                </div>
              )}

              {/* 2. Grammar & Spelling Check (Vyakaran aur Vartani) */}
              {reviewResult.spellingCorrections && reviewResult.spellingCorrections.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
                  <h5 className="text-xs font-black uppercase tracking-wider text-rose-900">
                    २. व्याकरण व वर्तनी जाँच (Vyakaran aur Vartani — Matra &amp; Grammar Fixes)
                  </h5>
                  <div className="space-y-2">
                    {reviewResult.spellingCorrections.map((sc, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-rose-100 text-xs">
                        <span className="line-through text-rose-700 font-bold mr-2">{sc.originalWord}</span>
                        <span className="text-emerald-700 font-black">→ {sc.correctedWord}</span>
                        <div className="text-slate-600 mt-0.5">{sc.explanationHindi}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Structure & Format (Praroop) */}
              {(reviewResult.structureFeedback || reviewResult.formatChecklist.length > 0) && (
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200">
                  <h5 className="text-xs font-black uppercase tracking-wider text-indigo-900">
                    ३. संरचना व प्रारूप मूल्यांकन (Structure &amp; ICSE Praroop)
                  </h5>
                  {reviewResult.structureFeedback && (
                    <p className="text-xs sm:text-sm text-slate-800 font-hindi leading-relaxed bg-white p-3.5 rounded-xl border border-indigo-100">
                      {reviewResult.structureFeedback}
                    </p>
                  )}
                  {reviewResult.formatChecklist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {reviewResult.formatChecklist.map((fc, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                            fc.present
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50 border-amber-200 text-amber-950'
                          }`}
                        >
                          {fc.present ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-black">
                              {fc.elementHindi}
                              {bilingualMode && <span className="font-semibold opacity-75"> ({fc.elementEnglish})</span>}
                            </div>
                            <div className="text-[11px] opacity-90 mt-0.5">{fc.noteHindi}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Vocabulary & Expression (Shabdavali aur Bhav) */}
              {Array.isArray(reviewResult.vocabularySuggestions) &&
                reviewResult.vocabularySuggestions.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2.5">
                    <h5 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>४. शब्दावली व मुहावरे सुझाव (Shabdavali aur Bhav)</span>
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {reviewResult.vocabularySuggestions.map((vs, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1"
                        >
                          <div className="font-black text-emerald-900">
                            ✨ {vs.muhavaraOrSynonym}
                          </div>
                          {vs.originalHindi && (
                            <div className="text-[11px] text-slate-600">
                              <span className="line-through text-rose-600">{vs.originalHindi}</span> →{' '}
                              <strong className="text-emerald-800">{vs.upgradedHindi}</strong>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-700">{vs.usageNoteHindi}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Translated / Corrected ICSE Formatted Output */}
              <div
                className={`p-5 sm:p-6 rounded-2xl space-y-2.5 ${
                  spec.isBoxed
                    ? 'border-2 border-slate-900 bg-white shadow-inner'
                    : 'bg-slate-50/80 border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wider text-indigo-800">
                  <span className="flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-indigo-600" />
                    <span>
                      {reviewResult.submissionMode === 'handwritten'
                        ? 'परिष्कृत एवं त्रुटि-मुक्त ICSE हिंदी प्रारूप'
                        : inputLanguage === 'english'
                        ? 'ICSE प्रारूप में हिंदी अनुवाद'
                        : 'शुद्ध व परिष्कृत हिंदी रचना'}
                    </span>
                  </span>
                  {spec.isBoxed && (
                    <span className="text-[10px] text-slate-500 font-bold">[बॉक्स प्रारूप]</span>
                  )}
                </div>
                {reviewResult.hindiTitle && (
                  <h5
                    className={`text-lg font-black text-slate-900 font-hindi ${
                      activeFormatId === 'patra_formal' || activeFormatId === 'patra_informal'
                        ? 'text-left'
                        : 'text-center'
                    }`}
                  >
                    {reviewResult.hindiTitle}
                  </h5>
                )}
                <div className="text-sm sm:text-base text-slate-800 font-hindi leading-relaxed whitespace-pre-line">
                  {reviewResult.hindiTranslation}
                </div>
              </div>

              {/* 5. Overall Feedback, Strengths & Improvement Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>५. समग्र समीक्षा व क्रियात्मक सुझाव (Overall Review)</span>
                  </h5>
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                    {reviewResult.feedbackHindi}
                  </p>
                  {bilingualMode && reviewResult.feedbackEnglish && (
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      {reviewResult.feedbackEnglish}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  {reviewResult.strengthsHindi.length > 0 && (
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>खूबियाँ (Strengths)</span>
                      </h5>
                      <ul className="text-xs space-y-1 text-slate-800 list-disc list-inside">
                        {reviewResult.strengthsHindi.map((s, idx) => (
                          <li key={idx}>
                            {s}
                            {bilingualMode && reviewResult.strengthsEnglish[idx] && (
                              <span className="text-slate-500"> ({reviewResult.strengthsEnglish[idx]})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {reviewResult.improvementTipsHindi.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <h5 className="text-xs font-black uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>सुधार के सुझाव (Actionable Tips)</span>
                      </h5>
                      <ul className="text-xs space-y-1 text-slate-800 list-disc list-inside">
                        {reviewResult.improvementTipsHindi.map((tip, idx) => (
                          <li key={idx}>
                            {tip}
                            {bilingualMode && reviewResult.improvementTipsEnglish[idx] && (
                              <span className="text-slate-500"> ({reviewResult.improvementTipsEnglish[idx]})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
