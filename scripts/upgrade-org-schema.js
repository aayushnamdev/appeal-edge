#!/usr/bin/env node
// Enriches the Organization node inside every frontend-v2/**/index.html
// page's JSON-LD @graph. Every page currently carries its own Organization
// node (no shared partial, same as nav/footer), but only the homepage's
// is fully filled in -- everywhere else it is a name/url/logo stub. An AI
// system landing on any single page other than the homepage sees a company
// with no description, no contact info, and no social profiles.
//
// Every value added below is copied from content already published
// elsewhere on the site -- nothing here is invented:
//   - description: the homepage's existing Organization.description
//   - email / sameAs: the homepage's existing values
//   - areaServed: the 8-country list already used on the service pages
//   - knowsAbout: the suspension-type list already published in llms.txt
//   - contactPoint: the case-review URL already used site-wide as the CTA
//
// The homepage additionally gets a `founder` reference to all three
// co-founders, with inline Person node stubs for each -- matching the
// "Meet the Founders" section already visible on that page. Other pages
// are left without `founder` so each page's graph stays self-resolving
// (a Person @id should not dangle in a document that never defines it).
//
// See docs: /Users/aayushnamdev/.claude/plans/do-a-geo-for-breezy-harp.md
// (Phase C1).
//
// Usage:
//   node scripts/upgrade-org-schema.js            (dry run, reports changes)
//   node scripts/upgrade-org-schema.js --write     (writes the changes)

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const SITE_ROOT = path.join(REPO_ROOT, 'frontend-v2');
const HOME_FILE = path.join(SITE_ROOT, 'index.html');

const SKIP_DIRS = new Set(['scroll-hero-test']);

const ORG_ID = 'https://www.appeal-edge.com/#organization';

const DESCRIPTION =
  "Independent Amazon seller suspension appeal consultancy. Every case is reviewed and assigned to the specialist who fits it, led by the expert who pioneered the industry in 2014.";
const EMAIL = 'contact@appeal-edge.com';
const SAME_AS = [
  'https://www.instagram.com/appeal.edge/',
  'https://www.linkedin.com/company/112773661/',
];
const AREA_SERVED = [
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'Canada' },
  { '@type': 'Country', name: 'Germany' },
  { '@type': 'Country', name: 'France' },
  { '@type': 'Country', name: 'Italy' },
  { '@type': 'Country', name: 'Japan' },
  { '@type': 'Country', name: 'India' },
];
const KNOWS_ABOUT = [
  'Inauthentic and counterfeit complaints',
  'Order Defect Rate, Late Shipment Rate, and Valid Tracking Rate',
  'Intellectual property, trademark, and copyright complaints',
  'Related account suspensions',
  'Listing policy violations and restricted category issues',
  'Review manipulation suspicions',
  'Dropshipping policy violations',
  'Used sold as new and condition complaints',
];
const CONTACT_POINT = {
  '@type': 'ContactPoint',
  contactType: 'customer support',
  email: EMAIL,
  url: 'https://tally.so/r/Y5voaW',
};
const FOUNDERS = [
  { id: 'khushi-narwal', name: 'Khushi Narwal', jobTitle: 'COO' },
  { id: 'apeksha-namdev', name: 'Apeksha Namdev', jobTitle: 'CEO' },
  { id: 'aayush-namdev', name: 'Aayush Namdev', jobTitle: 'CTO' },
];

function personNode(f) {
  return {
    '@type': 'Person',
    '@id': `https://www.appeal-edge.com/#${f.id}`,
    name: f.name,
    jobTitle: f.jobTitle,
    worksFor: { '@id': ORG_ID },
  };
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

function isOrgNode(n) {
  return n['@type'] === 'Organization' || (Array.isArray(n['@type']) && n['@type'].includes('Organization'));
}

function upgradeOrgNode(node) {
  let changed = false;
  if (node['@type'] === 'Organization') {
    node['@type'] = ['Organization', 'ProfessionalService'];
    changed = true;
  }
  if (!node.description) { node.description = DESCRIPTION; changed = true; }
  if (!node.email) { node.email = EMAIL; changed = true; }
  if (!node.sameAs) { node.sameAs = SAME_AS; changed = true; }
  if (!node.areaServed) { node.areaServed = AREA_SERVED; changed = true; }
  if (!node.knowsAbout) { node.knowsAbout = KNOWS_ABOUT; changed = true; }
  if (!node.contactPoint) { node.contactPoint = CONTACT_POINT; changed = true; }
  return changed;
}

function processFile(file, write) {
  const original = fs.readFileSync(file, 'utf8');
  const m = original.match(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/);
  if (!m) return 'no-schema';

  let data;
  try {
    data = JSON.parse(m[2]);
  } catch (e) {
    console.warn(`  [skip: invalid JSON] ${path.relative(SITE_ROOT, file)}: ${e.message}`);
    return 'error';
  }

  if (!data['@graph'] || !Array.isArray(data['@graph'])) return 'no-graph';

  const orgNode = data['@graph'].find(isOrgNode);
  if (!orgNode) return 'no-org';

  let changed = upgradeOrgNode(orgNode);

  if (file === HOME_FILE) {
    if (!orgNode.founder) {
      orgNode.founder = FOUNDERS.map((f) => ({ '@id': `https://www.appeal-edge.com/#${f.id}` }));
      changed = true;
    }
    for (const f of FOUNDERS) {
      const id = `https://www.appeal-edge.com/#${f.id}`;
      if (!data['@graph'].some((n) => n['@id'] === id)) {
        data['@graph'].push(personNode(f));
        changed = true;
      }
    }
  }

  if (!changed) return 'unchanged';

  const newJson = '\n' + JSON.stringify(data, null, 2) + '\n';
  const updated = original.slice(0, m.index) + m[1] + newJson + m[3] + original.slice(m.index + m[0].length);

  if (write) fs.writeFileSync(file, updated, 'utf8');
  return 'changed';
}

function main() {
  const write = process.argv.includes('--write');
  const files = walk(SITE_ROOT);
  let changed = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const file of files) {
    const result = processFile(file, write);
    const rel = path.relative(SITE_ROOT, file);
    if (result === 'changed') {
      changed++;
      console.log(`${write ? '[written]' : '[would change]'} ${rel}`);
    } else if (result === 'unchanged') {
      unchanged++;
    } else {
      skipped++;
      if (result !== 'no-org') console.log(`  [${result}] ${rel}`);
    }
  }

  console.log(
    `\n${files.length} pages scanned. ${changed} ${write ? 'written' : 'would change'}, ${unchanged} already in sync, ${skipped} skipped (no schema or no Organization node).`
  );
  if (!write && changed > 0) {
    console.log('Dry run only. Re-run with --write to apply.');
  }
}

main();
