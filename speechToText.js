// speechToText.js
import { AssemblyAI } from 'assemblyai';
import fs from 'fs';
import { ASSEMBLYAI_API_KEY } from './config.js';

const client = new AssemblyAI({
  apiKey: ASSEMBLYAI_API_KEY,
});

export async function transcribeAudio(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }

  const config = {
    audio: filePath,
    speech_model: 'universal',
  };

  const transcript = await client.transcripts.transcribe(config);

  if (transcript.status === 'error') {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  return transcript.text;
}