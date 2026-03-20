# Plan v2: Rebalance the Landing Page

## Context

The v1 implementation (Claude Code's `lucky-noodling-riddle.md` plan) correctly applied the copy bible's truth-only philosophy. Fabricated stats are gone, the scan widget no longer shows fake win rates, and the guarantees replaced fake testimonials. The words are right. The structure is wrong.

The page is currently dark-dominant (~60% dark surfaces), competitor-obsessed (5 separate price/comparison references), and missing several key content sections from the copy bible. This plan fixes the structural issues without rewriting any copy.

---

## The 7 problems and their fixes

### Problem 1: Competitor comparison appears 5 times

**Current state:** Competitor pricing or comparison content appears in:
1. Section 3: Standalone price bar chart (light)
2. Scan widget results: Price bars inside results panel
3. Comparison table section: Feature table (dark, "Stop Overpaying For Results")
4. "83% cost savings" and "5x faster" stat boxes next to comparison table
5. FAQ #1 mentions "$1,500 to $3,000" again

**Impact:** The page feels insecure and obsessive about competitors. Confident brands mention price once, devastatingly, then move on.

**Fix:**
- **KEEP** the standalone price bar chart (Section 3). It is visual, immediate, and the strongest version.
- **REMOVE** the entire comparison table section (`#comparison`, lines ~810-873). Delete the `<section id="comparison">` block, including the feature table, "Stop Overpaying For Results" headline, "83% cost savings" box, and "5x faster" box.
- **REMOVE** the dark-to-light gradient transition that follows the comparison table (line ~876).
- **REMOVE** price bars from scan widget results. In `renderResults()`, delete the call to `renderPriceBars()`. Remove the `<div class="mb-6">` block containing `resPriceList` (lines ~613-617). Remove the `renderPriceBars()` function entirely from JS (lines ~1253-1282).
- **KEEP** the FAQ #1 mention of "$1,500 to $3,000" because it answers a direct question about differentiation. This is appropriate context.

**Result:** One visual price comparison (Section 3), one contextual mention (FAQ). Competitor names appear exactly once on the page.

---

### Problem 2: "How it works" is on a dark surface

**Current state:** The 4-step process cards sit on `bg-[#0A0D14]` (dark).

**Impact:** The copy bible and brand identity both specify that informational, trust-building content belongs on light surfaces. Process transparency = "we have nothing to hide" = light background. Dark backgrounds signal drama and emotion, not operational credibility.

**Fix:**
- Change the section background from `bg-[#0A0D14]` to `bg-[#FAFBFC]`
- Change all text colors from dark-theme tokens to light-theme tokens:
  - H2: `text-white` → `text-slate-900`
  - Subtext: `text-on-surface-variant` → `text-slate-500`
  - Step labels ("01", "02"): `text-on-surface-variant` → `text-slate-400`
  - Card H4: `text-white` → `text-slate-900`
  - Card body: `text-on-surface-variant` → `text-slate-500`
  - Kicker: `text-secondary uppercase` → `text-indigo-500 uppercase`
- Change card backgrounds from `bg-surface-container-low` to `bg-white`
- Add card borders: `border border-slate-200`
- Change card hover from `hover:bg-surface-container` to `hover:border-indigo-300 hover:shadow-md`
- Change icon containers from `bg-primary/10 text-primary` to `bg-indigo-50 text-indigo-500` for steps 1-2 and `bg-teal-50 text-teal-600` for steps 3-4 (as specified in copy bible: indigo for analysis steps, teal for creation steps)
- Remove the dark-to-light gradient transition BEFORE this section (line ~513-514). Replace with a simple light-to-light continuation since the preceding section (price comparison) is already light.
- Remove the light-to-dark gradient transition that currently sits between price comparison and how-it-works.

**Gradient transitions after fix:**
- After metrics bar: dark-to-light gradient (already exists, line ~439)
- Price comparison flows directly into How It Works (both light, no transition needed)
- After How It Works: light background continues into scan widget section

---

### Problem 3: The case types section is a grid of empty pills

**Current state:** Eight clickable pills with suspension type names. All scroll to the scan widget. No detail, no tabs, no per-type content.

**Impact:** The copy bible specified a full tabbed section with frequency badges, descriptions, "what Amazon looks for," "our approach," and a CTA per type. This was supposed to be the "yes, we handle your exact situation" confirmation. Currently it confirms nothing.

**Fix:** Replace the pill grid with a tabbed component.

**HTML structure:**

```
<section id="case-types" class="bg-[#FAFBFC] py-24 text-slate-900">

  <!-- Header -->
  <h2>We handle all 8 major suspension types.</h2>
  <p>Select your suspension type to see how we approach it.</p>

  <!-- Tab navigation: horizontal scrollable row -->
  <div class="tab-nav">
    <button class="tab active" data-tab="0">Inauthentic</button>
    <button class="tab" data-tab="1">Performance</button>
    <button class="tab" data-tab="2">IP / Trademark</button>
    <button class="tab" data-tab="3">Related Account</button>
    <button class="tab" data-tab="4">Review Manipulation</button>
    <button class="tab" data-tab="5">INFORM Act</button>
    <button class="tab" data-tab="6">Fair Pricing</button>
    <button class="tab" data-tab="7">Restricted Products</button>
  </div>

  <!-- Tab content card (one visible at a time) -->
  <div class="tab-content bg-white rounded-2xl p-8 border border-slate-200">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="text-xl font-black">Inauthentic / Counterfeit</h3>
      <span class="badge">~35% of suspensions</span>
    </div>
    <p class="description">...</p>

    <h4>What Amazon looks for</h4>
    <p>...</p>

    <h4>Our approach</h4>
    <p>...</p>

    <a href="#scan-widget">Get a free analysis for this case type →</a>
  </div>

</section>
```

**Content for all 8 tabs:** Use exactly the copy from the master copy bible, Part 2, Section 8. All content is already written.

**Surface:** LIGHT (`bg-[#FAFBFC]`). Tab buttons: active = `bg-indigo-500 text-white`, inactive = `bg-white text-slate-600 border border-slate-200`.

**JS:** Simple tab switcher. Click tab → show corresponding content panel, hide others. Active tab gets highlighted style.

---

### Problem 4: Page is 60% dark, should be 70% light

**Current section surfaces:**

| Section | Current surface | Should be |
|---------|----------------|-----------|
| Hero | Dark | Dark (correct) |
| Metrics bar | Dark | Dark (correct) |
| Price comparison | Light | Light (correct) |
| How it works | **Dark** | **Light** |
| Scan widget | Light bg, dark card | Light bg, dark card (correct) |
| Case types | **Dark** | **Light** |
| Guarantees | Light | Light (correct) |
| Pricing | Light | Light (correct) |
| Comparison table | **Dark** | **REMOVE** |
| FAQ | Light | Light (correct) |
| Final CTA | Dark | Dark (correct) |
| Footer | Dark | Dark (correct) |

**After fixes:** Hero (dark) → Metrics (dark) → Price Comparison (light) → How It Works (light) → Scan Widget (light/dark card) → Guarantees (light) → Pricing (light) → Case Types (light) → FAQ (light) → Final CTA (dark) → Footer (dark).

**Ratio after fix:** ~30% dark (hero + metrics + scan card + final CTA + footer), ~70% light. Matches brand identity spec.

---

### Problem 5: Hero right column is decorative noise

**Current state:** The hero has a two-column layout. Right column shows a fake "Account Dashboard" card with placeholder bar charts and a floating "Reinstated: ASIN #B08XJ2K8" badge.

**Impact:** This dashboard mock communicates nothing about Appeal Edge's actual service. It's UI theater. It competes with the headline for attention at the most critical moment on the page. The copy bible specified a single-column, centered hero with no right column because every element in the first 5 seconds must serve the emotional hook.

**Fix:**
- Remove the entire right column `<div class="flex-1 w-full max-w-lg...">` block (lines ~378-410)
- Change the hero layout from `flex-row` two-column to single-column centered:
  - Remove `lg:flex-row` from the flex container
  - Remove `lg:text-left` and keep `text-center`
  - Remove `lg:mx-0` from subtext and buttons (keep centered)
  - Remove `lg:justify-start` from button row (keep `justify-center`)
- Set `max-w-3xl mx-auto` on the text content wrapper for comfortable centered reading width
- The hero now matches the copy bible spec: badge → H1 → subtext → buttons → hint, all centered, no distractions

---

### Problem 6: Section order doesn't match emotional journey

**Current order:**
Hero → Metrics → Price Comparison → How It Works → Scan Widget → Case Types → Guarantees → Pricing → Comparison Table → FAQ → Final CTA

**Problems with current order:**
- Case types sits between scan widget and guarantees, breaking the flow from "free value" to "risk reversal"
- Guarantees are separated from pricing by the case types section. Seller sees "$497" and doesn't immediately see "50% refund guarantee"
- Comparison table (being removed) sits between pricing and FAQ, creating a dead zone

**Fixed order:**
Hero → Metrics → Price Comparison → How It Works → Scan Widget → Guarantees → Pricing → Case Types → FAQ → Final CTA

**Why this order works:**
1. **Hero + Metrics** (dark): Emotional hook + key commitments. 0-5 seconds.
2. **Price Comparison** (light): "We're 80% cheaper." The nuclear weapon. 5-15 seconds.
3. **How It Works** (light): Process credibility. "They know Amazon's system." 15-30 seconds.
4. **Scan Widget** (light/dark card): Reciprocity. Free value. Proof of competence. 30-60 seconds.
5. **Guarantees** (light): Risk reversal. "I can't lose." 60-75 seconds.
6. **Pricing** (light): Decision. Guarantees are fresh in mind. 75-90 seconds.
7. **Case Types** (light): Confirmation. "They handle my exact situation." 90-100 seconds.
8. **FAQ** (light): Final objections cleared. 100-110 seconds.
9. **Final CTA** (dark): Urgency bookend. Act now. 110-120 seconds.

**Key change:** Guarantees now sit directly before pricing. When the seller reads "50% refund if no progress" and then scrolls into "$497, one-time flat fee," the perceived risk is minimal. The case types section moves after pricing because by that point the seller has decided on the service and just needs to confirm their case type is covered.

---

### Problem 7: "83% cost savings" and "5x faster" violate the truth-only rule

**Current state:** Two stat boxes in the comparison table section show "83% Cost Savings vs competitors" and "5x Faster than typical firms."

**Impact:** "83% cost savings" is calculated math ($497 vs $3,000 = 83.4% savings). But this is marketing math presented as a verified statistic. "5x faster" compares your claimed 48-hour turnaround against an assumed 7-14 day competitor turnaround. Neither number comes from measured data. Both feel like the kind of inflated claims the copy bible was designed to eliminate.

**Fix:** These are removed along with the entire comparison table section (Problem 1 fix).

---

## Gradient transitions after all changes

The page needs clean transitions between dark and light surfaces. After reordering:

| Between | Transition |
|---------|------------|
| Metrics bar → Price comparison | `h-[160px] bg-gradient-to-b from-[#0A0D14] to-[#FAFBFC]` (exists) |
| Price comparison → How it works | None needed (both light) |
| How it works → Scan widget | None needed (light section continues, scan card provides its own dark surface) |
| Scan widget → Guarantees | None needed (both light background) |
| Guarantees → Pricing | Subtle `border-top: 1px solid #f1f5f9` (exists on pricing) |
| Pricing → Case types | None needed (both light) |
| Case types → FAQ | Subtle border or slight bg shift (`#FAFBFC` → `#FAFBFC`, keep as is) |
| FAQ → Final CTA | `h-[80px] bg-gradient-to-b from-[#FAFBFC] to-[#0A0D14]` (exists) |

Remove the following transition divs that are no longer needed:
- The light-to-dark transition before "How it works" (currently between price comparison and how-it-works)
- The dark-to-light transition after "How it works" (currently before scan widget)
- The dark-to-light transition after comparison table (section being removed)

---

## Complete change inventory

### HTML deletions

| What to delete | Location | Reason |
|----------------|----------|--------|
| Hero right column (dashboard mock) | Lines ~378-410 | Decorative noise, copy bible specifies centered single-column hero |
| Light-to-dark gradient before How It Works | Line ~459 | How It Works is now light, no transition needed |
| Dark-to-light gradient after How It Works | Line ~513-514 | Scan widget is on light bg, no transition from dark |
| Entire `#comparison` section | Lines ~810-873 | Redundant competitor reference, "83%/5x" violate truth-only rule |
| Dark-to-light gradient after comparison table | Line ~876 | Section removed |
| Price bars container in scan results | Lines ~613-617 (`resPriceList` div) | Redundant, seller already saw price comparison |

### HTML modifications

| What to change | Current | New | Reason |
|----------------|---------|-----|--------|
| Hero layout | Two-column `lg:flex-row` | Single-column centered `max-w-3xl mx-auto` | Copy bible spec, remove distractions |
| Hero text alignment | `text-center lg:text-left` | `text-center` | Centered on all viewports |
| Hero buttons | `justify-center lg:justify-start` | `justify-center` | Centered layout |
| How It Works section bg | `bg-[#0A0D14]` | `bg-[#FAFBFC]` | Light surface per brand identity |
| How It Works H2 | `text-white` | `text-slate-900` | Light surface text |
| How It Works subtext | `text-on-surface-variant` | `text-slate-500` | Light surface text |
| How It Works kicker | `text-secondary` | `text-indigo-500` | Light surface accent |
| How It Works cards bg | `bg-surface-container-low` | `bg-white border border-slate-200` | Light surface cards |
| How It Works card titles | `text-white` | `text-slate-900` | Light surface text |
| How It Works card body | `text-on-surface-variant` | `text-slate-500` | Light surface text |
| How It Works step labels | `text-on-surface-variant` | `text-slate-400` | Light surface text |
| How It Works card hover | `hover:bg-surface-container` | `hover:border-indigo-300 hover:shadow-md` | Light surface interaction |
| How It Works icon bg (steps 1-2) | `bg-primary/10 text-primary` | `bg-indigo-50 text-indigo-500` | Light surface icons |
| How It Works icon bg (steps 3-4) | `bg-primary/10 text-primary` | `bg-teal-50 text-teal-600` | Teal for creation steps per copy bible |
| Case types section bg | `bg-[#0A0D14]` | `bg-[#FAFBFC] text-slate-900` | Light surface |
| Case types H3 | `text-white` | `text-slate-900` | Light surface |
| Case types subtext | `text-on-surface-variant` | `text-slate-500` | Light surface |
| Case types content | Pill grid | Full tabbed component with per-type content | Copy bible spec |

### Section reorder

Move the sections in the HTML to this order:

```
1. <nav>
2. <header> (hero, DARK)
3. Metrics bar (DARK)
4. Gradient: dark → light
5. Price comparison (LIGHT)
6. How it works (LIGHT) — NO gradient transition before this
7. Scan widget (LIGHT bg, dark card)
8. Guarantees (LIGHT)
9. Pricing (LIGHT)
10. Case types with tabs (LIGHT)
11. FAQ (LIGHT)
12. Gradient: light → dark
13. Final CTA (DARK)
14. Footer (DARK)
```

### JavaScript changes

| What to change | Details |
|----------------|---------|
| Remove `renderPriceBars()` function | Delete lines ~1253-1282 |
| Remove `renderPriceBars(price)` call in `renderResults()` | Delete the call at line ~1318 |
| Add tab switcher for case types | New JS: click handler that shows/hides tab content panels |

### CSS additions needed

```css
/* Case types tabs */
.case-tab {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.case-tab:hover {
  border-color: #a5b4fc;
  color: #4f46e5;
}
.case-tab.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

/* Tab nav container (horizontal scroll on mobile) */
.case-tab-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.case-tab-nav::-webkit-scrollbar { display: none; }

/* Tab content panel */
.case-tab-content {
  display: none;
}
.case-tab-content.active {
  display: block;
}
```

---

## Verification checklist

After implementation, verify:

1. **Competitor mention count:** Ctrl+F "Seller Lawyer", "eGrowth", "Riverbend", "Appeal Guru", "Thompson" — each name should appear exactly ONCE (in the price chart section only, plus FAQ mentions "$1,500 to $3,000" without naming competitors)
2. **"83%" and "5x" are gone:** Ctrl+F "83%" and "5x" — zero results
3. **No dark "How it works":** The 4-step cards should be on a white/light background with dark text
4. **No hero dashboard mock:** Hero should be single-column centered text only
5. **Section order:** Hero → Metrics → Price Chart → How It Works → Scan → Guarantees → Pricing → Case Types → FAQ → Final CTA
6. **Case types has tabs:** Clicking a tab shows per-type detail (description, what Amazon looks for, our approach, CTA)
7. **Scan results have no price bars:** Results show: badges → synthesis → evidence → POA preview → urgency → CTA. No competitor bar chart.
8. **Surface ratio:** Roughly 70% of the page is on light backgrounds, 30% dark
9. **Gradient transitions:** Only two remain: dark→light (after metrics) and light→dark (before final CTA)
10. **All copy bible text unchanged:** No copy rewrites in this plan. Only structural and surface changes.
11. **Truth-only rule still holds:** No new fabricated statistics introduced
12. **All Cal.com links still functional:** Test both hero secondary CTA and scan results "Book a call" buttons
13. **All PayPal links correct:** $497, $797, $199 links unchanged
14. **Mobile responsive:** Case type tabs scroll horizontally on mobile. Single-column hero works on all viewports.

---

## Files affected

| File | Changes |
|------|---------|
| `frontend-trial/index.html` | All structural changes above |
| `docs/appeal-edge-master-copy-bible.md` | No changes (source of truth, unchanged) |
| `docs/appeal-edge-brand-identity-v2.md` | No changes (design system reference, unchanged) |
| `docs/appeal-edge-landing-page-spec-v3.md` | No changes (section spec reference, unchanged) |

---

## What this plan does NOT change

- No copy rewrites. Every word stays as the copy bible specified.
- No color palette changes. Indigo/teal system unchanged.
- No scan widget logic changes (except removing price bars from results).
- No pricing changes. $497 / $797 / $199 unchanged.
- No API changes. `/api/analyze` endpoint unchanged.
- No new sections added beyond what the copy bible already specified.
- No Cal.com or PayPal integration changes.
