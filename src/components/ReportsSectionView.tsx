import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Download,
  FileBarChart2,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import {
  BoardType,
  CreativeSubmissionRecord,
  GradeLevel,
  SavedReportSummary,
  UserProgressState,
} from '../types';
import { ComprehensiveReportPanel } from './ComprehensiveReportPanel';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { getSimulationMetadata } from '../data/simulationMetadata';
import { deriveReportEnhancedMistakes } from '../data/mistakeRecoveryBank';
import { loadCreativeSubmissions, subscribeToCrossTabUpdates } from '../utils/firebase';
import {
  downloadFullStudentPortfolioReport,
  downloadSavedReportsHtml,
  FullPortfolioReportInput,
  printFullStudentPortfolioReport,
  printSavedReportsDocument,
} from '../utils/printWorksheet';

interface ReportsSectionViewProps {
  progress: UserProgressState;
  grade: GradeLevel;
  selectedBoard: BoardType;
  bilingualMode: boolean;
  currentUser?: { uid?: string; email: string; userName: string; grade: GradeLevel; section?: string } | null;
  onSelectTab: (tab: string) => void;
  onSelectSimulationModule?: (moduleId: string) => void;
}

export const ReportsSectionView: React.FC<ReportsSectionViewProps> = ({
  progress,
  grade,
  selectedBoard,
  bilingualMode,
  currentUser,
  onSelectTab,
  onSelectSimulationModule,
}) => {
  const [reportFilter, setReportFilter] = useState<'all' | 'grammar_module' | 'worksheets' | 'other'>('all');
  const [creativeSubmissions, setCreativeSubmissions] = useState<CreativeSubmissionRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadCreative = async () => {
      try {
        const subs = await loadCreativeSubmissions(currentUser?.email || null);
        if (mounted && Array.isArray(subs)) {
          setCreativeSubmissions(subs);
        }
      } catch {
        // silent fallback
      }
    };
    loadCreative();
    const unsub = subscribeToCrossTabUpdates((data) => {
      if (data.action === 'CREATIVE_SUB_UPDATED') {
        loadCreative();
      }
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [currentUser?.email]);

  const allSavedReports = progress.savedReports || [];
  const chapterReportsCount = allSavedReports.filter((r) => r.sourceType === 'grammar_module').length;
  const completedLessonsCount = (progress.completedSimulationModules || []).length;

  const filteredReports = useMemo(
    () =>
      allSavedReports.filter((rep) => {
        if (reportFilter === 'all') return true;
        if (reportFilter === 'grammar_module') return rep.sourceType === 'grammar_module';
        if (reportFilter === 'worksheets') {
          return (
            rep.sourceType === 'worksheet' ||
            rep.sourceType === 'custom_worksheet' ||
            rep.sourceType === 'checkpoint_quiz'
          );
        }
        return (
          rep.sourceType !== 'grammar_module' &&
          rep.sourceType !== 'worksheet' &&
          rep.sourceType !== 'custom_worksheet' &&
          rep.sourceType !== 'checkpoint_quiz'
        );
      }),
    [allSavedReports, reportFilter]
  );

  const avgReportPercentage =
    allSavedReports.length > 0
      ? Math.round(
          allSavedReports.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0) /
            allSavedReports.length
        )
      : 0;

  const totalReportCoins = allSavedReports.reduce(
    (sum, r) => sum + (Number(r.wordCoinsEarned) || 0),
    0
  );

  const reportEnhancedMistakes = useMemo(
    () =>
      deriveReportEnhancedMistakes({
        mistakeHistory: progress.mistakeHistory || {},
        savedReports: allSavedReports,
        simulationTopicMetrics: progress.simulationTopicMetrics || {},
        workbookAttempts: progress.workbookAttempts || [],
        kathaShilpiPortfolio: progress.kathaShilpiPortfolio || [],
      }),
    [
      progress.mistakeHistory,
      allSavedReports,
      progress.simulationTopicMetrics,
      progress.workbookAttempts,
      progress.kathaShilpiPortfolio,
    ]
  );

  const fullPortfolioPayload: FullPortfolioReportInput = useMemo(() => {
    const curriculum = getCurriculumForGrade(grade);
    const allModuleIds = Array.from(
      new Set([...curriculum.simulationModuleIds, ...(progress.completedSimulationModules || [])])
    );

    const simulationSummaryRows = allModuleIds.map((modId) => {
      const meta = getSimulationMetadata(modId);
      const metric = progress.simulationTopicMetrics?.[modId];
      const completions =
        progress.simulationCompletions?.[modId] ||
        metric?.completions ||
        ((progress.completedSimulationModules || []).includes(modId) ? 1 : 0);
      const avgAccuracyPct =
        metric && metric.totalMaxSum > 0
          ? Math.round((metric.totalScoreSum / metric.totalMaxSum) * 100)
          : metric?.lastAccuracyPct ?? null;
      return {
        titleHindi: meta.uniqueSimNameHindi || modId,
        completions,
        avgAccuracyPct,
      };
    });

    const attempts = progress.workbookAttempts || [];
    const totals = attempts.reduce(
      (acc, a) => {
        acc.mcqC += a.mcqCorrect;
        acc.mcqT += a.mcqTotal;
        acc.selC += a.paraSelectCorrect;
        acc.selT += a.paraSelectTotal;
        acc.bhedC += a.paraBhedCorrect;
        acc.bhedT += a.paraBhedTotal;
        return acc;
      },
      { mcqC: 0, mcqT: 0, selC: 0, selT: 0, bhedC: 0, bhedT: 0 }
    );

    const combinedCreativeMap = new Map<string, CreativeSubmissionRecord>();
    [...creativeSubmissions, ...(progress.kathaShilpiPortfolio || [])].forEach((c) => {
      if (c?.id) combinedCreativeMap.set(c.id, c);
    });

    return {
      studentInfo: {
        userName: currentUser?.userName || progress.userName,
        email: currentUser?.email,
        grade,
        board: selectedBoard,
      },
      simulationSummaryRows,
      workbookSummary: {
        attempts: attempts.length,
        mcqPct: totals.mcqT > 0 ? Math.round((totals.mcqC / totals.mcqT) * 100) : 0,
        selectPct: totals.selT > 0 ? Math.round((totals.selC / totals.selT) * 100) : 0,
        bhedPct: totals.bhedT > 0 ? Math.round((totals.bhedC / totals.bhedT) * 100) : 0,
        rows: attempts.map((a) => ({
          titleHindi: a.titleHindi,
          mcqLabel: `${a.mcqCorrect}/${a.mcqTotal}`,
          selectLabel: `${a.paraSelectCorrect}/${a.paraSelectTotal}`,
          bhedLabel: `${a.paraBhedCorrect}/${a.paraBhedTotal}`,
          percentage: a.percentage,
        })),
      },
      creativePortfolio: Array.from(combinedCreativeMap.values()).map((c) => ({
        titleHindi: c.titleHindi,
        submissionMode: c.submissionMode,
        status: c.status,
        overallScore: c.overallScore,
        submittedAt: c.submittedAt,
      })),
      savedReports: filteredReports.map((r) => ({
        titleHindi: r.titleHindi,
        date: r.date,
        grade: r.grade,
        score: r.score,
        maxScore: r.maxScore,
        attemptedCount: r.attemptedCount,
        unansweredCount: r.unansweredCount,
        percentage: r.percentage,
        wordCoinsEarned: r.wordCoinsEarned,
        weakAreasHindi: r.weakAreasHindi,
        strongAreasHindi: r.strongAreasHindi,
        adviceSummaryHindi: r.adviceSummaryHindi,
      })),
      weakRecoveryTopics: reportEnhancedMistakes.map((m) => m.topicNameHindi),
    };
  }, [
    grade,
    selectedBoard,
    currentUser,
    progress,
    creativeSubmissions,
    filteredReports,
    reportEnhancedMistakes,
  ]);

  const getReportSourceLabel = (sourceType: SavedReportSummary['sourceType']): string => {
    switch (sourceType) {
      case 'grammar_module':
        return 'अध्याय सिमुलेशन (Chapter Report)';
      case 'custom_worksheet':
        return 'कस्टम वर्कशीट';
      case 'worksheet':
        return 'वर्कशीट स्टोर';
      case 'checkpoint_quiz':
        return 'चेकपॉइंट क्विज़';
      case 'gadyansh':
        return 'अपठित गद्यांश';
      case 'upsarg_pratyay':
        return 'उपसर्ग-प्रत्यय';
      case 'weak_areas_review':
        return 'कमज़ोर विषय अभ्यास';
      case 'katha_shilpi':
        return 'कथा शिल्पी';
      default:
        return 'प्रगति रिपोर्ट';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Reports Hero + Print/Download Full Portfolio */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <FileBarChart2 className="w-3.5 h-3.5" />
            <span>डैशबोर्ड विकल्प · संपूर्ण प्रगति रिपोर्ट्स ({selectedBoard} · {grade})</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif-display">
            अध्याय, वर्कशीट व रचनात्मक लेखन रिपोर्ट्स
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-hindi">
            यहाँ आपकी संपूर्ण सिमुलेशन, अभ्यास पुस्तिका, रचनात्मक लेखन व अध्याय रिपोर्ट्स उपलब्ध हैं — आप पूरी रिपोर्ट या किसी भी व्यक्तिगत रिपोर्ट को डाउनलोड तथा प्रिंट कर सकते हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => downloadFullStudentPortfolioReport(fullPortfolioPayload)}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-700" />
            <span>पूरी रिपोर्ट डाउनलोड करें</span>
          </button>
          <button
            type="button"
            onClick={() => printFullStudentPortfolioReport(fullPortfolioPayload)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>पूरी रिपोर्ट प्रिंट करें / PDF</span>
          </button>
        </div>
      </div>

      {/* Report-Linked Mistake Recovery Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-3xl p-5 sm:p-6 border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              रिपोर्ट-आधारित त्रुटि सुधार वर्कशीट (Report-Enhanced Mistake Recovery)
            </h3>
            <p className="text-xs text-slate-600 font-hindi">
              {reportEnhancedMistakes.length > 0
                ? `आपकी रिपोर्ट्स व अभ्यास के आधार पर ${reportEnhancedMistakes.length} कमज़ोर विषय (${reportEnhancedMistakes
                    .slice(0, 4)
                    .map((m) => m.topicNameHindi)
                    .join(', ')}) त्रुटि-सुधार वर्कशीट में स्वतः संकलित कर दिए गए हैं।`
                : 'रिपोर्ट में कोई त्रुटि या कम स्कोर आते ही त्रुटि-सुधार वर्कशीट स्वतः उन विषयों के विशेष प्रश्न तैयार कर देगी।'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('worksheets')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>त्रुटि-सुधार वर्कशीट खोलें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comprehensive Portfolio Analytics */}
      <ComprehensiveReportPanel
        isTeacherView={false}
        grade={grade}
        simulationCompletions={progress.simulationCompletions || {}}
        simulationTopicMetrics={progress.simulationTopicMetrics || {}}
        completedSimulationModules={progress.completedSimulationModules || []}
        workbookAttempts={progress.workbookAttempts || []}
        kathaShilpiPortfolio={progress.kathaShilpiPortfolio || []}
        allCreativeSubmissions={creativeSubmissions}
      />

      {/* Saved Reports Card List with Print & Download */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-700">
              अध्याय व वर्कशीट रिपोर्ट अभिलेख · {selectedBoard} · {grade}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-display">
              सहेजी गई रिपोर्ट्स (Saved Chapter &amp; Worksheet Reports)
            </h3>
            {bilingualMode && (
              <p className="text-xs text-slate-500">
                Download or print your individual or filtered diagnostic reports anytime.
              </p>
            )}
          </div>

          {filteredReports.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  downloadSavedReportsHtml(filteredReports, {
                    userName: currentUser?.userName || progress.userName,
                    email: currentUser?.email,
                    grade,
                  })
                }
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>चयनित रिपोर्ट्स डाउनलोड</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  printSavedReportsDocument(filteredReports, {
                    userName: currentUser?.userName || progress.userName,
                    email: currentUser?.email,
                    grade,
                  })
                }
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>चयनित रिपोर्ट्स प्रिंट / PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500">कुल सहेजी गई रिपोर्ट्स</div>
            <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">
              {allSavedReports.length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">पूर्ण सिमुलेशन अध्याय</div>
            <div className="text-2xl font-black text-emerald-950 tabular-nums mt-1">
              {completedLessonsCount}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <div className="text-[11px] font-bold text-indigo-800">औसत प्रदर्शन स्कोर</div>
            <div className="text-2xl font-black text-indigo-950 tabular-nums mt-1">
              {avgReportPercentage}%
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-900">रिपोर्ट्स से अर्जित सिक्के</div>
            <div className="text-2xl font-black text-amber-950 tabular-nums mt-1">
              +{totalReportCoins}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: `सभी (${allSavedReports.length})` },
              { id: 'grammar_module', label: `अध्याय सिमुलेशन (${chapterReportsCount})` },
              { id: 'worksheets', label: 'वर्कशीट व क्विज़' },
              { id: 'other', label: 'गद्यांश व अन्य' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setReportFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                reportFilter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Cards or Empty State */}
        {filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <FileBarChart2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-slate-900">
              अभी इस श्रेणी में कोई रिपोर्ट सहेजी नहीं गई है
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-hindi leading-relaxed">
              व्याकरण सिमुलेशन, अभ्यास पुस्तिका या वर्कशीट हल करें — आपकी रिपोर्ट स्वतः यहाँ सहेजी जाएगी और आप उसे डाउनलोड तथा प्रिंट कर सकेंगे।
            </p>
            <button
              type="button"
              onClick={() => onSelectTab('modules')}
              className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>व्याकरण सिमुलेशन शुरू करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-[11px] font-bold text-indigo-700">
                        {getReportSourceLabel(rep.sourceType)}
                        {rep.grade ? ` · ${rep.grade}` : ''} · {rep.date}
                      </div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug font-hindi">
                        {rep.titleHindi}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`inline-block font-black px-2.5 py-1 rounded-lg border tabular-nums ${
                          rep.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : rep.percentage >= 50
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {rep.score}/{rep.maxScore} ({rep.percentage}%)
                      </div>
                      {rep.wordCoinsEarned > 0 && (
                        <div className="text-[11px] font-extrabold text-amber-700 mt-1 tabular-nums">
                          +{rep.wordCoinsEarned} WordCoins
                        </div>
                      )}
                    </div>
                  </div>

                  {rep.strongAreasHindi.length > 0 && (
                    <div className="text-[11px] text-emerald-900 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                      <strong>मजबूत पक्ष:</strong> {rep.strongAreasHindi.join(', ')}
                    </div>
                  )}

                  {rep.weakAreasHindi.length > 0 && (
                    <div className="text-[11px] text-rose-900 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                      <strong>सुधार क्षेत्र:</strong> {rep.weakAreasHindi.join(', ')}
                    </div>
                  )}

                  {rep.adviceSummaryHindi && (
                    <p className="text-xs text-slate-700 leading-relaxed font-hindi">
                      <strong>सुझाव:</strong> {rep.adviceSummaryHindi}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                  {rep.moduleId && onSelectSimulationModule ? (
                    <button
                      type="button"
                      onClick={() => onSelectSimulationModule(rep.moduleId!)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>अध्याय दोबारा खोलें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {typeof rep.attemptedCount === 'number'
                        ? `हल: ${rep.attemptedCount}/${rep.maxScore}`
                        : 'खाते में सुरक्षित'}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        downloadSavedReportsHtml([rep], {
                          userName: currentUser?.userName || progress.userName,
                          email: currentUser?.email,
                          grade: rep.grade || grade,
                        })
                      }
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>डाउनलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        printSavedReportsDocument([rep], {
                          userName: currentUser?.userName || progress.userName,
                          email: currentUser?.email,
                          grade: rep.grade || grade,
                        })
                      }
                      className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>प्रिंट</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
