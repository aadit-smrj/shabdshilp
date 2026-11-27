import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Cable,
  Train,
  Sun,
  Clock,
  Sparkles,
  RotateCcw,
  Layers,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Coins,
  KeyRound,
  FileBarChart2,
  ClipboardCheck,
  Lock,
  Printer,
  Download,
  Award,
  Lightbulb,
  AlertTriangle,
  ListChecks,
} from 'lucide-react';
import {
  ALL_GRAMMAR_MODULES,
  VAKYA_TRAIN_EXAMPLES,
  VACHYA_SPOTLIGHT_ITEMS,
  MUHAVARA_LIST,
} from '../data/grammarData';
import {
  EXTRA_GRAMMAR_MODULES,
  KARAK_CABLES_SCENARIOS,
  EXTRA_VAKYA_TRAIN_EXAMPLES,
  EXTRA_VACHYA_SPOTLIGHT_ITEMS,
  EXTRA_MUHAVARA_LIST,
  UPSARG_PRATYAY_SIM_ITEMS,
  SANDHI_SIM_ITEMS,
  SAMAS_SIM_ITEMS,
  SANGYA_SIM_ITEMS,
  SARVANAM_SIM_ITEMS,
  VISHESHAN_SIM_ITEMS,
  SHABD_BHANDAR_SIM_ITEMS,
  ClassifierSimItem,
} from '../data/expandedSimulationsData';
import { CLASS5_6_MODULES, CLASS5_6_SIM_ITEMS } from '../data/class5And6Data';
import { CLASS7_TO_10_MODULES, CLASS7_TO_10_SIM_ITEMS } from '../data/class7To10Data';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { getChapterCheatNote } from '../data/simulationCheatNotes';
import { getSimulationMetadata } from '../data/simulationMetadata';
import { getSimulationVisual } from '../data/simulationVisuals';
import { getSimCompletionCount } from '../data/interactiveWorkbookData';
import { GradeLevel, GrammarModule, QuizQuestion, BoardType, SavedReportSummary, SimulationTopicMetric } from '../types';
import {
  buildWorksheetReport,
  toSavedReportSummary,
  WorksheetDiagnosticReport,
} from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';
import { GrammarHintSidebar } from './GrammarHintSidebar';
import { MechanismSimulationStage } from './MechanismSimulationStage';
import { ChapterCheatNotesCard } from './ChapterCheatNotesCard';
import {
  printChapterCheatNotes,
  downloadChapterCheatNotes,
} from '../utils/printWorksheet';
import { triggerCoinBurst } from '../utils/confetti';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { EXTRA_MODULE_QUESTIONS } from '../data/siteExtraQuestions';

interface GrammarModulesViewProps {
  grade: GradeLevel;
  selectedBoard?: BoardType;
  bilingualMode: boolean;
  onAddWordCoins: (coins: number) => void;
  onNavigateToUpsarg: () => void;
  onRecordWrongAnswer?: (
    topicOrId: string,
    topicNameHindi?: string,
    topicNameEnglish?: string,
    questionText?: string
  ) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  completedSimulationModules?: string[];
  simulationCompletions?: Record<string, number>;
  simulationTopicMetrics?: Record<string, SimulationTopicMetric>;
  onCompleteSimulationLesson?: (
    moduleId: string,
    stats?: { score: number; maxScore: number; percentage: number }
  ) => void;
  onOpenDashboardReports?: () => void;
  studentName?: string;
  initialModuleId?: string | null;
  focusMode?: boolean;
}

interface RewardBreakdown {
  isFirstCompletion: boolean;
  simulationNotesBonus: number;
  quizCorrectCoins: number;
  masteryBonus: number;
  totalCoins: number;
}

const COMBINED_MODULES: GrammarModule[] = [
  ...ALL_GRAMMAR_MODULES,
  ...EXTRA_GRAMMAR_MODULES,
  ...CLASS5_6_MODULES,
  ...CLASS7_TO_10_MODULES,
];

const ALL_CLASSIFIER_SIM_ITEMS: Record<string, ClassifierSimItem[]> = {
  sangya: SANGYA_SIM_ITEMS,
  sarvanam: SARVANAM_SIM_ITEMS,
  visheshan: VISHESHAN_SIM_ITEMS,
  'shabd-bhandar': SHABD_BHANDAR_SIM_ITEMS,
  ...CLASS5_6_SIM_ITEMS,
  ...CLASS7_TO_10_SIM_ITEMS,
};

const COMBINED_VAKYA = [...VAKYA_TRAIN_EXAMPLES, ...EXTRA_VAKYA_TRAIN_EXAMPLES];
const COMBINED_VACHYA = [...VACHYA_SPOTLIGHT_ITEMS, ...EXTRA_VACHYA_SPOTLIGHT_ITEMS];
const COMBINED_MUHAVARE = [...MUHAVARA_LIST, ...EXTRA_MUHAVARA_LIST];

export const GrammarModulesView: React.FC<GrammarModulesViewProps> = ({
  grade,
  selectedBoard = 'ICSE',
  bilingualMode,
  onAddWordCoins,
  onNavigateToUpsarg,
  onRecordWrongAnswer,
  onRecordReport,
  completedSimulationModules = [],
  simulationCompletions = {},
  simulationTopicMetrics = {},
  onCompleteSimulationLesson,
  onOpenDashboardReports,
  studentName,
  initialModuleId,
  focusMode = false,
}) => {
  const curriculum = getCurriculumForGrade(grade);

  const visibleModules = useMemo<GrammarModule[]>(() => {
    const resolved = curriculum.simulationModuleIds
      .map((id) => COMBINED_MODULES.find((m) => m.id === id))
      .filter((m): m is GrammarModule => Boolean(m));
    return resolved.length > 0 ? resolved : ALL_GRAMMAR_MODULES;
  }, [curriculum.simulationModuleIds]);

  const [activeModuleId, setActiveModuleId] = useState<string>(
    initialModuleId && visibleModules.some((m) => m.id === initialModuleId)
      ? initialModuleId
      : visibleModules[0]?.id || 'karak'
  );

  // Progressive unlock state per chapter (Simulation -> Cheat Codes/Notes below -> Questions below -> Report below)
  const [unlockedNotesModules, setUnlockedNotesModules] = useState<Record<string, boolean>>({});
  const [unlockedQuizModules, setUnlockedQuizModules] = useState<Record<string, boolean>>({});
  const [hintSidebarOpen, setHintSidebarOpen] = useState<boolean>(true);

  // Chapter practice quiz state
  const [quizShuffleNonce, setQuizShuffleNonce] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [activeReport, setActiveReport] = useState<WorksheetDiagnosticReport | null>(null);
  const [rewardBreakdown, setRewardBreakdown] = useState<RewardBreakdown | null>(null);

  const workspaceTopRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialModuleId && visibleModules.some((m) => m.id === initialModuleId)) {
      setActiveModuleId(initialModuleId);
    } else if (!initialModuleId || !visibleModules.some((m) => m.id === activeModuleId)) {
      setActiveModuleId(visibleModules[0]?.id || 'karak');
    }
  }, [grade, initialModuleId, visibleModules]);

  const activeModule = useMemo(
    () =>
      visibleModules.find((m) => m.id === activeModuleId) ||
      visibleModules[0] ||
      ALL_GRAMMAR_MODULES[0],
    [visibleModules, activeModuleId]
  );

  const activeSimMeta = useMemo(
    () =>
      getSimulationMetadata(
        activeModule.id,
        activeModule.interactionNameHindi,
        activeModule.interactionNameEnglish
      ),
    [activeModule]
  );

  const activeCheatNote = useMemo(
    () => getChapterCheatNote(activeModule.id, activeModule),
    [activeModule]
  );

  const activeVisual = useMemo(
    () => getSimulationVisual(activeModule.id),
    [activeModule.id]
  );

  const isLessonCompleted = completedSimulationModules.includes(activeModule.id);
  const isNotesUnlocked = Boolean(isLessonCompleted || unlockedNotesModules[activeModule.id]);
  const isQuizUnlocked = Boolean(isLessonCompleted || unlockedQuizModules[activeModule.id]);

  // Associated chapter practice questions (with shuffled options)
  const activeQuestions = useMemo<QuizQuestion[]>(() => {
    const base = [
      ...(activeModule.quickCheckQuestions || []),
      ...(EXTRA_MODULE_QUESTIONS[activeModule.id] || []),
    ];
    void quizShuffleNonce;
    return randomizeQuizSet(base).slice(0, 12);
  }, [activeModule, grade, quizShuffleNonce]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Reset per-chapter transient quiz/report state when switching modules
  useEffect(() => {
    setQuizAnswers({});
    setActiveReport(null);
    setRewardBreakdown(null);
    setQuizShuffleNonce((n) => n + 1);
  }, [activeModule.id]);

  const handleSelectTopic = (moduleId: string) => {
    setActiveModuleId(moduleId);
    scrollToRef(workspaceTopRef);
  };

  const handleUnlockCheatNotes = () => {
    setUnlockedNotesModules((prev) => ({ ...prev, [activeModule.id]: true }));
    scrollToRef(notesRef);
  };

  const handleProceedToQuestions = () => {
    setUnlockedNotesModules((prev) => ({ ...prev, [activeModule.id]: true }));
    setUnlockedQuizModules((prev) => ({ ...prev, [activeModule.id]: true }));
    setQuizAnswers({});
    setActiveReport(null);
    setRewardBreakdown(null);
    scrollToRef(questionsRef);
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitChapterQuestions = () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const chosen = quizAnswers[idx];
      if (chosen === q.correctIndex) {
        correctCount++;
      } else if (typeof chosen === 'number' && onRecordWrongAnswer) {
        onRecordWrongAnswer(
          q.topicId || activeModule.id,
          q.topicNameHindi || activeModule.titleHindi,
          q.topicNameEnglish || activeModule.titleEnglish,
          q.questionHindi
        );
      }
    });

    const totalQ = activeQuestions.length || 1;
    const pct = Math.round((correctCount / totalQ) * 100);
    const isFirstCompletion = !completedSimulationModules.includes(activeModule.id);

    // Considerable WordCoins scaled by completion + accuracy
    const simulationNotesBonus = isFirstCompletion ? 15 : 0;
    const quizCorrectCoins = isFirstCompletion
      ? correctCount * 2
      : Math.max(pct >= 50 ? 2 : 0, correctCount);
    const masteryBonus = isFirstCompletion
      ? pct >= 90
        ? 15
        : pct >= 75
        ? 10
        : pct >= 50
        ? 5
        : 0
      : pct >= 85
      ? 4
      : 0;
    const totalCoins = simulationNotesBonus + quizCorrectCoins + masteryBonus;

    const breakdown: RewardBreakdown = {
      isFirstCompletion,
      simulationNotesBonus,
      quizCorrectCoins,
      masteryBonus,
      totalCoins,
    };

    const report = buildWorksheetReport({
      titleHindi: `${activeSimMeta.uniqueSimNameHindi} (${activeModule.titleHindi})`,
      titleEnglish: `Chapter Report: ${activeSimMeta.uniqueSimNameEnglish}`,
      questions: activeQuestions,
      userAnswers: quizAnswers,
      answerLookupMode: 'byIndex',
      fallbackTopicId: activeModule.id,
      fallbackTopicHindi: activeModule.titleHindi,
      fallbackTopicEnglish: activeModule.titleEnglish,
      wordCoinsEarned: totalCoins,
    });

    setActiveReport(report);
    setRewardBreakdown(breakdown);

    if (totalCoins > 0) {
      onAddWordCoins(totalCoins);
      triggerCoinBurst();
    }

    if (onCompleteSimulationLesson) {
      onCompleteSimulationLesson(activeModule.id, {
        score: correctCount,
        maxScore: totalQ,
        percentage: pct,
      });
    }

    if (onRecordReport) {
      const savedSummary = toSavedReportSummary(report, {
        id: `sim_${activeModule.id}_${Date.now()}`,
        sourceType: 'grammar_module',
        grade,
      });
      onRecordReport({
        ...savedSummary,
        moduleId: activeModule.id,
      });
    }

    scrollToRef(reportRef);
  };

  const handleRetryQuestions = () => {
    setQuizAnswers({});
    setActiveReport(null);
    setRewardBreakdown(null);
    setQuizShuffleNonce((n) => n + 1);
    scrollToRef(questionsRef);
  };

  const activeModuleIndex = visibleModules.findIndex((m) => m.id === activeModule.id);
  const nextModule =
    activeModuleIndex >= 0 && activeModuleIndex + 1 < visibleModules.length
      ? visibleModules[activeModuleIndex + 1]
      : null;

  const answeredCount = Object.keys(quizAnswers).length;
  const completedInGradeCount = visibleModules.filter((m) =>
    completedSimulationModules.includes(m.id)
  ).length;

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cable':
        return <Cable className="w-4 h-4 shrink-0" />;
      case 'Train':
        return <Train className="w-4 h-4 shrink-0" />;
      case 'Sun':
        return <Sun className="w-4 h-4 shrink-0" />;
      case 'Clock':
        return <Clock className="w-4 h-4 shrink-0" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 shrink-0" />;
      case 'Layers':
        return <Layers className="w-4 h-4 shrink-0" />;
      default:
        return <BookOpen className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="bg-[#060913] text-slate-100 rounded-[2rem] p-4 sm:p-6 lg:p-7 border border-slate-800/90 shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Top Illustrated Observatory Banner */}
      {!focusMode && (
        <div className="relative rounded-3xl border border-slate-800 overflow-hidden bg-[#0B1120] p-5 sm:p-7 shadow-xl">
          <img
            src={activeVisual.imageUrl}
            alt={activeVisual.imageAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/85 to-[#060913]/65 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src="/assets/aistudio/mail.google_a65ce30f.png"
                alt="शब्दशिल्प (ShabdShilp) Logo"
                className="w-14 h-14 rounded-2xl object-cover object-center border border-amber-400/35 bg-[#091124] shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300 tracking-[0.02em]">
                  {selectedBoard} · {grade} · व्याकरण दृश्य-सिमुलेशन प्रयोगशाला ({visibleModules.length} विषय)
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-display">
                  चित्र-अवलोकन व तर्क से व्याकरण की कार्यप्रणाली समझें
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-hindi leading-relaxed">
                  प्रत्येक विषय में एक विशेष चित्र-आधारित सिमुलेशन है:{' '}
                  <strong className="text-amber-300">१. दृश्य व कार्यप्रणाली प्रयोग</strong> →{' '}
                  <strong className="text-slate-100">२. चीट कोड्स व प्रिंट नोट्स</strong> →{' '}
                  <strong className="text-slate-100">३. अभ्यास प्रश्न</strong> →{' '}
                  <strong className="text-emerald-300">४. अध्याय रिपोर्ट + WordCoins</strong>।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-[#070B16]/90 border border-slate-700/80 text-right">
                <div className="text-[11px] font-bold text-slate-400">पूर्ण अध्याय</div>
                <div className="text-lg font-black text-amber-300 tabular-nums">
                  {completedInGradeCount} / {visibleModules.length}
                </div>
              </div>
              {onOpenDashboardReports && (
                <button
                  type="button"
                  onClick={onOpenDashboardReports}
                  className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shadow-md"
                >
                  <FileBarChart2 className="w-4 h-4 shrink-0" />
                  <span>मेरी रिपोर्ट्स देखें</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout: Complete Topic Directory List + Active Vertical Simulation Workbench */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* LEFT COLUMN: Complete Illustrated List of All Topics */}
        <aside className="bg-[#0B1120] rounded-3xl border border-slate-800 shadow-xl overflow-hidden lg:sticky lg:top-24">
          <div className="bg-[#070B16] border-b border-slate-800 text-white px-5 py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ListChecks className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-sm font-black truncate">
                  सभी विषय सूची ({visibleModules.length})
                </h3>
                {bilingualMode && (
                  <p className="text-[10px] text-slate-400 truncate">
                    All {grade} Topics &amp; Visual Labs
                  </p>
                )}
              </div>
            </div>
            <span className="text-[11px] font-black text-amber-300 tabular-nums shrink-0">
              {completedInGradeCount}/{visibleModules.length}
            </span>
          </div>

          <div className="p-2.5 max-h-[360px] lg:max-h-[calc(100vh-190px)] overflow-y-auto space-y-2">
            {visibleModules.map((mod, idx) => {
              const selected = mod.id === activeModule.id;
              const completionCount = getSimCompletionCount(
                { simulationCompletions, completedSimulationModules },
                mod.id
              );
              const done = completionCount > 0 || completedSimulationModules.includes(mod.id);
              const metric = simulationTopicMetrics?.[mod.id];
              const avgPct =
                metric && metric.totalMaxSum > 0
                  ? Math.round((metric.totalScoreSum / metric.totalMaxSum) * 100)
                  : null;
              const meta = getSimulationMetadata(
                mod.id,
                mod.interactionNameHindi,
                mod.interactionNameEnglish
              );
              const modVisual = getSimulationVisual(mod.id);

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelectTopic(mod.id)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    selected
                      ? 'bg-gradient-to-r from-amber-500/20 to-[#111827] text-white border-amber-400/70 shadow-md'
                      : done
                      ? 'bg-emerald-950/35 text-emerald-100 border-emerald-500/35 hover:border-emerald-400/60'
                      : 'bg-[#111827] text-slate-200 border-slate-800 hover:border-amber-400/40 hover:bg-[#151E32]'
                  }`}
                >
                  {/* Miniature Scene Thumbnail */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-[#060913]">
                    <img
                      src={modVisual.imageUrl}
                      alt={mod.titleHindi}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/85 via-transparent to-transparent" />
                    <span
                      className={`absolute bottom-0.5 right-0.5 px-1 rounded text-[9px] font-black tabular-nums ${
                        selected
                          ? 'bg-amber-400 text-slate-950'
                          : done
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#060913]/85 text-slate-200'
                      }`}
                    >
                      {done && !selected ? '✓' : String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-black truncate">{mod.titleHindi}</span>
                      <span
                        className={`text-[10px] font-bold shrink-0 tabular-nums ${
                          done
                            ? selected
                              ? 'text-amber-300'
                              : 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {completionCount > 0 ? `पूर्ण: ${completionCount} बार` : 'अपूर्ण'}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] font-semibold truncate mt-0.5 flex items-center justify-between gap-1 ${
                        selected ? 'text-amber-200' : 'text-slate-400'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1 min-w-0 truncate">
                        {getModuleIcon(mod.iconName)}
                        <span className="truncate">{meta.uniqueSimNameHindi}</span>
                      </span>
                      {avgPct !== null && (
                        <span className="text-[9px] font-bold text-slate-300 shrink-0 tabular-nums">
                          {avgPct}%
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Chapter Vertical Simulation -> Cheat Notes -> Questions -> Report */}
        <div ref={workspaceTopRef} className="space-y-6 min-w-0">
          {/* Active Topic Header Card with Subtle Scene Backdrop */}
          <div className="relative bg-[#0B1120] rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 overflow-hidden">
            <img
              src={activeVisual.secondaryImageUrl}
              alt=""
              aria-hidden="true"
              className="hidden sm:block absolute right-0 top-0 h-full w-1/2 object-cover opacity-15 pointer-events-none select-none"
            />
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/95 to-[#0B1120]/70 pointer-events-none" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs font-black">
                    {getModuleIcon(activeModule.iconName)}
                    <span>{activeSimMeta.uniqueSimNameHindi}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#111827] border border-slate-700 text-slate-300 text-[11px] font-bold">
                    {selectedBoard} {grade} · विषय #{activeModuleIndex + 1}
                  </span>
                  {(() => {
                    const activeCount = getSimCompletionCount(
                      { simulationCompletions, completedSimulationModules },
                      activeModule.id
                    );
                    if (activeCount <= 0) return null;
                    return (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold inline-flex items-center gap-1 tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>अध्याय पूर्ण: {activeCount} बार</span>
                      </span>
                    );
                  })()}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif-display leading-tight">
                  {activeModule.titleHindi}{' '}
                  <span className="text-base sm:text-lg font-bold text-slate-400">
                    ({activeSimMeta.uniqueSimNameEnglish})
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-hindi leading-relaxed">
                  {activeModule.subtitleHindi}
                </p>
                {bilingualMode && activeModule.subtitleEnglish && (
                  <p className="text-xs text-amber-300/80 italic">
                    {activeModule.subtitleEnglish}
                  </p>
                )}
              </div>

              {/* Bottleneck Insight Box */}
              {activeModule.bottleneckHindi && (
                <div className="xl:max-w-sm rounded-2xl bg-rose-950/35 border border-rose-500/35 p-4 space-y-1 shrink-0 backdrop-blur-xs">
                  <div className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>समस्या का केंद्र (The Bottleneck):</span>
                  </div>
                  <p className="text-xs font-semibold text-rose-100 font-hindi leading-relaxed">
                    {activeModule.bottleneckHindi}
                  </p>
                  {bilingualMode && activeModule.bottleneckEnglish && (
                    <p className="text-[11px] text-rose-300/80 italic">
                      {activeModule.bottleneckEnglish}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4-Stage Guided Jump Bar */}
            <div className="relative z-10 grid grid-cols-2 xl:grid-cols-4 gap-2 pt-3 border-t border-slate-800">
              {(
                [
                  {
                    id: 'sim',
                    stepNo: '१',
                    label: 'दृश्य व सिमुलेशन प्रयोग',
                    sub: 'Visual & Mechanism',
                    unlocked: true,
                    done: isNotesUnlocked,
                    ref: simulationRef,
                  },
                  {
                    id: 'notes',
                    stepNo: '२',
                    label: 'चीट कोड्स व प्रिंट नोट्स',
                    sub: 'Download & Print',
                    unlocked: isNotesUnlocked,
                    done: isQuizUnlocked,
                    ref: notesRef,
                  },
                  {
                    id: 'questions',
                    stepNo: '३',
                    label: `अध्याय प्रश्न (${activeQuestions.length})`,
                    sub: 'Associated Quiz',
                    unlocked: isQuizUnlocked,
                    done: Boolean(activeReport) || isLessonCompleted,
                    ref: questionsRef,
                  },
                  {
                    id: 'report',
                    stepNo: '४',
                    label: 'रिपोर्ट व WordCoins',
                    sub: 'Saved to Reports',
                    unlocked: Boolean(activeReport),
                    done: Boolean(activeReport),
                    ref: reportRef,
                  },
                ] as const
              ).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  disabled={!step.unlocked}
                  onClick={() => step.unlocked && scrollToRef(step.ref)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    step.done
                      ? 'bg-emerald-950/40 text-emerald-100 border-emerald-500/40 hover:border-emerald-400 cursor-pointer'
                      : step.unlocked
                      ? 'bg-[#111827] text-white border-amber-400/50 shadow-sm cursor-pointer'
                      : 'bg-[#070B16]/70 text-slate-500 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      step.done
                        ? 'bg-emerald-500 text-slate-950'
                        : step.unlocked
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step.unlocked ? (
                      step.done ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        step.stepNo
                      )
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black truncate">{step.label}</div>
                    {bilingualMode && (
                      <div
                        className={`text-[10px] truncate ${
                          step.done
                            ? 'text-emerald-300'
                            : step.unlocked
                            ? 'text-amber-300/80'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.sub}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ==================================================================== */}
          {/* SECTION 1: INTERACTIVE MECHANISM & IMAGE INTERPRETIVE SIMULATION     */}
          {/* ==================================================================== */}
          <div ref={simulationRef}>
            <MechanismSimulationStage
              moduleId={activeModule.id}
              moduleObj={activeModule}
              cheatNote={activeCheatNote}
              bilingualMode={bilingualMode}
              karakScenarios={KARAK_CABLES_SCENARIOS}
              vakyaItems={COMBINED_VAKYA}
              vachyaItems={COMBINED_VACHYA}
              muhavaraItems={COMBINED_MUHAVARE}
              affixItems={UPSARG_PRATYAY_SIM_ITEMS}
              sandhiItems={SANDHI_SIM_ITEMS}
              samasItems={SAMAS_SIM_ITEMS}
              classifierItems={ALL_CLASSIFIER_SIM_ITEMS[activeModule.id] || []}
              isAlreadyUnlocked={isNotesUnlocked}
              onUnlockCheatNotes={handleUnlockCheatNotes}
              onNavigateToUpsarg={onNavigateToUpsarg}
            />
          </div>

          {/* ==================================================================== */}
          {/* SECTION 2 (BELOW SIMULATION): CHEAT CODES & PRINTABLE NOTES          */}
          {/* ==================================================================== */}
          <div ref={notesRef}>
            {!isNotesUnlocked ? (
              <div className="bg-[#0B1120] rounded-3xl border border-dashed border-slate-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111827] border border-slate-700 text-amber-300 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-black text-slate-100">
                      चरण २ · अध्याय चीट कोड्स व डाउनलोड/प्रिंट योग्य नोट्स ({activeModule.titleHindi})
                    </div>
                    <p className="text-xs text-slate-400 font-hindi">
                      ऊपर दिए गए सिमुलेशन में कम-से-कम ३ दृश्य-संकेत या प्रयोग परखने के बाद यहाँ कीवर्ड चीट कोड्स, नियम-तालिका और प्रिंट/डाउनलोड नोट्स खुलेंगे।
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-300 whitespace-nowrap shrink-0">
                  सिमुलेशन पूर्ण करें ↑
                </span>
              </div>
            ) : (
              <ChapterCheatNotesCard
                note={activeCheatNote}
                grade={grade}
                selectedBoard={selectedBoard}
                bilingualMode={bilingualMode}
                shloka={activeModule.paramparaCorner?.classicalShlokaOrRule}
                studentName={studentName}
                questionCount={activeQuestions.length}
                onProceedToQuestions={handleProceedToQuestions}
                compactMode={isQuizUnlocked}
                darkTheme={true}
              />
            )}
          </div>

          {/* ==================================================================== */}
          {/* SECTION 3 (BELOW CHEAT NOTES): ASSOCIATED PRACTICE QUESTIONS         */}
          {/* ==================================================================== */}
          <div ref={questionsRef}>
            {isNotesUnlocked && !isQuizUnlocked && (
              <div className="bg-[#0B1120] rounded-3xl border border-amber-400/35 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-amber-300 uppercase">
                    चरण ३ · अगला कदम
                  </div>
                  <div className="text-sm sm:text-base font-black text-white font-hindi">
                    चीट कोड्स व नोट्स पढ़ने के बाद नीचे {activeQuestions.length} अभ्यास प्रश्न हल करें
                  </div>
                  <p className="text-xs text-slate-400">
                    सबमिट करते ही अध्याय रिपोर्ट ‘Reports’ टैब में सहेजी जाएगी और पर्याप्त WordCoins मिलेंगे।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToQuestions}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap shrink-0"
                >
                  <ClipboardCheck className="w-4 h-4 shrink-0" />
                  <span>अभ्यास प्रश्न खोलें ({activeQuestions.length})</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}

            {isQuizUnlocked && (
              <div className="space-y-5">
                {/* Quiz Header Strip */}
                <div className="bg-[#0B1120] rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold text-amber-300">
                      चरण ३ · अध्याय अभ्यास प्रश्न ({activeModule.titleHindi})
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 tabular-nums">
                      हल किए गए प्रश्न: <strong className="text-white">{answeredCount}</strong> /{' '}
                      {activeQuestions.length} · सही उत्तर व पूर्णता पर 35–55 WordCoins मिलेंगे।
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => scrollToRef(notesRef)}
                      className="px-3.5 py-2 rounded-xl border border-amber-400/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span>ऊपर चीट कोड्स देखें</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        printChapterCheatNotes(activeCheatNote, {
                          grade,
                          board: selectedBoard,
                          studentName,
                          shloka: activeModule.paramparaCorner?.classicalShlokaOrRule,
                        })
                      }
                      className="px-3 py-2 rounded-xl border border-slate-700 bg-[#111827] hover:bg-slate-800 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 shrink-0" />
                      <span>नोट्स प्रिंट</span>
                    </button>
                  </div>
                </div>

                {/* Questions + Grammar Hint Sidebar */}
                <div className="grid xl:grid-cols-[1fr_300px] gap-6 items-start">
                  <div className="space-y-4">
                    {activeQuestions.map((q, qIdx) => {
                      const chosen = quizAnswers[qIdx];
                      return (
                        <div
                          key={q.id || qIdx}
                          className="bg-[#0B1120] rounded-2xl border border-slate-800 p-5 space-y-3.5 shadow-lg"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="text-[11px] font-bold text-amber-300 tabular-nums">
                                प्रश्न {qIdx + 1} / {activeQuestions.length}
                                {q.difficulty ? ` · ${q.difficulty}` : ''}
                              </div>
                              <h4 className="text-sm sm:text-base font-extrabold text-white font-hindi leading-relaxed">
                                {q.questionHindi}
                              </h4>
                              {bilingualMode && q.questionEnglish && (
                                <p className="text-xs text-slate-400">{q.questionEnglish}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = chosen === optIdx;
                              const labelLetter = String.fromCharCode(65 + optIdx);
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                                    isSelected
                                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                                      : 'bg-[#111827] hover:bg-[#162036] text-slate-100 border-slate-800 hover:border-amber-400/50'
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'bg-slate-950 text-amber-300'
                                        : 'bg-[#070B16] border border-slate-700 text-amber-300'
                                    }`}
                                  >
                                    {labelLetter}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs sm:text-sm font-bold font-hindi leading-snug">
                                      {opt.textHindi}
                                    </div>
                                    {bilingualMode && opt.textEnglish && (
                                      <div
                                        className={`text-[11px] mt-0.5 ${
                                          isSelected ? 'text-slate-800' : 'text-slate-400'
                                        }`}
                                      >
                                        {opt.textEnglish}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {q.ruleTipHindi && (
                            <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5 font-hindi">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>संकेत: {q.ruleTipHindi}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Submit Bar */}
                    <div className="bg-[#070B16] border border-slate-800 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                      <div className="space-y-0.5">
                        <div className="text-sm font-black">
                          क्या आपने सभी प्रश्न जाँच लिए? ({answeredCount}/{activeQuestions.length} हल)
                        </div>
                        <div className="text-xs text-slate-400">
                          सबमिट करते ही अध्याय पूर्ण होगा, रिपोर्ट ‘Reports’ टैब में सहेजी जाएगी और WordCoins मिलेंगे।
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={answeredCount === 0}
                        onClick={handleSubmitChapterQuestions}
                        className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                          answeredCount > 0
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>अध्याय सबमिट करें व रिपोर्ट पाएँ</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div className="xl:sticky xl:top-24">
                    <GrammarHintSidebar
                      currentModule={activeModule}
                      grade={grade}
                      selectedBoard={selectedBoard}
                      bilingualMode={bilingualMode}
                      isOpen={hintSidebarOpen}
                      onToggleOpen={() => setHintSidebarOpen((v) => !v)}
                      darkTheme={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================================================================== */}
          {/* SECTION 4 (BELOW QUESTIONS): CHAPTER REPORT & WORDCOINS REWARD       */}
          {/* ==================================================================== */}
          <div ref={reportRef}>
            {activeReport && rewardBreakdown && (
              <div className="space-y-6">
                {/* Lesson Completed + Reward Breakdown Hero */}
                <div className="bg-[#0B1120] text-white rounded-3xl p-6 sm:p-7 border border-amber-400/35 shadow-2xl space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        <Award className="w-4 h-4" />
                        <span>अध्याय सफलतापूर्वक पूर्ण (Lesson Completed &amp; Saved)</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black font-serif-display">
                        {activeModule.titleHindi} — अध्याय रिपोर्ट सहेजी गई!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-hindi">
                        आपकी यह अध्याय रिपोर्ट डैशबोर्ड के नए <strong>“रिपोर्ट्स (Reports)”</strong> टैब में स्वतः सहेज दी गई है।
                      </p>
                    </div>

                    <div className="px-5 py-4 rounded-2xl bg-amber-400 text-slate-950 shrink-0 text-center">
                      <div className="text-[11px] font-black uppercase tracking-wider">
                        अर्जित पुरस्कार
                      </div>
                      <div className="text-3xl font-black tabular-nums flex items-center justify-center gap-1.5 mt-0.5">
                        <Coins className="w-6 h-6" />
                        <span>+{rewardBreakdown.totalCoins}</span>
                      </div>
                      <div className="text-xs font-extrabold">WordCoins</div>
                    </div>
                  </div>

                  {/* Transparent Coin Breakdown */}
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#070B16] border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">सिमुलेशन व नोट्स पूर्ण बोनस</span>
                      <strong className="text-amber-300 font-black tabular-nums">
                        +{rewardBreakdown.simulationNotesBonus} Coins
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#070B16] border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">
                        सही उत्तर ({activeReport.correctCount}/{activeReport.totalQuestions})
                      </span>
                      <strong className="text-amber-300 font-black tabular-nums">
                        +{rewardBreakdown.quizCorrectCoins} Coins
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#070B16] border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">
                        सटीकता दक्षता बोनस ({activeReport.percentage}%)
                      </span>
                      <strong className="text-amber-300 font-black tabular-nums">
                        +{rewardBreakdown.masteryBonus} Coins
                      </strong>
                    </div>
                  </div>

                  {/* Primary Navigation Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {onOpenDashboardReports && (
                      <button
                        type="button"
                        onClick={onOpenDashboardReports}
                        className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <FileBarChart2 className="w-4 h-4 shrink-0" />
                        <span>डैशबोर्ड के ‘Reports’ टैब में देखें</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        downloadChapterCheatNotes(activeCheatNote, {
                          grade,
                          board: selectedBoard,
                          studentName,
                          shloka: activeModule.paramparaCorner?.classicalShlokaOrRule,
                        })
                      }
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>चीट नोट्स डाउनलोड</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRetryQuestions}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>पुनः अभ्यास करें</span>
                    </button>

                    {nextModule && (
                      <button
                        type="button"
                        onClick={() => handleSelectTopic(nextModule.id)}
                        className="xl:ml-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <span>अगला विषय: {nextModule.titleHindi}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Full Detailed Chapter Diagnostic Report Card */}
                <WorksheetReportCard
                  report={activeReport}
                  bilingualMode={bilingualMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
