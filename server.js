require('dotenv').config();
const express = require('express');
const path = require('path');
const analyzeRoute = require('./api/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https:",
  "frame-src https://www.youtube.com",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', CSP);
  next();
});

// Long, immutable cache for fonts/images; short cache for HTML so deploys show up promptly.
const staticCacheOptions = {
  setHeaders: (res, filePath) => {
    if (/\.(woff2?|ttf|otf|png|jpe?g|svg|webp|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.html$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  },
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), staticCacheOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticCacheOptions));

app.use('/api/analyze', analyzeRoute);

app.use(express.static(path.join(__dirname, 'frontend-v2'), staticCacheOptions));

app.use('/old', express.static(path.join(__dirname, 'frontend-trial')));

app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found | Appeal Edge</title>
<style>
  body { margin:0; min-height:100dvh; display:flex; align-items:center; justify-content:center;
    font-family:'Instrument Sans',system-ui,sans-serif; background:#FFFFFF; color:#1A2433; text-align:center; padding:24px; }
  .box { max-width:440px; }
  h1 { font-family:'Archivo',sans-serif; font-weight:800; text-transform:uppercase; font-size:28px; color:#0A2540; margin:0 0 12px; }
  p { color:#5B6675; margin:0 0 24px; }
  a { display:inline-block; background:#2B50FF; color:#FFFFFF; text-decoration:none; font-weight:600;
    padding:12px 24px; border-radius:12px; }
  a:hover { background:#1E3AE0; }
</style>
</head>
<body>
  <div class="box">
    <h1>Page not found.</h1>
    <p>This page doesn't exist or has moved.</p>
    <a href="/">Back to Appeal Edge</a>
  </div>
</body>
</html>`);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Appeal Edge running at http://localhost:${PORT}`);
  });
}

module.exports = app;
