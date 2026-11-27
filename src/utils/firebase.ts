import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  enableNetwork,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocFromServer,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setLogLevel,
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

setLogLevel('silent');

const envProjectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim();
const envApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
const envAuthDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim();
const envAppId = (import.meta.env.VITE_FIREBASE_APP_ID || '').trim();
const envStorageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim();
const envMessagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim();
const envMeasurementId = (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '').trim();
const envDatabaseId = (import.meta.env.VITE_FIREBASE_DATABASE_ID || '').trim();

const isOverridingProject = Boolean(envProjectId && envProjectId !== appletConfig.projectId);

export const activeFirebaseConfig = {
  ...appletConfig,
  ...(envApiKey ? { apiKey: envApiKey } : {}),
  ...(envAuthDomain
    ? { authDomain: envAuthDomain }
    : isOverridingProject
    ? { authDomain: `${envProjectId}.firebaseapp.com` }
    : {}),
  ...(envProjectId ? { projectId: envProjectId } : {}),
  ...(envStorageBucket
    ? { storageBucket: envStorageBucket }
    : isOverridingProject
    ? { storageBucket: `${envProjectId}.firebasestorage.app` }
    : {}),
  ...(envMessagingSenderId ? { messagingSenderId: envMessagingSenderId } : {}),
  ...(envAppId ? { appId: envAppId } : {}),
  ...(envMeasurementId ? { measurementId: envMeasurementId } : {}),
  firestoreDatabaseId: envDatabaseId
    ? envDatabaseId
    : isOverridingProject
    ? '(default)'
    : appletConfig.firestoreDatabaseId || '(default)',
};

let app: any = null;
let authObj: any = null;
let dbObj: any = null;
let googleProviderObj: any = null;

try {
  app = initializeApp(activeFirebaseConfig);
  try {
    // Enforce in-memory auth persistence so every fresh app/link open prompts the login screen
    authObj = initializeAuth(app, {
      persistence: inMemoryPersistence,
      ...(typeof browserPopupRedirectResolver === 'function'
        ? { popupRedirectResolver: browserPopupRedirectResolver }
        : {}),
    });
  } catch (_alreadyInitErr) {
    authObj = getAuth(app);
    setPersistence(authObj, inMemoryPersistence).catch(() => {});
  }
  const firestoreDbId = activeFirebaseConfig.firestoreDatabaseId?.trim();
  const isNamedDatabase = Boolean(firestoreDbId && firestoreDbId !== '(default)');
  try {
    // Use long-polling so WebChannel HTTP/2 stream proxies/iframes never stall into false "client is offline" states
    dbObj = isNamedDatabase
      ? initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDbId)
      : initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch (_alreadyInitFirestoreErr) {
    dbObj = isNamedDatabase ? getFirestore(app, firestoreDbId) : getFirestore(app);
  }
  if (dbObj) {
    enableNetwork(dbObj).catch(() => {});
  }
  googleProviderObj = new GoogleAuthProvider();
  googleProviderObj.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn('Firebase initialization warning:', e);
}

export const auth = authObj;
export const db = dbObj;
export const googleProvider = googleProviderObj;

// Track initial Firebase Auth hydration readiness
let authInitialized = false;
let resolveAuthReady: (user: User | null) => void = () => {};
const authReadyPromise: Promise<User | null> = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

if (authObj) {
  onAuthStateChanged(authObj, (user) => {
    if (!authInitialized) {
      authInitialized = true;
      resolveAuthReady(user);
    }
  });
} else {
  authInitialized = true;
  resolveAuthReady(null);
}

export async function waitForAuthReady(): Promise<User | null> {
  if (authInitialized) {
    return authObj?.currentUser ?? null;
  }
  return authReadyPromise;
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  if (!authObj) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(authObj, callback);
}

export function getCurrentFirebaseUser(): User | null {
  return authObj?.currentUser ?? null;
}

export function isTeacherOrAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return (
    lower === 'coolneha248@gmail.com' ||
    lower.includes('.1') ||
    lower.includes('_1') ||
    lower.startsWith('kiran') ||
    lower.includes('teacher') ||
    lower.includes('shikshak')
  );
}

// Validate connection to Firestore on boot (offline check only)
async function testConnection() {
  if (!dbObj) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  const attemptProbe = async () => {
    await getDocFromServer(doc(dbObj, 'test', 'connection'));
  };

  try {
    await attemptProbe();
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      // Retry once after cold-boot stabilization in case initial network handshake raced page load
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      try {
        await enableNetwork(dbObj);
        await attemptProbe();
      } catch (retryError) {
        if (retryError instanceof Error && retryError.message.includes('the client is offline')) {
          console.error('Please check your Firebase configuration.');
        }
      }
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isQuotaExceededError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.toLowerCase().includes('quota exceeded');
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authObj?.currentUser?.uid,
      email: authObj?.currentUser?.email,
      emailVerified: authObj?.currentUser?.emailVerified,
      isAnonymous: authObj?.currentUser?.isAnonymous,
      tenantId: authObj?.currentUser?.tenantId,
      providerInfo:
        authObj?.currentUser?.providerData?.map((p: any) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function loginWithGoogle() {
  if (!authObj || !googleProviderObj) {
    throw new Error('Firebase Auth is not initialized');
  }
  try {
    const result = await signInWithPopup(
      authObj,
      googleProviderObj,
      typeof browserPopupRedirectResolver === 'function'
        ? browserPopupRedirectResolver
        : undefined
    );
    return result.user;
  } catch (error: any) {
    const code = error?.code || '';
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/popup-blocked'
    ) {
      console.warn('Google Sign-In cancelled or blocked:', code);
    } else {
      console.error('Google Sign-In Error:', error);
    }
    throw error;
  }
}

export async function logoutFirebase() {
  if (!authObj) return;
  try {
    await signOut(authObj);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

// In-memory Bearer token for @shabdshilp.com Email+Password server sessions (never persisted to Web Storage)
let activeServerSession: { email: string; token: string } | null = null;

export function setServerSessionToken(email: string, token: string) {
  const norm = (email || '').trim().toLowerCase();
  if (norm && token) {
    activeServerSession = { email: norm, token };
  }
}

export function getServerSessionToken(email?: string | null): string | null {
  if (!activeServerSession) return null;
  if (email) {
    const norm = email.trim().toLowerCase();
    return activeServerSession.email === norm ? activeServerSession.token : null;
  }
  return activeServerSession.token;
}

export function clearServerSessionToken() {
  activeServerSession = null;
}

function isPlainObject(value: unknown): value is Record<string, any> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== undefined) {
        out[k] = stripUndefined(v);
      }
    }
    return out as T;
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    return 0 as unknown as T;
  }
  // Preserve Firestore FieldValue sentinels (e.g. serverTimestamp()), Date, and primitives
  return value;
}

// Helper to sanitize strings for Firestore document IDs (matches ^[a-zA-Z0-9_-]+$ max 128 chars)
export function sanitizeDocId(str: string): string {
  const cleaned = (str || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned.slice(0, 100) || 'default';
}

export async function saveUserProfileServer(
  email: string,
  profile: { userName?: string; grade?: string; section?: string }
) {
  const normEmail = normalizeProgressEmail(email);
  const token = getServerSessionToken(normEmail);
  if (!normEmail || !token) return;
  try {
    await fetch('/api/id-store/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
  } catch (e) {
    console.warn('Server profile sync warning:', e);
  }
}

export async function saveUserDataFirestore(userId: string, data: any) {
  try {
    localStorage.setItem(`shabd_user_${userId}`, JSON.stringify(data));
  } catch (e) {}

  const activeUser = await waitForAuthReady();
  if (
    !dbObj ||
    !activeUser ||
    !activeUser.emailVerified ||
    activeUser.uid !== userId ||
    !activeUser.email
  ) {
    return;
  }

  try {
    const ref = doc(dbObj, 'users', userId);
    const payload: Record<string, any> = stripUndefined({
      uid: activeUser.uid,
      email: activeUser.email.toLowerCase().slice(0, 150),
      userName: (String(data?.userName || activeUser.displayName || 'Student').trim() || 'Student').slice(0, 100),
      grade: (String(data?.grade || 'कक्षा 8').trim() || 'कक्षा 8').slice(0, 30),
      ...(data?.section ? { section: String(data.section).trim().slice(0, 30) } : {}),
    });
    payload.updatedAt = serverTimestamp();
    await setDoc(ref, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}

export async function getUserDataFirestore(userId: string) {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && activeUser.uid === userId) {
    try {
      const ref = doc(dbObj, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    }
  }
  try {
    const local = localStorage.getItem(`shabd_user_${userId}`);
    if (local) return JSON.parse(local);
  } catch (e) {}
  return null;
}

// Sanitize progress map to stay strictly within Firestore document limits & blueprint constraints
function sanitizeProgressPayload(progress: any): Record<string, any> {
  if (!progress || typeof progress !== 'object') return {};
  const cleaned = stripUndefined({ ...progress }) as Record<string, any>;
  if (Array.isArray(cleaned.gadyanshHistory)) {
    cleaned.gadyanshHistory = cleaned.gadyanshHistory.slice(-50);
  }
  if (Array.isArray(cleaned.badgesEarned)) {
    cleaned.badgesEarned = cleaned.badgesEarned.slice(0, 30);
  }
  if (Array.isArray(cleaned.unlockedWorksheetIds)) {
    cleaned.unlockedWorksheetIds = cleaned.unlockedWorksheetIds.slice(0, 100);
  }
  if (Array.isArray(cleaned.savedReports)) {
    cleaned.savedReports = cleaned.savedReports.slice(0, 30);
  }
  if (Array.isArray(cleaned.completedSimulationModules)) {
    cleaned.completedSimulationModules = Array.from(
      new Set(cleaned.completedSimulationModules.filter((id: unknown) => typeof id === 'string'))
    ).slice(0, 50);
  }
  if (
    cleaned.completedWorksheetResults &&
    typeof cleaned.completedWorksheetResults === 'object' &&
    !Array.isArray(cleaned.completedWorksheetResults)
  ) {
    const entries = Object.entries(cleaned.completedWorksheetResults).slice(-50);
    cleaned.completedWorksheetResults = Object.fromEntries(entries);
  }
  if (Array.isArray(cleaned.workbookAttempts)) {
    cleaned.workbookAttempts = cleaned.workbookAttempts.slice(0, 40);
  }
  if (Array.isArray(cleaned.kathaShilpiPortfolio)) {
    cleaned.kathaShilpiPortfolio = cleaned.kathaShilpiPortfolio.slice(0, 30);
  }
  return cleaned;
}

const normalizeProgressEmail = (email?: string | null): string =>
  (email || '').trim().toLowerCase();

export const hasMeaningfulProgress = (p: any): boolean => {
  if (!p || typeof p !== 'object') return false;
  return Boolean(
    (typeof p.wordCoins === 'number' && p.wordCoins > 0) ||
    (typeof p.correctAnswersTotal === 'number' && p.correctAnswersTotal > 0) ||
    (typeof p.totalQuestionsAnswered === 'number' && p.totalQuestionsAnswered > 0) ||
    (typeof p.upsargPratyaySearchesCount === 'number' && p.upsargPratyaySearchesCount > 0) ||
    (typeof p.storiesCreatedCount === 'number' && p.storiesCreatedCount > 0) ||
    (Array.isArray(p.unlockedWorksheetIds) && p.unlockedWorksheetIds.length > 0) ||
    (Array.isArray(p.badgesEarned) && p.badgesEarned.length > 0) ||
    (Array.isArray(p.gadyanshHistory) && p.gadyanshHistory.length > 0) ||
    (Array.isArray(p.savedReports) && p.savedReports.length > 0) ||
    (Array.isArray(p.completedSimulationModules) && p.completedSimulationModules.length > 0) ||
    (Array.isArray(p.workbookAttempts) && p.workbookAttempts.length > 0) ||
    (Array.isArray(p.kathaShilpiPortfolio) && p.kathaShilpiPortfolio.length > 0) ||
    (p.simulationCompletions && typeof p.simulationCompletions === 'object' && Object.keys(p.simulationCompletions).length > 0) ||
    (p.completedWorksheetResults &&
      typeof p.completedWorksheetResults === 'object' &&
      !Array.isArray(p.completedWorksheetResults) &&
      Object.keys(p.completedWorksheetResults).length > 0) ||
    (p.mistakeHistory && typeof p.mistakeHistory === 'object' && Object.keys(p.mistakeHistory).length > 0) ||
    p.hasOnboarded ||
    p.preCheckpointCompleted ||
    p.postCheckpointCompleted
  );
};

export const computeProgressActivityRank = (p: any): number => {
  if (!p || typeof p !== 'object') return 0;
  const simCountSum =
    p.simulationCompletions && typeof p.simulationCompletions === 'object'
      ? Object.values(p.simulationCompletions as Record<string, unknown>).reduce<number>(
          (sum, val) => sum + (typeof val === 'number' ? val : 0),
          0
        )
      : 0;
  return (
    (typeof p.totalQuestionsAnswered === 'number' ? p.totalQuestionsAnswered : 0) +
    (typeof p.correctAnswersTotal === 'number' ? p.correctAnswersTotal : 0) +
    (typeof p.wordCoins === 'number' ? p.wordCoins : 0) * 2 +
    (typeof p.upsargPratyaySearchesCount === 'number' ? p.upsargPratyaySearchesCount * 2 : 0) +
    (typeof p.storiesCreatedCount === 'number' ? p.storiesCreatedCount * 5 : 0) +
    (Array.isArray(p.unlockedWorksheetIds) ? p.unlockedWorksheetIds.length * 10 : 0) +
    (Array.isArray(p.badgesEarned) ? p.badgesEarned.length * 5 : 0) +
    (Array.isArray(p.gadyanshHistory) ? p.gadyanshHistory.length * 5 : 0) +
    (Array.isArray(p.savedReports) ? p.savedReports.length * 8 : 0) +
    (Array.isArray(p.completedSimulationModules) ? p.completedSimulationModules.length * 12 : 0) +
    simCountSum * 6 +
    (Array.isArray(p.workbookAttempts) ? p.workbookAttempts.length * 10 : 0) +
    (Array.isArray(p.kathaShilpiPortfolio) ? p.kathaShilpiPortfolio.length * 10 : 0) +
    (p.completedWorksheetResults && typeof p.completedWorksheetResults === 'object'
      ? Object.keys(p.completedWorksheetResults).length * 8
      : 0) +
    (p.preCheckpointCompleted ? 10 : 0) +
    (p.postCheckpointCompleted ? 10 : 0)
  );
};

export function saveLocalProgressForEmail(
  email: string,
  progress: any,
  syncedToCloud: boolean = false
) {
  const normEmail = normalizeProgressEmail(email);
  if (!normEmail || !progress || typeof progress !== 'object') return;
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(`shabdshilp_user_${normEmail}`, serialized);
    localStorage.setItem(`shabd_progress_${normEmail}`, serialized);
    localStorage.setItem(
      `shabdshilp_progress_meta_${normEmail}`,
      JSON.stringify({
        updatedAtMs: Date.now(),
        syncedToCloud,
      })
    );
  } catch (e) {}
}

export function loadBestLocalProgressForEmail(email: string): {
  progress: any;
  updatedAtMs: number;
  syncedToCloud: boolean;
} | null {
  const normEmail = normalizeProgressEmail(email);
  if (!normEmail) return null;

  let primary: any = null;
  let secondary: any = null;
  let meta: { updatedAtMs?: number; syncedToCloud?: boolean } = {};

  try {
    const rawPrimary = localStorage.getItem(`shabdshilp_user_${normEmail}`);
    if (rawPrimary) primary = JSON.parse(rawPrimary);
  } catch (e) {}

  try {
    const rawSecondary = localStorage.getItem(`shabd_progress_${normEmail}`);
    if (rawSecondary) secondary = JSON.parse(rawSecondary);
  } catch (e) {}

  try {
    const rawMeta = localStorage.getItem(`shabdshilp_progress_meta_${normEmail}`);
    if (rawMeta) meta = JSON.parse(rawMeta) || {};
  } catch (e) {}

  if (!primary && !secondary) return null;

  let chosen = primary || secondary;
  if (primary && secondary) {
    // Prefer the record with higher recorded activity when metadata isn't decisive
    chosen =
      computeProgressActivityRank(secondary) > computeProgressActivityRank(primary)
        ? secondary
        : primary;
  }

  return {
    progress: chosen,
    updatedAtMs: typeof meta.updatedAtMs === 'number' ? meta.updatedAtMs : 0,
    syncedToCloud: Boolean(meta.syncedToCloud),
  };
}

// Firestore & Server ID-Store synchronization for user progress
export async function saveUserProgressToFirestore(
  email: string,
  progress: any,
  options?: { keepalive?: boolean }
) {
  const normEmail = normalizeProgressEmail(email);
  if (!normEmail) return;

  const sanitized = sanitizeProgressPayload(progress);
  saveLocalProgressForEmail(normEmail, sanitized, false);

  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    activeUser.email.toLowerCase() === normEmail
  ) {
    const docId = activeUser.uid;
    try {
      const ref = doc(dbObj, 'userProgress', docId);
      const payload = {
        uid: activeUser.uid,
        email: activeUser.email.toLowerCase().slice(0, 150),
        progress: sanitized,
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, payload);
      saveLocalProgressForEmail(normEmail, sanitized, true);
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `userProgress/${docId}`);
    }
  }

  const portalToken = getServerSessionToken(normEmail);
  if (portalToken) {
    const response = await fetch('/api/id-store/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ progress: sanitized }),
      keepalive: Boolean(options?.keepalive),
    });
    if (!response.ok) {
      throw new Error(`Server progress save failed (${response.status})`);
    }
    saveLocalProgressForEmail(normEmail, sanitized, true);
  }
}

export async function loadUserProgressDetailed(email: string): Promise<{
  progress: any | null;
  needsRemoteSync: boolean;
}> {
  const normEmail = normalizeProgressEmail(email);
  if (!normEmail) return { progress: null, needsRemoteSync: false };

  const localRecord = loadBestLocalProgressForEmail(normEmail);
  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    activeUser.email.toLowerCase() === normEmail
  ) {
    const docId = activeUser.uid;
    try {
      const ref = doc(dbObj, 'userProgress', docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const cloudProg = data?.progress;
        const cloudUpdatedAtMs =
          typeof data?.updatedAt?.toMillis === 'function' ? data.updatedAt.toMillis() : 0;

        if (!hasMeaningfulProgress(cloudProg) && localRecord && hasMeaningfulProgress(localRecord.progress)) {
          return { progress: localRecord.progress, needsRemoteSync: true };
        }

        if (
          localRecord &&
          !localRecord.syncedToCloud &&
          (localRecord.updatedAtMs > cloudUpdatedAtMs ||
            computeProgressActivityRank(localRecord.progress) > computeProgressActivityRank(cloudProg)) &&
          hasMeaningfulProgress(localRecord.progress)
        ) {
          return { progress: localRecord.progress, needsRemoteSync: true };
        }

        if (cloudProg) {
          saveLocalProgressForEmail(normEmail, cloudProg, true);
          return { progress: cloudProg, needsRemoteSync: false };
        }
      } else if (localRecord?.progress) {
        return { progress: localRecord.progress, needsRemoteSync: true };
      }
      return { progress: null, needsRemoteSync: false };
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `userProgress/${docId}`);
    }
  }

  const portalToken = getServerSessionToken(normEmail);
  if (portalToken) {
    const response = await fetch('/api/id-store/progress', {
      headers: {
        Authorization: `Bearer ${portalToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Server progress load failed (${response.status})`);
    }
    const data = await response.json();
    const serverProg = data?.progress;
    const serverUpdatedAtMs =
      typeof data?.progressUpdatedAtMs === 'number' ? data.progressUpdatedAtMs : 0;

    if (serverProg && hasMeaningfulProgress(serverProg)) {
      if (
        localRecord &&
        !localRecord.syncedToCloud &&
        (localRecord.updatedAtMs > serverUpdatedAtMs ||
          computeProgressActivityRank(localRecord.progress) > computeProgressActivityRank(serverProg)) &&
        hasMeaningfulProgress(localRecord.progress)
      ) {
        return { progress: localRecord.progress, needsRemoteSync: true };
      }
      saveLocalProgressForEmail(normEmail, serverProg, true);
      return { progress: serverProg, needsRemoteSync: false };
    }

    if (localRecord?.progress && hasMeaningfulProgress(localRecord.progress)) {
      return { progress: localRecord.progress, needsRemoteSync: true };
    }
    if (serverProg) {
      saveLocalProgressForEmail(normEmail, serverProg, true);
      return { progress: serverProg, needsRemoteSync: false };
    }
    return { progress: localRecord?.progress ?? null, needsRemoteSync: Boolean(localRecord?.progress) };
  }

  return { progress: localRecord?.progress ?? null, needsRemoteSync: false };
}

export async function loadUserProgressFromFirestore(email: string) {
  const res = await loadUserProgressDetailed(email);
  return res.progress;
}

// ==================== CUSTOM WORKSHEETS SUBCOLLECTION (/users/{uid}/customWorksheets/{id}) ====================
export async function saveCustomWorksheetToFirestore(worksheet: any) {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && activeUser.email && worksheet?.id) {
    const wsId = sanitizeDocId(worksheet.id);
    const path = `users/${activeUser.uid}/customWorksheets/${wsId}`;
    try {
      const safeQuestions = Array.isArray(worksheet.questions) ? worksheet.questions.slice(0, 50) : [];
      if (safeQuestions.length === 0) return;

      const payload: Record<string, any> = stripUndefined({
        id: wsId,
        uid: activeUser.uid,
        titleHindi: String(worksheet.titleHindi || 'अभ्यास वर्कशीट').slice(0, 200),
        titleEnglish: String(worksheet.titleEnglish || 'Practice Worksheet').slice(0, 200),
        topicId: String(worksheet.topicId || 'mixed').slice(0, 64),
        topicNameHindi: String(worksheet.topicNameHindi || 'व्याकरण').slice(0, 120),
        grade: String(worksheet.grade || 'कक्षा 8').slice(0, 30),
        board: String(worksheet.board || 'ICSE').slice(0, 20),
        difficulty: ['easy', 'medium', 'hard', 'board_level'].includes(worksheet.difficulty)
          ? worksheet.difficulty
          : 'medium',
        difficultyLabelHindi: String(worksheet.difficultyLabelHindi || 'मध्यम').slice(0, 100),
        questionCount: Math.max(1, Math.min(50, Number(worksheet.questionCount || safeQuestions.length))),
        createdAt: String(worksheet.createdAt || new Date().toLocaleDateString('hi-IN')).slice(0, 100),
        questions: safeQuestions,
        instructionsHindi: Array.isArray(worksheet.instructionsHindi)
          ? worksheet.instructionsHindi.slice(0, 10).map((s: any) => String(s))
          : [],
        instructionsEnglish: Array.isArray(worksheet.instructionsEnglish)
          ? worksheet.instructionsEnglish.slice(0, 10).map((s: any) => String(s))
          : [],
      });
      payload.updatedAt = serverTimestamp();

      await setDoc(doc(dbObj, 'users', activeUser.uid, 'customWorksheets', wsId), payload, {
        merge: true,
      });
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken && worksheet?.id) {
    await fetch('/api/id-store/custom-worksheets', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ worksheet }),
    });
  }
}

export async function loadCustomWorksheetsFromFirestore(): Promise<any[]> {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified) {
    const colPath = `users/${activeUser.uid}/customWorksheets`;
    try {
      const colRef = collection(dbObj, 'users', activeUser.uid, 'customWorksheets');
      const q = query(colRef, where('uid', '==', activeUser.uid));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, colPath);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/custom-worksheets', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data?.worksheets) ? data.worksheets : [];
      }
    } catch (e) {}
  }

  return [];
}

export async function deleteCustomWorksheetFromFirestore(worksheetId: string) {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && worksheetId) {
    const wsId = sanitizeDocId(worksheetId);
    const path = `users/${activeUser.uid}/customWorksheets/${wsId}`;
    try {
      await deleteDoc(doc(dbObj, 'users', activeUser.uid, 'customWorksheets', wsId));
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken && worksheetId) {
    await fetch(`/api/id-store/custom-worksheets/${encodeURIComponent(worksheetId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${portalToken}` },
    });
  }
}

// Teacher-Specific Worksheets Persistence
export async function saveWorksheetsForTeacher(teacherEmail: string, worksheets: any[]) {
  const normEmail = normalizeProgressEmail(teacherEmail);
  try {
    if (normEmail) {
      localStorage.setItem(`shabdshilp_teacher_worksheets_${normEmail}`, JSON.stringify(worksheets));
    }
    notifyCrossTabUpdate('WORKSHEET_SAVED', { teacherEmail: normEmail });
  } catch (e) {}

  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    activeUser.email.toLowerCase() === normEmail &&
    isTeacherOrAdminEmail(activeUser.email)
  ) {
    const teacherUid = activeUser.uid;
    const safeWorksheets = (worksheets || []).slice(0, 100).map((w: any) => ({
      ...w,
      teacherId: teacherUid,
      teacherEmail: normEmail,
    }));

    try {
      // 1. Save to teacher's personal document keyed by UID
      const teacherRef = doc(dbObj, 'teachers', teacherUid);
      const teacherPayload: Record<string, any> = stripUndefined({
        uid: teacherUid,
        teacherEmail: activeUser.email.toLowerCase().slice(0, 150),
        worksheets: safeWorksheets,
      });
      teacherPayload.updatedAt = serverTimestamp();
      await setDoc(teacherRef, teacherPayload, { merge: true });

      // 2. Also update global active store
      const globalRef = doc(dbObj, 'appStore', 'teacherWorksheets');
      const snap = await getDoc(globalRef);
      let existingAll: any[] = [];
      if (snap.exists() && Array.isArray(snap.data()?.worksheets)) {
        existingAll = snap
          .data()
          .worksheets.filter(
            (w: any) => w.teacherId !== teacherUid && normalizeProgressEmail(w.teacherEmail) !== normEmail
          );
      }
      const merged = [...safeWorksheets, ...existingAll].slice(0, 200);
      const globalPayload: Record<string, any> = stripUndefined({ worksheets: merged });
      globalPayload.updatedAt = serverTimestamp();
      await setDoc(globalRef, globalPayload, { merge: true });
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `teachers/${teacherUid}`);
    }
  }

  const portalToken = getServerSessionToken(normEmail);
  if (portalToken) {
    await fetch('/api/id-store/teacher-worksheets', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ worksheets }),
    });
  }
}

// Load teacher worksheets specifically by teacher's ID
export async function loadWorksheetsForTeacher(teacherEmail: string): Promise<any[]> {
  const normEmail = normalizeProgressEmail(teacherEmail);
  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    activeUser.email.toLowerCase() === normEmail
  ) {
    const teacherUid = activeUser.uid;
    try {
      const teacherRef = doc(dbObj, 'teachers', teacherUid);
      const snap = await getDoc(teacherRef);
      if (snap.exists() && Array.isArray(snap.data()?.worksheets) && snap.data().worksheets.length > 0) {
        return snap.data().worksheets;
      }

      // Fallback to appStore/teacherWorksheets filtered by teacherId or teacherEmail
      const globalRef = doc(dbObj, 'appStore', 'teacherWorksheets');
      const globalSnap = await getDoc(globalRef);
      if (globalSnap.exists() && Array.isArray(globalSnap.data()?.worksheets)) {
        const mine = globalSnap
          .data()
          .worksheets.filter(
            (w: any) => w.teacherId === teacherUid || normalizeProgressEmail(w.teacherEmail) === normEmail
          );
        if (mine.length > 0) return mine;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `teachers/${teacherUid}`);
    }
  }

  const portalToken = getServerSessionToken(normEmail);
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/teacher-worksheets?scope=mine', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.worksheets) && data.worksheets.length > 0) {
          return data.worksheets;
        }
      }
    } catch (e) {}
  }

  try {
    const local = localStorage.getItem(`shabdshilp_teacher_worksheets_${normEmail}`);
    if (local) return JSON.parse(local);
  } catch (e) {}
  return [];
}

// Global teacher worksheets store
export async function saveTeacherWorksheetsToFirestore(worksheets: any[]) {
  try {
    localStorage.setItem('shabd_teacher_worksheets', JSON.stringify(worksheets));
    localStorage.setItem('shabdshilp_teacher_worksheets', JSON.stringify(worksheets));
  } catch (e) {}

  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && isTeacherOrAdminEmail(activeUser.email)) {
    try {
      const ref = doc(dbObj, 'appStore', 'teacherWorksheets');
      const payload: Record<string, any> = stripUndefined({
        worksheets: (worksheets || []).slice(0, 200),
      });
      payload.updatedAt = serverTimestamp();
      await setDoc(ref, payload, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'appStore/teacherWorksheets');
    }
  }
}

export async function loadTeacherWorksheetsFromFirestore() {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified) {
    try {
      const ref = doc(dbObj, 'appStore', 'teacherWorksheets');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data().worksheets || [];
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, 'appStore/teacherWorksheets');
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/teacher-worksheets?scope=all', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.worksheets) && data.worksheets.length > 0) {
          return data.worksheets;
        }
      }
    } catch (e) {}
  }

  try {
    const local = localStorage.getItem('shabd_teacher_worksheets') || localStorage.getItem('shabdshilp_teacher_worksheets');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return null;
}

// Real-time listener for teacher worksheets (only attached when authenticated)
export function subscribeToTeacherWorksheets(callback: (worksheets: any[]) => void) {
  if (!dbObj || !authObj) return () => {};

  let unsubSnap: (() => void) | null = null;
  const unsubAuth = onAuthStateChanged(authObj, (user) => {
    if (unsubSnap) {
      unsubSnap();
      unsubSnap = null;
    }
    if (!user || !user.emailVerified) return;

    try {
      const ref = doc(dbObj, 'appStore', 'teacherWorksheets');
      unsubSnap = onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.data()?.worksheets || []);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'appStore/teacherWorksheets');
        }
      );
    } catch (e) {}
  });

  return () => {
    unsubAuth();
    if (unsubSnap) unsubSnap();
  };
}

// Save student submissions (localStorage + isolated /submissions/{id} doc or server store)
export async function saveStudentSubmissionsToFirestore(submissions: any[], newSubmission?: any) {
  try {
    localStorage.setItem('shabdshilp_student_submissions', JSON.stringify(submissions));
    localStorage.setItem('shabd_student_submissions', JSON.stringify(submissions));
  } catch (e) {}
  notifyCrossTabUpdate('NEW_SUBMISSION', { submissions });

  const targetSub = newSubmission || submissions?.[0];
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && activeUser.email) {
    if (
      !targetSub ||
      !targetSub.worksheetId ||
      targetSub.studentEmail?.toLowerCase() !== activeUser.email.toLowerCase()
    ) {
      return;
    }

    const cleanWsId = sanitizeDocId(targetSub.worksheetId);
    const subId = `${cleanWsId}_${activeUser.uid}`.slice(0, 128);
    try {
      const ref = doc(dbObj, 'submissions', subId);
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        return;
      }

      const payload: Record<string, any> = stripUndefined({
        id: subId,
        worksheetId: cleanWsId,
        teacherEmail: String(targetSub.teacherEmail || '').slice(0, 150),
        studentUid: activeUser.uid,
        studentEmail: activeUser.email.toLowerCase().slice(0, 150),
        studentName: (String(targetSub.studentName || activeUser.displayName || 'Student').trim() || 'Student').slice(0, 100),
        grade: (String(targetSub.grade || 'कक्षा 8').trim() || 'कक्षा 8').slice(0, 30),
        score: Math.min(1000, Math.max(0, Number(targetSub.score || 0))),
        maxScore: Math.min(1000, Math.max(1, Number(targetSub.maxScore || 1))),
        percentage: Math.min(100, Math.max(0, Number(targetSub.percentage || 0))),
        attemptedAt: String(targetSub.attemptedAt || new Date().toISOString()).slice(0, 100),
        answers: targetSub.answers && typeof targetSub.answers === 'object' ? targetSub.answers : {},
      });
      payload.updatedAt = serverTimestamp();
      await setDoc(ref, payload);
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `submissions/${subId}`);
    }
  }

  const portalToken = getServerSessionToken(targetSub?.studentEmail);
  if (portalToken && targetSub?.worksheetId) {
    await fetch('/api/id-store/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ submission: targetSub }),
    });
  }
}

export async function loadStudentSubmissionsFromFirestore() {
  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified) {
    try {
      const colRef = collection(dbObj, 'submissions');
      const q = isTeacherOrAdminEmail(activeUser.email)
        ? colRef
        : query(colRef, where('studentUid', '==', activeUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data());
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'submissions');
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/submissions', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.submissions) && data.submissions.length > 0) {
          return data.submissions;
        }
      }
    } catch (e) {}
  }

  try {
    const local =
      localStorage.getItem('shabdshilp_student_submissions') ||
      localStorage.getItem('shabd_student_submissions');
    if (local) return JSON.parse(local);
  } catch (e) {}
  return null;
}

// Real-time listener for student submissions (only attached when authenticated)
export function subscribeToStudentSubmissions(callback: (submissions: any[]) => void) {
  if (!dbObj || !authObj) return () => {};

  let unsubSnap: (() => void) | null = null;
  const unsubAuth = onAuthStateChanged(authObj, (user) => {
    if (unsubSnap) {
      unsubSnap();
      unsubSnap = null;
    }
    if (!user || !user.emailVerified) return;

    try {
      const colRef = collection(dbObj, 'submissions');
      const q = isTeacherOrAdminEmail(user.email)
        ? colRef
        : query(colRef, where('studentUid', '==', user.uid));
      unsubSnap = onSnapshot(
        q,
        (snapshot) => {
          callback(snapshot.docs.map((d) => d.data()));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'submissions');
        }
      );
    } catch (e) {}
  });

  return () => {
    unsubAuth();
    if (unsubSnap) unsubSnap();
  };
}

// Cross-Tab Real-time Broadcast Channel & Storage Ping
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('shabdshilp_cross_tab_sync');
  }
} catch (e) {}

export function notifyCrossTabUpdate(action: string, payload?: any) {
  try {
    if (channel) {
      channel.postMessage({ action, payload, timestamp: Date.now() });
    }
  } catch (e) {}
  try {
    localStorage.setItem('shabdshilp_sync_ping', JSON.stringify({ action, timestamp: Date.now() }));
  } catch (e) {}
}

export function subscribeToCrossTabUpdates(callback: (data: { action: string; payload?: any }) => void) {
  const cleanups: (() => void)[] = [];

  if (channel) {
    const onMsg = (event: MessageEvent) => {
      if (event.data) {
        callback(event.data);
      }
    };
    channel.addEventListener('message', onMsg);
    cleanups.push(() => channel?.removeEventListener('message', onMsg));
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === 'shabdshilp_sync_ping' && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(parsed);
      } catch (e) {}
    }
  };
  window.addEventListener('storage', onStorage);
  cleanups.push(() => window.removeEventListener('storage', onStorage));

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

// ==================== CREATIVE WRITING HOMEWORKS & SUBMISSIONS ====================
const LOCAL_CREATIVE_HW_KEY = 'shabdshilp_creative_homeworks_v1';
const LOCAL_CREATIVE_SUBS_KEY = 'shabdshilp_creative_submissions_v1';

function readLocalArray(key: string): any[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArray(key: string, items: any[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

export async function saveCreativeHomework(hw: any) {
  if (!hw || !hw.id) return;
  const hwId = sanitizeDocId(hw.id);
  const existingLocal = readLocalArray(LOCAL_CREATIVE_HW_KEY).filter((item: any) => item?.id !== hwId);
  const nextLocal = [{ ...hw, id: hwId }, ...existingLocal].slice(0, 150);
  writeLocalArray(LOCAL_CREATIVE_HW_KEY, nextLocal);
  notifyCrossTabUpdate('CREATIVE_HW_UPDATED', { homeworkId: hwId });

  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    isTeacherOrAdminEmail(activeUser.email)
  ) {
    try {
      const payload: Record<string, any> = stripUndefined({
        id: hwId,
        teacherUid: activeUser.uid,
        teacherEmail: activeUser.email.toLowerCase().slice(0, 150),
        teacherName: (String(hw.teacherName || activeUser.displayName || 'Teacher').trim() || 'Teacher').slice(0, 100),
        genreId: String(hw.genreId || 'anuched').slice(0, 40),
        titleHindi: (String(hw.titleHindi || 'रचनात्मक गृहकार्य').trim() || 'रचनात्मक गृहकार्य').slice(0, 200),
        instructionsHindi: (String(hw.instructionsHindi || 'दिए गए विषय पर लेखन पूर्ण करें।').trim() || 'लेखन पूर्ण करें।').slice(0, 1200),
        wordLimit: Math.min(1000, Math.max(10, Number(hw.wordLimit || 120))),
        dueDate: String(hw.dueDate || new Date().toISOString().slice(0, 10)).slice(0, 40),
        grade: String(hw.grade || 'कक्षा 8').slice(0, 30),
        section: String(hw.section || 'सभी सेक्शन (All Sections)').slice(0, 40),
        createdAt: String(hw.createdAt || new Date().toISOString()).slice(0, 60),
        isActive: Boolean(hw.isActive !== false),
      });
      payload.updatedAt = serverTimestamp();
      await setDoc(doc(dbObj, 'creativeHomeworks', hwId), payload, { merge: true });
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `creativeHomeworks/${hwId}`);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    await fetch('/api/id-store/creative-homeworks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ homework: { ...hw, id: hwId } }),
    });
  }
}

export async function loadCreativeHomeworks(): Promise<any[]> {
  const local = readLocalArray(LOCAL_CREATIVE_HW_KEY);
  const activeUser = await waitForAuthReady();

  if (dbObj && activeUser && activeUser.emailVerified) {
    try {
      const snap = await getDocs(collection(dbObj, 'creativeHomeworks'));
      const cloud = snap.docs.map((d) => d.data());
      if (cloud.length > 0) {
        const seen = new Set(cloud.map((c: any) => c.id));
        const merged = [...cloud, ...local.filter((l: any) => !seen.has(l.id))];
        writeLocalArray(LOCAL_CREATIVE_HW_KEY, merged);
        return merged;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'creativeHomeworks');
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/creative-homeworks', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const serverList = Array.isArray(data?.homeworks) ? data.homeworks : [];
        if (serverList.length > 0) {
          const seen = new Set(serverList.map((c: any) => c.id));
          const merged = [...serverList, ...local.filter((l: any) => !seen.has(l.id))];
          writeLocalArray(LOCAL_CREATIVE_HW_KEY, merged);
          return merged;
        }
      }
    } catch {}
  }

  return local;
}

export async function deleteCreativeHomework(homeworkId: string) {
  if (!homeworkId) return;
  const hwId = sanitizeDocId(homeworkId);
  const nextLocal = readLocalArray(LOCAL_CREATIVE_HW_KEY).filter((item: any) => item?.id !== hwId);
  writeLocalArray(LOCAL_CREATIVE_HW_KEY, nextLocal);
  notifyCrossTabUpdate('CREATIVE_HW_UPDATED', { homeworkId: hwId });

  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    isTeacherOrAdminEmail(activeUser.email)
  ) {
    try {
      await deleteDoc(doc(dbObj, 'creativeHomeworks', hwId));
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `creativeHomeworks/${hwId}`);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    await fetch(`/api/id-store/creative-homeworks/${encodeURIComponent(hwId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${portalToken}` },
    });
  }
}

export async function saveCreativeSubmission(sub: any) {
  if (!sub || !sub.id) return;
  const subId = sanitizeDocId(sub.id);
  const existingLocal = readLocalArray(LOCAL_CREATIVE_SUBS_KEY).filter((item: any) => item?.id !== subId);
  const nextLocal = [{ ...sub, id: subId }, ...existingLocal].slice(0, 300);
  writeLocalArray(LOCAL_CREATIVE_SUBS_KEY, nextLocal);
  notifyCrossTabUpdate('CREATIVE_SUB_UPDATED', { submissionId: subId });

  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified && activeUser.email) {
    try {
      const payload: Record<string, any> = stripUndefined({
        id: subId,
        ...(sub.homeworkId ? { homeworkId: sanitizeDocId(String(sub.homeworkId)) } : {}),
        ...(sub.teacherEmail ? { teacherEmail: String(sub.teacherEmail).slice(0, 150) } : {}),
        studentUid: activeUser.uid,
        studentEmail: activeUser.email.toLowerCase().slice(0, 150),
        studentName: (String(sub.studentName || activeUser.displayName || 'Student').trim() || 'Student').slice(0, 100),
        grade: String(sub.grade || 'कक्षा 8').slice(0, 30),
        ...(sub.section ? { section: String(sub.section).slice(0, 40) } : {}),
        genreId: String(sub.genreId || 'anuched').slice(0, 40),
        titleHindi: (String(sub.titleHindi || 'रचना').trim() || 'रचना').slice(0, 200),
        submissionMode: sub.submissionMode === 'handwritten' ? 'handwritten' : 'typed',
        ...(sub.fileName ? { fileName: String(sub.fileName).slice(0, 150) } : {}),
        ...(sub.mimeType ? { mimeType: String(sub.mimeType).slice(0, 60) } : {}),
        transcribedText: (String(sub.transcribedText || 'रचना प्रस्तुत').trim() || 'रचना प्रस्तुत').slice(0, 8000),
        overallScore: Math.min(100, Math.max(0, Number(sub.overallScore || 0))),
        rubricScores: sub.rubricScores && typeof sub.rubricScores === 'object' ? sub.rubricScores : { format: 7, content: 7, language: 7 },
        grammarErrors: Array.isArray(sub.grammarErrors) ? sub.grammarErrors.slice(0, 20) : [],
        ...(sub.structureFeedback ? { structureFeedback: String(sub.structureFeedback).slice(0, 1500) } : {}),
        ...(Array.isArray(sub.vocabularySuggestions)
          ? { vocabularySuggestions: sub.vocabularySuggestions.slice(0, 20) }
          : {}),
        feedbackHindi: String(sub.feedbackHindi || '').slice(0, 2000),
        ...(sub.feedbackEnglish ? { feedbackEnglish: String(sub.feedbackEnglish).slice(0, 2000) } : {}),
        status: 'Submitted',
        coinsAwarded: Math.min(50, Math.max(0, Number(sub.coinsAwarded || 0))),
        submittedAt: String(sub.submittedAt || new Date().toISOString()).slice(0, 60),
      });
      payload.updatedAt = serverTimestamp();
      await setDoc(doc(dbObj, 'creativeSubmissions', subId), payload);
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `creativeSubmissions/${subId}`);
    }
  }

  const portalToken = getServerSessionToken(sub.studentEmail);
  if (portalToken) {
    await fetch('/api/id-store/creative-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ submission: { ...sub, id: subId } }),
    });
  }
}

export async function loadCreativeSubmissions(studentEmail?: string | null): Promise<any[]> {
  const local = readLocalArray(LOCAL_CREATIVE_SUBS_KEY);
  const normEmail = normalizeProgressEmail(studentEmail);
  const filterLocal = () =>
    normEmail ? local.filter((s: any) => normalizeProgressEmail(s?.studentEmail) === normEmail) : local;

  const activeUser = await waitForAuthReady();
  if (dbObj && activeUser && activeUser.emailVerified) {
    try {
      const colRef = collection(dbObj, 'creativeSubmissions');
      const q = isTeacherOrAdminEmail(activeUser.email)
        ? colRef
        : query(colRef, where('studentUid', '==', activeUser.uid));
      const snap = await getDocs(q);
      const cloud = snap.docs.map((d) => d.data());
      if (cloud.length > 0) {
        const seen = new Set(cloud.map((c: any) => c.id));
        const merged = [...cloud, ...filterLocal().filter((l: any) => !seen.has(l.id))];
        return merged;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'creativeSubmissions');
    }
  }

  const portalToken = getServerSessionToken(normEmail || undefined);
  if (portalToken) {
    try {
      const res = await fetch('/api/id-store/creative-submissions', {
        headers: { Authorization: `Bearer ${portalToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const serverList = Array.isArray(data?.submissions) ? data.submissions : [];
        if (serverList.length > 0) {
          const seen = new Set(serverList.map((c: any) => c.id));
          return [...serverList, ...filterLocal().filter((l: any) => !seen.has(l.id))];
        }
      }
    } catch {}
  }

  return filterLocal();
}

export async function reviewCreativeSubmission(
  submissionId: string,
  status: 'Submitted' | 'Reviewed',
  teacherRemarks: string
) {
  if (!submissionId) return;
  const subId = sanitizeDocId(submissionId);
  const cleanRemarks = String(teacherRemarks || '').slice(0, 1000);
  const nextLocal = readLocalArray(LOCAL_CREATIVE_SUBS_KEY).map((s: any) =>
    s?.id === subId ? { ...s, status, teacherRemarks: cleanRemarks } : s
  );
  writeLocalArray(LOCAL_CREATIVE_SUBS_KEY, nextLocal);
  notifyCrossTabUpdate('CREATIVE_SUB_UPDATED', { submissionId: subId });

  const activeUser = await waitForAuthReady();
  if (
    dbObj &&
    activeUser &&
    activeUser.emailVerified &&
    activeUser.email &&
    isTeacherOrAdminEmail(activeUser.email)
  ) {
    try {
      await updateDoc(doc(dbObj, 'creativeSubmissions', subId), {
        status,
        teacherRemarks: cleanRemarks,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `creativeSubmissions/${subId}`);
    }
  }

  const portalToken = getServerSessionToken();
  if (portalToken) {
    await fetch(`/api/id-store/creative-submissions/${encodeURIComponent(subId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portalToken}`,
      },
      body: JSON.stringify({ status, teacherRemarks: cleanRemarks }),
    });
  }
}
