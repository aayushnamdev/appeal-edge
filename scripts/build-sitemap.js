#!/usr/bin/env node
// Regenerates public/sitemap.xml by walking frontend-v2 for real, indexable
// pages. frontend-v2 has no build step, so the sitemap has historically been
// maintained by hand and drifts -- this script is the replacement for that.
//
// Rules:
//   - Every frontend-v2/**/index.html is a candidate URL.
//   - Skipped: anything under scroll-hero-test/ (a test page, not a real
//     site page) and any page whose <meta name="robots"> contains noindex.
//   - lastmod: <meta property="article:modified_time"> if present, else the
//     file's last git commit date, else the file's mtime on disk.
//   - priority/changefreq: home and /blog/ get hand tuned values; everything
//     else falls back to a rule of thumb by URL shape. A PRIORITY_OVERRIDES
//     map below can pin specific URLs (used for the two cornerstone posts
//     that have historically carried 0.8 instead of the 0.7 default).
//
// Usage:
//   node scripts/build-sitemap.js            (dry run, prints the diff)
//   node scripts/build-sitemap.js --write     (writes public/sitemap.xml)

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SITE_ROOT = path.join(REPO_ROOT, 'frontend-v2');
const SITEMAP_PATH = path.join(REPO_ROOT, 'public', 'sitemap.xml');
const BASE_URL = 'https://www.appeal-edge.com';

const SKIP_DIRS = new Set(['scroll-hero-test']);

// URL path (with leading/trailing slash, matching <loc> minus BASE_URL) ->
// { priority, changefreq } overrides. Everything not listed here uses the
// DEFAULT_RULES below.
const PRIORITY_OVERRIDES = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/blog/': { priority: '0.8', changefreq: 'weekly' },
  '/blog/amazon-seller-account-suspended-what-to-do/': { priority: '0.8', changefreq: 'monthly' },
  '/blog/amazon-plan-of-action-template/': { priority: '0.8', changefreq: 'monthly' },
  '/amazon-appeal-service/': { priority: '0.9', changefreq: 'weekly' },
  '/amazon-plan-of-action-writing-service/': { priority: '0.8', changefreq: 'monthly' },
  '/amazon-ip-complaint-removal-service/': { priority: '0.8', changefreq: 'monthly' },
  '/amazon-appeal-service-india/': { priority: '0.8', changefreq: 'monthly' },
  '/experts/jeff-goldin/': { priority: '0.6', changefreq: 'monthly' },
  '/privacy-policy/': { priority: '0.3', changefreq: 'yearly' },
  '/terms/': { priority: '0.3', changefreq: 'yearly' },
};

const DEFAULT_RULE = { priority: '0.7', changefreq: 'monthly' };

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.name === 'index.html') {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function isNoindex(html) {
  const m = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  return !!m && /noindex/i.test(m[1]);
}

function extractModifiedTime(html) {
  const m = html.match(/<meta\s+property="article:modified_time"\s+content="([^"]*)"/i);
  if (!m) return null;
  const d = m[1].slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
}

function gitLastCommitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

function fsMtimeDate(file) {
  return fs.statSync(file).mtime.toISOString().slice(0, 10);
}

function urlFor(file) {
  const rel = path.relative(SITE_ROOT, file).replace(/index\.html$/, '');
  const normalized = rel === '' ? '/' : `/${rel.replace(/\\/g, '/')}`;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function buildEntries() {
  const files = walk(SITE_ROOT);
  const entries = [];

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    if (isNoindex(html)) continue;

    const urlPath = urlFor(file);
    const lastmod = extractModifiedTime(html) || gitLastCommitDate(file) || fsMtimeDate(file);
    const rule = PRIORITY_OVERRIDES[urlPath] || DEFAULT_RULE;

    entries.push({ loc: `${BASE_URL}${urlPath}`, lastmod, ...rule, urlPath });
  }

  // Home first, then /blog/, then everything else alphabetically by path.
  entries.sort((a, b) => {
    if (a.urlPath === '/') return -1;
    if (b.urlPath === '/') return 1;
    if (a.urlPath === '/blog/') return -1;
    if (b.urlPath === '/blog/') return 1;
    return a.urlPath.localeCompare(b.urlPath);
  });

  return entries;
}

function renderSitemap(entries) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const e of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${e.loc}</loc>`);
    lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    lines.push(`    <priority>${e.priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

function main() {
  const write = process.argv.includes('--write');
  const entries = buildEntries();
  const next = renderSitemap(entries);
  const current = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf8') : '';

  const currentUrls = new Set([...current.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const nextUrls = new Set(entries.map((e) => e.loc));

  const added = [...nextUrls].filter((u) => !currentUrls.has(u));
  const removed = [...currentUrls].filter((u) => !nextUrls.has(u));

  console.log(`${entries.length} URLs in the new sitemap (was ${currentUrls.size}).`);
  if (added.length) {
    console.log(`\nAdded (${added.length}):`);
    added.forEach((u) => console.log(`  + ${u}`));
  }
  if (removed.length) {
    console.log(`\nRemoved (${removed.length}):`);
    removed.forEach((u) => console.log(`  - ${u}`));
  }
  if (!added.length && !removed.length && next === current) {
    console.log('No changes.');
  }

  if (write) {
    fs.writeFileSync(SITEMAP_PATH, next, 'utf8');
    console.log(`\nWritten to ${path.relative(REPO_ROOT, SITEMAP_PATH)}`);
  } else if (next !== current) {
    console.log('\nDry run only. Re-run with --write to apply.');
  }
}

main();
