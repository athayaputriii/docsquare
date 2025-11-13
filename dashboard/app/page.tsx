'use client';

import AuthGate from '@/components/AuthGate';
import SessionList from '@/components/SessionList';

export default function DashboardPage() {
  return (
    <AuthGate>
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Session Overview</h1>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
              Live feed of WhatsApp consultations flowing through the DocSquare bot.
            </p>
          </div>
        </div>

        <SessionList />
      </main>
    </AuthGate>
  );
}
