// firebaseModels.js
export const FirestoreCollections = Object.freeze({
  sessions: 'sessions',
  reports: 'reports',
  messages: 'messages',
});

export const SessionStatus = Object.freeze({
  NEEDS_PATIENT_INFO: 'needs_patient_info',
  WAITING_AUDIO: 'waiting_audio',
  TRANSCRIBING: 'transcribing',
  REPORT_GENERATING: 'report_generating',
  COMPLETE: 'complete',
  ERROR: 'error',
});

export const ReportStatus = Object.freeze({
  PENDING: 'pending',
  GENERATING: 'generating',
  COMPLETE: 'complete',
  ERROR: 'error',
});

const timestamp = () => new Date().toISOString();

export function buildSessionDoc({
  sessionId,
  userPhone,
  patientName = null,
  patientId = null,
  status = SessionStatus.NEEDS_PATIENT_INFO,
  lastMessageAt = timestamp(),
  meta = {},
}) {
  const now = timestamp();
  return {
    sessionId,
    userPhone,
    patient: patientName || patientId ? { name: patientName, id: patientId } : null,
    status,
    meta,
    lastMessageAt,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildReportDoc({
  reportId,
  sessionId,
  transcriptPath = null,
  reportPath = null,
  transcriptText = null,
  reportText = null,
  status = ReportStatus.PENDING,
  summary = null,
  error = null,
}) {
  const now = timestamp();
  return {
    reportId,
    sessionId,
    transcriptPath,
    reportPath,
    transcriptText,
    reportText,
    status,
    summary,
    error,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildMessageDoc({
  sessionId,
  whatsappMessageId,
  direction,
  payload,
  type = 'text',
}) {
  return {
    sessionId,
    whatsappMessageId,
    direction,
    type,
    payload,
    createdAt: timestamp(),
  };
}
