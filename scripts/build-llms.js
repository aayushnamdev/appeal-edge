#!/usr/bin/env node
// Regenerates public/llms.txt and public/llms-full.txt from the pages on disk,
// using the same indexable page rules as scripts/build-sitemap.js (noindex pages
// and test pages are skipped). Every published page is listed, grouped by topic.
//
//   llms.txt       short: one line per page (title and meta description)
//   llms-full.txt  long: per page URL, topic, dates, description and H2 outline
//
// Usage:
//   node scripts/build-llms.js            (dry run, prints sizes)
//   node scripts/build-llms.js --write

const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'frontend-v2');
const OUT = path.join(__dirname, '..', 'public');
const BASE = 'https://www.appeal-edge.com';
const SKIP_DIRS = new Set(['scroll-hero-test', 'thank-you', 'experts']);

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&middot;': '·', '&rsquo;': "'", '&lsquo;': "'" };
const dec = (s) => s.replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] || m).replace(/\s+/g, ' ').trim();

const SERVICE_SLUGS = ['amazon-appeal-service', 'amazon-plan-of-action-writing-service', 'amazon-ip-complaint-removal-service', 'amazon-appeal-service-india'];
const COMPANY_SLUGS = ['about', 'privacy-policy', 'terms'];

const TOPICS = [
  ['Plan of Action', /plan-of-action/],
  ['IP, trademark and copyright complaints', /ip-complaint|trademark|copyright/],
  ['Related account suspensions', /related-account/],
  ['Dropshipping and seller of record', /dropship|seller-of-record|packing-slip/],
  ['Inauthentic complaints and documents', /inauthentic|commingl|stickerless|invoice|supplier|forged|evidence-documents/],
  ['Performance metrics and policy violations', /odr|order-defect|valid-tracking|account-health|velocity|fair-pricing|review-manipulation|used-sold-as-new|restricted-products|section-3/],
  ['Appeal process, timelines and costs', /.*/],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(full, out); }
    else if (e.name === 'index.html') out.push(full);
  }
  return out;
}

function readPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots"[^>]*noindex/i.test(html)) return null;
  const rel = path.relative(SITE, path.dirname(file)).split(path.sep).join('/');
  const title = dec((html.match(/<title>([\s\S]*?)<\/title>/) || [, rel])[1]).replace(/\s*\|\s*Appeal Edge$/, '');
  const desc = dec((html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]);
  const pub = (html.match(/<meta property="article:published_time" content="([^"]*)"/) || [, ''])[1].slice(0, 10);
  const mod = (html.match(/<meta property="article:modified_time" content="([^"]*)"/) || [, ''])[1].slice(0, 10);
  const prose = (html.match(/<div class="prose">([\s\S]*?)<div class="post-nav">/) || [, ''])[1] || html;
  const h2 = [...prose.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => dec(m[1].replace(/<[^>]+>/g, ''))).filter(Boolean);
  return { rel, url: `${BASE}/${rel ? rel + '/' : ''}`, title, desc, pub, mod, h2, isPost: rel.startsWith('blog/') && rel !== 'blog' };
}

function topicOf(rel) {
  const slug = rel.replace(/^blog\//, '');
  return TOPICS.find(([, re]) => re.test(slug))[0];
}

function build() {
  const pages = walk(SITE).map(readPage).filter(Boolean);
  const bySlug = (s) => pages.find((p) => p.rel === s);
  const services = SERVICE_SLUGS.map(bySlug).filter(Boolean);
  const company = COMPANY_SLUGS.map(bySlug).filter(Boolean);
  const posts = pages.filter((p) => p.isPost).sort((a, b) => (b.pub || '').localeCompare(a.pub || ''));
  const groups = TOPICS.map(([name]) => [name, posts.filter((p) => topicOf(p.rel) === name)]).filter(([, l]) => l.length);

  const head = `# Appeal Edge

> Independent Amazon seller suspension appeal consultancy. Every case is read by a specialist from a panel with more than 20 years of combined Amazon experience. Cases are reviewed individually and pricing is provided after that review, not published as a fixed rate.

## Key Facts
- Appeal Edge is run by three founders: Khushi Narwal (COO), Apeksha Namdev (CEO), and Aayush Namdev (CTO), with Likith as Head of Operations
- 300+ suspended accounts reinstated
- Regions served: US, UK, EU, Canada, Mexico, Australia and India
- Cases are worked by a panel of Amazon specialists with more than 20 years of combined experience, not named publicly since they work independently
- Every case is reviewed and assigned to the specialist who fits it. That same specialist stays in direct contact with you throughout
- Pricing is not published. Case review is free, and pricing is discussed only after the case is reviewed
- Not affiliated with, endorsed by, or sponsored by Amazon.com, Inc.
- Independent consultancy, not a law firm. Content is general guidance, not legal advice

## Suspension Types Covered
- Inauthentic and counterfeit complaints
- Performance metrics: Order Defect Rate, Late Shipment Rate, Valid Tracking Rate
- Intellectual property, trademark, and copyright complaints
- Related account suspensions
- Listing policy violations and restricted category issues
- Review manipulation suspicions
- Dropshipping policy violations
- Used sold as new and condition complaints

## How a case is handled
- Step 1: Review the suspension notice and identify the actual violation type and root cause
- Step 2: Cross reference the case against Amazon's current policy requirements
- Step 3: Draft a case specific Plan of Action naming the root cause, the corrective action already taken, and the preventive measures going forward
- Step 4: Check the draft for generic language, vague claims, and missing specifics before submission
`;
  const contact = `
## Contact
- Email: contact@appeal-edge.com
- WhatsApp: https://wa.me/919220560623
- Instagram: https://www.instagram.com/appeal.edge/
- LinkedIn: https://www.linkedin.com/company/appealedge/
- Case review: https://tally.so/r/Y5voaW
- Full page list with outlines: ${BASE}/llms-full.txt
`;

  const line = (p) => `- [${p.title}](${p.url})${p.desc ? ': ' + p.desc : ''}`;
  let short = head + '\n## Services\n' + services.map(line).join('\n') + '\n';
  short += '\n## Company\n' + company.map(line).join('\n') + '\n';
  short += `\n## Blog\n- [Appeal Edge Blog](${BASE}/blog/): Guides on Amazon suspension types and how to appeal them\n`;
  for (const [name, list] of groups) short += `\n### ${name}\n` + list.map(line).join('\n') + '\n';
  short += contact;

  const full = (p, topic) => {
    let s = `### ${p.title}\n- URL: ${p.url}\n`;
    if (topic) s += `- Topic: ${topic}\n`;
    if (p.pub) s += `- Published: ${p.pub}${p.mod && p.mod !== p.pub ? ', updated ' + p.mod : ''}\n`;
    if (p.desc) s += `- Summary: ${p.desc}\n`;
    if (p.h2.length) s += `- Sections: ${p.h2.join(' / ')}\n`;
    return s;
  };
  let long = head + '\n## Services\n' + services.map((p) => full(p)).join('\n') + '\n## Company\n' + company.map((p) => full(p)).join('\n');
  long += '\n## Blog\n';
  for (const [name, list] of groups) long += `\n## ${name}\n\n` + list.map((p) => full(p, name)).join('\n');
  long += contact;
  return { short, long, count: pages.length };
}

function main() {
  const write = process.argv.includes('--write');
  const { short, long, count } = build();
  console.log(`${count} indexable pages. llms.txt ${short.length} bytes, llms-full.txt ${long.length} bytes.`);
  if (write) {
    fs.writeFileSync(path.join(OUT, 'llms.txt'), short, 'utf8');
    fs.writeFileSync(path.join(OUT, 'llms-full.txt'), long, 'utf8');
    console.log('Written.');
  } else console.log('Dry run only. Re-run with --write to apply.');
}

main();
