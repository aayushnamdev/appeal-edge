#!/usr/bin/env node
// Per post GEO fixes from the 2026-10-31 audit (see GEO-AUDIT-2026-10-31.md).
//
//   - Posts still credited to "Appeal Edge" get Likith, Head of Operations as the
//     named author (visible byline and BlogPosting author). His Person node is
//     copied from the homepage graph so there is one definition of him.
//   - HowTo nodes are removed (Google no longer shows HowTo results).
//   - BlogPosting gets a speakable property.
//   - Where dateModified differs from datePublished and the byline does not
//     already say so, the byline gets "Updated <date>".
//   - /blog/amazon-seller-of-record-explained/ gets a seller of record title
//     (the old one competed with the dropshipping posts). Slug is unchanged.
//   - /blog/ cards for posts moved to Likith show his name.
//
// Usage:
//   node scripts/geo-oct-fixes.js            (dry run)
//   node scripts/geo-oct-fixes.js --write

const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'frontend-v2');
const BLOG = path.join(SITE, 'blog');
const LD = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const LIKITH = JSON.parse(home.match(LD)[2])['@graph'].find((n) => n['@id'] === 'https://www.appeal-edge.com/#likith');
if (!LIKITH) throw new Error('Likith node missing from the homepage graph. Run scripts/upgrade-org-schema.js --write first.');
const LIKITH_ID = LIKITH['@id'];

const SOR = {
  slug: 'amazon-seller-of-record-explained',
  oldTitle: 'Amazon Dropshipping Violation: How to Prove It',
  newTitle: 'Amazon Seller of Record: What It Means for You',
  oldH1: 'Got a dropshipping violation? It comes down to seller of record.',
  newH1: 'Seller of record explained: what Amazon checks and how to prove it.',
  oldDesc: 'Got a dropshipping policy violation? It almost always comes down to seller of record. Here is what Amazon checks and how to prove your business qualifies.',
  newDesc: 'Seller of record decides who Amazon holds responsible for an order. Here is what Amazon checks and how to prove your business qualifies.',
  oldTw: 'A dropshipping policy violation almost always comes down to one fact: whether your business is visibly the seller of record.',
  newTw: 'Seller of record decides who Amazon holds responsible for an order. Here is how it is checked and how to prove it.',
};

function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function fixPost(file, s, stats) {
  const m = s.match(LD);
  if (!m) return s;
  const data = JSON.parse(m[2]);
  const g = data['@graph'];
  const bp = g.find((n) => n['@type'] === 'BlogPosting' || n['@type'] === 'Article');
  if (!bp) return s;
  let html = s;
  let ldChanged = false;

  // 1. author
  const bylineRe = /<p class="byline"><strong>Appeal Edge<\/strong> &middot; /;
  if (bylineRe.test(html)) {
    html = html.replace(bylineRe, '<p class="byline"><strong>Likith</strong>, Head of Operations &middot; ');
    bp.author = { '@id': LIKITH_ID };
    if (!g.some((n) => n['@id'] === LIKITH_ID)) g.push(LIKITH);
    ldChanged = true;
    stats.author++;
  }

  // 2. HowTo
  const before = g.length;
  data['@graph'] = g.filter((n) => n['@type'] !== 'HowTo');
  if (data['@graph'].length !== before) { ldChanged = true; stats.howto++; }

  // 3. speakable
  if (!bp.speakable) {
    bp.speakable = { '@type': 'SpeakableSpecification', cssSelector: ['h1.article-title', '.prose p.lede-p'] };
    ldChanged = true;
    stats.speakable++;
  }

  // 4. Updated date
  if (bp.dateModified && bp.datePublished && bp.dateModified !== bp.datePublished) {
    const bm = html.match(/(<p class="byline">[\s\S]*?Published [A-Za-z]+ \d+, \d+)( &middot; \d+ min read)/);
    if (bm && !/<p class="byline">[^<]*(<strong>[^<]*<\/strong>)?[^<]*Updated /.test(bm[0])) {
      html = html.replace(bm[0], `${bm[1]} &middot; Updated ${longDate(bp.dateModified)}${bm[2]}`);
      stats.updated++;
    }
  }

  // 5. seller of record rewrite
  const isSor = path.basename(path.dirname(file)) === SOR.slug;
  if (isSor) {
    for (const [x, y] of [[SOR.oldTitle, SOR.newTitle], [SOR.oldH1, SOR.newH1], [SOR.oldDesc, SOR.newDesc], [SOR.oldTw, SOR.newTw]]) {
      html = html.split(x).join(y);
    }
    stats.sor++;
  }

  if (ldChanged || isSor) {
    let json = JSON.stringify(data, null, 2);
    if (isSor) json = json.split(SOR.oldTitle).join(SOR.newTitle).split(SOR.oldDesc).join(SOR.newDesc);
    const mm = html.match(LD);
    html = html.replace(mm[0], () => mm[1] + '\n' + json + '\n' + mm[3]);
  }
  return html;
}

function main() {
  const write = process.argv.includes('--write');
  const stats = { files: 0, author: 0, howto: 0, speakable: 0, updated: 0, sor: 0, cards: 0 };
  const likithSlugs = [];

  for (const dir of fs.readdirSync(BLOG, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const file = path.join(BLOG, dir.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const orig = fs.readFileSync(file, 'utf8');
    const next = fixPost(file, orig, stats);
    if (next !== orig) {
      stats.files++;
      if (/<p class="byline"><strong>Likith<\/strong>/.test(next) && !/<p class="byline"><strong>Likith<\/strong>/.test(orig)) likithSlugs.push(dir.name);
      if (write) fs.writeFileSync(file, next, 'utf8');
    }
  }

  // 6. cards on /blog/
  const idxFile = path.join(BLOG, 'index.html');
  let idx = fs.readFileSync(idxFile, 'utf8');
  for (const slug of likithSlugs) {
    const re = new RegExp(`(<a class="post-card" href="/blog/${slug}/">[\\s\\S]*?<p class="post-meta">)Appeal Edge( &middot;)`);
    if (re.test(idx)) { idx = idx.replace(re, '$1Likith$2'); stats.cards++; }
  }
  // seller of record card text
  idx = idx.split(SOR.oldTitle).join(SOR.newTitle).split(SOR.oldDesc).join(SOR.newDesc);
  if (write) fs.writeFileSync(idxFile, idx, 'utf8');

  console.log(stats);
  if (!write) console.log('Dry run only. Re-run with --write to apply.');
}

main();
