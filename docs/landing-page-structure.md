# Appeal Edge — Landing Page Structure

Complete structural breakdown of `appeal-edge.com` (`public/index.html`). Read this to understand exactly what the page looks like, how it's laid out, and what moves vs. what is static.

---

## Global Design System

**Fonts:**
- Body / UI: `Inter` (weights 400, 500, 600, 700, 800)
- Code / widget / monospace: `DM Mono` (weights 400, 500) — used exclusively inside the dark scan widget

**Color Palette:**
- Deep near-black background: `#280905` (used for all headings and dark text)
- Primary red (buttons, links, accents): `#c3110c`
- Secondary orange-red: `#e6501b`
- Light red tint (backgrounds): `#fef2f2`
- Warm off-white (alternate section bg): `#fcf5f4`
- Body text color: `#8a3a33` (muted warm red-brown)
- Light muted text: `#c67f78`
- Border color: `#f5e6e5`
- Page background: pure white `#FFFFFF`

**Typography scale (fluid, responsive):**
- H1: clamps from 2rem → 6rem
- H2: clamps from 1.75rem → 4rem
- H3: clamps from 1.25rem → 2.25rem
- Body large: clamps from 1rem → 1.375rem
- Body: 1.125rem
- Small: 0.875rem

All headings: weight 800, letter-spacing -0.04em, tight line-height (1.05).

**Layout:**
- Max content width: 1240px, centered
- Horizontal padding: clamps from 24px → 64px
- Section vertical padding: clamps from 100px → 180px (reduced to 64px on mobile)

**Animations — what moves on this page:**
- `.reveal` elements: start at `opacity: 0, translateY(40px)`, animate to visible when scrolled into view (IntersectionObserver, threshold 10%). One-time trigger, never reverses.
- SVG underlines / circles: stroke-dashoffset draws on when parent `.reveal` becomes active (1.5s draw animation)
- Scan widget ambient orb: slow breathing pulse (`scanGlowPulse`, 7s ease-in-out infinite, alternates scale 0.97–1.03 and opacity 0.75–1)
- Scan widget live dot: orange pulsing dot (`livePulse`, 2s, opacity fades 1→0.5)
- Hero floating card: gentle up-down float (`float`, 6s ease-in-out infinite, moves -15px and back) — hidden on mobile
- Ticker banners: continuous left scroll (`ticker`, 25s linear infinite, moves -50% then loops)
- Loading stepper dots: 3 dots bounce in sequence (`dotBounce`, 1.2s, each delayed 0.2s)
- Active stepper dot: red glow pulse (`stepPulse`, 1.2s infinite)
- Win rate rings: SVG stroke-dashoffset animates from full → partial when results appear (1.5s cubic-bezier)
- Price bars: width animates from 0 → target % (1.2s cubic-bezier)
- Number counters: count up from 0 to target % over ~1.2s
- All buttons: lift on hover (translateY -1px to -3px), shimmer sweep effect on hover (white diagonal gradient sweeps left-to-right)
- Scroll-linked background blobs: static but blurred (80px blur, opacity 0.15) — decorative only
- Nav: transitions from transparent → frosted glass with box-shadow when scrolled 20px+

---

## Page Structure (top to bottom)

---

### 0. Background Blob (global, non-scrolling)

A single large decorative blob sits at the top-right of the page behind all content:
- Shape: circle, 600×600px
- Color: `#c3110c` (primary red)
- Effect: 80px blur, 15% opacity
- Position: absolute, top -10%, right -5%
- z-index: 0 (behind everything)
- Hidden on mobile (≤768px)

---

### 1. Navigation Bar

**Position:** Fixed at top, full width. z-index 1000.

**Initial state:** Completely transparent background, 24px vertical padding.

**Scrolled state (triggers at 20px scroll):** Frosted glass — `rgba(255,255,255,0.95)` + `backdrop-filter: blur(16px)`, reduces padding to 16px, adds a very subtle box-shadow. Smooth 0.3s transition.

**Layout (horizontal, three sections):**

**Left — Logo:**
An SVG inline logo, 28px tall:
- A solid red (`#c3110c`) rounded rectangle (28×28px, 6px corner radius) with a white triangle/A-shape inside it, and a red crossbar cutting through the triangle (forming a letter "A")
- To the right: wordmark text "Appeal Edge" in Inter weight 800, `#280905`, font-size 22px, letter-spacing -0.5

**Center — Nav links (hidden on mobile):**
Three text links, 15px Inter weight 500, gap of 48px between them:
1. "How it works" → scrolls to `#how`
2. "Why us?" → scrolls to `#testimonials`
3. "Pricing" → scrolls to `#pricing`

Hover: text turns to `#c3110c` (red)

**Right — CTA Button (hidden on mobile):**
"Book a free call" — outline style pill button:
- Transparent background, red (`#c3110c`) text, 1.5px red border at 45% opacity
- On hover: fills red, text turns white, slight lift + red box-shadow
- Triggers Cal.com booking modal (month view, light theme) for `apeksha-n/appeal-edge-diagnosis`

**Mobile (≤768px):**
- Nav links and CTA button are hidden (`display: none`)
- A kebab/hamburger button appears (3 vertically stacked dots, 40×40px, 10px border-radius, subtle border)
- Clicking it opens a **dropdown menu** anchored below the hamburger, min-width 190px, white background with rounded corners (16px), subtle shadow:
  - "How it works"
  - "Why us?"
  - "Pricing"
  - Thin horizontal divider line
  - "Book a free call →" (red text, bold)
  - Each item is 15px, weight 600, hover highlights with warm bg and red text
  - Clicking any item closes the menu and smooth-scrolls to section

---

### 2. Hero Section (`#hero`)

**Background:** White. Minimum height: 100vh. Vertically centered content. Top padding: 160px (120px on mobile) to clear the fixed nav.

**Layout:** Two-column CSS grid, 1:1, 64px gap, vertically aligned center.
On tablet (≤1024px) and mobile: stacks to single column, text centered.

---

#### 2A. Left Column — Hero Text

**Reveal animation:** Fades up from 40px below on page load.

**Badge (top):**
A small pill/tag above the heading:
- Light red background (`#fef2f2`), red text
- Contents: a small 8×8px red filled circle + text "Amazon Appeal Specialists"
- Font: 14px weight 600
- Shape: 100px border-radius (fully rounded)
- Margin below: 32px

**H1 Heading (two lines):**
```
Your Amazon account is suspended.
We get you back.
```
- "We get you back." is wrapped in a highlight span
- Under "We get you back." sits an animated SVG underline: a hand-drawn curved stroke (`Q 150 -5 295 15`) in primary red, `stroke-width: 6`, stroke-linecap round
- The underline draws itself (stroke-dashoffset 1000→0) when the element scrolls into view, over 1.5s

**Subheading paragraph (delay: 0.1s):**
> "Stop guessing what Amazon wants. Our appeal specialists analyze your suspension notice, identify the exact root cause, and craft a case-specific Plan of Action. Not a template."

Font: body-large (clamps 1rem–1.375rem), color `#8a3a33`, line-height 1.6, max-width 480px.

**CTA Buttons (delay: 0.2s) — side by side, wrap on mobile:**

Button 1 — Primary red gradient pill:
- Label: "Book a free 15-min call"
- Icon: calendar SVG icon to the left of text
- Style: gradient `#c3110c → #d93a10 → #e6501b` (135deg), white text, fully rounded (100px radius)
- Padding: 19px 38px, font-size 16px, weight 700
- Shadow: layered red glow shadows + inset highlight
- Hover: lifts 3px, stronger red glow, shimmer sweeps across
- Action: opens Cal.com booking modal

Button 2 — Secondary white pill:
- Label: "Scan my case first"
- Style: white background, near-black text, 1.5px border at 10% opacity
- Padding: 17px 34px
- Hover: border turns slightly red, subtle shadow, lifts 2px
- Action: smooth-scrolls to the scan widget below and focuses the textarea after 600ms

**Hint text below buttons (delay: 0.2s):**
> "Not sure? The free scan tells you your case type and win rate in 30 seconds."
Font: 13px, muted light text (`#c67f78`), margin-top 16px.

---

#### 2B. Right Column — Dark Scan Widget

**This is the hero's main visual element.** A dark, terminal-style interactive card.

**Outer wrapper (`.hero-scan-widget`):**
- Max-width: 530px, margin-left: auto (pushed right)
- Contains an ambient glow orb behind it (absolutely positioned, extends 100px beyond the card on all sides)

**Ambient Orb (`.scan-orb`) — animated background glow:**
- Not a visible element — it's a blurred radial gradient creating a red/orange ember glow around the card
- Two overlapping gradients: top-right red and bottom-left orange
- Slowly breathes in and out (scale + opacity, 7s, infinite, alternate)

**Card Shell (`.scan-inner`):**
- Background: very dark near-black gradient (`#130302 → #0d0201 → #110403`)
- Border: 1px, `rgba(195,17,12,0.28)` (subtle dark red)
- Border-radius: 18px
- Max-height: 620px, scrollable with thin red scrollbar
- Multiple layered shadows: inset highlights, deep black drop shadow, subtle red outer glow

**Top ember line:**
- 1px horizontal line at the very top of the card
- Gradient: `transparent → deep red → orange-red → transparent`
- Creates a "glowing top edge" effect

**Card Header (inside `.scan-body` padding: 20px 22px):**
- Left side: animated orange pulsing dot (7px, `#e6501b`, pulsing box-shadow 2s infinite) + text "FREE CASE SCAN" in DM Mono, 11px, uppercase, letter-spacing 0.12em, near-white
- Right side: "Instant · Free" in DM Mono, 10px, very muted white (28% opacity)
- Below header: thin horizontal divider line (6% white opacity)

---

**The widget has 4 states that swap in/out:**

**STATE 1: Input Form (default)**

1. **Textarea:**
   - 130px tall, nearly full width
   - Dark translucent background (`rgba(255,255,255,0.04)`)
   - 1px border (8% white)
   - Placeholder text: "Paste your Amazon suspension notice here..." in DM Mono, 12px, 20% opacity white
   - Focus state: border turns red (60% opacity), red glow ring (`rgba(195,17,12,0.12)`)

2. **File Upload Zone:**
   - Horizontal layout: paperclip icon (📎, 20px) on left + text block on right
   - Text: "**Attach files** or drag & drop" (bold part in warm orange-tinted white)
   - Sub-text: "PDF · PNG · JPG · TXT · EML · Max 10MB · 5 files" in DM Mono, 11px, very muted
   - Border: 1px dashed (12% white opacity)
   - Background: 2.5% white opacity
   - Hover / drag-over: background turns to `rgba(195,17,12,0.08)`, border turns 40% red
   - Clicking opens system file picker. Drag-and-drop also works.

3. **File Pills** (appear below upload zone after files are attached):
   - Each attached file appears as a rounded pill
   - Dark red tinted background (`rgba(195,17,12,0.18)`), warm orange text
   - Shows file name with 📄 icon + an × button to remove
   - Pills wrap to multiple rows if needed

4. **Submit Button:**
   - Full width, 16px tall padding
   - Red gradient (`#c3110c → #e6501b`), white text
   - Text: "Analyze My Suspension" + arrow SVG icon (→)
   - Font: DM Mono, 14px, uppercase, letter-spacing 0.06em
   - Red glow shadow, inset highlight
   - Hover: lifts 2px, stronger shadow, shimmer sweeps
   - Active: snaps back down 1px

**STATE 2: Loading (after submit)**

The form disappears. A loading panel appears:

- **Header row:** 3 small dots (`#c3110c`, `#d42010`, `#e6501b`) that bounce in sequence + text "ANALYZING YOUR CASE" in DM Mono, 11px, uppercase, 50% white
- **Vertical stepper** with a thin connecting line behind the dots (1px, 6% white):
  - 5 steps, each with a numbered circle (30px, dark border) and a text label
  - Inactive: 30% opacity
  - Active: circle turns red with a red glow pulse animation; label turns near-white
  - Done: circle turns orange-red; a checkmark SVG replaces the number; fades to 55% opacity
  - Steps advance automatically every 1.2 seconds:
    1. "Reading your suspension notice..."
    2. "Classifying violation type..."
    3. "Analyzing case specifics..."
    4. "Calculating reinstatement probability..."
    5. "Generating personalized analysis..."
- Minimum display time: 6 seconds (even if AI responds faster, the stepper plays out)

**STATE 3: Results (AI analysis complete)**

The loading panel disappears. A scrollable results panel appears (card scrolls to top). Contains these blocks top to bottom:

1. **Classification Header Row:**
   - A pill badge showing the detected case type (e.g., "INAUTHENTIC COMPLAINT") — DM Mono, uppercase, dark red tinted background, orange-pink text, 6px border-radius
   - Next to it: a complexity badge (e.g., "SIMPLE COMPLEXITY" / "MEDIUM COMPLEXITY" / "COMPLEX COMPLEXITY") — same monospace pill style, different tint colors

2. **Synthesis Block:**
   - A left-bordered block (3px solid red, 85% opacity)
   - Background: `rgba(195,17,12,0.09)` (dark red tint)
   - Border-radius: 0 10px 10px 0
   - Contains AI-generated 1–2 sentence synthesis of what's happening with the case
   - Font: 14px, near-white, line-height 1.65

3. **Win Rate Rings Box:**
   - Dark box (4% white bg, 9% white border, 10px radius)
   - Title: "REINSTATEMENT PROBABILITY" in DM Mono, 11px, uppercase, 55% white
   - Two SVG circular ring charts side by side in a 2-column grid:
     - **Left ring:** "Industry Average" — labeled in amber/red color. Shows a % number counting up from 0.
     - **Right ring:** "With Appeal Edge" — labeled in orange-red color. Shows a higher % number counting up from 0.
   - Each ring: 80px × 80px SVG. Gray track ring underneath, colored fill ring on top. The fill animates by reducing stroke-dashoffset from full (empty) → partial (filled) over 1.5s.
   - The percentage number is centered inside the ring, DM Mono, 21px weight 500, white.
   - Below each ring: small label in DM Mono, 11px, 55% white.

4. **Competitor Price Comparison Box:**
   - Dark box (same style as win rate box)
   - Title: "HOW WE COMPARE ON PRICE" in DM Mono
   - A list of horizontal bar charts, one per competitor + Appeal Edge:
     - Name on left, price on right (small text)
     - Below: a track bar (8px tall, rounded) with a fill bar that animates from 0% → relative width
     - Competitors: gray fill. Appeal Edge: red fill (`#c3110c`)
     - Competitors listed: CJ Rosenbaum (~$3,000), eGrowth Partners (~$2,500), Riverbend Consulting ($1,500–$2,500), Appeal Guru ($1,495), Thompson & Holt ($600–$1,000), Appeal Edge (highlighted with ✦)

5. **Why Appeal Edge Box:**
   - Dark red tinted box (`rgba(195,17,12,0.09)`, 1px red border at 28% opacity)
   - Title: "WHY APPEAL EDGE FOR THIS CASE" in DM Mono, 11px, uppercase, warm orange-pink
   - AI-generated 1–2 sentences specific to why Appeal Edge is suited for this case type. Font: 14px, 88% white, line-height 1.65.

6. **CTA Block (the conversion endpoint):**
   - Background: 5% white, 1px white border (10% opacity), 12px radius
   - An urgency notice at the top (full-width block, warm orange tint, 1px border): shows AI-generated urgency line like "⏰ Act fast — seller accounts lose standing the longer they're suspended."
   - **If Simple or Medium complexity case:**
     - H3: "Your case is actionable. Let's move."
     - Paragraph: "Flat fee · $497 · Up to 3 revision rounds included. We start the same day."
     - Button 1 (primary): "Get started · $497" → PayPal link. Red gradient, DM Mono font, 14px.
     - Button 2 (ghost): "Have questions? Book a call" → Cal.com modal. Translucent white border.
   - **If Complex case:**
     - H3: "This case needs a specialist review."
     - Paragraph: "Book a free 15-min call and we'll map out exactly what your appeal needs before you spend a cent."
     - Button 1 (primary): "Book a free 15-min call" → Cal.com modal.
     - Button 2 (ghost): "Get started · $797" → PayPal link.

7. **"Analyze another case" link:**
   - Small text link at the bottom, DM Mono, 12px, 35% white, underlined
   - Clicking resets the widget back to State 1 (input form)

**STATE 4: Error**

If the API fails:
- Warning emoji (⚠️, 32px)
- H3: "Analysis Failed"
- Paragraph: error message from the server (default: "Something went wrong. Please try again.")
- Button: "Try Again" — primary red pill, resets to form

---

### 3. How It Works Section (`#how`)

**Background:** Warm off-white (`#fcf5f4`). Full section padding.

**Section header (centered, reveal animation):**
- H2: "Three steps to **freedom.**"
  - "freedom." is wrapped in a highlight-wrap with an animated SVG circle drawn around it
  - The circle is a hand-drawn oval path (`stroke: #e6501b`, stroke-width 4, draws on scroll-in over 1.5s)
- Subtext below: "We engineered the complexity out of the appeal process." — body-large size, max-width 600px, centered.

**3 Feature Cards (CSS grid, 3 columns, 40px gap):**

Each card:
- White background, 32px border-radius, 1px border (`#f5e6e5`), subtle shadow
- Hover: lifts 8px, stronger shadow, spring easing
- Reveal animations with staggered delays (0.1s, 0.2s, 0.4s)

**Card 1: Expert Analysis (delay 0.1s)**
- Icon container: 72×72px, 24px radius, light red background (`#fef2f2`), red icon color
- Icon: document/file SVG
- H3: "Expert Analysis"
- Body: "Paste your suspension notice. Our specialists identify the root cause and map the exact policy requirements needed for reinstatement."

**Card 2: Reviewed by Specialists (delay 0.2s)**
- Icon container: same size, warm orange-light background (`#fff7ed`), orange icon color
- Icon: globe/world SVG
- H3: "Reviewed by Specialists"
- Body: "An appeal specialist with deep Amazon policy knowledge reviews and refines every PoA: checking tone, specificity, and the exact language Amazon's review team responds to."

**Card 3: Reinstatement (delay 0.4s)**
- Icon container: same size, orange-light background, orange icon color
- Icon: checkmark circle SVG
- H3: "Reinstatement"
- Body: "Submit your custom-tailored Plan of Action. Amazon typically responds within 24-72 hours. If rejected, we revise and resubmit at no extra cost."

On mobile (≤768px): cards stack to single column, gap reduces to 24px.

---

### 4. Testimonials Section (`#testimonials`)

**Background:** Pure white. Full section padding.

**Layout:** Two-column grid, 1:1, 64px gap, vertically centered. Stacks on ≤1024px.

**Left column — Testimonial card + author (reveal animation):**

The card:
- Background: `#e6501b` (orange-red — the "featured" variant)
- 32px border-radius, padding 48px
- Has a CSS triangle "tail" pointing down-left (speech bubble effect), in the same orange color
- Quote text (no quotation marks in the code, just the text):
  > "I'd already tried writing the appeal myself twice and got nowhere. Appeal Edge looked at my suspension notice, spotted exactly what Amazon needed to see, and got it right the first time. Back selling within 48 hours."
- Font: 1.25rem, weight 500, line-height 1.6, white text

Author block (sits below the card, NOT inside it, padding-left 48px):
- Circular avatar image: 68×68px, covers `/assets/testomonial.png`
- Name: "James T." — weight 700, `#280905`
- Role: "Amazon FBA Seller, inauthentic complaint" — 14px, muted text

**Right column — Proof points (reveal, delay 0.2s):**
Contained in a max-width 400px div with 40px left padding.

- H2: "What our early clients are saying."
- Body paragraph (body-large): "We're a focused team of appeal specialists. Every case gets personal attention — not a copy-paste template. That's the difference clients notice first."
- Below (40px margin-top): 3 checklist items with red checkmark SVG icons (20×20px, stroke-width 2.5):
  1. "Case-specific POA, not a generic template"
  2. "Up to 3 revision rounds included"
  3. "50% refund if no progress after 2 full attempts"

---

### 5. Pricing Section (`#pricing`)

**Background:** Warm off-white (`#fcf5f4`). Full section padding.

**Section header (centered, reveal):**
- H2: "Simple, transparent pricing."
- Subtext: "No retainers. No surprise invoices. One flat fee covers your full appeal." — body-large, 16px top margin.

**3 Pricing Cards (grid, 3 columns, 32px gap, max-width 1100px, centered):**

On mobile: stacks to single column.

**Card 1: Standard Action**
- White background, 32px radius, 1px border, subtle shadow
- H3: "Standard Action"
- Subtext: "For common policy violations."
- Price: **$497** — large (clamps 2.5rem–4rem), weight 800, near-black
- Feature list (4 items, each with red checkmark SVG):
  - Expert-Drafted PoA
  - Human Expert Review
  - 4-Day Turnaround
  - 3 Free Revisions
- CTA button (full width, pricing style — off-white rounded rect, warm border):
  - Label: "Get Started · Pay via PayPal"
  - Links to `https://paypal.me/aayushAppealEdge/497`
  - On hover: border turns slightly red, slight lift

**Card 2: Rush Appeal — FEATURED (center card, scaled up)**
- Scaled to 105% (`transform: scale(1.05)`) — visually larger than the other two
- 2px solid red border (`#c3110c`)
- Has a floating badge above it: "MOST POPULAR" — positioned absolute, top -16px, centered horizontally. Red background, white text, fully rounded pill, 13px uppercase bold.
- H3: "Rush Appeal"
- Subtext: "For sellers who can't afford to wait."
- Price: **$797**
- Feature list (4 items):
  - Everything in Standard
  - Priority handling
  - 24-Hour Turnaround
  - Unlimited Revisions
- CTA button (full width, primary pricing style — red gradient rounded rect):
  - Label: "Start Rush Appeal · Pay via PayPal →"
  - Links to `https://paypal.me/aayushAppealEdge/797`
  - Shimmer sweep on hover, stronger shadow
- Hover: lifts 8px in addition to the existing scale

**Card 3: Monitoring**
- Same style as Card 1
- H3: "Monitoring"
- Subtext: "Stay ahead of issues before they escalate."
- Price: **$199** with **/mo** in smaller muted text (1.25rem, weight 500)
- Feature list (4 items):
  - Weekly Account Health Reviews
  - Early Warning on Policy Flags
  - Direct Access via Email/WhatsApp
  - 1 Free Appeal per year
- CTA button: "Get Started · Pay via PayPal" → `https://paypal.me/aayushAppealEdge/199`

---

### 6. Marquee Ticker Banners

Two full-width continuously scrolling text banners. Both are positioned between the Pricing section and the Footer. They stack vertically.

**Banner 1 (orange, on top):**
- Background: `#e6501b` (orange)
- Rotated: `rotate(1deg) scale(1.05)` — slightly tilted clockwise, slightly oversized so edges bleed off screen
- Margin-top: -60px (overlaps pricing section bottom slightly)
- Text scrolls continuously left, 25s loop
- Content (repeated twice for seamless loop): "Protect Your Business" • "Recover Lost Revenue" • "Sell With Confidence" • "Beat Auto-Bots"
- Font: 1.25rem–2.5rem (fluid), weight 800, uppercase, white, letter-spacing 0.05em
- Each word/phrase separated by a bullet "•"

**Banner 2 (red, below):**
- Background: `#c3110c` (red)
- Rotated: `rotate(-2deg) scale(1.05)` — slightly tilted counter-clockwise
- Margin-top: 64px (after pricing section)
- Box-shadow: `0 20px 40px rgba(0,0,0,0.15)`
- Content (repeated twice): "Appeal Edge" • "Account Reinstatement" • "Appeal Edge" • "Flat-Fee · No Surprises"
- Same font styling as Banner 1

On mobile (≤768px): rotation is removed (`transform: none`) so the banners don't clip.

---

### 7. Footer / Pre-footer (`<footer>`)

**Background:** Pure black (`#000000`). White text throughout. The footer section overlaps the ticker banners by -120px margin-top (z-index layering creates the overlap effect). This is NOT visible on mobile.

**Layout:** Two zones stacked vertically — Pre-footer grid, then Footer bottom bar.

---

#### 7A. Pre-footer Grid

Two-column, 120px gap, max-width 1240px, centered. Has a thin horizontal divider (`rgba(255,255,255,0.1)`) at its bottom. Stacks to single column on ≤1024px.

**Left column:**
- H2 (white, large — clamps 2rem–4.5rem, weight 800):
  ```
  Your account is waiting.
  Let's get it back.
  ```
- Two buttons side by side (wrap on mobile):
  - Button 1 — "Start your free analysis":
    - Style: orange-to-red gradient (`#e6501b → #c3110c`), white text, fully rounded (100px radius), padding 22px 56px, font-size 18px weight 700
    - Multiple layered shadows including a wide outer glow
    - Hover: lifts 3px, stronger glow
    - Shimmer sweep on hover
    - Scrolls to `#scan-widget`
  - Button 2 — "Book a free call":
    - Style: `rgba(255,255,255,0.08)` background, white text, `rgba(255,255,255,0.2)` border, same pill shape
    - Calendar icon to the left of text
    - Opens Cal.com booking modal

**Right column:**
Two sub-columns side by side (gap 80px, padding-top 32px). Stack to vertical on mobile.

- **Sub-column: "CONNECT"** (label in 14px uppercase, letter-spacing 0.1em, muted gray `#c67f78`)
  - "How it Works" → scrolls to `#how`
  - "Testimonials" → scrolls to `#testimonials`
  - "Pricing" → scrolls to `#pricing`
  - Links: white, 20px, weight 500. On hover: an underline animates in (scaleX 0→1 from right, 0.25s)

- **Sub-column: "CONTACT US"**
  - `social@appeal-edge.com` (email link, same style)

---

#### 7B. Footer Bottom Bar

Max-width 1240px, centered, 64px top margin. Horizontal layout — left and right. On mobile: stacks vertically, centered.

**Left — Footer Logo:**
The same SVG logo as the nav, but adapted for dark background:
- The A-mark rectangle is white at 15% opacity (ghost effect)
- The A triangle path is white (solid)
- The crossbar is red (`#c3110c`)
- The "Appeal Edge" wordmark text is white

**Right — Legal disclaimer:**
> "© 2026 Appeal Edge. Not affiliated with or endorsed by Amazon.com, Inc. We are a consulting service, not a law firm."

Font: 14px, `#c67f78` (muted gray-pink). Right-aligned, max-width 500px.

---

## Behavioral Notes

**Scroll behavior:** All anchor links use `scroll-behavior: smooth` (set on `<html>`).

**Reveal system:** Every major content block has the `.reveal` class. They all start invisible and slide up when scrolled into view. Staggered delays (`.delay-1` = 0.1s, `.delay-2` = 0.2s, `.delay-3` = 0.4s) create a cascading appearance.

**The scan widget is the primary conversion tool on this page.** It lives in the hero and gives users immediate value (free AI analysis) before asking for any payment. The results panel inside the widget is the deepest funnel point on the page — it shows a personalized price, shows how much cheaper Appeal Edge is than competitors, and presents a direct payment link (PayPal).

**Cal.com booking** is the secondary conversion path for users who want to talk before paying. It appears in: nav CTA, hero primary button, footer buttons, and inside the scan widget results (for complex cases, it's the primary CTA).

**PayPal payment links** are the tertiary/direct conversion path for users who are ready to pay immediately, shown in: pricing cards and scan widget results.

**No forms, modals, or pop-ups** exist on the page aside from the Cal.com booking overlay (external widget). The scan widget is the only interactive component built natively.
