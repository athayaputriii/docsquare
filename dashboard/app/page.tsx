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

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
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
      setToken(json.token);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function fetchFiles(signal?: AbortSignal) {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/files?sort=${sort}&query=${encodeURIComponent(query)}` , {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
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

  const rows = useMemo(() => {
    return files;
  }, [files]);

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
        {!loading && rows.length === 0 && (
          <p className="text-sm text-slate-400">No files found.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((f, i) => (
            <a key={i} href={`${API_BASE}${f.url}`} target="_blank" rel="noreferrer" className="block rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-700">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{f.patientName}</p>
                <span className="text-xs text-slate-400">{new Date(f.mtime).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-400">ID: {f.patientId || '—'}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-200">{f.filename}</p>
              <p className="mt-1 text-xs text-slate-500">{(f.size / 1024).toFixed(1)} KB</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
