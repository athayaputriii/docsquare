# DocSquare Dashboard

Realtime dashboard for monitoring WhatsApp transcription sessions that the DocSquare bot processes.

## Getting started
1. Copy `.env.example` to `.env.local` and fill it with your Firebase web app keys (from Project Settings → General → Web SDK config). Only `NEXT_PUBLIC_*` variables are needed.
2. Install dependencies:
   ```bash
   npm install
   ```
   (Run the command from the `dashboard` directory.)
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:3000`. If you are not already authenticated, the app will redirect you to `/login`.

## Auth
- Enable email/password sign-in (or any preferred provider) in Firebase Authentication.
- Create user accounts via the Firebase console or an admin script.
- The dashboard listens to auth changes client-side and redirects signed-in users to the root dashboard automatically.

## Firestore data model
- `sessions` collection: created/updated by the WhatsApp bot (`sessionId`, `patient`, `status`, `transcriptText`, `reportText`, etc.).
- `reports` collection: detailed documents for each report; future dashboard versions can fetch specific records for drill-down views.

The `SessionList` component currently reads directly from `sessions`, ordered by `updatedAt`. Update `hooks/useSessions.ts` if you change the schema or want filtering/pagination.
