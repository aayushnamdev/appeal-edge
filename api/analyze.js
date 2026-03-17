const express = require('express');
const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');
const { SYSTEM_PROMPT } = require('./prompts');
const { extractText } = require('./fileExtract');

const router = express.Router();

// Rate limiting: 5 requests per IP per hour
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 5;
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= limit;
}

// Multer: store uploads in OS temp dir
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.eml'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error(`File type ${ext} not supported`));
  },
});

let openai;
function getOpenAI() {
  if (!openai) openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.XAI_BASE_URL || 'https://api.x.ai/v1',
  });
  return openai;
}

async function callOpenAI(combinedText) {
  const response = await getOpenAI().chat.completions.create({
    model: 'grok-4-1-fast-reasoning',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this Amazon suspension notice:\n\n${combinedText.slice(0, 8000)}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 1500,
  });
  return response.choices[0].message.content;
}

router.post('/', upload.array('files', 5), async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again in an hour.' });
  }

  const uploadedFiles = req.files || [];
  const noticeText = (req.body.noticeText || '').trim();

  // Cleanup helper
  const cleanup = () => {
    uploadedFiles.forEach(f => {
      try { fs.unlinkSync(f.path); } catch {}
    });
  };

  try {
    // Extract text from all sources
    const parts = [];
    if (noticeText) parts.push(noticeText);

    for (const file of uploadedFiles) {
      try {
        const extracted = await extractText(file.path, file.originalname, file.mimetype);
        if (extracted && extracted.trim()) parts.push(extracted.trim());
      } catch (err) {
        console.error(`Failed to extract ${file.originalname}:`, err.message);
      }
    }

    const combinedText = parts.join('\n\n---\n\n');

    if (combinedText.length < 30) {
      cleanup();
      return res.status(400).json({ error: 'Please paste your suspension notice or upload a file to analyze.' });
    }

    // Call OpenAI with one retry on parse failure
    let result;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callOpenAI(combinedText);
        result = JSON.parse(raw);
        break;
      } catch (err) {
        if (attempt === 1) throw new Error('Failed to parse AI response after retry.');
      }
    }

    cleanup();

    if (!result || !result.caseTypeId) {
      return res.status(500).json({ error: 'Unexpected response from AI. Please try again.' });
    }

    return res.json(result);
  } catch (err) {
    cleanup();
    console.error('Analyze error:', err.message);

    if (err.message.includes('API key')) {
      return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
    }
    if (err.status === 429) {
      return res.status(503).json({ error: 'AI service temporarily busy. Please try again in a moment.' });
    }

    return res.status(500).json({ error: 'Analysis failed. Please try again or contact support.' });
  }
});

module.exports = router;
