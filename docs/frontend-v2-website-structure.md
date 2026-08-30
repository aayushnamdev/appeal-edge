# Appeal Edge — v2 Landing Page Structure

> **Superseded 2026-08-30.** This is the original design brief from when the site was first built, when Jeff Goldin was still the site's named advisor and SellerCare's Brand Bible was the design reference. Jeff Goldin is no longer affiliated with Appeal Edge in any capacity. Every mention of him below (hero, Expert section, footer line, CTA copy) reflects that original build, not the current live site. The live homepage now runs an unnamed specialist panel section (`#specialists`) with 20+ years of combined experience across the US, UK, Europe and India, and `/experts/jeff-goldin/` has been replaced by `/experts/`, a page describing that panel with no named individuals. Kept here as historical record only.

> Planning document. Approve/adjust this before any HTML is written.

---

## 0. Decisions locked

| Decision | Choice |
|---|---|
| **Brand name** | **Appeal Edge** (Jeff Goldin is the named expert *behind* it; SellerCare / 25-yr history = credibility, not the site name) |
| **Design system** | **SellerCare Brand Bible** — white canvas, deep-navy authority, electric-blue action, rare amber, dark proof zones |
| **Primary conversion** | **Submit case details form** — seller describes the suspension + uploads the Amazon notice; we follow up. No pricing on the page. |
| **Removed** | ❌ Pricing tiers · ❌ AI free scan / neural scan modal · ❌ invented stats |
| **Proof rule** | Only Jeff's verifiable facts. No revenue $, no % success rate until confirmed. |

### The one job of this page
Make a stressed, suspended seller feel — within 3 seconds — that they've reached *the person who invented this industry* and can hand their problem over. **Credibility first, then a low-friction way to describe their case.**

---

## 1. Design tokens (from Brand Bible §9)

```
Navy (authority)      #0A2540   headlines, nav, proof blocks, footer
Navy gradient partner #0E2E52
Squid Ink (bridge)    #232F3E
Electric Blue (action)#2B50FF   buttons, links, key figures, focus
Electric Blue hover   #1E3AE0
Signal Amber (rare)   #F5A623   1–2 touches per screen max
Ink (body)            #1A2433
Slate Grey (meta)     #5B6675
Mist (tinted panel)   #F4F7FB
Hairline (border)     #D9DEE6
White                 #FFFFFF

Display font  Anton / Archivo Black (UPPERCASE, condensed — impact only)
Body font     Inter (17–19px, line-height 1.6)

Radius   card 18px · button 12px
Shadow   navy-tinted, never black (e1/e2/e3)
Section  white → mist → white → NAVY proof → repeat
Ratio    60% white · 30% navy · 8% blue · 2% amber
```

**Guardrail:** when unsure, subtract color. Amber never competes with amber.

---

## 2. Page flow (top → bottom)

```
NAV  (sticky, transparent → white on scroll)
 1. HERO ................... calm command + who Jeff is, at a glance
 2. THE EXPERT ............. ★ MAIN credibility block — Jeff Goldin, photo + bio
 3. PROOF STRIP ............ dark navy zone, verifiable facts only
 4. WHO WE HELP ............ names the seller's exact situation (empathy, brief)
 5. HOW IT WORKS ........... 3 steps, expert-led, ends at the case form
 6. WHAT WE HANDLE ......... suspension types / case categories
 7. CASE FORM .............. ★ MAIN conversion — "Understand your case"
 8. FAQ .................... trust + objection handling
 FOOTER ................... contact, Jeff's line, disclaimer
```

Rhythm: `white(hero) → white(expert) → NAVY(proof) → mist(who) → white(how) → mist(handle) → NAVY(form) → white(faq) → NAVY(footer)`

---

## 3. Section-by-section spec

### NAV
- Left: **Appeal Edge** wordmark, amber dot accent.
- Center: `The Expert` · `How it works` · `What we handle` · `FAQ`
- Right CTA (blue pill): **Get your case reviewed** → scrolls to Case Form.
- No "Pricing", no "Free Analyzer".

---

### 1. HERO — *calm command*
- **Eyebrow (grey caps):** THE REINSTATEMENT FORCE
- **Headline (display, navy):** `SUSPENDED ISN'T OVER.`
  sub-line (lighter): We recover your account, your inventory, and your funds.
- **Sub-copy (ink, ≤2 lines):** "The specialist who pioneered Amazon account reinstatement in 2014 reviews your case personally. 25 years. Thousands of accounts. One path back."
- **Primary CTA (blue):** Get your case reviewed → Case Form
- **Secondary (text link):** Read Jeff's background → The Expert
- **Trust line under CTA (small, no invented numbers):** "Founder of the world's first Amazon appeal firm · US · UK · EU · JP marketplaces"
- **Visual (right):** Jeff's photo in an elevation-3 card against a soft electric-blue radial glow (Apex-style), name + credential caption. *No dashboard mockup — the human face is the hero.*

> Voice check: calm command, no hype, one obvious action.

---

### 2. THE EXPERT — ★ main credibility (this is the point of the page)
Full-width white section, generous space. Two-column on desktop.

**Left — photo:** `assets/jeff-photo.jpeg`, elevation-3 card, navy-toned framing, optional amber corner accent.

**Right — the authority story:**
- **Name / title:** Jeff Goldin — Amazon Compliance, Brand Protection & Suspension Prevention Expert
- **One-line proof:** "Founded the world's first Amazon appeal & reinstatement company in 2014 — and wrote the playbook the industry copied."
- **Bio paragraph** (from his real bio): 25+ years on Amazon; account health, policy compliance, seller performance, suspension prevention across global marketplaces.
- **Credential list (icons, navy/blue):**
  - Pioneered the Amazon appeal & reinstatement industry (2014)
  - Resolved **thousands** of account, ASIN & compliance cases
  - Worked directly with Amazon management to escalate complex cases
  - Experience across US · UK · CA · DE · FR · IT · JP marketplaces
  - Sole US seller invited to the Amazon Japan Conference (2008)
- **Location line (meta):** Aliso Viejo, California · Vietnam · Thailand
- **CTA:** Have Jeff review your case → Case Form

> This section replaces generic "why us" testimonials as the trust engine.

---

### 3. PROOF STRIP — dark navy zone (verifiable only)
Full-bleed navy gradient (`#0A2540 → #0E2E52`), silver-white condensed numerals, amber labels. **Only defensible facts:**

```
25+            2014               7                 1st
YEARS ON       FOUNDED THE        AMAZON            THE INDUSTRY'S
AMAZON         FIRST APPEAL FIRM  MARKETPLACES      FIRST APPEAL CO.
```
- Optional 4th/5th: "THOUSANDS of cases resolved" (word, not fake number).
- ⚠️ No `$` recovered and no `%` success rate until you confirm real figures.
  Placeholder slots noted here but **left out of the live page** per your call.

---

### 4. WHO WE HELP — *name the fear, briefly* (mist section)
Short empathetic intro + 3 quiet cards:
- **Account deactivated** — payouts frozen, losing money daily.
- **ASIN / listing removed** — inauthentic, IP, or condition complaint.
- **Section 3 / performance** — velocity, related-account, or policy flags.

One line each. Then: "Whatever the notice says, there's a defined path out. It starts with reading your case." → CTA to form.

---

### 5. HOW IT WORKS — 3 steps, expert-led (white)
No AI framing. Human specialist framing.
1. **You send your case** — paste the suspension notice + a few details. 5 minutes.
2. **Jeff's team reviews it** — we identify the real root cause and the exact path Amazon requires.
3. **We build & guide your appeal** — a tailored Plan of Action and the follow-through to reinstatement.

Ends with: "No guarantees games — an honest read on where you stand." → Case Form.

---

### 6. WHAT WE HANDLE — case categories (mist)
Chip/grid of suspension types (line icons, navy):
Inauthentic · Intellectual Property (IP) · Used-Sold-as-New / Condition · Section 3 · Related Account · Velocity/Ungating · Restricted Products · Drop-shipping · Review manipulation.
Purpose: reader recognizes their exact problem → confidence we've seen it.

---

### 7. CASE FORM — ★ main conversion ("Understand your case")
Dark navy proof-zone background so it stands out as *the* action. White glassy card, elevation-3.

- **Heading:** Understand your case.
- **Sub:** "Tell us what happened. Jeff's team reads every submission and tells you the real path forward."
- **Fields:**
  - Name
  - Email
  - Marketplace (US/UK/CA/DE/FR/IT/JP/Other)
  - Suspension type (dropdown = §6 categories)
  - Paste the exact Amazon notice (textarea)
  - Upload notice / screenshots (optional file)
- **Submit (blue, or the single amber CTA of the page):** Send my case
- **Reassurance line (grey):** "Confidential. No charge to review. No obligation."
- Wire to existing backend (`server.js` lead capture) — **not** the old AI scan endpoint.

> This is the only form on the page. No pricing shown anywhere.

---

### 8. FAQ (white)
Objection-handling accordion:
- "Do you guarantee reinstatement?" → honest: no one can; here's how we maximize odds.
- "How fast?" → depends on case type; we tell you upfront.
- "What does it cost?" → handled after we review your case (keeps pricing off-page, honest).
- "Is this affiliated with Amazon?" → No. Independent specialists.
- "Who actually works on my case?" → Jeff and his team.

---

### FOOTER — navy
- **Prefooter CTA band:** "Your account is waiting. Let's get it back." + Send my case button.
- Columns: Navigate · Contact (`Tel: +1-949-864-6944`, email, LinkedIn) · Legal.
- Jeff descriptor under logo: **"The Reinstatement Force."**
- **Disclaimer:** "Appeal Edge is an independent consultancy. Not affiliated with, endorsed by, or sponsored by Amazon."
- © 2026 Appeal Edge.

---

## 4. Copy & voice rules (Brand Bible §7)
- Short, certain sentences. Confident about process, honest about outcomes.
- **Never** "we guarantee reinstatement." **Never** invent stats.
- Proof over adjectives. No Amazon logos/boxes/smile arrow — amber accent is the only nod.
- One obvious action per screen.

## 5. Assets
- ✅ `assets/jeff-photo.jpeg` — hero + Expert section.
- ⬜ Fonts: Anton (display) + Inter (body) via Google Fonts.
- ⬜ Line icons (inline SVG, navy/blue, consistent stroke).
- ⬜ Confirm real `$` / `%` proof numbers if you want a stats row (currently omitted).

## 6. Build notes
- Single `index.html` in `frontend-v2/`, self-contained CSS (mirrors current repo pattern).
- Reuse repo's lead-capture endpoint for the Case Form; drop the AI-scan modal + endpoint entirely.
- Mobile: stack all grids to 1 column; hero photo above text.

---

## 7. Open items for you
1. Confirm section order above (esp. Expert as #2, directly under hero).
2. Any real `$ recovered` / `accounts reinstated` numbers to add a stats row? (else omitted)
3. LinkedIn + phone OK to show publicly in footer? (`linkedin.com/in/jeff-goldin-b3141a13`, `+1-949-864-6944`)
4. Should the Case Form email route to Jeff directly, or the existing backend inbox?
