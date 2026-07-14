require('dotenv').config();
const express = require('express');
const path = require('path');
const analyzeRoute = require('./api/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/analyze', analyzeRoute);

app.use(express.static(path.join(__dirname, 'frontend-v2')));

app.use('/old', express.static(path.join(__dirname, 'frontend-trial')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-v2', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Appeal Edge running at http://localhost:${PORT}`);
  });
}

module.exports = app;
