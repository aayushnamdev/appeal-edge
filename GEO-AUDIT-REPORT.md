# GEO + SEO Audit — appeal-edge.com

**Date:** 2026-07-14 (audited immediately after today's frontend-v2 relaunch)
**Scope:** Full site — homepage (live), `/old` (archived frontend-trial), `/blog/*` (orphaned)

---

## Composite GEO Score: 40 / 100 — Needs Work

| Category | Weight | Score | Weighted |
|---|---|---|---|
| AI Citability & Visibility | 25% | 71/100 | 17.75 |
| Brand Authority Signals | 20% | 5/100 | 1.00 |
| Content Quality & E-E-A-T | 20% | 41/100 | 8.20 |
| Technical Foundations | 15% | 61/100 | 9.15 |
| Structured Data | 10% | 5/100 | 0.50 |
| Platform Optimization | 10% | 37/100 | 3.70 |
| **Composite** | | | **40.3** |

**Read on the number:** the new page itself is well-built (clean semantic HTML, fast, mobile-fine, wide-open crawler access, a genuinely strong credentials block). The score is dragged down almost entirely by three things that are cheap to fix: **zero structured data, a broken-by-migration routing layer, and a brand that's externally invisible under its current name.** This is a fixable-this-week problem, not a rebuild problem.

---

## The one bug that's costing the most, and I put it there

All five subagents independently found the same root cause: **today's server.js change (frontend-v2 → root, frontend-trial → `/old`) has no fallback 404.** `app.get('*', ...)` sends `frontend-v2/index.html` for literally any unmatched path, at HTTP 200. This silently breaks three separate things at once:

- **`sitemap.xml`** still lists `/blog/` and the shoe-brand case study — both now return byte-identical homepage HTML (same content-length, same ETag) instead of real content.
- **`/llms.txt`** — confirmed via curl, the live URL returns the homepage's `text/html`, not the actual `public/llms.txt` file (which was never committed to git, so it was never deployed regardless).
- **Any nonexistent URL** on the whole domain (tested `/this-page-does-not-exist-xyz123`) — also 200s with the homepage. Any stale backlink, old bookmark, or crawler-guessed path hits this.

I can fix the routing/404 half of this immediately (it's a `server.js` change, same category of work as the mobile fixes earlier). **The sitemap and llms.txt content need your input first** — see decisions below.

---

## Two things I found that need your decision, not my assumption

**1. Founder identity conflict.** The orphaned case-study post's schema (`frontend-trial/blog/inauthentic-shoe-brand-reinstated-17-days/index.html`) names **you, Aayush Namdev, as Founder** (`"jobTitle": "Founder"`). The live site's entire trust narrative is Jeff Goldin founding the company in 2014. If that page ever gets re-linked or re-crawled, an AI system would see two different people claimed as the same company's founder. I'm not touching this — I don't know the actual org structure (are you the business owner and Jeff the lead expert/co-founder? Is "Founder" on that old page simply wrong?). Tell me the real answer and I'll make the schema consistent everywhere.

**2. Jeff Goldin's external identity.** Independent web research (by the ai-visibility subagent, not verified further by me) surfaced that Jeff Goldin has a real, established LinkedIn under **"CEO, Sellercare, LLC"** — a different brand name — and that Sellercare's own marketing makes the identical "first company to pioneer Amazon appeals in 2014" claim. If accurate, this means Jeff's actual public reputation and any existing backlinks/mentions live under "Sellercare," completely disconnected from "Appeal Edge." I have not added any `sameAs` link to that LinkedIn profile or asserted this connection anywhere — that's a real-world business-relationship fact only you and Jeff can confirm (Is Sellercare still active? Is Appeal Edge a rebrand of it, a sister brand, or unrelated?). Once you confirm, this is genuinely the highest-leverage brand-authority fix available (inheriting years of real reputation vs. building from zero) — but I won't guess at it.

---

## Category Breakdown

### AI Citability & Visibility — 71/100
- **Strongest asset on the whole site:** the credentials list (2014 / 25+ / 7 marketplaces / 2008 conference / "Direct" escalation) — scored 78/100, clean, specific, quotable.
- Crawler access is wide open (100/100) — `robots.txt` is a blanket `Allow: /`, every major AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot, etc.) is implicitly allowed.
- Weakest citability blocks: the "who we help" problem rows and FAQ answers for cost/timeline — both deliberately hedge with no concrete number, which is honest but gives AI models nothing specific to cite. (This was a deliberate decision on the relaunch — "no invented numbers" — so it's a tradeoff, not a mistake, but worth knowing it costs citability.)
- `llms.txt` scores 0/100 in practice — see routing bug above.

### Brand Authority Signals — 5/100
- Zero presence confirmed via direct checks: no Wikipedia/Wikidata entry for "Appeal Edge" or "Jeff Goldin," no Reddit threads, no YouTube, no Trustpilot/G2 reviews.
- LinkedIn company page exists (linked in footer) but appears new/unpopulated.
- This category has the single biggest fix available if the Sellercare-identity question above resolves in your favor — real years of external reputation may already exist, just under a different name.

### Content Quality & E-E-A-T — 41/100
- Jeff's bio has genuinely specific, checkable claims (2008 Japan Conference invite, 7 named marketplaces) — a real strength, reads as authored by a human, not AI-generic.
- Whole live site is one page, ~718 words. No case studies, no About page, no privacy policy/ToS (confirmed absent via full-text search), no visible publish/update date.
- The orphaned shoe-brand case study (specific dates, unit counts, dollar figures, an honest "what we'd do differently" section) is a strong E-E-A-T asset sitting unused — pending the founder-identity fix above.

### Technical Foundations — 61/100
- Real strengths: SSR/no JS-dependency (15/15), security headers all confirmed actually reaching the response (X-Frame-Options, CSP missing though), mobile/viewport setup solid, CLS-safe image handling.
- Dragged down by: the sitemap/soft-404 issue, no canonical tag, a stale `Last-Modified: 2018` header, and a redirect chain with a 307 where a 301/308 belongs.

### Structured Data — 5/100
- Zero JSON-LD anywhere on the live site, confirmed directly on the rendered HTML.
- A ready-to-paste `Organization` + `Person` (Jeff Goldin) + `FAQPage` + `speakable` block was generated using only verified, real values (Instagram, LinkedIn, the 5 actual FAQ answers) — no fabricated founding dates or addresses. Sitting in the schema subagent's output, ready for your review before I insert it, specifically because of the founder/identity question above.

### Platform Optimization — 37/100
- Best-positioned: ChatGPT Web Search (53/100) — open crawler access + naturally quotable FAQ copy even with no schema.
- Worst-positioned: Google Gemini (21/100) — near-total absence from Google's ecosystem (no YouTube, no GBP, no schema `sameAs`).
- FAQ content lives inside `<details>/<summary>` with no heading structure — easy fix, turns 5 answer-ready blocks into real extractable H3s.

---

## Prioritized Action Plan

### Fix now (I can do these — code/content changes, no external facts needed)
1. **Add a real 404 handler to server.js**, or a `/blog` route serving actual content — resolves the sitemap, llms.txt-routing, and orphan-page problems in one change.
2. **Add `<link rel="canonical">`** to the homepage.
3. **Convert the FAQ `<summary>` text into visible `<h3>` headings** (keep `<details>` for the accordion UX) — makes 5 answer blocks AI-Overview-extractable.
4. **Add a `Content-Signal` directive to robots.txt** if you have a preference on AI training vs. retrieval use.

### Needs your decision first (I'll act the moment you answer)
5. **Resolve the founder-identity conflict** (you vs. Jeff, on the orphaned blog post) — then I'll make the Organization/Person schema and any republished case-study content consistent.
6. **Confirm or deny the Jeff Goldin ↔ Sellercare, LLC connection** — determines whether we bridge to an existing reputation or build brand authority from zero.
7. **Rewrite `public/llms.txt`** to match the live site (current pricing model is "no pricing shown," current email is `contact@`, not `social@`) — needs your current pricing-disclosure stance, since the live FAQ deliberately keeps pricing off-page.
8. **Insert the generated Organization + Person + FAQPage JSON-LD** — ready to paste, held pending #5/#6 above so the `founder` field and Person `sameAs` aren't wrong on day one.
9. **Decide whether to republish the shoe-brand case study** — it's a strong, specific, real asset, but its schema needs the founder fix first.

### Medium-term (marketing/content work, not this session's scope)
10. Pursue a Wikipedia mention, build Reddit/community presence, record one YouTube video with Jeff — the highest-leverage off-page moves per the platform analysis, but they're ongoing marketing work, not a one-time fix.
11. Build 2-3 subtopic guide pages (Section 3, IP complaints) for topical authority.
12. Add a privacy policy and terms of service page.

---

*Full per-category subagent detail (citability scoring, brand-mention platform table, technical evidence with curl output, complete JSON-LD block) is preserved in this session — ask if you want any of it expanded into its own file (e.g. `GEO-SCHEMA-REPORT.md`, `GEO-TECHNICAL-AUDIT.md`).*
