// index.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

import { TEMP_DIR, REPORT_DIR, TRANSCRIPT_DIR } from './config.js';
import { transcribeAudio } from './speechToText.js';
import { generateMedicalReport } from './langchainPipeline.js';
import { saveTidyDocx } from './docxRenderer.js';
import {
  createSessionRecord,
  updateSessionFields,
  setSessionStatus,
  createReportRecord,
  updateReportRecord,
  SessionStatus,
  ReportStatus,
} from './firebaseService.js';

// --- Ensure directories exist ---
fs.mkdirSync(TEMP_DIR, { recursive: true });
fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.mkdirSync(TRANSCRIPT_DIR, { recursive: true });

// --- Bot State ---
// { user_phone_id: { name, id, sessionId, reportId } }
const session_patients = {};

const createSessionId = (userPhone) => `${userPhone}-${Date.now()}`;
const createReportId = (sessionId) => `${sessionId}-report-${Date.now()}`;
const nowIso = () => new Date().toISOString();
const summarizeReport = (text) => {
  if (!text) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 300 ? `${clean.slice(0, 297)}...` : clean;
};

// --- Helper: Patient Info Parsing ---
function _parse_patient_info(text) {
  if (!text) return { name: null, pid: null };
  const t = text.trim();

  let name = null;
  const m1 = t.match(/(?:name|nama)\s*=\s*"([^"]+)"/i);
  const m2 = t.match(/(?:name|nama)\s*[:=]\s*"?([^\n";,]+?)"?\s*(?:$|[;,])/i);
  if (m1 && m1[1].trim()) {
    name = m1[1].trim();
  } else if (m2 && m2[1].trim()) {
    name = m2[1].trim();
  }

  let pid = null;
  const mid = t.match(/(?:patient\s*id|id\s*pasien|id)\s*[:=]\s*([A-Za-z0-9\-_]+)/i);
  if (mid && mid[1].trim()) {
    pid = mid[1].trim();
  }

  return { name, pid };
}

// --- WA Bot Setup ---
console.log('Starting client...');
const client = new Client({
  authStrategy: new LocalAuth(), // Saves session to .wwebjs_auth/
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('QR code received, scan with your phone:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  // Ignore messages from groups or status updates
  const chat = await message.getChat();
  if (chat.isGroup || message.fromMe || !message.from) {
     return;
  }

  const user_phone = message.from; // This is the unique ID, e.g. "62812345678@c.us"
  
  try {
    // --- 1. Check for Text (Patient Info) ---
    if (message.body && !message.hasMedia) {
      const { name, pid } = _parse_patient_info(message.body);
      
      if (name && pid) {
        const sessionId = createSessionId(user_phone);
        session_patients[user_phone] = { name, id: pid, sessionId, reportId: null };

        await createSessionRecord({
          sessionId,
          userPhone: user_phone,
          patientName: name,
          patientId: pid,
          status: SessionStatus.WAITING_AUDIO,
        });

        await chat.sendMessage(
          `Patient info saved (one-time use).\n` +
          `- Name: *${name}*\n- ID: *${pid}*\n\n` +
          `Please send the audio file now.`
        );
      } else if (/name|nama|id|pasien/i.test(message.body)) {
         await chat.sendMessage(
          `Failed to parse info. Format:\n` +
          `*Name: "John Doe" ID: P-123*`
         );
      }
      return; // Done processing this message
    }

    // --- 2. Check for Audio ---
    if (message.hasMedia && (message.type === 'audio' || message.type === 'ptt')) {
      const patient = session_patients[user_phone];

      if (!patient) {
        await chat.sendMessage(
          `**Patient info is required before sending audio.**\n` +
          `Please send the patient's Name and ID first.`
        );
        return;
      }

      const sessionId = patient.sessionId || createSessionId(user_phone);
      session_patients[user_phone].sessionId = sessionId;
      await setSessionStatus(sessionId, SessionStatus.TRANSCRIBING, {
        lastMessageAt: nowIso(),
      });

      await chat.sendMessage(
        `Audio received.\n` +
        `Patient: *${patient.name}* | ID: *${patient.id}*\n` +
        `Transcribing... (this may take a moment)`
      );

      // 1. Download Audio
      const media = await message.downloadMedia();
      if (!media) {
        throw new Error('Failed to download media.');
      }

      const timestamp = new Date().strftime('%Y%m%d_%H%M%S');
      const safe_name = `${user_phone.split('@')[0]}_${timestamp}.ogg`;
      const audio_path = path.join(TEMP_DIR, safe_name);
      
      const buffer = Buffer.from(media.data, 'base64');
      fs.writeFileSync(audio_path, buffer);
      await updateSessionFields(sessionId, {
        lastAudioLocalPath: audio_path,
        lastAudioMimeType: media.mimetype || 'audio/ogg',
      });

      const reportId = patient.reportId || createReportId(sessionId);
      if (!patient.reportId) {
        patient.reportId = reportId;
        await createReportRecord({
          reportId,
          sessionId,
          status: ReportStatus.PENDING,
          transcriptPath: null,
          reportPath: null,
          transcriptText: null,
          reportText: null,
        });
      }
      
      // 2. Transcribe
      const transcript_text = await transcribeAudio(audio_path);
      
      const base = path.parse(safe_name).name;
      const transcript_path = path.join(TRANSCRIPT_DIR, `${base}.txt`);
      try {
        fs.writeFileSync(transcript_path, transcript_text, 'utf-8');
      } catch (e) {
        console.error('Failed to save transcript:', e);
        // Don't stop, just log the error
      }
      await setSessionStatus(sessionId, SessionStatus.REPORT_GENERATING, {
        transcriptLocalPath: transcript_path,
      });
      await updateReportRecord(patient.reportId, {
        status: ReportStatus.GENERATING,
        transcriptPath: transcript_path,
        transcriptText: transcript_text,
      });

      // 3. Generate Report
      await chat.sendMessage('Generating structured medical report...');
      const report_text = await generateMedicalReport(transcript_text);
      
      // 4. Save DOCX
      const report_docx_path = path.join(REPORT_DIR, `${base}.docx`);
      
      await saveTidyDocx({
          reportText: report_text,
          reportPath: report_docx_path,
          authorName: "WA Bot User", // wweb.js doesn't provide user's name
          patientName: patient.name,
          patientId: patient.id
      });

      await updateReportRecord(patient.reportId, {
        status: ReportStatus.COMPLETE,
        reportPath: report_docx_path,
        reportText: report_text,
        summary: summarizeReport(report_text),
      });
      await setSessionStatus(sessionId, SessionStatus.COMPLETE, {
        reportLocalPath: report_docx_path,
      });

      // 5. Send DOCX
      const reportMedia = MessageMedia.fromFilePath(report_docx_path);
      await chat.sendMessage(reportMedia, {
        caption: `Report generated successfully! (patient info cleared)`
      });

      // 6. Clean up
      delete session_patients[user_phone];
      // fs.unlinkSync(audio_path); // Optional: delete local files
      // fs.unlinkSync(report_docx_path);
    }

} catch (e) {
    console.error(`Error processing message for ${user_phone}:`, e);
    const patient = session_patients[user_phone];
    if (patient?.sessionId) {
      await setSessionStatus(patient.sessionId, SessionStatus.ERROR, {
        lastError: e.message,
      });
    }
    if (patient?.reportId) {
      await updateReportRecord(patient.reportId, {
        status: ReportStatus.ERROR,
        error: e.message,
      });
    }
    await chat.sendMessage(`An error occurred: ${e.message}`);
  }
});

// Helper for strftime
Date.prototype.strftime = function(format) {
    const date = this;
    return format.replace(/%[YmdHMS]/g, function(match) {
        switch (match) {
            case '%Y': return date.getFullYear();
            case '%m': return ('0' + (date.getMonth() + 1)).slice(-2);
            case '%d': return ('0' + date.getDate()).slice(-2);
            case '%H': return ('0' + date.getHours()).slice(-2);
            case '%M': return ('0' + date.getMinutes()).slice(-2);
            case '%S': return ('0' + date.getSeconds()).slice(-2);
        }
    });
};

client.initialize();
