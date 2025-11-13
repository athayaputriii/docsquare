# Firebase Integration Setup

## 1. Create Firebase resources
- In the Firebase console create/choose a project and enable Firestore (native mode). You can skip Cloud Storage for now since artifacts stay on the VPS.
- Under **Build → Authentication**, enable the sign-in providers you plan to use for the dashboard (email/password, Google, etc.).

## 2. Generate a service account
- Go to **Project Settings → Service Accounts → Generate new private key** and store the JSON securely (never commit it).
- Extract the following fields for environment variables:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (replace literal `\n` sequences with real newlines when pasting).
  - Optional: `FIREBASE_DATABASE_URL`, `FIREBASE_APP_NAME`.

## 3. Populate `.env`
```
ASSEMBLYAI_API_KEY=...
OPENROUTER_API_KEY=...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
FIREBASE_APP_NAME=docsquare-whatsapp
```
Keep `.env` private; the bot uses these variables through `config.js` and `firebaseAdmin.js`.

## 4. Verify the connection
- Run `node -e "import('./firebaseAdmin.js').then(({getFirestore}) => getFirestore().listCollections().then(cols => console.log(cols.map(c=>c.id))))"` to confirm the Admin SDK can authenticate.
- If you see credential errors, re-check that the private key retains newline characters and that the service account has Firestore + Storage permissions.
