/**
 * Firestore Security Rules Verification Suite — "Dirty Dozen" Payloads
 * Run against Firebase Emulator with @firebase/rules-unit-testing.
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import fs from 'node:fs';

let testEnv: RulesTestEnvironment;

const STUDENT_A = { uid: 'student_a', email: 'studenta@gmail.com', email_verified: true };
const STUDENT_B = { uid: 'student_b', email: 'studentb@gmail.com', email_verified: true };
const UNVERIFIED_SPOOF = { uid: 'spoof_1', email: 'coolneha248@gmail.com', email_verified: false };
const TEACHER = { uid: 'teacher_1', email: 'kiran.teacher@school.edu', email_verified: true };

export async function runDirtyDozenSecurityTests() {
  testEnv = await initializeTestEnvironment({
    projectId: 'shabdshilp-rules-test',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  const dbA = testEnv.authenticatedContext(STUDENT_A.uid, STUDENT_A).firestore();
  const dbB = testEnv.authenticatedContext(STUDENT_B.uid, STUDENT_B).firestore();
  const dbSpoof = testEnv.authenticatedContext(UNVERIFIED_SPOOF.uid, UNVERIFIED_SPOOF).firestore();
  const dbTeacher = testEnv.authenticatedContext(TEACHER.uid, TEACHER).firestore();

  // 1. Ghost field (isAdmin: true)
  await assertFails(
    setDoc(doc(dbA, 'users', STUDENT_A.uid), {
      uid: STUDENT_A.uid,
      email: STUDENT_A.email,
      userName: 'Aarav',
      grade: 'कक्षा 8',
      isAdmin: true,
      updatedAt: serverTimestamp(),
    })
  );

  // 2. Unverified email spoof
  await assertFails(
    setDoc(doc(dbSpoof, 'appStore', 'teacherWorksheets'), {
      worksheets: [],
      updatedAt: serverTimestamp(),
    })
  );

  // 3. Cross-user progress hijack
  await assertFails(
    setDoc(doc(dbA, 'userProgress', STUDENT_B.uid), {
      uid: STUDENT_B.uid,
      email: STUDENT_B.email,
      progress: {},
      updatedAt: serverTimestamp(),
    })
  );

  // 4. Forged client timestamp
  await assertFails(
    setDoc(doc(dbA, 'userProgress', STUDENT_A.uid), {
      uid: STUDENT_A.uid,
      email: STUDENT_A.email,
      progress: {},
      updatedAt: '2020-01-01T00:00:00Z',
    })
  );

  // 5. Orphaned custom worksheet before parent /users/{uid} exists
  await assertFails(
    setDoc(doc(dbA, 'users', STUDENT_A.uid, 'customWorksheets', 'ws_orphan'), {
      id: 'ws_orphan',
      uid: STUDENT_A.uid,
      titleHindi: 'कारक अभ्यास',
      topicId: 'karak',
      grade: 'कक्षा 8',
      difficulty: 'medium',
      questionCount: 1,
      questions: [{ id: 'q1' }],
      updatedAt: serverTimestamp(),
    })
  );

  // 6. ID Poisoning (>128 chars)
  const poisonedId = 'x'.repeat(200);
  await assertFails(
    setDoc(doc(dbA, 'submissions', poisonedId), {
      id: poisonedId,
      worksheetId: 'ws_1',
      studentUid: STUDENT_A.uid,
      studentEmail: STUDENT_A.email,
      studentName: 'Aarav',
      grade: 'कक्षा 8',
      score: 5,
      maxScore: 10,
      percentage: 50,
      attemptedAt: 'now',
      answers: {},
      updatedAt: serverTimestamp(),
    })
  );

  // 7. Oversized userName (>100 chars)
  await assertFails(
    setDoc(doc(dbA, 'users', STUDENT_A.uid), {
      uid: STUDENT_A.uid,
      email: STUDENT_A.email,
      userName: 'A'.repeat(250),
      grade: 'कक्षा 8',
      updatedAt: serverTimestamp(),
    })
  );

  // 8. Student writing to appStore/teacherWorksheets
  await assertFails(
    setDoc(doc(dbA, 'appStore', 'teacherWorksheets'), {
      worksheets: [],
      updatedAt: serverTimestamp(),
    })
  );

  // Valid baseline: Student A submits once
  await assertSucceeds(
    setDoc(doc(dbA, 'submissions', 'ws_1_student_a'), {
      id: 'ws_1_student_a',
      worksheetId: 'ws_1',
      studentUid: STUDENT_A.uid,
      studentEmail: STUDENT_A.email,
      studentName: 'Aarav',
      grade: 'कक्षा 8',
      score: 6,
      maxScore: 10,
      percentage: 60,
      attemptedAt: '2026-01-01',
      answers: { q1: 0 },
      updatedAt: serverTimestamp(),
    })
  );

  // 9. Student score tampering via update
  await assertFails(
    updateDoc(doc(dbA, 'submissions', 'ws_1_student_a'), {
      score: 10,
      percentage: 100,
      updatedAt: serverTimestamp(),
    })
  );

  // 10. Student B snooping Student A submission
  await assertFails(getDoc(doc(dbB, 'submissions', 'ws_1_student_a')));

  // 11. Teacher unbounded array (>100 worksheets)
  await assertFails(
    setDoc(doc(dbTeacher, 'teachers', TEACHER.uid), {
      uid: TEACHER.uid,
      teacherEmail: TEACHER.email,
      worksheets: Array.from({ length: 105 }, (_, i) => ({ id: `w_${i}` })),
      updatedAt: serverTimestamp(),
    })
  );

  // 12. Blanket users list / unfiltered submissions list
  await assertFails(getDocs(collection(dbA, 'users')));
  await assertFails(getDocs(collection(dbA, 'submissions')));

  // 13. Student cannot create creativeHomeworks
  await assertFails(
    setDoc(doc(dbA, 'creativeHomeworks', 'chw_spoof'), {
      id: 'chw_spoof',
      teacherUid: STUDENT_A.uid,
      teacherEmail: STUDENT_A.email,
      teacherName: 'Student A',
      genreId: 'anuched',
      titleHindi: 'नकली गृहकार्य',
      instructionsHindi: 'लिखें',
      wordLimit: 100,
      dueDate: '2026-12-01',
      grade: 'कक्षा 8',
      isActive: true,
      updatedAt: serverTimestamp(),
    })
  );

  // 14. Teacher can create valid creativeHomeworks
  await assertSucceeds(
    setDoc(doc(dbTeacher, 'creativeHomeworks', 'chw_valid_1'), {
      id: 'chw_valid_1',
      teacherUid: TEACHER.uid,
      teacherEmail: TEACHER.email,
      teacherName: 'Kiran Madam',
      genreId: 'anuched',
      titleHindi: 'डिजिटल शिक्षा का महत्व',
      instructionsHindi: '120 शब्दों में अनुच्छेद लिखें।',
      wordLimit: 120,
      dueDate: '2026-12-01',
      grade: 'कक्षा 8',
      isActive: true,
      updatedAt: serverTimestamp(),
    })
  );

  // 15. Student cannot create creativeSubmissions pre-marked as Reviewed
  await assertFails(
    setDoc(doc(dbA, 'creativeSubmissions', 'csub_bad_status'), {
      id: 'csub_bad_status',
      studentUid: STUDENT_A.uid,
      studentEmail: STUDENT_A.email,
      studentName: 'Aarav',
      grade: 'कक्षा 8',
      genreId: 'anuched',
      titleHindi: 'डिजिटल शिक्षा',
      submissionMode: 'typed',
      transcribedText: 'हिंदी भाषा का महत्व।',
      overallScore: 85,
      rubricScores: { format: 8, content: 8, language: 9 },
      grammarErrors: [],
      feedbackHindi: 'अच्छा प्रयास',
      status: 'Reviewed',
      coinsAwarded: 4,
      submittedAt: '2026-11-25T10:00:00Z',
      updatedAt: serverTimestamp(),
    })
  );

  // 16. Student can create valid creativeSubmissions with status 'Submitted'
  await assertSucceeds(
    setDoc(doc(dbA, 'creativeSubmissions', 'csub_valid_1'), {
      id: 'csub_valid_1',
      homeworkId: 'chw_valid_1',
      studentUid: STUDENT_A.uid,
      studentEmail: STUDENT_A.email,
      studentName: 'Aarav',
      grade: 'कक्षा 8',
      genreId: 'anuched',
      titleHindi: 'डिजिटल शिक्षा',
      submissionMode: 'handwritten',
      transcribedText: 'हिंदी भाषा हमारी संस्कृति का आधार है।',
      overallScore: 82,
      rubricScores: { format: 8, content: 8, language: 8 },
      grammarErrors: [],
      feedbackHindi: 'अच्छा प्रयास',
      status: 'Submitted',
      coinsAwarded: 4,
      submittedAt: '2026-11-25T10:00:00Z',
      updatedAt: serverTimestamp(),
    })
  );

  // 17. Student cannot update own creativeSubmissions status to Reviewed or alter overallScore
  await assertFails(
    updateDoc(doc(dbA, 'creativeSubmissions', 'csub_valid_1'), {
      status: 'Reviewed',
      overallScore: 100,
      updatedAt: serverTimestamp(),
    })
  );

  // 18. Teacher cannot tamper with overallScore when reviewing creativeSubmissions
  await assertFails(
    updateDoc(doc(dbTeacher, 'creativeSubmissions', 'csub_valid_1'), {
      status: 'Reviewed',
      overallScore: 99,
      teacherRemarks: 'उत्कृष्ट',
      updatedAt: serverTimestamp(),
    })
  );

  // 19. Teacher can legitimately update ONLY status, teacherRemarks, updatedAt
  await assertSucceeds(
    updateDoc(doc(dbTeacher, 'creativeSubmissions', 'csub_valid_1'), {
      status: 'Reviewed',
      teacherRemarks: 'उत्कृष्ट हस्तलेखन और स्पष्ट विचार।',
      updatedAt: serverTimestamp(),
    })
  );

  await testEnv.cleanup();
}
