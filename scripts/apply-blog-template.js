#!/usr/bin/env node
// Moves /blog/ and every blog post onto the shared stylesheet
// (frontend-v2/css/ae-blog.css) and the shared nav, so the blog matches the
// homepage. Idempotent: pages already on the shared stylesheet are skipped.
//
// What it changes on each page:
//   1. Replaces the ~150 line inline <style> with a <link> to ae-blog.css plus
//      a small inline <style> holding only the social rail and WhatsApp button
//      (CLAUDE.md: every page carries the .social-rail block inline).
//   2. Replaces the header and the inline menu script with the homepage nav
//      markup and /js/ae-nav.js.
//   3. Adds the "not legal advice" line to the footer legal paragraph and,
//      on posts, a visible disclaimer before the "Back to the blog" link.
// Article body, schema and meta are not touched.
//
// Usage:
//   node scripts/apply-blog-template.js            (dry run)
//   node scripts/apply-blog-template.js --write

const fs = require('fs');
const path = require('path');

const BLOG_ROOT = path.join(__dirname, '..', 'frontend-v2', 'blog');
const CSS_VERSION = '20261031';

const DISCLAIMER_SHORT = 'Appeal Edge is not a law firm. This is general guidance, not legal advice.';

const INLINE_STYLE = `<link rel="stylesheet" href="/css/ae-blog.css?v=${CSS_VERSION}">
<style>
  .wa-fab { position: fixed; right: 22px; bottom: 22px; z-index: 40; width: 56px; height: 56px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: var(--e3); transition: transform .15s ease, box-shadow .15s ease; }
  .wa-fab:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(10,37,64,.2); }
  .wa-fab:active { transform: translateY(0) scale(.96); }
  .wa-fab svg { width: 30px; height: 30px; fill: #fff; }
  /* ---------- Persistent social rail ---------- */
  .social-rail {
    position: fixed; top: 50%; right: 20px; transform: translateY(-50%); z-index: 39;
    display: flex; flex-direction: column; gap: 8px; background: var(--white);
    border: 1px solid var(--line); border-radius: 999px; padding: 10px 7px; box-shadow: var(--e2);
  }
  .social-rail a {
    width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: var(--navy); transition: background .15s ease, color .15s ease, transform .15s ease;
  }
  .social-rail a:hover { background: var(--blue); color: #fff; transform: translateY(-2px); }
  .social-rail svg { width: 16px; height: 16px; fill: currentColor; }
  @media (max-width: 900px) { .social-rail { display: none; } }
</style>`;

function header(navLinksHtml) {
  return `<header class="nav" id="nav">
  <div class="nav-inner">
    <a class="brand" href="/" aria-label="Appeal Edge home"><img class="brand-logo" src="/assets/logo/appeal-edge-logo.png" alt="Appeal Edge" width="400" height="135"></a>
    <nav aria-label="Main" style="display:contents">
      ${navLinksHtml}
    </nav>
    <a class="btn btn-blue nav-cta" data-cta href="https://tally.so/r/Y5voaW" target="_blank" rel="noopener">Get your case reviewed</a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links-list"><span></span></button>
  </div>
</header>
<script defer src="/js/ae-nav.js"></script>`;
}

const MOBILE_CTA_LI = `        <li class="nav-cta-mobile"><a class="btn btn-blue" data-cta href="https://tally.so/r/Y5voaW" target="_blank" rel="noopener">Get your case reviewed</a></li>\n`;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name === 'index.html') out.push(full);
  }
  return out;
}

function migrate(file) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('/css/ae-blog.css')) return { status: 'already' };
  const original = s;
  const isIndex = file === path.join(BLOG_ROOT, 'index.html');

  // 1. style
  const styles = s.match(/<style>[\s\S]*?<\/style>/g) || [];
  if (styles.length !== 1) return { status: 'skip: ' + styles.length + ' style blocks' };
  s = s.replace(styles[0], () => INLINE_STYLE);

  // 2. header + menu script
  const hm = s.match(/<header class="nav" id="nav">[\s\S]*?<\/header>\s*<script>[\s\S]*?<\/script>/);
  if (!hm || !hm[0].includes('nav-toggle')) return { status: 'skip: header not found' };
  const ul = hm[0].match(/<ul class="nav-links" id="nav-links-list">[\s\S]*?<\/ul>/);
  if (!ul) return { status: 'skip: nav list not found' };
  const ulWithCta = ul[0].replace(/\n\s*<\/ul>$/, '\n' + MOBILE_CTA_LI + '      </ul>');
  s = s.replace(hm[0], () => header(ulWithCta));

  // 3. disclaimer in footer legal
  if (!s.includes(DISCLAIMER_SHORT)) {
    const marker = 'sponsored by Amazon.';
    const i = s.indexOf(marker, s.indexOf('class="footer-legal"'));
    if (i === -1) return { status: 'skip: footer legal marker not found' };
    s = s.slice(0, i + marker.length) + ' ' + DISCLAIMER_SHORT + s.slice(i + marker.length);
  }
  if (!isIndex && !s.includes('class="post-disclaimer"')) {
    if (!s.includes('<div class="post-nav">')) return { status: 'skip: post-nav not found' };
    s = s.replace('<div class="post-nav">', () => `<p class="post-disclaimer">${DISCLAIMER_SHORT} Every account and every notice is different, and outcomes depend on Amazon's review.</p>\n\n    <div class="post-nav">`);
  }
  return { status: 'changed', out: s, changed: s !== original };
}

function main() {
  const write = process.argv.includes('--write');
  const counts = {};
  for (const file of walk(BLOG_ROOT)) {
    const r = migrate(file);
    counts[r.status] = (counts[r.status] || 0) + 1;
    const rel = path.relative(BLOG_ROOT, file);
    if (r.status.startsWith('skip')) console.log(`  [${r.status}] ${rel}`);
    if (r.status === 'changed' && write) fs.writeFileSync(file, r.out, 'utf8');
  }
  console.log(counts);
  if (!write) console.log('Dry run only. Re-run with --write to apply.');
}

main();
