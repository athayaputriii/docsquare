'use client';

import { useSessions } from '@/lib/hooks/useSessions';

const STATUS_COPY: Record<string, string> = {
  needs_patient_info: 'Needs patient info',
  waiting_audio: 'Awaiting audio',
  transcribing: 'Transcribing',
  report_generating: 'Generating report',
  complete: 'Complete',
  error: 'Error',
};

export function SessionList() {
  const { sessions, loading } = useSessions();

  if (loading) {
    return <p className="text-sm text-slate-400">Loading sessions…</p>;
  }

  if (!sessions.length) {
    return <p className="text-sm text-slate-400">No sessions yet.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sessions.map((session) => (
        <article key={session.sessionId} className="card space-y-4">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white">{session.patient?.name ?? 'Unknown patient'}</p>
              <p className="text-sm text-slate-400">
                ID: {session.patient?.id ?? '—'} &middot; {session.userPhone}
              </p>
            </div>
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
              {STATUS_COPY[session.status] ?? session.status}
            </span>
          </header>

          {session.summary && (
            <p className="text-sm text-slate-200 leading-relaxed">{session.summary}</p>
          )}

          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Transcript</p>
            <p className="line-clamp-4 text-slate-200">
              {session.transcriptText ?? '—'}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Report</p>
            <p className="line-clamp-4 text-slate-200">
              {session.reportText ?? '—'}
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Updated {session.updatedAt ? new Date(session.updatedAt).toLocaleString() : '—'}
          </p>
        </article>
      ))}
    </div>
  );
}
