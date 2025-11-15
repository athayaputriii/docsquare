'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthGate } from '@/components/auth/AuthGate';

export default function AccountPage() {
  return (
    <AuthGate>
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <h1 className="text-3xl font-semibold text-white">Account settings</h1>
        <p className="text-sm text-slate-400">Future configuration for notification rules, clinics, and API keys.</p>
      </main>
      <Footer />
    </AuthGate>
  );
}
