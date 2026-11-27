import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Coins,
  Download,
  FileCheck,
  Languages,
  Loader2,
  MousePointerClick,
  PenTool,
  Printer,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  ComprehensionShortQuestion,
  CreativeSubmissionRecord,
  GradeLevel,
  InteractiveWorkbookDefinition,
  SavedReportSummary,
  WorkbookAttemptRecord,
} from '../types';
import {
  InteractiveParagraphQuestion,
  evaluateInteractiveParagraphAnswer,
} from './InteractiveParagraphQuestion';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import {
  downloadInteractiveWorkbookDocument,
  printInteractiveWorkbookDocument,
} from '../utils/printWorksheet';

interface ShortAnswerReviewState {
  hindiTranslation: string;
  status: 'correct' | 'partial' | 'incorrect';
  isCorrect: boolean;
  whatWasWrongHindi?: string;
  correctAnswerHindi?: string;
  explanationHindi?: string;
}

interface CreativeEvalState {
  hindiTitle: string;
  hindiTranslation: string;
  overallScore: number;
  formatScore: number;
  contentScore: number;
  languageScore: number;
  level: string;
  feedbackHindi: string;
  grammarErrors: { originalWord: string; correctedWord: string; explanationHindi: string }[];
}

interface InteractiveWorkbookRunnerProps {
  workbook: InteractiveWorkbookDefinition;
  grade: GradeLevel;
  bilingualMode: boolean;
  studentName?: string;
  studentEmail?: string;
  onReturn: () => void;
  onAddWordCoins: (coins: number) => void;
  onRecordWrongAnswer?: (
    topicOrId: string,
    topicNameHindi?: string,
    topicNameEnglish?: string,
    questionText?: string
  ) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  onRecordWorkbookAttempt?: (attempt: WorkbookAttemptRecord) => void;
  onCreativeSubmissionSaved?: (submission: CreativeSubmissionRecord) => void;
}

function evaluateShortAnswerLocally(
  sq: ComprehensionShortQuestion,
  answerText: string
): ShortAnswerReviewState {
  const clean = answerText.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const sampleTokens = (sq.sampleAnswerHindi + ' ' + sq.sampleAnswerEnglish)
    .toLowerCase()
    .replace(/[।,!?;:'"“”()[\]]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  const ansLower = clean.toLowerCase();
  const overlapCount = sampleTokens.filter((t) => ansLower.includes(t)).length;
  const isStrong = words.length >= 6 && overlapCount >= 2;
  const isPartial = words.length >= 4;

  return {
    hindiTranslation: clean,
    status: isStrong ? 'correct' : isPartial ? 'partial' : 'incorrect',
    isCorrect: isStrong,
    whatWasWrongHindi: isStrong
      ? ''
      : 'उत्तर को कम से कम 2 पूर्ण हिंदी वाक्यों में उदाहरण सहित स्पष्ट करें।',
    correctAnswerHindi: sq.sampleAnswerHindi,
  };
}

function evaluateCreativeLocally(
  draft: string,
  title: string,
  wordLimit: number
): CreativeEvalState {
  const clean = draft.trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  const ratio = Math.min(1, wordCount / Math.max(25, Math.floor(wordLimit * 0.65)));
  const hasPunctuation = /[।?!,]/.test(clean);
  const overall = Math.min(92, Math.max(45, Math.round(45 + ratio * 38 + (hasPunctuation ? 7 : 0))));
  return {
    hindiTitle: title,
    hindiTranslation: clean,
    overallScore: overall,
    formatScore: hasPunctuation ? 8 : 6,
    contentScore: Math.round(ratio * 9),
    languageScore: Math.round((overall / 100) * 9),
    level: overall >= 80 ? 'उत्कृष्ट प्रयास' : overall >= 65 ? 'सशक्त प्रयास' : 'प्रारंभिक प्रयास',
    feedbackHindi:
      wordCount >= Math.floor(wordLimit * 0.6)
        ? 'अच्छा लेखन प्रयास! विराम-चिह्नों, कारक और वर्तनी की शुद्धता बनाए रखें।'
        : `आपकी रचना में ${wordCount} शब्द हैं। लगभग ${wordLimit} शब्दों में विचार विस्तार करें।`,
    grammarErrors: [],
  };
}

export const InteractiveWorkbookRunner: React.FC<InteractiveWorkbookRunnerProps> = ({
  workbook,
  grade,
  bilingualMode,
  studentName,
  studentEmail,
  onReturn,
  onAddWordCoins,
  onRecordWrongAnswer,
  onRecordReport,
  onRecordWorkbookAttempt,
  onCreativeSubmissionSaved,
}) => {
  const [shuffleNonce, setShuffleNonce] = useState<number>(0);
  const mcqs = useMemo(() => {
    void shuffleNonce;
    return randomizeQuizSet(workbook.mcqQuestions || []);
  }, [workbook, shuffleNonce]);

  const paraQuestions = workbook.paragraphQuestions || [];
  const shortQuestions = workbook.shortQuestions || [];
  const creativePrompt = workbook.creativeWritingPrompt;

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [paraSelections, setParaSelections] = useState<Record<string, string | number | null>>({});
  const [paraBheds, setParaBheds] = useState<Record<string, string>>({});
  const [paraRoles, setParaRoles] = useState<Record<string, string>>({});

  // Part C: 2-line Short Questions
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [shortHindiPreviews, setShortHindiPreviews] = useState<Record<string, string>>({});
  const [shortTranslating, setShortTranslating] = useState<Record<string, boolean>>({});
  const [shortReviews, setShortReviews] = useState<Record<string, ShortAnswerReviewState>>({});
  const [shortReviewLoading, setShortReviewLoading] = useState<Record<string, boolean>>({});
  const translateTimersRef = useRef<Record<string, number>>({});

  // Part D: Rachanatmak Lekhan
  const [creativeDraft, setCreativeDraft] = useState<string>('');
  const [creativeLanguage, setCreativeLanguage] = useState<'hindi' | 'english'>('hindi');
  const [creativeEval, setCreativeEval] = useState<CreativeEvalState | null>(null);
  const [isCreativeEvaluating, setIsCreativeEvaluating] = useState<boolean>(false);
  const [creativeError, setCreativeError] = useState<string | null>(null);

  const [isSubmittingAll, setIsSubmittingAll] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [summaryRecord, setSummaryRecord] = useState<WorkbookAttemptRecord | null>(null);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);

  useEffect(() => {
    return () => {
      Object.values(translateTimersRef.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const mcqAnsweredCount = mcqs.filter(
    (q) => typeof mcqAnswers[q.id] === 'number' && mcqAnswers[q.id] >= 0
  ).length;
  const paraAnsweredCount = paraQuestions.filter(
    (pq) => paraSelections[pq.id] !== undefined && paraSelections[pq.id] !== null
  ).length;
  const shortAnsweredCount = shortQuestions.filter(
    (sq) => (shortAnswers[sq.id] || '').trim().length >= 3
  ).length;
  const creativeWordCount = creativeDraft.trim()
    ? creativeDraft.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const hasCreativeEntry = Boolean(creativePrompt && creativeWordCount >= 5);

  const totalAnswered =
    mcqAnsweredCount + paraAnsweredCount + shortAnsweredCount + (hasCreativeEntry ? 1 : 0);
  const totalItems =
    mcqs.length + paraQuestions.length + shortQuestions.length + (creativePrompt ? 1 : 0);

  const triggerTranslateShort = async (sq: ComprehensionShortQuestion, text: string) => {
    const clean = text.trim();
    if (clean.length < 3) return;
    setShortTranslating((prev) => ({ ...prev, [sq.id]: true }));
    try {
      const resp = await fetch('/api/ai/gadyansh-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishText: clean,
          passageTitle: workbook.titleHindi,
          questionHindi: sq.questionHindi,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && data?.hindiTranslation) {
        setShortHindiPreviews((prev) => ({ ...prev, [sq.id]: data.hindiTranslation }));
      }
    } catch {
      // silent fallback
    } finally {
      setShortTranslating((prev) => ({ ...prev, [sq.id]: false }));
    }
  };

  const handleShortTextChange = (sq: ComprehensionShortQuestion, value: string) => {
    setShortAnswers((prev) => ({ ...prev, [sq.id]: value }));
    if (translateTimersRef.current[sq.id]) {
      window.clearTimeout(translateTimersRef.current[sq.id]);
    }
    const trimmed = value.trim();
    const looksLatin = /[a-zA-Z]{3,}/.test(trimmed);
    if (looksLatin && trimmed.length >= 6) {
      translateTimersRef.current[sq.id] = window.setTimeout(() => {
        triggerTranslateShort(sq, trimmed);
      }, 750);
    }
  };

  const evaluateSingleShortQuestion = async (
    sq: ComprehensionShortQuestion
  ): Promise<ShortAnswerReviewState> => {
    const ans = (shortAnswers[sq.id] || '').trim();
    if (!ans) {
      return {
        hindiTranslation: '',
        status: 'incorrect',
        isCorrect: false,
        whatWasWrongHindi: 'इस प्रश्न का उत्तर नहीं लिखा गया।',
        correctAnswerHindi: sq.sampleAnswerHindi,
      };
    }

    try {
      const resp = await fetch('/api/ai/gadyansh-short-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageTitle: workbook.titleHindi,
          passageHindi: `विषय: ${sq.topicNameHindi || workbook.topicsCovered.join(', ')}। आदर्श संदर्भ: ${sq.sampleAnswerHindi}`,
          grade,
          questionHindi: sq.questionHindi,
          questionEnglish: sq.questionEnglish,
          expectedAnswerHindi: sq.sampleAnswerHindi,
          expectedAnswerEnglish: sq.sampleAnswerEnglish,
          studentEnglishAnswer: ans,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && data?.hindiTranslation) {
        return {
          hindiTranslation: data.hindiTranslation,
          status: data.status || (data.isCorrect ? 'correct' : 'partial'),
          isCorrect: Boolean(data.isCorrect),
          whatWasWrongHindi: data.whatWasWrongHindi,
          correctAnswerHindi: data.correctAnswerHindi || sq.sampleAnswerHindi,
          explanationHindi: data.explanationHindi,
        };
      }
    } catch {
      // fall back locally below
    }

    return evaluateShortAnswerLocally(sq, ans);
  };

  const handleCheckSingleShort = async (sq: ComprehensionShortQuestion) => {
    setShortReviewLoading((prev) => ({ ...prev, [sq.id]: true }));
    try {
      const result = await evaluateSingleShortQuestion(sq);
      setShortReviews((prev) => ({ ...prev, [sq.id]: result }));
      if (result.hindiTranslation) {
        setShortHindiPreviews((prev) => ({ ...prev, [sq.id]: result.hindiTranslation }));
      }
    } finally {
      setShortReviewLoading((prev) => ({ ...prev, [sq.id]: false }));
    }
  };

  const runCreativeAiEvaluation = async (): Promise<CreativeEvalState | null> => {
    if (!creativePrompt) return null;
    const clean = creativeDraft.trim();
    if (clean.split(/\s+/).filter(Boolean).length < 5) {
      setCreativeError('कृपया कम से कम 5 शब्दों की रचना लिखें।');
      return null;
    }

    setCreativeError(null);
    setIsCreativeEvaluating(true);
    try {
      const mappedGenreId =
        creativePrompt.genreId === 'patra'
          ? 'patra_informal'
          : creativePrompt.genreId === 'katha'
          ? 'kahani'
          : 'anuched';

      const resp = await fetch('/api/ai/katha-shilpi-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genreId: mappedGenreId,
          title: creativePrompt.titleHindi,
          compositionText: clean,
          inputLanguage: creativeLanguage,
          grade,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (resp.ok && typeof data?.overallScore === 'number') {
        const result: CreativeEvalState = {
          hindiTitle: data.hindiTitle || creativePrompt.titleHindi,
          hindiTranslation: data.hindiTranslation || clean,
          overallScore: Number(data.overallScore) || 70,
          formatScore: Number(data.formatScore) || 7,
          contentScore: Number(data.contentScore) || 7,
          languageScore: Number(data.languageScore) || 7,
          level: data.level || 'सशक्त प्रयास',
          feedbackHindi: data.feedbackHindi || 'अच्छा रचनात्मक प्रयास!',
          grammarErrors: Array.isArray(data.spellingCorrections) ? data.spellingCorrections : [],
        };
        setCreativeEval(result);
        return result;
      }
    } catch {
      // fall back locally
    } finally {
      setIsCreativeEvaluating(false);
    }

    const fallbackEval = evaluateCreativeLocally(
      clean,
      creativePrompt.titleHindi,
      creativePrompt.wordLimit
    );
    setCreativeEval(fallbackEval);
    return fallbackEval;
  };

  const handleSubmit = async () => {
    setIsSubmittingAll(true);
    try {
      let mcqCorrect = 0;
      const weakTopics = new Set<string>();
      const strongTopics = new Set<string>();

      mcqs.forEach((q) => {
        const chosen = mcqAnswers[q.id];
        if (chosen === q.correctIndex) {
          mcqCorrect++;
          if (q.topicNameHindi) strongTopics.add(q.topicNameHindi);
        } else {
          if (q.topicNameHindi) weakTopics.add(q.topicNameHindi);
          if (typeof chosen === 'number') {
            onRecordWrongAnswer?.(
              q.topicId || 'mixed_board',
              q.topicNameHindi,
              q.topicNameEnglish,
              q.questionHindi
            );
          }
        }
      });

      let paraSelectCorrect = 0;
      let paraBhedCorrect = 0;

      paraQuestions.forEach((pq) => {
        const ev = evaluateInteractiveParagraphAnswer(
          pq,
          paraSelections[pq.id] ?? null,
          paraBheds[pq.id] || '',
          paraRoles[pq.id] || ''
        );
        if (ev.selectionCorrect) paraSelectCorrect++;
        if (ev.bothCorrect) {
          paraBhedCorrect++;
          strongTopics.add(pq.topicNameHindi);
        } else {
          weakTopics.add(pq.topicNameHindi);
          if (ev.hasSelection) {
            onRecordWrongAnswer?.(pq.topicId, pq.topicNameHindi, undefined, pq.promptHindi);
          }
        }
      });

      // Evaluate Part C Short Questions (only call API for typed & unreviewed items)
      let shortCorrect = 0;
      const nextShortReviews: Record<string, ShortAnswerReviewState> = { ...shortReviews };
      if (shortQuestions.length > 0) {
        for (const sq of shortQuestions) {
          const typed = (shortAnswers[sq.id] || '').trim();
          let rev = nextShortReviews[sq.id];
          if (!rev && typed) {
            rev = await evaluateSingleShortQuestion(sq);
            nextShortReviews[sq.id] = rev;
          }
          if (rev?.isCorrect) {
            shortCorrect++;
            if (sq.topicNameHindi) strongTopics.add(sq.topicNameHindi);
          } else if (typed) {
            if (sq.topicNameHindi) weakTopics.add(sq.topicNameHindi);
            onRecordWrongAnswer?.(
              sq.topicId || 'mixed_board',
              sq.topicNameHindi || 'लघु प्रश्नोत्तर',
              sq.topicNameEnglish,
              sq.questionHindi
            );
          }
        }
        setShortReviews(nextShortReviews);
      }

      // Evaluate Part D Rachanatmak Lekhan
      let activeCreativeResult = creativeEval;
      if (creativePrompt && hasCreativeEntry && !activeCreativeResult) {
        activeCreativeResult = await runCreativeAiEvaluation();
      }
      const creativePoints = activeCreativeResult
        ? Math.round((activeCreativeResult.overallScore / 100) * 5)
        : 0;
      const creativeMaxPoints = creativePrompt ? 5 : 0;

      if (activeCreativeResult && creativePrompt) {
        if (activeCreativeResult.overallScore >= 75) {
          strongTopics.add('रचनात्मक लेखन');
        } else {
          weakTopics.add('रचनात्मक लेखन व वर्तनी');
        }
        if (activeCreativeResult.grammarErrors.length > 0) {
          onRecordWrongAnswer?.(
            'ashuddhi',
            'अशुद्धि शोधन व वर्तनी',
            'Spelling & Grammar Corrections',
            creativePrompt.titleHindi
          );
        }

        if (onCreativeSubmissionSaved) {
          onCreativeSubmissionSaved({
            id: `cwb_creative_${Date.now()}`,
            studentEmail: studentEmail || 'student@shabdshilp.com',
            studentName: studentName || 'विद्यार्थी',
            grade,
            genreId:
              creativePrompt.genreId === 'patra'
                ? 'patra_informal'
                : creativePrompt.genreId === 'katha'
                ? 'kahani'
                : 'anuched',
            titleHindi: activeCreativeResult.hindiTitle || creativePrompt.titleHindi,
            submissionMode: 'typed',
            transcribedText: activeCreativeResult.hindiTranslation || creativeDraft.trim(),
            overallScore: activeCreativeResult.overallScore,
            rubricScores: {
              format: activeCreativeResult.formatScore,
              content: activeCreativeResult.contentScore,
              language: activeCreativeResult.languageScore,
              vyakaranVartani: activeCreativeResult.languageScore,
              praroop: activeCreativeResult.formatScore,
              shabdavaliBhav: activeCreativeResult.contentScore,
            },
            grammarErrors: activeCreativeResult.grammarErrors,
            feedbackHindi: activeCreativeResult.feedbackHindi,
            status: 'Reviewed',
            coinsAwarded: Math.max(1, Math.floor(creativePoints / 2)),
            submittedAt: new Date().toISOString(),
          });
        }
      }

      const overallScore =
        mcqCorrect + paraSelectCorrect + paraBhedCorrect + shortCorrect + creativePoints;
      const overallMax = Math.max(
        1,
        mcqs.length + paraQuestions.length * 2 + shortQuestions.length + creativeMaxPoints
      );
      const percentage = Math.round((overallScore / overallMax) * 100);
      const coins = overallScore > 0 ? Math.max(2, Math.floor(overallScore / 2)) : 0;

      const nowIso = new Date().toISOString();
      const attempt: WorkbookAttemptRecord = {
        id: `wb_attempt_${workbook.id}_${Date.now()}`,
        workbookId: workbook.id,
        titleHindi: workbook.titleHindi,
        mcqCorrect,
        mcqTotal: mcqs.length,
        paraSelectCorrect,
        paraSelectTotal: paraQuestions.length,
        paraBhedCorrect,
        paraBhedTotal: paraQuestions.length,
        shortCorrect: shortQuestions.length > 0 ? shortCorrect : undefined,
        shortTotal: shortQuestions.length > 0 ? shortQuestions.length : undefined,
        creativeScore: activeCreativeResult ? activeCreativeResult.overallScore : undefined,
        overallScore,
        overallMax,
        percentage,
        completedAt: nowIso,
      };

      setSummaryRecord(attempt);
      setEarnedCoins(coins);
      setIsSubmitted(true);

      if (coins > 0) {
        onAddWordCoins(coins);
        triggerCoinBurst();
      }
      if (overallScore > 0) {
        triggerCelebration();
      }

      onRecordWorkbookAttempt?.(attempt);

      const summaryParts = [
        `MCQ: ${mcqCorrect}/${mcqs.length}`,
        `अनुच्छेद चयन: ${paraSelectCorrect}/${paraQuestions.length}`,
        `भेद पहचान: ${paraBhedCorrect}/${paraQuestions.length}`,
      ];
      if (shortQuestions.length > 0) {
        summaryParts.push(`लघु प्रश्न: ${shortCorrect}/${shortQuestions.length}`);
      }
      if (activeCreativeResult) {
        summaryParts.push(`रचनात्मक लेखन: ${activeCreativeResult.overallScore}/100`);
      }

      onRecordReport?.({
        id: attempt.id,
        sourceType: 'worksheet',
        titleHindi: workbook.titleHindi,
        titleEnglish: workbook.titleEnglish,
        grade,
        score: overallScore,
        maxScore: overallMax,
        attemptedCount: totalAnswered,
        unansweredCount: Math.max(0, totalItems - totalAnswered),
        percentage,
        wordCoinsEarned: coins,
        weakAreasHindi: Array.from(weakTopics),
        strongAreasHindi: Array.from(strongTopics),
        adviceSummaryHindi: summaryParts.join(' | '),
        date: new Date().toLocaleDateString('hi-IN'),
        timestamp: nowIso,
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const handleReset = () => {
    setMcqAnswers({});
    setParaSelections({});
    setParaBheds({});
    setParaRoles({});
    setShortAnswers({});
    setShortHindiPreviews({});
    setShortReviews({});
    setCreativeDraft('');
    setCreativeEval(null);
    setCreativeError(null);
    setIsSubmitted(false);
    setSummaryRecord(null);
    setEarnedCoins(0);
    setShuffleNonce((n) => n + 1);
  };

  const buildPrintablePayload = (includeAnswers: boolean) => ({
    titleHindi: workbook.titleHindi,
    titleEnglish: workbook.titleEnglish,
    grade,
    board: 'ICSE',
    studentName,
    trackedTopics: workbook.trackedTopicNames || workbook.topicsCovered,
    mcqQuestions: mcqs,
    paragraphQuestions: paraQuestions.map((pq) => ({
      promptHindi: pq.promptHindi,
      paragraphTitleHindi: pq.paragraphTitleHindi,
      paragraphSentences: pq.paragraphSentences,
      explanationHindi: pq.explanationHindi,
    })),
    shortQuestions: shortQuestions.map((sq) => ({
      questionHindi: sq.questionHindi,
      questionEnglish: sq.questionEnglish,
      sampleAnswerHindi: sq.sampleAnswerHindi,
    })),
    creativePrompt: creativePrompt
      ? {
          genreLabelHindi: creativePrompt.genreLabelHindi,
          titleHindi: creativePrompt.titleHindi,
          instructionsHindi: creativePrompt.instructionsHindi,
          wordLimit: creativePrompt.wordLimit,
          hintsHindi: creativePrompt.hintsHindi,
        }
      : undefined,
    includeAnswers,
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-extrabold">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>
              संकलित अभ्यास पुस्तिका ({mcqs.length} MCQ + {paraQuestions.length} अनुच्छेद
              {shortQuestions.length > 0 ? ` + ${shortQuestions.length} लघु प्रश्न` : ''}
              {creativePrompt ? ' + रचनात्मक लेखन' : ''})
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-display">
            {workbook.titleHindi}
          </h3>
          {bilingualMode && (
            <p className="text-xs text-slate-500">{workbook.titleEnglish}</p>
          )}
          {workbook.trackedTopicNames && workbook.trackedTopicNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500">ट्रैक किए गए विषय:</span>
              {workbook.trackedTopicNames.map((topic, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => downloadInteractiveWorkbookDocument(buildPrintablePayload(isSubmitted))}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>डाउनलोड</span>
          </button>
          <button
            type="button"
            onClick={() => printInteractiveWorkbookDocument(buildPrintablePayload(isSubmitted))}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>प्रिंट / PDF</span>
          </button>
          <button
            type="button"
            onClick={onReturn}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>स्टोर सूची पर लौटें</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Summary Card (Post-Submit) */}
      {isSubmitted && summaryRecord && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300">
                <Award className="w-4 h-4" />
                <span>मूल्यांकन पूर्ण — रिपोर्ट व विश्लेषण सहेजा गया</span>
              </div>
              <h4 className="text-2xl font-black">
                कुल प्रदर्शन: {summaryRecord.overallScore} / {summaryRecord.overallMax} ({summaryRecord.percentage}%)
              </h4>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-amber-400 text-slate-950 flex items-center gap-2.5 shrink-0">
              <Coins className="w-6 h-6" />
              <div>
                <div className="text-[10px] font-black uppercase">अर्जित सिक्के</div>
                <div className="text-xl font-black">+{earnedCoins} WordCoins</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-indigo-200 font-semibold">भाग A · मानक MCQ सटीकता</div>
              <div className="text-lg font-black text-white mt-1 tabular-nums">
                {summaryRecord.mcqCorrect} / {summaryRecord.mcqTotal} (
                {summaryRecord.mcqTotal > 0
                  ? Math.round((summaryRecord.mcqCorrect / summaryRecord.mcqTotal) * 100)
                  : 0}
                %)
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-indigo-200 font-semibold">भाग B · अनुच्छेद चयन व भेद</div>
              <div className="text-lg font-black text-emerald-300 mt-1 tabular-nums">
                {summaryRecord.paraSelectCorrect} चयन · {summaryRecord.paraBhedCorrect}/{summaryRecord.paraBhedTotal} भेद
              </div>
            </div>
            {typeof summaryRecord.shortTotal === 'number' && (
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-indigo-200 font-semibold">भाग C · लघु प्रश्नोत्तर</div>
                <div className="text-lg font-black text-amber-300 mt-1 tabular-nums">
                  {summaryRecord.shortCorrect ?? 0} / {summaryRecord.shortTotal}
                </div>
              </div>
            )}
            {typeof summaryRecord.creativeScore === 'number' && (
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-indigo-200 font-semibold">भाग D · रचनात्मक लेखन</div>
                <div className="text-lg font-black text-rose-200 mt-1 tabular-nums">
                  {summaryRecord.creativeScore} / 100
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-amber-300 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>पुनः हल करें (Retake)</span>
            </button>
            <button
              type="button"
              onClick={onReturn}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold cursor-pointer"
            >
              अन्य वर्कशीट्स देखें
            </button>
          </div>
        </div>
      )}

      {/* PART A: STANDARD MCQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          <h4 className="text-base font-black text-slate-900">
            भाग A · बहुविकल्पीय प्रश्न (Standard MCQs — {mcqs.length})
          </h4>
        </div>

        {mcqs.map((q, qIdx) => {
          const userChoice = mcqAnswers[q.id];
          const hasAnswered = typeof userChoice === 'number' && userChoice >= 0;
          const isCorrect = hasAnswered && userChoice === q.correctIndex;

          return (
            <div key={q.id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {q.topicNameHindi}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug pt-1">
                    {qIdx + 1}. {q.questionHindi}
                  </h5>
                  {bilingualMode && q.questionEnglish && (
                    <p className="text-[11px] text-indigo-700/80">{q.questionEnglish}</p>
                  )}
                </div>

                {isSubmitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> सही
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> {hasAnswered ? 'गलत' : 'छूटा'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isChosen = userChoice === oIdx;
                  let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (isSubmitted) {
                    if (oIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                    }
                  } else if (isChosen) {
                    btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        isSubmitted ? 'cursor-default' : 'cursor-pointer'
                      } ${btnStyle}`}
                    >
                      <span>{opt.textHindi}</span>
                      <span className="font-bold opacity-60">({String.fromCharCode(65 + oIdx)})</span>
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-800">
                  <strong>व्याख्या:</strong> {q.explanationHindi}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PART B: INTERACTIVE PARAGRAPH SELECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-indigo-600" />
            <h4 className="text-base font-black text-slate-900">
              भाग B · अनुच्छेद चयन व भेद परीक्षण (Interactive Paragraph Test — {paraQuestions.length})
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            सबमिट से पहले कोई संकेत नहीं (Zero-Hint Evaluation)
          </span>
        </div>

        {paraQuestions.map((pq, pIdx) => (
          <InteractiveParagraphQuestion
            key={pq.id}
            question={pq}
            questionIndex={pIdx}
            selectedToken={paraSelections[pq.id] ?? null}
            selectedBhed={paraBheds[pq.id] || ''}
            selectedRole={paraRoles[pq.id] || ''}
            isSubmitted={isSubmitted}
            bilingualMode={bilingualMode}
            onSelectToken={(val) =>
              setParaSelections((prev) => ({ ...prev, [pq.id]: val }))
            }
            onSelectBhed={(val) =>
              setParaBheds((prev) => ({ ...prev, [pq.id]: val }))
            }
            onSelectRole={(val) =>
              setParaRoles((prev) => ({ ...prev, [pq.id]: val }))
            }
          />
        ))}
      </div>

      {/* PART C: 2-LINE SHORT ANSWER QUESTIONS */}
      {shortQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-600" />
              <h4 className="text-base font-black text-slate-900">
                भाग C · संक्षिप्त 2-पंक्ति प्रश्नोत्तर (Short Answer Questions — {shortQuestions.length})
              </h4>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              हिंदी अथवा English/Hinglish में लिखें (स्वतः हिंदी रूपांतरण उपलब्ध)
            </span>
          </div>

          {shortQuestions.map((sq, sIdx) => {
            const review = shortReviews[sq.id];
            const previewHindi = shortHindiPreviews[sq.id];
            return (
              <div key={sq.id} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="space-y-0.5">
                  {sq.topicNameHindi && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {sq.topicNameHindi}
                    </span>
                  )}
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
                    {sIdx + 1}. {sq.questionHindi}
                  </h5>
                  {bilingualMode && sq.questionEnglish && (
                    <p className="text-[11px] text-indigo-700/80">{sq.questionEnglish}</p>
                  )}
                </div>

                <textarea
                  rows={2}
                  disabled={isSubmitted}
                  value={shortAnswers[sq.id] || ''}
                  onChange={(e) => handleShortTextChange(sq, e.target.value)}
                  placeholder="यहाँ 2 पंक्तियों में अपना उत्तर हिंदी या English में लिखें..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {shortTranslating[sq.id] && (
                      <span className="text-[11px] text-indigo-700 inline-flex items-center gap-1 font-semibold">
                        <Loader2 className="w-3 h-3 animate-spin" /> हिंदी अनुवाद हो रहा है...
                      </span>
                    )}
                    {previewHindi && (
                      <span className="text-[11px] bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-lg border border-indigo-200">
                        <strong>हिंदी रूप:</strong> {previewHindi}
                      </span>
                    )}
                  </div>

                  {!isSubmitted && (
                    <button
                      type="button"
                      disabled={Boolean(shortReviewLoading[sq.id]) || !(shortAnswers[sq.id] || '').trim()}
                      onClick={() => handleCheckSingleShort(sq)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {shortReviewLoading[sq.id] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      <span>उत्तर जाँचें (AI Check)</span>
                    </button>
                  )}
                </div>

                {review && (
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      review.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {review.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>सटीक व स्पष्ट उत्तर!</span>
                        </>
                      ) : (
                        <span>सुधार सुझाव: {review.whatWasWrongHindi || 'मुख्य व्याकरण बिंदुओं को जोड़ें।'}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-800">
                      <strong>आदर्श उत्तर:</strong> {review.correctAnswerHindi || sq.sampleAnswerHindi}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PART D: RACHANATMAK LEKHAN */}
      {creativePrompt && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-rose-600" />
              <h4 className="text-base font-black text-slate-900">
                भाग D · रचनात्मक लेखन (Rachanatmak Lekhan — {creativePrompt.genreLabelHindi})
              </h4>
            </div>
            <span className="text-[11px] font-bold text-slate-500 tabular-nums">
              शब्द गणना: {creativeWordCount} / ~{creativePrompt.wordLimit} शब्द
            </span>
          </div>

          <div className="p-5 bg-gradient-to-br from-rose-50/60 via-white to-amber-50/50 rounded-2xl border border-rose-200/80 space-y-4">
            <div className="space-y-1">
              <h5 className="text-sm sm:text-base font-black text-slate-900 font-hindi">
                विषय: {creativePrompt.titleHindi}
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed font-hindi">
                {creativePrompt.instructionsHindi}
              </p>
              {bilingualMode && (
                <p className="text-[11px] text-indigo-700/80">{creativePrompt.instructionsEnglish}</p>
              )}
            </div>

            {creativePrompt.hintsHindi.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {creativePrompt.hintsHindi.map((hint, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-rose-200"
                  >
                    • {hint}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">लेखन भाषा:</span>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => setCreativeLanguage('hindi')}
                className={`px-3 py-1.5 rounded-lg font-bold border cursor-pointer ${
                  creativeLanguage === 'hindi'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                हिंदी लेखन
              </button>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => setCreativeLanguage('english')}
                className={`px-3 py-1.5 rounded-lg font-bold border cursor-pointer ${
                  creativeLanguage === 'english'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                English / Hinglish (Auto Hindi + Check)
              </button>
            </div>

            <textarea
              rows={5}
              disabled={isSubmitted}
              value={creativeDraft}
              onChange={(e) => setCreativeDraft(e.target.value)}
              placeholder={
                creativeLanguage === 'hindi'
                  ? 'यहाँ अपनी सुंदर व व्याकरण-सम्मत हिंदी रचना लिखें...'
                  : 'Write your composition draft in English/Hinglish and AI will translate & evaluate per ICSE Hindi format...'
              }
              className="w-full p-4 rounded-2xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
            />

            {creativeError && (
              <div className="text-xs font-bold text-rose-700">{creativeError}</div>
            )}

            {!isSubmitted && (
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isCreativeEvaluating || creativeWordCount < 5}
                  onClick={runCreativeAiEvaluation}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCreativeEvaluating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>रचना की AI समीक्षा करें (Evaluate Writing)</span>
                </button>
              </div>
            )}

            {creativeEval && (
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-black text-emerald-900 text-sm">
                    रचना मूल्यांकन: {creativeEval.overallScore}/100 ({creativeEval.level})
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    प्रारूप: {creativeEval.formatScore}/10 · विषय: {creativeEval.contentScore}/10 · भाषा: {creativeEval.languageScore}/10
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-hindi">
                  {creativeEval.feedbackHindi}
                </p>
                {creativeEval.hindiTranslation && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-hindi text-slate-900 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[11px] font-bold text-indigo-700 mb-1">
                      परिमार्जित हिंदी प्रारूप ({creativeEval.hindiTitle}):
                    </div>
                    {creativeEval.hindiTranslation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Bar */}
      {!isSubmitted && (
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
            <span>
              प्रगति: <strong>{totalAnswered} / {totalItems}</strong> खंड/प्रश्न चयनित
            </span>
          </div>
          <button
            type="button"
            disabled={totalAnswered === 0 || isSubmittingAll}
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmittingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>मूल्यांकन व रिपोर्ट सहेजी जा रही है...</span>
              </>
            ) : (
              <>
                <span>अभ्यास पुस्तिका सबमिट करें व परिणाम देखें (Submit &amp; Evaluate)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
