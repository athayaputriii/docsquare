'use client';

import { useSessions } from '@/hooks/useSessions';
import styles from './SessionList.module.css';

const statusCopy: Record<string, string> = {
  needs_patient_info: 'Needs patient info',
  waiting_audio: 'Awaiting audio',
  transcribing: 'Transcribing audio',
  report_generating: 'Generating report',
  complete: 'Complete',
  error: 'Error',
};

function formatDate(value?: string) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function SessionList() {
  const { sessions, loading } = useSessions({ limitDocs: 50 });

  if (loading) {
    return <p className={styles.placeholder}>Loading sessions…</p>;
  }

  if (!sessions.length) {
    return <p className={styles.placeholder}>No sessions yet.</p>;
  }

  return (
    <div className={styles.grid}>
      {sessions.map((session) => (
        <section key={session.sessionId} className="card">
          <header className={styles.header}>
            <div>
              <p className={styles.patientName}>{session.patient?.name ?? 'Unknown patient'}</p>
              <p className={styles.patientMeta}>
                ID: {session.patient?.id ?? '—'} · User: {session.userPhone}
              </p>
            </div>
            <span className={styles.status}>{statusCopy[session.status] ?? session.status}</span>
          </header>

          {session.summary && (
            <p className={styles.summary}>
              {session.summary}
            </p>
          )}

          <dl className={styles.meta}>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(session.updatedAt)}</dd>
            </div>
            <div>
              <dt>Transcript</dt>
              <dd className={styles.textBlock}>
                {session.transcriptText ? session.transcriptText.slice(0, 200) : '—'}
              </dd>
            </div>
            <div>
              <dt>Report</dt>
              <dd className={styles.textBlock}>
                {session.reportText ? session.reportText.slice(0, 200) : '—'}
              </dd>
            </div>
          </dl>
        </section>
      ))}
    </div>
  );
}
