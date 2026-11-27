import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCheck, 
  Coins, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Award,
  Upload,
  Check,
  Shuffle,
  Printer
} from 'lucide-react';
import { SPECIAL_WORKSHEETS } from '../data/grammarData';
import { CLASS5_STORE_WORKSHEETS, CLASS6_STORE_WORKSHEETS } from '../data/class5And6Data';
import {
  CLASS7_STORE_WORKSHEETS,
  CLASS8_STORE_WORKSHEETS,
  CLASS9_STORE_WORKSHEETS,
  CLASS10_STORE_WORKSHEETS,
} from '../data/class7To10Data';
import {
  WorksheetItem,
  GradeLevel,
  QuizQuestion,
  TeacherWorksheet,
  StudentWorksheetSubmission,
  MistakeTopicStat,
  SavedReportSummary,
  SavedWorksheetResult,
  InteractiveWorkbookDefinition,
  WorkbookAttemptRecord,
} from '../types';
import {
  INTERACTIVE_WORKBOOKS,
  checkInteractiveWorkbookGate,
  checkStoreWorksheetGate,
  WorkbookPrerequisiteItem,
} from '../data/interactiveWorkbookData';
import { InteractiveWorkbookRunner } from './InteractiveWorkbookRunner';
import { buildMistakeRecoveryQuestions } from '../data/mistakeRecoveryBank';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { printWorksheetDocument } from '../utils/printWorksheet';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';
import { 
  loadTeacherWorksheetsFromFirestore, 
  loadStudentSubmissionsFromFirestore, 
  saveStudentSubmissionsToFirestore,
  subscribeToTeacherWorksheets,
  subscribeToStudentSubmissions,
  subscribeToCrossTabUpdates,
  notifyCrossTabUpdate
} from '../utils/firebase';

const getSafeOptionEnglish = (opt: unknown): string | null => {
  if (!opt || typeof opt !== 'object') return null;
  const rawValue = (opt as { textEnglish?: unknown }).textEnglish;
  const raw = typeof rawValue === 'string' ? rawValue.trim() : '';
  if (
    !raw ||
    /^(correct\s*(option|answer)|wrong\s*(option|answer)|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i.test(
      raw
    )
  ) {
    return null;
  }
  return raw;
};

// Only render option-level English subtitles when EVERY option in the question has genuine, non-placeholder English
// so asymmetry across options can never reveal the correct answer.
const shouldShowUniformOptionEnglish = (options: unknown): boolean => {
  if (!Array.isArray(options) || options.length === 0) return false;
  return options.every((opt) => getSafeOptionEnglish(opt) !== null);
};

interface WorksheetsStoreProps {
  grade: GradeLevel;
  wordCoins: number;
  onDeductWordCoins: (coins: number) => boolean;
  onAddWordCoins: (coins: number) => void;
  unlockedIds: string[];
  onUnlockWorksheet: (id: string) => void;
  bilingualMode: boolean;
  currentUser?: { email: string; userName: string; grade: GradeLevel; section?: string } | null;
  mistakeHistory?: Record<string, MistakeTopicStat>;
  completedWorksheetResults?: Record<string, SavedWorksheetResult>;
  completedSimulationModules?: string[];
  simulationCompletions?: Record<string, number>;
  workbookAttempts?: WorkbookAttemptRecord[];
  onOpenSimulationModule?: (moduleId: string) => void;
  onRecordWorkbookAttempt?: (attempt: WorkbookAttemptRecord) => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onRecordWorksheetResult?: (worksheetId: string, result: SavedWorksheetResult) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
}

export const WorksheetsStore: React.FC<WorksheetsStoreProps> = ({
  grade,
  wordCoins,
  onDeductWordCoins,
  onAddWordCoins,
  unlockedIds,
  onUnlockWorksheet,
  bilingualMode,
  currentUser,
  mistakeHistory = {},
  completedWorksheetResults = {},
  completedSimulationModules = [],
  simulationCompletions = {},
  workbookAttempts = [],
  onOpenSimulationModule,
  onRecordWorkbookAttempt,
  onRecordWrongAnswer,
  onRecordWorksheetResult,
  onRecordReport,
}) => {
  const [activeWorksheet, setActiveWorksheet] = useState<WorksheetItem | TeacherWorksheet | null>(null);
  const [activeInteractiveWorkbook, setActiveInteractiveWorkbook] = useState<InteractiveWorkbookDefinition | null>(null);
  const [lockedGateInfo, setLockedGateInfo] = useState<{
    titleHindi: string;
    requirements: WorkbookPrerequisiteItem[];
  } | null>(null);
  const [isTeacherLiveWorksheet, setIsTeacherLiveWorksheet] = useState<boolean>(false);
  const [isMistakeRecoveryWorksheet, setIsMistakeRecoveryWorksheet] = useState<boolean>(false);
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, number>>({});
  const [isGraded, setIsGraded] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [coinNotice, setCoinNotice] = useState<string | null>(null);

  const mistakeList: MistakeTopicStat[] = Object.values(mistakeHistory || {})
    .filter((m): m is MistakeTopicStat => Boolean(m && (m.topicKey || m.topicNameHindi)))
    .sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0));

  const gradeStoreWorksheets: WorksheetItem[] =
    grade === 'कक्षा 5'
      ? CLASS5_STORE_WORKSHEETS
      : grade === 'कक्षा 6'
      ? CLASS6_STORE_WORKSHEETS
      : grade === 'कक्षा 7'
      ? CLASS7_STORE_WORKSHEETS
      : grade === 'कक्षा 8'
      ? CLASS8_STORE_WORKSHEETS
      : grade === 'कक्षा 9'
      ? CLASS9_STORE_WORKSHEETS
      : grade === 'कक्षा 10'
      ? CLASS10_STORE_WORKSHEETS
      : SPECIAL_WORKSHEETS;

  // Reset active worksheet cleanly when grade switches
  useEffect(() => {
    setActiveWorksheet(null);
    setActiveInteractiveWorkbook(null);
    setLockedGateInfo(null);
    setIsMistakeRecoveryWorksheet(false);
    setWorksheetAnswers({});
    setIsGraded(false);
    setScore(0);
    setEarnedCoins(0);
    setCoinNotice(null);
  }, [grade]);

  // Load teacher active worksheets
  const [teacherActiveWorksheets, setTeacherActiveWorksheets] = useState<TeacherWorksheet[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentWorksheetSubmission[]>([]);
  const seenRecoveryQuestionsRef = useRef<string[]>([]);

  const refreshTeacherWorksheets = (worksheetsList: TeacherWorksheet[]) => {
    const studentGrade = currentUser?.grade || grade;
    const studentSection = (currentUser as any)?.section || 'सेक्शन A';
    setTeacherActiveWorksheets(
      worksheetsList.filter(
        w => w.isActive && (!w.grade || w.grade === studentGrade) && (!w.section || w.section === studentSection || w.section === 'सभी सेक्शन (All Sections)')
      )
    );
  };

  const mergeSubmissionsLists = (
    primaryList: StudentWorksheetSubmission[],
    secondaryList: StudentWorksheetSubmission[]
  ): StudentWorksheetSubmission[] => {
    const mergedMap = new Map<string, StudentWorksheetSubmission>();
    [...secondaryList, ...primaryList].forEach((sub) => {
      if (!sub || !sub.worksheetId) return;
      const key = `${sub.worksheetId}::${(sub.studentEmail || '').trim().toLowerCase()}`;
      mergedMap.set(key, sub);
    });
    return Array.from(mergedMap.values());
  };

  useEffect(() => {
    let isMounted = true;

    const readLocalSubs = (): StudentWorksheetSubmission[] => {
      try {
        const raw = localStorage.getItem('shabdshilp_student_submissions') || localStorage.getItem('shabd_student_submissions');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    // 1. Initial Local Storage Load
    try {
      const savedTeacherWs = localStorage.getItem('shabdshilp_teacher_worksheets');
      if (savedTeacherWs) {
        refreshTeacherWorksheets(JSON.parse(savedTeacherWs));
      }
      const initialSubs = readLocalSubs();
      if (initialSubs.length > 0) {
        setStudentSubmissions(initialSubs);
      }
    } catch (e) {}

    // 2. Initial Cloud Firestore Load
    loadTeacherWorksheetsFromFirestore()
      .then((cloudWs) => {
        if (isMounted && Array.isArray(cloudWs) && cloudWs.length > 0) {
          refreshTeacherWorksheets(cloudWs);
        }
      })
      .catch((err) => {
        console.warn('Teacher worksheets cloud load fallback:', err);
      });

    loadStudentSubmissionsFromFirestore()
      .then((cloudSubs) => {
        if (isMounted && Array.isArray(cloudSubs) && cloudSubs.length > 0) {
          setStudentSubmissions((prev) => mergeSubmissionsLists(cloudSubs, mergeSubmissionsLists(prev, readLocalSubs())));
        }
      })
      .catch((err) => {
        console.warn('Submissions cloud load fallback:', err);
      });

    // 3. Real-time Firestore Subscriptions
    const unsubWs = subscribeToTeacherWorksheets((cloudWs) => {
      if (isMounted && Array.isArray(cloudWs)) {
        refreshTeacherWorksheets(cloudWs);
      }
    });

    const unsubSubs = subscribeToStudentSubmissions((cloudSubs) => {
      if (isMounted && Array.isArray(cloudSubs)) {
        setStudentSubmissions((prev) => mergeSubmissionsLists(cloudSubs, mergeSubmissionsLists(prev, readLocalSubs())));
      }
    });

    // 4. Real-time Cross-Tab Broadcast Channel Sync
    const unsubCrossTab = subscribeToCrossTabUpdates(() => {
      if (!isMounted) return;
      try {
        const localWs = localStorage.getItem('shabdshilp_teacher_worksheets');
        if (localWs) refreshTeacherWorksheets(JSON.parse(localWs));
        const localSubs = readLocalSubs();
        if (localSubs.length > 0) {
          setStudentSubmissions((prev) => mergeSubmissionsLists(localSubs, prev));
        }
      } catch (e) {}
    });

    // 5. Polling check (every 2.5s) for instant sync across browser tabs
    const intervalId = setInterval(() => {
      try {
        const localWs = localStorage.getItem('shabdshilp_teacher_worksheets');
        if (localWs) refreshTeacherWorksheets(JSON.parse(localWs));
        const localSubs = readLocalSubs();
        if (localSubs.length > 0) {
          setStudentSubmissions((prev) => mergeSubmissionsLists(localSubs, prev));
        }
      } catch (e) {}
    }, 2500);

    return () => {
      isMounted = false;
      unsubWs();
      unsubSubs();
      unsubCrossTab();
      clearInterval(intervalId);
    };
  }, [currentUser?.grade, currentUser?.section, grade]);

  const generateExclusiveMistakeRecoverySet = (stats: MistakeTopicStat[]) => {
    const teacherQTexts = teacherActiveWorksheets.flatMap((w) =>
      (w.questions || []).map((q) => q.questionHindi).filter(Boolean)
    );
    const excludeQuestionTexts = Array.from(
      new Set([...teacherQTexts, ...seenRecoveryQuestionsRef.current])
    );
    const recoveryQs = buildMistakeRecoveryQuestions(stats, 4, { excludeQuestionTexts });
    const nextSeen = new Set([
      ...seenRecoveryQuestionsRef.current,
      ...recoveryQs.map((q) => q.questionHindi),
    ]);
    // Keep sliding window of recent session questions so retakes prioritize unseen items first
    seenRecoveryQuestionsRef.current = Array.from(nextSeen).slice(-80);
    return recoveryQs;
  };

  const handleOpenMistakeRecovery = () => {
    setCoinNotice(null);
    setIsTeacherLiveWorksheet(false);
    setIsMistakeRecoveryWorksheet(true);
    const recoveryQuestions = generateExclusiveMistakeRecoverySet(mistakeList);
    const topicsSummary =
      mistakeList.length > 0
        ? mistakeList.map((m) => m.topicNameHindi)
        : ['कारक एवं परसर्ग', 'काल (Tenses)', 'वाक्य रचना और रूपांतरण'];
    const recoveryWorksheet: WorksheetItem = {
      id: 'mistake_recovery_special',
      titleHindi: 'गलती-सुधार विशेष अभ्यास वर्कशीट (हमेशा अनलॉक)',
      titleEnglish: 'Mistake Recovery Worksheet (Always Unlocked)',
      costWordCoins: 0,
      descriptionHindi:
        mistakeList.length > 0
          ? `वेबसाइट पर जिन ${mistakeList.length} प्रश्न-प्रकारों में आपसे त्रुटियाँ हुईं, उनमें से प्रत्येक के 4-4 अनूठे प्रश्न शामिल हैं।`
          : 'यह वर्कशीट हमेशा अनलॉक है। अभी 12 आधारभूत अभ्यास प्रश्नों से शुरुआत करें — और वेबसाइट पर जो भी प्रश्न गलत होंगे, उनके 4-4 लक्ष्य प्रश्न यहाँ स्वतः जुड़ते जाएंगे!',
      descriptionEnglish:
        mistakeList.length > 0
          ? `Includes 4 targeted practice questions for each of the ${mistakeList.length} question types you missed across the platform.`
          : 'Always unlocked! Start with 12 foundational practice questions — any questions missed across the platform automatically add 4 targeted questions per type.',
      topicsCovered: topicsSummary,
      questionCount: recoveryQuestions.length,
      isUnlocked: true,
      practiceQuestions: recoveryQuestions,
    };
    setActiveWorksheet(recoveryWorksheet);
    setWorksheetAnswers({});
    setIsGraded(false);
    setScore(0);
    setEarnedCoins(0);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_e) {}
  };

  const handleOpenInteractiveWorkbook = (wb: InteractiveWorkbookDefinition) => {
    setCoinNotice(null);
    const gate = checkInteractiveWorkbookGate(wb, grade, {
      simulationCompletions,
      completedSimulationModules,
    });
    if (!gate.isUnlockedBySim) {
      setLockedGateInfo({
        titleHindi: wb.titleHindi,
        requirements: gate.requirements,
      });
      return;
    }
    setActiveWorksheet(null);
    setActiveInteractiveWorkbook(wb);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_e) {}
  };

  const handleUnlock = (ws: WorksheetItem) => {
    setIsTeacherLiveWorksheet(false);
    setIsMistakeRecoveryWorksheet(false);
    setCoinNotice(null);
    const randomizedWs: WorksheetItem = {
      ...ws,
      practiceQuestions: randomizeQuizSet(ws.practiceQuestions || [])
    };
    if (unlockedIds.includes(ws.id)) {
      setActiveWorksheet(randomizedWs);
      setWorksheetAnswers({});
      setIsGraded(false);
      setScore(0);
      setEarnedCoins(0);
      return;
    }

    const gate = checkStoreWorksheetGate(ws, grade, {
      simulationCompletions,
      completedSimulationModules,
    });
    if (!gate.isUnlockedBySim) {
      setLockedGateInfo({
        titleHindi: ws.titleHindi,
        requirements: gate.requirements,
      });
      return;
    }

    if (wordCoins < ws.costWordCoins) {
      setCoinNotice(`आपके पास पर्याप्त WordCoins नहीं हैं। इस वर्कशीट के लिए ${ws.costWordCoins} WordCoins चाहिए (वर्तमान: ${wordCoins})।`);
      return;
    }

    const success = onDeductWordCoins(ws.costWordCoins);
    if (success) {
      onUnlockWorksheet(ws.id);
      setActiveWorksheet(randomizedWs);
      setWorksheetAnswers({});
      setIsGraded(false);
      setScore(0);
      setEarnedCoins(0);
      triggerCelebration();
    }
  };

  const handleOpenTeacherWorksheet = (tWs: TeacherWorksheet) => {
    setCoinNotice(null);
    setIsMistakeRecoveryWorksheet(false);
    const normStudentEmail = (currentUser?.email || 'student@shabdshilp.com').trim().toLowerCase();
    // Check if already attempted by this student
    const alreadySubmitted = studentSubmissions.find(
      s => s.worksheetId === tWs.id && (s.studentEmail || '').trim().toLowerCase() === normStudentEmail
    );

    setIsTeacherLiveWorksheet(true);
    if (alreadySubmitted) {
      setActiveWorksheet(tWs);
      setWorksheetAnswers(alreadySubmitted.answers || {});
      setIsGraded(true);
      setScore(alreadySubmitted.score);
      setEarnedCoins(Math.floor(alreadySubmitted.score / 2));
    } else {
      const randomizedTeacherWs: TeacherWorksheet = {
        ...tWs,
        questions: randomizeQuizSet(tWs.questions || [])
      };
      setActiveWorksheet(randomizedTeacherWs);
      setWorksheetAnswers({});
      setIsGraded(false);
      setScore(0);
      setEarnedCoins(0);
    }
  };

  const handleShuffleCurrentWorksheet = () => {
    if (!activeWorksheet || isGraded) return;
    if (isTeacherLiveWorksheet) {
      const tWs = activeWorksheet as TeacherWorksheet;
      setActiveWorksheet({
        ...tWs,
        questions: randomizeQuizSet(tWs.questions || [])
      });
    } else {
      const ws = activeWorksheet as WorksheetItem;
      setActiveWorksheet({
        ...ws,
        practiceQuestions: randomizeQuizSet(ws.practiceQuestions || [])
      });
    }
    setWorksheetAnswers({});
  };

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (isGraded) return;
    setWorksheetAnswers({ ...worksheetAnswers, [qId]: optIdx });
  };

  const handleGradeWorksheet = () => {
    if (!activeWorksheet) return;
    let correct = 0;
    const questionsList = isTeacherLiveWorksheet
      ? (activeWorksheet as TeacherWorksheet).questions
      : (activeWorksheet as WorksheetItem).practiceQuestions;

    questionsList.forEach((q) => {
      const choice = worksheetAnswers[q.id];
      const optLen = Array.isArray(q.options) ? q.options.length : 0;
      const hasAnswered =
        typeof choice === 'number' &&
        Number.isInteger(choice) &&
        choice >= 0 &&
        (optLen === 0 || choice < optLen);
      if (hasAnswered) {
        if (choice === q.correctIndex) {
          correct++;
        } else {
          onRecordWrongAnswer?.(
            q.topicId || q.topicNameHindi || 'mixed_board',
            q.topicNameHindi,
            q.topicNameEnglish,
            q.questionHindi
          );
        }
      }
    });

    const coinsEarned = Math.floor(correct / 2);
    setScore(correct);
    setEarnedCoins(coinsEarned);
    setIsGraded(true);
    if (coinsEarned > 0) {
      onAddWordCoins(coinsEarned);
      triggerCoinBurst();
    }
    if (correct > 0) {
      triggerCelebration();
    }

    const maxScore = questionsList.length;
    const percentage = maxScore > 0 ? Math.round((correct / maxScore) * 100) : 0;

    onRecordWorksheetResult?.(activeWorksheet.id, {
      score: correct,
      maxScore,
      percentage,
      answers: worksheetAnswers,
      completedAt: new Date().toISOString(),
    });

    if (onRecordReport) {
      const report = buildWorksheetReport({
        titleHindi: activeWorksheet.titleHindi,
        titleEnglish: activeWorksheet.titleEnglish,
        questions: questionsList,
        userAnswers: worksheetAnswers,
        answerLookupMode: 'byId',
        fallbackTopicId: isTeacherLiveWorksheet
          ? (activeWorksheet as TeacherWorksheet).topic
          : 'mixed_board',
        fallbackTopicHindi: isTeacherLiveWorksheet
          ? (activeWorksheet as TeacherWorksheet).topic
          : (activeWorksheet as WorksheetItem).topicsCovered?.[0] || 'हिंदी व्याकरण',
        wordCoinsEarned: coinsEarned,
      });
      onRecordReport(
        toSavedReportSummary(report, {
          id: `ws_${activeWorksheet.id}_${Date.now()}`,
          sourceType: 'worksheet',
          grade: isTeacherLiveWorksheet ? (activeWorksheet as TeacherWorksheet).grade : grade,
        })
      );
    }

    // If it's a teacher live worksheet, save submission (prevent re-attempting)
    if (isTeacherLiveWorksheet && currentUser) {
      const normStudentEmail = (currentUser.email || '').trim().toLowerCase();
      const teacherWs = activeWorksheet as TeacherWorksheet;
      const newSub: StudentWorksheetSubmission = {
        worksheetId: activeWorksheet.id,
        studentEmail: normStudentEmail,
        studentName: currentUser.userName,
        grade: currentUser.grade,
        score: correct,
        maxScore,
        percentage,
        attemptedAt: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        answers: worksheetAnswers
      };

      const updatedSubs = [
        newSub,
        ...studentSubmissions.filter(
          s => !(s.worksheetId === activeWorksheet.id && (s.studentEmail || '').trim().toLowerCase() === normStudentEmail)
        )
      ];
      setStudentSubmissions(updatedSubs);
      try {
        localStorage.setItem('shabdshilp_student_submissions', JSON.stringify(updatedSubs));
        localStorage.setItem('shabd_student_submissions', JSON.stringify(updatedSubs));
      } catch (e) {}

      // Persist to Cloud Firestore and notify teacher tab in real time
      saveStudentSubmissionsToFirestore(updatedSubs, { ...newSub, teacherEmail: teacherWs.teacherEmail || '' })
        .catch((err) => {
          console.warn('Submission Firestore sync fallback:', err);
        });
      notifyCrossTabUpdate('STUDENT_SUBMITTED', { submission: newSub, worksheetId: activeWorksheet.id });
    }
  };

  // Check if student has submitted a specific teacher worksheet
  const getStudentSubmissionForWs = (wsId: string) => {
    if (!currentUser) return null;
    const normEmail = (currentUser.email || '').trim().toLowerCase();
    return studentSubmissions.find(
      s => s.worksheetId === wsId && (s.studentEmail || '').trim().toLowerCase() === normEmail
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner - Modern Indigo & Violet Gradient */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/15 border border-indigo-600/30 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200 border border-white/15 mb-3">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>WordCoins अनलॉक एवं शिक्षक लाइव असाइनमेंट</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-serif-display text-white">
            विशेष अभ्यास वर्कशीट्स व शिक्षक लाइव असाइनमेंट
          </h2>
          <p className="text-sm text-indigo-100/90 mt-2 leading-relaxed font-normal">
            शिक्षकों द्वारा लाइव सक्रिय की गई वर्कशीट्स सर्वोच्च प्राथमिकता पर नीचे दिखाई दे रही हैं। इसके अलावा अपने WordCoins से विशेष स्टोर वर्कशीट्स अनलॉक करें।
          </p>

          <div className="mt-5 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shadow-xs">
              <Coins className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <span className="text-indigo-200 block text-[10px] font-medium">उपलब्ध बैलेंस:</span>
              <span className="text-base font-black text-white">{wordCoins} WordCoins</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TEACHER LIVE ASSIGNMENTS (TOP PRIORITY) ================= */}
      {teacherActiveWorksheets.length > 0 && !activeWorksheet && !activeInteractiveWorkbook && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xl font-black text-slate-900 font-serif-display">
              📢 शिक्षकों द्वारा लाइव सक्रिय वर्कशीट्स (Teacher Live Assignments - Priority)
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {teacherActiveWorksheets.map((tWs) => {
              const submission = getStudentSubmissionForWs(tWs.id);
              const isAlreadyAttempted = !!submission;

              return (
                <div 
                  key={tWs.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                    शिक्षक असाइनमेंट
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <img
                        src="/assets/aistudio/mail.google_a65ce30f.png"
                        alt="शब्दशिल्प (ShabdShilp) Logo"
                        className="w-10 h-10 rounded-lg object-cover object-center border border-slate-200 bg-[#091124] shrink-0"
                      />
                      <img
                        src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                        alt="TechPreneur Logo"
                        className="w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-200 object-contain shrink-0"
                      />
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {tWs.grade} • {tWs.topic} • {tWs.section || 'सभी सेक्शन'}
                      </span>
                      <span className="text-xs text-slate-500">कुल प्रश्न: {tWs.questionCount}</span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 font-serif-display">
                      {tWs.titleHindi}
                    </h4>
                    <p className="text-xs text-slate-600">
                      शिक्षक: <strong>{tWs.teacherName}</strong> ({tWs.teacherEmail})
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isAlreadyAttempted ? (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>हल किया गया! प्राप्तांक: <strong>{submission.score} / {submission.maxScore} ({submission.percentage}%)</strong></span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        ⚠️ अनिवार्य प्रयास (Attempt Required)
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          printWorksheetDocument({
                            titleHindi: tWs.titleHindi,
                            subtitle: `शिक्षक: ${tWs.teacherName}`,
                            grade: tWs.grade,
                            board: 'ICSE',
                            topic: tWs.topic,
                            section: tWs.section,
                            difficulty: tWs.difficulty,
                            teacherName: tWs.teacherName,
                            teacherEmail: tWs.teacherEmail,
                            questions: tWs.questions || [],
                            includeAnswers: false,
                            includeEnglish: bilingualMode,
                          })
                        }
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        title="इस वर्कशीट को प्रिंट या PDF में सहेजें"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600" />
                        <span>प्रिंट</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenTeacherWorksheet(tWs)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isAlreadyAttempted
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25'
                        }`}
                      >
                        <span>{isAlreadyAttempted ? 'परिणाम देखें' : 'वर्कशीट हल करें'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Interactive Workbook Runner OR Standard Worksheet Solver OR Store Sections */}
      {activeInteractiveWorkbook ? (
        <InteractiveWorkbookRunner
          workbook={activeInteractiveWorkbook}
          grade={grade}
          bilingualMode={bilingualMode}
          onReturn={() => setActiveInteractiveWorkbook(null)}
          onAddWordCoins={onAddWordCoins}
          onRecordWrongAnswer={onRecordWrongAnswer}
          onRecordReport={onRecordReport}
          onRecordWorkbookAttempt={onRecordWorkbookAttempt}
        />
      ) : activeWorksheet ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <img
                  src="/assets/aistudio/mail.google_a65ce30f.png"
                  alt="शब्दशिल्प (ShabdShilp) Logo"
                  className="w-14 h-14 rounded-xl object-cover object-center border border-slate-200 bg-[#091124] shadow-xs shrink-0"
                />
                <img
                  src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                  alt="TechPreneur Logo"
                  className="w-14 h-14 rounded-xl bg-white p-0.5 border border-slate-200 object-contain shadow-xs shrink-0"
                />
              </div>
              <div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  isMistakeRecoveryWorksheet
                    ? 'text-emerald-900 bg-emerald-100 border border-emerald-300'
                    : 'text-amber-800 bg-amber-100'
                }`}>
                  {isTeacherLiveWorksheet
                    ? '📢 शिक्षक लाइव असाइनमेंट'
                    : isMistakeRecoveryWorksheet
                    ? '🔓 हमेशा अनलॉक • गलती-सुधार विशेष वर्कशीट (0 WordCoins)'
                    : 'अनलॉक की गई वर्कशीट'}
                </span>
                <h3 className="text-xl font-black text-slate-900 font-display mt-1">
                  {(activeWorksheet as any).titleHindi}
                </h3>
              {isGraded && (() => {
                const activeList = isTeacherLiveWorksheet
                  ? (activeWorksheet as TeacherWorksheet).questions || []
                  : (activeWorksheet as WorksheetItem).practiceQuestions || [];
                const totalCount = activeList.length;
                const answeredCount = activeList.filter((q) => {
                  const c = worksheetAnswers[q.id];
                  const optLen = Array.isArray(q.options) ? q.options.length : 0;
                  return typeof c === 'number' && Number.isInteger(c) && c >= 0 && (optLen === 0 || c < optLen);
                }).length;
                const skippedCount = Math.max(0, totalCount - answeredCount);
                const pct = totalCount > 0 ? Math.round((score / totalCount) * 100) : 0;

                return (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-black text-emerald-950">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>
                        प्राप्तांक: {score} / {totalCount} ({pct}%) · हल: {answeredCount}/{totalCount}
                        {skippedCount > 0 ? ` · छूटे: ${skippedCount}` : ''}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 border border-amber-300 rounded-xl text-xs font-black text-amber-950">
                      <Coins className="w-4 h-4 text-amber-700" />
                      <span>+{earnedCoins} WordCoins अर्जित (हर 2 सही उत्तर = 1 WordCoin)</span>
                    </div>
                  </div>
                );
              })()}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const qList = isTeacherLiveWorksheet
                    ? (activeWorksheet as TeacherWorksheet).questions
                    : (activeWorksheet as WorksheetItem).practiceQuestions;
                  printWorksheetDocument({
                    titleHindi: activeWorksheet.titleHindi,
                    subtitle: isTeacherLiveWorksheet
                      ? `शिक्षक: ${(activeWorksheet as TeacherWorksheet).teacherName}`
                      : (activeWorksheet as WorksheetItem).titleEnglish,
                    grade: isTeacherLiveWorksheet
                      ? (activeWorksheet as TeacherWorksheet).grade
                      : grade,
                    board: 'ICSE',
                    topic: isTeacherLiveWorksheet
                      ? (activeWorksheet as TeacherWorksheet).topic
                      : (activeWorksheet as WorksheetItem).topicsCovered?.join(', '),
                    teacherName: isTeacherLiveWorksheet
                      ? (activeWorksheet as TeacherWorksheet).teacherName
                      : undefined,
                    questions: qList || [],
                    includeAnswers: isGraded,
                    includeEnglish: bilingualMode,
                  });
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="इस वर्कशीट को प्रिंट या PDF में सहेजें"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट करें (Print / PDF)</span>
              </button>
              {!isGraded && (
                <button
                  type="button"
                  onClick={handleShuffleCurrentWorksheet}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="विकल्पों का क्रम रैंडम करें"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>विकल्प रैंडम करें (Shuffle)</span>
                </button>
              )}
              <button
                onClick={() => {
                  setActiveWorksheet(null);
                  setIsMistakeRecoveryWorksheet(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                सूची पर लौटें (Return to List)
              </button>
            </div>
          </div>

          {/* Worksheet Questions */}
          <div className="space-y-5">
            {isTeacherLiveWorksheet ? (
              // Teacher Worksheet Questions
              (activeWorksheet as TeacherWorksheet).questions.map((q, qIdx) => {
                const userChoice = worksheetAnswers[q.id];
                const optLen = Array.isArray(q.options) ? q.options.length : 0;
                const hasAnswered =
                  typeof userChoice === 'number' &&
                  Number.isInteger(userChoice) &&
                  userChoice >= 0 &&
                  (optLen === 0 || userChoice < optLen);
                const isCorrect = hasAnswered && userChoice === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {qIdx + 1}. {q.questionHindi}
                        {bilingualMode && q.questionEnglish && (
                          <div className="text-[11px] font-normal text-indigo-700/80 mt-0.5">
                            {q.questionEnglish}
                          </div>
                        )}
                      </h5>
                      {isGraded && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> सही
                            </span>
                          ) : hasAnswered ? (
                            <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> गलत
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              अनुत्तरित (0 अंक)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {(() => {
                        const showUniformEng = shouldShowUniformOptionEnglish(q.options);
                        return q.options.map((opt, oIdx) => {
                          const isChosen = userChoice === oIdx;
                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                          if (isGraded) {
                            if (hasAnswered) {
                              if (oIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                              } else if (isChosen) {
                                btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                              }
                            } else if (oIdx === q.correctIndex) {
                              btnStyle = 'bg-slate-100 border-dashed border-emerald-500 text-slate-800 font-semibold';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                          }

                          const optEng = showUniformEng ? getSafeOptionEnglish(opt) : null;

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isGraded}
                              onClick={() => handleSelectAnswer(q.id, oIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <div>
                                <span>{opt.textHindi}</span>
                                {bilingualMode && optEng && (
                                  <span className="text-[10px] text-slate-500 block font-normal">
                                    ({optEng})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold opacity-60">({String.fromCharCode(65 + oIdx)})</span>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {isGraded && (
                      <div className="mt-2 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                        <strong className="font-bold text-slate-900">व्याख्या (Explanation): </strong>
                        <span className="font-bold text-slate-900">{q.explanationHindi}</span>
                        {bilingualMode && q.explanationEnglish && (
                          <p className="font-bold text-slate-700 italic mt-0.5">{q.explanationEnglish}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Store Worksheet Questions
              (activeWorksheet as WorksheetItem).practiceQuestions.map((q, qIdx) => {
                const userChoice = worksheetAnswers[q.id];
                const optLen = Array.isArray(q.options) ? q.options.length : 0;
                const hasAnswered =
                  typeof userChoice === 'number' &&
                  Number.isInteger(userChoice) &&
                  userChoice >= 0 &&
                  (optLen === 0 || userChoice < optLen);
                const isCorrect = hasAnswered && userChoice === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        {isMistakeRecoveryWorksheet && q.topicNameHindi && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                            सुधार विषय: {q.topicNameHindi}
                          </span>
                        )}
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">
                          {qIdx + 1}. {q.questionHindi}
                          {bilingualMode && q.questionEnglish && (
                            <div className="text-[11px] font-normal text-indigo-700/80 mt-0.5">
                              {q.questionEnglish}
                            </div>
                          )}
                        </h5>
                      </div>
                      {isGraded && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> सही
                            </span>
                          ) : hasAnswered ? (
                            <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> गलत
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              अनुत्तरित (0 अंक)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {(() => {
                        const showUniformEng = shouldShowUniformOptionEnglish(q.options);
                        return q.options.map((opt, oIdx) => {
                          const isChosen = userChoice === oIdx;
                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                          if (isGraded) {
                            if (hasAnswered) {
                              if (oIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                              } else if (isChosen) {
                                btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                              }
                            } else if (oIdx === q.correctIndex) {
                              btnStyle = 'bg-slate-100 border-dashed border-emerald-500 text-slate-800 font-semibold';
                            }
                          } else if (isChosen) {
                            btnStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                          }

                          const optHindi = typeof opt === 'string' ? opt : (opt as any)?.textHindi || String(opt);
                          const optEng = showUniformEng ? getSafeOptionEnglish(opt) : null;

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isGraded}
                              onClick={() => handleSelectAnswer(q.id, oIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <div>
                                <span>{optHindi}</span>
                                {bilingualMode && optEng && (
                                  <span className="text-[10px] text-slate-500 block font-normal">
                                    ({optEng})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold opacity-60">({String.fromCharCode(65 + oIdx)})</span>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {isGraded && (
                      <div className="mt-2 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                        <strong className="font-bold text-slate-900">व्याख्या (Explanation): </strong>
                        <span className="font-bold text-slate-900">{q.explanationHindi}</span>
                        {bilingualMode && q.explanationEnglish && (
                          <p className="font-bold text-slate-700 italic mt-0.5">{q.explanationEnglish}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {!isGraded ? (
              <div className="pt-2 space-y-2">
                {(() => {
                  const activeList = isTeacherLiveWorksheet
                    ? (activeWorksheet as TeacherWorksheet).questions || []
                    : (activeWorksheet as WorksheetItem).practiceQuestions || [];
                  const answeredCount = activeList.filter((q) => {
                    const c = worksheetAnswers[q.id];
                    const optLen = Array.isArray(q.options) ? q.options.length : 0;
                    return typeof c === 'number' && Number.isInteger(c) && c >= 0 && (optLen === 0 || c < optLen);
                  }).length;
                  return (
                    <>
                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <span>
                          उत्तर दिए गए प्रश्न: <strong>{answeredCount} / {activeList.length}</strong>
                        </span>
                        {answeredCount < activeList.length && (
                          <span className="text-amber-700 font-semibold">
                            छूटे हुए प्रश्न रिपोर्ट में अनुत्तरित (Skipped) दिखेंगे
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={answeredCount === 0}
                        onClick={handleGradeWorksheet}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        <span>उत्तर जमा करें व परिणाम देखें (Submit & Grade)</span>
                        <ArrowRight className="w-4 h-4 text-indigo-200" />
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-center text-xs font-bold text-emerald-900 space-y-2">
                  <div>
                    {earnedCoins > 0
                      ? `🎉 मूल्यांकन पूर्ण! आपने +${earnedCoins} WordCoins अर्जित किए (हर 2 सही उत्तर = 1 WordCoin)।`
                      : 'मूल्यांकन पूर्ण! कम से कम 2 सही उत्तर देने पर +1 WordCoin मिलता है।'}
                    {isTeacherLiveWorksheet ? ' आपका यह स्कोर शिक्षक के परिणाम डैशबोर्ड पर दर्ज कर दिया गया है। पुनः प्रयास की अनुमति नहीं है।' : ''}
                  </div>
                  {!isTeacherLiveWorksheet && (
                    <button
                      type="button"
                      onClick={() => {
                        const ws = activeWorksheet as WorksheetItem;
                        setActiveWorksheet({
                          ...ws,
                          practiceQuestions: isMistakeRecoveryWorksheet
                            ? generateExclusiveMistakeRecoverySet(mistakeList)
                            : randomizeQuizSet(ws.practiceQuestions || []),
                        });
                        setWorksheetAnswers({});
                        setIsGraded(false);
                        setScore(0);
                        setEarnedCoins(0);
                      }}
                      className="px-4 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>नए क्रम में पुनः हल करें (Retake)</span>
                    </button>
                  )}
                </div>

                {(() => {
                  const qList = isTeacherLiveWorksheet
                    ? (activeWorksheet as TeacherWorksheet).questions || []
                    : (activeWorksheet as WorksheetItem).practiceQuestions || [];
                  const report = buildWorksheetReport({
                    titleHindi: activeWorksheet.titleHindi,
                    titleEnglish: activeWorksheet.titleEnglish,
                    questions: qList,
                    userAnswers: worksheetAnswers,
                    answerLookupMode: 'byId',
                    fallbackTopicId: isTeacherLiveWorksheet
                      ? (activeWorksheet as TeacherWorksheet).topic
                      : 'mixed_board',
                    fallbackTopicHindi: isTeacherLiveWorksheet
                      ? (activeWorksheet as TeacherWorksheet).topic
                      : (activeWorksheet as WorksheetItem).topicsCovered?.[0] || 'हिंदी व्याकरण',
                    wordCoinsEarned: earnedCoins,
                  });
                  return (
                    <WorksheetReportCard
                      report={report}
                      bilingualMode={bilingualMode}
                      onOpenMistakeRecovery={!isMistakeRecoveryWorksheet ? handleOpenMistakeRecovery : undefined}
                    />
                  );
                })()}
              </div>
            )}
          </div>

          {/* Worksheet Bottom Branding Strip */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/mail.google_a65ce30f.png"
                alt="शब्दशिल्प (ShabdShilp) Logo"
                className="w-9 h-9 rounded-lg object-cover object-center border border-slate-200 bg-[#091124] shrink-0"
              />
              <img
                src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                alt="TechPreneur Logo"
                className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200 object-contain shrink-0"
              />
              <span className="font-bold text-slate-700">शब्दशिल्प (ShabdShilp) • अभ्यास वर्कशीट</span>
            </div>
            <span className="font-semibold text-slate-400">{grade}</span>
          </div>
        </div>
      ) : (
        /* Store Worksheets List */
        <div className="space-y-6">
          {coinNotice && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-900">
              {coinNotice}
            </div>
          )}

          {/* ================= SECTION 1: MISTAKE RECOVERY (TRUTI SUDHAR) ================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xl font-black text-slate-900 font-serif-display">
                भाग १ · त्रुटि सुधार (Mistake Recovery / Truti Sudhar)
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                हमेशा अनलॉक · 0 WordCoins
              </span>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full shadow-2xs">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>हमेशा अनलॉक (Always Unlocked)</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold rounded-full">
                  <Coins className="w-3.5 h-3.5 text-amber-700" />
                  <span>0 WordCoins (निःशुल्क सुधार)</span>
                </span>
              </div>
              {mistakeList.length > 0 && (
                <span className="text-xs font-extrabold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200">
                  {mistakeList.length} प्रकार • {mistakeList.length * 4} लक्ष्य प्रश्न
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-display">
                गलती-सुधार विशेष अभ्यास वर्कशीट (Mistake Recovery Worksheet)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                पूरी वेबसाइट (चेकपॉइंट क्विज़, सिमुलेशन, कस्टम वर्कशीट, उपसर्ग-प्रत्यय, अपठित गद्यांश या स्टोर वर्कशीट्स) में आपसे जो भी प्रश्न गलत हुए हैं, उनके प्रत्येक प्रकार के <strong>कम से कम 4 अनूठे प्रश्न</strong> यहाँ स्वतः जुड़ जाते हैं — और ये <strong>सभी प्रश्न पूरी वेबसाइट के अन्य किसी भी क्विज़ या वर्कशीट से दोहराए नहीं जाते</strong>!
              </p>
            </div>

            {mistakeList.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {mistakeList.map((stat) => (
                    <div
                      key={stat.topicKey}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-emerald-200 text-xs shadow-2xs"
                    >
                      <span className="font-bold text-slate-900">{stat.topicNameHindi}</span>
                      <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                        {stat.wrongCount} त्रुटि
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        4 प्रश्न
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-emerald-200/70">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>सही उत्तर देने पर भी हर 2 सही उत्तर = 1 WordCoin मिलेगा!</span>
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const recoveryQs = generateExclusiveMistakeRecoverySet(mistakeList);
                        printWorksheetDocument({
                          titleHindi: 'गलती-सुधार विशेष अभ्यास वर्कशीट (Mistake Recovery)',
                          subtitle: 'निःशुल्क अभ्यास एवं कमज़ोर विषय सुधार',
                          grade,
                          board: 'ICSE',
                          topic: mistakeList.map((m) => m.topicNameHindi).join(', ') || 'संपूर्ण व्याकरण',
                          questions: recoveryQs,
                          includeAnswers: false,
                          includeEnglish: bilingualMode,
                        });
                      }}
                      className="px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                      title="गलती-सुधार वर्कशीट प्रिंट करें"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                      <span>प्रिंट</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenMistakeRecovery}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>गलती-सुधार वर्कशीट हल करें ({mistakeList.length * 4} प्रश्न)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-white/90 rounded-2xl border border-emerald-200 text-xs text-slate-700 flex items-center justify-between flex-wrap gap-3">
                <span className="flex-1 min-w-[220px] leading-relaxed">
                  अभी तक कोई गलत प्रश्न दर्ज नहीं हुआ है। यह वर्कशीट पहले ही <strong>हमेशा के लिए अनलॉक</strong> है — आप अभी 12 अभ्यास प्रश्नों के साथ इसे खोल सकते हैं, और जैसे-जैसे कोई प्रश्न गलत होगा, उसी प्रकार के 4-4 प्रश्न यहाँ जुड़ते जाएँगे!
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const recoveryQs = generateExclusiveMistakeRecoverySet([]);
                      printWorksheetDocument({
                        titleHindi: 'गलती-सुधार विशेष अभ्यास वर्कशीट (Mistake Recovery)',
                        subtitle: 'निःशुल्क अभ्यास वर्कशीट',
                        grade,
                        board: 'ICSE',
                        topic: 'संपूर्ण व्याकरण',
                        questions: recoveryQs,
                        includeAnswers: false,
                        includeEnglish: bilingualMode,
                      });
                    }}
                    className="px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                    title="गलती-सुधार वर्कशीट प्रिंट करें"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>प्रिंट</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenMistakeRecovery}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>गलती-सुधार वर्कशीट खोलें (12 प्रश्न)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* ================= SECTION 2: ABHYAS PUSTIKA (SAMPLE WORKBOOKS) ================= */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-display">
                  भाग २ · अभ्यास पुस्तिका व सैंपल वर्कशीट्स (Abhyas Pustika / Sample Workbooks)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  अभ्यास पुस्तिका अनलॉक करने के लिए संबंधित व्याकरण सिमुलेशन पाठ पूर्ण करना आवश्यक है।
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                MCQ + अनुच्छेद भाषा परीक्षण + {grade} वर्कशीट्स
              </span>
            </div>

            {/* Subsection 2A: Interactive Sample Workbooks (Zero-Hint Paragraph + MCQ) */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-indigo-800">
                संवादात्मक अभ्यास पुस्तिकाएँ — MCQ + शब्द/वाक्य अनुच्छेद परीक्षण
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {INTERACTIVE_WORKBOOKS.map((wb) => {
                  const gate = checkInteractiveWorkbookGate(wb, grade, {
                    simulationCompletions,
                    completedSimulationModules,
                  });
                  const lastAttempt = [...workbookAttempts]
                    .reverse()
                    .find((a) => a.workbookId === wb.id);

                  return (
                    <div
                      key={wb.id}
                      className={`rounded-3xl p-5 border shadow-xs flex flex-col justify-between space-y-4 ${
                        gate.isUnlockedBySim
                          ? 'bg-white border-indigo-200'
                          : 'bg-slate-50/90 border-slate-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                            {wb.mcqQuestions.length} MCQ + {wb.paragraphQuestions.length} अनुच्छेद
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                              gate.isUnlockedBySim
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {gate.isUnlockedBySim ? (
                              <>
                                <Unlock className="w-3 h-3" /> अनलॉक
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" /> सिमुलेशन लॉक
                              </>
                            )}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 font-serif-display leading-snug">
                          {wb.titleHindi}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {wb.descriptionHindi}
                        </p>

                        {/* Prerequisite Lesson Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {gate.requirements.map((req) => (
                            <span
                              key={req.moduleId}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                req.passed
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {req.titleHindi}: {req.passed ? 'पूर्ण ✅' : `अपूर्ण (${req.completedCount}/${req.requiredCount}) ❌`}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {lastAttempt ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            अंतिम स्कोर: {lastAttempt.percentage}%
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500">
                            0 WordCoins (सिमुलेशन आधारित)
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenInteractiveWorkbook(wb)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                            gate.isUnlockedBySim
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                          }`}
                        >
                          <span>{gate.isUnlockedBySim ? 'परीक्षण शुरू करें' : 'शर्त देखें'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subsection 2B: Grade Store Worksheets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-lg font-black text-slate-900 font-serif-display">
                    {grade} विषयवार स्टोर वर्कशीट्स (Grade Practice Sets)
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold">
                    <Lock className="w-3 h-3" />
                    <span>{gradeStoreWorksheets.length} वर्कशीट्स</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  हर 2 सही उत्तर पर 1 WordCoin मिलता है।
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {gradeStoreWorksheets.map((ws) => {
                  const isUnlocked = unlockedIds.includes(ws.id);
                  const savedResult = completedWorksheetResults?.[ws.id];
                  const gate = checkStoreWorksheetGate(ws, grade, {
                    simulationCompletions,
                    completedSimulationModules,
                  });

                  return (
                    <div
                      key={ws.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src="/assets/aistudio/mail.google_a65ce30f.png"
                              alt="शब्दशिल्प (ShabdShilp) Logo"
                              className="w-10 h-10 rounded-lg object-cover object-center border border-slate-200 bg-[#091124] shrink-0"
                            />
                            <img
                              src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
                              alt="TechPreneur Logo"
                              className="w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-200 object-contain shrink-0"
                            />
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                              {ws.questionCount} प्रश्न
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full">
                            <Coins className="w-3.5 h-3.5 text-amber-700" />
                            <span>{ws.costWordCoins} WordCoins</span>
                          </span>
                        </div>

                        <h4 className="text-xl font-black text-slate-900 font-serif-display">
                          {ws.titleHindi}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {ws.descriptionHindi}
                        </p>

                        {!isUnlocked && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {gate.requirements.map((req) => (
                              <span
                                key={req.moduleId}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                  req.passed
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                              >
                                {req.titleHindi}: {req.passed ? 'पूर्ण ✅' : 'अपूर्ण ❌'}
                              </span>
                            ))}
                          </div>
                        )}

                        {Array.isArray(ws.topicsCovered) && ws.topicsCovered.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ws.topicsCovered.map((topic, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-500">
                          {isUnlocked ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <Unlock className="w-3.5 h-3.5" /> अनलॉक है
                            </span>
                          ) : !gate.isUnlockedBySim ? (
                            <span className="text-rose-700 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> सिमुलेशन पाठ अपूर्ण
                            </span>
                          ) : (
                            <span className="text-amber-700 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> अनलॉक हेतु तैयार
                            </span>
                          )}
                          {savedResult && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              अंतिम स्कोर: {savedResult.score}/{savedResult.maxScore} ({savedResult.percentage}%)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isUnlocked && (
                            <button
                              type="button"
                              onClick={() =>
                                printWorksheetDocument({
                                  titleHindi: ws.titleHindi,
                                  subtitle: ws.titleEnglish,
                                  grade,
                                  board: 'ICSE',
                                  topic: ws.topicsCovered?.join(', '),
                                  questions: ws.practiceQuestions || [],
                                  includeAnswers: false,
                                  includeEnglish: bilingualMode,
                                })
                              }
                              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              title="इस वर्कशीट को प्रिंट या PDF में सहेजें"
                            >
                              <Printer className="w-3.5 h-3.5 text-indigo-600" />
                              <span>प्रिंट</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleUnlock(ws)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isUnlocked
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/25'
                                : !gate.isUnlockedBySim
                                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                : wordCoins >= ws.costWordCoins
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <span>
                              {isUnlocked
                                ? 'वर्कशीट हल करें'
                                : !gate.isUnlockedBySim
                                ? 'आवश्यक पाठ देखें'
                                : 'अनलॉक करें'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prerequisite Gate Modal */}
      {lockedGateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900 font-serif-display">
                  अभ्यास पुस्तिका अभी लॉक है
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>{lockedGateInfo.titleHindi}</strong> को अनलॉक करने के लिए नीचे दिए गए व्याकरण सिमुलेशन पाठ पूर्ण करें:
                </p>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {lockedGateInfo.requirements.map((req, idx) => (
                <div
                  key={req.moduleId}
                  className="flex items-center justify-between gap-2 text-xs bg-white px-3.5 py-2.5 rounded-xl border border-slate-200"
                >
                  <span className="font-bold text-slate-900">
                    पाठ {idx + 1} ({req.titleHindi}):
                  </span>
                  <span
                    className={`font-black ${
                      req.passed ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {req.passed
                      ? `पूर्ण ✅ (${req.completedCount}/${req.requiredCount})`
                      : `अपूर्ण ❌ (${req.completedCount}/${req.requiredCount})`}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => setLockedGateInfo(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                बंद करें
              </button>
              {(() => {
                const firstMissing =
                  lockedGateInfo.requirements.find((r) => !r.passed) ||
                  lockedGateInfo.requirements[0];
                if (!firstMissing || !onOpenSimulationModule) return null;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setLockedGateInfo(null);
                      onOpenSimulationModule(firstMissing.moduleId);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>सिमुलेशन में पाठ पूर्ण करें ({firstMissing.titleHindi})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
