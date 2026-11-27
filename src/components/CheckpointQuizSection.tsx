import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Coins,
  CheckSquare,
  Square,
  RotateCcw,
  GraduationCap,
  Shuffle,
  Clock,
  CalendarDays,
  HelpCircle
} from 'lucide-react';
import { BoardType, CheckpointQuizResult, GradeLevel, QuizQuestion, SavedReportSummary, UserProgressState } from '../types';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { buildDeterministicSevenDayPlan, normalizeSevenDayCourse } from '../utils/studyPlanBuilder';
import { WorksheetReportCard } from './WorksheetReportCard';
import {
  CLASS5_PRE_CHECKPOINT,
  CLASS5_POST_CHECKPOINT,
  CLASS6_PRE_CHECKPOINT,
  CLASS6_POST_CHECKPOINT,
} from '../data/class5And6Data';
import {
  CLASS7_PRE_CHECKPOINT,
  CLASS7_POST_CHECKPOINT,
  CLASS8_PRE_CHECKPOINT,
  CLASS8_POST_CHECKPOINT,
  CLASS9_PRE_CHECKPOINT,
  CLASS9_POST_CHECKPOINT,
  CLASS10_PRE_CHECKPOINT,
  CLASS10_POST_CHECKPOINT,
} from '../data/class7To10Data';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { PRE_CHECKPOINT_QUESTIONS, POST_CHECKPOINT_QUESTIONS } from '../data/siteExtraQuestions';

interface CheckpointQuizSectionProps {
  grade: GradeLevel;
  selectedBoard?: BoardType;
  bilingualMode: boolean;
  onAddWordCoins: (coins: number) => void;
  onSelectCourse?: (course: any) => void;
  progress?: UserProgressState;
  onCompleteCheckpointQuiz?: (result: CheckpointQuizResult) => void;
  onCourseGenerated?: (courseData: any, weakTopics: string[]) => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  requestedQuizTab?: { mode: 'pre' | 'post'; nonce: number } | null;
}

export const CheckpointQuizSection: React.FC<CheckpointQuizSectionProps> = ({
  grade,
  selectedBoard = 'ICSE',
  bilingualMode,
  onAddWordCoins,
  onSelectCourse,
  progress,
  onCompleteCheckpointQuiz,
  onCourseGenerated,
  onRecordWrongAnswer,
  onRecordReport,
  requestedQuizTab,
}) => {
  const [interactionMode, setInteractionMode] = useState<'pre' | 'post' | 'weakness'>(() => {
    if (progress?.preCheckpointCompleted && !progress?.postCheckpointCompleted) return 'post';
    return 'pre';
  });

  const availableWeaknessTopics = getCurriculumForGrade(grade).weaknessTopics;

  // Weakness Selector State
  const [selectedWeakTopics, setSelectedWeakTopics] = useState<string[]>(() =>
    getCurriculumForGrade(grade).weaknessTopics.slice(0, 2)
  );
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [aiDiagnosticResult, setAiDiagnosticResult] = useState<any | null>(null);
  const [completedPlanDays, setCompletedPlanDays] = useState<Record<number, boolean>>({});

  const getQuestionBankForMode = (mode: 'pre' | 'post', targetGrade: GradeLevel = grade) => {
    if (targetGrade === 'कक्षा 5') {
      return randomizeQuizSet(mode === 'pre' ? CLASS5_PRE_CHECKPOINT : CLASS5_POST_CHECKPOINT);
    }
    if (targetGrade === 'कक्षा 6') {
      return randomizeQuizSet(mode === 'pre' ? CLASS6_PRE_CHECKPOINT : CLASS6_POST_CHECKPOINT);
    }
    if (targetGrade === 'कक्षा 7') {
      return randomizeQuizSet(mode === 'pre' ? CLASS7_PRE_CHECKPOINT : CLASS7_POST_CHECKPOINT);
    }
    if (targetGrade === 'कक्षा 8') {
      return randomizeQuizSet(mode === 'pre' ? CLASS8_PRE_CHECKPOINT : CLASS8_POST_CHECKPOINT);
    }
    if (targetGrade === 'कक्षा 9') {
      return randomizeQuizSet(mode === 'pre' ? CLASS9_PRE_CHECKPOINT : CLASS9_POST_CHECKPOINT);
    }
    if (targetGrade === 'कक्षा 10') {
      return randomizeQuizSet(mode === 'pre' ? CLASS10_PRE_CHECKPOINT : CLASS10_POST_CHECKPOINT);
    }
    return randomizeQuizSet(mode === 'pre' ? PRE_CHECKPOINT_QUESTIONS : POST_CHECKPOINT_QUESTIONS);
  };

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    getQuestionBankForMode(progress?.preCheckpointCompleted && !progress?.postCheckpointCompleted ? 'post' : 'pre', grade)
  );
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answersRecord, setAnswersRecord] = useState<{ question: QuizQuestion; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastEarnedCoins, setLastEarnedCoins] = useState<number>(0);

  const startQuizMode = (mode: 'pre' | 'post', targetGrade: GradeLevel = grade) => {
    setInteractionMode(mode);
    setQuestions(getQuestionBankForMode(mode, targetGrade));
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnswersRecord([]);
    setIsCompleted(false);
    setLastEarnedCoins(0);
  };

  useEffect(() => {
    if (requestedQuizTab) {
      startQuizMode(requestedQuizTab.mode, grade);
    }
  }, [requestedQuizTab?.nonce]);

  // Reset checkpoint quiz bank and weakness topics whenever grade switches
  useEffect(() => {
    setSelectedWeakTopics(getCurriculumForGrade(grade).weaknessTopics.slice(0, 2));
    if (interactionMode !== 'weakness') {
      startQuizMode(interactionMode, grade);
    }
  }, [grade]);

  const toggleWeakTopic = (topic: string) => {
    if (selectedWeakTopics.includes(topic)) {
      if (selectedWeakTopics.length > 1) {
        setSelectedWeakTopics(selectedWeakTopics.filter(t => t !== topic));
      }
    } else {
      setSelectedWeakTopics([...selectedWeakTopics, topic]);
    }
  };

  const handleGenerateWeaknessPlan = async (topicsOverride?: string[]) => {
    const topicsToUse = topicsOverride && topicsOverride.length > 0 ? topicsOverride : selectedWeakTopics;
    if (topicsToUse.length === 0) return;

    setIsGeneratingPlan(true);
    setCompletedPlanDays({});
    try {
      const res = await fetch('/api/ai/course-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakTopics: topicsToUse,
          grade,
          board: selectedBoard,
          goals: `${selectedBoard} परीक्षा में चुने गए अध्यायों (${topicsToUse.join(', ')}) पर 7-दिवसीय दैनिक अभ्यास`
        })
      });
      let normalizedPlan;
      if (res.ok) {
        const data = await res.json();
        normalizedPlan = normalizeSevenDayCourse(data, topicsToUse, grade, selectedBoard);
      } else {
        normalizedPlan = buildDeterministicSevenDayPlan(topicsToUse, grade, selectedBoard);
      }
      setAiDiagnosticResult(normalizedPlan);
      if (onSelectCourse) {
        onSelectCourse(normalizedPlan);
      }
      if (onCourseGenerated) {
        onCourseGenerated(normalizedPlan, topicsToUse);
      }
      triggerCelebration();
    } catch (e) {
      console.warn('Weakness diagnosis fallback:', e);
      const fallbackPlan = buildDeterministicSevenDayPlan(topicsToUse, grade, selectedBoard);
      setAiDiagnosticResult(fallbackPlan);
      if (onSelectCourse) {
        onSelectCourse(fallbackPlan);
      }
      if (onCourseGenerated) {
        onCourseGenerated(fallbackPlan, topicsToUse);
      }
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      onRecordWrongAnswer?.(
        currentQ.topicId || currentQ.topicNameHindi,
        currentQ.topicNameHindi,
        currentQ.topicNameEnglish,
        currentQ.questionHindi
      );
    }
    setAnswersRecord(prev => [...prev, { question: currentQ, selectedIndex: idx, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      if (score > 0) {
        triggerCelebration();
      }

      const earned = score > 0 ? Math.max(1, Math.floor(score / 2) + (score >= questions.length - 1 ? 3 : 1)) : 0;
      setLastEarnedCoins(earned);

      const weakSet = new Set<string>();
      const masteredSet = new Set<string>();
      const errorDetails: string[] = [];

      answersRecord.forEach(({ question, isCorrect }) => {
        if (isCorrect) {
          masteredSet.add(question.topicNameHindi);
        } else {
          weakSet.add(question.topicNameHindi);
          const correctText = question.options[question.correctIndex]?.textHindi || '';
          errorDetails.push(`${question.topicNameHindi}: ${question.questionHindi} (सही उत्तर: ${correctText})`);
        }
      });

      // Topics that had any wrong answer shouldn't be listed as mastered
      weakSet.forEach(w => masteredSet.delete(w));

      const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
      const quizType: 'pre' | 'post' = interactionMode === 'post' ? 'post' : 'pre';

      if (onCompleteCheckpointQuiz) {
        onCompleteCheckpointQuiz({
          quizType,
          score,
          totalQuestions: questions.length,
          answeredCount: answersRecord.length,
          percentage,
          weakTopics: Array.from(weakSet),
          masteredTopics: Array.from(masteredSet),
          errorDetails,
          earnedCoins: earned,
        });
      } else if (earned > 0) {
        onAddWordCoins(earned);
      }

      if (onRecordReport) {
        const answersMap = answersRecord.reduce<Record<string, number>>((acc, rec) => {
          acc[rec.question.id] = rec.selectedIndex;
          return acc;
        }, {});
        const report = buildWorksheetReport({
          titleHindi:
            quizType === 'pre'
              ? 'प्री-चेकपॉइंट क्विज़ रिपोर्ट (Pre-Quiz Report)'
              : 'पोस्ट-चेकपॉइंट क्विज़ रिपोर्ट (Post-Quiz Report)',
          titleEnglish:
            quizType === 'pre'
              ? 'Pre-Checkpoint Diagnostic Report'
              : 'Post-Checkpoint Mastery Report',
          questions,
          userAnswers: answersMap,
          answerLookupMode: 'byId',
          fallbackTopicId: 'mixed_board',
          fallbackTopicHindi: 'व्याकरण चेकपॉइंट',
          wordCoinsEarned: earned,
        });
        onRecordReport(
          toSavedReportSummary(report, {
            id: `cp_${quizType}_${Date.now()}`,
            sourceType: 'checkpoint_quiz',
            grade,
          })
        );
      }

      if (earned > 0) {
        triggerCoinBurst();
      }
    }
  };

  const resetQuiz = () => {
    const mode: 'pre' | 'post' = interactionMode === 'post' ? 'post' : 'pre';
    startQuizMode(mode);
  };

  const preDone = Boolean(progress?.preCheckpointCompleted);
  const postDone = Boolean(progress?.postCheckpointCompleted);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-500/20">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-900 font-serif-display">
                Pre & Post Checkpoint Quizzes
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedBoard}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {grade} {selectedBoard} के अनुसार प्री-क्विज़ व पोस्ट-क्विज़ हल करें — आपका वास्तविक स्कोर डैशबोर्ड पर स्वतः दिखेगा
            </p>
          </div>
        </div>

        {/* Top Mode Choice Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => startQuizMode('pre')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              interactionMode === 'pre'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>१. प्री-चेकपॉइंट क्विज़ (Pre-Quiz)</span>
          </button>

          <button
            type="button"
            onClick={() => startQuizMode('post')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              interactionMode === 'post'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-300" />
            <span>२. पोस्ट-चेकपॉइंट क्विज़ (Post-Quiz)</span>
          </button>

          <button
            type="button"
            onClick={() => setInteractionMode('weakness')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              interactionMode === 'weakness'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>३. कमज़ोर विषय योजना (Study Plan)</span>
          </button>
        </div>
      </div>

      {/* Live Pre & Post Completion Status Strip */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div
          onClick={() => startQuizMode('pre')}
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
            preDone
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-slate-600 block">
              चरण १: प्री-चेकपॉइंट क्विज़ (Baseline Pre-Quiz)
            </span>
            <span className={`text-xs font-black ${preDone ? 'text-emerald-800' : 'text-amber-900'}`}>
              {preDone
                ? `पूर्ण: ${progress?.preCheckpointScore ?? progress?.timeTravel.past.baselineScore}% आधारभूत स्कोर`
                : 'लंबित — प्रारंभिक स्तर जानने के लिए हल करें (Attempt to know)'}
            </span>
          </div>
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 ${
            preDone ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-950'
          }`}>
            {preDone ? 'पूर्ण ✓' : 'शुरू करें →'}
          </span>
        </div>

        <div
          onClick={() => startQuizMode('post')}
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
            postDone
              ? 'bg-indigo-50/80 border-indigo-200'
              : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-slate-600 block">
              चरण २: पोस्ट-चेकपॉइंट क्विज़ (Mastery Post-Quiz)
            </span>
            <span className={`text-xs font-black ${postDone ? 'text-indigo-900' : 'text-slate-700'}`}>
              {postDone
                ? `पूर्ण: ${progress?.postCheckpointScore ?? progress?.timeTravel.present.currentMastery}% वर्तमान दक्षता`
                : 'लंबित — वर्तमान दक्षता और सुधार जानने के लिए हल करें'}
            </span>
          </div>
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 ${
            postDone ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'
          }`}>
            {postDone ? 'पूर्ण ✓' : 'शुरू करें →'}
          </span>
        </div>
      </div>

      {/* ================= MODE 1: WEAKNESS SELECTOR ================= */}
      {interactionMode === 'weakness' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Clarifying Box: What if the student doesn't know where they are weak? */}
          <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>क्या आप नहीं जानते कि आप किस विषय में कमज़ोर हैं? (Not sure where you are weak?)</span>
              </h4>
              <p className="text-amber-900/90 leading-relaxed">
                यदि आपको अपनी कमज़ोरियाँ पता नहीं हैं, तो पहले <strong>प्री-चेकपॉइंट क्विज़</strong> हल करें — हम स्वतः बता देंगे कि किन अध्यायों पर ध्यान देना है, या पूरे {grade} पाठ्यक्रम की 7-दिवसीय योजना चुनें।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startQuizMode('pre')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>कमज़ोरी पहचानने हेतु प्री-क्विज़ दें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={isGeneratingPlan}
                onClick={() => {
                  const allTopics = [...availableWeaknessTopics];
                  setSelectedWeakTopics(allTopics);
                  handleGenerateWeaknessPlan(allTopics);
                }}
                className="px-3.5 py-2 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold rounded-xl text-xs cursor-pointer transition-all disabled:opacity-60"
              >
                पूरे {grade} की 7-दिवसीय योजना बनाएँ
              </button>
            </div>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200/80 p-4 rounded-2xl text-xs text-indigo-950 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{selectedBoard} {grade} कमज़ोर विषय चयन व 7-दिवसीय कार्ययोजना</span>
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {progress?.weakTopicsDeclared && progress.weakTopicsDeclared.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const matched = availableWeaknessTopics.filter((t) =>
                        progress.weakTopicsDeclared.some((w) => t.includes(w) || w.includes(t.split(' ')[0]))
                      );
                      setSelectedWeakTopics(matched.length > 0 ? matched : progress.weakTopicsDeclared);
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer"
                  >
                    प्री-क्विज़ कमज़ोरियाँ चुनें
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedWeakTopics([...availableWeaknessTopics])}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                >
                  सभी चुनें
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWeakTopics(availableWeaknessTopics.slice(0, 1))}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  रीसेट (1 विषय)
                </button>
              </div>
            </div>
            <p className="text-indigo-900/80 leading-relaxed">
              जिन अध्यायों का आप अभ्यास करना चाहते हैं, उन्हें नीचे चुनें। योजना में केवल आपके चुने गए विषय और सटीक <strong>7-दिवसीय (Day 1 से Day 7) दैनिक कार्ययोजना</strong> दिखाई जाएगी।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {availableWeaknessTopics.map((topic) => {
              const isSelected = selectedWeakTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleWeakTopic(topic)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isSelected ? <CheckSquare className="w-4 h-4 text-amber-300" /> : <Square className="w-4 h-4 text-slate-400" />}
                    <span>{topic}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {isSelected ? 'चयनित (Targeted)' : 'सामान्य'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500">
              नोट: अध्ययन योजना बनाने पर मुफ़्त WordCoins नहीं मिलते — WordCoins केवल क्विज़ या वर्कशीट हल करने पर अर्जित होते हैं।
            </p>
            <button
              type="button"
              disabled={isGeneratingPlan || selectedWeakTopics.length === 0}
              onClick={() => handleGenerateWeaknessPlan()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 shrink-0"
            >
              {isGeneratingPlan ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{selectedBoard} 7-दिवसीय योजना तैयार हो रही है...</span>
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4 text-amber-300" />
                  <span>व्यक्तिगत 7-दिवसीय {selectedBoard} दैनिक योजना बनाएँ</span>
                </>
              )}
            </button>
          </div>

          {/* AI Diagnostic Plan + Full 7-Day Day-to-Day Schedule Display */}
          {aiDiagnosticResult && (
            <div className="bg-slate-50 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 font-serif-display">
                      {aiDiagnosticResult.courseTitle}
                    </h4>
                    <p className="text-xs text-slate-600">{aiDiagnosticResult.summaryHindi}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full shrink-0">
                  📅 7-दिवसीय दैनिक कार्ययोजना
                </span>
              </div>

              {/* Section 1: Topic-Specific Weakness Breakdown (strictly selected topics) */}
              {Array.isArray(aiDiagnosticResult.diagnosticWeaknessNotes) && aiDiagnosticResult.diagnosticWeaknessNotes.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    १. आपके चुने गए विषयों का विश्लेषण ({aiDiagnosticResult.diagnosticWeaknessNotes.length} अध्याय)
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {aiDiagnosticResult.diagnosticWeaknessNotes.map((note: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                        <span className="font-bold text-indigo-700 block">{note.topic}</span>
                        <p className="text-slate-800 leading-relaxed font-hindi">{note.whyConfusingHindi}</p>
                        {bilingualMode && note.whyConfusingEnglish && (
                          <p className="text-[11px] text-slate-500 italic">{note.whyConfusingEnglish}</p>
                        )}
                        <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                          <strong>समाधान (Remedy):</strong> {note.remedy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 2: Full Day 1 to Day 7 Day-to-Day Plan */}
              {Array.isArray(aiDiagnosticResult.modules) && aiDiagnosticResult.modules.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-indigo-600" />
                      <span>२. संपूर्ण 7-दिवसीय दैनिक अध्ययन योजना (Day 1 – Day {aiDiagnosticResult.modules.length})</span>
                    </h5>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      पूर्ण दिन: {Object.values(completedPlanDays).filter(Boolean).length} / {aiDiagnosticResult.modules.length}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3.5">
                    {aiDiagnosticResult.modules.map((mod: any, idx: number) => {
                      const dayNum = mod.day || idx + 1;
                      const isDayDone = Boolean(completedPlanDays[dayNum]);
                      return (
                        <div
                          key={dayNum}
                          className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                            isDayDone
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white">
                                {mod.dayLabelHindi || `दिवस ${dayNum} (Day ${dayNum})`}
                              </span>
                              {mod.topicHindi && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                                  {mod.topicHindi}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setCompletedPlanDays((prev) => ({
                                  ...prev,
                                  [dayNum]: !prev[dayNum],
                                }))
                              }
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer transition-all ${
                                isDayDone
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400'
                              }`}
                            >
                              {isDayDone ? 'पूर्ण ✓' : 'पूर्ण चिह्नित करें'}
                            </button>
                          </div>

                          <div>
                            <h6 className="font-extrabold text-sm text-slate-900">{mod.title}</h6>
                            {bilingualMode && mod.titleEnglish && (
                              <span className="text-[11px] text-slate-400 block">{mod.titleEnglish}</span>
                            )}
                          </div>

                          <p className="text-slate-700 leading-relaxed font-hindi bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {mod.ruleHindi}
                          </p>

                          {Array.isArray(mod.dailyTasksHindi) && mod.dailyTasksHindi.length > 0 && (
                            <ul className="space-y-1 text-[11px] text-slate-700">
                              {mod.dailyTasksHindi.map((task: string, tIdx: number) => (
                                <li key={tIdx} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                            <span className="text-amber-900 font-medium line-clamp-2">
                              💡 {mod.quickTip}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">
                              {mod.practiceCount || 8} प्रश्न
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 2 & 3: PRE OR POST CHECKPOINT QUIZ ================= */}
      {(interactionMode === 'pre' || interactionMode === 'post') && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {!isCompleted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>
                    {interactionMode === 'pre' ? 'प्री-चेकपॉइंट क्विज़' : 'पोस्ट-चेकपॉइंट क्विज़'} • प्रश्न {currentIdx + 1} / {questions.length}
                  </span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
                  <Shuffle className="w-3 h-3 text-amber-500" />
                  <span>{currentQ.topicNameHindi} • {selectedBoard}</span>
                </span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-hindi">
                  {currentQ.questionHindi}
                </h4>
                {bilingualMode && (
                  <p className="text-xs text-slate-500 italic">
                    {currentQ.questionEnglish}
                  </p>
                )}
              </div>

              {/* Options with Random Correct Index */}
              <div className="grid sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  let btnStyle = "bg-white border-slate-200 hover:border-indigo-600 text-slate-800";

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                    } else {
                      btnStyle = "bg-white border-slate-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.textHindi}</span>
                      </div>
                      {selectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {selectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation if answered */}
              {selectedOption !== null && (
                <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>नियम व व्याख्या (Grammar Explanation):</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-hindi">
                    {currentQ.explanationHindi}
                  </p>
                  {bilingualMode && (
                    <p className="text-[11px] text-slate-500 italic">{currentQ.explanationEnglish}</p>
                  )}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{currentIdx + 1 < questions.length ? 'अगला प्रश्न (Next Question)' : 'परिणाम देखें व डैशबोर्ड अपडेट करें (Save Results)'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black font-serif-display text-slate-900">
                  {interactionMode === 'pre' ? 'प्री-चेकपॉइंट क्विज़ पूर्ण! (Pre-Quiz Completed)' : 'पोस्ट-चेकपॉइंट क्विज़ पूर्ण! (Post-Quiz Completed)'}
                </h4>
                <p className="text-sm text-slate-600">
                  आपने {questions.length} में से <strong className="text-indigo-600 font-black">{score}</strong> प्रश्न सही किए हैं (
                  <strong>{Math.round((score / questions.length) * 100)}%</strong>)। आपका डेटा डैशबोर्ड व कालचक्र में अपडेट हो गया है।
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>इनाम: +{lastEarnedCoins} WordCoins आपके खाते में जोड़ दिए गए हैं!</span>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                {interactionMode === 'pre' && (
                  <button
                    type="button"
                    onClick={() => startQuizMode('post')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer transition-all flex items-center gap-2"
                  >
                    <span>अब पोस्ट-चेकपॉइंट क्विज़ हल करें (Take Post-Quiz)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः प्रयास करें (Retake with New Shuffle)</span>
                </button>
              </div>

              {/* Full Diagnostic Report for Checkpoint Quiz */}
              <div className="pt-4 text-left">
                <WorksheetReportCard
                  report={buildWorksheetReport({
                    titleHindi:
                      interactionMode === 'pre'
                        ? 'प्री-चेकपॉइंट क्विज़ रिपोर्ट (Pre-Quiz Report)'
                        : 'पोस्ट-चेकपॉइंट क्विज़ रिपोर्ट (Post-Quiz Report)',
                    titleEnglish:
                      interactionMode === 'pre'
                        ? 'Pre-Checkpoint Diagnostic Report'
                        : 'Post-Checkpoint Mastery Report',
                    questions,
                    userAnswers: answersRecord.reduce<Record<string, number>>((acc, rec) => {
                      acc[rec.question.id] = rec.selectedIndex;
                      return acc;
                    }, {}),
                    answerLookupMode: 'byId',
                    fallbackTopicId: 'mixed_board',
                    fallbackTopicHindi: 'व्याकरण चेकपॉइंट',
                    wordCoinsEarned: lastEarnedCoins,
                  })}
                  bilingualMode={bilingualMode}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
