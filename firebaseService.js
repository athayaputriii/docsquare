// firebaseService.js
import fs from 'fs';
import path from 'path';
import { getFirestore } from './firebaseAdmin.js';
import { FIREBASE_CREDENTIALS_PRESENT, DB_DIR } from './config.js';
import {
  FirestoreCollections,
  SessionStatus,
  ReportStatus,
  buildSessionDoc,
  buildReportDoc,
} from './firebaseModels.js';

const iso = () => new Date().toISOString();

let firestore = null;
const isLocalMode = !FIREBASE_CREDENTIALS_PRESENT;

if (FIREBASE_CREDENTIALS_PRESENT) {
  try {
    firestore = getFirestore();
    console.log('[firebase] Firestore initialized.');
  } catch (err) {
    console.error('[firebase] Failed to initialize admin SDK:', err.message);
  }
} else {
  console.warn('[storage] Running in local file DB mode.');
}

// ---------- Local file DB helpers ----------
const ensureLocalDb = () => {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
    const sessionFile = path.join(DB_DIR, 'sessions.json');
    const reportFile = path.join(DB_DIR, 'reports.json');
    if (!fs.existsSync(sessionFile)) fs.writeFileSync(sessionFile, JSON.stringify({}), 'utf-8');
    if (!fs.existsSync(reportFile)) fs.writeFileSync(reportFile, JSON.stringify({}), 'utf-8');
  } catch (e) {
    console.error('[storage] Failed to init local DB:', e.message);
  }
};

const sessionFilePath = () => path.join(DB_DIR, 'sessions.json');
const reportFilePath = () => path.join(DB_DIR, 'reports.json');

const readJson = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

if (isLocalMode) ensureLocalDb();

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
  const doc = buildSessionDoc({
    sessionId,
    userPhone,
    patientName,
    patientId,
    status,
    meta,
  });
  if (!firestore) {
    const db = readJson(sessionFilePath());
    db[sessionId] = doc;
    writeJson(sessionFilePath(), db);
    return doc;
  }
  await sessionsCollection().doc(sessionId).set(doc, { merge: false });
  return doc;
}

export async function updateSessionFields(sessionId, fields = {}) {
  if (!sessionId) return;
  if (!firestore) {
    const db = readJson(sessionFilePath());
    const existing = db[sessionId] || {};
    db[sessionId] = { ...existing, ...fields, updatedAt: iso() };
    writeJson(sessionFilePath(), db);
    return;
  }
  await sessionsCollection().doc(sessionId).set({ ...fields, updatedAt: iso() }, { merge: true });
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
  const doc = buildReportDoc({
    reportId,
    sessionId,
    transcriptPath,
    reportPath,
    transcriptText,
    reportText,
    status,
  });
  if (!firestore) {
    const db = readJson(reportFilePath());
    db[reportId] = doc;
    writeJson(reportFilePath(), db);
    return doc;
  }
  await reportsCollection().doc(reportId).set(doc, { merge: false });
  return doc;
}

export async function updateReportRecord(reportId, fields = {}) {
  if (!reportId) return;
  if (!firestore) {
    const db = readJson(reportFilePath());
    const existing = db[reportId] || {};
    db[reportId] = { ...existing, ...fields, updatedAt: iso() };
    writeJson(reportFilePath(), db);
    return;
  }
  await reportsCollection().doc(reportId).set({ ...fields, updatedAt: iso() }, { merge: true });
}

// ---------- Listing helpers (for API) ----------
export async function listSessions({ limit = 50 } = {}) {
  if (!firestore) {
    const db = readJson(sessionFilePath());
    return Object.values(db)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, limit);
  }
  // Optional: Firestore listing when credentials present
  const snap = await sessionsCollection().orderBy('updatedAt', 'desc').limit(limit).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listReports({ limit = 50 } = {}) {
  if (!firestore) {
    const db = readJson(reportFilePath());
    return Object.values(db)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, limit);
  }
  const snap = await reportsCollection().orderBy('updatedAt', 'desc').limit(limit).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export { SessionStatus, ReportStatus };
