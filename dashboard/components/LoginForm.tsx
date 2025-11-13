'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1 style={{ marginBottom: '1rem' }}>Sign in</h1>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <span style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--muted)' }}>
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <span style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--muted)' }}>
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
      </label>

      {error && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>}

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '12px',
  border: '1px solid var(--card-border)',
  background: 'rgba(15, 23, 42, 0.6)',
  color: 'var(--foreground)',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem',
  borderRadius: '999px',
  border: 'none',
  background: 'linear-gradient(120deg, #22d3ee, #818cf8)',
  color: '#0f172a',
  fontWeight: 600,
  cursor: 'pointer',
};
