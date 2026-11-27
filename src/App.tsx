/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GrammarModulesView } from './components/GrammarModulesView';
import { UpsargPratyayStudio } from './components/UpsargPratyayStudio';
import { ApathitGadyanshSection } from './components/ApathitGadyanshSection';
import { WorksheetsStore } from './components/WorksheetsStore';
import {
  AuthModal,
  AuthUserSession,
  TeacherHonorific,
  checkIsTeacherEmail,
  detectHonorificFromName,
  extractNameFromEmail,
  formatTeacherNameWithHonorific,
  isAllowedShabdshilpEmail,
} from './components/AuthModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SyllabusView } from './components/SyllabusView';
import { CustomWorksheetStudio } from './components/CustomWorksheetStudio';
import { StoryBuilder } from './components/StoryBuilder';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { LogOut, ShieldAlert } from 'lucide-react';
import {
  UserProgressState,
  GradeLevel,
  BoardType,
  CheckpointQuizResult,
  MistakeTopicStat,
  SavedReportSummary,
  SavedWorksheetResult,
  SimulationTopicMetric,
  WorkbookAttemptRecord,
  CreativeHomeworkAssignment,
  CreativeSubmissionRecord,
} from './types';
import {
  saveUserProgressToFirestore,
  loadUserProgressDetailed,
  saveUserDataFirestore,
  saveUserProfileServer,
  getUserDataFirestore,
  subscribeToAuthState,
  logoutFirebase,
  clearServerSessionToken,
  getServerSessionToken,
  isQuotaExceededError,
  saveLocalProgressForEmail,
  loadBestLocalProgressForEmail,
  hasMeaningfulProgress,
} from './utils/firebase';
import { AppTheme, loadSavedTheme, saveAppTheme, getThemeConfig } from './utils/theme';
import { getCurriculumForGrade } from './data/classCurriculum';
import {
  resolveTopicKeyFromString,
  getCanonicalTopicLabels,
  isInternalSimKeySnippet,
  sanitizeMistakeSampleQuestions,
} from './data/worksheetBank';

const createFreshProgress = (
  userName: string = 'विद्यार्थी (Student)',
  grade: GradeLevel = 'कक्षा 8'
): UserProgressState => ({
  hasOnboarded: false,
  onboardingMode: 'none',
  selectedGrade: grade,
  userName,
  wordCoins: 0,
  correctAnswersTotal: 0,
  totalQuestionsAnswered: 0,
  weakTopicsDeclared: [],
  diagnosticScore: 0,
  preCheckpointCompleted: false,
  postCheckpointCompleted: false,
  preCheckpointScore: null,
  postCheckpointScore: null,
  lastActiveDate: null,
  timeTravel: {
    past: {
      date: 'प्री-क्विज़ लंबित (Pre-Quiz Pending)',
      baselineScore: 0,
      weakTopics: [],
      notesHindi: 'अपना प्रारंभिक स्तर और कमज़ोर विषय जानने के लिए कृपया पहले प्री-चेकपॉइंट क्विज़ (Pre-Checkpoint Quiz) हल करें।',
      notesEnglish: 'Please attempt the Pre-Checkpoint Quiz first to measure your baseline score and weak areas.',
      errorsAnalysis: [],
    },
    present: {
      currentMastery: 0,
      topicsMastered: [],
      improvementPercentage: 0,
      activeStreakDays: 0,
      accuracyRate: 0,
    },
    future: {
      projectedExamScore: 0,
      boardTargetStatus: 'क्विज़ हल करने के बाद उपलब्ध (Attempt Quiz to Know)',
      strategicRoadmap: [],
    },
  },
  unlockedWorksheetIds: [],
  badgesEarned: [],
  gadyanshHistory: [],
  savedReports: [],
  completedSimulationModules: [],
  simulationCompletions: {},
  simulationTopicMetrics: {},
  workbookAttempts: [],
  kathaShilpiPortfolio: [],
  completedWorksheetResults: {},
  mistakeHistory: {},
  upsargPratyaySearchesCount: 0,
  storiesCreatedCount: 0,
});

const sanitizeProgressState = (
  raw: any,
  fallbackName?: string,
  fallbackGrade?: GradeLevel
): UserProgressState => {
  const safeName = fallbackName || 'विद्यार्थी (Student)';
  const safeGrade = fallbackGrade || 'कक्षा 8';
  if (!raw || typeof raw !== 'object') {
    return createFreshProgress(safeName, safeGrade);
  }

  const isLegacyFakeSeed =
    raw?.timeTravel?.past?.baselineScore === 42 &&
    raw?.timeTravel?.present?.currentMastery === 88 &&
    raw?.timeTravel?.present?.activeStreakDays === 6 &&
    !raw?.preCheckpointCompleted &&
    !raw?.postCheckpointCompleted &&
    typeof raw?.timeTravel?.past?.notesHindi === 'string' &&
    raw.timeTravel.past.notesHindi.includes('प्रारंभिक मूल्यांकन में आप "से" विभक्ति');

  const isPlaceholderName = (name?: string) =>
    !name ||
    name === 'आरव वर्मा (Aarav - 8E)' ||
    name === 'विद्यार्थी (Student)' ||
    name === 'विद्यार्थी';

  if (isLegacyFakeSeed) {
    const cleanName = !isPlaceholderName(raw.userName) ? raw.userName : safeName;
    return createFreshProgress(cleanName, raw.selectedGrade || safeGrade);
  }

  const resolvedName = !isPlaceholderName(safeName)
    ? safeName
    : !isPlaceholderName(raw.userName)
    ? raw.userName
    : safeName;

  const fresh = createFreshProgress(
    resolvedName,
    raw.selectedGrade || safeGrade
  );

  return {
    ...fresh,
    ...raw,
    userName: resolvedName,
    wordCoins:
      typeof raw.wordCoins === 'number' && Number.isFinite(raw.wordCoins) && raw.wordCoins >= 0
        ? raw.wordCoins
        : 0,
    correctAnswersTotal:
      typeof raw.correctAnswersTotal === 'number' && Number.isFinite(raw.correctAnswersTotal) && raw.correctAnswersTotal >= 0
        ? raw.correctAnswersTotal
        : 0,
    totalQuestionsAnswered:
      typeof raw.totalQuestionsAnswered === 'number' && Number.isFinite(raw.totalQuestionsAnswered) && raw.totalQuestionsAnswered >= 0
        ? raw.totalQuestionsAnswered
        : 0,
    preCheckpointCompleted: Boolean(raw.preCheckpointCompleted),
    postCheckpointCompleted: Boolean(raw.postCheckpointCompleted),
    preCheckpointScore: typeof raw.preCheckpointScore === 'number' ? raw.preCheckpointScore : null,
    postCheckpointScore: typeof raw.postCheckpointScore === 'number' ? raw.postCheckpointScore : null,
    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate : null,
    timeTravel: {
      past: { ...fresh.timeTravel.past, ...(raw.timeTravel?.past || {}) },
      present: { ...fresh.timeTravel.present, ...(raw.timeTravel?.present || {}) },
      future: { ...fresh.timeTravel.future, ...(raw.timeTravel?.future || {}) },
    },
    unlockedWorksheetIds: Array.isArray(raw.unlockedWorksheetIds) ? raw.unlockedWorksheetIds : [],
    badgesEarned: Array.isArray(raw.badgesEarned) ? raw.badgesEarned : [],
    gadyanshHistory: Array.isArray(raw.gadyanshHistory) ? raw.gadyanshHistory : [],
    savedReports: Array.isArray(raw.savedReports) ? raw.savedReports : [],
    completedSimulationModules: Array.isArray(raw.completedSimulationModules)
      ? Array.from(new Set(raw.completedSimulationModules.filter((id: unknown) => typeof id === 'string')))
      : [],
    simulationCompletions:
      raw.simulationCompletions && typeof raw.simulationCompletions === 'object' && !Array.isArray(raw.simulationCompletions)
        ? Object.entries(raw.simulationCompletions).reduce<Record<string, number>>((acc, [k, v]) => {
            if (typeof k === 'string' && typeof v === 'number' && Number.isFinite(v) && v >= 0) {
              acc[k] = Math.floor(v);
            }
            return acc;
          }, {})
        : {},
    simulationTopicMetrics:
      raw.simulationTopicMetrics && typeof raw.simulationTopicMetrics === 'object' && !Array.isArray(raw.simulationTopicMetrics)
        ? Object.entries(raw.simulationTopicMetrics as Record<string, SimulationTopicMetric>).reduce<Record<string, SimulationTopicMetric>>(
            (acc, [k, m]) => {
              if (!m || typeof m !== 'object') return acc;
              acc[k] = {
                completions: Math.max(0, Math.floor(Number(m.completions) || 0)),
                attempts: Math.max(0, Math.floor(Number(m.attempts) || 0)),
                totalScoreSum: Math.max(0, Number(m.totalScoreSum) || 0),
                totalMaxSum: Math.max(0, Number(m.totalMaxSum) || 0),
                lastAccuracyPct: Math.min(100, Math.max(0, Number(m.lastAccuracyPct) || 0)),
                lastCompletedAt: typeof m.lastCompletedAt === 'string' ? m.lastCompletedAt : '',
              };
              return acc;
            },
            {}
          )
        : {},
    workbookAttempts: Array.isArray(raw.workbookAttempts) ? raw.workbookAttempts.slice(-40) : [],
    kathaShilpiPortfolio: Array.isArray(raw.kathaShilpiPortfolio) ? raw.kathaShilpiPortfolio.slice(-30) : [],
    completedWorksheetResults:
      raw.completedWorksheetResults &&
      typeof raw.completedWorksheetResults === 'object' &&
      !Array.isArray(raw.completedWorksheetResults)
        ? raw.completedWorksheetResults
        : {},
    mistakeHistory:
      raw.mistakeHistory && typeof raw.mistakeHistory === 'object' && !Array.isArray(raw.mistakeHistory)
        ? Object.entries(raw.mistakeHistory as Record<string, MistakeTopicStat>).reduce<Record<string, MistakeTopicStat>>(
            (acc, [key, stat]) => {
              if (!stat || typeof stat !== 'object') return acc;
              acc[key] = {
                ...stat,
                sampleQuestions: sanitizeMistakeSampleQuestions(stat.sampleQuestions),
              };
              return acc;
            },
            {}
          )
        : {},
  };
};

const computeNextStreak = (prev: UserProgressState): { activeStreakDays: number; lastActiveDate: string } => {
  const today = new Date().toISOString().slice(0, 10);
  const currentStreak = prev.timeTravel?.present?.activeStreakDays || 0;
  if (!prev.lastActiveDate || currentStreak === 0) {
    return { activeStreakDays: 1, lastActiveDate: today };
  }
  if (prev.lastActiveDate === today) {
    return { activeStreakDays: currentStreak, lastActiveDate: today };
  }
  const prevTime = new Date(prev.lastActiveDate).getTime();
  const todayTime = new Date(today).getTime();
  const diffDays = Math.round((todayTime - prevTime) / (1000 * 60 * 60 * 24));
  return {
    activeStreakDays: diffDays === 1 ? currentStreak + 1 : 1,
    lastActiveDate: today,
  };
};

export default function App() {
  // Always start cleanly at Dashboard after fresh login on every visit
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const scrollToPageTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch (e) {}
  };

  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      sessionStorage.removeItem('shabdshilp_tab_user');
      sessionStorage.removeItem('shabdshilp_session_tab');
      localStorage.removeItem('shabdshilp_auth_user');
    } catch (e) {}
    scrollToPageTop();
    const rafId = window.requestAnimationFrame(scrollToPageTop);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleSelectTab = (tab: string) => {
    if (tab === 'modules') {
      setSelectedSimModuleId(null);
    }
    if (tab !== 'story-builder') {
      setSelectedCreativeHomework(null);
    }
    setCurrentTab(tab);
    scrollToPageTop();
    window.requestAnimationFrame(scrollToPageTop);
  };

  const [bilingualMode, setBilingualMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shabdshilp_bilingual_mode');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const handleToggleBilingual = () => {
    setBilingualMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('shabdshilp_bilingual_mode', String(next));
      } catch (e) {}
      return next;
    });
  };

  const [focusMode, setFocusMode] = useState<boolean>(false);

  const handleToggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  useEffect(() => {
    if (!focusMode) return;
    const handleEscExit = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleEscExit);
    return () => window.removeEventListener('keydown', handleEscExit);
  }, [focusMode]);

  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [cheatWarning, setCheatWarning] = useState<string | null>(null);
  const [selectedSimModuleId, setSelectedSimModuleId] = useState<string | null>(null);
  const [selectedCreativeHomework, setSelectedCreativeHomework] =
    useState<CreativeHomeworkAssignment | null>(null);
  const [dashboardSectionRequest, setDashboardSectionRequest] = useState<{
    section: 'overview' | 'worksheet' | 'reports';
    nonce: number;
  } | null>(null);

  const handleOpenSimulationModule = (moduleId: string) => {
    setSelectedSimModuleId(moduleId);
    handleSelectTab('modules');
  };

  const handleOpenDashboardReports = () => {
    setDashboardSectionRequest({ section: 'reports', nonce: Date.now() });
    handleSelectTab('dashboard');
  };

  const handleOpenHomeworkInWriter = (hw: CreativeHomeworkAssignment) => {
    setSelectedCreativeHomework(hw);
    setCurrentTab('story-builder');
    scrollToPageTop();
    window.requestAnimationFrame(scrollToPageTop);
  };

  const handleCompleteSimulationLesson = (
    moduleId: string,
    stats?: { score: number; maxScore: number; percentage: number }
  ) => {
    setProgress((prev) => {
      const existing = Array.isArray(prev.completedSimulationModules)
        ? prev.completedSimulationModules
        : [];
      const nextCompleted = existing.includes(moduleId)
        ? existing
        : [...existing, moduleId];

      const prevCompletions = { ...(prev.simulationCompletions || {}) };
      const nextCount = (prevCompletions[moduleId] || 0) + 1;
      prevCompletions[moduleId] = nextCount;

      const prevMetrics = { ...(prev.simulationTopicMetrics || {}) };
      const existingMetric = prevMetrics[moduleId] || {
        completions: 0,
        attempts: 0,
        totalScoreSum: 0,
        totalMaxSum: 0,
        lastAccuracyPct: 0,
        lastCompletedAt: '',
      };
      const addedScore = stats ? Math.max(0, Number(stats.score) || 0) : 0;
      const addedMax = stats ? Math.max(0, Number(stats.maxScore) || 0) : 0;
      const pct = stats ? Math.min(100, Math.max(0, Math.round(Number(stats.percentage) || 0))) : existingMetric.lastAccuracyPct;

      prevMetrics[moduleId] = {
        completions: nextCount,
        attempts: existingMetric.attempts + 1,
        totalScoreSum: existingMetric.totalScoreSum + addedScore,
        totalMaxSum: existingMetric.totalMaxSum + addedMax,
        lastAccuracyPct: pct,
        lastCompletedAt: new Date().toISOString(),
      };

      const streak = computeNextStreak(prev);
      return {
        ...prev,
        completedSimulationModules: nextCompleted,
        simulationCompletions: prevCompletions,
        simulationTopicMetrics: prevMetrics,
        lastActiveDate: streak.lastActiveDate,
        timeTravel: {
          ...prev.timeTravel,
          present: {
            ...prev.timeTravel.present,
            activeStreakDays: streak.activeStreakDays,
          },
        },
      };
    });
  };

  // Theme Management (4 Plain Colors + 1 Multicolor)
  const [theme, setTheme] = useState<AppTheme>(() => loadSavedTheme());

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    saveAppTheme(newTheme);
  };

  useEffect(() => {
    saveAppTheme(theme);
  }, [theme]);

  // User Authentication State: Tab-isolated (sessionStorage) with localStorage fallback
  const normalizeRestoredUser = (u: any) => {
    if (!u || typeof u !== 'object') return u;
    const cleanedName = typeof u.userName === 'string'
      ? u.userName.trim()
      : u.userName;
    const isGeneric =
      !cleanedName ||
      cleanedName === 'विद्यार्थी (Student)' ||
      cleanedName === 'विद्यार्थी';
    const isT =
      u.isTeacher === true ||
      u.role === 'teacher' ||
      (typeof u.email === 'string' && checkIsTeacherEmail(u.email));

    if (isGeneric && typeof u.email === 'string' && u.email.includes('@')) {
      const tokens = u.email
        .split('@')[0]
        .split(/[._-]+/)
        .map((t: string) => t.replace(/\d+$/g, '').trim())
        .filter((t: string) => t.length > 0);
      if (tokens.length > 0) {
        const base = tokens.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');
        return {
          ...u,
          userName: isT ? formatTeacherNameWithHonorific(base, 'madam') : base,
        };
      }
    }
    if (isT && typeof cleanedName === 'string' && cleanedName && !detectHonorificFromName(cleanedName)) {
      try {
        const savedH = localStorage.getItem(`shabdshilp_teacher_honorific_${String(u.email || '').toLowerCase()}`);
        if (savedH === 'sir' || savedH === 'madam') {
          return { ...u, userName: formatTeacherNameWithHonorific(cleanedName, savedH) };
        }
      } catch (e) {}
    }
    if (cleanedName !== u.userName) {
      return { ...u, userName: cleanedName };
    }
    return u;
  };

  // Require explicit login on every app visit (never auto-restore previous user session)
  const [currentUser, setCurrentUser] = useState<AuthUserSession | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [firestoreNotice, setFirestoreNotice] = useState<string | null>(null);

  useEffect(() => {
    scrollToPageTop();
    const rafId = window.requestAnimationFrame(scrollToPageTop);
    return () => window.cancelAnimationFrame(rafId);
  }, [currentTab, isAuthReady, currentUser?.email]);

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('कक्षा 8');

  const selectedBoard: BoardType = 'ICSE';

  // Owner-bound progress state so WordCoins, reports & results never bleed across IDs or get reset to 0
  const [progressState, setProgressState] = useState<{
    ownerEmail: string | null;
    data: UserProgressState;
  }>(() => ({
    ownerEmail: null,
    data: createFreshProgress(),
  }));

  const progress = progressState.data;
  const setProgress = (
    updater: UserProgressState | ((prev: UserProgressState) => UserProgressState)
  ) => {
    setProgressState((prevState) => {
      const nextData = typeof updater === 'function' ? updater(prevState.data) : updater;
      if (prevState.ownerEmail) {
        saveLocalProgressForEmail(prevState.ownerEmail, nextData, false);
      }
      return { ...prevState, data: nextData };
    });
  };

  const [cloudLoadedEmail, setCloudLoadedEmail] = useState<string | null>(null);
  const lastRemoteSavedJsonRef = useRef<string | null>(null);
  const latestPendingSaveRef = useRef<{ email: string; data: UserProgressState; json: string } | null>(null);
  const VALID_GRADES: GradeLevel[] = ['कक्षा 5', 'कक्षा 6', 'कक्षा 7', 'कक्षा 8', 'कक्षा 9', 'कक्षा 10'];

  // Hydrate authenticated Google user cleanly from Firebase Auth + Firestore /users/{uid}
  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (!mounted) return;
      if (!fbUser || !fbUser.email) {
        setIsAuthReady(true);
        return;
      }

      const cleanEmail = fbUser.email.trim().toLowerCase();
      if (!isAllowedShabdshilpEmail(cleanEmail)) {
        await logoutFirebase();
        clearServerSessionToken();
        try {
          sessionStorage.removeItem('shabdshilp_tab_user');
          localStorage.removeItem('shabdshilp_auth_user');
        } catch (e) {}
        if (!mounted) return;
        lastRemoteSavedJsonRef.current = null;
        latestPendingSaveRef.current = null;
        setCurrentUser(null);
        setCloudLoadedEmail(null);
        setProgressState({ ownerEmail: null, data: createFreshProgress() });
        setFirestoreNotice(
          `केवल @shabdshilp.com ईमेल आईडी से ही लॉगिन मान्य है (${cleanEmail} अमान्य है)।`
        );
        setIsAuthReady(true);
        return;
      }

      const isT = checkIsTeacherEmail(cleanEmail);
      let cloudProfile: any = null;
      try {
        cloudProfile = await getUserDataFirestore(fbUser.uid);
      } catch (err) {
        if (isQuotaExceededError(err)) {
          setFirestoreNotice(
            'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
          );
        }
      }
      if (!mounted) return;

      const cleanGoogleName = (fbUser.displayName || '').trim();
      let resolvedName =
        cloudProfile?.userName ||
        cleanGoogleName ||
        extractNameFromEmail(cleanEmail, isT) ||
        cleanEmail.split('@')[0];

      if (isT && !detectHonorificFromName(resolvedName)) {
        let preferredHonorific: TeacherHonorific = 'madam';
        try {
          const savedH = localStorage.getItem(`shabdshilp_teacher_honorific_${cleanEmail}`);
          if (savedH === 'sir' || savedH === 'madam') {
            preferredHonorific = savedH;
          }
        } catch (e) {}
        resolvedName = formatTeacherNameWithHonorific(resolvedName, preferredHonorific);
      }

      const resolvedGrade: GradeLevel = VALID_GRADES.includes(cloudProfile?.grade as GradeLevel)
        ? (cloudProfile.grade as GradeLevel)
        : 'कक्षा 8';
      const resolvedSection: string = cloudProfile?.section || 'सेक्शन A';

      // Ensure parent /users/{uid} exists in Firestore (required for Master Gate rules)
      if (!cloudProfile) {
        saveUserDataFirestore(fbUser.uid, {
          email: cleanEmail,
          userName: resolvedName,
          grade: resolvedGrade,
          section: resolvedSection,
        }).catch((err) => {
          if (isQuotaExceededError(err)) {
            setFirestoreNotice(
              'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
            );
          }
        });
      }

      const hydratedUser = normalizeRestoredUser({
        uid: fbUser.uid,
        email: cleanEmail,
        userName: resolvedName,
        grade: resolvedGrade,
        section: resolvedSection,
        role: isT ? 'teacher' : 'student',
        isTeacher: isT,
      });

      setCurrentUser(hydratedUser);
      setSelectedGrade(hydratedUser.grade);

      const bestLocal = loadBestLocalProgressForEmail(cleanEmail);
      setProgressState((prevState) => {
        if (prevState.ownerEmail === cleanEmail) {
          return prevState;
        }
        return {
          ownerEmail: cleanEmail,
          data: sanitizeProgressState(bestLocal?.progress, hydratedUser.userName, hydratedUser.grade),
        };
      });

      setIsAuthReady(true);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const activeUser = currentUser;
    const email = activeUser?.email?.trim().toLowerCase();
    if (!isAuthReady || !activeUser || !email) {
      setCloudLoadedEmail(null);
      return;
    }
    let mounted = true;
    loadUserProgressDetailed(email)
      .then(({ progress: cloudProg, needsRemoteSync }) => {
        if (!mounted) return;
        const hasRemoteTransport = Boolean(activeUser.uid || getServerSessionToken(email));
        if (cloudProg) {
          const clean = sanitizeProgressState(cloudProg, activeUser.userName, activeUser.grade);
          const cleanJson = JSON.stringify(clean);
          lastRemoteSavedJsonRef.current = needsRemoteSync ? null : cleanJson;
          latestPendingSaveRef.current = needsRemoteSync
            ? { email, data: clean, json: cleanJson }
            : null;
          setProgressState({ ownerEmail: email, data: clean });
          if (VALID_GRADES.includes(clean.selectedGrade)) {
            setSelectedGrade(clean.selectedGrade);
            setCurrentUser((prev) =>
              prev && prev.email?.toLowerCase() === email && prev.grade !== clean.selectedGrade
                ? { ...prev, grade: clean.selectedGrade }
                : prev
            );
          }
          saveLocalProgressForEmail(email, clean, !needsRemoteSync && hasRemoteTransport);
        } else {
          const best = loadBestLocalProgressForEmail(email);
          const clean = sanitizeProgressState(best?.progress, activeUser.userName, activeUser.grade);
          lastRemoteSavedJsonRef.current = hasMeaningfulProgress(clean) ? null : JSON.stringify(clean);
          setProgressState((prevState) => {
            if (prevState.ownerEmail === email && hasMeaningfulProgress(prevState.data)) {
              return prevState;
            }
            return {
              ownerEmail: email,
              data: clean,
            };
          });
        }
        setCloudLoadedEmail(email);
      })
      .catch((err) => {
        if (!mounted) return;
        if (isQuotaExceededError(err)) {
          setFirestoreNotice(
            'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
          );
        } else {
          setFirestoreNotice(
            'डेटाबेस से आपकी पिछली प्रगति लोड करने में समस्या आई। सुरक्षा के लिए स्थानीय बैकअप सुरक्षित रखा गया है।'
          );
        }
        // Keep cloudLoadedEmail unset so fresh default state cannot overwrite saved remote records
      });
    return () => {
      mounted = false;
    };
  }, [isAuthReady, currentUser?.email, currentUser?.uid]);

  // Save progress to localStorage and Firestore/Server only when owner & initial load match
  useEffect(() => {
    const normEmail = currentUser?.email?.trim().toLowerCase();
    if (!normEmail) return;
    if (progressState.ownerEmail !== normEmail) return;
    if (cloudLoadedEmail !== normEmail) return;

    const serialized = JSON.stringify(progressState.data);
    if (serialized === lastRemoteSavedJsonRef.current) {
      if (latestPendingSaveRef.current?.email === normEmail && latestPendingSaveRef.current?.json === serialized) {
        latestPendingSaveRef.current = null;
      }
      return;
    }

    latestPendingSaveRef.current = { email: normEmail, data: progressState.data, json: serialized };

    let cancelled = false;
    saveUserProgressToFirestore(normEmail, progressState.data)
      .then(() => {
        if (cancelled) return;
        lastRemoteSavedJsonRef.current = serialized;
        if (latestPendingSaveRef.current?.email === normEmail && latestPendingSaveRef.current?.json === serialized) {
          latestPendingSaveRef.current = null;
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (isQuotaExceededError(err)) {
          setFirestoreNotice(
            'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
          );
        } else {
          console.error('Progress remote sync failed:', err);
          setFirestoreNotice(
            'क्लाउड पर प्रगति सहेजने में अस्थायी समस्या आई — लोकल बैकअप इस डिवाइस पर सुरक्षित है।'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [progressState, currentUser, cloudLoadedEmail]);

  // Flush unsaved progress on tab close / hide using keepalive
  useEffect(() => {
    const flushPending = () => {
      const pending = latestPendingSaveRef.current;
      if (!pending) return;
      saveUserProgressToFirestore(pending.email, pending.data, { keepalive: true }).catch(() => {});
    };
    window.addEventListener('pagehide', flushPending);
    window.addEventListener('beforeunload', flushPending);
    return () => {
      window.removeEventListener('pagehide', flushPending);
      window.removeEventListener('beforeunload', flushPending);
    };
  }, []);

  // Anti-Google Lens & Anti-Cheat Right-Click, Copy, Cut & Paste Protection
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const showBlockedToast = (message: string, duration = 3000) => {
      setCheatWarning(message);
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => setCheatWarning(null), duration);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showBlockedToast(
        '🛡️ परीक्षा सुरक्षा: गूगल लेंस (Google Lens) एवं राइट-क्लिक प्रतिबंधित है। (Google Lens & Right-Click blocked to prevent cheating)'
      );
      return false;
    };

    const handleClipboardBlock = (e: ClipboardEvent) => {
      e.preventDefault();
      try {
        e.clipboardData?.setData('text/plain', '');
      } catch (_err) {}
      showBlockedToast(
        '🛡️ परीक्षा सुरक्षा: नकल रोकने के लिए कॉपी और पेस्ट प्रतिबंधित है। (Copy & Paste blocked to prevent cheating)'
      );
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      if (mod && (key === 'c' || key === 'v' || key === 'x')) {
        e.preventDefault();
        showBlockedToast(
          '🛡️ परीक्षा सुरक्षा: नकल रोकने के लिए कॉपी और पेस्ट प्रतिबंधित है। (Copy & Paste blocked to prevent cheating)'
        );
        return false;
      }

      if (
        (mod && (key === 'u' || key === 's')) ||
        (mod && e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        showBlockedToast('🛡️ परीक्षा सुरक्षा: कॉपी एवं कोड निरीक्षण अवरुद्ध है।', 2500);
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleClipboardBlock, true);
    window.addEventListener('cut', handleClipboardBlock, true);
    window.addEventListener('paste', handleClipboardBlock, true);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleClipboardBlock, true);
      window.removeEventListener('cut', handleClipboardBlock, true);
      window.removeEventListener('paste', handleClipboardBlock, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const handleSelectGrade = (newGrade: GradeLevel) => {
    setSelectedGrade(newGrade);
    setProgress((prev) => ({ ...prev, selectedGrade: newGrade }));
    if (currentUser) {
      const updatedUser = { ...currentUser, grade: newGrade };
      setCurrentUser(updatedUser);
      if (currentUser.uid) {
        saveUserDataFirestore(currentUser.uid, {
          email: currentUser.email,
          userName: currentUser.userName,
          grade: newGrade,
          section: currentUser.section,
        }).catch((err) => {
          if (isQuotaExceededError(err)) {
            setFirestoreNotice(
              'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
            );
          }
        });
      } else {
        saveUserProfileServer(currentUser.email, {
          userName: currentUser.userName,
          grade: newGrade,
          section: currentUser.section,
        });
      }
    }
  };

  const handleUpdateTeacherHonorific = (honorific: TeacherHonorific) => {
    if (!currentUser) return;
    const updatedName = formatTeacherNameWithHonorific(currentUser.userName, honorific);
    const updatedUser: AuthUserSession = { ...currentUser, userName: updatedName };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(`shabdshilp_teacher_honorific_${currentUser.email.toLowerCase()}`, honorific);
    } catch (e) {}
    if (currentUser.uid) {
      saveUserDataFirestore(currentUser.uid, {
        email: currentUser.email,
        userName: updatedName,
        grade: currentUser.grade,
        section: currentUser.section,
      }).catch((err) => {
        if (isQuotaExceededError(err)) {
          setFirestoreNotice(
            'दैनिक Firestore उपयोग सीमा पूर्ण हो गई है। यह कल पुनः रीसेट होगी।'
          );
        }
      });
    } else {
      saveUserProfileServer(currentUser.email, {
        userName: updatedName,
        grade: currentUser.grade,
        section: currentUser.section,
      });
    }
  };

  const handleLoginSuccess = (user: AuthUserSession) => {
    const normEmail = (user.email || '').trim().toLowerCase();
    const normalizedUser: AuthUserSession = { ...user, email: normEmail };

    lastRemoteSavedJsonRef.current = null;
    latestPendingSaveRef.current = null;
    setFirestoreNotice(null);
    setCurrentUser(normalizedUser);
    setSelectedGrade(normalizedUser.grade);

    // Load saved progress for this email ID without clobbering already-loaded state
    const best = loadBestLocalProgressForEmail(normEmail);
    setProgressState((prevState) => {
      if (prevState.ownerEmail === normEmail && cloudLoadedEmail === normEmail) {
        return prevState;
      }
      if (best?.progress) {
        return {
          ownerEmail: normEmail,
          data: sanitizeProgressState(best.progress, normalizedUser.userName, normalizedUser.grade),
        };
      }
      return {
        ownerEmail: normEmail,
        data: createFreshProgress(normalizedUser.userName, normalizedUser.grade),
      };
    });

    scrollToPageTop();
    window.requestAnimationFrame(scrollToPageTop);
  };

  const handleLogout = async () => {
    const normEmail = currentUser?.email?.trim().toLowerCase();
    if (normEmail && progressState.ownerEmail === normEmail && cloudLoadedEmail === normEmail) {
      const pending = latestPendingSaveRef.current;
      if (pending && pending.email === normEmail) {
        await saveUserProgressToFirestore(pending.email, pending.data, { keepalive: true }).catch(() => {});
      }
    }

    // Only clear THIS tab's active session (keep all saved per-ID data intact)
    sessionStorage.removeItem('shabdshilp_tab_user');
    sessionStorage.removeItem('shabdshilp_session_tab');

    // Clear default auto-login pointer if it belongs to this user
    try {
      const def = localStorage.getItem('shabdshilp_auth_user');
      if (def && currentUser && JSON.parse(def).email?.toLowerCase() === currentUser.email.toLowerCase()) {
        localStorage.removeItem('shabdshilp_auth_user');
      }
    } catch (e) {}

    lastRemoteSavedJsonRef.current = null;
    latestPendingSaveRef.current = null;
    clearServerSessionToken();
    await logoutFirebase();
    setCloudLoadedEmail(null);
    setProgressState({ ownerEmail: null, data: createFreshProgress() });
    setCurrentUser(null);
  };

  const handleAddWordCoins = (coins: number) => {
    setProgress((prev) => {
      const streak = computeNextStreak(prev);
      return {
        ...prev,
        wordCoins: prev.wordCoins + coins,
        correctAnswersTotal: prev.correctAnswersTotal + coins * 2,
        lastActiveDate: streak.lastActiveDate,
        timeTravel: {
          ...prev.timeTravel,
          present: {
            ...prev.timeTravel.present,
            activeStreakDays: streak.activeStreakDays,
          },
        },
      };
    });
  };

  const handleCompleteCheckpointQuiz = (result: CheckpointQuizResult) => {
    setProgress((prev) => {
      const streak = computeNextStreak(prev);
      const newCorrect = prev.correctAnswersTotal + result.score;
      const newTotal = prev.totalQuestionsAnswered + (result.answeredCount ?? result.totalQuestions);
      const accuracyRate = newTotal > 0 ? Math.min(100, Math.round((newCorrect / newTotal) * 100)) : result.percentage;
      const todayLabel = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const todayIso = new Date().toISOString().slice(0, 10);

      const newBadges = [...prev.badgesEarned];
      const addBadge = (badge: UserProgressState['badgesEarned'][number]) => {
        if (!newBadges.some((b) => b.id === badge.id)) {
          newBadges.push(badge);
        }
      };

      if (result.quizType === 'pre') {
        const postScore = prev.postCheckpointCompleted && typeof prev.postCheckpointScore === 'number'
          ? prev.postCheckpointScore
          : null;
        const improvement = postScore !== null ? postScore - result.percentage : 0;

        addBadge({
          id: 'badge_pre_quiz',
          nameHindi: 'प्रथम चरण साधक',
          nameEnglish: 'Baseline Explorer',
          descriptionHindi: `प्री-चेकपॉइंट क्विज़ ${result.percentage}% के साथ पूर्ण किया`,
          descriptionEnglish: `Completed Pre-Checkpoint Quiz with ${result.percentage}%`,
          icon: '🧭',
          unlockedAt: todayIso,
        });

        const weakTextHindi = result.weakTopics.length > 0
          ? `प्री-चेकपॉइंट क्विज़ में आपने ${result.totalQuestions} में से ${result.score} अंक (${result.percentage}%) प्राप्त किए। मुख्य सुधार क्षेत्र: ${result.weakTopics.join(', ')}।`
          : `शानदार! प्री-चेकपॉइंट क्विज़ में आपने सभी ${result.score}/${result.totalQuestions} प्रश्न (${result.percentage}%) सही हल किए।`;
        const weakTextEnglish = result.weakTopics.length > 0
          ? `In the Pre-Checkpoint Quiz, you scored ${result.score}/${result.totalQuestions} (${result.percentage}%). Focus topics: ${result.weakTopics.join(', ')}.`
          : `Great start! You scored ${result.score}/${result.totalQuestions} (${result.percentage}%) in the Pre-Checkpoint Quiz.`;

        return {
          ...prev,
          hasOnboarded: true,
          onboardingMode: 'preCheck',
          wordCoins: prev.wordCoins + result.earnedCoins,
          correctAnswersTotal: newCorrect,
          totalQuestionsAnswered: newTotal,
          weakTopicsDeclared: result.weakTopics,
          diagnosticScore: result.percentage,
          preCheckpointCompleted: true,
          preCheckpointScore: result.percentage,
          lastActiveDate: streak.lastActiveDate,
          badgesEarned: newBadges,
          timeTravel: {
            ...prev.timeTravel,
            past: {
              date: todayLabel,
              baselineScore: result.percentage,
              weakTopics: result.weakTopics,
              notesHindi: weakTextHindi,
              notesEnglish: weakTextEnglish,
              errorsAnalysis: result.errorDetails.length > 0
                ? result.errorDetails
                : ['कोई त्रुटि नहीं — सभी आधारभूत प्रश्न सही हल किए गए!'],
            },
            present: {
              ...prev.timeTravel.present,
              currentMastery: postScore !== null ? postScore : result.percentage,
              topicsMastered: prev.postCheckpointCompleted ? prev.timeTravel.present.topicsMastered : result.masteredTopics,
              improvementPercentage: improvement,
              activeStreakDays: streak.activeStreakDays,
              accuracyRate,
            },
          },
        };
      }

      // POST-CHECKPOINT QUIZ
      const hasPre = Boolean(prev.preCheckpointCompleted && typeof prev.preCheckpointScore === 'number');
      const baseline = hasPre ? (prev.preCheckpointScore as number) : result.percentage;
      const improvement = hasPre ? result.percentage - baseline : 0;
      const projected = Math.min(100, Math.max(result.percentage, Math.round(result.percentage + (100 - result.percentage) * 0.4)));

      if (result.percentage >= 80) {
        addBadge({
          id: 'badge_post_master',
          nameHindi: 'व्याकरण दक्ष',
          nameEnglish: 'Grammar Achiever',
          descriptionHindi: `पोस्ट-चेकपॉइंट क्विज़ में ${result.percentage}% सटीकता अर्जित की`,
          descriptionEnglish: `Achieved ${result.percentage}% accuracy in Post-Checkpoint Quiz`,
          icon: '👑',
          unlockedAt: todayIso,
        });
      }
      if (improvement > 0) {
        addBadge({
          id: 'badge_growth',
          nameHindi: 'काल चक्र विजेता',
          nameEnglish: 'Time Traveler',
          descriptionHindi: `प्री-क्विज़ से पोस्ट-क्विज़ में +${improvement}% सुधार दर्ज किया`,
          descriptionEnglish: `Recorded +${improvement}% growth from Pre to Post Quiz`,
          icon: '⏳',
          unlockedAt: todayIso,
        });
      }

      const focusTopics = result.weakTopics.length > 0
        ? result.weakTopics
        : getCurriculumForGrade(prev.selectedGrade).defaultFocusTopics;

      const roadmap = [
        {
          milestone: 'अगले 7 दिन (Next 7 Days)',
          goalHindi: result.weakTopics.length > 0
            ? `${focusTopics.slice(0, 2).join(' व ')} के नियमों का सिमुलेशन अभ्यास`
            : 'सभी व्याकरण अध्यायों की 100% पुनरावृत्ति',
          goalEnglish: result.weakTopics.length > 0
            ? `Targeted simulation practice on ${focusTopics.slice(0, 2).join(' and ')}`
            : 'Complete revision across all grammar modules',
          weeklyRoutine: 'प्रतिदिन 15 मिनट ShabdShilp सिमुलेशन',
        },
        {
          milestone: 'अभ्यास चरण (Practice Phase)',
          goalHindi: 'कस्टम वर्कशीट जनरेटर से 10 प्रश्नों का समयबद्ध टेस्ट हल करना',
          goalEnglish: 'Solve timed 10-question tests in Custom Worksheet Studio',
          weeklyRoutine: 'सप्ताह में 2 कस्टम वर्कशीट्स हल करें',
        },
        {
          milestone: 'ICSE परीक्षा लक्ष्य (Board Exam Target)',
          goalHindi: `वर्तमान ${result.percentage}% से ${projected}%+ स्कोर की ओर अग्रसर`,
          goalEnglish: `Advance from ${result.percentage}% to ${projected}%+ exam readiness`,
          weeklyRoutine: 'प्री व पोस्ट क्विज़ के साथ प्रगति जांचें',
        },
      ];

      return {
        ...prev,
        hasOnboarded: true,
        wordCoins: prev.wordCoins + result.earnedCoins,
        correctAnswersTotal: newCorrect,
        totalQuestionsAnswered: newTotal,
        postCheckpointCompleted: true,
        postCheckpointScore: result.percentage,
        lastActiveDate: streak.lastActiveDate,
        badgesEarned: newBadges,
        timeTravel: {
          ...prev.timeTravel,
          present: {
            currentMastery: result.percentage,
            topicsMastered: result.masteredTopics,
            improvementPercentage: improvement,
            activeStreakDays: streak.activeStreakDays,
            accuracyRate,
          },
          future: {
            projectedExamScore: projected,
            boardTargetStatus: result.percentage >= 85
              ? 'A+ (उत्कृष्ट — संभावित 100/100 लक्ष्य)'
              : result.percentage >= 65
              ? 'A (संतोषजनक प्रगति — अभ्यास जारी रखें)'
              : 'सुधार प्रगति पर (सिमुलेशन से मजबूत करें)',
            strategicRoadmap: roadmap,
          },
        },
      };
    });
  };

  const handleDeductWordCoins = (coins: number): boolean => {
    if (progress.wordCoins < coins) return false;
    setProgress((prev) => ({
      ...prev,
      wordCoins: Math.max(0, prev.wordCoins - coins),
    }));
    return true;
  };

  const handleUnlockWorksheet = (id: string) => {
    if (!progress.unlockedWorksheetIds.includes(id)) {
      setProgress((prev) => ({
        ...prev,
        unlockedWorksheetIds: [...prev.unlockedWorksheetIds, id],
      }));
    }
  };

  const handleCourseGenerated = (courseData: any, weakTopics: string[]) => {
    setActiveCourse(courseData);
    setProgress((prev) => ({
      ...prev,
      hasOnboarded: true,
      weakTopicsDeclared: weakTopics,
    }));
  };

  const handleRecordGadyanshHistory = (entry: any) => {
    setProgress((prev) => {
      const streak = computeNextStreak(prev);
      return {
        ...prev,
        lastActiveDate: streak.lastActiveDate,
        gadyanshHistory: [...prev.gadyanshHistory, entry],
        timeTravel: {
          ...prev.timeTravel,
          present: {
            ...prev.timeTravel.present,
            activeStreakDays: streak.activeStreakDays,
          },
        },
      };
    });
  };

  const handleRecordReport = (report: SavedReportSummary) => {
    setProgress((prev) => {
      const existing = Array.isArray(prev.savedReports) ? prev.savedReports : [];
      const filtered = existing.filter((r) => r.id !== report.id);
      return {
        ...prev,
        savedReports: [report, ...filtered].slice(0, 30),
      };
    });
  };

  const handleRecordWorksheetResult = (worksheetId: string, result: SavedWorksheetResult) => {
    setProgress((prev) => {
      const existing = prev.completedWorksheetResults || {};
      return {
        ...prev,
        completedWorksheetResults: {
          ...existing,
          [worksheetId]: result,
        },
      };
    });
  };

  const handleRecordWorkbookAttempt = (attempt: WorkbookAttemptRecord) => {
    setProgress((prev) => {
      const existing = Array.isArray(prev.workbookAttempts) ? prev.workbookAttempts : [];
      const filtered = existing.filter((a) => a.id !== attempt.id);
      return {
        ...prev,
        workbookAttempts: [attempt, ...filtered].slice(0, 40),
      };
    });
  };

  const handleCreativeSubmissionSaved = (submission: CreativeSubmissionRecord) => {
    setProgress((prev) => {
      const existing = Array.isArray(prev.kathaShilpiPortfolio) ? prev.kathaShilpiPortfolio : [];
      const filtered = existing.filter((s) => s.id !== submission.id);
      return {
        ...prev,
        storiesCreatedCount: (prev.storiesCreatedCount || 0) + 1,
        kathaShilpiPortfolio: [submission, ...filtered].slice(0, 30),
      };
    });
  };

  const handleRecordWrongAnswer = (
    topicOrId: string,
    topicNameHindi?: string,
    topicNameEnglish?: string,
    questionText?: string
  ) => {
    const rawKey = resolveTopicKeyFromString(topicOrId || topicNameHindi || 'mixed_board');
    const canonicalKey = rawKey === 'mixed_board' && topicNameHindi
      ? resolveTopicKeyFromString(topicNameHindi)
      : rawKey;
    const labels = getCanonicalTopicLabels(canonicalKey, topicNameHindi, topicNameEnglish);
    const nowIso = new Date().toISOString();

    setProgress((prev) => {
      const existingMap: Record<string, MistakeTopicStat> = { ...(prev.mistakeHistory || {}) };
      const existing = existingMap[canonicalKey];
      const existingSamples = sanitizeMistakeSampleQuestions(existing?.sampleQuestions);
      const rawSnippet = (questionText || '').trim().slice(0, 120);
      const cleanSnippet = rawSnippet && !isInternalSimKeySnippet(rawSnippet) ? rawSnippet : '';
      const nextSamples = cleanSnippet && !existingSamples.includes(cleanSnippet)
        ? [cleanSnippet, ...existingSamples].slice(0, 4)
        : existingSamples;

      existingMap[canonicalKey] = {
        topicKey: canonicalKey,
        topicNameHindi: labels.hi,
        topicNameEnglish: labels.en,
        wrongCount: (existing?.wrongCount || 0) + 1,
        lastWrongAt: nowIso,
        sampleQuestions: nextSamples,
      };

      return {
        ...prev,
        mistakeHistory: existingMap,
      };
    });
  };

  const handleResolveWeakTopic = (topicKey: string) => {
    if (!topicKey) return;
    setProgress((prev) => {
      const existingMap: Record<string, MistakeTopicStat> = { ...(prev.mistakeHistory || {}) };
      delete existingMap[topicKey];
      return {
        ...prev,
        mistakeHistory: existingMap,
      };
    });
  };

  const isTeacher = (email: string | undefined, role?: string) => {
    if (role === 'teacher') return true;
    if (!email) return false;
    const lower = email.trim().toLowerCase();
    return (
      lower.includes('.1') ||
      lower.includes('_1') ||
      lower.startsWith('kiran') ||
      lower.includes('teacher') ||
      lower.includes('shikshak')
    );
  };

  const isTeacherUser = currentUser
    ? (currentUser.isTeacher === true || currentUser.role === 'teacher' || isTeacher(currentUser.email, currentUser.role))
    : false;

  const activeThemeConfig = getThemeConfig(theme);

  return (
    <div
      className="min-h-screen text-slate-900 flex flex-col font-sans transition-colors duration-500"
      style={{ background: activeThemeConfig.bodyBg }}
    >
      {/* Sticky Header with Grade Selector, Navigation & Live WordCoins */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        wordCoins={progress.wordCoins}
        correctAnswersTotal={progress.correctAnswersTotal}
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        selectedBoard={selectedBoard}
        bilingualMode={bilingualMode}
        onToggleBilingual={handleToggleBilingual}
        isTeacherUser={isTeacherUser}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        focusMode={focusMode}
        onToggleFocusMode={handleToggleFocusMode}
      />

      {/* Main App Content View based on Tab or Teacher Role */}
      <main
        className={
          focusMode
            ? 'flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-4 sm:py-6'
            : 'flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8'
        }
      >
        {isTeacherUser ? (
          <TeacherDashboard
            teacherEmail={currentUser?.email || 'teacher@shabdshilp.com'}
            teacherName={currentUser?.userName || 'शिक्षक'}
            bilingualMode={bilingualMode}
            theme={theme}
            onUpdateTeacherHonorific={handleUpdateTeacherHonorific}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                progress={progress}
                grade={selectedGrade}
                selectedBoard={selectedBoard}
                bilingualMode={bilingualMode}
                onSelectTab={handleSelectTab}
                onSelectSimulationModule={handleOpenSimulationModule}
                onOpenHomeworkInWriter={handleOpenHomeworkInWriter}
                activeCourse={activeCourse}
                onAddWordCoins={handleAddWordCoins}
                onCompleteCheckpointQuiz={handleCompleteCheckpointQuiz}
                onCourseGenerated={handleCourseGenerated}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onResolveWeakTopic={handleResolveWeakTopic}
                onRecordReport={handleRecordReport}
                requestedSection={dashboardSectionRequest}
                currentUser={currentUser}
                theme={theme}
              />
            )}

            {currentTab === 'syllabus' && (
              <SyllabusView
                selectedBoard={selectedBoard}
                selectedGrade={selectedGrade}
                onSelectGrade={handleSelectGrade}
                bilingualMode={bilingualMode}
                onNavigateToTab={handleSelectTab}
                onSelectSimulationModule={handleOpenSimulationModule}
              />
            )}

            {currentTab === 'custom_worksheet' && (
              <CustomWorksheetStudio
                currentGrade={selectedGrade}
                currentBoard={selectedBoard}
                bilingualMode={bilingualMode}
                onAddWordCoins={handleAddWordCoins}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordReport={handleRecordReport}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'modules' && (
              <GrammarModulesView
                grade={selectedGrade}
                selectedBoard={selectedBoard}
                bilingualMode={bilingualMode}
                onAddWordCoins={handleAddWordCoins}
                onNavigateToUpsarg={() => handleSelectTab('upsarg-pratyay')}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordReport={handleRecordReport}
                completedSimulationModules={progress.completedSimulationModules || []}
                simulationCompletions={progress.simulationCompletions || {}}
                simulationTopicMetrics={progress.simulationTopicMetrics || {}}
                onCompleteSimulationLesson={handleCompleteSimulationLesson}
                onOpenDashboardReports={handleOpenDashboardReports}
                studentName={currentUser?.userName || progress.userName}
                initialModuleId={selectedSimModuleId}
                focusMode={focusMode}
              />
            )}

            {currentTab === 'upsarg-pratyay' && (
              <UpsargPratyayStudio
                grade={selectedGrade}
                wordCoins={progress.wordCoins}
                onAddWordCoins={handleAddWordCoins}
                bilingualMode={bilingualMode}
                onOpenWorksheets={() => handleSelectTab('worksheets')}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordReport={handleRecordReport}
              />
            )}

            {currentTab === 'gadyansh' && (
              <ApathitGadyanshSection
                grade={selectedGrade}
                onAddWordCoins={handleAddWordCoins}
                bilingualMode={bilingualMode}
                onRecordHistory={handleRecordGadyanshHistory}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordReport={handleRecordReport}
                history={progress.gadyanshHistory}
                focusMode={focusMode}
              />
            )}

            {currentTab === 'story-builder' && (
              <StoryBuilder
                grade={selectedGrade}
                onAddWordCoins={handleAddWordCoins}
                bilingualMode={bilingualMode}
                currentUser={currentUser}
                theme={theme}
                preselectedHomework={selectedCreativeHomework}
                onCreativeSubmissionSaved={handleCreativeSubmissionSaved}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordReport={handleRecordReport}
                focusMode={focusMode}
              />
            )}

            {currentTab === 'worksheets' && (
              <WorksheetsStore
                grade={selectedGrade}
                wordCoins={progress.wordCoins}
                onDeductWordCoins={handleDeductWordCoins}
                onAddWordCoins={handleAddWordCoins}
                unlockedIds={progress.unlockedWorksheetIds}
                onUnlockWorksheet={handleUnlockWorksheet}
                bilingualMode={bilingualMode}
                currentUser={currentUser}
                mistakeHistory={progress.mistakeHistory || {}}
                completedWorksheetResults={progress.completedWorksheetResults || {}}
                completedSimulationModules={progress.completedSimulationModules || []}
                simulationCompletions={progress.simulationCompletions || {}}
                workbookAttempts={progress.workbookAttempts || []}
                onOpenSimulationModule={handleOpenSimulationModule}
                onRecordWorkbookAttempt={handleRecordWorkbookAttempt}
                onRecordWrongAnswer={handleRecordWrongAnswer}
                onRecordWorksheetResult={handleRecordWorksheetResult}
                onRecordReport={handleRecordReport}
              />
            )}
          </>
        )}
      </main>

      {/* Footer - Hidden in Focus Mode for distraction-free concentration */}
      {!focusMode && (
      <footer
        className={`${activeThemeConfig.footerGradient} border-t ${activeThemeConfig.footerBorder} mt-16 py-8 text-xs ${
          activeThemeConfig.isLightBanner ? 'text-slate-900' : 'text-slate-400'
        } transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <img
              src="/assets/aistudio/mail.google_a65ce30f.png"
              alt="शब्दशिल्प (ShabdShilp) Logo"
              className="w-16 h-16 rounded-2xl object-cover object-center shadow-md border border-white/20 bg-[#091124] shrink-0"
            />
            <img
              src="/assets/aistudio/TechPreneur_Logo_a019c2b1.png"
              alt="TechPreneur Logo"
              className="w-14 h-14 rounded-2xl bg-white p-0.5 object-contain shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span
                  className={`font-extrabold font-serif-display text-base ${
                    activeThemeConfig.isLightBanner ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  शब्द शिल्प (ShabdShilp)
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md text-[10px] border ${
                    activeThemeConfig.isLightBanner
                      ? 'text-slate-950 bg-white/70 border-slate-950/15'
                      : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                  }`}
                >
                  {isTeacherUser ? selectedGrade : `${selectedBoard} • ${selectedGrade}`}
                </span>
              </div>
              <p className={`mt-1 ${activeThemeConfig.isLightBanner ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                Where Hindi grammar stops being memorised and starts being built. (Aadit Verma & Avniel Pandey, 8E).
              </p>
            </div>
          </div>

          {!isTeacherUser && (
            <div
              className={`flex flex-wrap items-center justify-center gap-4 font-semibold ${
                activeThemeConfig.isLightBanner ? 'text-slate-900' : 'text-slate-300'
              }`}
            >
              <button
                onClick={() => handleSelectTab('syllabus')}
                className={`cursor-pointer font-bold ${
                  activeThemeConfig.isLightBanner
                    ? 'text-slate-950 hover:underline'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                पाठ्यक्रम (ICSE)
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectTab('custom_worksheet')}
                className={`cursor-pointer font-bold ${
                  activeThemeConfig.isLightBanner
                    ? 'text-slate-950 hover:underline'
                    : 'text-white hover:text-amber-300'
                }`}
              >
                कस्टम वर्कशीट जनरेटर
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectTab('modules')}
                className={`cursor-pointer ${activeThemeConfig.isLightBanner ? 'hover:text-slate-950 hover:underline' : 'hover:text-white'}`}
              >
                व्याकरण सिमुलेशन
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectTab('upsarg-pratyay')}
                className={`cursor-pointer ${activeThemeConfig.isLightBanner ? 'hover:text-slate-950 hover:underline' : 'hover:text-white'}`}
              >
                उपसर्ग-प्रत्यय
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectTab('story-builder')}
                className={`cursor-pointer ${activeThemeConfig.isLightBanner ? 'hover:text-slate-950 hover:underline' : 'hover:text-white'}`}
              >
                कथा शिल्पी AI
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectTab('worksheets')}
                className={`cursor-pointer ${activeThemeConfig.isLightBanner ? 'hover:text-slate-950 hover:underline' : 'hover:text-white'}`}
              >
                वर्कशीट्स स्टोर
              </button>
            </div>
          )}
        </div>

        {/* The Very Last Line of the Website as explicitly requested */}
        <div
          className={`max-w-7xl mx-auto px-4 pt-4 mt-4 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
            activeThemeConfig.isLightBanner
              ? 'border-slate-950/15 text-slate-900'
              : 'border-slate-800 text-slate-400'
          }`}
        >
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeThemeConfig.isLightBanner ? 'bg-emerald-700' : 'bg-emerald-400'}`} />
              <span>
                सक्रिय खाता:{' '}
                <strong className={activeThemeConfig.isLightBanner ? 'text-slate-950' : 'text-white'}>
                  {currentUser.email}
                </strong>{' '}
                ({currentUser.userName})
              </span>
              <button
                onClick={handleLogout}
                className={`hover:underline flex items-center gap-1 ml-2 cursor-pointer font-bold ${
                  activeThemeConfig.isLightBanner ? 'text-rose-900' : 'text-rose-400'
                }`}
              >
                <LogOut className="w-3 h-3" />
                <span>लॉगआउट</span>
              </button>
            </div>
          )}
          <div
            className={`sm:ml-auto font-black text-sm tracking-wide ${
              activeThemeConfig.isLightBanner ? 'text-slate-950' : 'text-amber-400'
            }`}
          >
            Made by Aadit Verma and Avniel Pandey
          </div>
        </div>
      </footer>
      )}

      {/* Anti-Cheat / Anti-Google Lens Warning Toast */}
      {cheatWarning && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-rose-500 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{cheatWarning}</span>
        </div>
      )}

      {/* Firestore Notice Toast (e.g. Quota Exceeded) */}
      {firestoreNotice && (
        <div className="fixed bottom-6 left-6 z-50 bg-amber-950 text-amber-100 px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-500 flex items-center gap-3 text-xs font-bold max-w-md">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{firestoreNotice}</span>
          <button
            type="button"
            onClick={() => setFirestoreNotice(null)}
            className="ml-2 text-amber-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Initial Auth Hydration Splash */}
      {!isAuthReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm text-white text-sm font-bold">
          <div className="flex items-center gap-3 bg-indigo-900/90 px-6 py-4 rounded-2xl border border-indigo-400/30 shadow-2xl">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>सुरक्षित खाता सत्यापित हो रहा है...</span>
          </div>
        </div>
      )}

      {/* Login Gate when Auth is ready and user is signed out */}
      <AuthModal
        isOpen={isAuthReady && !currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Print Preview & PDF/HTML Export Modal */}
      <PrintPreviewModal />
    </div>
  );
}
