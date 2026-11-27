import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Printer, 
  Check, 
  RotateCcw, 
  Bookmark, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Download,
  BookOpen,
  Filter,
  Save,
  Clock,
  Award,
  Trash2
} from 'lucide-react';
import { GradeLevel, BoardType, QuizQuestion, SavedReportSummary } from '../types';
import { randomizeQuizSet } from '../utils/quizShuffle';
import { getUniqueWorksheetQuestions } from '../data/worksheetBank';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { triggerCelebration, triggerCoinBurst } from '../utils/confetti';
import { printWorksheetDocument } from '../utils/printWorksheet';
import { buildWorksheetReport, toSavedReportSummary } from '../utils/worksheetReport';
import { WorksheetReportCard } from './WorksheetReportCard';
import {
  saveCustomWorksheetToFirestore,
  loadCustomWorksheetsFromFirestore,
  deleteCustomWorksheetFromFirestore,
} from '../utils/firebase';

interface CustomWorksheetStudioProps {
  currentGrade: GradeLevel;
  currentBoard: BoardType;
  bilingualMode: boolean;
  onAddWordCoins: (coins: number) => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  currentUser?: { uid?: string; email: string; userName: string; grade: GradeLevel; section?: string } | null;
}

export interface GeneratedWorksheet {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  topicId: string;
  topicNameHindi: string;
  grade: GradeLevel;
  board: BoardType;
  difficulty: 'easy' | 'medium' | 'hard' | 'board_level';
  difficultyLabelHindi: string;
  questionCount: number;
  createdAt: string;
  questions: QuizQuestion[];
  instructionsHindi: string[];
  instructionsEnglish: string[];
}

const DIFFICULTY_LEVELS = [
  { id: 'easy', labelHindi: 'सरल (आधारभूत समझ)', labelEnglish: 'Easy / Foundational', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { id: 'medium', labelHindi: 'मध्यम (मानक कक्षा स्तर)', labelEnglish: 'Medium / Standard', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'hard', labelHindi: 'कठिन (गहन विश्लेषणात्मक)', labelEnglish: 'Hard / Analytical', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
  { id: 'board_level', labelHindi: 'बोर्ड परीक्षा स्तर (Board Exam)', labelEnglish: 'Board Exam Standard', badge: 'bg-rose-50 text-rose-800 border-rose-300' },
];

export const CustomWorksheetStudio: React.FC<CustomWorksheetStudioProps> = ({
  currentGrade,
  currentBoard,
  bilingualMode,
  onAddWordCoins,
  onRecordWrongAnswer,
  onRecordReport,
  currentUser,
}) => {
  // Generator configuration states
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentGrade);
  const gradeTopics = getCurriculumForGrade(selectedGrade).worksheetTopics;
  const [selectedTopic, setSelectedTopic] = useState<string>(() => getCurriculumForGrade(currentGrade).worksheetTopics[0]?.id || 'karak');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'board_level'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Sync selectedGrade when global header grade changes
  useEffect(() => {
    setSelectedGrade(currentGrade);
  }, [currentGrade]);

  // Ensure selectedTopic always belongs to selectedGrade's syllabus
  useEffect(() => {
    const valid = gradeTopics.some(t => t.id === selectedTopic);
    if (!valid && gradeTopics.length > 0) {
      setSelectedTopic(gradeTopics[0].id);
    }
  }, [selectedGrade, gradeTopics, selectedTopic]);

  const normUserEmail = (currentUser?.email || '').trim().toLowerCase();
  const storageKey = normUserEmail
    ? `shabdshilp_saved_worksheets_${normUserEmail}`
    : 'shabdshilp_saved_worksheets_guest';

  // Active worksheet state
  const [activeWorksheet, setActiveWorksheet] = useState<GeneratedWorksheet | null>(null);
  const [savedWorksheets, setSavedWorksheets] = useState<GeneratedWorksheet[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loadedKey, setLoadedKey] = useState<string>(storageKey);

  // Reload per-ID saved worksheets & merge Firestore custom worksheets when login ID changes
  useEffect(() => {
    let mounted = true;
    try {
      const raw = localStorage.getItem(storageKey);
      setSavedWorksheets(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedWorksheets([]);
    }
    setLoadedKey(storageKey);

    if (currentUser?.uid || currentUser?.email) {
      loadCustomWorksheetsFromFirestore()
        .then((cloudList) => {
          if (!mounted || !Array.isArray(cloudList)) return;
          if (cloudList.length > 0) {
            setSavedWorksheets((prev) => {
              const seen = new Set(cloudList.map((w: any) => w.id));
              return [...(cloudList as GeneratedWorksheet[]), ...prev.filter((w) => !seen.has(w.id))];
            });
          }
        })
        .catch((err) => {
          console.warn('Custom worksheets Firestore load fallback:', err);
        });
    }

    return () => {
      mounted = false;
    };
  }, [storageKey, currentUser?.uid, currentUser?.email]);

  // Solver states
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Save list strictly under the active login ID once loaded
  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedWorksheets));
    } catch (e) {
      console.warn('Failed to save worksheets to localStorage', e);
    }
  }, [savedWorksheets, storageKey, loadedKey]);

  // Generate Unique Worksheet Action (AI + Curated Unique Bank)
  const handleGenerateWorksheet = async () => {
    setIsGenerating(true);
    const topicObj = gradeTopics.find(t => t.id === selectedTopic) || gradeTopics[0];
    const diffObj = DIFFICULTY_LEVELS.find(d => d.id === selectedDifficulty) || DIFFICULTY_LEVELS[1];

    let aiQuestions: QuizQuestion[] = [];
    try {
      const response = await fetch('/api/ai/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicObj.nameHindi,
          topicId: selectedTopic,
          grade: selectedGrade,
          difficulty: selectedDifficulty,
          questionCount,
          board: 'ICSE',
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data?.questions)) {
          aiQuestions = data.questions;
        }
      }
    } catch (err) {
      console.warn('Worksheet AI fetch fallback to curated unique bank:', err);
    }

    const questions = getUniqueWorksheetQuestions(
      selectedTopic,
      questionCount,
      topicObj.nameHindi,
      topicObj.nameEnglish,
      aiQuestions,
      selectedGrade
    );

    const newWs: GeneratedWorksheet = {
      id: `ws_${Date.now()}`,
      titleHindi: `${topicObj.nameHindi} - अभ्यास वर्कशीट`,
      titleEnglish: `${topicObj.nameEnglish} - Practice Worksheet`,
      topicId: selectedTopic,
      topicNameHindi: topicObj.nameHindi,
      grade: selectedGrade,
      board: 'ICSE',
      difficulty: selectedDifficulty,
      difficultyLabelHindi: diffObj.labelHindi,
      questionCount: questions.length,
      createdAt: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      questions,
      instructionsHindi: [
        'सभी प्रश्न अनिवार्य हैं। प्रत्येक प्रश्न का केवल एक ही सही विकल्प है।',
        'प्रत्येक प्रश्न को ध्यानपूर्वक पढ़ें और सही विकल्प चुनकर उत्तर दर्ज करें।',
        "सभी प्रश्नों के उत्तर पूर्ण होने के पश्चात 'उत्तर जमा करें' बटन पर क्लिक करके अपना परिणाम व व्याख्या देखें।"
      ],
      instructionsEnglish: [
        'All questions are mandatory. Each question has exactly one correct choice.',
        'Read carefully and choose the most appropriate answer.',
        "Click 'Submit & Evaluate' upon completion to view score and detailed explanations."
      ]
    };

    setActiveWorksheet(newWs);
    setUserAnswers({});
    setIsSubmitted(false);
    setIsGenerating(false);
    triggerCelebration();
  };

  // Save current worksheet to "My Worksheets" + Firestore
  const handleSaveWorksheet = () => {
    if (!activeWorksheet) return;
    const exists = savedWorksheets.some(w => w.id === activeWorksheet.id);
    if (!exists) {
      setSavedWorksheets(prev => [activeWorksheet, ...prev]);
      saveCustomWorksheetToFirestore(activeWorksheet).catch((err) => {
        console.warn('Custom worksheet Firestore save fallback:', err);
      });
      setSaveToast("वर्कशीट सफलतापूर्वक 'मेरी वर्कशीट्स' एवं क्लाउड में सुरक्षित हो गई!");
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleDeleteSavedWorksheet = (wsId: string) => {
    setSavedWorksheets(prev => prev.filter(w => w.id !== wsId));
    if (activeWorksheet?.id === wsId) {
      setActiveWorksheet(null);
    }
    deleteCustomWorksheetFromFirestore(wsId).catch((err) => {
      console.warn('Custom worksheet Firestore delete fallback:', err);
    });
  };

  // Select option in active worksheet
  const handleSelectOption = (qId: string, oIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: oIdx }));
  };

  // Submit and evaluate
  const handleSubmitEvaluation = () => {
    if (!activeWorksheet) return;
    setIsSubmitted(true);
    let correctCount = 0;
    activeWorksheet.questions.forEach(q => {
      const choice = userAnswers[q.id];
      const optLen = Array.isArray(q.options) ? q.options.length : 0;
      const hasAnswered =
        typeof choice === 'number' &&
        Number.isInteger(choice) &&
        choice >= 0 &&
        (optLen === 0 || choice < optLen);
      if (hasAnswered) {
        if (choice === q.correctIndex) {
          correctCount++;
        } else {
          onRecordWrongAnswer?.(
            q.topicId || activeWorksheet.topicId || activeWorksheet.topicNameHindi,
            q.topicNameHindi || activeWorksheet.topicNameHindi,
            q.topicNameEnglish,
            q.questionHindi
          );
        }
      }
    });

    const coinsEarned = Math.floor(correctCount / 2);
    if (coinsEarned > 0) {
      onAddWordCoins(coinsEarned);
      triggerCoinBurst();
      triggerCelebration();
    }

    if (onRecordReport) {
      const report = buildWorksheetReport({
        titleHindi: activeWorksheet.titleHindi,
        titleEnglish: activeWorksheet.titleEnglish,
        questions: activeWorksheet.questions,
        userAnswers,
        answerLookupMode: 'byId',
        fallbackTopicId: activeWorksheet.topicId,
        fallbackTopicHindi: activeWorksheet.topicNameHindi,
        wordCoinsEarned: coinsEarned,
      });
      onRecordReport(
        toSavedReportSummary(report, {
          id: `custom_${activeWorksheet.id}_${Date.now()}`,
          sourceType: 'custom_worksheet',
          grade: activeWorksheet.grade,
        })
      );
    }
  };

  // Calculate score & attempted count strictly from valid integer choices
  const attemptedCount = activeWorksheet
    ? activeWorksheet.questions.filter(q => {
        const c = userAnswers[q.id];
        const optLen = Array.isArray(q.options) ? q.options.length : 0;
        return typeof c === 'number' && Number.isInteger(c) && c >= 0 && (optLen === 0 || c < optLen);
      }).length
    : 0;
  const score = activeWorksheet
    ? activeWorksheet.questions.filter(q => {
        const c = userAnswers[q.id];
        const optLen = Array.isArray(q.options) ? q.options.length : 0;
        return typeof c === 'number' && Number.isInteger(c) && c >= 0 && (optLen === 0 || c < optLen) && c === q.correctIndex;
      }).length
    : 0;
  const maxScore = activeWorksheet ? activeWorksheet.questions.length : 0;
  const unansweredCount = Math.max(0, maxScore - attemptedCount);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  // Print worksheet cleanly via dedicated printable sheet
  const handlePrint = (wsToPrint = activeWorksheet) => {
    if (!wsToPrint) return;
    printWorksheetDocument({
      titleHindi: wsToPrint.titleHindi,
      subtitle: `${wsToPrint.difficultyLabelHindi} • दिनांक: ${wsToPrint.createdAt}`,
      grade: wsToPrint.grade,
      board: wsToPrint.board,
      topic: wsToPrint.topicNameHindi,
      instructionsHindi: wsToPrint.instructionsHindi,
      questions: wsToPrint.questions,
      includeAnswers: wsToPrint.id === activeWorksheet?.id ? isSubmitted : false,
      includeEnglish: bilingualMode,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner - Royal Indigo & Slate Gradient */}
      <div className="print:hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-amber-300/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>अनुकूलित अभ्यास व मूल्यांकन स्टूडियो (Worksheet Lab)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            कस्टम वर्कशीट जनरेटर व सॉल्वर
          </h2>
          <p className="text-sm text-indigo-100 mt-2.5 leading-relaxed font-normal">
            अपनी आवश्यकतानुसार विषय, कक्षा, कठिनाई स्तर और प्रश्नों की संख्या चुनें। AI तुरंत संतुलित एवं बोर्ड-अनुकूल वर्कशीट तैयार करेगा। आप इसे <strong>अभी हल कर सकते हैं</strong>, <strong>बाद के लिए सुरक्षित कर सकते हैं</strong>, अथवा <strong>प्रिंट कर सकते हैं</strong>!
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 text-indigo-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>बोर्ड: <strong className="text-white">{currentBoard}</strong></span>
            </span>
            <span className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 text-indigo-200">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>रैंडम विकल्प: <strong className="text-emerald-300">A, B, C, D मिश्रित</strong></span>
            </span>
            <span className="bg-black/30 px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 text-indigo-200">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>सहेजी गई वर्कशीट्स: <strong className="text-white">{savedWorksheets.length}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Control Arena: Choose Topic, Class, Difficulty, Question Count */}
      <div className="print:hidden bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              <span>१. वर्कशीट विन्यास चुनें (Configure Your Worksheet)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              अपनी पसंद के अनुसार नीचे दिए गए पैरामीटर चुनें और 'वर्कशीट जनरेट करें' पर क्लिक करें।
            </p>
          </div>
        </div>

        {/* 1. Select Topic */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            क) {selectedGrade} पाठ्यक्रम विषय चुनें (Select Topic for {selectedGrade}):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {gradeTopics.map((t) => {
              const isSelected = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 shadow-2xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-xs font-bold leading-tight">{t.nameHindi}</span>
                  {bilingualMode && (
                    <span className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {t.nameEnglish}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grid of Class, Difficulty & Question Count */}
        <div className="grid md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          {/* Class / Grade Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              ख) कक्षा चुनें (Select Class):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['कक्षा 5', 'कक्षा 6', 'कक्षा 7', 'कक्षा 8', 'कक्षा 9', 'कक्षा 10'] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    selectedGrade === g
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              ग) कठिनाई स्तर (Difficulty):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTY_LEVELS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(d.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    selectedDifficulty === d.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="block">{d.labelHindi.split(' ')[0]}</span>
                  <span className={`text-[10px] block font-normal ${selectedDifficulty === d.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {d.labelEnglish.split('/')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              घ) प्रश्नों की संख्या (Questions Count):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    questionCount === num
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-sm block">{num}</span>
                  <span className="text-[10px] block font-normal opacity-80">प्रश्न</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateWorksheet}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 group"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                <span>वर्कशीट तैयार हो रही है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>वर्कशीट जनरेट करें (Generate Worksheet) ✨</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Worksheets Drawer if user has any */}
      {savedWorksheets.length > 0 && (
        <div className="print:hidden bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              <span>सहेजी गई वर्कशीट्स ({savedWorksheets.length}):</span>
            </span>
            <span className="text-[11px] text-slate-400">क्लिक करके कभी भी हल करें</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {savedWorksheets.map((ws) => (
              <div
                key={ws.id}
                className={`inline-flex items-center bg-white rounded-xl border text-xs font-bold transition-all whitespace-nowrap shadow-2xs ${
                  activeWorksheet?.id === ws.id ? 'border-indigo-600 text-indigo-700 ring-2 ring-indigo-100' : 'border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorksheet(ws);
                    setUserAnswers({});
                    setIsSubmitted(false);
                  }}
                  className="px-3.5 py-2 cursor-pointer flex items-center gap-2"
                >
                  <span>📄</span>
                  <span>{ws.titleHindi}</span>
                  <span className="text-[10px] text-slate-400">({ws.questionCount} प्रश्न)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(ws)}
                  title="इस वर्कशीट को प्रिंट करें"
                  className="px-1.5 py-2 text-slate-400 hover:text-indigo-600 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSavedWorksheet(ws.id)}
                  title="सहेजी गई वर्कशीट हटाएं"
                  className="pr-2.5 pl-1 py-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Active Worksheet Arena (Solve now or save for later) */}
      {activeWorksheet && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/80 shadow-md space-y-6 print:border-0 print:shadow-none print:p-2">
          {/* Worksheet Header / Meta Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-4">
            <div className="flex items-start gap-3.5">
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
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                    {activeWorksheet.topicNameHindi}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {activeWorksheet.grade}
                  </span>
                  <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                    {activeWorksheet.board} बोर्ड
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {activeWorksheet.difficultyLabelHindi}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeWorksheet.titleHindi}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  दिनांक: {activeWorksheet.createdAt} • कुल प्रश्न: {activeWorksheet.questionCount} • पूर्णांक: {activeWorksheet.questionCount}
                </p>
              </div>
            </div>

            {/* Print & Save Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSaveWorksheet}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                title="बाद में हल करने के लिए सहेजें"
              >
                <Save className="w-3.5 h-3.5 text-indigo-600" />
                <span>सहेजें (Save)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrint(activeWorksheet)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट करें (Print / PDF)</span>
              </button>
            </div>
          </div>

          {/* Worksheet Instructions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block mb-0.5">परीक्षार्थियों के लिए सामान्य निर्देश (Instructions):</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              {activeWorksheet.instructionsHindi.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          {/* Evaluation Banner if submitted */}
          {isSubmitted && (
            <div className="p-5 bg-gradient-to-r from-indigo-50 via-violet-50 to-amber-50 rounded-2xl border-2 border-indigo-200 text-slate-900 flex items-center justify-between flex-wrap gap-4 animate-in zoom-in-95">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-base font-black text-slate-900">
                    वर्कशीट मूल्यांकन परिणाम (Score Report)
                  </span>
                </div>
                <p className="text-xs text-slate-600 tabular-nums">
                  आपने {maxScore} में से <strong>{attemptedCount}</strong> प्रश्न हल किए
                  {unansweredCount > 0 ? ` (${unansweredCount} छूटे/Skipped)` : ''} — <strong>{score}</strong> सही ({percentage}% अंक)।
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-lg text-xs font-black text-amber-950">
                  <span>🪙 +{Math.floor(score / 2)} WordCoins अर्जित!</span>
                  <span className="font-semibold text-[11px] text-amber-800">(हर 2 सही उत्तर = 1 WordCoin)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-700">{score}/{maxScore}</span>
                  <span className="block text-[11px] font-bold text-emerald-700">{percentage}% प्राप्तांक</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswers({});
                    setIsSubmitted(false);
                    // Re-shuffle for retake
                    setActiveWorksheet(prev => prev ? {
                      ...prev,
                      questions: randomizeQuizSet(prev.questions)
                    } : null);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>दोबारा हल करें (Retake)</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Question Items */}
          <div className="space-y-6">
            {activeWorksheet.questions.map((q, idx) => {
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
                  className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3 transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {q.questionHindi}
                    </h4>
                    {isSubmitted && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>सही (+1)</span>
                          </span>
                        ) : hasAnswered ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>गलत (0)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <span>अनुत्तरित (0)</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {bilingualMode && (
                    <p className="text-xs text-slate-400 italic">{q.questionEnglish}</p>
                  )}

                  {/* 4 Options (A, B, C, D) with mixed answers */}
                  <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = userChoice === oIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isSubmitted) {
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

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.textHindi}</span>
                          <span className="w-5 h-5 rounded-full border border-current/30 flex items-center justify-center text-[10px] font-black shrink-0 ml-2">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation upon submission */}
                  {isSubmitted && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <strong className="text-slate-900 block font-bold">व्याख्या (Pedagogical Explanation):</strong>
                      <p className="text-slate-700 font-hindi">{q.explanationHindi}</p>
                      {bilingualMode && q.explanationEnglish && (
                        <p className="text-slate-500 italic text-[11px]">{q.explanationEnglish}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action Bar or Diagnostic Performance Report */}
          {!isSubmitted ? (
            <div className="pt-4 flex items-center justify-between flex-wrap gap-3 border-t border-slate-200 print:hidden">
              <span className="text-xs text-slate-500">
                उत्तर दिए गए प्रश्न: <strong>{Object.keys(userAnswers).length} / {activeWorksheet.questionCount}</strong>
              </span>

              <button
                type="button"
                disabled={Object.keys(userAnswers).length === 0}
                onClick={handleSubmitEvaluation}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>उत्तर जमा करें एवं स्कोर देखें (Submit & Check Score)</span>
              </button>
            </div>
          ) : (
            <div id="custom-worksheet-report" className="pt-2">
              <WorksheetReportCard
                report={buildWorksheetReport({
                  titleHindi: activeWorksheet.titleHindi,
                  titleEnglish: activeWorksheet.titleEnglish,
                  questions: activeWorksheet.questions,
                  userAnswers,
                  answerLookupMode: 'byId',
                  fallbackTopicId: activeWorksheet.topicId,
                  fallbackTopicHindi: activeWorksheet.topicNameHindi,
                  wordCoinsEarned: Math.floor(score / 2),
                })}
                bilingualMode={bilingualMode}
              />
            </div>
          )}

          {/* Printable & Screen Worksheet Bottom Branding Bar */}
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
              <span className="font-bold text-slate-700">शब्दशिल्प (ShabdShilp) • ICSE हिंदी व्याकरण वर्कशीट</span>
            </div>
            <span className="font-semibold text-slate-400">{activeWorksheet.grade}</span>
          </div>
        </div>
      )}
    </div>
  );
};
