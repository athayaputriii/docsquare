// langchainPipeline.js (No LangChain)

import OpenAI from "openai";
import { OPENROUTER_API_KEY } from "./config.js";

// --- SECTION HEADERS ---
const SECTIONS = [
  "Symptoms",
  "Diagnosis",
  "Prescription / Treatment Plan",
  "Doctor's Notes",
  "Assessment",
  "Plan",
  "Red Flags",
  "Disclaimer",
];

// --- PATTERNS TO REMOVE IDENTIFIERS ---
const _CENSOR_PATTERNS = [
  /^\s*(patient\s*name|nama\s*pasien)\s*[:=].*$/im,
  /^\s*(patient\s*id|id\s*pasien|mrn|rekam\s*medis)\s*[:=].*$/im,
  /^\s*(dob|tanggal\s*lahir|age|umur)\s*[:=].*$/im,
  /^\s*(date\s*of\s*consultation|tanggal\s*konsultasi)\s*[:=].*$/im,
  /^\s*(alamat|address|phone|telepon)\s*[:=].*$/im,
];

// --- TEXT CLEANUP HELPERS ---
function _strip_markdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.slice(3, -3).trim())
    .replace(/^\s*#+\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
}

function _strip_llm_special_tokens(text) {
  return text
    .replace(/[.\s]*<\s*[|｜]\s*[^|｜>]+?\s*[|｜]\s*>[.\s]*/g, "")
    .replace(/<\/?think>/gi, "");
}

function _censor_patient_lines(text) {
  const lines = text.split("\n").map((ln) => ln.trimEnd());
  return lines
    .filter((ln) => !_CENSOR_PATTERNS.some((p) => p.test(ln)))
    .join("\n")
    .trim();
}

function _ensure_section_order(text) {
  const escapeHeader = (h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\s*\\\/\\\s*/g, "\\s*\\/\\s*");

  const headerPatterns = SECTIONS.map((s) => ({
    canonical: s,
    regex: new RegExp(`^(${escapeHeader(s)})\\s*:?\\s*$`, "i"),
  }));

  const buckets = Object.fromEntries(SECTIONS.map((s) => [s, []]));
  let current = null;

  for (const rawLine of text.split("\n")) {
    const line = _strip_llm_special_tokens(rawLine.trim());
    if (!line) continue;

    const matchedHeader = headerPatterns.find((p) => p.regex.test(line));
    if (matchedHeader) {
      current = matchedHeader.canonical;
      continue;
    }

    if (!current) current = "Doctor's Notes";
    buckets[current].push(line);
  }

  const output = SECTIONS.flatMap((section) => {
    const content = buckets[section];
    const lines =
      content.length > 0
        ? content.map((ln) =>
            _strip_llm_special_tokens(ln).replace(/^[\-•]\s+/, "- ")
          )
        : ["- None reported."];

    return [section, ...lines, ""];
  });

  return output.join("\n").trim() + "\n";
}

// --- OPENROUTER CLIENT ---
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://docsquare.dev",
    "X-Title": "DocSquare Bot",
  },
});

// --- PROMPT TEMPLATE ---
const PROMPT_TEMPLATE = `
You are a professional medical scribe. Convert the doctor–patient consultation
into a concise, objective medical report. Follow these STRICT rules:

1) Output PLAIN TEXT only. Do NOT use Markdown (#, **, bullets like •). Bullets MUST be hyphens: "- ".
2) Use EXACTLY these section headers, each on its own line (no colon, no numbering):
   Symptoms
   Diagnosis
   Prescription / Treatment Plan
   Doctor's Notes
   Assessment
   Plan
   Red Flags
   Disclaimer
3) After each header, provide 1–8 short bullet points or brief lines. Keep it clinical and verifiable.
4) DO NOT include patient identifiers (name, ID/MRN, DOB/age, phone, address) or dates.
5) The Disclaimer section must be a single line about potential transcription errors and for clinical use only.

Transcript:
{transcript}
`;

// --- MAIN FUNCTION ---
export async function generateMedicalReport(transcribedText) {
  const prompt = PROMPT_TEMPLATE.replace("{transcript}", transcribedText);

  const completion = await openrouter.chat.completions.create({
    model: "google/gemma-3-12b-it:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const rawOutput = completion.choices[0].message.content;

  // Run the full cleanup + section normalization pipeline
  let cleaned = _strip_markdown(rawOutput);
  cleaned = _strip_llm_special_tokens(cleaned);
  cleaned = _censor_patient_lines(cleaned);
  const normalized = _ensure_section_order(cleaned);

  return normalized;
}
