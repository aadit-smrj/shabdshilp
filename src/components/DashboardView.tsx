import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Flame, 
  TrendingUp, 
  ArrowRight, 
  ArrowUpRight,
  Compass, 
  PenTool, 
  BookOpen, 
  Layers, 
  Cable, 
  Train, 
  Sun, 
  Clock, 
  FileCheck,
  CheckCircle2,
  GraduationCap,
  History,
  Target,
} from 'lucide-react';
import { TimeTravelMachine } from './TimeTravelMachine';
import { DashboardVocabStudio } from './DashboardVocabStudio';
import { CheckpointQuizSection } from './CheckpointQuizSection';
import { CustomWorksheetStudio } from './CustomWorksheetStudio';
import { ReviewWeakAreasSection } from './ReviewWeakAreasSection';
import { UserProgressState, GradeLevel, BoardType, CheckpointQuizResult, SavedReportSummary, CreativeHomeworkAssignment, CreativeSubmissionRecord } from '../types';
import { AppTheme, getThemeConfig } from '../utils/theme';
import { getCurriculumForGrade } from '../data/classCurriculum';
import { loadCreativeHomeworks, loadCreativeSubmissions, subscribeToCrossTabUpdates } from '../utils/firebase';
import { KATHA_SHILPI_FORMATS, WritingFormatId } from '../data/kathaShilpiData';

interface DashboardViewProps {
  progress: UserProgressState;
  grade: GradeLevel;
  selectedBoard?: BoardType;
  bilingualMode: boolean;
  onSelectTab: (tab: string) => void;
  onSelectSimulationModule?: (moduleId: string) => void;
  onOpenHomeworkInWriter?: (hw: CreativeHomeworkAssignment) => void;
  activeCourse: any | null;
  onAddWordCoins: (coins: number) => void;
  onCompleteCheckpointQuiz?: (result: CheckpointQuizResult) => void;
  onCourseGenerated?: (courseData: any, weakTopics: string[]) => void;
  onRecordWrongAnswer?: (topicOrId: string, topicNameHindi?: string, topicNameEnglish?: string, questionText?: string) => void;
  onResolveWeakTopic?: (topicKey: string) => void;
  onRecordReport?: (report: SavedReportSummary) => void;
  requestedSection?: { section: 'overview' | 'worksheet'; nonce: number } | null;
  currentUser?: { uid?: string; email: string; userName: string; grade: GradeLevel; section?: string } | null;
  theme?: AppTheme;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  grade,
  selectedBoard = 'ICSE',
  bilingualMode,
  onSelectTab,
  onSelectSimulationModule,
  onOpenHomeworkInWriter,
  activeCourse,
  onAddWordCoins,
  onCompleteCheckpointQuiz,
  onCourseGenerated,
  onRecordWrongAnswer,
  onResolveWeakTopic,
  onRecordReport,
  requestedSection,
  currentUser,
  theme = 'indigo',
}) => {
  const themeConfig = getThemeConfig(theme);
  const curriculum = getCurriculumForGrade(grade);
  const [dashboardSection, setDashboardSection] = useState<'overview' | 'worksheet'>(
    requestedSection?.section || 'overview'
  );
  const [requestedQuizTab, setRequestedQuizTab] = useState<{ mode: 'pre' | 'post'; nonce: number } | null>(null);
  const [assignedHomeworks, setAssignedHomeworks] = useState<CreativeHomeworkAssignment[]>([]);
  const [creativeSubmissions, setCreativeSubmissions] = useState<CreativeSubmissionRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    const refreshCreativeData = async () => {
      try {
        const [hws, subs] = await Promise.all([
          loadCreativeHomeworks(),
          loadCreativeSubmissions(currentUser?.email || null),
        ]);
        if (!mounted) return;
        const studentSection = (currentUser?.section || '').trim();
        const filteredHws = (Array.isArray(hws) ? hws : []).filter((hw: CreativeHomeworkAssignment) => {
          if (!hw || hw.isActive === false) return false;
          if (hw.grade && hw.grade !== grade) return false;
          if (
            hw.section &&
            !hw.section.includes('सभी') &&
            !hw.section.toLowerCase().includes('all') &&
            studentSection &&
            hw.section !== studentSection
          ) {
            return false;
          }
          return true;
        });
        setAssignedHomeworks(filteredHws);
        setCreativeSubmissions(Array.isArray(subs) ? subs : []);
      } catch (err) {
        console.warn('Creative homeworks load fallback:', err);
      }
    };
    refreshCreativeData();
    const unsubCross = subscribeToCrossTabUpdates((data) => {
      if (data.action === 'CREATIVE_HW_UPDATED' || data.action === 'CREATIVE_SUB_UPDATED') {
        refreshCreativeData();
      }
    });
    return () => {
      mounted = false;
      unsubCross();
    };
  }, [grade, currentUser?.email, currentUser?.section]);

  useEffect(() => {
    if (requestedSection?.section) {
      setDashboardSection(requestedSection.section);
    }
  }, [requestedSection]);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e) {}
    const rafId = window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {}
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const hasAttemptedQuiz = Boolean(progress.preCheckpointCompleted || progress.postCheckpointCompleted);
  const streakDays = progress.timeTravel.present.activeStreakDays;
  const weakAreasCount = Object.values(progress.mistakeHistory || {}).filter((m) => m && m.wrongCount > 0).length;

  const jumpToWeakAreasReview = () => {
    setDashboardSection('overview');
    setTimeout(() => {
      const el = document.getElementById('review-weak-areas-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const jumpToCheckpointQuiz = (mode: 'pre' | 'post' = 'pre') => {
    setDashboardSection('overview');
    setRequestedQuizTab({ mode, nonce: Date.now() });
    setTimeout(() => {
      const el = document.getElementById('checkpoint-quiz-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Modern High-Impact Hero Banner - Dynamic Theme Gradient */}
      <div
        className={`${themeConfig.studentHeroGradient} ${
          themeConfig.isLightBanner ? 'text-slate-950 border-amber-500/35' : 'text-white border-white/10'
        } rounded-3xl p-6 sm:p-10 shadow-md border relative overflow-hidden transition-all duration-500`}
      >
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-center shadow-lg border border-white/25 bg-[#091124] shrink-0"
            />
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${
                themeConfig.isLightBanner
                  ? 'bg-white/65 text-slate-950 border-slate-950/15'
                  : 'bg-white/10 text-amber-300 border-white/15'
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-ping ${themeConfig.isLightBanner ? 'bg-slate-950' : 'bg-amber-400'}`} />
              <span>ShabdShilp • {selectedBoard} Board • {grade} Master Dashboard</span>
            </div>
          </div>

          <div className="font-editorial text-4xl sm:text-6xl tracking-tight leading-tight pt-1">
            <span className={themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}>Grammar isn't a list. </span>
            <span className={themeConfig.isLightBanner ? 'text-rose-900' : 'text-amber-400'}>It's a discovery.</span>
          </div>
          
          <div
            className={`w-20 h-1 rounded-full my-2 ${
              themeConfig.isLightBanner ? 'bg-slate-950/80' : 'bg-gradient-to-r from-amber-400 to-amber-500'
            }`}
          />

          <p className={`text-xl sm:text-2xl font-display font-black ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-indigo-100'}`}>
            व्याकरण को देखें, बनाएँ और समझें।
          </p>

          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${themeConfig.isLightBanner ? 'text-slate-900 font-medium' : 'text-slate-300'}`}>
            Where Hindi grammar stops being memorised and starts being built. Interactive digital modules mapped to {selectedBoard} {grade} curriculum standards turn abstract rules into visual logic.
          </p>

          {/* Quick Metrics Bar with Modern Styling */}
          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => onSelectTab('worksheets')}
              title="वर्कशीट्स स्टोर खोलें — WordCoins से वर्कशीट अनलॉक करें (Open Worksheets Corner)"
              className={`flex items-center gap-2.5 backdrop-blur-xs px-4 py-2.5 rounded-2xl border cursor-pointer transition-all group ${
                themeConfig.isLightBanner
                  ? 'bg-white/65 hover:bg-white/90 border-slate-950/15 hover:border-slate-950/35 text-slate-900'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 hover:border-amber-300/50 text-slate-200'
              }`}
            >
              <Coins className={`w-4 h-4 group-hover:rotate-12 transition-transform ${themeConfig.isLightBanner ? 'text-amber-700' : 'text-amber-400'}`} />
              <span>
                सिक्के:{' '}
                <strong className={`text-sm font-black ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-300'}`}>
                  {progress.wordCoins} WordCoins
                </strong>
              </span>
              <ArrowUpRight className={`w-3.5 h-3.5 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${themeConfig.isLightBanner ? 'text-slate-700' : 'text-amber-300'}`} />
            </button>

            {hasAttemptedQuiz ? (
              <div
                className={`flex items-center gap-2.5 backdrop-blur-xs px-4 py-2.5 rounded-2xl border ${
                  themeConfig.isLightBanner
                    ? 'bg-white/65 border-slate-950/15 text-slate-900'
                    : 'bg-white/10 border-white/15 text-slate-200'
                }`}
              >
                <TrendingUp className={`w-4 h-4 ${themeConfig.isLightBanner ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span>
                  वर्तमान दक्षता:{' '}
                  <strong className={`text-sm font-black ${themeConfig.isLightBanner ? 'text-emerald-900' : 'text-emerald-300'}`}>
                    {progress.timeTravel.present.currentMastery}%
                  </strong>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => jumpToCheckpointQuiz('pre')}
                className={`flex items-center gap-2.5 backdrop-blur-xs px-4 py-2.5 rounded-2xl border cursor-pointer transition-all text-left ${
                  themeConfig.isLightBanner
                    ? 'bg-white/65 hover:bg-white/85 border-slate-950/20 text-slate-900'
                    : 'bg-white/10 hover:bg-white/20 border-amber-300/35 text-slate-200'
                }`}
                title="दक्षता जानने के लिए प्री-चेकपॉइंट क्विज़ हल करें"
              >
                <TrendingUp className={`w-4 h-4 shrink-0 ${themeConfig.isLightBanner ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span>
                  वर्तमान दक्षता:{' '}
                  <strong className={`font-black ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-300'}`}>
                    {bilingualMode ? 'क्विज़ हल करें (Attempt Quiz to Know)' : 'क्विज़ हल करें'}
                  </strong>
                </span>
              </button>
            )}

            {streakDays > 0 ? (
              <div
                className={`flex items-center gap-2.5 backdrop-blur-xs px-4 py-2.5 rounded-2xl border ${
                  themeConfig.isLightBanner
                    ? 'bg-white/65 border-slate-950/15 text-slate-900'
                    : 'bg-white/10 border-white/15 text-slate-200'
                }`}
              >
                <Flame className={`w-4 h-4 ${themeConfig.isLightBanner ? 'text-rose-700' : 'text-rose-400'}`} />
                <span>
                  सक्रिय स्ट्रीक:{' '}
                  <strong className={`text-sm font-black ${themeConfig.isLightBanner ? 'text-rose-900' : 'text-rose-300'}`}>
                    {streakDays} दिन
                  </strong>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => jumpToCheckpointQuiz('pre')}
                className={`flex items-center gap-2.5 backdrop-blur-xs px-4 py-2.5 rounded-2xl border cursor-pointer transition-all text-left ${
                  themeConfig.isLightBanner
                    ? 'bg-white/65 hover:bg-white/85 border-slate-950/15 text-slate-900'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
                }`}
                title="अपनी सक्रिय स्ट्रीक शुरू करने के लिए क्विज़ हल करें"
              >
                <Flame className={`w-4 h-4 shrink-0 ${themeConfig.isLightBanner ? 'text-rose-700' : 'text-rose-400'}`} />
                <span>
                  सक्रिय स्ट्रीक:{' '}
                  <strong className={`font-black ${themeConfig.isLightBanner ? 'text-rose-950' : 'text-rose-200'}`}>
                    {bilingualMode ? 'क्विज़ से शुरू करें (Start Quiz)' : '0 दिन (क्विज़ दें)'}
                  </strong>
                </span>
              </button>
            )}

            {/* Quick Link to Board Syllabus */}
            <button
              onClick={() => onSelectTab('syllabus')}
              className={`flex items-center gap-1.5 px-4 py-2.5 font-black rounded-2xl shadow-xs transition-all cursor-pointer text-xs ${
                themeConfig.isLightBanner
                  ? 'bg-slate-950 hover:bg-slate-800 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{selectedBoard} {grade} पाठ्यक्रम</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Link to Custom Worksheet Studio Tab */}
            <button
              onClick={() => setDashboardSection('worksheet')}
              className={`flex items-center gap-1.5 px-4 py-2.5 font-black rounded-2xl border shadow-xs transition-all cursor-pointer text-xs ${
                themeConfig.isLightBanner
                  ? 'bg-white/75 hover:bg-white/95 text-slate-950 border-slate-950/20'
                  : 'bg-white/20 hover:bg-white/30 text-white border-white/25'
              }`}
            >
              <FileCheck className={`w-4 h-4 ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>कस्टम वर्कशीट जनरेटर (New!)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {weakAreasCount > 0 && (
              <button
                type="button"
                onClick={jumpToWeakAreasReview}
                className={`flex items-center gap-1.5 px-4 py-2.5 font-black rounded-2xl border shadow-xs transition-all cursor-pointer text-xs ${
                  themeConfig.isLightBanner
                    ? 'bg-rose-950/90 hover:bg-rose-950 text-white border-rose-950'
                    : 'bg-rose-500/25 hover:bg-rose-500/35 text-white border-rose-300/40'
                }`}
              >
                <Target className="w-4 h-4 text-rose-200" />
                <span>कमज़ोर विषय ({weakAreasCount}) — Review Weak Areas</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DASHBOARD SUB-TABS NAVIGATION BAR */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90 w-fit max-w-full overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setDashboardSection('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            dashboardSection === 'overview'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-xs`
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>१. मुख्य डैशबोर्ड व कालचक्र</span>
          {bilingualMode && <span className="opacity-80 text-[10px] font-normal hidden sm:inline">(Overview)</span>}
        </button>

        <button
          type="button"
          onClick={() => setDashboardSection('worksheet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            dashboardSection === 'worksheet'
              ? `${themeConfig.primaryBg} ${themeConfig.primaryTextOnBg} shadow-xs`
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileCheck
            className={`w-3.5 h-3.5 ${
              dashboardSection === 'worksheet'
                ? themeConfig.isLightBanner
                  ? 'text-slate-950'
                  : 'text-amber-300'
                : 'text-amber-600'
            }`}
          />
          <span>२. वर्कशीट जनरेटर व सॉल्वर</span>
          {bilingualMode && <span className="opacity-80 text-[10px] font-normal hidden sm:inline">(Worksheets)</span>}
        </button>
      </div>

      {/* TAB 2: EMBEDDED WORKSHEET GENERATOR & SOLVER */}
      {dashboardSection === 'worksheet' && (
        <CustomWorksheetStudio
          currentGrade={grade}
          currentBoard={selectedBoard}
          bilingualMode={bilingualMode}
          onAddWordCoins={onAddWordCoins}
          onRecordWrongAnswer={onRecordWrongAnswer}
          onRecordReport={onRecordReport}
          currentUser={currentUser}
        />
      )}

      {/* TAB 1: MAIN OVERVIEW */}
      {dashboardSection === 'overview' && (
        <>
          {/* NEW FEATURE BANNER: CUSTOM WORKSHEET STUDIO */}
          <div 
            onClick={() => setDashboardSection('worksheet')}
            className={`${themeConfig.featureBannerGradient} ${
              themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'
            } rounded-3xl p-6 sm:p-7 border ${themeConfig.featureBannerBorder} shadow-md relative overflow-hidden group cursor-pointer hover:border-amber-400/60 transition-all duration-500`}
          >
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/15 transition-all" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    themeConfig.isLightBanner ? 'bg-slate-950 text-white' : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>नया फीचर: वर्कशीट जनरेटर व सॉल्वर (Worksheet Studio)</span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black font-serif-display ${themeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}`}>
                  अपनी पसंद का विषय, कक्षा, कठिनाई स्तर व प्रश्नों की संख्या चुनें
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-hindi ${themeConfig.isLightBanner ? 'text-slate-900 font-medium' : 'text-slate-300'}`}>
                  {grade} पाठ्यक्रम के सभी विषयों में से चुनें। 5 से 20 अनूठे प्रश्नों की वर्कशीट जनरेट करें — <strong>सभी विकल्प यादृच्छिक (Mixed Answers A/B/C/D)</strong> हैं और हर 2 सही उत्तर पर 1 WordCoin मिलता है।
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDashboardSection('worksheet');
                  }}
                  className={`px-5 py-3 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all group-hover:scale-105 ${
                    themeConfig.isLightBanner
                      ? 'bg-slate-950 hover:bg-slate-800 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <span>वर्कशीट बनाएँ और हल करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

      {/* AI Language & Vocab Studio Tabs */}
      <DashboardVocabStudio bilingualMode={bilingualMode} />

      {/* Pre & Post Checkpoint Quizzes with Board Context & Random Options */}
      <div id="checkpoint-quiz-section">
        <CheckpointQuizSection
          grade={grade}
          selectedBoard={selectedBoard}
          bilingualMode={bilingualMode}
          onAddWordCoins={onAddWordCoins}
          progress={progress}
          onCompleteCheckpointQuiz={onCompleteCheckpointQuiz}
          onCourseGenerated={onCourseGenerated}
          onRecordWrongAnswer={onRecordWrongAnswer}
          onRecordReport={onRecordReport}
          requestedQuizTab={requestedQuizTab}
        />
      </div>

      {/* Embedded TIME TRAVEL MACHINE */}
      <TimeTravelMachine
        progress={progress}
        grade={grade}
        selectedBoard={selectedBoard}
        bilingualMode={bilingualMode}
        theme={theme}
        onQuickSimulate={(topicId) =>
          onSelectSimulationModule ? onSelectSimulationModule(topicId) : onSelectTab('modules')
        }
        onStartCheckpointQuiz={jumpToCheckpointQuiz}
      />

      {/* REVIEW WEAK AREAS MINI-QUIZ (from mistakeHistory) */}
      <ReviewWeakAreasSection
        mistakeHistory={progress.mistakeHistory || {}}
        grade={grade}
        bilingualMode={bilingualMode}
        onAddWordCoins={onAddWordCoins}
        onRecordWrongAnswer={onRecordWrongAnswer}
        onRecordReport={onRecordReport}
        onResolveWeakTopic={onResolveWeakTopic}
        onStartCheckpointQuiz={jumpToCheckpointQuiz}
      />

      {/* Active AI Personalized Course Plan (if generated) */}
      {activeCourse && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">
                  सक्रिय व्यक्तिगत पाठ्यक्रम (Active Personalized Plan)
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedBoard} {grade} कमज़ोरियों के आधार पर तैयार किया गया पाठ्यक्रम
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              {activeCourse.estimatedDays || 7} दिवस कार्यक्रम
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800">
            <h4 className="text-sm font-bold text-indigo-700 font-display mb-1">{activeCourse.courseTitle}</h4>
            <p className="text-slate-600 leading-relaxed font-hindi">{activeCourse.summaryHindi}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeCourse.modules?.map((m: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    {m.dayLabelHindi || `दिवस ${m.day || idx + 1}`}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {m.practiceCount || 8} प्रश्न
                  </span>
                </div>
                <div className="font-bold text-slate-900">{m.title}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{m.ruleHindi}</p>
                {Array.isArray(m.dailyTasksHindi) && m.dailyTasksHindi.length > 0 && (
                  <ul className="space-y-0.5 text-[11px] text-slate-700 pt-1 border-t border-slate-200/70">
                    {m.dailyTasksHindi.map((t: string, ti: number) => (
                      <li key={ti} className="flex items-start gap-1">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASSIGNED CREATIVE WRITING HOMEWORKS (रचनात्मक लेखन गृहकार्य) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif-display">
                रचनात्मक लेखन गृहकार्य (Assigned Creative Writing Homeworks)
              </h3>
              <p className="text-xs text-slate-500">
                शिक्षक द्वारा दिए गए अनुच्छेद, पत्र या कथा लेखन कार्य — सीधे टाइप करें या हस्तलिखित फोटो अपलोड करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('story-builder')}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>कथा शिल्पी AI खोलें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {assignedHomeworks.length === 0 ? (
          <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-hindi">
              अभी {grade} के लिए कोई नया रचनात्मक गृहकार्य पेंडिंग नहीं है। आप कथा शिल्पी AI में स्वतंत्र अभ्यास कर सकते हैं।
            </span>
            <button
              type="button"
              onClick={() => onSelectTab('story-builder')}
              className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>स्वतंत्र लेखन शुरू करें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {assignedHomeworks.map((hw) => {
              const matchingSubs = [
                ...creativeSubmissions,
                ...(progress.kathaShilpiPortfolio || []),
              ].filter((s) => s.homeworkId === hw.id);
              const latestSub = matchingSubs[0];
              const hwStatus: 'Pending' | 'Submitted' | 'Reviewed' =
                latestSub?.status === 'Reviewed'
                  ? 'Reviewed'
                  : latestSub
                  ? 'Submitted'
                  : 'Pending';
              const genreSpec =
                KATHA_SHILPI_FORMATS[hw.genreId as WritingFormatId] || KATHA_SHILPI_FORMATS.anuched;

              return (
                <div
                  key={hw.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {genreSpec.titleHindi}
                      </span>
                      <span
                        className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                          hwStatus === 'Reviewed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : hwStatus === 'Submitted'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {hwStatus === 'Reviewed'
                          ? '✅ Reviewed (जाँचा गया)'
                          : hwStatus === 'Submitted'
                          ? '📤 Submitted (जमा)'
                          : '⏳ Pending (लंबित)'}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-sm sm:text-base font-hindi">
                      {hw.titleHindi}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-hindi">
                      {hw.instructionsHindi}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>
                        शब्द सीमा: <strong className="text-slate-800">{hw.wordLimit} शब्द</strong>
                      </span>
                      <span>•</span>
                      <span>
                        अंतिम तिथि: <strong className="text-slate-800">{hw.dueDate}</strong>
                      </span>
                      {latestSub && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            अंक: {latestSub.overallScore}/100
                          </span>
                        </>
                      )}
                    </div>

                    {latestSub?.teacherRemarks && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 font-hindi">
                        <strong>शिक्षक टिप्पणी:</strong> {latestSub.teacherRemarks}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenHomeworkInWriter
                        ? onOpenHomeworkInWriter(hw)
                        : onSelectTab('story-builder')
                    }
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      hwStatus === 'Pending'
                        ? 'bg-indigo-700 hover:bg-indigo-800 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>
                      {hwStatus === 'Pending'
                        ? 'लिखें / हस्तलिखित अपलोड करें'
                        : 'दोबारा अभ्यास करें / समीक्षा देखें'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CLASS-ADAPTIVE GRAMMAR MODULES CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-serif-display">
              व्याकरण सिमुलेशन मॉड्यूल्स ({selectedBoard} {grade} Aligned)
            </h3>
            <p className="text-xs text-slate-500">
              डिजिटल सिमुलेशन शुरू करने के लिए किसी भी कार्ड पर क्लिक करें
            </p>
          </div>
          <button
            onClick={() => onSelectTab('modules')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>सभी {curriculum.simulationModuleIds.length} मॉड्यूल्स देखें (See all {curriculum.simulationModuleIds.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {curriculum.featuredCards.map((card) => (
            <div
              key={card.moduleId}
              onClick={() =>
                onSelectSimulationModule
                  ? onSelectSimulationModule(card.moduleId)
                  : onSelectTab('modules')
              }
              className={`${card.gradientClass} rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-[290px] shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`}
            >
              <div>
                <div
                  className={`text-[11px] font-extrabold uppercase tracking-widest mb-2 font-mono ${
                    card.textDark ? 'text-amber-950/80' : 'text-indigo-200'
                  }`}
                >
                  {card.tag}
                </div>

                <h4
                  className={`font-serif-display text-3xl sm:text-4xl font-black tracking-tight ${
                    card.textDark ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {card.title}
                </h4>

                <p
                  className={`text-xs sm:text-sm mt-4 leading-relaxed font-normal ${
                    card.textDark ? 'text-amber-950/90' : 'text-indigo-100'
                  }`}
                >
                  {card.description}
                </p>
              </div>

              <div className="pt-6 space-y-3">
                <div
                  className={`border-t pt-2 text-[10px] font-black uppercase tracking-widest text-right font-mono ${
                    card.textDark
                      ? 'border-amber-700/20 text-amber-950/80'
                      : 'border-white/20 text-indigo-200'
                  }`}
                >
                  {card.footerTag}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3.5 py-1.5 rounded-full font-bold text-xs shadow-2xs font-hindi ${
                      card.textDark
                        ? 'bg-white/95 text-slate-950'
                        : 'bg-white text-indigo-950'
                    }`}
                  >
                    {card.pillText}
                  </span>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform ${
                      card.textDark
                        ? 'bg-white text-slate-950'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
