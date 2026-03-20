# Appeal Edge — Live Page Complete Checklist
**Source: appeal-edge.com (Vercel production deployment)**
This document is a full structural and visual checklist of the live landing page. Every section, every element, every piece of copy, every color, every interaction. An AI reading this should know exactly what the page looks like without seeing it.

---

## Phase 1 — Global Design System

### Fonts
- [ ] Display / UI: `Inter` (weights 400, 500, 600, 700, 800) — loaded from Google Fonts
- [ ] Monospace / widget: `DM Mono` (weights 400, 500) — loaded from Google Fonts
- [ ] Headings use Inter 800, letter-spacing -0.04em, line-height 1.05
- [ ] Body text: 1.125rem (18px), color `#8a3a33`, line-height 1.6
- [ ] Small text: 0.875rem (14px)

### Color Palette
- [ ] `--black / --charcoal`: `#280905` — deep warm near-black, used for all headings and dark text
- [ ] `--gray-900`: `#4a1510`
- [ ] `--gray-600`: `#8a3a33` — body text color
- [ ] `--gray-400`: `#c67f78` — muted/hint text
- [ ] `--white`: `#FFFFFF`
- [ ] `--off-white`: `#fffdfc`
- [ ] `--bg-light`: `#fcf5f4` — alternate section background (warm light pinkish white)
- [ ] `--blue` (primary accent, actually red): `#c3110c`
- [ ] `--blue-hover`: `#740a03`
- [ ] `--blue-light` (primary tint bg): `#fef2f2`
- [ ] `--orange`: `#e6501b`
- [ ] `--orange-light`: `#fff7ed`
- [ ] `--border-light`: `#f5e6e5`
- [ ] Theme color meta: `#c3110c`

### Spacing
- [ ] Max content width: `1240px`
- [ ] Horizontal padding: clamps `24px → 64px`
- [ ] Section vertical padding: clamps `100px → 180px` (64px on mobile ≤768px)

### Shadows (3 levels)
- [ ] `--shadow-sm`: very faint, `2px` blur
- [ ] `--shadow-lg`: medium, `32px` blur, warm red-tinted
- [ ] `--shadow-hover`: strong, `48px` blur, lifts elements on hover

### Button System (7 variants)
- [ ] **btn-primary**: red gradient pill (`#c3110c → #d93a10 → #e6501b`, 135deg), white text, `100px` border-radius, padding `19px 38px`, 16px bold, layered red glow shadows, shimmer sweep on hover, lifts 3px on hover
- [ ] **btn-outline**: transparent bg, red text, `1.5px` red border at 45% opacity, `100px` radius, `10px 24px` padding, 14px — fills red + white text on hover, lifts 1px
- [ ] **btn-secondary**: white bg, near-black text, `1.5px` border at 10% opacity, `100px` radius, `17px 34px` padding — border turns slightly red on hover, lifts 2px
- [ ] **btn-pricing**: off-white bg, near-black text, `14px` radius, `16px 28px` padding, full width — border turns red on hover, lifts 2px
- [ ] **btn-pricing-primary**: red gradient, white text, `14px` radius, full width, shimmer on hover, lifts 2px
- [ ] **btn-footer**: orange-to-red gradient (`#e6501b → #c3110c`), white text, `100px` radius, `22px 56px`, 18px bold, wide ambient glow shadows, shimmer on hover, lifts 3px
- [ ] **btn-orange** (inside dark widget): red gradient, white text, `10px` radius — lifts 2px on hover
- [ ] **btn-ghost** (inside dark widget): `rgba(255,255,255,0.07)` bg, 82% white text, `1.5px` white border at 16% opacity, `10px` radius

### Animation System
- [ ] `.reveal` class: all major elements start `opacity:0, translateY(40px)`, animate to visible via IntersectionObserver (threshold 10%, rootMargin `-50px` bottom)
- [ ] One-time trigger — once visible, stays visible, observer disconnects
- [ ] Delay utilities: `.delay-1` = 0.1s, `.delay-2` = 0.2s, `.delay-3` = 0.4s
- [ ] Transition easing: `cubic-bezier(0.16, 1, 0.3, 1)` over 0.8s

### What Moves (always-on animations)
- [ ] Scan widget ambient orb: `scanGlowPulse` — scale 0.97↔1.03, opacity 0.75↔1, 7s ease-in-out infinite alternate
- [ ] Scan widget live dot: `livePulse` — opacity + box-shadow pulse, 2s infinite
- [ ] Hero floating card: `float` — translateY 0 → -15px → 0, 6s ease-in-out infinite (hidden on mobile)
- [ ] Ticker banners: `ticker` — translate3d 0 → -50%, 25s linear infinite
- [ ] Loading stepper active dot: `stepPulse` — box-shadow ring expands/contracts, 1.2s infinite
- [ ] Loading dots bounce: `dotBounce` — scale 0.6↔1, opacity 0.4↔1, staggered 0.2s delays

---

## Phase 2 — Navigation Bar

### Behavior
- [ ] Fixed position, full width, top 0, z-index 1000
- [ ] **Default state**: transparent background, 24px vertical padding
- [ ] **Scrolled state** (triggers at 20px scroll): `rgba(255,255,255,0.95)` + `backdrop-filter: blur(16px)`, padding shrinks to 16px, subtle shadow — 0.3s transition

### Layout (left → center → right)
- [ ] Max-width `1240px` inner container, centered, horizontal padding applied

**Left — Logo (SVG inline)**
- [ ] SVG viewport: `236 × 32`
- [ ] A-mark: solid red (`#c3110c`) rounded rectangle `28×28px`, `6px` corner radius
- [ ] Inside the rectangle: white triangle/A-shape path (`M14 6.5 L23.5 25.5 H4.5 Z`)
- [ ] Red crossbar cuts through the A: `rect x=8 y=17.5 width=12 height=2.8 fill="#c3110c"`
- [ ] Wordmark: "Appeal Edge" in Inter 800, `#280905`, font-size 22, letter-spacing -0.5, positioned at x=38
- [ ] Full logo is a link to `/`

**Center — Nav Links (hidden on mobile ≤768px)**
- [ ] Three text links, Inter weight 500, 15px, `#280905`, gap 48px between them
- [ ] Link 1: "How it works" → anchor `#how`
- [ ] Link 2: "Why us?" → anchor `#testimonials`
- [ ] Link 3: "Pricing" → anchor `#pricing`
- [ ] Hover: text color changes to `#c3110c`

**Right — CTA Button (hidden on mobile ≤768px)**
- [ ] Button: "Book a free call" using `btn-outline` style
- [ ] Triggers Cal.com booking modal: `data-cal-link="apeksha-n/appeal-edge-diagnosis"`, namespace `appeal-edge`, config `{"layout":"month_view","theme":"light"}`

**Mobile (≤768px) — Hamburger**
- [ ] Three vertically stacked dots (5×5px circles, 4px gap), 40×40px button, `1.5px` border, `10px` radius — NOT hamburger lines, it's a vertical three-dot kebab
- [ ] Open state: border and dots turn red (`#c3110c`)
- [ ] Opens a **dropdown menu** anchored below, inside the `<nav>` element (so absolute positioning is relative to the fixed nav):
  - [ ] White background, `1px` border (`#f5e6e5`), `16px` radius, `0 8px 28px` shadow
  - [ ] Min-width: 190px, padding 8px, positioned right-aligned
  - [ ] Items: "How it works", "Why us?", "Pricing", then a `1px` divider, then "Book a free call →" (red, bold — `.mobile-menu-cta`)
  - [ ] Each item: 15px weight 600, `11px 14px` padding, `10px` radius, hover turns warm bg + red text
  - [ ] Clicking any item closes the menu and scrolls to section

---

## Phase 3 — Hero Section

**Background**: White. Min-height: 100vh. Content vertically centered. Padding-top: 160px (leaves space for fixed nav). Section ID: `hero`.

### Layout
- [ ] CSS Grid, two columns `1fr 1fr`, 64px gap, `align-items: center`
- [ ] On ≤1024px: single column, text centered
- [ ] On ≤768px: padding-top reduces to 120px, min-height auto

---

### Left Column — Hero Text

**Badge** (reveal, no delay)
- [ ] Pill shape, `#fef2f2` background, `#c3110c` text, `100px` radius
- [ ] Contents: 8×8px red filled circle + text "Amazon Appeal Specialists"
- [ ] 14px, weight 600, margin-bottom 32px

**H1 Headline** (reveal, no delay)
- [ ] Line 1: "Your Amazon account is suspended."
- [ ] Line 2: "We get you back."
- [ ] "We get you back." wrapped in `.highlight-wrap`
- [ ] Under "We get you back.": animated SVG underline — curved path `M5 15 Q 150 -5 295 15`, stroke `#c3110c`, stroke-width 6, stroke-linecap round
- [ ] SVG underline draws itself (stroke-dashoffset 1000→0) when `.reveal` becomes `.active`, over 1.5s
- [ ] Font: Inter 800, `clamp(2rem, 8vw, 6rem)`, `#280905`, letter-spacing -0.04em

**Subheading Paragraph** (delay-1 = 0.1s)
- [ ] Text: "Stop guessing what Amazon wants. Our appeal specialists analyze your suspension notice, identify the exact root cause, and craft a case-specific Plan of Action. Not a template."
- [ ] Font: body-large (clamps 1rem–1.375rem), `#8a3a33`, line-height 1.6, max-width 480px

**CTA Buttons Row** (delay-2 = 0.2s)
- [ ] Side-by-side, 24px gap, wraps on mobile

- [ ] **Button 1 — Primary** ("Book a free 15-min call"):
  - [ ] Calendar icon SVG (18×18) to the left of text
  - [ ] `btn-primary` style (red gradient pill)
  - [ ] Triggers Cal.com modal on click

- [ ] **Button 2 — Secondary** ("Scan my case first"):
  - [ ] `btn-secondary` style (white pill)
  - [ ] On click: smooth-scrolls to `#scan-widget`, then after 600ms focuses `#noticeText` textarea

**Hint text** (delay-2 = 0.2s)
- [ ] "Not sure? The free scan tells you your case type and win rate in 30 seconds."
- [ ] 13px, `#c67f78`, margin-top 16px

---

### Right Column — Scan Widget (ID: `scan-widget`)

**Wrapper** (reveal, delay-3 = 0.4s)
- [ ] Max-width: 530px, margin-left auto (pushed right)
- [ ] z-index 2

**Ambient Orb** (`.scan-orb`) — pure atmosphere, not interactive
- [ ] Absolutely positioned, extends 100px beyond card on all sides
- [ ] Two overlapping radial gradients: top-right `rgba(195,17,12,0.35)` red, bottom-left `rgba(230,80,27,0.22)` orange
- [ ] Breathing animation `scanGlowPulse`: scale 0.97↔1.03 + opacity 0.75↔1, 7s, infinite, alternate

**Card Shell** (`.scan-inner`)
- [ ] Background: dark gradient `#130302 → #0d0201 → #110403` at 158deg
- [ ] Border: `1px solid rgba(195,17,12,0.28)` (dark red edge)
- [ ] Border-radius: 18px
- [ ] Max-height: 620px, scrolls vertically with thin red scrollbar (3px wide)
- [ ] Layered shadows: inset top highlight, inset bottom dark, outer drop shadow, outer red glow

**Top Ember Line**
- [ ] `1px` horizontal line at very top of card
- [ ] Gradient: `transparent → #c3110c (90% opacity) → #e6501b (70%) → transparent`
- [ ] Creates a "glowing edge" effect

**Card Header** (inside `.scan-body` — `20px 22px` padding)
- [ ] Left: animated orange dot (`7px`, `#e6501b`, pulsing box-shadow `livePulse` 2s infinite) + text "FREE CASE SCAN" in DM Mono, 11px, uppercase, letter-spacing 0.12em, ~90% white
- [ ] Right: "Instant · Free" in DM Mono, 10px, 28% opacity white
- [ ] Below header: `1px` divider at 6% white opacity

---

#### Widget State 1 — Input Form (default visible)

**Textarea**
- [ ] 130px tall, full width
- [ ] Background: `rgba(255,255,255,0.04)` (nearly black)
- [ ] Border: `1px solid rgba(255,255,255,0.08)`
- [ ] Border-radius: 10px, padding `14px 16px`
- [ ] Font: DM Mono, 13px, 88% opacity white, line-height 1.6, no resize
- [ ] Placeholder: "Paste your Amazon suspension notice here..." — DM Mono, 12px, 20% opacity white
- [ ] Focus: border turns `rgba(195,17,12,0.6)`, red glow ring `0 0 0 3px rgba(195,17,12,0.12)`

**File Upload Zone**
- [ ] Horizontal layout: 📎 icon (20px, flex-shrink 0) + text block
- [ ] Text bold part: "Attach files" (warm orange-tinted ~90% white)
- [ ] Text: " or drag & drop"
- [ ] Sub-text: "PDF · PNG · JPG · TXT · EML · Max 10MB · 5 files" — DM Mono, 11px, very muted
- [ ] Border: `1px dashed rgba(255,255,255,0.12)`
- [ ] Background: `rgba(255,255,255,0.025)`
- [ ] Border-radius: 10px, padding 16px, margin-bottom 12px
- [ ] Hover / drag-over: bg `rgba(195,17,12,0.08)`, border `rgba(195,17,12,0.4)`
- [ ] Click opens system file picker. Drag-and-drop supported.
- [ ] Accepts: `.pdf, .png, .jpg, .jpeg, .txt, .eml`
- [ ] Max files: 5, max size: 10MB each

**File Pills** (appear after files attached)
- [ ] Flex-wrap row, 8px gap
- [ ] Each pill: `rgba(195,17,12,0.18)` bg, warm orange text, `1px` red border, DM Mono 11px, `100px` radius
- [ ] Shows: 📄 filename + × remove button
- [ ] × button removes that file from the list on click

**Submit Button** (`#dashBtn`)
- [ ] Full width, padding 16px
- [ ] Red gradient `#c3110c → #e6501b`, white text
- [ ] Font: DM Mono, 14px, uppercase, letter-spacing 0.06em
- [ ] Text: "Analyze My Suspension" + arrow SVG `→`
- [ ] Red glow shadow + inset highlight
- [ ] Hover: lifts 2px, stronger shadow, shimmer sweeps left-to-right
- [ ] Active: snaps back 1px

---

#### Widget State 2 — Loading (shows after submit)

**Loading Header Row**
- [ ] 3 bouncing dots (`5px` circles): `#c3110c`, `#d42010`, `#e6501b` — `dotBounce` animation, 0.2s stagger
- [ ] Text: "ANALYZING YOUR CASE" — DM Mono, 11px, uppercase, 50% white

**Vertical Stepper** (5 steps)
- [ ] A thin `1px` vertical line runs through the dot centers (1% white)
- [ ] Each step: circle dot (30px, dark bg, white border) + label text
- [ ] **Inactive**: 30% opacity, muted dot
- [ ] **Active**: red-glowing dot (`rgba(195,17,12,0.2)` bg + red border + `stepPulse` glow animation), label turns near-white
- [ ] **Done**: orange-tinted dot, checkmark SVG replaces number, fades to 55% opacity
- [ ] Steps advance every 1.2 seconds automatically
- [ ] Step 1: "Reading your suspension notice..."
- [ ] Step 2: "Classifying violation type..."
- [ ] Step 3: "Analyzing case specifics..."
- [ ] Step 4: "Calculating reinstatement probability..."
- [ ] Step 5: "Generating personalized analysis..."
- [ ] Minimum display time: 6 seconds even if API responds faster

---

#### Widget State 3 — Results (shows after AI responds)

**Classification Row**
- [ ] **Case type badge**: DM Mono, 13px, uppercase, `rgba(195,17,12,0.22)` bg, `#ff9a88` text, `1px` red border, `6px` radius — shows detected case type (e.g. "INAUTHENTIC COMPLAINT")
- [ ] **Complexity badge**: adjacent, same style, shows "SIMPLE/MEDIUM/COMPLEX COMPLEXITY" — color varies by tier

**Synthesis Block**
- [ ] Left border: `3px solid rgba(195,17,12,0.85)`
- [ ] Background: `rgba(195,17,12,0.09)`, border-radius `0 10px 10px 0`
- [ ] AI-generated 1–2 sentence case summary, 14px near-white, line-height 1.65

**Win Rate Rings Box**
- [ ] Container: `rgba(255,255,255,0.04)` bg, `1px` white border at 9% opacity, `10px` radius
- [ ] Title: "REINSTATEMENT PROBABILITY" — DM Mono, 11px, uppercase, 55% white
- [ ] Two SVG circular ring charts in 2-column grid (80×80px each):
  - [ ] Left ring: "Industry Average" — amber/red stroke (`#c3110c`), animates stroke-dashoffset from full → partial
  - [ ] Right ring: "With Appeal Edge" — orange stroke (`#e6501b`), animates same way
  - [ ] Each ring: gray track underneath, colored fill on top
  - [ ] The % number centers inside the ring, DM Mono 21px white, counts up from 0 over ~1.2s
  - [ ] Below ring: small label "Industry Average" / "With Appeal Edge" — DM Mono, 11px, 55% white

**Competitor Price Comparison Box**
- [ ] Same container style as win rate
- [ ] Title: "HOW WE COMPARE ON PRICE" — DM Mono, 11px, uppercase
- [ ] Horizontal bar chart per competitor, animates width 0% → target % over 1.2s:
  - [ ] CJ Rosenbaum — ~$3,000 — gray bar
  - [ ] eGrowth Partners — ~$2,500 — gray bar
  - [ ] Riverbend Consulting — $1,500–$2,500 — gray bar
  - [ ] Appeal Guru — $1,495 — gray bar
  - [ ] Thompson & Holt — $600–$1,000 — gray bar
  - [ ] Appeal Edge ✦ — $497 or $797 — red bar (`#c3110c`)
  - [ ] Each bar: name (left) + price label (right) + 8px track + animated fill

**Why Appeal Edge Box**
- [ ] `rgba(195,17,12,0.09)` bg, `1px rgba(195,17,12,0.28)` border, `10px` radius
- [ ] Title: "WHY APPEAL EDGE FOR THIS CASE" — DM Mono, 11px, uppercase, `#ff9a78`
- [ ] AI-generated paragraph specific to the case type, 14px, 88% white

**CTA Block**
- [ ] `rgba(255,255,255,0.05)` bg, `1px rgba(255,255,255,0.1)` border, `12px` radius
- [ ] Urgency notice (full-width block): orange-tinted bg, AI-generated urgency line like "⏰ Act fast..."
- [ ] **If Simple/Medium complexity**:
  - [ ] H3: "Your case is actionable. Let's move."
  - [ ] Para: "Flat fee · $497 · Up to 3 revision rounds included. We start the same day."
  - [ ] Button 1 (primary): "Get started · $497" — red gradient, DM Mono — links to PayPal $497
  - [ ] Button 2 (ghost): "Have questions? Book a call" — Cal.com modal
- [ ] **If Complex complexity**:
  - [ ] H3: "This case needs a specialist review."
  - [ ] Para: "Book a free 15-min call and we'll map out exactly what your appeal needs before you spend a cent."
  - [ ] Button 1 (primary): "Book a free 15-min call" — Cal.com modal
  - [ ] Button 2 (ghost): "Get started · $797" — PayPal $797

**Analyze Another link**
- [ ] Small text at bottom, DM Mono, 12px, 35% white, underlined: "analyze another case"
- [ ] Clicking resets widget back to State 1

---

#### Widget State 4 — Error

- [ ] ⚠️ emoji (32px)
- [ ] H3: "Analysis Failed" — 88% white
- [ ] Paragraph: error message text, 45% white
- [ ] Button: "Try Again" — primary red pill, resets to form

---

## Phase 4 — Case Library Section

**Position**: Between Hero and How It Works. No section ID anchor. Class: `case-library-section`.

**Background**: White (inherits page). Padding: `18px [horizontal] calc(section-gap × 0.85)`. Margin-top: `-28px` (slight overlap into hero bottom space).

**The outer shell** (`.case-library-shell`): a single contained panel, not full-bleed
- [ ] Background: near-white gradient `rgba(255,255,255,0.98) → rgba(252,245,244,0.98)`, 180deg
- [ ] Border: `1px solid rgba(195,17,12,0.12)` (very subtle red edge)
- [ ] Border-radius: `30px`
- [ ] Box-shadow: `0 28px 60px -36px rgba(40,9,5,0.35)` (deep soft shadow, offset far down)
- [ ] Overflow: hidden
- [ ] Before pseudo-element: decorative radial gradients inside (top-right red, top white fade)
- [ ] Entire panel has `.reveal` animation (fades up on scroll)

---

### Case Library Header Row (`.case-library-head`)

- [ ] Two-column flex row, space-between, `align-items: flex-start`

**Left side** (`.case-library-head-left`):
- [ ] **"8X" kicker**: large, bold, red — a decorative number/multiplier label
- [ ] **H3**: "See how strong Amazon appeals are actually built"
- [ ] **Paragraph**: "Review eight of the most common suspension scenarios, understand what Amazon needs to see, and get clarity before you send the wrong response."

**Right side** (`.case-library-head-right`):
- [ ] **Counter** (`.case-library-count`, ID `caseLibraryCount`): "01 / 08" — updates as tabs change. Hidden on small mobile.
- [ ] **Note**: "Swipe on mobile · compare case paths instantly" — small muted text

---

### Case Library Panel (`.case-library-panel`)

**Intro row** (`.case-library-intro`)
- [ ] Label span: "Case Clarity Before You Commit"
- [ ] Paragraph: "Each card breaks down the real issue behind the suspension, the fixes that actually move the case forward, and why a stronger strategy materially improves your odds."
- [ ] Right side label: "Designed to build confidence, then move into the free scan"

**Tabs row** (`#caseTabs`)
- [ ] 8 tab buttons generated by JS, one per case
- [ ] Active tab: highlighted (red accent, selected state)
- [ ] Tab labels:
  1. IP infringement
  2. Inauthentic claims
  3. Used sold as new
  4. Late shipment rate
  5. Product condition complaints
  6. Related accounts
  7. Section 3 / conduct
  8. Product safety / restricted
- [ ] Clicking a tab switches the active case card
- [ ] Touch swipe supported (touchstart/touchend delta detection)

**Carousel** (`#caseCarousel`)
- [ ] One card visible at a time, switches on tab click or swipe
- [ ] Each case card contains:

| Field | Content |
|---|---|
| **Label** | Short tag (e.g. "IP infringement") |
| **Hook** | 1 sentence explaining why this suspension is serious |
| **Concern** | What Amazon specifically needs to see |
| **Synthesis** | Strategic summary of what wins this case |
| **Causes** | 3 bullet points: what typically went wrong |
| **Solutions** | 3 bullet points: what fixes actually work |
| **Industry win rate** | Percentage (e.g. 46%) |
| **Our win rate** | Higher percentage (e.g. 83%) |
| **Stat note** | Short explanatory line |

**All 8 case card contents:**

| # | Label | Industry % | Our % | Stat note |
|---|---|---|---|---|
| 1 | IP infringement | 46% | 83% | "High upside when the paperwork is organized fast." |
| 2 | Inauthentic claims | 41% | 79% | "Documentation quality matters more than how strongly you argue." |
| 3 | Used sold as new | 52% | 86% | "Operational fixes are persuasive when they are specific and measurable." |
| 4 | Late shipment rate | 58% | 88% | "Performance cases respond well to visible process discipline." |
| 5 | Product condition complaints | 49% | 82% | "Good evidence converts this from blame to prevention." |
| 6 | Related accounts | 28% | 67% | "Harder case type, but clarity beats defensiveness." |
| 7 | Section 3 / conduct | 24% | 61% | "These are trust-rebuild cases and need a sharper POA." |
| 8 | Product safety / restricted | 34% | 72% | "Compliance proof moves the needle faster than broad promises." |

---

### Case Library Footer Row (`.case-library-footer`)

- [ ] Left: case hint text (ID `caseLibraryHint`) — "01 / 08 · IP infringement" — updates as tab changes
- [ ] Right: **"Get your free case scan →"** button (`.case-library-action`):
  - [ ] Arrow SVG icon (`14px`)
  - [ ] On click: scrolls to scan widget (`#scan-widget`) and focuses textarea

---

## Phase 5 — How It Works Section

**Section ID**: `how`. **Background**: warm off-white `#fcf5f4` (`.bg-light`). Full section padding.

### Section Header (centered, reveal)
- [ ] **H2**: "Three steps to **freedom.**"
- [ ] "freedom." wrapped in `.highlight-wrap` with an animated SVG circle drawn around it:
  - [ ] SVG path: `M100 10 C 180 10, 190 50, 100 90 C 10 90, 20 10, 100 10` — a hand-drawn oval
  - [ ] Stroke: `#e6501b` (orange), stroke-width 4, linecap round
  - [ ] Draws itself (stroke-dashoffset 1000→0) when `.reveal` activates, 1.5s, 0.5s delay
- [ ] **Subtext**: "We engineered the complexity out of the appeal process." — body-large, max-width 600px, centered, margin-top 24px

### Three Feature Cards (3-column grid, 40px gap)

Each card:
- [ ] White background, `32px` border-radius, `1px` border (`#f5e6e5`), shadow-sm
- [ ] Hover: lifts 8px, shadow-hover, spring easing `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
- [ ] Icon container: `72×72px`, `24px` radius, colored bg, colored icon (32px SVG)
- [ ] H3: bold heading
- [ ] Paragraph: body text

**Card 1** (reveal delay-1 = 0.1s)
- [ ] Icon: light red bg (`#fef2f2`), red icon — document/file SVG
- [ ] H3: "Expert Analysis"
- [ ] Body: "Paste your suspension notice. Our specialists identify the root cause and map the exact policy requirements needed for reinstatement."

**Card 2** (reveal delay-2 = 0.2s)
- [ ] Icon: orange-light bg (`#fff7ed`), orange icon — globe/world SVG
- [ ] H3: "Reviewed by Specialists"
- [ ] Body: "An appeal specialist with deep Amazon policy knowledge reviews and refines every PoA: checking tone, specificity, and the exact language Amazon's review team responds to."

**Card 3** (reveal delay-3 = 0.4s)
- [ ] Icon: orange-light bg, orange icon — checkmark circle SVG
- [ ] H3: "Reinstatement"
- [ ] Body: "Submit your custom-tailored Plan of Action. Amazon typically responds within 24-72 hours. If rejected, we revise and resubmit at no extra cost."

On mobile (≤768px): stacks to single column, 24px gap.

---

## Phase 6 — Testimonials Section

**Section ID**: `testimonials`. **Background**: white. Full section padding.

**Layout**: 2-column grid `1fr 1fr`, 64px gap, `align-items: center`. Stacks on ≤1024px.

### Left Column — Testimonial (reveal)

**Featured Card** (`.testi-card.featured`)
- [ ] Background: `#e6501b` (orange-red solid)
- [ ] Padding: 48px, `32px` border-radius
- [ ] CSS triangle "tail" pointing down-left from bottom (speech bubble effect), same orange color
- [ ] Quote text (no quotation marks in HTML):
  > "I'd already tried writing the appeal myself twice and got nowhere. Appeal Edge looked at my suspension notice, spotted exactly what Amazon needed to see, and got it right the first time. Back selling within 48 hours."
- [ ] Font: 1.25rem, weight 500, line-height 1.6, white text

**Author Block** (outside the card, below it, padding-left 48px)
- [ ] Circular avatar image: `68×68px`, loads `/assets/testomonial.png`, `object-fit: cover, object-position: center top`
- [ ] Name: "James T." — weight 700, `#280905`
- [ ] Role: "Amazon FBA Seller, inauthentic complaint" — 14px, `#8a3a33`

### Right Column — Proof Points (reveal, delay-2)

- [ ] Max-width 400px, padding-left 40px
- [ ] **H2**: "What our early clients are saying."
- [ ] **Paragraph** (body-large): "We're a focused team of appeal specialists. Every case gets personal attention — not a copy-paste template. That's the difference clients notice first."
- [ ] **3 checklist items** (margin-top 40px, flex column, 16px gap):
  - [ ] Red checkmark SVG (20×20px, stroke-width 2.5) + "Case-specific POA, not a generic template"
  - [ ] Red checkmark SVG + "Up to 3 revision rounds included"
  - [ ] Red checkmark SVG + "50% refund if no progress after 2 full attempts"

---

## Phase 7 — Pricing Section

**Section ID**: `pricing`. **Background**: warm off-white `#fcf5f4`. Full section padding.

### Section Header (centered, reveal)
- [ ] **H2**: "Simple, transparent pricing."
- [ ] **Subtext**: "No retainers. No surprise invoices. One flat fee covers your full appeal." — body-large, margin-top 16px

### Three Pricing Cards (3-column grid, 32px gap, max-width 1100px, centered)

**Card 1 — Standard Action** (reveal)
- [ ] White bg, `32px` radius, `1px` border, shadow-sm
- [ ] H3: "Standard Action"
- [ ] Subtext: "For common policy violations."
- [ ] Price: **$497** — `clamp(2.5rem, 7vw, 4rem)`, weight 800, `#280905`, line-height 1
- [ ] 4 feature list items (red checkmark SVG each):
  - Expert-Drafted PoA
  - Human Expert Review
  - 4-Day Turnaround
  - 3 Free Revisions
- [ ] **CTA Button** (`btn-pricing` style — off-white, full width, `14px` radius):
  - [ ] Label: "Get Started · Pay via PayPal"
  - [ ] Links to: `https://paypal.me/aayushAppealEdge/497`

**Card 2 — Rush Appeal FEATURED** (reveal, delay-1)
- [ ] **Scaled up** `transform: scale(1.05)` — visually larger than others
- [ ] **2px solid red border** (`#c3110c`)
- [ ] **Floating badge** (position absolute, top `-16px`, centered): "MOST POPULAR" — red bg, white text, `100px` pill, 13px uppercase bold
- [ ] H3: "Rush Appeal"
- [ ] Subtext: "For sellers who can't afford to wait."
- [ ] Price: **$797**
- [ ] 4 feature list items:
  - Everything in Standard
  - Priority handling
  - 24-Hour Turnaround
  - Unlimited Revisions
- [ ] **CTA Button** (`btn-pricing-primary` style — red gradient, full width, `14px` radius, shimmer):
  - [ ] Label: "Start Rush Appeal · Pay via PayPal →"
  - [ ] Links to: `https://paypal.me/aayushAppealEdge/797`
- [ ] Hover: lifts 8px in addition to scale

**Card 3 — Monitoring** (reveal, delay-2)
- [ ] Same style as Card 1
- [ ] H3: "Monitoring"
- [ ] Subtext: "Stay ahead of issues before they escalate."
- [ ] Price: **$199** + **/mo** suffix (1.25rem, `#c67f78`, weight 500)
- [ ] 4 feature list items:
  - Weekly Account Health Reviews
  - Early Warning on Policy Flags
  - Direct Access via Email/WhatsApp
  - 1 Free Appeal per year
- [ ] **CTA Button** (`btn-pricing` style):
  - [ ] Label: "Get Started · Pay via PayPal"
  - [ ] Links to: `https://paypal.me/aayushAppealEdge/199`

On mobile: all 3 cards stack to single column, 36px gap. Featured card loses scale, gains 44px top padding + 8px top margin for the floating badge.

---

## Phase 8 — Marquee Ticker Banners

Two full-width horizontal scrolling text banners stacked vertically, between the Pricing section and Footer.

### Banner 1 — Orange (top)
- [ ] Background: `#e6501b` (orange)
- [ ] Rotation: `rotate(1deg) scale(1.05)` — slightly tilted clockwise, oversized so edges bleed
- [ ] Margin-top: `-60px` (overlaps the bottom of Pricing section)
- [ ] Box-shadow: `0 20px 40px rgba(0,0,0,0.15)`
- [ ] Content scrolls left continuously at 25s per loop
- [ ] Text (repeated twice for seamless loop): "Protect Your Business" • "Recover Lost Revenue" • "Sell With Confidence" • "Beat Auto-Bots"
- [ ] Font: `clamp(1.25rem, 4vw, 2.5rem)`, weight 800, uppercase, white, letter-spacing 0.05em
- [ ] Each item separated by a literal `•` bullet

### Banner 2 — Red (below)
- [ ] Background: `#c3110c` (primary red)
- [ ] Rotation: `rotate(-2deg) scale(1.05)` — slightly tilted counter-clockwise
- [ ] Margin-top: 64px (after pricing section, before footer)
- [ ] Box-shadow: `0 20px 40px rgba(0,0,0,0.15)`
- [ ] Same scroll speed and font style
- [ ] Content (repeated twice): "Appeal Edge" • "Account Reinstatement" • "Appeal Edge" • "Flat-Fee · No Surprises"

On mobile (≤768px): rotation removed on both (`transform: none`), margin-top normalized.

---

## Phase 9 — Footer

**Background**: pure black `#000000`. White text. Margin-top: `-120px` on the wrapper (overlaps the red ticker slightly — z-index layering creates depth). Section is a `<footer>` element.

Padding: `clamp(120px, 18vw, 240px)` top, `64px` bottom. Reduced to `80px` top on mobile.

### Pre-footer Grid

Two-column grid, 120px gap, max-width 1240px, centered. Divided from footer bottom by `1px rgba(255,255,255,0.1)` horizontal rule. Stacks to single column on ≤1024px.

**Left column** (`.prefooter-left`)
- [ ] **H2** (white): "Your account is waiting." line break "Let's get it back."
  - Font size: `clamp(2rem, 6vw, 4.5rem)`, Inter 800, white, margin-bottom 48px
- [ ] Two buttons side-by-side (16px gap, wrap on mobile):
  - [ ] **Button 1** ("Start your free analysis") — `btn-footer` style (orange-to-red gradient pill):
    - Padding `22px 56px`, 18px, bold
    - Multiple layered shadows + wide ambient glow
    - Shimmer on hover, lifts 3px
    - Scrolls to `#scan-widget` on click
  - [ ] **Button 2** ("Book a free call") — custom ghost style:
    - `rgba(255,255,255,0.08)` bg, white text, `rgba(255,255,255,0.2)` border, `100px` radius, `22px 40px`, 16px weight 600
    - Calendar icon SVG to the left of text
    - Triggers Cal.com modal

**Right column** (`.prefooter-right`)
- [ ] Two sub-columns side-by-side, 80px gap, padding-top 32px. Stack vertical on mobile (40px gap).

- [ ] **Sub-column: "CONNECT"**
  - Label: "CONNECT" — `#c67f78`, 14px, uppercase, letter-spacing 0.1em, margin-bottom 24px
  - Three links (20px, weight 500, white), each with an animated underline (scaleX 0→1 from right, 0.25s on hover):
    - "How it Works" → `#how`
    - "Testimonials" → `#testimonials`
    - "Pricing" → `#pricing`

- [ ] **Sub-column: "CONTACT US"**
  - Label: "CONTACT US" — same style
  - One link: `social@appeal-edge.com` — mailto link, same animated underline style

### Footer Bottom Bar

- [ ] Max-width 1240px, centered, margin-top 64px (48px on mobile)
- [ ] Horizontal flex, space-between, align-items center. Stacks vertically on mobile.

**Left — Footer Logo (SVG inline)**
- [ ] A-mark rectangle: white at 15% opacity (ghost effect on dark bg)
- [ ] A triangle: white solid
- [ ] Red crossbar: `#c3110c`
- [ ] "Appeal Edge" wordmark: white, Inter 800, 22px
- [ ] Full logo links to `/`

**Right — Legal Disclaimer**
- [ ] Text: "© 2026 Appeal Edge. Not affiliated with or endorsed by Amazon.com, Inc. We are a consulting service, not a law firm."
- [ ] 14px, `#c67f78`, right-aligned, max-width 500px

---

## Phase 10 — Background Decorative Element

- [ ] One large background blob sits at the top-right of the entire page (behind all content):
  - [ ] 600×600px circle, `#c3110c` (red), 80px blur, 15% opacity
  - [ ] Position: absolute, top -10%, right -5%, z-index 0
  - [ ] Hidden on mobile (≤768px)

---

## Phase 11 — Scroll-Linked & Interactive Behaviors

### Nav scroll
- [ ] On scroll past 20px: nav gets `.scrolled` class → frosted glass + padding tightens

### Reveal animations
- [ ] IntersectionObserver watches all `.reveal` elements
- [ ] Threshold: 10%, rootMargin: `0px 0px -50px 0px`
- [ ] On intersect: adds `.active` class → opacity 1, translateY 0
- [ ] Observer disconnects after trigger (one-time)

### Case Library
- [ ] 8 tab buttons built dynamically from `caseStudies` array
- [ ] Active tab: highlighted style
- [ ] Tab click: updates card content, counter ("01/08"), hint text
- [ ] Touch swipe: touchstart/touchend delta > 50px left → next, right → prev
- [ ] Scan button at bottom scrolls to `#scan-widget`, focuses textarea

### Scan Widget
- [ ] File drag-and-drop: `dragover` adds `.drag-over` class, `dragleave` / `drop` removes it
- [ ] File deduplication: same name + size not re-added
- [ ] Form submit: shows loading stepper, calls `POST /api/analyze` with FormData (noticeText + files)
- [ ] API response: renders full results panel with animation
- [ ] "Analyze another case": resets to form state, clears files
- [ ] Cal.com re-initialized after dynamic CTA buttons injected

### Win rate rings
- [ ] Two SVG circles, stroke-dasharray 327 (circumference of r=52)
- [ ] On results render: stroke-dashoffset animates to `circumference × (1 - rate/100)`
- [ ] Number counts up from 0 to target % over 1.2s using setInterval

### Price bars
- [ ] 6 bars rendered (5 competitors + Appeal Edge)
- [ ] Width starts at 0, animates to `(price / maxPrice) × 100%` after 100ms delay

---

## Phase 12 — Mobile Responsive Breakpoints

**≤1024px tablet:**
- [ ] Hero: single column, text centered, scan widget full-width below text
- [ ] Testimonials: single column, 48px gap
- [ ] Pre-footer: single column, 64px gap

**≤768px mobile:**
- [ ] Section padding: 64px vertical, 20px horizontal
- [ ] Nav: links + CTA button hidden, hamburger dot-menu appears
- [ ] Hero: padding-top 120px, buttons stack full-width vertically
- [ ] Trust logos (if any): hidden
- [ ] Background blobs: hidden
- [ ] Hero float card: hidden
- [ ] How It Works cards: single column, 24px gap
- [ ] Testimonials: single column
- [ ] Pricing: single column, featured card loses scale transform
- [ ] Ticker banners: rotation removed
- [ ] Footer: padding-top 80px, pre-footer single column, bottom bar stacks centered

**≤480px small:**
- [ ] Horizontal padding: 16px
- [ ] H1: clamps from `1.9rem`
- [ ] H2: clamps from `1.6rem`
- [ ] Hero badge: 12px font, 6px 12px padding

---

## Phase 13 — External Integrations

- [ ] **Cal.com**: embed script loaded via `<script>` tag. All booking buttons use `data-cal-link="apeksha-n/appeal-edge-diagnosis"`, namespace `"appeal-edge"`, config `{"layout":"month_view","theme":"light"}`. UI theme: `branding.brandColor: "#c3110c"`. Re-initialized after dynamic button injection in widget results.
- [ ] **PayPal**: Direct payment links (not embedded), open in new tab:
  - Standard: `https://paypal.me/aayushAppealEdge/497`
  - Rush: `https://paypal.me/aayushAppealEdge/797`
  - Monitoring: `https://paypal.me/aayushAppealEdge/199`
- [ ] **Tally form**: Referenced in plan.md (`https://tally.so/r/LZ09Ov`) but NOT embedded on the live page
- [ ] **Google Fonts**: Inter + DM Mono loaded via preconnect + CSS import
- [ ] **OG / Twitter meta**: Title "Appeal Edge: Amazon Suspension Appeal Specialists", image `https://www.appeal-edge.com/og-image.png` (1200×630)
- [ ] **Canonical**: `https://appeal-edge.com`

---

## Sanity Check

An AI reading this document should be able to answer:
- [ ] What color is the primary CTA button and what shape is it? → Red gradient, fully rounded pill (100px radius)
- [ ] What font is used for headings? → Inter weight 800
- [ ] What font is used inside the dark scan widget? → DM Mono
- [ ] How many pricing tiers are there and what are the prices? → 3 tiers: $497, $797, $199/mo
- [ ] What section appears between the hero and How It Works? → Case Library (8 case types, swipeable)
- [ ] What does the nav look like when scrolled? → Frosted glass white, tighter padding, subtle shadow
- [ ] What happens when you submit a suspension notice? → Loading stepper (5 steps, 6s minimum), then results with win rate rings + price bars + CTA
- [ ] What are the two ticker banners and what do they say? → Orange: "Protect Your Business / Recover Lost Revenue / Sell With Confidence / Beat Auto-Bots". Red: "Appeal Edge / Account Reinstatement / Flat-Fee No Surprises"
- [ ] What is the footer headline? → "Your account is waiting. Let's get it back."
- [ ] What is the legal disclaimer? → "Not affiliated with or endorsed by Amazon.com, Inc. We are a consulting service, not a law firm."
