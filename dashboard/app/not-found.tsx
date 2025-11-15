'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">DocSquare</p>
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="max-w-md text-slate-400">
        The view you are looking for doesn&apos;t exist yet. Please return to the main dashboard.
      </p>
      <Link
        href="/"
        className="rounded-full bg-cyan-400/20 px-6 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-inset ring-cyan-400/50 transition hover:bg-cyan-400/30"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
