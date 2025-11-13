'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="card">
        <p>Checking credentials…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="card">
        <p>Redirecting to login…</p>
      </main>
    );
  }

  return <>{children}</>;
}
