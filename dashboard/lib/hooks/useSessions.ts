'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/client';
import type { SessionDoc } from '../types';

export function useSessions(limitDocs = 50) {
  const [sessions, setSessions] = useState<SessionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'), limit(limitDocs));

    const unsub = onSnapshot(q, (snap) => {
      const payload = snap.docs.map((doc) => ({
        ...(doc.data() as SessionDoc),
        sessionId: doc.id,
      }));
      setSessions(payload);
      setLoading(false);
    });

    return () => unsub();
  }, [limitDocs]);

  return { sessions, loading };
}
