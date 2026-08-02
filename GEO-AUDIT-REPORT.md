# GEO Audit Report: Appeal Edge

**Audit Date:** 2026-08-02
**URL:** https://www.appeal-edge.com
**Business Type:** Agency/Services (Amazon seller suspension appeal consulting) with a large content/blog arm
**Pages Analyzed:** Homepage, /blog/ index, 8 sampled blog posts (across suspension-appeal, AI-for-sellers, and software-guide clusters), privacy-policy, terms — plus full sitemap.xml (41 URLs), robots.txt, llms.txt
**Supersedes:** the 2026-07-14 audit of the same name (relaunch-day baseline, scored 61/100 technical only)

---

## Executive Summary

**Overall GEO Score: 60/100 (Fair)**

The July 14 relaunch's critical migration bug (sitemap/llms.txt pointing at soft-404s) is now fully fixed and technical infrastructure is excellent (93/100) — crawlability, security headers, self-hosted fonts, and schema markup are all in good shape following recent commits. The site's weak point isn't the content itself, which is specific and non-generic, it's that almost none of it has any independent trace off the domain: Brand Authority sits at 5/100, unchanged from the May baseline despite 35 new blog posts, because zero of that content has produced a Wikipedia entry, a Reddit mention, a YouTube presence, or press coverage. AI systems weight third-party corroboration heavily for entity trust — right now an AI asked "who can help appeal an Amazon suspension" has no external signal that Appeal Edge exists.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 82/100 | 25% | 20.5 |
| Brand Authority | 5/100 | 20% | 1.0 |
| Content E-E-A-T | 61/100 | 20% | 12.2 |
| Technical GEO | 93/100 | 15% | 14.0 |
| Schema & Structured Data | 65/100 | 10% | 6.5 |
| Platform Optimization | 57/100 | 10% | 5.7 |
| **Overall GEO Score** | | | **60/100** |

---

## Critical Issues (Fix Immediately)

1. **Brand has zero third-party corroboration.** No Wikipedia/Wikidata entry, no Reddit mentions in r/AmazonSeller or r/FulfillmentByAmazon, no YouTube presence, no press/G2/Trustpilot listings. Confirmed via fresh search today, not just re-stating the May audit — the gap hasn't moved despite the content buildout.
2. **Jeff Goldin authority mismatch.** The homepage positions Jeff Goldin (25+ yrs, founded the industry in 2014) as the credibility anchor, but his bio explicitly labels him "Advisor to Appeal Edge," not founder/author, and none of the 8 sampled blog posts are bylined to him. The actual "Founders Team" (Khushi Narwal – COO, Apeksha Namdev – CEO, Aayush Namdev – CTO) have no individual bios, credentials, or external profiles anywhere on the site. No `/about` page exists at all.
3. **No Service/ProfessionalService schema.** For a business whose entire offering is the appeal-consulting service itself, there is no machine-readable description of it (no `provider`, `areaServed`, `offers`).

## High Priority Issues

1. **`sameAs` coverage is thin.** Organization schema links only Instagram + LinkedIn (2 platforms) — no Wikipedia, Wikidata, YouTube, Crunchbase, X. Person schemas for authors (including Jeff Goldin, who isn't even hyperlinked) have zero `sameAs` at all.
2. **Near-zero citation of Amazon's own policy pages.** Only 2 of 8 sampled posts link to an authoritative external source (Amazon's Fair Pricing PDF, sell.amazon.com dropshipping page). The other 6 — including posts making specific policy interpretations (IP complaints, related accounts, used-sold-as-new) — cite nothing external. This is both a trust signal and a direct citability lever AI answer engines reward.
3. **Person schema for authors is a shell.** `name`, `jobTitle`, `worksFor` only — no `url`, `sameAs`, `image`, `description`, `knowsAbout`. AI models can't independently verify author expertise.
4. **llms.txt is incomplete relative to site depth.** Well-formed but only links `/blog/` generically rather than enumerating the 41 published URLs.
5. **Zero HTML tables anywhere in the 10-page sample**, despite content that is inherently tabular (pricing tiers, repricing-model comparisons). This is the single biggest content-quality-vs-packaging gap for Google AI Overviews and Gemini, and requires no new research — the facts are already written in prose.

## Medium Priority Issues

1. `/old/` archive is robots-blocked and unlinked but still returns 200 with no `X-Robots-Tag: noindex` — residual index-leakage risk via stray backlinks.
2. 4 of 8 sampled posts (and 3 of 7 with Article schema) default to the generic "Appeal Edge" byline instead of a named author, and 3 posts use `author` = Organization rather than Person — weaker for E-E-A-T.
3. No legal disclaimer ("not legal advice," "results vary") on the pricing/policy-interpretation posts.
4. No `speakable` property or `SearchAction`/`potentialAction` on homepage `WebSite` schema.
5. Redirect chain has 2 hops (`http://` → 308 → `https://` → 307 → `https://www.`) — should collapse to one.

## Low Priority Issues

1. `aayush-photo.webp` missing explicit `width`/`height` attributes (minor CLS risk).
2. HSTS header present but lacks `includeSubDomains`.
3. Heading hierarchy skips H3 in favor of H4 subsections on some posts.
4. No Bing Webmaster Tools / IndexNow verification signal found.

---

## Category Deep Dives

### AI Citability (82/100)
FAQ blocks are the strongest citability lever on the site — the same Q&A text appears both as a visible accordion and in JSON-LD `FAQPage` markup, giving crawlers a clean, duplicate-verified answer. Sampled passages score well: the appeal-cost FAQ ("$1,500 per appeal... independent consultants $2,000–$2,500... lawyers $1,500–$5,000") scored ~84/100 for citability — numeric, self-contained, directly answers a likely query. Weakness: content is competent industry-standard advice without proprietary data (no win-rate stats, case counts, original research) that would push scores past 85.

Crawler access is a genuine strength: every major AI crawler (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Amazonbot, Google-Extended, Bytespider, CCBot, Cohere-ai, Applebot-Extended) gets explicit `Allow: /`, only `/old/` is blocked, and the site ships a `Content-Signal: ai-train=yes, search=yes, ai-retrieval=yes, ai-personalization=no` directive — a forward-leaning, still-rare signal.

### Brand Authority (5/100)
Unchanged from the May baseline. Wikipedia API search returned no article and no Wikidata Q-number. No Reddit threads mention "Appeal Edge" by name in any Amazon-seller subreddit. No YouTube channel. LinkedIn company page exists but doesn't surface in external search (effectively invisible). No G2/Trustpilot/Capterra/press mentions. "Jeff Goldin" as founder/advisor could not be externally corroborated by any LinkedIn or press source found. 35 new blog posts changed on-site citability substantially but produced zero measurable off-site signal — this is the single largest lever on the composite score given its 20% weight and current near-zero value.

### Content E-E-A-T (61/100)
Experience/expertise signals are genuinely strong — zero generic AI-filler phrases detected across the sample, and content shows real case-pattern granularity (e.g., specific detail on which device-overlap patterns trigger related-account reviews). Freshness is excellent: every post carries real, recent `article:published_time`/`modified_time` (June–July 2026). The critical gap is trust signals: the site's credibility narrative doesn't hold together (Jeff Goldin positioned as anchor but not author or linked founder), there's no `/about` page, and 6 of 8 posts cite zero external authoritative sources despite interpreting Amazon policy. Word counts (592–1,031) are tight and non-padded but thin for genuinely comprehensive appeal-process topics.

### Technical GEO (93/100)
The July 14 critical issue — sitemap/llms.txt pointing at soft-404s — is verified fixed: distinct byte sizes confirmed at `/`, `/blog/`, and a sample post; a fake URL correctly returns 404 instead of the old 200-everywhere bug. All 41 sitemap URLs diff cleanly against live blog-index links with zero mismatches. CSP header now shipped alongside existing HSTS/X-Frame-Options/Referrer-Policy. Fonts are self-hosted and preloaded, static assets cache with `immutable`, Brotli compression confirmed. Remaining gaps are minor: `/old/` needs `X-Robots-Tag: noindex` for defense in depth, and the redirect chain should collapse from 2 hops to 1.

### Schema & Structured Data (65/100)
Coverage is strong for the site's size — Organization, WebSite, and FAQPage on the homepage; Organization, Article, BreadcrumbList, and (mostly) Person on blog posts; all valid JSON-LD, server-rendered, no syntax errors. Article blocks are unusually complete (`headline`, `dateModified`, `mainEntityOfPage`, `author`/`publisher` via `@id` reference). The gaps are structural rather than cosmetic: no Service/ProfessionalService schema for the core offering, thin `sameAs` (2 links total), and Person schemas for authors that carry only name/title with no verification properties.

### Platform Optimization (57/100)
| Platform | Score |
|---|---|
| Google AI Overviews | 68/100 |
| ChatGPT Web Search | 62/100 |
| Perplexity | 58/100 |
| Google Gemini | 50/100 |
| Bing Copilot | 48/100 |

Crawler access is perfect across the board (highest-scoring shared factor). AI Overviews scores best due to tight FAQ answer lengths but is held back by zero `<table>` elements despite inherently tabular content. Gemini and Bing Copilot score lowest, reflecting the same off-domain ecosystem gap seen in Brand Authority — no YouTube, Google Business Profile, Bing Webmaster verification, or Knowledge Panel indicators.

---

## Quick Wins (Implement This Week)

1. **Convert existing pricing/comparison prose into real `<table>` markup** across the blog — the facts are already written (cost tiers, repricing models), this is pure formatting with no new research, and it's the highest-leverage fix for AI Overviews/Gemini snippet extraction.
2. **Add `Service`/`ProfessionalService` schema** describing the core appeal-consulting offering (name, description, provider, areaServed, offers).
3. **Expand llms.txt to enumerate all 41 URLs** (or ship an `/llms-full.txt`) instead of linking `/blog/` generically.
4. **Add `X-Robots-Tag: noindex` on all `/old/*` responses** — closes the one residual index-leakage path from the July migration.
5. **Add inline links to Amazon's actual policy pages** in the 6 sampled posts that currently cite none, starting with the IP-complaint and related-account posts.

## 30-Day Action Plan

### Week 1: Close the schema and technical gaps
- [ ] Add Service/ProfessionalService schema
- [ ] Expand Organization `sameAs` (add any real, live profiles — don't fabricate)
- [ ] `X-Robots-Tag: noindex` on `/old/*`
- [ ] Collapse the redirect chain to one hop

### Week 2: Fix the credibility narrative
- [ ] Build a real `/about` page naming the actual founders team (Khushi Narwal, Apeksha Namdev, Aayush Namdev) with individual bios
- [ ] Resolve the Jeff Goldin positioning — either have him author/co-author cornerstone posts and link a real, verifiable profile, or adjust homepage copy so it doesn't imply he's the operational voice
- [ ] Standardize blog bylines to named Person authors (currently 4 of 8 sampled default to generic "Appeal Edge")

### Week 3: Citability packaging pass
- [ ] Convert comparison prose to `<table>` markup across published posts
- [ ] Add inline citations to Amazon's policy pages on the 6 posts currently missing them
- [ ] Add a legal disclaimer to pricing/policy-interpretation posts

### Week 4: Off-domain brand signal (the biggest lever, longest lead time)
- [ ] Set up a Bing Webmaster Tools account + IndexNow key
- [ ] Begin authentic, non-promotional participation in r/AmazonSeller / r/FulfillmentByAmazon where genuinely relevant
- [ ] Pursue one earned press or review-site listing (G2/Trustpilot) to create a citable third-party source

---

## Appendix: Pages Analyzed

| URL | Notes |
|---|---|
| `/` | Organization, WebSite, FAQPage schema; strong technical baseline |
| `/blog/` | Organization, Blog schema listing 36 posts |
| `/blog/amazon-related-account-suspension-appeal/` | Strong case-pattern specificity; author = Organization |
| `/blog/amazon-appeal-service-cost/` | Highest-citability FAQ passage found; no external citation; no disclaimer |
| `/blog/amazon-ip-complaint-suspension-appeal/` | No external policy citation |
| `/blog/ai-generated-amazon-listings-without-suspension-risk/` | No FAQPage (confirmed non-issue — no genuine Q&A content to mark up) |
| `/blog/amazon-repricing-software-guide/` | Only post citing Amazon's Fair Pricing PDF |
| `/blog/amazon-rufus-generative-search-ai-optimization/` | No FAQPage (same non-issue as above) |
| `/blog/used-sold-as-new-plan-of-action-template/` | Sampled for content depth |
| `/blog/amazon-seller-of-record-explained/` | Only other post with an external citation (sell.amazon.com) |
| `/privacy-policy/` | Organization, WebSite, WebPage, BreadcrumbList |
| `/terms/` | Organization, WebSite, WebPage, BreadcrumbList |

**Not sampled but present in sitemap:** 27 additional blog posts (AI-for-sellers cluster, remaining suspension-appeal-type guides, repricing/inventory tooling guides) — all confirmed live and correctly listed via sitemap-to-blog-index diff during the technical audit, but not individually schema/content-reviewed in this pass.
