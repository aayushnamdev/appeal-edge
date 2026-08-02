const { sendLeadEmail } = require('./leadMailer');

// Lightweight lead capture for the scanner's "send me next steps" step.
// The scanner shows the case analysis first; this fires only once the user
// has already seen the result and chooses to leave an email. It does not
// re-run the AI classification (that already happened in /api/analyze),
// so it needs its own small rate limit rather than sharing analyze's.
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 10;
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= limit;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again in an hour.' });
  }

  const email = (req.body?.email || '').trim();
  const caseType = (req.body?.caseType || '').trim().slice(0, 120);
  const synthesis = (req.body?.synthesis || '').trim().slice(0, 500);

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const context = [caseType && `Case type: ${caseType}`, synthesis].filter(Boolean).join('\n\n');
  await sendLeadEmail(email, ip, context || 'Submitted after viewing scan results, no case context attached.');

  return res.json({ ok: true });
};
