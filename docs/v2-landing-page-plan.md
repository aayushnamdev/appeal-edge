# V2 Landing Page — Build Plan

## Design Direction

**Aesthetic:** Editorial precision meets forensic severity. Less "warm SaaS startup", more "financial crime investigation firm". Think Bloomberg Terminal crossed with a luxury legal publication.

**Typography:**
- Display/Headlines: `Bebas Neue` — all-caps condensed, massive weight, pure authority
- Body: `IBM Plex Sans` — clean, technical, legible
- Monospace/Widget: `IBM Plex Mono` — colder and more clinical than DM Mono

**Color shift from V1:**
- Base: `#09090c` (near-black with a cold blue undertone, not warm brown)
- Surface: `#111116`
- Red accent: `#e8130d` (same family, slightly colder/more electric)
- Orange: `#f04d1a`
- Text: `#f0efe8` (slightly warm white, not pure white)
- Muted: `#5a5a6a`
- Border: `rgba(255,255,255,0.08)` (thin cool white lines)

**Card design:** 2–4px border radius max. No rounded-everything. Sharp rectangular panels with thin border lines. Grid-ruled dividers.

**Buttons:** Thick outline (2px border) + fills solid on hover. No pill shapes except one accent. No rounded blobs.

**Animations:** More mechanical and precise. `cubic-bezier(0.22, 1, 0.36, 1)` instead of spring. Stagger feels like a typewriter/print press, not a gentle fade.

---

## Phase 1 — Shell + Design System + Nav

**File:** `/public/New Landing Page Complete Structure.html`

Build:
- Full `<head>` with Google Fonts (Bebas Neue, IBM Plex Sans, IBM Plex Mono)
- Complete CSS custom property system (all colors, spacing, type scale, shadows)
- Global resets and base styles
- Full button system (5 variants: primary filled, outline, ghost-dark, pricing-outline, pricing-filled)
- Fixed nav with: SVG logo, 3 links, "Book a free call" outline button, hamburger (3-line, not dots), mobile dropdown
- Sticky scroll behavior (transparent → dark glass)
- All reveal animation scaffolding (`.fade-up`, `.fade-in`, delay utilities)

---

## Phase 2 — Hero Section + Scan Widget

Build:
- Hero: 2-col grid (55% text / 45% widget). Large Bebas Neue headline spanning ~3 lines with a red slash or line accent. Badge pill. Subtext in IBM Plex Sans. Two CTAs.
- Scan widget: Colder aesthetic — `#060608` base, thin red top border line, `IBM Plex Mono` throughout. Same functional states but redesigned visually:
  - Input state: textarea + file upload + submit
  - Loading state: 5-step mechanical stepper
  - Results state: classification badge, synthesis, win-rate rings (SVG animated), price comparison bars, why-us block, CTA block (complexity routing)
  - Error state
- All JS logic for widget: file upload, pills, stepper, form submit, ring animation, price bar animation, counter animation, Cal.com re-init on dynamic buttons

---

## Phase 3 — Case Library

Build:
- Section between Hero and How It Works
- Sharp panel design: full-width container with thin border, no rounded card
- Header row: "8X" large Bebas Neue kicker + headline + counter "01 / 08" right-aligned
- 8 tab buttons (horizontal row, active = red underline + filled)
- Case card area: each card shows label (monospace tag), hook text, "what Amazon needs" block, strategy text
- Footer row: case hint text (left) + "Get your free case scan →" button (right)
- JS: tab click switches card, swipe support (touchstart/touchend), updates counter and hint

**8 cases:**
1. IP Infringement
2. Inauthentic / Counterfeit
3. Performance Metrics
4. Related Account
5. Review Manipulation
6. INFORM Consumers Act
7. Fair Pricing
8. Restricted Products

---

## Phase 4 — How It Works + Testimonials

Build:
- "Three steps to freedom." section: H2 with Bebas Neue, animated SVG circle around "FREEDOM". 3 cards in sharp grid — icon (sharp square container, not pill), title, body. Hover: red left border appears.
- Testimonials: asymmetric layout. Left: large opening quote mark (Bebas Neue, massive, red), then quote text, author row. Right: headline + paragraph + 3 checkmark items. Orange accent panel variant.

---

## Phase 5 — Pricing + Tickers + Footer

Build:
- Pricing: NOT classic 3-box SaaS layout. Instead: full-width table/editorial style. Each tier is a horizontal row or a large-number card. "Most Popular" label is a rotated badge on the Rush card. All PayPal links.
- Two ticker banners: same content, different visual treatment — maybe a thin border top/bottom instead of solid fill, or a full-bleed version with large Bebas Neue text
- Footer: pure `#000000`. Large Bebas Neue headline left. Links right. Bottom bar: logo + disclaimer + copyright.

---

## Phase 6 — Polish + Mobile Responsive

Build:
- All `@media` breakpoints (1024px tablet, 768px mobile, 480px small)
- Mobile: nav → hamburger dropdown, hero stacks, scan widget full-width, case tabs scroll horizontally, pricing cards stack, tickers flatten (no rotation), footer stacks
- Final animation pass: stagger delays, reveal triggers verified
- Cal.com script tag at bottom
- Meta tags, OG tags, favicon refs, canonical

---

## File Output

Single self-contained file: `public/New Landing Page Complete Structure.html`
All CSS in `<style>` block. All JS in `<script>` block at bottom. No external files except Google Fonts CDN + Cal.com embed script.
