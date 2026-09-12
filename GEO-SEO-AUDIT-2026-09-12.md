# SEO + GEO Audit Report: Appeal Edge

**Audit Date:** 2026-09-12
**URL:** https://www.appeal-edge.com
**Business Type:** Agency/Services (Amazon seller suspension appeal consulting) with a large content/blog arm
**Data source:** Google Search Console, Last 28 Days export (2026-08-13 → 2026-09-09), Web search type, plus a full live-site technical and structured-data crawl of all 78 pages in `frontend-v2/`
**Supersedes:** `GEO-AUDIT-REPORT.md` (2026-08-02), which scored the composite GEO at 60/100

---

## Executive Summary

**The site is ranking. It is not earning clicks.**

Over the last 28 days, appeal-edge.com took 2,491 impressions and 13 clicks — a sitewide CTR of **0.52%** at an average position of **11.5**. Impressions climbed sharply across the window (roughly 60/day in mid-August to 120–240/day by early September); clicks stayed flat at 0–2/day throughout. The content investment is working on the ranking axis and failing on the click axis.

The sharpest version of the problem: **19 queries sat in positions 4–10 across the 28 days, generating 854 impressions and exactly zero clicks.** Normal page-one CTR on that volume would produce roughly 20–50 clicks. Zero is not a normal outcome — it is a packaging and conversion-path failure, not a ranking failure.

Three structural causes sit underneath it, each verified directly against the live site and the GSC export rather than inferred:

1. **Nothing routes traffic to the money pages.** Zero of 67 blog posts contain a single in-body link to any service page. Two of the four service pages receive no internal link from the content cluster at all — not nav, not footer, not body.
2. **Titles and descriptions answer the query instead of earning the click.** The five highest-impression zero-click pages have descriptions that either restate the question without answering it, or resolve it completely in the snippet, or truncate before the brand.
3. **No rich-result type on the site is currently eligible for one.** 63 `FAQPage` and 3 `HowTo` blocks are structurally valid JSON-LD, but both types were removed or restricted from Google's rich-result eligibility (FAQ in August 2023, HowTo fully removed) — which fully explains an empty `Search appearance` export.

Since the August 2 baseline, real progress has shipped: `/old/` now correctly returns 404 with `X-Robots-Tag: noindex, nofollow`; `Service`/`ProfessionalService`/`Offer` schema exists on all four service pages; `/about/` and `/experts/` now exist with named founder bios; Jeff Goldin has been fully removed from the site (see `jeff_goldin_removed_2026-08-30` memory). None of that progress has moved the click-through problem, because CTR and internal linking were not what the August audit was measuring — it scored crawlability and structure, which were already good.

What has **not** moved since August: zero HTML tables anywhere on the site, `sameAs` still limited to 2 platforms, `Person` schema still a shell (`name`/`jobTitle`/`worksFor` only), and Brand Authority remains near zero off-domain (verified again via live search on this audit date — Appeal Edge appears in none of the "best Amazon appeal service" roundups that competitors occupy, and has no Trustpilot presence).

---

## Search Performance Summary (28 days)

| Metric | Value |
|---|---|
| Total impressions | 2,491 |
| Total clicks | 13 |
| Sitewide CTR | 0.52% |
| Average position | 11.5 |

### Position distribution

| Bucket | Queries | Impressions | Clicks |
|---|---|---|---|
| 1–3 (top) | 3 | 3 | 0 |
| 4–10 (page 1) | 19 | 854 | **0** |
| 11–20 (page 2) | 10 | 43 | 0 |
| 21–50 | 17 | 64 | 0 |
| 51+ | 32 | 85 | 0 |

### Device split

| Device | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|
| Desktop | 2,046 | 5 | 0.24% | 14.35 |
| Mobile | 442 | 8 | 1.81% | 8.26 |
| Tablet | 3 | 0 | 0% | 4.0 |

Desktop carries 82% of impressions at roughly one-seventh the mobile CTR. A live search for the top query returns a SERP dominated by law-firm sites (amazonsellerslawyer.com, revisionlegal.com, arapackelaw.com, patentlawip.com) and Amazon's own seller forums, with the direct answer already synthesized above the organic results.

### Query clusters

| Cluster | Queries | Impressions | Share | Avg pos | Clicks |
|---|---|---|---|---|---|
| Trademark / IP / copyright | 13 | 809 | 66.4% | 7.6 | 0 |
| Dropshipping / seller of record | 31 | 139 | 11.4% | 14.2 | 0 |
| Plan of action | 17 | 92 | 7.6% | 26.0 | 0 |
| Repricer / tools / software | 12 | 70 | 5.7% | 41.8 | 0 |
| Suspension / appeal service | 8 | 65 | 5.3% | 42.1 | 0 |
| Valid tracking rate / ODR | 5 | 37 | 3.0% | 13.2 | 0 |

One query — *"amazon trademark ip violation edit button how to submit appeal"* — accounts for 786 impressions, **32% of the entire site's impression volume**, at position 6.72, with zero clicks.

---

## Critical Issues (Fix Immediately)

1. **19 page-one queries, 854 impressions, zero clicks.** Five pages are the concentration point:

   | Page | Position | Impressions | Clicks |
   |---|---|---|---|
   | `/blog/amazon-trademark-violation-appeal-seller-central-steps/` | 6.72 | 779 | 0 |
   | `/blog/amazon-dropshipping-packing-slips-invoices-requirements/` | 8.95 | 507 | 0 |
   | `/blog/amazon-seller-of-record-vs-supplier/` | 9.77 | 128 | 0 |
   | `/blog/used-sold-as-new-plan-of-action-template/` | 9.08 | 61 | 0 |
   | `/blog/amazon-valid-tracking-rate-suspension/` | 11.90 | 51 | 0 |

   Every one of these has a title or description that either restates the query, fully resolves it, or truncates before the brand. See the Category Deep Dive below for the per-page rewrite direction.

2. **Zero of 67 blog posts link to a service page in the body copy.** `/amazon-plan-of-action-writing-service/` and `/amazon-ip-complaint-removal-service/` receive no internal link from anywhere in the 67-post content cluster — not nav, not footer, not body — despite topically exact matches existing (`amazon-plan-of-action-template`, `how-to-remove-amazon-ip-complaint`). In-article CTAs route to an external Tally form instead, so conversion leaves the site and carries no internal link equity. This is the direct cause of the service pages' rankings: `/amazon-appeal-service/` sits at position 51.21.

3. **No rich-result type on the site is eligible.** Google deprecated FAQ rich results in August 2023 (now shown only to a narrow set of authoritative government/health domains) and fully removed HowTo results. The site's 63 `FAQPage` and 3 `HowTo` blocks are valid but cannot produce anything. There is also no `aggregateRating`, `Review`, `Product`, `Event`, `VideoObject`, or `WebSite.potentialAction` anywhere on the site — no path to a rich result currently exists at all.

---

## High Priority Issues

1. **Two cannibalization pairs.** `amazon-seller-of-record-explained` (published Jul 26) and `amazon-seller-of-record-vs-supplier` (published Aug 6) target overlapping intent 11 days apart; the first also has a slug/title mismatch (slug says "explained," title says "Amazon Dropshipping Violation"). `used-sold-as-new-plan-of-action-template` and `amazon-used-sold-as-new-suspension-appeal` overlap similarly. Ranking page-one with zero clicks is a classic symptom of Google rotating between a site's own competing URLs.
2. **26 of 78 titles exceed 60 characters** and truncate on desktop, dropping the ` | Appeal Edge` brand suffix. Four of the five Critical Issue #1 pages are on this list.
3. **17 noindexed blog posts still absorb internal link equity.** The repricer/PPC/software/AI-tools cluster (17 posts) correctly carries `noindex,follow` and is correctly excluded from the sitemap by `scripts/build-sitemap.js`, but remains fully linked from `/blog/index.html`'s post grid and from the Related-reading module on every indexable post — spending PageRank on pages that cannot rank.
4. **Seven high-intent, indexable pages get zero impressions in 28 days**, despite being live since mid-July/early August and covering the site's core commercial topics: `amazon-section-3-suspension-appeal`, `amazon-high-odr-suspension-appeal`, `amazon-inauthentic-complaint-no-invoice-appeal`, `amazon-invoice-requirements-supplier-documents-appeal`, `amazon-velocity-review-suspension-appeal`, `amazon-fair-pricing-policy-violation-appeal`, `ai-generated-amazon-listings-without-suspension-risk`. They have no internal entry point beyond the flat, unpaginated `/blog/` index.
5. **All 118 Article/BlogPosting nodes share one generic `og-image.png`.** Google will not surface a distinct article thumbnail from a site-wide identical placeholder.
6. **`author` is the Organization on every post, never a Person**, despite named bylines (Khushi Narwal, Apeksha Namdev) already visible on several posts — the schema contradicts what the page shows.
7. **Brand Authority is unchanged from the August baseline.** Verified fresh on this audit date: searching `"Appeal Edge" Amazon seller suspension` returns no Appeal Edge result at all. The "best Amazon appeal service 2026" roundup ecosystem (Sermondo, wifitalents, mrjeffamz) that names AMZ Sellers Attorney, Mr. Jeff AMZ, Riverbend Consulting, and SellerAppeal contains no mention of Appeal Edge. Competitors hold Trustpilot listings; Appeal Edge has none. This is out of scope for the on-site remediation plan below but remains the largest single lever on GEO score.

---

## Medium Priority Issues

1. `datePublished == dateModified` on essentially every post — no freshness signal, and the visible byline says only "Published," never "Updated."
2. `Organization` schema has no `address`, `telephone`, or `aggregateRating`, and `sameAs` still lists only Instagram and LinkedIn.
3. `/blog/index.html`'s embedded `Blog` schema lists 50 `BlogPosting` entries while the page links 67 posts — 17 stale.
4. **Apex redirect resolves as a 307, not the 301 `server.js` issues.** Live chain: `http://appeal-edge.com` → 308 → `https://appeal-edge.com` → **307 (temporary)** → `https://www.appeal-edge.com`. The 307 is issued by Vercel's edge domain redirect, which fires before the Express handler ever runs — the code's intended 301 never executes.
5. ~12.3 MB of unreferenced images ship in every deploy: `testomonial.png` (7.1 MB), `hero.png` (3.9 MB), `hero-transparent.png` (1.3 MB), each duplicated between the repo root and `public/`, none referenced by any `<img>` tag in `frontend-v2/`.
6. 76 of 77 pages eager-load the footer logo (`loading="lazy"` missing; only `about/index.html` sets it).

---

## Low Priority Issues

1. No `hreflang` (`en-IN` / `x-default`) between `/amazon-appeal-service/` and `/amazon-appeal-service-india/`, despite the India page targeting a distinct region with the same language.
2. `vercel.json` routes every request — including static assets — through the Node lambda; no static/CDN route is configured.
3. `scroll-hero-test/version-a/` is live at a real URL with no meta description and no `og:*` tags.
4. `Offer`/`Service` schema on service pages has no `price`/`priceCurrency` (deliberate, since pricing isn't published, but will produce a Rich Results Test warning).
5. FAQ content is duplicated near-verbatim between the homepage and `/amazon-appeal-service/` (guarantee, cost, Amazon affiliation, who works the case) — Google dedupes FAQ content across a domain.

---

## Category Deep Dives

### CTR on ranking pages (the core finding)

Per-page diagnosis on the five Critical Issue #1 pages, each verified against the live `<title>`/`<meta name="description">` and the page's own body copy:

- **`how-long-amazon-appeal-takes-reinstatement-timeline`** — the clearest case. The query wants a number. Title: *"How Long Does an Amazon Appeal Take"*. Description opens *"Amazon appeal timelines vary by violation type and review queue"* — which tells the searcher there is no answer here. The actual number ("24 to 48 hours" for a well-prepared first appeal) sits in body paragraph 2, unused in the snippet.
- **`amazon-trademark-violation-appeal-seller-central-steps`** — title is *"Amazon Trademark Violation Edit Button: Where It Is"*, a narrow UI-location framing, while the H1 promises the broader *"exact steps in seller central."* At 65 characters the title truncates around "Where It…", dropping the brand entirely — on the single query responsible for a third of the site's impressions.
- **`amazon-dropshipping-packing-slips-invoices-requirements`** — description never uses the words "violation," "suspension," or "appeal," despite that almost certainly being the intent behind the query. It reads as a spec sheet, not an answer to a problem.
- **`amazon-seller-of-record-vs-supplier`** — description resolves the question in its own first sentence ("two different roles Amazon checks separately"). A zero-click description by construction.
- **`amazon-valid-tracking-rate-suspension`** — 66 characters, truncates mid-phrase. The article's genuinely differentiating insight — that this is usually a *carrier* problem, and the operative threshold is 95% — appears in neither the title nor the description.

Pattern across all five: no title contains a number, year, timeframe, or differentiating specific, and every description either restates or fully answers the query.

### Internal linking

Verified directly against the live HTML, not sampled: extracting the DOM region between `<article>` and the Related-reading module (`<div class="related">`) on all 67 indexable posts and searching for links to `/amazon-*-service*/`.

- **0 of 67 posts contain an in-body link to a service page.** Median in-body internal link count across all posts is 1, and that link is typically a homepage anchor (`/#understand`), not a page.
- 26 of 67 posts contain **zero** in-body internal links of any kind.
- The single highest-impression page on the site (`amazon-trademark-violation-appeal-seller-central-steps`, 779 impressions) has an **empty** in-body link list.
- `/amazon-plan-of-action-writing-service/` and `/amazon-ip-complaint-removal-service/`: zero inbound links from the entire blog. The only money-page links present anywhere in a post are the two global `/amazon-appeal-service/` links duplicated in every page's nav and footer.

This is a direct, verifiable cause of service-page rankings:

| Service page | Position | Impressions |
|---|---|---|
| `/amazon-appeal-service/` | 51.21 | 43 |
| `/amazon-ip-complaint-removal-service/` | 30.86 | 7 |
| `/amazon-appeal-service-india/` | 44.00 | 4 |
| `/amazon-plan-of-action-writing-service/` | 20.00 | 3 |

Commercial queries follow the same pattern: "amazon appeal services" position 65, "amazon appeal service" position 57, "amazon suspension service" position 90, "seller account suspended" position 89.

### Structured data

77 of 78 pages carry a single `application/ld+json` `@graph` block (`/thank-you/`, correctly `noindex,nofollow`, has none). Census across the site:

| @type | Count |
|---|---|
| `["Organization","ProfessionalService"]` | 77 |
| BreadcrumbList | 75 |
| FAQPage / Question / Answer | 63 / 255 / 255 |
| BlogPosting | 67 (+ 50 stale entries in `/blog/`'s `Blog` node) |
| Article | 17 |
| Person | 43 (attached only via `founder`/`worksFor`, never `author`) |
| Service / Offer / OfferCatalog | 16 / 16 / 2 |
| HowTo / HowToStep | 3 / 15 |
| LocalBusiness / Review / AggregateRating / Product / Event | **0** |

FAQ and HowTo coverage is genuinely broad, but neither type is currently eligible for a Google rich result — FAQ was restricted to gov/health domains in August 2023, and HowTo was removed entirely. That fully accounts for the empty `Search appearance` export in the GSC data above. Breadcrumbs are the one implemented type still eligible, and are present with matching visible UI on all 67 posts.

Organization schema is copied identically onto all 77 pages from a single canonical definition on the homepage: `name`, `url`, `description`, `email`, `logo` (dimensions verified to match the real file), `founder` (3 Person `@id` refs), `contactPoint`, `areaServed` (8 countries), `knowsAbout` are all present. `address`, `telephone`, and `aggregateRating` are absent sitewide. `sameAs` carries only Instagram and LinkedIn.

### Technical infrastructure

Confirmed live, no action needed beyond the items listed above:

- Page weight 11–14 KB gzipped; TTFB 0.38–0.49s across homepage, a blog post, and a service page.
- Full security header set: CSP (scoped to GTM + Tally), HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- `robots.txt` explicitly allows 16 named AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Amazonbot, Bytespider, CCBot, and others) plus a `Content-Signal: ai-train=yes, search=yes, ai-retrieval=yes, ai-personalization=no` directive — genuinely ahead of typical practice for a site this size.
- `llms.txt` present, well-formed, and factually accurate.
- All 158 `<img>` tags across the site carry explicit `width`/`height` and `alt` text — no CLS risk from images.
- All 191 first-party `<script>` tags use `defer`; the sole third-party tag (GTM) is `async`. Fonts are self-hosted, `woff2`, preloaded, cached `immutable`.
- Sitemap holds 60 URLs, every one resolves and matches a real file — zero stale or 404 entries. The 18-URL gap against the 78 files on disk is intentional (17 noindexed posts, correctly excluded by `scripts/build-sitemap.js`, plus `/thank-you/`).
- Canonicals are self-referencing and correct on 77 of 78 pages, zero mismatches against `og:url`.

---

## 30-Day Action Plan

### Week 1 — CTR rescue (highest leverage; see remediation plan for exact copy)
- [ ] Rewrite title + meta description on the five Critical Issue #1 pages with a concrete number, threshold, or timeframe in each
- [ ] Resolve the two cannibalization pairs
- [ ] Trim the 26 over-60-character titles

### Week 2 — Connect content to revenue
- [ ] Add 2–3 in-body contextual links per post, routed by topic to the matching service page, starting with the five CTR-rescue pages and the seven zero-impression pages
- [ ] Point in-article CTAs at service pages instead of the external Tally form
- [ ] Remove the 17 noindexed posts from the `/blog/` grid and Related-reading modules

### Week 3 — Schema that can actually do something
- [ ] Switch `author` from Organization to the matching `Person` node on posts with a visible byline
- [ ] Replace the shared `og-image.png` on the top 10 ranking posts with per-post images
- [ ] Resync `scripts/sync-blog-schema.js` and `scripts/build-sitemap.js`

### Week 4 — Technical cleanup + off-domain (longest lead time)
- [ ] Collapse the apex redirect to a single 308 (fix is in Vercel domain config / `vercel.json`, not `server.js`)
- [ ] Drop the ~12.3 MB of unreferenced images from the deploy
- [ ] Begin off-domain brand-authority work: Trustpilot claim, targeted outreach to the named roundups, `sameAs` expansion

---

## Appendix: Data Sources

- Google Search Console export: `appeal-edge.com-Performance-on-Search-2026-09-12.zip`, Last 28 Days, Web search type (Queries, Pages, Countries, Devices, Search appearance, Chart, Filters)
- Live crawl of all 78 pages in `frontend-v2/` (title, meta, og tags, JSON-LD, in-body links)
- Live HTTP checks: `robots.txt`, `sitemap.xml`, `llms.txt`, redirect chains, response headers, page weight, TTFB
- Live web search verification of brand-authority claims (2026-09-12)
