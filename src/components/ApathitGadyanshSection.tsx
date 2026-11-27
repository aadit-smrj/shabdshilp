import React, { useEffect, useRef, useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  Coins, 
  Loader2, 
  FileText,
  PenTool,
  Check,
  Bookmark,
  RotateCcw,
  Languages,
  AlertCircle
} from 'lucide-react';
import { APATHIT_GADYANSH_PASSAGES } from '../data/grammarData';
import { ApathitGadyanshPassage, ComprehensionShortQuestion, GradeLevel, SavedReportSummary } from '../types';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';

interface ShortAnswerReviewResult {
  hindiTranslation: string;
  status: 'correct' | 'partial' | 'incorrect';
  isCorrect: boolean;
  score: number;
  whatWasWrongHindi: string;
  whatWasWrongEnglish: string;
  correctAnswerHindi: string;
  correctAnswerEnglish: string;
}

interface ApathitGadyanshSectionProps {
  grade: GradeLevel;
  onAddWordCoins: (coins: number) => void;
  bilingualMode: boolean;
  onRecordHistory: (entry: {
    passageId: string;
    passageTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
  }) => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  history: {
    passageId: string;
    passageTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
  }[];
  focusMode?: boolean;
}

// Preset suggested topics for quick clicks
const POPULAR_TOPICS = [
  { labelHindi: 'पर्यावरण व जल संरक्षण', labelEnglish: 'Environment & Water', icon: '🌱' },
  { labelHindi: 'चंद्रयान व अंतरिक्ष विज्ञान', labelEnglish: 'Chandrayaan & Space', icon: '🚀' },
  { labelHindi: 'समय का सदुपयोग व अनुशासन', labelEnglish: 'Time Management', icon: '⏳' },
  { labelHindi: 'कृत्रिम बुद्धिमत्ता (AI) व तकनीक', labelEnglish: 'Artificial Intelligence', icon: '🤖' },
  { labelHindi: 'पुस्तकालय व अध्ययन संस्कृति', labelEnglish: 'Reading & Libraries', icon: '📖' },
  { labelHindi: 'खेलकूद और मानसिक स्वास्थ्य', labelEnglish: 'Sports & Mental Health', icon: '🏆' },
];

export const ApathitGadyanshSection: React.FC<ApathitGadyanshSectionProps> = ({
  grade,
  onAddWordCoins,
  bilingualMode,
  onRecordHistory,
  onRecordWrongAnswer,
  onRecordReport,
  history,
  focusMode = false,
}) => {
  // Initialize with randomized question options so answers are never always option A!
  const [passagesList, setPassagesList] = useState<ApathitGadyanshPassage[]>(() =>
    APATHIT_GADYANSH_PASSAGES.map((p) => ({
      ...p,
      questions: randomizeQuizSet(p.questions || [])
    }))
  );

  const [selectedPassage, setSelectedPassage] = useState<ApathitGadyanshPassage>(() => ({
    ...APATHIT_GADYANSH_PASSAGES[0],
    questions: randomizeQuizSet(APATHIT_GADYANSH_PASSAGES[0].questions || [])
  }));

  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'very_hard'>('medium');
  const [isGeneratingPassage, setIsGeneratingPassage] = useState<boolean>(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Short-answer (1-2 line English -> auto-Hindi -> AI review) state
  const [shortEnglishAnswers, setShortEnglishAnswers] = useState<Record<string, string>>({});
  const [shortHindiTranslations, setShortHindiTranslations] = useState<Record<string, string>>({});
  const [shortTranslating, setShortTranslating] = useState<Record<string, boolean>>({});
  const [shortTranslateErrors, setShortTranslateErrors] = useState<Record<string, string>>({});
  const [shortReviews, setShortReviews] = useState<Record<string, ShortAnswerReviewResult>>({});
  const [shortReviewLoading, setShortReviewLoading] = useState<Record<string, boolean>>({});
  const [shortReviewErrors, setShortReviewErrors] = useState<Record<string, string>>({});
  const [rewardedShortIds, setRewardedShortIds] = useState<Record<string, boolean>>({});
  const [recordedWrongShortIds, setRecordedWrongShortIds] = useState<Record<string, boolean>>({});

  const translateTimersRef = useRef<Record<string, number>>({});
  const translateAbortRef = useRef<Record<string, AbortController>>({});

  const resetShortQuestionStates = () => {
    Object.values(translateTimersRef.current).forEach((timerId) => window.clearTimeout(timerId));
    translateTimersRef.current = {};
    Object.values(translateAbortRef.current).forEach((ctrl) => ctrl.abort());
    translateAbortRef.current = {};
    setShortEnglishAnswers({});
    setShortHindiTranslations({});
    setShortTranslating({});
    setShortTranslateErrors({});
    setShortReviews({});
    setShortReviewLoading({});
    setShortReviewErrors({});
    setRewardedShortIds({});
    setRecordedWrongShortIds({});
  };

  useEffect(() => {
    return () => {
      Object.values(translateTimersRef.current).forEach((timerId) => window.clearTimeout(timerId));
      Object.values(translateAbortRef.current).forEach((ctrl) => ctrl.abort());
    };
  }, []);

  const handleSelectPassage = (p: ApathitGadyanshPassage) => {
    setSelectedPassage({
      ...p,
      questions: randomizeQuizSet(p.questions || [])
    });
    setUserAnswers({});
    setEvaluationResult(null);
    resetShortQuestionStates();
  };

  const handleDifficultyChange = (newDiff: 'easy' | 'medium' | 'very_hard') => {
    setDifficulty(newDiff);
    const targetId = newDiff === 'easy' ? 'gad_easy' : newDiff === 'very_hard' ? 'gad_hard' : 'gad_medium';
    const found = passagesList.find(
      (p) => p.id === targetId || p.difficulty === (newDiff === 'very_hard' ? 'hard' : newDiff)
    );
    if (found) {
      handleSelectPassage(found);
    }
  };

  const handleSelectOption = (questionId: string, optIdx: number) => {
    if (evaluationResult) return;
    setUserAnswers({ ...userAnswers, [questionId]: optIdx });
  };

  // Generate a custom comprehension passage on the user-specified topic
  const handleGenerateCustomPassage = async (topicToUse?: string) => {
    const targetTopic = (topicToUse || customTopicInput).trim();
    if (!targetTopic) return;

    setIsGeneratingPassage(true);
    setGenerationNotice(null);
    setGenerationError(null);

    try {
      const response = await fetch('/api/ai/gadyansh-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          grade,
          difficulty,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data || !data.passageHindi) {
        setGenerationError(
          data?.error || 'गद्यांश तैयार करने में समस्या आई। कृपया विषय जांचकर पुनः प्रयास करें।'
        );
        return;
      }

      const rawPassage: ApathitGadyanshPassage = data;
      const newPassage: ApathitGadyanshPassage = {
        ...rawPassage,
        questions: randomizeQuizSet(rawPassage.questions || [])
      };

      setPassagesList((prev) => [newPassage, ...prev]);
      setSelectedPassage(newPassage);
      setUserAnswers({});
      setEvaluationResult(null);
      resetShortQuestionStates();
      setCustomTopicInput('');
      setGenerationNotice(`विषय "${newPassage.titleHindi}" पर नया गद्यांश सफलतापूर्वक तैयार किया गया!`);
      triggerCelebration();
    } catch (err) {
      console.error('Error generating custom passage:', err);
      setGenerationError('नेटवर्क या सर्वर से जुड़ने में समस्या आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGeneratingPassage(false);
    }
  };

  const triggerShortAutoTranslate = async (sq: ComprehensionShortQuestion, englishText: string) => {
    const cleanText = englishText.trim();
    if (cleanText.length < 2) {
      setShortHindiTranslations((prev) => {
        const next = { ...prev };
        delete next[sq.id];
        return next;
      });
      setShortTranslating((prev) => ({ ...prev, [sq.id]: false }));
      return;
    }

    if (translateAbortRef.current[sq.id]) {
      translateAbortRef.current[sq.id].abort();
    }
    const controller = new AbortController();
    translateAbortRef.current[sq.id] = controller;

    setShortTranslating((prev) => ({ ...prev, [sq.id]: true }));
    setShortTranslateErrors((prev) => {
      const next = { ...prev };
      delete next[sq.id];
      return next;
    });

    try {
      const resp = await fetch('/api/ai/gadyansh-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          englishText: cleanText,
          passageTitle: selectedPassage.titleHindi,
          questionHindi: sq.questionHindi,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (controller.signal.aborted) return;

      if (!resp.ok || !data?.hindiTranslation) {
        setShortTranslateErrors((prev) => ({
          ...prev,
          [sq.id]: data?.error || 'अनुवाद करने में समस्या आई।',
        }));
        return;
      }

      setShortHindiTranslations((prev) => ({
        ...prev,
        [sq.id]: data.hindiTranslation,
      }));
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setShortTranslateErrors((prev) => ({
        ...prev,
        [sq.id]: 'नेटवर्क त्रुटि के कारण स्वचालित अनुवाद नहीं हो सका।',
      }));
    } finally {
      if (!controller.signal.aborted) {
        setShortTranslating((prev) => ({ ...prev, [sq.id]: false }));
      }
    }
  };

  const handleShortEnglishChange = (sq: ComprehensionShortQuestion, value: string) => {
    setShortEnglishAnswers((prev) => ({ ...prev, [sq.id]: value }));
    setShortReviewErrors((prev) => {
      const next = { ...prev };
      delete next[sq.id];
      return next;
    });

    if (translateTimersRef.current[sq.id]) {
      window.clearTimeout(translateTimersRef.current[sq.id]);
    }

    const trimmed = value.trim();
    if (!trimmed) {
      if (translateAbortRef.current[sq.id]) {
        translateAbortRef.current[sq.id].abort();
      }
      setShortHindiTranslations((prev) => {
        const next = { ...prev };
        delete next[sq.id];
        return next;
      });
      setShortTranslating((prev) => ({ ...prev, [sq.id]: false }));
      setShortTranslateErrors((prev) => {
        const next = { ...prev };
        delete next[sq.id];
        return next;
      });
      return;
    }

    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 2 || trimmed.length >= 8) {
      translateTimersRef.current[sq.id] = window.setTimeout(() => {
        triggerShortAutoTranslate(sq, value);
      }, 700);
    }
  };

  const handleReviewShortAnswer = async (sq: ComprehensionShortQuestion) => {
    const englishAns = (shortEnglishAnswers[sq.id] || '').trim();
    if (englishAns.length < 2) {
      setShortReviewErrors((prev) => ({
        ...prev,
        [sq.id]: 'कृपया पहले गद्यांश से उत्तर खोजकर अंग्रेज़ी में 1–2 पंक्तियों में लिखें।',
      }));
      return;
    }

    if (translateTimersRef.current[sq.id]) {
      window.clearTimeout(translateTimersRef.current[sq.id]);
    }

    setShortReviewLoading((prev) => ({ ...prev, [sq.id]: true }));
    setShortReviewErrors((prev) => {
      const next = { ...prev };
      delete next[sq.id];
      return next;
    });

    try {
      const resp = await fetch('/api/ai/gadyansh-short-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageTitle: selectedPassage.titleHindi,
          passageHindi: selectedPassage.passageHindi,
          grade,
          questionHindi: sq.questionHindi,
          questionEnglish: sq.questionEnglish,
          expectedAnswerHindi: sq.sampleAnswerHindi,
          expectedAnswerEnglish: sq.sampleAnswerEnglish,
          studentEnglishAnswer: englishAns,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.hindiTranslation) {
        setShortReviewErrors((prev) => ({
          ...prev,
          [sq.id]: data?.error || 'AI समीक्षा करने में समस्या आई। कृपया पुनः प्रयास करें।',
        }));
        return;
      }

      const reviewResult: ShortAnswerReviewResult = data;
      setShortHindiTranslations((prev) => ({
        ...prev,
        [sq.id]: reviewResult.hindiTranslation,
      }));
      setShortReviews((prev) => ({
        ...prev,
        [sq.id]: reviewResult,
      }));

      if (reviewResult.isCorrect && !rewardedShortIds[sq.id]) {
        setRewardedShortIds((prev) => ({ ...prev, [sq.id]: true }));
        onAddWordCoins(1);
        triggerCoinBurst();
      } else if (reviewResult.status === 'incorrect' && !recordedWrongShortIds[sq.id]) {
        setRecordedWrongShortIds((prev) => ({ ...prev, [sq.id]: true }));
        onRecordWrongAnswer?.(
          sq.topicId || 'comprehension',
          sq.topicNameHindi || 'अपठित गद्यांश',
          sq.topicNameEnglish || 'Reading Comprehension',
          sq.questionHindi
        );
      }
    } catch (err) {
      console.error('Short answer review error:', err);
      setShortReviewErrors((prev) => ({
        ...prev,
        [sq.id]: 'सर्वर से जुड़ने में समस्या आई। कृपया पुनः प्रयास करें।',
      }));
    } finally {
      setShortReviewLoading((prev) => ({ ...prev, [sq.id]: false }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerateCustomPassage();
    }
  };

  // Generate an expansive, inspiring story related to the comprehension topic
  const getRelatedStory = (passage: ApathitGadyanshPassage) => {
    if ((passage as any).relatedStoryHindi) {
      return (passage as any).relatedStoryHindi;
    }
    return `एक बार की बात है, अवंतिका नगर में 'आदर्श' नाम का एक अत्यंत परिश्रमी और विचारशील विद्यार्थी रहता था। वह विद्यालय में जो कुछ भी पढ़ता, उसे केवल परीक्षा में लिखने तक सीमित नहीं रखता था, बल्कि अपने दैनिक जीवन में उतारने का प्रयास करता था। जब गाँव में '${passage.titleHindi}' से जुड़े विषय पर गंभीर चर्चा हुई, तो सभी लोग केवल समस्याओं की गिनती कर रहे थे। किसी के पास भी ठोस उपाय नहीं था।\n\nआदर्श ने आगे बढ़कर विनम्रता से कहा—“मित्रों, केवल चिंता करने से परिस्थितियाँ नहीं बदलतीं। यदि हम छोटे-छोटे स्तर पर अनुशासन और निरंतर अभ्यास को अपनी आदत बना लें, तो यह समस्या हमारे लिए सबसे बड़ा अवसर बन सकती है।” उसने अपनी बात को सिद्ध करने के लिए अपने साथियों के साथ मिलकर प्रतिदिन एक घंटा इस दिशा में समर्पित किया।\n\nकुछ ही महीनों के भीतर उसका यह प्रयास रंग लाया। जो लोग पहले संदेह कर रहे थे, वे भी उसकी कर्मठता और लगन देखकर दंग रह गए। गाँव के मुखिया ने उसकी प्रशंसा करते हुए कहा कि सच्चा ज्ञानी वही है जो ज्ञान को आचरण में बदले। इस प्रेरक प्रसंग से हमें यही सीख मिलती है कि संकल्प और समझदारी से हर कठिन चुनौती को पार किया जा सकता है।`;
  };

  const handleSubmitEvaluation = async () => {
    setIsSubmitting(true);
    try {
      const passageQuestions = selectedPassage.questions || [];
      const passageShortQuestions = selectedPassage.shortQuestions || [];
      let verifiedMcqCorrect = 0;
      let verifiedMcqAttempted = 0;

      passageQuestions.forEach((q) => {
        const choice = userAnswers[q.id];
        const optLen = Array.isArray(q.options) ? q.options.length : 0;
        const hasAnswered =
          typeof choice === 'number' &&
          Number.isInteger(choice) &&
          choice >= 0 &&
          (optLen === 0 || choice < optLen);
        if (hasAnswered) {
          verifiedMcqAttempted++;
          if (choice === q.correctIndex) {
            verifiedMcqCorrect++;
          } else {
            onRecordWrongAnswer?.(
              q.topicId || 'comprehension',
              q.topicNameHindi || 'अपठित गद्यांश',
              q.topicNameEnglish || 'Reading Comprehension',
              q.questionHindi
            );
          }
        }
      });

      // Evaluate any typed-but-unreviewed short answers cleanly; blank ones stay skipped
      const latestShortReviews: Record<string, ShortAnswerReviewResult> = { ...shortReviews };
      const latestRewarded: Record<string, boolean> = { ...rewardedShortIds };
      const latestWrongShort: Record<string, boolean> = { ...recordedWrongShortIds };
      let newlyEarnedShortCoins = 0;

      for (const sq of passageShortQuestions) {
        if (latestShortReviews[sq.id]) continue;
        const englishAns = (shortEnglishAnswers[sq.id] || '').trim();
        if (englishAns.length < 2) continue;
        try {
          const shortResp = await fetch('/api/ai/gadyansh-short-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              passageTitle: selectedPassage.titleHindi,
              passageHindi: selectedPassage.passageHindi,
              grade,
              questionHindi: sq.questionHindi,
              questionEnglish: sq.questionEnglish,
              expectedAnswerHindi: sq.sampleAnswerHindi,
              expectedAnswerEnglish: sq.sampleAnswerEnglish,
              studentEnglishAnswer: englishAns,
            }),
          });
          const shortData = await shortResp.json().catch(() => null);
          if (shortResp.ok && shortData?.hindiTranslation) {
            const reviewResult: ShortAnswerReviewResult = shortData;
            latestShortReviews[sq.id] = reviewResult;
            setShortHindiTranslations((prev) => ({
              ...prev,
              [sq.id]: reviewResult.hindiTranslation,
            }));
            setShortReviews((prev) => ({
              ...prev,
              [sq.id]: reviewResult,
            }));
            if (reviewResult.isCorrect && !latestRewarded[sq.id]) {
              latestRewarded[sq.id] = true;
              newlyEarnedShortCoins += 1;
            } else if (reviewResult.status === 'incorrect' && !latestWrongShort[sq.id]) {
              latestWrongShort[sq.id] = true;
              onRecordWrongAnswer?.(
                sq.topicId || 'comprehension',
                sq.topicNameHindi || 'अपठित गद्यांश',
                sq.topicNameEnglish || 'Reading Comprehension',
                sq.questionHindi
              );
            }
          }
        } catch (_shortErr) {
          // Leave unreviewed as skipped if request fails
        }
      }

      if (newlyEarnedShortCoins > 0) {
        setRewardedShortIds(latestRewarded);
      }
      setRecordedWrongShortIds(latestWrongShort);

      const resp = await fetch('/api/ai/gadyansh-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageId: selectedPassage.id,
          passageTitle: selectedPassage.titleHindi,
          userAnswers,
          questions: passageQuestions,
        }),
      });
      const data = await resp.json().catch(() => ({}));

      const completedShortCount = passageShortQuestions.filter((sq) => Boolean(latestShortReviews[sq.id]?.status)).length;
      const completedShortCorrect = passageShortQuestions.filter(
        (sq) => latestShortReviews[sq.id]?.status === 'correct' && latestShortReviews[sq.id]?.isCorrect === true
      ).length;

      const totalQuestions = passageQuestions.length + passageShortQuestions.length;
      const totalAttempted = verifiedMcqAttempted + completedShortCount;
      const totalCorrect = verifiedMcqCorrect + completedShortCorrect;
      const totalUnanswered = Math.max(0, totalQuestions - totalAttempted);
      const verifiedPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      const mcqCoinsEarned = Math.floor(verifiedMcqCorrect / 2);
      const totalNewlyAwardedCoins = mcqCoinsEarned + newlyEarnedShortCoins;
      const reportCoinsEarned = mcqCoinsEarned + completedShortCorrect;

      // Always enforce deterministic counts & scores client-side too so unanswered/wrong questions never get credit
      const verifiedResult = {
        ...data,
        mcqScore: verifiedMcqCorrect,
        totalScore: totalCorrect,
        maxScore: totalQuestions,
        attemptedCount: totalAttempted,
        unansweredCount: totalUnanswered,
        percentage: verifiedPercentage,
        reportCoinsEarned,
        shortReviewsSnapshot: latestShortReviews,
        questionFeedback: passageQuestions.map((q) => {
          const choice = userAnswers[q.id];
          const optLen = Array.isArray(q.options) ? q.options.length : 0;
          const isAnswered =
            typeof choice === 'number' &&
            Number.isInteger(choice) &&
            choice >= 0 &&
            (optLen === 0 || choice < optLen);
          return {
            questionId: q.id,
            isAnswered,
            isCorrect: isAnswered && choice === q.correctIndex,
            explanationHindi: q.explanationHindi,
            explanationEnglish: q.explanationEnglish,
          };
        }),
      };

      setEvaluationResult(verifiedResult);

      // Award WordCoins strictly from verified correct answers
      if (totalNewlyAwardedCoins > 0) {
        onAddWordCoins(totalNewlyAwardedCoins);
        triggerCoinBurst();
        triggerCelebration();
      }

      // Record to comprehension history
      onRecordHistory({
        passageId: selectedPassage.id,
        passageTitle: selectedPassage.titleHindi,
        score: totalCorrect,
        maxScore: totalQuestions,
        percentage: verifiedPercentage,
        date: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' }),
      });

      if (onRecordReport) {
        const report = buildWorksheetReport({
          titleHindi: `अपठित गद्यांश: ${selectedPassage.titleHindi}`,
          titleEnglish: `Comprehension: ${selectedPassage.titleEnglish || selectedPassage.theme}`,
          questions: passageQuestions,
          userAnswers,
          answerLookupMode: 'byId',
          fallbackTopicId: 'comprehension',
          fallbackTopicHindi: 'अपठित गद्यांश एवं अर्थग्रहण',
          fallbackTopicEnglish: 'Reading Comprehension',
          wordCoinsEarned: reportCoinsEarned,
          shortQuestions: passageShortQuestions,
          shortReviews: latestShortReviews,
        });
        onRecordReport(
          toSavedReportSummary(report, {
            id: `gad_${selectedPassage.id}_${Date.now()}`,
            sourceType: 'gadyansh',
            grade,
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Average comprehension rate
  const averageComprehension = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / history.length)
    : null;

  return (
    <div className={`${focusMode ? 'space-y-5' : 'space-y-8'} animate-in fade-in duration-300`}>
      {!focusMode && (
      <>
      {/* Top Banner - Royal Indigo & Slate Theme */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-2">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-center bg-[#091124] border border-white/25 shadow-lg shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-amber-300/30 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>अर्थग्रहण, पठन कौशल व विषय आधारित गद्यांश जनरेटर (Comprehension Hub)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                अपठित गद्यांश अभ्यास व विषय आधारित रचना
              </h2>
            </div>
          </div>
          <p className="text-sm text-indigo-100 mt-2.5 leading-relaxed font-normal">
            परीक्षा में गद्यांश से शत-प्रतिशत अंक प्राप्त करने के लिए नियमित अभ्यास आवश्यक है। अब आप <strong>अपनी पसंद का कोई भी विषय लिखकर</strong> उस पर नया अपठित गद्यांश, कठिन शब्दार्थ और बहुविकल्पीय प्रश्न स्वतः तैयार कर सकते हैं!
          </p>

          {bilingualMode && (
            <p className="text-xs text-indigo-200 mt-1.5 italic">
              Generate unseen reading comprehension passages on ANY topic of your choice. Includes automated scoring, bilingual vocab notes, and longitudinal progress tracking.
            </p>
          )}

          {/* Quick Metrics */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>
                औसत समझ दर:{' '}
                <strong className="text-emerald-300 font-black">
                  {averageComprehension !== null ? `${averageComprehension}%` : 'अभ्यास से जानें (Attempt first)'}
                </strong>
              </span>
            </div>
            <div className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>हल किए गए गद्यांश: <strong className="text-amber-300 font-black">{history.length}</strong></span>
            </div>
            <div className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>पुरस्कार: <strong>प्रत्येक २ सही उत्तर = १ WordCoin</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC GENERATOR ARENA: Space where the user writes the topic to create a custom passage */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>विषय आधारित गद्यांश जनरेटर (Create Passage by Topic)</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              आप किस विषय पर अपठित गद्यांश पढ़ना चाहते हैं?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              नीचे अपना मनपसंद विषय लिखें (उदा. पर्यावरण, चंद्रयान, इंटरनेट, खेलकूद) या त्वरित सुझावों में से चुनें। AI तुरंत उस विषय पर संपूर्ण गद्यांश, शब्दार्थ व प्रश्नोत्तरी तैयार कर देगा।
            </p>
          </div>

          {/* Difficulty Level Selector (Easy, Medium, Very Hard) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-2">कठिनाई स्तर:</span>
            <button
              type="button"
              onClick={() => handleDifficultyChange('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सरल (Easy)
            </button>
            <button
              type="button"
              onClick={() => handleDifficultyChange('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मध्यम (Medium)
            </button>
            <button
              type="button"
              onClick={() => handleDifficultyChange('very_hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficulty === 'very_hard'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              अत्यंत कठिन (Very Hard)
            </button>
          </div>
        </div>

        {/* Input Bar for Topic */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="अपनी रुचि का कोई भी विषय यहाँ लिखें (उदा. रोबोटिक्स, हिमालय, सत्यमेव जयते)..."
              className="w-full text-xs font-medium px-4 py-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white text-slate-800 pr-10 shadow-2xs"
            />
            {customTopicInput && (
              <button
                type="button"
                onClick={() => setCustomTopicInput('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            disabled={isGeneratingPassage || !customTopicInput.trim()}
            onClick={() => handleGenerateCustomPassage()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {isGeneratingPassage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>गद्यांश रचा जा रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>गद्यांश तैयार करें (Generate Passage)</span>
              </>
            )}
          </button>
        </div>

        {/* Popular Topic Pills */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            त्वरित सुझाव (Click to Generate):
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TOPICS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGeneratingPassage}
                onClick={() => {
                  setCustomTopicInput(t.labelHindi);
                  handleGenerateCustomPassage(t.labelHindi);
                }}
                className="px-3.5 py-2 bg-slate-50 hover:bg-white hover:border-indigo-300 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer flex items-center gap-2 group shadow-2xs disabled:opacity-50"
              >
                <span>{t.icon}</span>
                <span className="group-hover:text-indigo-600">{t.labelHindi}</span>
                {bilingualMode && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({t.labelEnglish})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {generationNotice && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{generationNotice}</span>
          </div>
        )}

        {generationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2 animate-in fade-in">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{generationError}</span>
          </div>
        )}
      </div>

      {/* Passage Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span>उपलब्ध गद्यांश सूची (Available Passages):</span>
          <span>{passagesList.length} गद्यांश उपलब्ध</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {passagesList.map((p) => {
            const isSelected = selectedPassage.id === p.id;
            const isCustom = p.id.startsWith('custom_');

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPassage(p)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isCustom
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isCustom ? (
                  <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-amber-600'}`} />
                ) : (
                  <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                )}
                <span>{p.titleHindi}</span>
                {isCustom && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                    isSelected ? 'bg-white/20 text-amber-200' : 'bg-amber-200/60 text-amber-800'
                  }`}>
                    AI रचित
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* Main Reading & Answering Arena */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Passage Content & Vocabulary */}
        <div
          className={`${
            focusMode
              ? 'lg:col-span-6 lg:sticky lg:top-16 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1'
              : 'lg:col-span-7'
          } space-y-5`}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                  {selectedPassage.theme}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                  selectedPassage.difficulty === 'easy'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : selectedPassage.difficulty === 'hard' || (selectedPassage as any).difficulty === 'very_hard'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {selectedPassage.difficultyLabelHindi || (selectedPassage.difficulty === 'easy' ? 'सरल (Easy)' : selectedPassage.difficulty === 'hard' ? 'अत्यंत कठिन (Very Hard)' : 'मध्यम (Medium)')}
                </span>
                <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {selectedPassage.questions.length} प्रश्न ({selectedPassage.questions.length} Qs)
                </span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {selectedPassage.gradeLevel}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedPassage.titleHindi}
            </h3>

            {/* Passage Text */}
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-900 font-hindi whitespace-pre-line shadow-2xs">
              {selectedPassage.passageHindi}
            </div>

            {/* Short Hindi Summary */}
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-xs">
              <span className="font-bold text-indigo-800 block mb-1">
                संक्षिप्त हिंदी सारांश (Short Hindi Summary):
              </span>
              <p className="text-slate-800 leading-relaxed font-hindi">
                {selectedPassage.hindiSummary || selectedPassage.englishSummary}
              </p>
            </div>

            {/* Vocabulary Builder Card */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                <span>कठिन शब्दार्थ (Key Vocabulary from Passage):</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {selectedPassage.vocabularyList.map((v, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-2xs"
                  >
                    <span className="font-bold text-slate-900 block font-hindi text-sm">{v.word}</span>
                    <span className="text-indigo-700 font-semibold block text-[11px] mt-0.5">
                      अर्थ: {v.meaningHindi}
                    </span>
                    {bilingualMode && (
                      <span className="text-slate-400 block text-[10px] italic mt-0.5">
                        {v.meaningEnglish}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Inspiring Story Related to Comprehension Topic */}
            {!focusMode && (
              <div className="mt-5 p-5 bg-indigo-50/60 rounded-2xl border border-indigo-200 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>गद्यांश के विषय से जुड़ी रोचक प्रेरणादायक कहानी (प्रेरक प्रसंग):</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-hindi leading-relaxed whitespace-pre-line">
                  {getRelatedStory(selectedPassage)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Questions & Evaluation */}
        <div className={`${focusMode ? 'lg:col-span-6' : 'lg:col-span-5'} space-y-5`}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">
                  गद्यांश आधारित प्रश्न (Comprehension Questions)
                </h4>
                <p className="text-xs text-slate-500">
                  कुल {selectedPassage.questions.length} बहुविकल्पीय
                  {selectedPassage.shortQuestions && selectedPassage.shortQuestions.length > 0
                    ? ` + ${selectedPassage.shortQuestions.length} लघु प्रश्न`
                    : ''}{' '}
                  (विकल्प रैंडम मिश्रित)
                </p>
              </div>

              {evaluationResult && (
                <div className="text-right space-y-0.5">
                  <span className="text-xl font-black text-indigo-700">
                    {evaluationResult.totalScore} / {evaluationResult.maxScore}
                  </span>
                  <span className="block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 tabular-nums">
                    {evaluationResult.percentage}% अंक · हल: {evaluationResult.attemptedCount ?? 0}/{evaluationResult.maxScore}
                    {(evaluationResult.unansweredCount || 0) > 0 ? ` · छूटे: ${evaluationResult.unansweredCount}` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">
              <span>भाग १: बहुविकल्पीय प्रश्न (Multiple Choice)</span>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {selectedPassage.questions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const optLen = Array.isArray(q.options) ? q.options.length : 0;
                const hasAnswered =
                  typeof userChoice === 'number' &&
                  Number.isInteger(userChoice) &&
                  userChoice >= 0 &&
                  (optLen === 0 || userChoice < optLen);
                const isCorrect = hasAnswered && userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-slate-900 leading-snug">
                        {idx + 1}. {q.questionHindi}
                      </h5>
                      {evaluationResult && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>सही</span>
                            </span>
                          ) : hasAnswered ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>गलत</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>अनुत्तरित (0 अंक)</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {bilingualMode && (
                      <p className="text-[11px] text-slate-400 italic">
                        {q.questionEnglish}
                      </p>
                    )}

                    {/* Options */}
                    <div className="space-y-2">
                      {(() => {
                        const placeholderRx = /^(correct\s*(option|answer)|wrong\s*(option|answer)|distractor\s*\w*|option\s*([a-d]|[1-4])|choice\s*([a-d]|[1-4])|answer\s*([a-d]|[1-4])?)$/i;
                        const allHaveSafeEng = Array.isArray(q.options) && q.options.every((o) => {
                          const s = typeof o === 'object' && typeof (o as any)?.textEnglish === 'string'
                            ? (o as any).textEnglish.trim()
                            : '';
                          return s.length > 0 && !placeholderRx.test(s);
                        });
                        return q.options.map((opt, oIdx) => {
                          const isChosen = userChoice === oIdx;
                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                          if (evaluationResult) {
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
                            btnStyle = 'bg-indigo-100 border-indigo-500 text-indigo-950 font-bold';
                          }

                          const optLabel = typeof opt === 'string' ? opt : (opt as any)?.textHindi || String(opt);
                          const optEnglish = allHaveSafeEng && typeof opt === 'object' && (opt as any)?.textEnglish
                            ? (opt as any).textEnglish.trim()
                            : null;

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={!!evaluationResult}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <div>
                                <span>{optLabel}</span>
                                {bilingualMode && optEnglish && (
                                  <span className="block text-[10px] text-slate-400 font-normal">
                                    {optEnglish}
                                  </span>
                                )}
                              </div>
                              <span className="w-4 h-4 rounded-full border border-current/30 flex items-center justify-center text-[9px] font-bold shrink-0 ml-2">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Feedback Explanation */}
                    {evaluationResult && (
                      <div className="mt-2 p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                        <strong className="text-slate-900 font-bold">व्याख्या (Explanation): </strong>
                        <span className="font-bold text-slate-900">{q.explanationHindi}</span>
                        {bilingualMode && q.explanationEnglish && (
                          <p className="font-bold text-slate-600 italic mt-0.5">{q.explanationEnglish}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit or Retry Actions */}
            <div className="pt-2">
              {!evaluationResult ? (
                <button
                  type="button"
                  disabled={
                    isSubmitting ||
                    (Object.keys(userAnswers).length === 0 &&
                      Object.keys(shortReviews).length === 0 &&
                      !Object.values(shortEnglishAnswers).some((val) => val.trim().length >= 2))
                  }
                  onClick={handleSubmitEvaluation}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>स्वचालित मूल्यांकन जारी है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>उत्तर जमा करें एवं स्कोर देखें (Submit & Evaluate)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs text-slate-900">
                    <div className="font-bold mb-1 text-indigo-900 flex items-center gap-1.5 text-sm">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{evaluationResult.performanceBadgeHindi}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {evaluationResult.feedbackHindi}
                    </p>
                    {bilingualMode && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        {evaluationResult.feedbackEnglish}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById('gadyansh-diagnostic-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="mt-2.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>नीचे विस्तृत त्रुटि एवं सुधार रिपोर्ट देखें ↓</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserAnswers({});
                      setEvaluationResult(null);
                      resetShortQuestionStates();
                      // Re-shuffle for retry
                      setSelectedPassage(prev => ({
                        ...prev,
                        questions: randomizeQuizSet(prev.questions)
                      }));
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>पुनः प्रयास करें (Retry with Shuffled Options)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Part 2: 1-2 Line Short Answer Questions (English -> Auto Hindi -> AI Review) */}
            {selectedPassage.shortQuestions && selectedPassage.shortQuestions.length > 0 && (
              <div className="pt-5 mt-5 border-t-2 border-dashed border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>भाग २: लघु उत्तरीय प्रश्न (1–2 Line Short Answers)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    गद्यांश पढ़कर उत्तर खोजें और <strong>अंग्रेज़ी में 1–2 पंक्तियों में लिखें</strong>। आपका उत्तर स्वतः हिंदी में अनुवादित होगा और AI जाँचकर बताएगा कि क्या सही/गलत है व सही उत्तर क्या है।
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedPassage.shortQuestions.map((sq, sqIdx) => {
                    const englishValue = shortEnglishAnswers[sq.id] || '';
                    const hindiPreview = shortHindiTranslations[sq.id];
                    const isTranslating = !!shortTranslating[sq.id];
                    const translateError = shortTranslateErrors[sq.id];
                    const review = shortReviews[sq.id];
                    const isReviewing = !!shortReviewLoading[sq.id];
                    const reviewError = shortReviewErrors[sq.id];

                    return (
                      <div
                        key={sq.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-2xs"
                      >
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-900 leading-snug">
                            लघु प्रश्न {sqIdx + 1}. {sq.questionHindi}
                          </h5>
                          {bilingualMode && sq.questionEnglish && (
                            <p className="text-[11px] text-slate-500 italic">
                              {sq.questionEnglish}
                            </p>
                          )}
                        </div>

                        {/* English 1-2 Line Answer Input */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            अपना उत्तर अंग्रेज़ी में लिखें (Write 1–2 lines in English):
                          </label>
                          <textarea
                            rows={2}
                            value={englishValue}
                            onChange={(e) => handleShortEnglishChange(sq, e.target.value)}
                            placeholder="Read the passage and type your 1-2 line answer in English..."
                            className="w-full px-3 py-2 text-xs text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
                          />
                        </div>

                        {/* Automatic Hindi Translation Preview */}
                        {(isTranslating || hindiPreview || translateError) && (
                          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-extrabold text-indigo-900 flex items-center gap-1.5">
                                <Languages className="w-3.5 h-3.5 text-indigo-600" />
                                <span>स्वचालित हिंदी अनुवाद (Auto Hindi Translation):</span>
                              </span>
                              {!isTranslating && englishValue.trim().length >= 2 && (
                                <button
                                  type="button"
                                  onClick={() => triggerShortAutoTranslate(sq, englishValue)}
                                  className="text-[10px] font-bold text-indigo-700 hover:underline cursor-pointer"
                                >
                                  अनुवाद अपडेट करें
                                </button>
                              )}
                            </div>

                            {isTranslating ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>आपका उत्तर स्वतः हिंदी में अनुवादित हो रहा है...</span>
                              </div>
                            ) : translateError ? (
                              <p className="text-[11px] text-rose-700 font-medium">{translateError}</p>
                            ) : (
                              <p className="text-xs text-slate-900 font-hindi font-semibold leading-relaxed">
                                {hindiPreview}
                              </p>
                            )}
                          </div>
                        )}

                        {reviewError && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{reviewError}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={isReviewing || !englishValue.trim()}
                          onClick={() => handleReviewShortAnswer(sq)}
                          className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isReviewing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                              <span>अनुवाद और AI समीक्षा जारी है...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>
                                {review ? 'पुनः AI समीक्षा कराएँ (Re-check with AI)' : 'AI से उत्तर की जाँच कराएँ (Translate & Review)'}
                              </span>
                            </>
                          )}
                        </button>

                        {/* AI Review Result */}
                        {review && (
                          <div
                            className={`p-3.5 rounded-xl border space-y-2.5 animate-in fade-in ${
                              review.status === 'correct'
                                ? 'bg-emerald-50/80 border-emerald-300'
                                : review.status === 'partial'
                                ? 'bg-amber-50/80 border-amber-300'
                                : 'bg-rose-50/80 border-rose-300'
                            }`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                                  review.status === 'correct'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                    : review.status === 'partial'
                                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                                    : 'bg-rose-100 text-rose-900 border-rose-400'
                                }`}
                              >
                                {review.status === 'correct' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                ) : review.status === 'partial' ? (
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-rose-700" />
                                )}
                                <span>
                                  {review.status === 'correct'
                                    ? 'सही उत्तर (Correct!)'
                                    : review.status === 'partial'
                                    ? 'आंशिक रूप से सही (Partially Correct)'
                                    : 'गलत उत्तर (Incorrect)'}
                                </span>
                              </span>

                              {review.isCorrect && rewardedShortIds[sq.id] && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                                  <Coins className="w-3 h-3 text-amber-600" />
                                  <span>+1 WordCoin अर्जित!</span>
                                </span>
                              )}
                            </div>

                            {/* What was wrong / Feedback */}
                            <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/80 space-y-1">
                              <span className="text-[11px] font-extrabold text-slate-900 block">
                                {review.status === 'correct'
                                  ? 'AI समीक्षा (Review):'
                                  : 'क्या गलत हुआ / सुधार बिंदु (What You Did Wrong):'}
                              </span>
                              <p className="text-xs text-slate-800 leading-relaxed font-hindi">
                                {review.whatWasWrongHindi}
                              </p>
                              {bilingualMode && review.whatWasWrongEnglish && (
                                <p className="text-[11px] text-slate-500 italic">
                                  {review.whatWasWrongEnglish}
                                </p>
                              )}
                            </div>

                            {/* Exact Correct Answer from Passage */}
                            <div className="p-2.5 bg-white rounded-lg border border-emerald-200 space-y-1">
                              <span className="text-[11px] font-extrabold text-emerald-900 block">
                                सही उत्तर (Correct Answer from Passage):
                              </span>
                              <p className="text-xs text-emerald-950 font-hindi font-semibold leading-relaxed">
                                {review.correctAnswerHindi}
                              </p>
                              {bilingualMode && review.correctAnswerEnglish && (
                                <p className="text-[11px] text-slate-500 italic">
                                  {review.correctAnswerEnglish}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Historical Skills Progress Tracker Sidebar */}
          {!focusMode && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>पठन कौशल प्रगति चार्ट (Skill Tracker)</span>
            </h4>

            {evaluationResult?.comprehensionSkillMetrics ? (
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>शब्दावली अर्थग्रहण (Vocabulary)</span>
                    <span>{evaluationResult.comprehensionSkillMetrics.vocabulary}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${evaluationResult.comprehensionSkillMetrics.vocabulary}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>अनुमान व निष्कर्ष (Inference)</span>
                    <span>{evaluationResult.comprehensionSkillMetrics.inference}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-600 rounded-full" 
                      style={{ width: `${evaluationResult.comprehensionSkillMetrics.inference}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-0.5">
                    <span>केंद्रीय भाव की समझ (Central Idea)</span>
                    <span>{evaluationResult.comprehensionSkillMetrics.centralIdea}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${evaluationResult.comprehensionSkillMetrics.centralIdea}%` }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                प्रश्नों के उत्तर जमा करने पर आपके पठन कौशल का विश्लेषण यहाँ प्रकट होगा।
              </p>
            )}

            {/* Past Attempts History */}
            {history.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  पिछले प्रयास (Past Submissions):
                </span>
                <div className="space-y-1">
                  {history.slice(-3).map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-700 truncate max-w-[160px] font-medium">{h.passageTitle}</span>
                      <span className="font-extrabold text-indigo-700">{h.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Full-width Diagnostic Performance Report for Evaluated Comprehension Passage */}
      {evaluationResult && (
        <div id="gadyansh-diagnostic-report">
          <WorksheetReportCard
            report={buildWorksheetReport({
              titleHindi: `अपठित गद्यांश: ${selectedPassage.titleHindi}`,
              titleEnglish: `Comprehension: ${selectedPassage.titleEnglish || selectedPassage.theme}`,
              questions: selectedPassage.questions || [],
              userAnswers,
              answerLookupMode: 'byId',
              fallbackTopicId: 'comprehension',
              fallbackTopicHindi: 'अपठित गद्यांश एवं अर्थग्रहण',
              fallbackTopicEnglish: 'Reading Comprehension',
              wordCoinsEarned:
                typeof evaluationResult.reportCoinsEarned === 'number'
                  ? evaluationResult.reportCoinsEarned
                  : Math.floor((evaluationResult.mcqScore ?? evaluationResult.totalScore ?? 0) / 2),
              shortQuestions: selectedPassage.shortQuestions || [],
              shortReviews: {
                ...(evaluationResult.shortReviewsSnapshot || {}),
                ...shortReviews,
              },
            })}
            bilingualMode={bilingualMode}
          />
        </div>
      )}
    </div>
  );
};
