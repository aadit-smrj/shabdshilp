# ShabdShilp Firestore Security Specification

## 1. Data Invariants
1. **Verified Identity Required**: Every read and write operation requires `request.auth != null`, `request.auth.token.email_verified == true`, and a string `request.auth.token.email`.
2. **Default-Deny Catch-All**: All unmatched paths (`/{document=**}`) are explicitly denied (`allow read, write: if false`).
3. **PII Isolation & Owner Binding**:
   - `/users/{userId}` can only be read (`get`), created, or updated by `request.auth.uid == userId` (or an Admin). `list` is disabled (`false`).
   - `/userProgress/{userProgressId}` is strictly bound to `userProgressId == request.auth.uid` and `data.uid == request.auth.uid` (or Admin). `list` is disabled (`false`).
   - No client can self-assign `role` or `isAdmin` fields on `/users/{userId}`.
4. **Master Gate for Subcollections**:
   - `/users/{userId}/customWorksheets/{worksheetId}` enforces parent existence and ownership via `get(/databases/$(database)/documents/users/$(userId)).data.uid == request.auth.uid` on single-document operations (`get`, `create`, `update`, `delete`), while `list` enforces `resource.data.uid == request.auth.uid` with zero `get()`/`exists()` calls (preventing O(n) query cost amplification).
5. **Teacher & Shared Catalog Integrity**:
   - `/teachers/{teacherId}` and `/appStore/teacherWorksheets` writes are restricted strictly to verified Teachers (`isTeacherEmail()`) or Admins (`isAdmin()`).
   - Authenticated verified students may only `get` the singleton `/appStore/teacherWorksheets` catalog (`allow list: if false`).
6. **Student Submission Tamper-Resistance (Terminal State)**:
   - `/submissions/{submissionId}` requires `studentUid == request.auth.uid` and `studentEmail.lower() == request.auth.token.email.lower()` on `create`.
   - Students cannot `update` or `delete` a submission once submitted (terminal state locked; only Admin can update).
   - `allow list` enforces `resource.data.studentUid == request.auth.uid || isTeacherEmail() || isBootstrappedAdminEmail()` without `get()`/`exists()` calls.
7. **Temporal Integrity & Strict Keys**:
   - All writes enforce `data.updatedAt == request.time` (server timestamp only).
   - All `create` and `update` operations call a standalone `isValid[Entity](incoming())` helper with strict `hasAll` / `hasOnly`, type checks, string `.size()` bounds, bounded list checks, and `isValidId()` regex guards (`^[a-zA-Z0-9_\-]+$`).
8. **Creative Writing Homework Integrity**:
   - `/creativeHomeworks/{homeworkId}` allows `get` and `list` only for verified users (`isVerified()`). `create`, `update`, and `delete` require `isTeacherOrAdmin()` and ownership (`teacherUid == request.auth.uid`).
9. **Creative Writing / Handwritten OCR Portfolio Isolation**:
   - `/creativeSubmissions/{submissionId}` enforces student ownership on `create` (`studentUid == request.auth.uid`, `status == 'Submitted'`, strict text & array bounds with zero raw binary blobs). `list` queries filter by `resource.data.studentUid == request.auth.uid` for students or teacher/admin role. Only teachers/admins may `update`, strictly limited to `['status', 'teacherRemarks', 'updatedAt']`.

---

## 2. The "Dirty Dozen" Attack Payloads (All Must Fail with `PERMISSION_DENIED`)

1. **Ghost Field / Shadow Update (`/users/{uid}`)**:
   - `{"uid": "<attackerUid>", "email": "student@gmail.com", "userName": "Aarav", "grade": "कक्षा 8", "isAdmin": true, "updatedAt": "<serverTime>"}` -> Rejected by `hasOnly(...)`.
2. **Unverified Email Spoof (`/users/{uid}`)**:
   - Auth token has `email: "coolneha248@gmail.com"`, `email_verified: false` -> Rejected by `isVerified()`.
3. **Identity Hijack on Progress (`/userProgress/{victimUid}`)**:
   - Attacker (`attackerUid`) attempts to write `{"uid": "<victimUid>", "email": "victim@gmail.com", "progress": {}, "updatedAt": "<serverTime>"}` -> Rejected by `isOwner(userProgressId)`.
4. **Client-Forged Timestamp (`/userProgress/{uid}`)**:
   - `{"uid": "<uid>", "email": "student@gmail.com", "progress": {}, "updatedAt": "2020-01-01T00:00:00Z"}` -> Rejected by `data.updatedAt == request.time`.
5. **Orphaned Custom Worksheet (`/users/{uid}/customWorksheets/ws_1`)**:
   - User has not created `/users/{uid}` yet, attempts to create `/users/{uid}/customWorksheets/ws_1` -> Rejected by Master Gate `get(/databases/$(database)/documents/users/$(userId))`.
6. **ID Poisoning / Oversized Document ID (`/submissions/{1500_char_id}`)**:
   - Document ID exceeds 128 chars or contains `/`, `.`, `$` -> Rejected by `isValidId()`.
7. **Denial-of-Wallet Oversized String (`/users/{uid}`)**:
   - `{"uid": "<uid>", "email": "student@gmail.com", "userName": "<1000-char string>", "grade": "कक्षा 8", "updatedAt": "<serverTime>"}` -> Rejected by `data.userName.size() <= 100`.
8. **Student Escalating to Write Teacher Worksheets (`/appStore/teacherWorksheets`)**:
   - Verified student (`student@gmail.com`) attempts to overwrite `/appStore/teacherWorksheets` -> Rejected by `isTeacherOrAdmin()`.
9. **Score Tampering After Submission (`/submissions/{subId}` update)**:
   - Student attempts `update` on their existing `/submissions/{subId}` to change `score: 100, percentage: 100` -> Rejected because student updates are blocked after creation.
10. **Other Student Submission Snooping (`/submissions/{otherSubId}` get)**:
    - Student A attempts `get` on Student B's submission -> Rejected because `existing().studentUid != request.auth.uid`.
11. **Unbounded Array Poisoning (`/teachers/{teacherUid}`)**:
    - Teacher attempts to write `worksheets` array with 150 items (or first element not a map) -> Rejected by `data.worksheets.size() <= 100 && data.worksheets[0] is map`.
12. **Blanket Collection Scraping (`/users` list or `/submissions` unfiltered list)**:
    - Student attempts `getDocs(collection(db, 'users'))` or unfiltered `getDocs(collection(db, 'submissions'))` -> Rejected (`users` list is `false`; `submissions` list requires `resource.data.studentUid == request.auth.uid`).
