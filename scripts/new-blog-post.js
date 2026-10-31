#!/usr/bin/env node
// Creates a new blog post that matches the rest of the blog automatically.
//
//   node scripts/new-blog-post.js --example > my-post.json    (starter input)
//   node scripts/new-blog-post.js my-post.json                (dry run, validates only)
//   node scripts/new-blog-post.js my-post.json --write        (creates the post)
//
// It fills templates/blog-post.html (which uses /css/ae-blog.css, so the design
// follows the homepage), builds the JSON-LD from the homepage's Organization and
// author nodes, then runs: og image, blog schema sync, sitemap and llms files.
// It also adds the post's card to the top of /blog/.
//
// Site rules are checked before anything is written: title fits 60 characters
// with the brand suffix, no hyphens or dashes in visible copy, slug is new.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'frontend-v2');
const BASE = 'https://www.appeal-edge.com';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AUTHORS = {
  likith: { id: 'likith', name: 'Likith', role: 'Head of Operations' },
  'khushi-narwal': { id: 'khushi-narwal', name: 'Khushi Narwal', role: 'COO' },
  'apeksha-namdev': { id: 'apeksha-namdev', name: 'Apeksha Namdev', role: 'CEO' },
  'aayush-namdev': { id: 'aayush-namdev', name: 'Aayush Namdev', role: 'CTO' },
};

const EXAMPLE = {
  slug: 'amazon-example-post-slug',
  title: 'Short Title Under 47 Characters',
  description: 'One or two sentences, about 150 characters, that answer the search and earn the click.',
  tag: 'Appeal Strategy',
  keywords: ['Amazon appeal', 'Amazon suspension'],
  published: '2026-11-05',
  readMinutes: 6,
  author: 'likith',
  breadcrumb: 'Short Name',
  h1: 'The headline readers see, in sentence case.',
  dek: 'One sentence under the headline.',
  body: '<p class="lede-p">Opening paragraph.</p>\n\n<h2>First section</h2>\n<p>Text.</p>',
  faq: [{ q: 'A question a seller would ask?', a: 'A direct answer.' }],
  ctaHeading: 'Not sure where your case stands?',
  ctaText: 'Send us your suspension notice. We will tell you what it needs.',
  related: [{ href: '/blog/amazon-plan-of-action-template/', title: 'Amazon plan of action template' }],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const longDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const fill = (tpl, vars) => Object.keys(vars).reduce((t, k) => t.split('{{' + k + '}}').join(vars[k]), tpl);
const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');

function validate(p) {
  const errs = [];
  const need = ['slug', 'title', 'description', 'tag', 'published', 'readMinutes', 'breadcrumb', 'h1', 'dek', 'body', 'ctaHeading', 'ctaText'];
  for (const k of need) if (!p[k]) errs.push(`missing field: ${k}`);
  if (p.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errs.push('slug must be lowercase letters, numbers and hyphens');
  if (p.slug && fs.existsSync(path.join(SITE, 'blog', p.slug))) errs.push(`blog/${p.slug} already exists`);
  if (p.title && (p.title + ' | Appeal Edge').length > 60) errs.push(`title is ${(p.title + ' | Appeal Edge').length} characters with the brand suffix, limit is 60`);
  if (p.published && !/^\d{4}-\d{2}-\d{2}$/.test(p.published)) errs.push('published must be YYYY-MM-DD');
  if (p.author && !AUTHORS[p.author]) errs.push(`author must be one of ${Object.keys(AUTHORS).join(', ')}`);
  const visible = [p.title, p.description, p.tag, p.breadcrumb, p.h1, p.dek, p.ctaHeading, p.ctaText, plain(p.body || ''),
    ...(p.keywords || []), ...(p.faq || []).flatMap((f) => [f.q, f.a]), ...(p.related || []).map((r) => r.title)];
  visible.filter(Boolean).forEach((t) => { if (/[-–—]/.test(t)) errs.push(`dash found in copy: "${String(t).slice(0, 70)}"`); });
  return errs;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--example')) { console.log(JSON.stringify(EXAMPLE, null, 2)); return; }
  const input = args.find((a) => !a.startsWith('--'));
  if (!input) { console.error('Usage: node scripts/new-blog-post.js <input.json> [--write]   (or --example)'); process.exit(1); }
  const write = args.includes('--write');
  const p = Object.assign({ author: 'likith', keywords: [], faq: [], related: [] }, JSON.parse(fs.readFileSync(input, 'utf8')));
  if (p.bodyFile) p.body = fs.readFileSync(path.resolve(path.dirname(input), p.bodyFile), 'utf8');
  const errs = validate(p);
  if (errs.length) { console.error('Not created:\n  ' + errs.join('\n  ')); process.exit(1); }

  const modified = p.modified || p.published;
  const author = AUTHORS[p.author];
  const url = `${BASE}/blog/${p.slug}/`;

  // JSON-LD from the homepage graph
  const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
  const homeGraph = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const org = JSON.parse(JSON.stringify(homeGraph.find((n) => Array.isArray(n['@type']) && n['@type'].includes('Organization'))));
  delete org.founder; delete org.employee;
  const person = homeGraph.find((n) => n['@id'] === `${BASE}/#${author.id}`);
  if (!person) throw new Error(`Person node for ${author.id} not found on the homepage`);
  const graph = [org, {
    '@type': 'BlogPosting', '@id': `${url}#article`, headline: p.title, description: p.description,
    author: { '@id': person['@id'] }, publisher: { '@id': `${BASE}/#organization` },
    datePublished: p.published, dateModified: modified, mainEntityOfPage: url,
    image: `${BASE}/assets/og/${p.slug}.jpg`, articleSection: p.tag, keywords: p.keywords,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1.article-title', '.prose p.lede-p'] },
  }, {
    '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog/` },
      { '@type': 'ListItem', position: 3, name: p.breadcrumb, item: url },
    ],
  }];
  if (p.faq.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  graph.push(person);

  const faqHtml = p.faq.length ? `<div class="faq-section">
        <h2>Frequently asked questions</h2>
        <div class="faq-list">
${p.faq.map((f) => `          <details class="faq-item">
            <summary>${esc(f.q)}<span class="faq-mark" aria-hidden="true"></span></summary>
            <p class="faq-body">${esc(f.a)}</p>
          </details>`).join('\n')}
        </div>
      </div>` : '';

  const html = fill(fs.readFileSync(path.join(ROOT, 'templates', 'blog-post.html'), 'utf8'), {
    TITLE: esc(p.title), DESCRIPTION: esc(p.description), SLUG: p.slug, PUBLISHED: p.published, MODIFIED: modified,
    TAG: esc(p.tag), ARTICLE_TAGS: p.keywords.map((k) => `<meta property="article:tag" content="${esc(k)}">`).join('\n'),
    JSONLD: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2),
    BREADCRUMB: esc(p.breadcrumb), H1: esc(p.h1), DEK: esc(p.dek),
    BYLINE: `<strong>${esc(author.name)}</strong>, ${esc(author.role)} &middot; Published ${longDate(p.published)}${modified !== p.published ? ' &middot; Updated ' + longDate(modified) : ''} &middot; ${p.readMinutes} min read`,
    BODY: p.body.split('\n').map((l) => (l ? '      ' + l : l)).join('\n'),
    FAQ: faqHtml,
    CTA_HEADING: esc(p.ctaHeading), CTA_TEXT: esc(p.ctaText),
    RELATED: p.related.map((r) => `          <li><a href="${esc(r.href)}">${esc(r.title)}</a></li>`).join('\n'),
  });
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error('Unfilled placeholder left in the template output');

  console.log(`${write ? 'Creating' : 'Valid. Would create'} frontend-v2/blog/${p.slug}/index.html (${html.length} bytes)`);
  if (!write) { console.log('Dry run only. Re-run with --write to create the post.'); return; }

  const dir = path.join(SITE, 'blog', p.slug);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

  // card on /blog/
  const idxFile = path.join(SITE, 'blog', 'index.html');
  let idx = fs.readFileSync(idxFile, 'utf8');
  const card = `<a class="post-card" href="/blog/${p.slug}/">
          <span class="post-tag">${esc(p.tag)}</span>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.description)}</p>
          <p class="post-meta">${esc(author.name)} &middot; ${p.readMinutes} min read &middot; ${longDate(p.published)}</p>
        </a>
        `;
  idx = idx.replace('<a class="post-card"', () => card + '<a class="post-card"');
  fs.writeFileSync(idxFile, idx, 'utf8');

  const run = (script, ...a) => execFileSync(process.execPath, [path.join(__dirname, script), ...a], { stdio: 'inherit' });
  run('build-og-images.js', '--write', p.slug);
  run('sync-blog-schema.js', '--write');
  run('build-sitemap.js', '--write');
  run('build-llms.js', '--write');
  console.log(`\nDone. Check http://localhost:3000/blog/${p.slug}/ then stage the changed files by name.`);
}

main();
