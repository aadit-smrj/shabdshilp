import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Coins,
  FileCheck,
  MousePointerClick,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
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

interface InteractiveWorkbookRunnerProps {
  workbook: InteractiveWorkbookDefinition;
  grade: GradeLevel;
  bilingualMode: boolean;
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
}

export const InteractiveWorkbookRunner: React.FC<InteractiveWorkbookRunnerProps> = ({
  workbook,
  grade,
  bilingualMode,
  onReturn,
  onAddWordCoins,
  onRecordWrongAnswer,
  onRecordReport,
  onRecordWorkbookAttempt,
}) => {
  const [shuffleNonce, setShuffleNonce] = useState<number>(0);
  const mcqs = useMemo(() => {
    void shuffleNonce;
    return randomizeQuizSet(workbook.mcqQuestions || []);
  }, [workbook, shuffleNonce]);

  const paraQuestions = workbook.paragraphQuestions || [];

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [paraSelections, setParaSelections] = useState<Record<string, string | number | null>>({});
  const [paraBheds, setParaBheds] = useState<Record<string, string>>({});
  const [paraRoles, setParaRoles] = useState<Record<string, string>>({});

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [summaryRecord, setSummaryRecord] = useState<WorkbookAttemptRecord | null>(null);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);

  const mcqAnsweredCount = mcqs.filter(
    (q) => typeof mcqAnswers[q.id] === 'number' && mcqAnswers[q.id] >= 0
  ).length;
  const paraAnsweredCount = paraQuestions.filter(
    (pq) => paraSelections[pq.id] !== undefined && paraSelections[pq.id] !== null
  ).length;
  const totalAnswered = mcqAnsweredCount + paraAnsweredCount;
  const totalItems = mcqs.length + paraQuestions.length;

  const handleSubmit = () => {
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
      if (ev.selectionCorrect) {
        paraSelectCorrect++;
      }
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

    // Overall score counts 1 per MCQ + 1 per Paragraph question (when both selection & bhed match, or partial 0.5 rounded cleanly via integers: let's make para items count cleanly as 2 points each or 1 per MCQ + 1 per paraSelect + 1 per paraBhed!)
    // Actually using overallMax = mcqs.length + paraQuestions.length * 2 makes Selection % and Bhed % strictly accurate!
    const overallScore = mcqCorrect + paraSelectCorrect + paraBhedCorrect;
    const overallMax = Math.max(1, mcqs.length + paraQuestions.length * 2);
    const percentage = Math.round((overallScore / overallMax) * 100);

    const coins = overallScore > 0 ? Math.max(1, Math.floor(overallScore / 2)) : 0;

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
      adviceSummaryHindi: `MCQ: ${mcqCorrect}/${mcqs.length} | अनुच्छेद चयन: ${paraSelectCorrect}/${paraQuestions.length} | सटीक भेद पहचान: ${paraBhedCorrect}/${paraQuestions.length}`,
      date: new Date().toLocaleDateString('hi-IN'),
      timestamp: nowIso,
    });
  };

  const handleReset = () => {
    setMcqAnswers({});
    setParaSelections({});
    setParaBheds({});
    setParaRoles({});
    setIsSubmitted(false);
    setSummaryRecord(null);
    setEarnedCoins(0);
    setShuffleNonce((n) => n + 1);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-extrabold">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>संवादात्मक अभ्यास पुस्तिका (MCQ + गद्यांश भाषा परीक्षण)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-display">
            {workbook.titleHindi}
          </h3>
          {bilingualMode && (
            <p className="text-xs text-slate-500">{workbook.titleEnglish}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>स्टोर सूची पर लौटें</span>
        </button>
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

          <div className="grid sm:grid-cols-3 gap-3 text-xs">
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
              <div className="text-indigo-200 font-semibold">भाग B · शब्द/वाक्य चयन सटीकता</div>
              <div className="text-lg font-black text-emerald-300 mt-1 tabular-nums">
                {summaryRecord.paraSelectCorrect} / {summaryRecord.paraSelectTotal} (
                {summaryRecord.paraSelectTotal > 0
                  ? Math.round((summaryRecord.paraSelectCorrect / summaryRecord.paraSelectTotal) * 100)
                  : 0}
                %)
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
              <div className="text-indigo-200 font-semibold">भाग B · सटीक भेद पहचान</div>
              <div className="text-lg font-black text-amber-300 mt-1 tabular-nums">
                {summaryRecord.paraBhedCorrect} / {summaryRecord.paraBhedTotal} (
                {summaryRecord.paraBhedTotal > 0
                  ? Math.round((summaryRecord.paraBhedCorrect / summaryRecord.paraBhedTotal) * 100)
                  : 0}
                %)
              </div>
            </div>
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

      {/* Submit Bar */}
      {!isSubmitted && (
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
            <span>
              प्रगति: <strong>{totalAnswered} / {totalItems}</strong> प्रश्न चयनित (अनुच्छेद प्रश्नों में भेद व भूमिका भी चुनें)
            </span>
          </div>
          <button
            type="button"
            disabled={totalAnswered === 0}
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>अभ्यास पुस्तिका सबमिट करें व परिणाम देखें (Submit &amp; Evaluate)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
