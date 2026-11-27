import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Coins,
  Eye,
  FileBarChart2,
  MousePointerClick,
  PenTool,
  Sparkles,
  Upload,
} from 'lucide-react';
import {
  CreativeSubmissionRecord,
  GradeLevel,
  SimulationTopicMetric,
  WorkbookAttemptRecord,
} from '../types';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { getSimulationMetadata } from '../data/simulationMetadata';
import { getSimCompletionCount } from '../data/interactiveWorkbookData';

interface ComprehensiveReportPanelProps {
  isTeacherView?: boolean;
  grade: GradeLevel;
  simulationCompletions?: Record<string, number>;
  simulationTopicMetrics?: Record<string, SimulationTopicMetric>;
  completedSimulationModules?: string[];
  workbookAttempts?: WorkbookAttemptRecord[];
  kathaShilpiPortfolio?: CreativeSubmissionRecord[];
  allCreativeSubmissions?: CreativeSubmissionRecord[];
  onReviewSubmission?: (
    submissionId: string,
    status: 'Submitted' | 'Reviewed',
    remarks: string
  ) => Promise<void> | void;
}

export const ComprehensiveReportPanel: React.FC<ComprehensiveReportPanelProps> = ({
  isTeacherView = false,
  grade,
  simulationCompletions = {},
  simulationTopicMetrics = {},
  completedSimulationModules = [],
  workbookAttempts = [],
  kathaShilpiPortfolio = [],
  allCreativeSubmissions = [],
  onReviewSubmission,
}) => {
  const curriculum = getCurriculumForGrade(grade);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [remarksDrafts, setRemarksDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const portfolioList: CreativeSubmissionRecord[] = (() => {
    const mergedMap = new Map<string, CreativeSubmissionRecord>();
    [...allCreativeSubmissions, ...kathaShilpiPortfolio].forEach((item) => {
      if (item && item.id) {
        mergedMap.set(item.id, item);
      }
    });
    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  })();

  const workbookSummary = workbookAttempts.reduce(
    (acc, a) => {
      acc.mcqCorrect += a.mcqCorrect || 0;
      acc.mcqTotal += a.mcqTotal || 0;
      acc.paraSelectCorrect += a.paraSelectCorrect || 0;
      acc.paraSelectTotal += a.paraSelectTotal || 0;
      acc.paraBhedCorrect += a.paraBhedCorrect || 0;
      acc.paraBhedTotal += a.paraBhedTotal || 0;
      return acc;
    },
    {
      mcqCorrect: 0,
      mcqTotal: 0,
      paraSelectCorrect: 0,
      paraSelectTotal: 0,
      paraBhedCorrect: 0,
      paraBhedTotal: 0,
    }
  );

  const mcqPct =
    workbookSummary.mcqTotal > 0
      ? Math.round((workbookSummary.mcqCorrect / workbookSummary.mcqTotal) * 100)
      : 0;
  const selectPct =
    workbookSummary.paraSelectTotal > 0
      ? Math.round((workbookSummary.paraSelectCorrect / workbookSummary.paraSelectTotal) * 100)
      : 0;
  const bhedPct =
    workbookSummary.paraBhedTotal > 0
      ? Math.round((workbookSummary.paraBhedCorrect / workbookSummary.paraBhedTotal) * 100)
      : 0;

  const handleTeacherMarkReviewed = async (sub: CreativeSubmissionRecord) => {
    if (!onReviewSubmission) return;
    setSavingId(sub.id);
    try {
      const text = remarksDrafts[sub.id] ?? sub.teacherRemarks ?? 'उत्कृष्ट प्रयास!';
      await onReviewSubmission(sub.id, 'Reviewed', text);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Vyakaran Simulation Topic-wise Completion & Accuracy Analytics */}
      {!isTeacherView && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 font-serif-display">
                  १. व्याकरण सिमुलेशन विषयवार प्रगति ({grade})
                </h4>
                <p className="text-xs text-slate-500">
                  प्रत्येक व्याकरण अध्याय को आपने कितनी बार पूर्ण किया और औसत सटीकता क्या रही
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              {curriculum.simulationModuleIds.length} अध्याय
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {curriculum.simulationModuleIds.map((modId) => {
              const count = getSimCompletionCount(
                { simulationCompletions, completedSimulationModules },
                modId
              );
              const metric = simulationTopicMetrics?.[modId];
              const avgPct =
                metric && metric.totalMaxSum > 0
                  ? Math.round((metric.totalScoreSum / metric.totalMaxSum) * 100)
                  : count > 0
                  ? 100
                  : 0;
              const meta = getSimulationMetadata(modId);

              return (
                <div
                  key={modId}
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    count > 0
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-black text-slate-900 truncate">
                      {meta.uniqueSimNameHindi}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 tabular-nums ${
                        count > 0
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      पूर्ण: {count} बार
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, avgPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>औसत सटीकता</span>
                    <strong className="text-slate-900 tabular-nums">
                      {count > 0 ? `${avgPct}%` : '—'}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Workbook MCQ vs. Interactive Paragraph Selection Accuracy Breakdown */}
      {!isTeacherView && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 font-serif-display">
                  २. अभ्यास पुस्तिका व अनुच्छेद परीक्षण विश्लेषण (MCQ vs. Paragraph)
                </h4>
                <p className="text-xs text-slate-500">
                  मानक MCQ सटीकता बनाम शब्द/वाक्य चयन एवं भेद पहचान की अलग-अलग सटीकता
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600">
              {workbookAttempts.length} प्रयास दर्ज
            </span>
          </div>

          {workbookAttempts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              अभी तक कोई संवादात्मक अभ्यास पुस्तिका हल नहीं की गई है। वर्कशीट्स स्टोर के “भाग २ · अभ्यास पुस्तिका” से परीक्षण हल करें।
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="text-[11px] font-bold text-indigo-800">मानक MCQ सटीकता</div>
                  <div className="text-2xl font-black text-indigo-950 tabular-nums mt-1">
                    {mcqPct}%
                  </div>
                  <div className="text-[11px] text-indigo-700 mt-0.5 tabular-nums">
                    {workbookSummary.mcqCorrect} / {workbookSummary.mcqTotal} सही
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-800">
                    शब्द / वाक्य चयन (Zero-Hint)
                  </div>
                  <div className="text-2xl font-black text-emerald-950 tabular-nums mt-1">
                    {selectPct}%
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 tabular-nums">
                    {workbookSummary.paraSelectCorrect} / {workbookSummary.paraSelectTotal} सही चयन
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="text-[11px] font-bold text-amber-900">सटीक भेद पहचान</div>
                  <div className="text-2xl font-black text-amber-950 tabular-nums mt-1">
                    {bhedPct}%
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5 tabular-nums">
                    {workbookSummary.paraBhedCorrect} / {workbookSummary.paraBhedTotal} पूर्णतः सही
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">अभ्यास पुस्तिका</th>
                      <th className="p-3 font-bold">MCQ</th>
                      <th className="p-3 font-bold">अनुच्छेद चयन</th>
                      <th className="p-3 font-bold">भेद पहचान</th>
                      <th className="p-3 font-bold">समग्र %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...workbookAttempts].reverse().slice(0, 10).map((att) => (
                      <tr key={att.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{att.titleHindi}</td>
                        <td className="p-3 tabular-nums">
                          {att.mcqCorrect}/{att.mcqTotal}
                        </td>
                        <td className="p-3 tabular-nums">
                          {att.paraSelectCorrect}/{att.paraSelectTotal}
                        </td>
                        <td className="p-3 tabular-nums">
                          {att.paraBhedCorrect}/{att.paraBhedTotal}
                        </td>
                        <td className="p-3 font-black text-indigo-800 tabular-nums">
                          {att.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Rachanatmak Lekhan Portfolio (Typed + Handwritten OCR & Teacher Review) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 font-serif-display">
                {isTeacherView
                  ? 'रचनात्मक लेखन एवं हस्तलिखित पोर्टफोलियो (Student Creative Writing & OCR Portfolio)'
                  : '३. रचनात्मक लेखन पोर्टफोलियो (Typed & Handwritten OCR History)'}
              </h4>
              <p className="text-xs text-slate-500">
                टाइप की गई और हस्तलिखित अपलोड रचनाओं का OCR पाठ, व्याकरण-संरचना समीक्षा और शिक्षक स्थिति
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {portfolioList.length} रचनाएँ
          </span>
        </div>

        {portfolioList.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
            अभी तक कोई रचनात्मक लेखन सबमिशन दर्ज नहीं हुआ है। कथा शिल्पी AI स्टूडियो में लिखकर या हस्तलिखित कॉपी अपलोड करके समीक्षा प्राप्त करें।
          </div>
        ) : (
          <div className="space-y-3">
            {portfolioList.map((sub) => {
              const isExpanded = expandedSubId === sub.id;
              return (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                            sub.submissionMode === 'handwritten'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                          }`}
                        >
                          {sub.submissionMode === 'handwritten' ? (
                            <>
                              <Upload className="w-3 h-3" /> हस्तलिखित OCR
                            </>
                          ) : (
                            <>
                              <PenTool className="w-3 h-3" /> टाइप की गई रचना
                            </>
                          )}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                            sub.status === 'Reviewed'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-slate-200 text-slate-800 border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sub.status === 'Reviewed' ? 'Reviewed (समीक्षित)' : 'Submitted (प्रस्तुत)'}</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {sub.grade} · {new Date(sub.submittedAt).toLocaleDateString('hi-IN')}
                        </span>
                      </div>

                      <h5 className="text-sm sm:text-base font-black text-slate-900 font-hindi">
                        {sub.titleHindi}
                      </h5>
                      {isTeacherView && (
                        <div className="text-xs text-slate-600">
                          छात्र: <strong>{sub.studentName}</strong> ({sub.studentEmail})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-indigo-900 tabular-nums">
                        {sub.overallScore}/100
                      </div>
                      {sub.coinsAwarded > 0 && (
                        <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-900 inline-flex items-center gap-1 tabular-nums">
                          <Coins className="w-3.5 h-3.5 text-amber-700" />
                          <span>+{sub.coinsAwarded}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'छिपाएँ' : 'विवरण देखें'}</span>
                      </button>
                    </div>
                  </div>

                  {sub.teacherRemarks && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <strong>शिक्षक टिप्पणी:</strong> {sub.teacherRemarks}
                    </div>
                  )}

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="font-black text-slate-800">पढ़ा गया / प्रस्तुत पाठ:</div>
                        <div className="font-hindi text-slate-800 leading-relaxed whitespace-pre-line">
                          {sub.transcribedText}
                        </div>
                      </div>

                      {sub.structureFeedback && (
                        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                          <strong className="text-indigo-950">प्रारूप व संरचना:</strong>{' '}
                          <span className="text-slate-800">{sub.structureFeedback}</span>
                        </div>
                      )}

                      {Array.isArray(sub.grammarErrors) && sub.grammarErrors.length > 0 && (
                        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                          <strong className="text-rose-950">व्याकरण व वर्तनी सुधार:</strong>
                          <ul className="space-y-1">
                            {sub.grammarErrors.slice(0, 5).map((ge, gi) => (
                              <li key={gi}>
                                <span className="line-through text-rose-700">{ge.originalWord}</span> →{' '}
                                <strong className="text-emerald-800">{ge.correctedWord}</strong> ({ge.explanationHindi})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(sub.vocabularySuggestions) &&
                        sub.vocabularySuggestions.length > 0 && (
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                            <strong className="text-emerald-950 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> शब्दावली व मुहावरे सुझाव:
                            </strong>
                            <ul className="space-y-1">
                              {sub.vocabularySuggestions.map((vs, vi) => (
                                <li key={vi}>
                                  <strong>{vs.muhavaraOrSynonym}</strong> — {vs.usageNoteHindi}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {sub.feedbackHindi && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                          <strong>AI समीक्षा:</strong> {sub.feedbackHindi}
                        </div>
                      )}

                      {isTeacherView && onReviewSubmission && (
                        <div className="p-3.5 rounded-xl bg-white border border-indigo-200 flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={remarksDrafts[sub.id] ?? sub.teacherRemarks ?? ''}
                            onChange={(e) =>
                              setRemarksDrafts((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            placeholder="छात्र के लिए शिक्षक टिप्पणी लिखें..."
                            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-hidden"
                          />
                          <button
                            type="button"
                            disabled={savingId === sub.id}
                            onClick={() => handleTeacherMarkReviewed(sub)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            {savingId === sub.id ? 'सहेजा जा रहा है...' : 'समीक्षित चिह्नित करें (Mark Reviewed)'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
