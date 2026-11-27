import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  BookMarked, 
  Coins, 
  X, 
  Loader2, 
  RefreshCw,
  Trophy
} from 'lucide-react';
import { PRE_CHECK_QUIZ_QUESTIONS } from '../data/grammarData';
import { GradeLevel, QuizQuestion } from '../types';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { buildDeterministicSevenDayPlan, normalizeSevenDayCourse } from '../utils/studyPlanBuilder';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onCourseGenerated: (courseData: any, weakTopics: string[], score: number) => void;
  onAddWordCoins: (coins: number) => void;
  bilingualMode: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  onCourseGenerated,
  onAddWordCoins,
  bilingualMode,
}) => {
  const [mode, setMode] = useState<'choose' | 'weakTopics' | 'quiz' | 'quizResult' | 'courseView'>('choose');
  
  // Weak topics input state
  const topicChoices = [
    { id: 'कारक (Karak)', nameHindi: 'कारक (करण व अपादान भेद)', nameEnglish: 'Karak: Case Markers' },
    { id: 'वाक्य भेद (Vakya Bhed)', nameHindi: 'वाक्य भेद (सरल, संयुक्त, मिश्र)', nameEnglish: 'Sentence Types' },
    { id: 'वाच्य (Vachya)', nameHindi: 'वाच्य (कर्तृ, कर्म, भाव)', nameEnglish: 'Active/Passive Voice' },
    { id: 'काल (Kaal)', nameHindi: 'काल एवं उपभेद (भूत, वर्तमान, भविष्यत्)', nameEnglish: 'Tenses & Sub-types' },
    { id: 'मुहावरे (Muhavare)', nameHindi: 'मुहावरे एवं लाक्षणिक अर्थ', nameEnglish: 'Idiomatic Expressions' },
    { id: 'उपसर्ग एवं प्रत्यय (Upsarg & Pratyay)', nameHindi: 'उपसर्ग एवं प्रत्यय (मूल शब्द विग्रह)', nameEnglish: 'Prefixes & Suffixes' },
    { id: 'अपठित गद्यांश (Apathit Gadyansh)', nameHindi: 'अपठित गद्यांश एवं अर्थग्रहण', nameEnglish: 'Reading Comprehension' },
    { id: 'संधि एवं समास (Sandhi & Samas)', nameHindi: 'संधि एवं समास', nameEnglish: 'Word Union & Compounds' },
  ];

  const [selectedWeakTopics, setSelectedWeakTopics] = useState<string[]>([
    'कारक (Karak)',
    'उपसर्ग एवं प्रत्यय (Upsarg & Pratyay)'
  ]);
  const [customWeakNotes, setCustomWeakNotes] = useState<string>('मुझे अपादान और करण कारक के "से" में अंतर समझ नहीं आता, और उपसर्ग-प्रत्यय में मूल शब्द अलग करने में गलती होती है।');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCourse, setGeneratedCourse] = useState<any | null>(null);

  // Diagnostic Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [topicPerformance, setTopicPerformance] = useState<Record<string, { total: number; correct: number }>>({});

  if (!isOpen) return null;

  const toggleTopic = (id: string) => {
    if (selectedWeakTopics.includes(id)) {
      setSelectedWeakTopics(selectedWeakTopics.filter(t => t !== id));
    } else {
      setSelectedWeakTopics([...selectedWeakTopics, id]);
    }
  };

  const handleGenerateCourseFromTopics = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/ai/course-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakTopics: selectedWeakTopics,
          grade: selectedGrade,
          goals: customWeakNotes,
        }),
      });
      const data = resp.ok ? await resp.json() : null;
      setGeneratedCourse(normalizeSevenDayCourse(data, selectedWeakTopics, selectedGrade));
      setMode('courseView');
      triggerCelebration();
    } catch (e) {
      console.error(e);
      setGeneratedCourse(buildDeterministicSevenDayPlan(selectedWeakTopics, selectedGrade));
      setMode('courseView');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerQuizQuestion = (optionIdx: number) => {
    const updated = { ...userQuizAnswers, [currentQuizIdx]: optionIdx };
    setUserQuizAnswers(updated);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIdx < PRE_CHECK_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      // Calculate results
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsLoading(true);
    let correct = 0;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    PRE_CHECK_QUIZ_QUESTIONS.forEach((q, idx) => {
      const userAns = userQuizAnswers[idx];
      const isRight = userAns === q.correctIndex;
      if (isRight) correct++;

      const topic = q.topicNameHindi;
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0 };
      }
      topicStats[topic].total++;
      if (isRight) topicStats[topic].correct++;
    });

    const calculatedScore = Math.round((correct / PRE_CHECK_QUIZ_QUESTIONS.length) * 100);
    setQuizScore(calculatedScore);
    setTopicPerformance(topicStats);

    // Identify weak topics (where correct < total)
    const detectedWeak: string[] = [];
    Object.entries(topicStats).forEach(([top, stat]) => {
      if (stat.correct < stat.total) {
        detectedWeak.push(top);
      }
    });

    // Award WordCoins: 2 correct = 1 WordCoin
    const coinsEarned = Math.floor(correct / 2);
    if (coinsEarned > 0) {
      onAddWordCoins(coinsEarned);
      triggerCoinBurst();
    }

    const fallbackTopicList = detectedWeak.length ? detectedWeak : ['संज्ञा', 'कारक', 'वाक्य भेद'];
    try {
      const resp = await fetch('/api/ai/course-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakTopics: fallbackTopicList,
          grade: selectedGrade,
          goals: `पूर्व-जाँच परीक्षा स्कोर: ${calculatedScore}%. कमजोर विषय: ${fallbackTopicList.join(', ')}`,
        }),
      });
      const course = resp.ok ? await resp.json() : null;
      setGeneratedCourse(normalizeSevenDayCourse(course, fallbackTopicList, selectedGrade));
    } catch (e) {
      console.error(e);
      setGeneratedCourse(buildDeterministicSevenDayPlan(fallbackTopicList, selectedGrade));
    } finally {
      setIsLoading(false);
      setMode('quizResult');
    }
  };

  const handleApplyAndStart = () => {
    const weakList = mode === 'quizResult' 
      ? Object.entries(topicPerformance).filter(([_, s]) => s.correct < s.total).map(([t]) => t)
      : selectedWeakTopics;
    
    onCourseGenerated(generatedCourse, weakList, quizScore || 70);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Modal - Indigo to Violet gradient */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 rounded-2xl object-cover object-center bg-[#091124] border border-white/25 shadow-md shrink-0"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                अनुकूली अधिगम प्रवेशद्वार (Adaptive Learning Gateway)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-white mt-0.5">
                शब्द शिल्प डायग्नोस्टिक चेकपॉइंट
              </h2>
            </div>
          </div>
          <p className="text-sm text-indigo-100 mt-2">
            प्रत्येक छात्र की सीखने की गति अद्वितीय है। चुनें कि आप अपनी कमजोरी बताकर तुरंत पाठ्यक्रम बनाना चाहते हैं या पूर्व-जाँच परीक्षा देकर अपनी स्थिति जानना चाहते हैं।
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* SCREEN 1: CHOOSE PATH */}
          {mode === 'choose' && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <h3 className="text-lg font-bold text-slate-800">
                  आप शब्दशिल्प की शुरुआत कैसे करना चाहते हैं?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  How would you like to personalize your learning journey?
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Option A: Enter Weak Topics */}
                <div
                  onClick={() => setMode('weakTopics')}
                  className="p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide bg-amber-200/60 px-2 py-0.5 rounded-md">
                      विकल्प १ (Option A)
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-2">
                      कमजोर विषय सीधे लिखें
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      यदि आप पहले से जानते हैं कि आपको कारक, वाच्य या उपसर्ग-प्रत्यय में कठिनाई है, तो सीधे विषय चुनें और हमारा AI आपके लिए तुरंत व्यक्तिगत कोर्स तैयार करेगा।
                    </p>
                    {bilingualMode && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        State your weak chapters directly and get an AI tailored study plan.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
                    <span>विषय चुनें व कोर्स बनाएँ</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Option B: Diagnostic Pre-Check Quiz */}
                <div
                  onClick={() => {
                    setMode('quiz');
                    setCurrentQuizIdx(0);
                    setUserQuizAnswers({});
                  }}
                  className="p-5 rounded-2xl border-2 border-orange-200 hover:border-orange-500 bg-orange-50/50 hover:bg-orange-50 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wide bg-orange-200/60 px-2 py-0.5 rounded-md">
                        विकल्प २ (Option B)
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-yellow-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Coins className="w-3 h-3 text-amber-600" /> +सिक्के
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-2">
                      पूर्व-जाँच परीक्षा दें (Pre-Check Quiz)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      8 बहुविकल्पीय प्रश्नों की त्वरित परीक्षा दें। हमारा सिस्टम स्वचालित रूप से आँकेगा कि आपकी वास्तविक कमजोरियाँ कहाँ हैं और टाइम मशीन बेसलाइन बनाएगा।
                    </p>
                    {bilingualMode && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        Take an 8-question diagnostic quiz to uncover hidden gaps with AI evaluation.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-orange-700 group-hover:text-orange-800">
                    <span>जाँच परीक्षा शुरू करें</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: WEAK TOPICS SELECTOR */}
          {mode === 'weakTopics' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    अपनी कठिनाई वाले विषय चुनें
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select topics you struggle with ({selectedGrade})
                  </p>
                </div>
                <button
                  onClick={() => setMode('choose')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  वापस (Back)
                </button>
              </div>

              {/* Topic Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {topicChoices.map((tc) => {
                  const isChecked = selectedWeakTopics.includes(tc.id);
                  return (
                    <div
                      key={tc.id}
                      onClick={() => toggleTopic(tc.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{tc.nameHindi}</div>
                        {bilingualMode && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {tc.nameEnglish}
                          </div>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isChecked
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specific Notes Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  अपनी समस्या या संशय विस्तार से लिखें (Write specific doubts/confusion in Hindi or English):
                </label>
                <textarea
                  rows={3}
                  value={customWeakNotes}
                  onChange={(e) => setCustomWeakNotes(e.target.value)}
                  placeholder="उदा. मुझे अपादान कारक में पेड़ से पत्ता गिरने और हाथ से कलम छूटने में अलगाव समझ नहीं आता..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition-all text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setMode('choose')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  disabled={isLoading || selectedWeakTopics.length === 0}
                  onClick={handleGenerateCourseFromTopics}
                  className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI पाठ्यक्रम गढ़ा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>व्यक्तिगत पाठ्यक्रम तैयार करें (Generate Plan)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: DIAGNOSTIC PRE-CHECK QUIZ */}
          {mode === 'quiz' && (
            <div className="space-y-5">
              {/* Quiz Progress Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                    {currentQuizIdx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      प्रश्न {currentQuizIdx + 1} / {PRE_CHECK_QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      विषय: {PRE_CHECK_QUIZ_QUESTIONS[currentQuizIdx].topicNameHindi}
                    </span>
                  </div>
                </div>

                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuizIdx + 1) / PRE_CHECK_QUIZ_QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const q = PRE_CHECK_QUIZ_QUESTIONS[currentQuizIdx];
                const selectedOpt = userQuizAnswers[currentQuizIdx];

                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {q.questionHindi}
                      </h4>
                      {bilingualMode && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          {q.questionEnglish}
                        </p>
                      )}
                      {q.sentenceHindi && (
                        <div className="mt-3 p-2.5 bg-white rounded-lg border-l-4 border-amber-500 text-xs font-semibold text-slate-800">
                          {q.sentenceHindi}
                          {bilingualMode && q.sentenceEnglish && (
                            <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                              {q.sentenceEnglish}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuizQuestion(oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                              isChosen
                                ? 'bg-amber-100/70 border-amber-500 text-amber-950 font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <span>{opt.textHindi}</span>
                              {bilingualMode && (
                                <span className="block text-[10px] text-slate-400 font-normal">
                                  {opt.textEnglish}
                                </span>
                              )}
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                isChosen ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-300'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        disabled={currentQuizIdx === 0}
                        onClick={() => setCurrentQuizIdx(currentQuizIdx - 1)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        पिछला (Previous)
                      </button>

                      <button
                        disabled={selectedOpt === undefined || isLoading}
                        onClick={handleNextQuizQuestion}
                        className="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>परिणाम तैयार हो रहा है...</span>
                          </>
                        ) : currentQuizIdx === PRE_CHECK_QUIZ_QUESTIONS.length - 1 ? (
                          <>
                            <span>परीक्षा समाप्त करें (Submit & Analyze)</span>
                            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                          </>
                        ) : (
                          <>
                            <span>अगला प्रश्न (Next)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SCREEN 4: QUIZ RESULTS & TOPIC ANALYSIS */}
          {mode === 'quizResult' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Dynamic Score Analysis Banner: Red for 0%, Yellow for 50%, Green for High */}
              {(() => {
                const isZeroOrLow = quizScore <= 25; // 0% to 25% (Red)
                const isFiftyOrMid = quizScore > 25 && quizScore <= 65; // ~50% (Yellow)
                const isHigh = quizScore > 65; // High (Green)

                return (
                  <div
                    className={`p-6 rounded-3xl border-2 text-center space-y-2 transition-all shadow-md ${
                      isZeroOrLow
                        ? 'bg-red-500 text-white border-red-700 shadow-red-200'
                        : isFiftyOrMid
                        ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-amber-200'
                        : 'bg-indigo-700 text-white border-indigo-800 shadow-indigo-200'
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/20 text-white">
                      <span>{isZeroOrLow ? '🔴 स्कोर 0% - अति आवश्यक सुधार' : isFiftyOrMid ? '🟡 स्कोर 50% - मध्यम स्तर (सुधार आवश्यक)' : '🟢 उत्कृष्ट प्रदर्शन (High Mastery)'}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight">
                      पूर्व-जाँच परीक्षा परिणाम (Diagnostic Analysis)
                    </h3>

                    <div className="flex items-center justify-center gap-4 py-2">
                      <div className="text-5xl font-black font-display tracking-tight">
                        {quizScore}%
                      </div>
                      <div className="text-left text-xs font-bold leading-snug">
                        <div>कुल प्रश्न: {PRE_CHECK_QUIZ_QUESTIONS.length}</div>
                        <div>अर्जित WordCoins: <strong className="underline text-sm">+{Math.floor((quizScore / 100 * PRE_CHECK_QUIZ_QUESTIONS.length) / 2)}</strong></div>
                      </div>
                    </div>

                    <p className="text-xs font-medium max-w-lg mx-auto opacity-95">
                      {isZeroOrLow
                        ? 'स्कोर 0% होने के कारण हमने बुनियादी नियमों और मूल अवधारणाओं पर विशेष सुदृढ़ पाठ्यक्रम तैयार किया है।'
                        : isFiftyOrMid
                        ? 'स्कोर 50% दर्शाता है कि आपकी आधी समझ स्पष्ट है परंतु कारक और वाक्य भेद में निरंतर अभ्यास आवश्यक है।'
                        : 'शानदार प्रदर्शन! आपका अधिकांश व्याकरण आधार मजबूत है। अब हम 100/100 पर ध्यान देंगे।'}
                    </p>
                  </div>
                );
              })()}

              {/* Topic breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  अध्याय-वार क्षमता एवं कमजोरियों का विश्लेषण (Chapter Diagnostics)
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(topicPerformance).map(([topic, stat]) => {
                    const isWeak = stat.correct < stat.total;
                    const pct = Math.round((stat.correct / stat.total) * 100);
                    return (
                      <div
                        key={topic}
                        className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                          isWeak
                            ? pct === 0
                              ? 'bg-red-50 border-red-300 text-red-950'
                              : 'bg-amber-50 border-amber-300 text-amber-950'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{topic}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isWeak
                              ? pct === 0
                                ? 'bg-red-200 text-red-900'
                                : 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-200 text-emerald-900'
                          }`}>
                            {pct === 0 ? '🔴 0% कमजोर' : isWeak ? '🟡 अभ्यास चाहिए' : '🟢 मजबूत'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black">{pct}%</span>
                          <span className="block text-[10px] text-slate-500">
                            {stat.correct}/{stat.total} सही
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Travel Past baseline alert */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">काल चक्र बेसलाइन दर्ज कर ली गई है! (Time Machine Baseline Set)</span>
                  <span>यह परिणाम आपकी 'भूतकाल (Past)' अवस्था के रूप में डैशबोर्ड के टाइम ट्रैवलर में सुरक्षित हो गया है। अभ्यास करने के बाद वर्तमान में आपकी वास्तविक वृद्धि दिखाई देगी।</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setMode('courseView')}
                  className="px-5 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>अनुकूली अध्ययन योजना देखें (View Adaptive Course)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: GENERATED COURSE VIEW */}
          {mode === 'courseView' && generatedCourse && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-linear-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                  <BookMarked className="w-4 h-4 text-amber-600" />
                  <span>AI निर्मित अध्ययन योजना (Adaptive Study Plan)</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  {generatedCourse.courseTitle}
                </h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {generatedCourse.summaryHindi}
                </p>
                {bilingualMode && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {generatedCourse.summaryEnglish}
                  </p>
                )}
              </div>

              {/* Daily Schedule */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  चरणबद्ध 7-दिवसीय दैनिक कार्यक्रम ({generatedCourse.estimatedDays || 7} दिवस)
                </h4>
                <div className="space-y-2.5">
                  {generatedCourse.modules?.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {m.dayLabelHindi || `दिवस ${m.day || idx + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {m.practiceCount || 8} अभ्यास प्रश्न
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{m.title}</h5>
                      {bilingualMode && m.titleEnglish && (
                        <span className="text-[11px] text-slate-400 block font-normal">
                          {m.titleEnglish}
                        </span>
                      )}
                      <p className="text-xs text-slate-600 mt-1.5">{m.ruleHindi}</p>
                      {Array.isArray(m.dailyTasksHindi) && m.dailyTasksHindi.length > 0 && (
                        <ul className="mt-2 space-y-1 text-[11px] text-slate-700">
                          {m.dailyTasksHindi.map((task: string, tIdx: number) => (
                            <li key={tIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {bilingualMode && m.ruleEnglish && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5">{m.ruleEnglish}</p>
                      )}
                      {m.quickTip && (
                        <div className="mt-2 text-[11px] bg-yellow-50 text-amber-900 font-medium px-2 py-1 rounded-md border border-yellow-200">
                          💡 <strong>स्मरण सूत्र:</strong> {m.quickTip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  {generatedCourse.motivationalQuoteHindi}
                </div>
                <button
                  onClick={handleApplyAndStart}
                  className="px-6 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>अध्ययन शुरू करें (Start Learning)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
