#!/usr/bin/env node
// Two fixes to the blog's JSON-LD, found in the 2026-08-18 GEO audit:
//
// 1. Every blog post types its own content node "Article", but the blog
//    index (frontend-v2/blog/index.html) lists the same URLs as
//    "BlogPosting" in its Blog.blogPost array. Same content, two types.
//    This script switches each post's node to "BlogPosting" to match.
//
// 2. The blog index's Blog.blogPost array was hand maintained and had
//    drifted -- 10 published posts were missing from it entirely, and the
//    entries that existed carried only headline/url/datePublished, missing
//    author, dateModified, and image. This script rebuilds the array from
//    every indexable post on disk, matching the fields already present on
//    each post's own Article/BlogPosting node.
//
// Noindexed posts (same rule as scripts/build-sitemap.js) are excluded,
// so the index only ever lists what is actually indexable.
//
// Usage:
//   node scripts/sync-blog-schema.js            (dry run)
//   node scripts/sync-blog-schema.js --write

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SITE_ROOT = path.join(REPO_ROOT, 'frontend-v2');
const BLOG_ROOT = path.join(SITE_ROOT, 'blog');
const BLOG_INDEX_FILE = path.join(BLOG_ROOT, 'index.html');

function walkPosts(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    const indexFile = path.join(full, 'index.html');
    if (fs.existsSync(indexFile)) out.push(indexFile);
  }
  return out;
}

function isNoindex(html) {
  const m = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  return !!m && /noindex/i.test(m[1]);
}

function parseGraph(html) {
  const m = html.match(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/);
  if (!m) return null;
  let data;
  try {
    data = JSON.parse(m[2]);
  } catch {
    return null;
  }
  return { data, match: m };
}

function upgradePostType(file, write) {
  const original = fs.readFileSync(file, 'utf8');
  const parsed = parseGraph(original);
  if (!parsed || !parsed.data['@graph']) return { result: 'no-schema' };

  const { data, match } = parsed;
  const node = data['@graph'].find((n) => n['@type'] === 'Article' || n['@type'] === 'BlogPosting');
  if (!node) return { result: 'no-article', entry: null };

  const entry = {
    '@type': 'BlogPosting',
    headline: node.headline,
    url: node.mainEntityOfPage || node['@id']?.replace(/#article$/, ''),
    datePublished: node.datePublished,
    dateModified: node.dateModified || node.datePublished,
    author: node.author,
    image: node.image,
  };

  if (node['@type'] === 'Article') {
    node['@type'] = 'BlogPosting';
    const newJson = '\n' + JSON.stringify(data, null, 2) + '\n';
    const updated = original.slice(0, match.index) + match[1] + newJson + match[3] + original.slice(match.index + match[0].length);
    if (write) fs.writeFileSync(file, updated, 'utf8');
    return { result: 'changed', entry };
  }

  return { result: 'unchanged', entry };
}

function rebuildBlogIndex(entries, write) {
  const original = fs.readFileSync(BLOG_INDEX_FILE, 'utf8');
  const parsed = parseGraph(original);
  if (!parsed) return 'no-schema';

  const { data, match } = parsed;
  const blogNode = data['@graph'].find((n) => n['@type'] === 'Blog');
  if (!blogNode) return 'no-blog-node';

  const sorted = [...entries].sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''));
  const before = JSON.stringify(blogNode.blogPost);
  blogNode.blogPost = sorted;
  const after = JSON.stringify(blogNode.blogPost);

  if (before === after) return 'unchanged';

  const newJson = '\n' + JSON.stringify(data, null, 2) + '\n';
  const updated = original.slice(0, match.index) + match[1] + newJson + match[3] + original.slice(match.index + match[0].length);
  if (write) fs.writeFileSync(BLOG_INDEX_FILE, updated, 'utf8');
  return 'changed';
}

function main() {
  const write = process.argv.includes('--write');
  const postFiles = walkPosts(BLOG_ROOT);

  let typeChanged = 0;
  let typeUnchanged = 0;
  const indexEntries = [];

  for (const file of postFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(BLOG_ROOT, file);
    if (isNoindex(html)) {
      console.log(`  [excluded: noindex] ${rel}`);
      continue;
    }

    const { result, entry } = upgradePostType(file, write);
    if (result === 'no-schema' || result === 'no-article') {
      console.warn(`  [skip: ${result}] ${rel}`);
      continue;
    }
    if (result === 'changed') {
      typeChanged++;
      console.log(`${write ? '[written]' : '[would change]'} ${rel} -> BlogPosting`);
    } else {
      typeUnchanged++;
    }
    if (entry && entry.headline && entry.url) indexEntries.push(entry);
  }

  console.log(`\n${postFiles.length} posts scanned. ${typeChanged} type-changed, ${typeUnchanged} already BlogPosting.`);

  const indexResult = rebuildBlogIndex(indexEntries, write);
  if (indexResult === 'changed') {
    console.log(`${write ? '[written]' : '[would change]'} blog/index.html blogPost array (${indexEntries.length} entries)`);
  } else if (indexResult === 'unchanged') {
    console.log('blog/index.html blogPost array already in sync.');
  } else {
    console.warn(`  [skip: ${indexResult}] blog/index.html`);
  }

  if (!write) console.log('\nDry run only. Re-run with --write to apply.');
}

main();
