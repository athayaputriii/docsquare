// config.js
import dotenv from 'dotenv';
dotenv.config();

console.log('--- LOADING CONFIG ---');
console.log('ASSEMBLYAI_API_KEY (first 5 chars):', process.env.ASSEMBLYAI_API_KEY ? process.env.ASSEMBLYAI_API_KEY.substring(0, 5) : 'NOT FOUND');
console.log('OPENROUTER_API_KEY (first 10 chars):', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) : 'NOT FOUND');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'NOT FOUND');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT FOUND');
console.log('------------------------');

export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;
export const FIREBASE_APP_NAME = process.env.FIREBASE_APP_NAME || 'docsquare-whatsapp';
export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

// These are no longer needed, but keep them if you want
// export const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
// export const WA_PHONE_ID = process.env.WA_PHONE_ID;
// ...etc

export const TEMP_DIR = process.env.TEMP_DIR || 'data/audio';
export const REPORT_DIR = process.env.REPORT_DIR || 'data/reports';
export const TRANSCRIPT_DIR = process.env.TRANSCRIPT_DIR || 'data/transcripts';

export const FIREBASE_CREDENTIALS_PRESENT =
  FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY ? true : false;
