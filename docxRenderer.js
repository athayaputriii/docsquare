import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
} from "docx";
import fs from "fs/promises";
import path from "path";

// --- 🔹 Regex Helpers ---
function _looks_like_patient_info(line) {
  const patterns = [
    /^\s*(patient\s*name|nama\s*pasien)\s*[:=]/i,
    /^\s*(patient\s*id|id\s*pasien|mrn|rekam\s*medis)\s*[:=]/i,
    /^\s*(dob|tanggal\s*lahir|age|umur)\s*[:=]/i,
    /^\s*(date\s*of\s*consultation|tanggal\s*konsultasi)\s*[:=]/i,
    /^\s*(alamat|address|phone|telepon)\s*[:=]/i,
  ];
  return patterns.some((p) => p.test(line));
}

const SECTION_ALIASES = {
  Symptoms: /symptoms?/i,
  Diagnosis: /(diagnosis|dx)/i,
  "Prescription / Treatment Plan":
    /(prescription|rx|treatment\s*\/?\s*plan|management\s*plan)/i,
  "Doctor's Notes": /(doctor'?s?\s*notes?|clinical\s*notes?)/i,
  Assessment: /(assessment|impression)/i,
  Plan: /plan(?:\s*of\s*care)?/i,
  "Red Flags": /(red\s*flags?|warning\s*signs?)/i,
  Disclaimer: /(disclaimer|note)/i,
};

function _canonical_section(line, sections) {
  if (!line) return null;

  let norm = line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/:$/, "")
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/");

  // Exact match first
  for (const s of sections) {
    const s_norm = s.toLowerCase().replace(/\s*\/\s*/g, "/");
    if (norm === s_norm) return s;
  }

  // Then fuzzy match via alias regex
  for (const [canonical, pat] of Object.entries(SECTION_ALIASES)) {
    if (pat.test(norm)) return canonical;
  }

  return null;
}

// --- 🔹 Table Builder ---
const MIN_ROWS = {
  Symptoms: 6,
  Diagnosis: 4,
  "Prescription / Treatment Plan": 8,
  "Doctor's Notes": 6,
  Assessment: 4,
  Plan: 5,
  "Red Flags": 4,
  Disclaimer: 3,
};

function createSectionTable(title, lines, minRows = 5) {
  const cleanLines = lines.map((ln) => ln.replace(/^[\-•]\s+/, "").trim());
  const totalRows = Math.max(minRows, cleanLines.length || 1);

  const headerCell = new TableCell({
    shading: { type: ShadingType.SOLID, color: "EDEDED" },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 24,
          }),
        ],
      }),
    ],
  });

  const contentCells = Array.from({ length: totalRows }, (_, i) => {
    return new TableCell({
      borders: {
        top: { style: BorderStyle.NIL },
        bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 16, color: "000000" },
      },
      verticalAlign: VerticalAlign.TOP,
      children: [
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun(cleanLines[i] || " ")],
        }),
      ],
    });
  });

  return new Table({
    width: { size: 9072, type: WidthType.DXA },
    columnWidths: [9072],
    rows: [new TableRow({ children: [headerCell] }), ...contentCells.map((c) => new TableRow({ children: [c] }))],
  });
}

// --- 🔹 Main Function ---
export async function saveTidyDocx({
  reportText,
  reportPath,
  authorName = "Doctor Square",
  patientName = "Unknown",
  patientId = "Unknown",
}) {
  // Extract consultation date from filename
  let consultationDate = "[Date not available]";
  const match = reportPath.match(/(\d{8})_\d{6}/);

  if (match) {
    try {
      const raw = match[1];
      const date = new Date(
        Number(raw.slice(0, 4)),
        Number(raw.slice(4, 6)) - 1,
        Number(raw.slice(6, 8))
      );
      consultationDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      // ignore parsing errors
    }
  }

  // --- Split into sections ---
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

  const buckets = Object.fromEntries(SECTIONS.map((s) => [s, []]));
  let current = null;

  for (const raw of reportText.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const section = _canonical_section(line, SECTIONS);
    if (section) {
      current = section;
      continue;
    }

    if (!current) current = "Doctor's Notes";
    if (_looks_like_patient_info(line)) continue;

    buckets[current].push(line);
  }

  // --- Compose DOCX contents ---
  const children = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: "Medical Consultation Report", bold: true, size: 36 })],
    })
  );

  // Header info
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: `Patient Name: ${patientName}` }),
        new TextRun({ text: `Patient ID: ${patientId}`, break: 1 }),
        new TextRun({ text: `Date of Consultation: ${consultationDate}`, break: 1 }),
        new TextRun({ text: `Generated by: ${authorName}`, break: 1 }),
      ],
    })
  );

  // Divider line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "─".repeat(60), size: 16 })],
    })
  );

  // Render sections
  for (const s of SECTIONS) {
    const content = buckets[s]?.length ? buckets[s] : ["- None reported."];
    const minRows = MIN_ROWS[s] ?? 5;

    children.push(createSectionTable(s, content, minRows));
    children.push(new Paragraph({ spacing: { after: 160 } })); // space between sections
  }

  // Build DOCX document
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 24, font: "Times New Roman" },
          paragraph: { spacing: { after: 80, line: 276 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              right: 1134,
              bottom: 1134,
              left: 1134,
            },
          },
        },
        children,
      },
    ],
  });

  // Save
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(reportPath, buffer);
}
