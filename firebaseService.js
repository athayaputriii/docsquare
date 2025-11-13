// firebaseService.js
import { getFirestore } from './firebaseAdmin.js';
import { FIREBASE_CREDENTIALS_PRESENT } from './config.js';
import {
  FirestoreCollections,
  SessionStatus,
  ReportStatus,
  buildSessionDoc,
  buildReportDoc,
} from './firebaseModels.js';

const iso = () => new Date().toISOString();

let firestore = null;

if (FIREBASE_CREDENTIALS_PRESENT) {
  try {
    firestore = getFirestore();
    console.log('[firebase] Firestore initialized.');
  } catch (err) {
    console.error('[firebase] Failed to initialize admin SDK:', err.message);
  }
} else {
  console.warn('[firebase] Admin credentials not found. Firebase features are disabled.');
}

const sessionsCollection = () =>
  firestore?.collection(FirestoreCollections.sessions);
const reportsCollection = () =>
  firestore?.collection(FirestoreCollections.reports);
export const isFirebaseReady = () => Boolean(firestore);

export async function createSessionRecord({
  sessionId,
  userPhone,
  patientName,
  patientId,
  status = SessionStatus.WAITING_AUDIO,
  meta = {},
}) {
  if (!firestore) return null;
  const doc = buildSessionDoc({
    sessionId,
    userPhone,
    patientName,
    patientId,
    status,
    meta,
  });
  await sessionsCollection().doc(sessionId).set(doc, { merge: false });
  return doc;
}

export async function updateSessionFields(sessionId, fields = {}) {
  if (!firestore || !sessionId) return;
  await sessionsCollection()
    .doc(sessionId)
    .set(
      {
        ...fields,
        updatedAt: iso(),
      },
      { merge: true },
    );
}

export async function setSessionStatus(sessionId, status, extra = {}) {
  if (!sessionId) return;
  await updateSessionFields(sessionId, { status, ...extra });
}

export async function createReportRecord({
  reportId,
  sessionId,
  transcriptPath = null,
  reportPath = null,
  transcriptText = null,
  reportText = null,
  status = ReportStatus.PENDING,
}) {
  if (!firestore) return null;
  const doc = buildReportDoc({
    reportId,
    sessionId,
    transcriptPath,
    reportPath,
    transcriptText,
    reportText,
    status,
  });
  await reportsCollection().doc(reportId).set(doc, { merge: false });
  return doc;
}

export async function updateReportRecord(reportId, fields = {}) {
  if (!firestore || !reportId) return;
  await reportsCollection()
    .doc(reportId)
    .set(
      {
        ...fields,
        updatedAt: iso(),
      },
      { merge: true },
    );
}

export { SessionStatus, ReportStatus };
