const multer = require('multer');
const os = require('os');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');
const { SYSTEM_PROMPT, CASE_TYPES } = require('./prompts');
const { extractText } = require('./fileExtract');
const { sendLeadEmail } = require('./leadMailer');
const { logScan } = require('./scanLog');

// bodyParser disabled — multer handles multipart body parsing

// Rate limiting (in-memory per instance)
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 5;
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= limit;
}

// Multer: temp dir storage
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.eml'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error(`File type ${ext} not supported`));
  },
});

let openai;
function getOpenAI() {
  if (!openai) openai = new OpenAI({
    apiKey: (process.env.OPENAI_API_KEY || '').trim(),
    baseURL: (process.env.XAI_BASE_URL || 'https://api.x.ai/v1').trim(),
  });
  return openai;
}

async function callAI(combinedText, imageFiles = []) {
  const userContent = [];

  if (combinedText) {
    userContent.push({ type: 'text', text: `Analyze this Amazon suspension notice:\n\n${combinedText.slice(0, 8000)}` });
  }

  for (const file of imageFiles) {
    const base64 = fs.readFileSync(file.path).toString('base64');
    const mimeType = file.mimetype || 'image/png';
    userContent.push({ type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } });
  }

  if (!combinedText && imageFiles.length > 0) {
    userContent.push({ type: 'text', text: 'Analyze this Amazon suspension notice shown in the image(s).' });
  }

  const response = await getOpenAI().chat.completions.create({
    model: 'grok-4-1-fast-reasoning',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
    max_tokens: 1500,
  });
  return response.choices[0].message.content;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again in an hour.' });
  }

  // Parse multipart form
  try {
    await new Promise((resolve, reject) => {
      upload.array('files', 5)(req, res, err => err ? reject(err) : resolve());
    });
  } catch (err) {
    return res.status(400).json({ error: 'File upload failed: ' + err.message });
  }

  const uploadedFiles = req.files || [];
  const noticeText = (req.body?.noticeText || '').trim();
  const email = (req.body?.email || '').trim();
  const sourcePage = (req.body?.sourcePage || '').trim().slice(0, 200);

  const cleanup = () => uploadedFiles.forEach(f => { try { fs.unlinkSync(f.path); } catch {} });

  try {
    const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const imageFiles = uploadedFiles.filter(f => imageExts.includes(path.extname(f.originalname).toLowerCase()));
    const otherFiles = uploadedFiles.filter(f => !imageExts.includes(path.extname(f.originalname).toLowerCase()));

    const parts = [];
    if (noticeText) parts.push(noticeText);

    for (const file of otherFiles) {
      try {
        const extracted = await extractText(file.path, file.originalname, file.mimetype);
        if (extracted?.trim()) parts.push(extracted.trim());
      } catch (err) {
        console.error(`Extract failed for ${file.originalname}:`, err.message);
      }
    }

    const combinedText = parts.join('\n\n---\n\n');
    if (combinedText.length < 30 && imageFiles.length === 0) {
      cleanup();
      return res.status(400).json({ error: 'Please paste your suspension notice or upload a file to analyze.' });
    }

    let result;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callAI(combinedText, imageFiles);
        result = JSON.parse(raw);
        break;
      } catch {
        if (attempt === 1) throw new Error('Failed to parse AI response after retry.');
      }
    }

    cleanup();
    if (!result?.caseTypeId) return res.status(500).json({ error: 'Unexpected AI response. Please try again.' });
    // The model sometimes echoes the raw id (e.g. "inauthentic") instead of the
    // human readable label into caseType. Overriding it from the fixed CASE_TYPES
    // map makes the label on the page deterministic regardless of model drift.
    const known = CASE_TYPES[result.caseTypeId];
    if (known) result.caseType = known.label;

    // Every completed scan gets logged, email or not, so nothing scanned is
    // just thrown away. The Resend ping only fires when there's an email,
    // since that's the only case where following up is actually possible.
    logScan({
      email,
      caseType: result.caseType,
      caseTypeId: result.caseTypeId,
      synthesis: result.synthesis,
      sourcePage,
      hasFiles: uploadedFiles.length > 0,
      ip,
    });
    if (email) {
      sendLeadEmail(email, ip, `${result.caseType}\n\n${result.synthesis || noticeText}`);
    }

    return res.json(result);

  } catch (err) {
    cleanup();
    console.error('Analyze error:', err.message);
    if (err.message?.includes('API key')) return res.status(500).json({ error: 'Server configuration error.' });
    if (err.status === 429) return res.status(503).json({ error: 'AI service busy. Please try again in a moment.' });
    return res.status(500).json({ error: 'Analysis failed. Please try again or contact support.' });
  }
};
