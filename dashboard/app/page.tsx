"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_LOCAL_API_BASE || "http://localhost:3001";

type FileItem = {
  filename: string;
  url: string;
  size: number;
  mtime: number;
  folder: string;
  patientName: string;
  patientId: string;
  patientNumber: number | null;
};

export default function SinglePageDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"date" | "name" | "number">("date");
  const [query, setQuery] = useState("");
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (t) setToken(t);
    if (u) setDisplayName(u);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`Login failed (${res.status})`);
      const json = await res.json();
      localStorage.setItem("token", json.token);
      localStorage.setItem("username", json.username || username);
      setToken(json.token);
      setDisplayName(json.username || username);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function logout() {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      }
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setDisplayName(null);
    setFiles([]);
  }

  async function fetchFiles(signal?: AbortSignal) {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/files?sort=${sort}&query=${encodeURIComponent(query)}` , {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        throw new Error('Session expired. Please login again.');
      }
      if (!res.ok) throw new Error(`Fetch files failed (${res.status})`);
      const json = await res.json();
      setFiles(json.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    fetchFiles(ac.signal);
    // Poll every 3s
    const t = setInterval(() => fetchFiles(ac.signal), 3000);
    return () => { ac.abort(); clearInterval(t); };
  }, [token, sort, query]);

  type Group = {
    key: string;
    patientName: string;
    patientId: string;
    patientNumber: number | null;
    latestMtime: number;
    items: FileItem[];
  };

  const groups = useMemo(() => {
    // group by folder ("name_id")
    const map = new Map<string, Group>();
    for (const f of files) {
      const g = map.get(f.folder) || {
        key: f.folder,
        patientName: f.patientName,
        patientId: f.patientId,
        patientNumber: f.patientNumber ?? null,
        latestMtime: 0,
        items: [],
      };
      g.items.push(f);
      g.latestMtime = Math.max(g.latestMtime, f.mtime || 0);
      map.set(f.folder, g);
    }

    // optional filter using current query (already applied server-side, but keep UI-side too)
    let arr = Array.from(map.values());
    const ql = (query || '').toLowerCase();
    if (ql) {
      arr = arr.filter((g) =>
        g.patientName.toLowerCase().includes(ql) ||
        g.patientId.toLowerCase().includes(ql) ||
        g.items.some((it) => it.filename.toLowerCase().includes(ql))
      );
    }

    // sort groups by selected mode
    if (sort === 'name') {
      arr.sort((a, b) => a.patientName.localeCompare(b.patientName));
    } else if (sort === 'number') {
      arr.sort((a, b) => (a.patientNumber || 0) - (b.patientNumber || 0));
    } else {
      // date: newest group (by latest file) first
      arr.sort((a, b) => b.latestMtime - a.latestMtime);
    }

    // sort files inside each group by date (newest first)
    for (const g of arr) {
      g.items.sort((a, b) => b.mtime - a.mtime);
    }

    return arr;
  }, [files, sort, query]);

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 className="text-lg font-semibold text-white">Login</h1>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <button type="submit" className="w-full rounded bg-cyan-600 px-3 py-2 font-semibold text-white hover:bg-cyan-500">Sign in</button>
          <p className="text-xs text-slate-500">Default: admin / admin</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-end gap-2">
          {displayName && (
            <span className="text-xs text-slate-400">Signed in as {displayName}</span>
          )}
          <button onClick={logout} className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500">Logout</button>
        </div>
        <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold text-white">Docsquare Files</h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              placeholder="Search by name, ID, filename..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-72 rounded bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="date">Sort: Date (newest)</option>
              <option value="name">Sort: Patient Name (A→Z)</option>
              <option value="number">Sort: Numeric ID</option>
            </select>
            <button onClick={() => fetchFiles()} className="rounded bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700">Refresh</button>
          </div>
        </header>

        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {!loading && groups.length === 0 && (
          <p className="text-sm text-slate-400">No files found.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.key} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <header className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-white">{g.patientName}</h2>
                  <p className="text-xs text-slate-400">ID: {g.patientId || '—'} · {g.items.length} file(s)</p>
                </div>
                <span className="text-xs text-slate-500">Updated {g.latestMtime ? new Date(g.latestMtime).toLocaleString() : '—'}</span>
              </header>
              <ul className="space-y-2">
                {g.items.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <a href={`${API_BASE}${f.url}`} target="_blank" rel="noreferrer" className="flex-1 truncate text-sm text-cyan-300 hover:underline">
                      {f.filename}
                    </a>
                    <span className="text-xs text-slate-500">{new Date(f.mtime).toLocaleDateString()} · {(f.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
