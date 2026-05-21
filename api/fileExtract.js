const fs = require('fs');
const path = require('path');

// Images are handled directly as multimodal in analyze.js — no AI extraction needed here.
async function extractText(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (['.txt', '.eml', '.email', '.text'].includes(ext)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Fallback: try reading as text
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

module.exports = { extractText };
