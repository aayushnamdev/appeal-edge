const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

let openai;
function getOpenAI() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

async function extractText(filePath, originalName, mimetype) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const mimeType = mimetype || 'image/png';

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text: 'Extract all text from this image exactly as it appears. Return only the raw text, no commentary.',
          },
        ],
      }],
      max_tokens: 2000,
    });

    return response.choices[0].message.content || '';
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
