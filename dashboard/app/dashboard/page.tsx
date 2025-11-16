'use client';

import { useMemo } from 'react';
import { useSessions } from '@/lib/hooks/useSessions';

const DOCTOR_NAME = 'Dr. Maya Tan';

const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatDate(dateString?: string | null) {
  if (!dateString) return 'Awaiting activity';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return formatter.format(date);
}

function SessionEntry({
  sessionId,
  updatedAt,
  createdAt,
  transcriptText,
  reportText,
  patientName,
}: {
  sessionId: string;
  updatedAt?: string | null;
  createdAt?: string | null;
  transcriptText?: string | null;
  reportText?: string | null;
  patientName?: string | null;
}) {
  const displayDate = updatedAt ?? createdAt ?? null;

  return (
    <article
      key={sessionId}
      className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-5 shadow-black-card"
    >
      <div className="flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>{formatDate(displayDate)}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Patient {patientName ?? 'Unknown'}
        </span>
      </div>

      <div className="mt-4 space-y-6">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Audio transcription
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-100">
            {transcriptText?.trim() || 'Waiting for transcription.'}
          </p>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Generated report
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-100">
            {reportText?.trim() || 'Report has not been generated yet.'}
          </p>
        </section>
      </div>
    </article>
  );
}

function SessionsFeed() {
  const { sessions, loading } = useSessions(10);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`session-skeleton-${idx}`}
              className="h-52 animate-pulse rounded-3xl border border-slate-800/40 bg-slate-900/40"
            />
          ))}
        </div>
      );
    }

    if (!sessions.length) {
      return (
        <div className="rounded-3xl border border-dashed border-slate-800/60 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
          No WhatsApp sessions yet. When patient audio arrives, the transcription and report will
          appear here automatically.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionEntry
            key={session.sessionId}
            sessionId={session.sessionId}
            updatedAt={session.updatedAt}
            createdAt={session.createdAt}
            transcriptText={session.transcriptText}
            reportText={session.reportText}
            patientName={session.patient?.name ?? null}
          />
        ))}
      </div>
    );
  }, [loading, sessions]);

  return content;
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-surface-950 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Doctor</p>
          <h1 className="text-4xl font-semibold text-white">{DOCTOR_NAME}</h1>
          <p className="text-sm text-slate-400">
            Mobile-friendly snapshot of daily WhatsApp consultations showing the date, audio
            transcription, and generated medical report.
          </p>
        </header>

        <SessionsFeed />
      </div>
    </main>
  );
}
