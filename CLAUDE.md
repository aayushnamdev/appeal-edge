# Appeal Edge website

The live site is `frontend-v2/`, served by `server.js`. Each folder in `frontend-v2/` is a page (for example `blog/`, `amazon-appeal-service/`). Every push to `main` deploys to production on Vercel, so check changes locally with `npm run dev` (http://localhost:3000) before pushing, and `git pull` before starting work.

Do not edit `server.js`, `api/` or `vercel.json` unless the task is specifically about them.

## Working in this repo

- The repo is public. Never commit `.env` or any API key.
- Pushing to `main` deploys live within a minute or two. Check every change locally first.
- The analyzer and lead form need a local `.env`. Ask Aayush for it. Production keys already live in Vercel.
- Stage files by name. Do not use `git add .`, because the working folder can hold local only files.

## Content standards

- **No connecting dashes in visible copy.** No hyphens, em dashes or en dashes, even in compound words. Rephrase instead (`well written`, `A to z`, `WiFi`). Check meta description, og, twitter and JSON-LD tags too, not just body text. Existing live URL slugs are the one exception: never rename a published slug.
- **Tone is bold, confident and factual.** Short, punchy statements, never passive or hedged, never inflated.
- **No invented numbers.** Do not add case counts, dollar figures or percentages beyond the confirmed list below. Do not name panel members publicly.
- **Confirmed facts** (confirmed by Likith, Head of Operations):
  - 20+ years of combined Amazon experience across a panel of specialists.
  - 300+ suspended accounts reinstated.
  - Likith has 5+ years in the Amazon ecosystem.
  - Case study: $340,000 in disbursements unlocked, 38 hours to reinstatement.
  - Do not use the "98% pre scan diagnostic accuracy" claim. It is not confirmed.
- **Regions.** Always use these seven: US, UK, EU, Canada, Mexico, Australia and India. This applies to visible copy and to schema `areaServed`. Do not list any other country (no Japan, Germany, France or Italy).

## Logo and layout

- Header logo: `/assets/logo/appeal-edge-logo.png` via `<a class="brand"><img class="brand-logo" ...></a>`. On dark or navy sections (footer) use `appeal-edge-logo-white.png`. Never put the color logo on dark or the white one on light.
- The homepage uses relative asset paths. Nested pages (blog posts) must use root absolute paths (`/assets/logo/...`).
- Every page carries the fixed right side social rail (Instagram, LinkedIn, WhatsApp, email) through a `.social-rail` CSS block in its inline `<style>`. There is no shared template for the site pages, so copy it from an existing page into any new page. Blog posts get it from `templates/blog-post.html`.

## Blog

The blog (`/blog/` and every post) shares one stylesheet, `frontend-v2/css/ae-blog.css`, built from the homepage fonts, colours and components. Change the blog look there once and every post follows. The `.social-rail` block stays inline on each page.

### Adding a blog post
1. Run `node scripts/new-blog-post.js --example > post.json` and fill it in. Default author is Likith, Head of Operations.
2. Run `node scripts/new-blog-post.js post.json` (dry run: checks the 60 character title, no dashes, new slug), then add `--write`.
3. The script builds the page from `templates/blog-post.html`, adds the card to `/blog/`, makes the og image, and regenerates the blog schema, `sitemap.xml`, `llms.txt` and `llms-full.txt`.
4. Check the post at http://localhost:3000/blog/your-slug/ on desktop and mobile, then stage the changed files by name.

Other scripts: `upgrade-org-schema.js` (Organization schema, regions and sameAs on every page), `inject-partial.js` (nav and footer links), `build-og-images.js`, `build-llms.js`, `build-sitemap.js`, `sync-blog-schema.js`. Each runs as a dry run until you pass `--write`.

