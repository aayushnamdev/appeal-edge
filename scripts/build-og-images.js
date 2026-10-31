#!/usr/bin/env node
// Builds one 1200x630 og:image per blog post from templates/og-image.html and
// points each post's og:image, twitter:image and BlogPosting image at it.
// Output: frontend-v2/assets/og/<slug>.jpg (JPEG keeps each file small)
//
// Needs Google Chrome (set CHROME=/path/to/chrome to override the macOS default).
// Chrome is driven over the DevTools protocol with Node's built in WebSocket,
// so there is no npm dependency.
//
// Usage:
//   node scripts/build-og-images.js                 (dry run: lists what it would do)
//   node scripts/build-og-images.js --write         (render images and update posts)
//   node scripts/build-og-images.js --write <slug>  (one post only)

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'frontend-v2');
const BLOG = path.join(SITE, 'blog');
const OUT_DIR = path.join(SITE, 'assets', 'og');
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'templates', 'og-image.html'), 'utf8');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://www.appeal-edge.com';
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const dec = (s) => s.replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] || m).trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function posts(only) {
  return fs.readdirSync(BLOG, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(BLOG, d.name, 'index.html')) && (!only || d.name === only))
    .map((d) => {
      const file = path.join(BLOG, d.name, 'index.html');
      const html = fs.readFileSync(file, 'utf8');
      const title = dec((html.match(/<title>([\s\S]*?)<\/title>/) || [, d.name])[1]).replace(/\s*\|\s*Appeal Edge$/, '');
      const tag = dec((html.match(/<span class="post-tag">([\s\S]*?)<\/span>/) || [, 'Guides'])[1]);
      return { slug: d.name, file, html, title, tag };
    });
}

const fill = (tpl, vars) => Object.keys(vars).reduce((t, k) => t.split('{{' + k + '}}').join(String(vars[k])), tpl);
const sizeFor = (t) => (t.length <= 38 ? 76 : t.length <= 52 ? 68 : 60);

async function openChrome() {
  const port = 9400 + Math.floor(Math.random() * 400);
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-og-'));
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 60; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch (e) {}
    await sleep(250);
  }
  if (!targets) throw new Error('Could not start Chrome at ' + CHROME);
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = {};
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable');
  return { send, close: () => { ws.close(); proc.kill(); } };
}

async function main() {
  const write = process.argv.includes('--write');
  const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
  const list = posts(only);
  console.log(`${list.length} posts.`);
  if (!write) { console.log('Dry run only. Re-run with --write to render and wire.'); return; }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-og-html-'));
  const chrome = await openChrome();
  try {
    for (const p of list) {
      const page = fill(TEMPLATE, { SITE, TAG: esc(p.tag), TITLE: esc(p.title), SIZE: sizeFor(p.title) });
      const tmpFile = path.join(tmp, p.slug + '.html');
      fs.writeFileSync(tmpFile, page);
      await chrome.send('Page.navigate', { url: 'file://' + tmpFile });
      await sleep(700);
      await chrome.send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => 1)', awaitPromise: true });
      const shot = await chrome.send('Page.captureScreenshot', { format: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
      fs.writeFileSync(path.join(OUT_DIR, p.slug + '.jpg'), Buffer.from(shot.result.data, 'base64'));

      // wire the post
      const url = `${BASE}/assets/og/${p.slug}.jpg`;
      let html = p.html;
      html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${url}$2`);
      html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${url}$2`);
      html = html.split(`"image": "${BASE}/og-image.png"`).join(`"image": "${url}"`);
      html = html.split(`${BASE}/assets/og/${p.slug}.png`).join(url);
      if (html !== p.html) fs.writeFileSync(p.file, html, 'utf8');
      console.log('  ' + p.slug);
    }
  } finally { chrome.close(); }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
