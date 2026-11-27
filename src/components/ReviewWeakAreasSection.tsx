import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  CheckSquare,
  Coins,
  RotateCcw,
  Sparkles,
  Square,
  Target,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  GradeLevel,
  MistakeTopicStat,
  QuizQuestion,
  SavedReportSummary,
} from '../types';
import { buildWeakAreasMiniQuiz, sanitizeMistakeSampleQuestions } from '../data/worksheetBank';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';

interface ReviewWeakAreasSectionProps {
  mistakeHistory: Record<string, MistakeTopicStat>;
  grade: GradeLevel;
  bilingualMode: boolean;
  onAddWordCoins: (coins: number) => void;
  onRecordWrongAnswer?: (
    topicOrId: string,
    topicNameHindi?: string,
    topicNameEnglish?: string,
    questionText?: string
  ) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  onResolveWeakTopic?: (topicKey: string) => void;
  onStartCheckpointQuiz?: (mode: 'pre' | 'post') => void;
}

const getSafeOptionEnglish = (opt: unknown): string | null => {
  if (!opt || typeof opt !== 'object') return null;
  const rawValue = (opt as { textEnglish?: unknown }).textEnglish;
  const raw = typeof rawValue === 'string' ? rawValue.trim() : '';
  if (
    !raw ||
    /^(correct\s*(option|answer|formula)|wrong\s*(option|answer)|incorrect\s*\w*|generic\s*placeholder|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i.test(
      raw
    )
  ) {
    return null;
  }
  return raw;
};

const shouldShowUniformOptionEnglish = (options: unknown): boolean => {
  if (!Array.isArray(options) || options.length === 0) return false;
  return options.every((opt) => getSafeOptionEnglish(opt) !== null);
};

export const ReviewWeakAreasSection: React.FC<ReviewWeakAreasSectionProps> = ({
  mistakeHistory,
  grade,
  bilingualMode,
  onAddWordCoins,
  onRecordWrongAnswer,
  onRecordReport,
  onResolveWeakTopic,
  onStartCheckpointQuiz,
}) => {
  const weakStats = useMemo(() => {
    return Object.values(mistakeHistory || {})
      .filter((stat) => stat && stat.wrongCount > 0)
      .sort((a, b) => {
        if ((b.wrongCount || 0) !== (a.wrongCount || 0)) {
          return (b.wrongCount || 0) - (a.wrongCount || 0);
        }
        return String(b.lastWrongAt || '').localeCompare(String(a.lastWrongAt || ''));
      });
  }, [mistakeHistory]);

  const totalMistakesCount = useMemo(
    () => weakStats.reduce((sum, s) => sum + (s.wrongCount || 0), 0),
    [weakStats]
  );

  const [selectedTopicKeys, setSelectedTopicKeys] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [phase, setPhase] = useState<'overview' | 'quiz' | 'results'>('overview');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [quizTitle, setQuizTitle] = useState<{ hi: string; en: string }>({
    hi: 'कमज़ोर विषयों का पुनरावलोकन मिनी-क्विज़',
    en: 'Review Weak Areas Mini-Quiz',
  });

  // Sync selected keys when mistakeHistory changes while on overview
  useEffect(() => {
    if (phase !== 'overview') return;
    const validKeys = weakStats.map((s) => s.topicKey);
    setSelectedTopicKeys((prev) => {
      const kept = prev.filter((k) => validKeys.includes(k));
      return kept.length > 0 ? kept : validKeys;
    });
  }, [weakStats, phase]);

  const toggleTopicSelection = (topicKey: string) => {
    setSelectedTopicKeys((prev) => {
      if (prev.includes(topicKey)) {
        if (prev.length === 1) return prev;
        return prev.filter((k) => k !== topicKey);
      }
      return [...prev, topicKey];
    });
  };

  const startMiniQuiz = (overrideTopicKeys?: string[], overrideCount?: number) => {
    const keysToUse =
      overrideTopicKeys && overrideTopicKeys.length > 0
        ? overrideTopicKeys
        : selectedTopicKeys.length > 0
        ? selectedTopicKeys
        : weakStats.map((s) => s.topicKey);

    const countToUse = overrideCount || questionCount;
    const generated = buildWeakAreasMiniQuiz(weakStats, countToUse, keysToUse);
    if (generated.length === 0) return;

    const matchedTopics = weakStats.filter((s) => keysToUse.includes(s.topicKey));
    const titleHi =
      matchedTopics.length === 1
        ? `पुनः अभ्यास मिनी-क्विज़: ${matchedTopics[0].topicNameHindi}`
        : `कमज़ोर विषयों का पुनरावलोकन (${matchedTopics.length} विषय)`;
    const titleEn =
      matchedTopics.length === 1
        ? `Weak Area Re-Test: ${matchedTopics[0].topicNameEnglish}`
        : `Review Weak Areas Mini-Quiz (${matchedTopics.length} Topics)`;

    setQuizTitle({ hi: titleHi, en: titleEn });
    setQuizQuestions(generated);
    setCurrentIdx(0);
    setSelectedOption(null);
    setUserAnswers({});
    setEarnedCoins(0);
    setPhase('quiz');
  };

  const currentQuestion = quizQuestions[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(optionIdx);
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));

    if (optionIdx !== currentQuestion.correctIndex && onRecordWrongAnswer) {
      onRecordWrongAnswer(
        currentQuestion.topicId,
        currentQuestion.topicNameHindi,
        currentQuestion.topicNameEnglish,
        currentQuestion.questionHindi
      );
    }
  };

  const handleAdvanceQuiz = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      return;
    }

    const correctTotal = quizQuestions.reduce(
      (sum, q) => sum + (userAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const coins = Math.floor(correctTotal / 2);
    setEarnedCoins(coins);
    if (coins > 0) {
      onAddWordCoins(coins);
    }

    const diagnostic = buildWorksheetReport({
      titleHindi: quizTitle.hi,
      titleEnglish: quizTitle.en,
      questions: quizQuestions,
      userAnswers,
      answerLookupMode: 'byId',
      fallbackTopicId: 'mixed_board',
      fallbackTopicHindi: 'कमज़ोर विषय अभ्यास',
      wordCoinsEarned: coins,
    });

    if (onRecordReport) {
      onRecordReport(
        toSavedReportSummary(diagnostic, {
          id: `rep_weak_review_${Date.now()}`,
          sourceType: 'weak_areas_review',
          grade,
        })
      );
    }

    setPhase('results');
  };

  const finalReport = useMemo(() => {
    if (phase !== 'results' || quizQuestions.length === 0) return null;
    return buildWorksheetReport({
      titleHindi: quizTitle.hi,
      titleEnglish: quizTitle.en,
      questions: quizQuestions,
      userAnswers,
      answerLookupMode: 'byId',
      fallbackTopicId: 'mixed_board',
      fallbackTopicHindi: 'कमज़ोर विषय अभ्यास',
      wordCoinsEarned: earnedCoins,
    });
  }, [phase, quizQuestions, userAnswers, quizTitle, earnedCoins]);

  // Identify weak topics from mistakeHistory that the student aced (100%) in this mini-quiz
  const masteredInRetest = useMemo(() => {
    if (!finalReport) return [];
    const weakKeySet = new Set(weakStats.map((s) => s.topicKey));
    return finalReport.topicBreakdown.filter(
      (t) => t.percentage === 100 && t.total > 0 && weakKeySet.has(t.key)
    );
  }, [finalReport, weakStats]);

  const formatShortDate = (iso: string): string => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  return (
    <section
      id="review-weak-areas-section"
      aria-label="Review Weak Areas"
      className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif-display flex items-center gap-2 flex-wrap">
              <span>कमज़ोर क्षेत्रों का पुनरावलोकन</span>
              {bilingualMode && (
                <span className="text-sm font-bold text-indigo-700">(Review Weak Areas)</span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {weakStats.length > 0
                ? 'आपके त्रुटि इतिहास (mistakeHistory) से सीधे प्रश्न चुनकर पुनः परीक्षण मिनी-क्विज़ तैयार किया गया है।'
                : 'वर्कशीट, क्विज़ या सिमुलेशन में गलत हुए प्रश्नों के विषय यहाँ सहेजे जाते हैं ताकि आप उनका पुनः अभ्यास कर सकें।'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {weakStats.length > 0 ? (
            <>
              <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-800 rounded-full border border-rose-200">
                {weakStats.length} कमज़ोर विषय
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                कुल त्रुटियाँ: {totalMistakesCount}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              कोई लंबित त्रुटि नहीं ✓
            </span>
          )}
        </div>
      </div>

      {/* EMPTY STATE */}
      {weakStats.length === 0 && phase === 'overview' && (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                अभी तक आपके खाते में कोई कमज़ोर विषय दर्ज नहीं है!
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              जब भी आप कोई प्री/पोस्ट क्विज़, वर्कशीट या अपठित गद्यांश हल करते समय किसी प्रश्न में गलती करेंगे, वह विषय और प्रश्न-संदर्भ स्वतः यहाँ जुड़ जाएगा — ताकि आप तुरंत एक मिनी-क्विज़ देकर अपनी पकड़ मज़बूत कर सकें।
            </p>
          </div>

          {onStartCheckpointQuiz && (
            <button
              type="button"
              onClick={() => onStartCheckpointQuiz('pre')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>प्री-चेकपॉइंट क्विज़ से जाँच करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* PHASE 1: OVERVIEW OF MISTAKE HISTORY + MINI-QUIZ BUILDER */}
      {weakStats.length > 0 && phase === 'overview' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700">
              पुनः अभ्यास (Re-test) के लिए कमज़ोर विषय चुनें:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTopicKeys(weakStats.map((s) => s.topicKey))}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
              >
                सभी चुनें ({weakStats.length})
              </button>
              {weakStats.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedTopicKeys([weakStats[0].topicKey])}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                >
                  केवल शीर्ष कमज़ोरी
                </button>
              )}
            </div>
          </div>

          {/* Weak Area Cards Grid */}
          <div className="grid md:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
            {weakStats.map((stat) => {
              const isSelected = selectedTopicKeys.includes(stat.topicKey);
              const dateText = formatShortDate(stat.lastWrongAt);
              const snippets = sanitizeMistakeSampleQuestions(stat.sampleQuestions).slice(0, 2);

              return (
                <div
                  key={stat.topicKey}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-rose-50/40 border-rose-300 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTopicSelection(stat.topicKey)}
                      className="flex items-start gap-2.5 text-left cursor-pointer flex-1"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {stat.topicNameHindi}
                        </h4>
                        {bilingualMode && stat.topicNameEnglish && (
                          <span className="text-[11px] text-slate-500 block">
                            {stat.topicNameEnglish}
                          </span>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                        {stat.wrongCount} त्रुटि
                      </span>
                      {dateText && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {dateText}
                        </span>
                      )}
                    </div>
                  </div>

                  {snippets.length > 0 && (
                    <div className="pl-6 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        पिछले गलत प्रश्न (From Mistake History):
                      </span>
                      {snippets.map((qText, idx) => (
                        <p
                          key={idx}
                          className="text-[11px] text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 line-clamp-2"
                        >
                          • {qText}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="pl-6 flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => startMiniQuiz([stat.topicKey], 5)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>इस विषय का 5-प्रश्न मिनी-क्विज़ लें</span>
                    </button>

                    {onResolveWeakTopic && (
                      <button
                        type="button"
                        onClick={() => onResolveWeakTopic(stat.topicKey)}
                        title="इस विषय को कमज़ोर सूची से हटाएँ"
                        className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini-Quiz Launch Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700">प्रश्नों की संख्या (Mini-Quiz Size):</span>
              {[5, 6, 8, 10].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cnt} प्रश्न
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={selectedTopicKeys.length === 0}
              onClick={() => startMiniQuiz()}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>
                मिनी-क्विज़ शुरू करें ({questionCount} प्रश्न • {selectedTopicKeys.length} विषय)
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: INTERACTIVE MINI-QUIZ */}
      {phase === 'quiz' && currentQuestion && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                प्रश्न {currentIdx + 1} / {quizQuestions.length}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                लक्ष्य विषय: {currentQuestion.topicNameHindi}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPhase('overview')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              सूची पर लौटें (Exit Quiz)
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.round(((currentIdx + 1) / quizQuestions.length) * 100)}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-hindi">
              {currentQuestion.questionHindi}
            </h4>
            {bilingualMode && currentQuestion.questionEnglish && (
              <p className="text-xs text-slate-500 italic">{currentQuestion.questionEnglish}</p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {(() => {
              const showUniformEng = shouldShowUniformOptionEnglish(currentQuestion.options);
              return currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === currentQuestion.correctIndex;
                let btnStyle = 'bg-white border-slate-200 hover:border-indigo-500 text-slate-800';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                  } else {
                    btnStyle = 'bg-white border-slate-200 opacity-60';
                  }
                }

                const optEng = showUniformEng ? getSafeOptionEnglish(opt) : null;

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <div>
                        <span>{opt.textHindi}</span>
                        {bilingualMode && optEng && (
                          <span className="text-[11px] text-slate-500 block font-normal">
                            ({optEng})
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {selectedOption !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              });
            })()}
          </div>

          {/* Explanation & Next */}
          {selectedOption !== null && (
            <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>नियम व व्याख्या (Explanation):</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-hindi">
                {currentQuestion.explanationHindi}
              </p>
              {bilingualMode && currentQuestion.explanationEnglish && (
                <p className="text-[11px] text-slate-500 italic">
                  {currentQuestion.explanationEnglish}
                </p>
              )}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvanceQuiz}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>
                    {currentIdx + 1 < quizQuestions.length
                      ? 'अगला प्रश्न (Next Question)'
                      : 'परिणाम व रिपोर्ट देखें (Finish & View Report)'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: RESULTS & FULL DIAGNOSTIC REPORT */}
      {phase === 'results' && finalReport && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-emerald-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 font-serif-display">
                  पुनः परीक्षण पूर्ण! ({finalReport.correctCount} / {finalReport.totalQuestions} सही • {finalReport.percentage}%)
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    +{earnedCoins} WordCoins अर्जित
                  </span>
                  <span>रिपोर्ट आपके डैशबोर्ड में सहेजी गई है।</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => startMiniQuiz()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>फिर से जाँच करें</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('overview')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                कमज़ोर क्षेत्रों पर लौटें
              </button>
            </div>
          </div>

          {/* Mastered Weak Topics Callout */}
          {masteredInRetest.length > 0 && onResolveWeakTopic && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 text-xs text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-extrabold">
                    बधाई हो! आपने इस पुनः अभ्यास में इन विषयों के 100% प्रश्न सही हल किए:
                  </strong>
                  <span>{masteredInRetest.map((t) => t.nameHindi).join(', ')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  masteredInRetest.forEach((t) => onResolveWeakTopic(t.key));
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0 inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>सुधारित विषयों को कमज़ोर सूची से हटाएँ</span>
              </button>
            </div>
          )}

          {/* Embedded Diagnostic Report Card */}
          <WorksheetReportCard
            report={finalReport}
            bilingualMode={bilingualMode}
          />
        </div>
      )}
    </section>
  );
};
