// config.js
import dotenv from 'dotenv';
dotenv.config();

console.log('--- LOADING CONFIG ---');
console.log('ASSEMBLYAI_API_KEY (first 5 chars):', process.env.ASSEMBLYAI_API_KEY ? process.env.ASSEMBLYAI_API_KEY.substring(0, 5) : 'NOT FOUND');
console.log('OPENROUTER_API_KEY (first 10 chars):', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) : 'NOT FOUND');
console.log('------------------------');

export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// These are no longer needed, but keep them if you want
// export const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
// export const WA_PHONE_ID = process.env.WA_PHONE_ID;
// ...etc

export const TEMP_DIR = process.env.TEMP_DIR || 'data/audio';
export const REPORT_DIR = process.env.REPORT_DIR || 'data/reports';