# Appeal Edge — Project Brief

## What is this?

**Appeal Edge** is an AI-powered consulting service that helps Amazon sellers get their suspended accounts reinstated. When Amazon suspends a seller's account, the seller must write a formal "Plan of Action" (POA) — a structured document that explains what went wrong, what was fixed, and how it won't happen again. Amazon reviews this document and decides whether to reinstate the account.

Appeal Edge uses AI to analyze the seller's suspension notice, figure out the exact violation type, and generate a high-quality, case-specific POA — not a generic template. The service delivers this POA in 24–48 hours at a flat fee of $497 (or $797 rush), compared to competitors who charge $1,500–$6,000 and take 4–7 business days using purely manual processes.

---

## The Problem

Amazon's enforcement has become aggressive and largely automated. Over 14% of seller accounts were suspended in Q1 2025 alone — roughly 266,000 sellers per year globally. When this happens:

- The seller's revenue stops immediately. Every day suspended = lost income.
- Writing an effective POA requires deep knowledge of Amazon's internal review process.
- Most sellers don't know what to write, submit generic appeals, get rejected, and dig themselves deeper.
- Professional help is expensive ($1,500–$6,000) and slow (days, not hours).
- Existing services still rely on human consultants manually drafting appeals, which means they're expensive, inconsistent, and don't scale.

The existing market complaints cluster around: **overpriced**, **template-sounding letters**, **poor communication after payment**, and **no transparency on pricing**.

---

## The Solution

Appeal Edge runs a 4-step AI pipeline:

1. **Classify** the suspension notice — identify the exact violation type, ASINs involved, and what evidence Amazon is implicitly asking for.
2. **Research** the relevant Amazon policies, common rejection triggers for this case type, and what a strong appeal requires.
3. **Draft the POA** — case-specific, operational language (not legal, not emotional), structured in Amazon's required 3-part format: Root Cause → Corrective Actions Taken → Preventive Measures.
4. **Quality check** the draft — scan for generic language, vague claims, missing dates/evidence, emotional tone, and logical disconnects.

Total AI processing time: ~20 seconds. Total human review time: 30–45 minutes. Cost per case in AI API fees: $0.03–$0.25. Service price: $497. Gross margin: 95%+.

---

## Who Are the Customers?

**Amazon third-party sellers** — primarily:

- Small to mid-size sellers making $50K–$500K/year on Amazon who can't afford the premium $1,500–$3,000 services but are losing significant income every day they're suspended.
- Sellers who have already tried submitting their own appeal and been rejected, and now need professional help.
- Urgency buyers — suspended sellers don't comparison-shop for weeks. They're in panic mode and need help immediately.

The typical customer is found on Facebook groups for Amazon sellers, Reddit (r/FulfillmentByAmazon), Discord, and LinkedIn. They're often posting in public asking "what do I do?" — which is the primary acquisition channel.

---

## The 8 Suspension Types Served

1. **Inauthentic / Counterfeit** — most common (~35% of cases). Usually triggered by supplier documentation gaps.
2. **Performance Metrics** — Order Defect Rate, Late Shipment Rate, Cancel Rate exceeding Amazon's thresholds.
3. **IP / Trademark / Copyright** — brand rights complaints, often requires verifying trademark validity.
4. **Related Account** — Amazon detects that the seller has/had another suspended account.
5. **Review Manipulation** — soliciting fake reviews, flagged by Amazon's neural network systems.
6. **INFORM Consumers Act** — US compliance documentation not submitted.
7. **Fair Pricing** — Amazon's algorithm flags prices as too high vs. external benchmarks.
8. **Restricted Products** — selling in gated categories without proper authorization.

---

## Business Model

| Tier | Price | Turnaround | Use Case |
|---|---|---|---|
| Standard | $497 | 4 business days | Most suspension types |
| Rush | $797 | 24–48 hours | Urgent / high-revenue sellers |
| Monitoring | $149–299/month | Ongoing | Proactive account health watching |

Includes up to 3 appeal attempts. Additional attempts are $100–200 each.

---

## Competitive Positioning

| Competitor | Price | Weakness |
|---|---|---|
| Riverbend Consulting | $1,500–2,500 | Expensive, slow, quote-based |
| Amazon Sellers Lawyer | ~$3,000 | Attorney pricing, overkill |
| eGrowth Partners | ~$2,500 | "Copy-paste" complaints |
| The Appeal Guru | $1,495 | Still expensive for small sellers |
| Thompson & Holt | $600–1,000 | Reviews cite template language and typos |

**No competitor leads with AI.** Appeal Edge's differentiators: lower price, faster turnaround, fixed transparent pricing (listed on website vs. hidden behind sales calls), real-time WhatsApp communication.

---

## Brand Identity

- **Name:** Appeal Edge
- **Domain:** appeal-edge.com
- **Primary color:** Deep Amazon-red (`#c3110c`) on near-black (`#280905`) backgrounds
- **Tone:** Direct, urgent, credible. Speaks to a panicked seller who needs to stop the bleeding.
- **Tagline direction:** "Amazon Account Suspended? Get Reinstated in 48–72 Hours."

---

## Tech Stack

- **Frontend:** Single-page HTML/CSS/JS site (`public/index.html`)
- **Backend:** Node.js server (`server.js`) with an AI analysis endpoint (`api/analyze.js`)
- **AI:** xAI Grok API via OpenAI-compatible SDK — used for suspension classification, POA drafting, and quality checking
- **Intake form:** Tally.so (live at tally.so/r/LZ09Ov) — 3-page form collecting suspension details, contact info, and document uploads
- **Case management:** Notion database
- **Payments:** PayPal Business + Stripe
- **Communication:** WhatsApp Business + Calendly for discovery calls

---

## Stage of the Project

This is an early-stage solo consulting business in active build/launch phase. The website is live, the intake form is live, the AI backend is built. The focus now is on design refinement, client acquisition through community engagement (Facebook groups, Reddit, LinkedIn), and delivering exceptional results on early cases to build social proof.
