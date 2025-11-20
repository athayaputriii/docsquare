// localApiServer.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENABLE_LOCAL_API, LOCAL_API_PORT, REPORT_DIR, TRANSCRIPT_DIR, DB_DIR } from './config.js';
import { listSessions, listReports } from './firebaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startLocalApiServer() {
  if (!ENABLE_LOCAL_API) return null;

  const app = express();
  // Simple CORS for local dev
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
  app.use(express.json());

  // ---- Simple local users store (plain JSON) ----
  const usersFile = path.join(DB_DIR, 'users.json');
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify({ admin: { password: 'admin' } }, null, 2), 'utf-8');
      console.log('[local-api] Created default user: admin/admin');
    }
  } catch (e) {
    console.error('[local-api] users.json init failed:', e.message);
  }
  const readUsers = () => {
    try { return JSON.parse(fs.readFileSync(usersFile, 'utf-8') || '{}'); } catch { return {}; }
  };
  const activeTokens = new Map(); // token -> username

  app.post('/api/login', (req, res) => {
    let { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    username = String(username).trim();
    password = String(password).trim();
    const users = readUsers();
    const lookup = Object.keys(users).reduce((acc, k) => {
      acc[k.toLowerCase()] = users[k];
      return acc;
    }, {});
    const user = lookup[username.toLowerCase()];
    if (!user || String(user.password) !== password) {
      console.warn(`[local-api] login failed for username='${username}'`);
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    activeTokens.set(token, username);
    console.log(`[local-api] login ok for '${username}'`);
    res.json({ token, username });
  });

  const requireAuth = (req, res, next) => {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token || !activeTokens.has(token)) return res.status(401).json({ error: 'unauthorized' });
    next();
  };

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/sessions', async (req, res) => {
    const limit = parseInt(req.query.limit || '50', 10);
    try {
      const sessions = await listSessions({ limit });
      const reports = await listReports({ limit: 500 });
      const latestBySession = new Map();
      for (const r of reports) {
        const key = r.sessionId;
        const existing = latestBySession.get(key);
        if (!existing) {
          latestBySession.set(key, r);
        } else {
          const t1 = new Date(r.updatedAt || r.createdAt || 0).getTime();
          const t2 = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
          if (t1 > t2) latestBySession.set(key, r);
        }
      }
      const enriched = sessions.map((s) => {
        const rep = latestBySession.get(s.sessionId);
        return rep
          ? { ...s, summary: rep.summary ?? null, transcriptText: rep.transcriptText ?? null, reportText: rep.reportText ?? null }
          : s;
      });
      res.json({ data: enriched });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---- Files listing ----
  app.get('/api/files', requireAuth, (req, res) => {
    const sort = String(req.query.sort || 'date'); // name|date|number
    const q = String(req.query.query || '').toLowerCase();
    try {
      const entries = [];
      const dirNames = fs.readdirSync(REPORT_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
      for (const d of dirNames) {
        const folder = d.name;
        const parts = folder.split(' - ');
        const patientName = parts[0] || folder;
        const patientId = parts[1] || '';
        const files = fs.readdirSync(path.join(REPORT_DIR, folder), { withFileTypes: true })
          .filter((f) => f.isFile() && f.name.toLowerCase().endsWith('.docx'))
          .map((f) => {
            const full = path.join(REPORT_DIR, folder, f.name);
            const stat = fs.statSync(full);
            const relUrl = `/files/reports/${encodeURIComponent(folder)}/${encodeURIComponent(f.name)}`;
            return {
              filename: f.name,
              url: relUrl,
              size: stat.size,
              mtime: stat.mtimeMs,
              folder,
              patientName,
              patientId,
              patientNumber: (patientId.match(/\d+/)?.[0] ? parseInt(patientId.match(/\d+/)[0], 10) : null),
            };
          });
        entries.push(...files);
      }
      let data = entries;
      if (q) {
        data = data.filter((x) =>
          x.filename.toLowerCase().includes(q) ||
          x.patientName.toLowerCase().includes(q) ||
          x.patientId.toLowerCase().includes(q)
        );
      }
      if (sort === 'name') {
        data.sort((a, b) => a.patientName.localeCompare(b.patientName));
      } else if (sort === 'number') {
        data.sort((a, b) => (a.patientNumber || 0) - (b.patientNumber || 0));
      } else {
        data.sort((a, b) => b.mtime - a.mtime); // date desc
      }
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve generated files for convenience
  app.use('/files/reports', express.static(REPORT_DIR));
  app.use('/files/transcripts', express.static(TRANSCRIPT_DIR));

  const server = app.listen(LOCAL_API_PORT, () => {
    console.log(`[local-api] Listening on http://localhost:${LOCAL_API_PORT}`);
  });
  return server;
}

// Allow running directly: `node localApiServer.js`
if (process.argv[1] === __filename) {
  startLocalApiServer();
}
