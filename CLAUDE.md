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
- **No invented numbers.** Do not add case counts, dollar figures or percentages. The only confirmed figures are 20+ years of combined Amazon experience across a panel of specialists, working the US, UK, Europe and India. Do not name panel members publicly.

## Logo and layout

- Header logo: `/assets/logo/appeal-edge-logo.png` via `<a class="brand"><img class="brand-logo" ...></a>`. On dark or navy sections (footer) use `appeal-edge-logo-white.png`. Never put the color logo on dark or the white one on light.
- The homepage uses relative asset paths. Nested pages (blog posts) must use root absolute paths (`/assets/logo/...`).
- Every page carries the fixed right side social rail (Instagram, LinkedIn, WhatsApp, email) through a `.social-rail` CSS block in its inline `<style>`. There is no shared template, so copy it from an existing page into any new page.
