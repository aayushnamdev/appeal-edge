// Logs every scan (whether or not an email was given) to a Google Sheet via
// a simple Apps Script Web App webhook, so nothing is thrown away silently.
// Mirrors the no-op-if-unconfigured pattern in leadMailer.js: if the webhook
// URL isn't set yet, this quietly does nothing rather than breaking the scan.
async function logScan({ email, caseType, caseTypeId, synthesis, sourcePage, hasFiles, ip }) {
  const url = process.env.SCAN_LOG_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: email || '',
        caseType: caseType || '',
        caseTypeId: caseTypeId || '',
        synthesis: synthesis || '',
        sourcePage: sourcePage || '',
        hasFiles: !!hasFiles,
        ip: ip || '',
      }),
    });
  } catch (err) {
    console.error('[SCAN_LOG] Failed to log scan:', err.message);
  }
}

module.exports = { logScan };
