import React, { useState } from 'react';
import {
  History,
  Hourglass,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { BoardType, GradeLevel, UserProgressState } from '../types';
import { triggerCelebration } from '../utils/confetti';
import { getBoardSyllabus } from '../data/syllabusData';
import { AppTheme, getThemeConfig } from '../utils/theme';

interface TimeTravelMachineProps {
  progress: UserProgressState;
  grade?: GradeLevel;
  selectedBoard?: BoardType;
  bilingualMode: boolean;
  theme?: AppTheme;
  onQuickSimulate: (topicId: string) => void;
  onStartCheckpointQuiz?: (mode: 'pre' | 'post') => void;
}

export const TimeTravelMachine: React.FC<TimeTravelMachineProps> = ({
  progress,
  grade,
  selectedBoard = 'ICSE',
  bilingualMode,
  theme = 'indigo',
  onQuickSimulate,
  onStartCheckpointQuiz,
}) => {
  const themeConfig = getThemeConfig(theme);
  const [activeEra, setActiveEra] = useState<'past' | 'present' | 'future'>('present');
  const [isWarping, setIsWarping] = useState<boolean>(false);

  const activeGrade: GradeLevel = grade || progress.selectedGrade || 'कक्षा 8';
  const syllabusDetail = getBoardSyllabus(selectedBoard, activeGrade);
  const classSyllabusTopics = syllabusDetail.categories.flatMap((cat) => cat.items);

  const hasPreQuiz = Boolean(progress.preCheckpointCompleted);
  const hasPostQuiz = Boolean(progress.postCheckpointCompleted);
  const hasAnyQuiz = hasPreQuiz || hasPostQuiz;

  const handleSelectEra = (era: 'past' | 'present' | 'future') => {
    if (era === activeEra) return;
    setIsWarping(true);
    setTimeout(() => {
      setActiveEra(era);
      setIsWarping(false);
      if (era === 'present' && hasPostQuiz) {
        triggerCelebration();
      }
    }, 450);
  };

  const { past, present } = progress.timeTravel;

  const formatImprovement = (val: number) => {
    if (val > 0) return `+${val}%`;
    return `${val}%`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Time Travel Machine Header & Dial */}
      <div
        className={`p-6 ${themeConfig.studentHeroGradient} ${
          themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'
        } relative overflow-hidden transition-colors duration-500`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg font-black ${
                themeConfig.isLightBanner
                  ? 'bg-slate-950 text-amber-300 shadow-slate-950/20'
                  : 'bg-amber-400 text-slate-950 shadow-amber-400/20'
              }`}
            >
              <Hourglass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                    themeConfig.isLightBanner
                      ? 'text-slate-950 bg-white/70 border-slate-950/15'
                      : 'text-amber-300 bg-amber-400/15 border-amber-300/30'
                  }`}
                >
                  काल चक्र टाइम मशीन
                </span>
                <span className={`text-xs ${themeConfig.isLightBanner ? 'text-slate-900 font-semibold' : 'text-indigo-200'}`}>
                  Time Travel Machine
                </span>
              </div>
              <h3 className={`text-2xl font-black tracking-tight mt-0.5 ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}`}>
                समय यात्रा: भूत, वर्तमान एवं भविष्य
              </h3>
            </div>
          </div>
        </div>

        {/* 3 Era Buttons Selector */}
        <div
          className={`grid grid-cols-3 gap-2 p-1.5 backdrop-blur-md rounded-2xl border mt-6 relative z-10 ${
            themeConfig.isLightBanner
              ? 'bg-white/50 border-slate-950/15'
              : 'bg-black/30 border-white/10'
          }`}
        >
          {/* Era 1: Past */}
          <button
            onClick={() => handleSelectEra('past')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeEra === 'past'
                ? themeConfig.isLightBanner
                  ? 'bg-slate-950 text-white shadow-md font-black'
                  : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-black'
                : themeConfig.isLightBanner
                ? 'text-slate-900 hover:text-slate-950 hover:bg-white/50'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5 text-base">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>भूतकाल (Past)</span>
            </span>
            <span className="text-[10px] opacity-80 font-normal">
              {hasPreQuiz ? `आधारभूत: ${past.baselineScore}%` : 'प्री-क्विज़ लंबित'}
            </span>
          </button>

          {/* Era 2: Present */}
          <button
            onClick={() => handleSelectEra('present')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeEra === 'present'
                ? themeConfig.isLightBanner
                  ? 'bg-white text-slate-950 font-black shadow-md'
                  : 'bg-white text-indigo-700 font-black shadow-md shadow-black/20'
                : themeConfig.isLightBanner
                ? 'text-slate-900 hover:text-slate-950 hover:bg-white/50'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5 text-base">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>वर्तमान (Present)</span>
            </span>
            <span className="text-[10px] font-semibold opacity-90">
              {hasPreQuiz && hasPostQuiz
                ? `सुधार: ${formatImprovement(present.improvementPercentage)}`
                : hasAnyQuiz
                ? `वर्तमान: ${present.currentMastery}%`
                : 'क्विज़ से जानें'}
            </span>
          </button>

          {/* Era 3: Future */}
          <button
            onClick={() => handleSelectEra('future')}
            className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeEra === 'future'
                ? themeConfig.isLightBanner
                  ? 'bg-slate-950 text-white shadow-md font-black'
                  : 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-black'
                : themeConfig.isLightBanner
                ? 'text-slate-900 hover:text-slate-950 hover:bg-white/50'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5 text-base">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>भविष्य (Future)</span>
            </span>
            <span className="text-[10px] opacity-90 font-semibold">
              {bilingualMode ? 'लक्ष्य: 100/100 Full Marks' : 'लक्ष्य: 100/100 पूर्ण अंक'}
            </span>
          </button>
        </div>
      </div>

      {/* Warp Animation Transition Container */}
      <div className="relative min-h-[340px] p-6 sm:p-7 bg-slate-50/70">
        {isWarping ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin flex items-center justify-center">
              <Hourglass className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-xs font-bold text-indigo-700 animate-pulse">
              समय की धारा में यात्रा जारी है... (Warping Across Time)
            </p>
          </div>
        ) : (
          <>
            {/* ERA 1: PAST CONTENT */}
            {activeEra === 'past' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {!hasPreQuiz ? (
                  <div className="p-6 bg-amber-50/90 rounded-2xl border-2 border-amber-300/80 text-slate-900 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto">
                      <History className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 max-w-xl mx-auto">
                      <h4 className="text-lg font-black text-slate-900">
                        प्रारंभिक मूल्यांकन अभी नहीं हुआ है (Pre-Checkpoint Quiz Required)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        आपका वास्तविक आधारभूत स्तर (Baseline Score) और कमजोर विषय जानने के लिए कृपया पहले <strong>प्री-चेकपॉइंट क्विज़</strong> हल करें। कोई भी अनुमानित या नकली डेटा यहाँ नहीं दिखाया गया है।
                      </p>
                      {bilingualMode && (
                        <p className="text-[11px] text-slate-600 italic">
                          Attempt the Pre-Checkpoint Quiz first so your real baseline score and weak topics can be measured accurately.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartCheckpointQuiz?.('pre')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                    >
                      <span>प्री-चेकपॉइंट क्विज़ हल करें (Attempt Pre-Quiz)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-5 bg-amber-50/80 rounded-2xl border-2 border-amber-300/80 text-slate-900 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                          <History className="w-4 h-4 text-amber-700" />
                          <span>भूतकाल अभिलेख: प्री-चेकपॉइंट परिणाम ({past.date})</span>
                        </div>
                        <span className="text-xs font-black px-2.5 py-0.5 bg-white text-amber-900 rounded-full border border-amber-300">
                          {past.baselineScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {past.notesHindi}
                      </p>
                      {bilingualMode && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">
                          {past.notesEnglish}
                        </p>
                      )}
                    </div>

                    {past.errorsAnalysis.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                          प्री-क्विज़ विश्लेषण (Pre-Quiz Breakdown)
                        </h5>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {past.errorsAnalysis.map((err, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 flex items-start gap-3 shadow-2xs"
                            >
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-bold text-rose-950 block">
                                  बिंदु {idx + 1}
                                </span>
                                <span className="text-xs text-rose-900 leading-tight block mt-0.5">
                                  {err}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs flex-wrap gap-3">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">प्रारंभिक आधारभूत अंक (Baseline Pre-Quiz Score):</span>
                        <span className="text-sm font-extrabold text-slate-900 block">
                          {past.baselineScore}% सटीकता (Accuracy)
                        </span>
                      </div>
                      <button
                        onClick={() => handleSelectEra('present')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <span>वर्तमान प्रगति देखें</span>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ERA 2: PRESENT CONTENT */}
            {activeEra === 'present' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {!hasAnyQuiz ? (
                  <div className="p-6 bg-white rounded-2xl border-2 border-indigo-200 text-slate-900 space-y-4 text-center shadow-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 text-amber-300" />
                    </div>
                    <div className="space-y-1.5 max-w-xl mx-auto">
                      <h4 className="text-lg font-black text-slate-900">
                        अपनी वास्तविक दक्षता जानने के लिए क्विज़ हल करें
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        पहली बार लॉगिन करने पर सभी आँकड़े शून्य (0) से शुरू होते हैं। जब आप ऊपर दिए गए <strong>प्री-चेकपॉइंट क्विज़</strong> और <strong>पोस्ट-चेकपॉइंट क्विज़</strong> हल करेंगे, तो आपकी वास्तविक दक्षता, सटीकता और सुधार यहाँ प्रदर्शित होगा।
                      </p>
                      {bilingualMode && (
                        <p className="text-[11px] text-slate-500 italic">
                          You must attempt the Pre and Post Checkpoint Quizzes to know your real mastery, accuracy, and improvement metrics.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onStartCheckpointQuiz?.('pre')}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>प्री-चेकपॉइंट क्विज़ हल करें (Pre-Quiz)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartCheckpointQuiz?.('post')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>पोस्ट-चेकपॉइंट क्विज़ (Post-Quiz)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-white rounded-2xl border-2 border-indigo-600 text-slate-900 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <span className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>वर्तमान स्थिति: वास्तविक क्विज़ प्रगति (Live Progress)</span>
                      </span>
                      {hasPreQuiz && hasPostQuiz ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                          {formatImprovement(present.improvementPercentage)} भूतकाल से अंतर
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onStartCheckpointQuiz?.(hasPreQuiz ? 'post' : 'pre')}
                          className="text-xs font-bold px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full border border-amber-300 cursor-pointer"
                        >
                          {hasPreQuiz ? 'सुधार मापने के लिए पोस्ट-क्विज़ दें →' : 'तुलना के लिए प्री-क्विज़ दें →'}
                        </button>
                      )}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                      {hasPreQuiz && hasPostQuiz
                        ? `प्री-क्विज़ (${past.baselineScore}%) से पोस्ट-क्विज़ (${present.currentMastery}%) तक की आपकी वास्तविक यात्रा`
                        : hasPreQuiz
                        ? `आपने प्री-चेकपॉइंट क्विज़ में ${past.baselineScore}% अर्जित किए हैं — अब पोस्ट-क्विज़ हल करें!`
                        : `आपने पोस्ट-चेकपॉइंट क्विज़ में ${present.currentMastery}% अर्जित किए हैं!`}
                    </h4>
                  </div>
                )}

                {/* Progress Comparison Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[11px] text-slate-500 block font-medium">वर्तमान दक्षता (Mastery)</span>
                    <span className="text-2xl font-black text-indigo-700">
                      {hasAnyQuiz ? `${present.currentMastery}%` : '—'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      {hasPreQuiz && hasPostQuiz
                        ? `${formatImprovement(present.currentMastery - past.baselineScore)} शुद्ध वृद्धि`
                        : 'क्विज़ हल करें'}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[11px] text-slate-500 block font-medium">सटीकता दर (Accuracy)</span>
                    <span className="text-2xl font-black text-slate-900">
                      {progress.totalQuestionsAnswered > 0 ? `${present.accuracyRate}%` : '—'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {progress.totalQuestionsAnswered > 0
                        ? `${progress.correctAnswersTotal}/${progress.totalQuestionsAnswered} प्रश्न`
                        : 'अभी कोई प्रयास नहीं'}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[11px] text-slate-500 block font-medium">शब्द-सिक्के (WordCoins)</span>
                    <span className="text-2xl font-black text-amber-600">
                      {progress.wordCoins}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                      वर्कशीट्स अनलॉक हेतु
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs">
                    <span className="text-[11px] text-slate-500 block font-medium">सक्रिय स्ट्रीक (Streak)</span>
                    <span className="text-2xl font-black text-violet-600">
                      {present.activeStreakDays > 0 ? `${present.activeStreakDays} दिन 🔥` : '0 दिन'}
                    </span>
                    <span className="text-[10px] text-violet-700 font-semibold block mt-0.5">
                      {present.activeStreakDays > 0 ? 'दैनिक निरंतरता' : 'क्विज़ से शुरू करें'}
                    </span>
                  </div>
                </div>

                {/* Mastered Topics Badges */}
                {present.topicsMastered.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                        क्विज़ में सही किए गए विषय (Verified Topics)
                      </h5>
                      <span className="text-xs text-indigo-700 font-bold">
                        {present.topicsMastered.length} विषय पारंगत
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {present.topicsMastered.map((topic, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-400 transition-all shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-xs font-bold text-slate-900">{topic}</span>
                          </div>
                          <button
                            onClick={() => onQuickSimulate('karak')}
                            className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                          >
                            अभ्यास दोहराएँ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSelectEra('future')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>भविष्य का रोडमैप देखें (View Roadmap)</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ERA 3: FUTURE CONTENT (Always displays Full Marks 100/100 projection + Class Syllabus) */}
            {activeEra === 'future' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Full Marks Prediction Banner */}
                <div className="p-5 sm:p-6 bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 rounded-2xl text-white shadow-md border border-violet-400/30 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-300" />
                        <span>भविष्य की गारंटी • {selectedBoard} {activeGrade}</span>
                      </span>
                      <span className="text-xs font-black px-3 py-1 bg-amber-400 text-slate-950 rounded-full shadow-xs">
                        अनुमानित स्कोर: 100/100 (पूर्ण अंक)
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      आप परीक्षा में 100/100 (Full Marks) प्राप्त करेंगे!
                    </h4>

                    <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                      यदि आप प्रतिदिन ShabdShilp पर नियमित अभ्यास करते हैं, तो आप <strong>{activeGrade}</strong> के संपूर्ण पाठ्यक्रम के हर विषय में पूरे अंक (100% Full Marks) हासिल करेंगे।
                    </p>

                    {bilingualMode && (
                      <p className="text-xs text-indigo-200/90 italic">
                        You will score full marks (100/100) in the exam across all {activeGrade} syllabus topics if you practice daily on ShabdShilp.
                      </p>
                    )}
                  </div>
                </div>

                {/* All Class Syllabus Topics for 100% Mastery */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        <span>{selectedBoard} {activeGrade} पाठ्यक्रम के सभी {classSyllabusTopics.length} विषय — प्रत्येक में पूर्ण अंक लक्ष्य</span>
                      </h5>
                      {bilingualMode && (
                        <p className="text-[11px] text-slate-500">
                          All {classSyllabusTopics.length} {activeGrade} syllabus topics — practice daily to score 100% in every single one.
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      सभी विषयों में 100% लक्ष्य
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {classSyllabusTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        onClick={() => onQuickSimulate(topic.linkedModuleId || 'karak')}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-violet-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-2 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {topic.nameHindi}
                            </span>
                          </div>
                          {bilingualMode && (
                            <span className="text-[10px] text-slate-500 block pl-5 truncate">
                              {topic.nameEnglish}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-black text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100 shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                          100%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Practice Blueprint for Full Marks */}
                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    पूर्ण अंक (100/100) पाने के लिए दैनिक अभ्यास योजना (Daily Practice Roadmap)
                  </h5>

                  <div className="space-y-2.5">
                    {[
                      {
                        milestone: 'चरण 1: दैनिक अभ्यास (Daily Practice)',
                        goalHindi: `प्रतिदिन 15–20 मिनट ${activeGrade} के व्याकरण सिमुलेशन व नियम दोहराएँ`,
                        goalEnglish: `Practice ${activeGrade} interactive grammar simulations for 15–20 minutes daily`,
                        weeklyRoutine: 'प्रतिदिन 1 सिमुलेशन + 10 प्रश्न',
                      },
                      {
                        milestone: 'चरण 2: वर्कशीट व अपठित गद्यांश (Worksheets & Comprehension)',
                        goalHindi: 'कस्टम वर्कशीट जनरेटर और अपठित गद्यांश से समयबद्ध अभ्यास करें ताकि एक भी अंक न कटे',
                        goalEnglish: 'Solve custom worksheets and unseen passages regularly for zero-error exam speed',
                        weeklyRoutine: 'सप्ताह में 3 वर्कशीट + 2 गद्यांश',
                      },
                      {
                        milestone: `चरण 3: ${selectedBoard} ${activeGrade} परीक्षा लक्ष्य (Exam Full Marks)`,
                        goalHindi: `निरंतर दैनिक अभ्यास से सभी ${classSyllabusTopics.length} पाठ्यक्रम विषयों में 100/100 पूर्ण अंक पक्के!`,
                        goalEnglish: `With consistent daily practice, full marks (100/100) across all ${classSyllabusTopics.length} topics are yours!`,
                        weeklyRoutine: 'लक्ष्य: 100/100 (A+ उत्कृष्ट)',
                      },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-violet-400 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-violet-700 uppercase tracking-wider bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                            {step.milestone}
                          </span>
                          <h6 className="text-sm font-bold text-slate-900">
                            {step.goalHindi}
                          </h6>
                          {bilingualMode && step.goalEnglish && (
                            <p className="text-[11px] text-slate-500 italic">
                              {step.goalEnglish}
                            </p>
                          )}
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-right sm:min-w-[210px]">
                          <span className="text-[10px] text-slate-500 block font-medium">दैनिक/साप्ताहिक लक्ष्य:</span>
                          <span className="text-xs font-bold text-violet-700">
                            {step.weeklyRoutine}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSelectEra('present')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    वर्तमान प्रगति पर लौटें
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
