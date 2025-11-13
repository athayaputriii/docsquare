'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export type SessionDoc = {
  sessionId: string;
  userPhone: string;
  status: string;
  patient?: { name?: string; id?: string };
  transcriptText?: string;
  reportText?: string;
  summary?: string;
  lastMessageAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

type Options = {
  onlyActive?: boolean;
  limitDocs?: number;
};

export function useSessions(options: Options = {}) {
  const { onlyActive = false, limitDocs = 25 } = options;
  const [sessions, setSessions] = useState<SessionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionsRef = collection(db, 'sessions');
    const constraints = [orderBy('updatedAt', 'desc'), limit(limitDocs)];

    if (onlyActive) {
      constraints.unshift(where('status', 'in', ['transcribing', 'report_generating']));
    }

    const q = query(sessionsRef, ...constraints);

    const unsub = onSnapshot(q, (snap) => {
      const payload: SessionDoc[] = snap.docs.map((doc) => ({
        ...(doc.data() as SessionDoc),
        sessionId: doc.id,
      }));
      setSessions(payload);
      setLoading(false);
    });

    return () => unsub();
  }, [onlyActive, limitDocs]);

  return { sessions, loading };
}
