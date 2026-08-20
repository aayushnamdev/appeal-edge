# GEO Handoff — 2026-08-20

Full plan: `/Users/aayushnamdev/.claude/plans/do-a-geo-for-breezy-harp.md` (read this first, it has the complete diagnosis and phase breakdown).

## Goal

Make ChatGPT, Claude and Gemini surface and recommend Appeal Edge for Amazon suspension appeal queries. Scope was explicitly limited to on-site/in-repo work only (off-domain plays like directory listings, Trustpilot, Reddit were flagged as the ceiling on this approach but excluded from scope by user decision).

## Where things stand

### Live on production (`main`, deployed)
- **Phase A** — the 4 Amazon appeal service pages + `/experts/jeff-goldin/` (previously built but sitting unmerged, returning 404). Merged and pushed 2026-08-18, confirmed 200 on all 6 URLs.

### Pushed to GitHub, NOT merged to main, NOT deployed
Branch: **`seo/geo-entity-foundation`** (origin has it, in sync with local as of 2026-08-20).

Three commits on top of `main`:
1. `943c463` — **Phase C1**: enriched the Organization JSON-LD node across all 77 pages (description, email, sameAs, areaServed, knowsAbout, contactPoint, typed as `["Organization","ProfessionalService"]`). Homepage additionally got a `founder` reference + inline Person stubs for the 3 co-founders. Script: `scripts/upgrade-org-schema.js`.
2. `cb5bcc6` — **Phase C2**: built `frontend-v2/about/index.html`, the site's first `/about/` page. Covers what Appeal Edge is/isn't, how a case is handled, the 3 founders (role-based bios), and Jeff as advisor. Wired into nav/footer (all 78 pages, via updated `scripts/inject-partial.js`), sitemap, and `llms.txt`.
3. `1680771` — **Phase F**: expanded `robots.txt` to explicitly name `Claude-User`/`Claude-SearchBot` (the citation-driving crawlers, not just `ClaudeBot`) plus Perplexity-User/Meta-ExternalAgent/Bingbot. Fixed blog index schema drift: 10 missing posts added, `Article`→`BlogPosting` type unified across all posts. Script: `scripts/sync-blog-schema.js`.

**Why this wasn't merged to main:** this batch puts founder bios and photos live for the first time. Khushi Narwal and Apeksha Namdev don't have headshots yet, so their `/about/` cards use initials placeholders. Wanted a human look before it goes to production. **This is the first decision to make when picking this up: review `frontend-v2/about/index.html` (or run `node server.js` and hit `localhost:3003/about/`), then `git checkout main && git merge --no-ff seo/geo-entity-foundation && git push origin main` to ship it.**

## Blocked, needs input before continuing

- **Phase C3** (author pages for the 3 founders with real `Person.sameAs`): needs LinkedIn URLs and a headshot for each of Khushi Narwal, Apeksha Namdev, Aayush Namdev. Without `sameAs` the Person nodes stay unresolvable to AI systems and this phase loses most of its value. Do not fabricate these.
- **Phase C5** (giving Jeff Goldin's Person node a `sameAs`/resolvable identity): his public LinkedIn (`linkedin.com/in/jeff-goldin-b3141a13`) lists him as **CEO of SellerCare LLC**, an active competitor. The user chose "build Appeal Edge as its own entity" over "get his LinkedIn updated" when this was asked. Adding his personal LinkedIn as `sameAs` would assert the SellerCare affiliation into structured data, which cuts against that decision — did not do this without an explicit go-ahead. Needs a decision: disclose the SellerCare affiliation openly on his page (recommended — an AI that discovers the contradiction on its own discounts the whole site; one that finds it disclosed does the opposite), leave his page as-is with no sameAs, or something else.
- Also open: additional `Organization.sameAs` profiles (YouTube/Facebook/Crunchbase/GBP) if any exist, and Appeal Edge's own founding date/location if the user wants it stated (currently the site only ever credits 2014/25yrs/7 marketplaces to Jeff personally, never claims Appeal Edge itself dates that far back — keep that distinction if adding a founding date later).

## Not started (unblocked, ready to pick up any time)

- **Phase C4**: reassign the 30 org-bylined blog posts (no human author in schema) to whichever founder actually owns that subject.
- **Phase D**: citability packaging — move "Quick answer" blocks above the byline on all posts (31 posts have none, write them), convert ~15-20 posts' comparison prose to `<table>` (start with `blog/amazon-appeal-service-cost/`, which already has concrete price ranges in prose and zero tables — highest single-page win on the site), add outbound citations to `sellercentral.amazon.com` (currently zero site-wide despite the whole business being policy interpretation), add visible "Last updated" dates.
- **Phase E**: two new comparison/selection pages (`/how-to-choose-an-amazon-appeal-service/`, `/amazon-appeal-lawyer-vs-consultant/`) designed to be genuinely useful rather than self-promotional, since that's what gets cited over competitor listicles.

## Diagnosis reference (why any of this matters)

- Searching `"Appeal Edge"` externally returns **Edge Appeal Inc, a landscaping contractor in Irwin, PA** (BBB/Manta/YellowPages/ZoomInfo corroborated) — worse than invisible, since real third-party data points at the wrong company.
- Jeff Goldin's only external identity is as SellerCare's CEO; he appeared in 0 of 67 blog posts before this work.
- "Best Amazon appeal service" queries are answered by AI almost entirely from third-party listicles (sermondo.com Top 11, spctek Top 5) and Trustpilot — Appeal Edge is on none of them. This is the ceiling on-site work alone can reach.
- Content quality gaps found: 5/67 posts had a table, ~0 outbound citations per post, every sampled intro paragraph promised the answer rather than stating it, 43/67 posts have never been revised since publish.

## Tooling added this session (reusable going forward)

- `scripts/upgrade-org-schema.js` — structurally patches the Organization JSON-LD node sitewide (parse/merge/reserialize, not string replace).
- `scripts/sync-blog-schema.js` — rebuilds the blog index's `Blog.blogPost` array from what's actually on disk, unifies Article/BlogPosting typing.
- `scripts/inject-partial.js` — pre-existing, now also carries the "About" nav/footer link. Still the pattern for any future sitewide nav/footer change.
- `scripts/build-sitemap.js` — pre-existing, unchanged, rerun after any page additions.

Run all three read-only (no `--write`) first to preview before applying.

## Verification already done

- All JSON-LD across the site re-parses cleanly after every write (checked with a Python JSON.loads sweep each time).
- No stray hyphens in any new/modified visible copy (content standard: no dashes anywhere in visible text; checked title/meta/OG/Twitter/JSON-LD text fields too, not just body).
- All touched routes return 200 on local `node server.js` (port 3003).
- Diffs confirmed confined to intended regions (schema script blocks only, or nav/footer marker regions only) via `git diff`.

Not yet done: re-running the entity-grounding searches (the `"Appeal Edge" Amazon suspension appeal` / "best Amazon appeal service" prompts) against the deployed result once this branch ships, to see if anything moved. Expect this to lag deployment by weeks regardless.
