'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/SignInForm';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';

export default function SignInPage() {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-lg space-y-6">
        <SignInForm />
        <div className="text-center text-sm text-slate-500">
          Need access?{' '}
          <Link href="/signup" className="text-cyan-300 hover:text-cyan-200">
            Request an account
          </Link>
        </div>
      </div>
    </main>
  );
}
