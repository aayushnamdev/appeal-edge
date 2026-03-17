require('dotenv').config();
const express = require('express');
const path = require('path');
const analyzeRoute = require('./api/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/analyze', analyzeRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Appeal Edge running at http://localhost:${PORT}`);
  });
}

module.exports = app;
