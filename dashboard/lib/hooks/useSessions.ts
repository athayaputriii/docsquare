'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/client';
import type { SessionDoc } from '../types';

const USE_LOCAL = (process.env.NEXT_PUBLIC_USE_LOCAL_DB || 'true') === 'true';
const LOCAL_API_BASE = process.env.NEXT_PUBLIC_LOCAL_API_BASE || 'http://localhost:3001';

export function useSessions(limitDocs = 50) {
  const [sessions, setSessions] = useState<SessionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_LOCAL) {
      let timer: any;
      async function fetchOnce() {
        try {
          const res = await fetch(`${LOCAL_API_BASE}/api/sessions?limit=${limitDocs}`);
          const json = await res.json();
          setSessions(json.data || []);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch local sessions:', e);
        } finally {
          setLoading(false);
        }
      }
      fetchOnce();
      timer = setInterval(fetchOnce, 2000);
      return () => clearInterval(timer);
    } else {
      const db = getFirestoreDb();
      if (!db) {
        setLoading(false);
        return;
      }
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, orderBy('updatedAt', 'desc'), fbLimit(limitDocs));
      const unsub = onSnapshot(q, (snap) => {
        const payload = snap.docs.map((doc) => ({
          ...(doc.data() as SessionDoc),
          sessionId: doc.id,
        }));
        setSessions(payload);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [limitDocs]);

  return { sessions, loading };
}
