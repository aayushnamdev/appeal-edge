#!/usr/bin/env node
// Fan the nav and footer "Navigate" list out to every frontend-v2/**/index.html
// page from the single definitions below.
//
// frontend-v2 is hand authored static HTML with no build step -- every page
// duplicates its own inline nav and footer markup. This script is the stand
// in for a shared template: edit NAV_LINKS_* / FOOTER_NAV_* below, then run
// this to push the change everywhere instead of hand editing every file.
//
// The homepage (frontend-v2/index.html) uses relative in-page anchors
// (#expert, not /#expert) and the label "Advisor" instead of "The Expert",
// since it IS the page those anchors point to. Every other page gets the
// absolute-anchor variant.
//
// Usage:
//   node scripts/inject-partial.js            (dry run, reports what would change)
//   node scripts/inject-partial.js --write     (writes the changes)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend-v2');
const HOME_FILE = path.join(ROOT, 'index.html');

const NAV_LINKS_SUB = `<ul class="nav-links" id="nav-links-list">
        <li><a href="/amazon-appeal-service/">Services</a></li>
        <li><a href="/#expert">The Expert</a></li>
        <li><a href="/#how">How it works</a></li>
        <li><a href="/#handle">What we handle</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/#faq">FAQ</a></li>
      </ul>`;

const NAV_LINKS_HOME = `<ul class="nav-links" id="nav-links-list">
        <li><a href="/amazon-appeal-service/">Services</a></li>
        <li><a href="#expert">Advisor</a></li>
        <li><a href="#how">How it works</a></li>
        <li><a href="#handle">What we handle</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>`;

const FOOTER_NAV_SUB = `<ul>
          <li><a href="/amazon-appeal-service/">Amazon Appeal Service</a></li>
          <li><a href="/#expert">The Expert</a></li>
          <li><a href="/#how">How it works</a></li>
          <li><a href="/#handle">What we handle</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Service</a></li>
        </ul>`;

const FOOTER_NAV_HOME = `<ul>
          <li><a href="/amazon-appeal-service/">Amazon Appeal Service</a></li>
          <li><a href="#expert">Advisor</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#handle">What we handle</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Service</a></li>
        </ul>`;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

// Replaces the first `<ul class="nav-links" id="nav-links-list">...</ul>`
// block found anywhere in content. There is exactly one per page.
function replaceNavLinks(content, replacement, file) {
  const marker = '<ul class="nav-links" id="nav-links-list">';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) {
    console.warn(`  [skip: no nav-links marker] ${path.relative(ROOT, file)}`);
    return content;
  }
  const endIdx = content.indexOf('</ul>', startIdx);
  if (endIdx === -1) {
    console.warn(`  [skip: unterminated nav-links] ${path.relative(ROOT, file)}`);
    return content;
  }
  return content.slice(0, startIdx) + replacement + content.slice(endIdx + '</ul>'.length);
}

// Replaces the <ul>...</ul> immediately following the footer's
// <h4>Navigate</h4> heading, found by anchoring the search there so an
// earlier <ul> in the article prose is never touched.
function replaceFooterNav(content, replacement, file) {
  const heading = '<h4>Navigate</h4>';
  const headingIdx = content.indexOf(heading);
  if (headingIdx === -1) {
    console.warn(`  [skip: no footer Navigate marker] ${path.relative(ROOT, file)}`);
    return content;
  }
  const ulStart = content.indexOf('<ul>', headingIdx);
  if (ulStart === -1 || ulStart - headingIdx > 40) {
    console.warn(`  [skip: no <ul> after Navigate] ${path.relative(ROOT, file)}`);
    return content;
  }
  const ulEnd = content.indexOf('</ul>', ulStart);
  if (ulEnd === -1) {
    console.warn(`  [skip: unterminated footer Navigate list] ${path.relative(ROOT, file)}`);
    return content;
  }
  return content.slice(0, ulStart) + replacement + content.slice(ulEnd + '</ul>'.length);
}

function processFile(file, write) {
  const original = fs.readFileSync(file, 'utf8');
  const isHome = file === HOME_FILE;

  let updated = replaceNavLinks(original, isHome ? NAV_LINKS_HOME : NAV_LINKS_SUB, file);
  updated = replaceFooterNav(updated, isHome ? FOOTER_NAV_HOME : FOOTER_NAV_SUB, file);

  if (updated === original) return 'unchanged';
  if (write) fs.writeFileSync(file, updated, 'utf8');
  return 'changed';
}

function main() {
  const write = process.argv.includes('--write');
  const files = walk(ROOT);
  let changed = 0;
  let unchanged = 0;

  for (const file of files) {
    const result = processFile(file, write);
    const rel = path.relative(ROOT, file);
    if (result === 'changed') {
      changed++;
      console.log(`${write ? '[written]' : '[would change]'} ${rel}`);
    } else {
      unchanged++;
    }
  }

  console.log(`\n${files.length} pages scanned. ${changed} ${write ? 'written' : 'would change'}, ${unchanged} already in sync.`);
  if (!write && changed > 0) {
    console.log('Dry run only. Re-run with --write to apply.');
  }
}

main();
