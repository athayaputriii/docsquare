# DocSquare Dashboard

Realtime dashboard + marketing site for monitoring WhatsApp transcription sessions that the DocSquare bot processes.

## Getting started
1. Copy `.env.example` to `.env.local` and fill it with your Firebase **web** SDK keys (`NEXT_PUBLIC_*`). These come from Project Settings → General → Your apps → Web.
2. Install dependencies from the `dashboard/` folder:
   ```bash
   npm install
   ```
3. Run the Tailwind-powered Next.js dev server:
   ```bash
   npm run dev
   ```
4. Browse to `http://localhost:3000`. Unauthenticated users are redirected to `/signin`.

## Auth
- Enable email/password (or another provider) in Firebase Authentication.
- Create accounts via the Firebase console or an admin API.
- `AuthGate` (client component) watches `onAuthStateChanged` and protects dashboard routes such as `/` and `/account`.

## Styling + structure
- Tailwind CSS is configured via `tailwind.config.ts` + `postcss.config.mjs`; global styles live in `app/globals.css`.
- The project follows the requested folder layout (marketing pages under `app/`, UI primitives in `components/ui`, hooks/utilities under `lib/`).
- Marketing pages (`/about`, `/pricing`, `/contact`, etc.) currently render placeholder content so you can layer in copy/illustrations later.

## Firestore data model
- `sessions` collection: created/updated by the WhatsApp bot (`sessionId`, `patient`, `status`, `transcriptText`, `reportText`, summaries, timestamps).
- `reports` collection: optional detailed docs per report; hook up future drill-down pages here.

`useSessions` streams updates from Firestore and `SessionList` renders them; adjust those files if you change schema or add filters/pagination.
