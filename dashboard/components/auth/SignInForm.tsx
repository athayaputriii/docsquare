'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase is not configured. Check NEXT_PUBLIC_FIREBASE_* variables.');
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">DocSquare</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
        <p className="text-sm text-slate-400">Access the WhatsApp session dashboard.</p>
      </header>

      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Email</span>
        <input
          type="email"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="space-y-2 text-sm">
        <span className="text-slate-400">Password</span>
        <input
          type="password"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
