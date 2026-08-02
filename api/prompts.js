const CASE_TYPES = {
  inauthentic: {
    id: 'inauthentic',
    label: 'Inauthentic Item Complaint',
    complexity: 'Medium',
    triggers: ['customer complaints', 'item authenticity', 'counterfeit allegations', 'rights owner complaint'],
    evidence: ['Supplier invoices (last 365 days)', 'Letter of Authorization from brand', 'Chain of custody documentation', 'Purchase orders'],
    whyUs: 'Inauthentic complaints require precise invoice matching and supplier authorization chains. We know exactly how Amazon\'s authentication review team evaluates evidence.',
  },
  intellectualProperty: {
    id: 'intellectualProperty',
    label: 'Intellectual Property / Copyright Violation',
    complexity: 'Complex',
    triggers: ['copyright', 'trademark', 'patent', 'brand registry', 'IP complaint', 'DMCA'],
    evidence: ['Trademark/copyright registration', 'Counter-notification letter', 'Retraction from rights owner', 'Legal authorization documents'],
    whyUs: 'IP cases involve legal nuance that generic appeal writers miss. Our specialists draft counter-notifications that satisfy Amazon\'s legal team while preserving your ability to list.',
  },
  productCondition: {
    id: 'productCondition',
    label: 'Used Sold as New / Product Condition',
    complexity: 'Simple',
    triggers: ['used sold as new', 'condition complaint', 'item not as described', 'product condition'],
    evidence: ['Supplier invoices confirming new condition', 'Packaging photos', 'FBA shipment records', 'Customer communication logs'],
    whyUs: 'Condition complaints are among the most winnable cases when documented correctly. We know the exact language Amazon wants to see in condition POAs.',
  },
  safetyComplaint: {
    id: 'safetyComplaint',
    label: 'Product Safety / Hazmat Complaint',
    complexity: 'Complex',
    triggers: ['safety complaint', 'hazmat', 'dangerous goods', 'chemical', 'flammable', 'battery', 'CPSC', 'recalled'],
    evidence: ['Safety Data Sheet (SDS/MSDS)', 'Test reports from accredited lab', 'Certificate of Compliance', 'Children\'s Product Certificate if applicable'],
    whyUs: 'Safety cases require lab test documentation that most sellers don\'t have ready. We partner with accredited labs and know exactly which certifications Amazon\'s hazmat team accepts.',
  },
  reviewManipulation: {
    id: 'reviewManipulation',
    label: 'Review Manipulation / Incentivized Reviews',
    complexity: 'Complex',
    triggers: ['review manipulation', 'incentivized reviews', 'fake reviews', 'review trading', 'buyer-seller messaging'],
    evidence: ['Internal communication policy documents', 'Email templates showing compliance', 'Training records for staff', 'Proof of policy changes'],
    whyUs: 'Amazon takes review manipulation extremely seriously. Our POAs demonstrate a systemic overhaul of your review-gathering processes, which is the only thing that convinces their trust team.',
  },
  policyViolation: {
    id: 'policyViolation',
    label: 'General Policy Violation',
    complexity: 'Medium',
    triggers: ['policy violation', 'terms of service', 'selling agreement', 'code of conduct', 'prohibited activity'],
    evidence: ['Detailed corrective action plan', 'Internal policy documentation', 'Staff training records', 'Process improvement documentation'],
    whyUs: 'Policy violations require showing Amazon a credible systemic fix, not just apologizing. Our POAs are structured around Amazon\'s exact reinstatement framework.',
  },
  performanceMetrics: {
    id: 'performanceMetrics',
    label: 'Performance Metrics (ODR/LDR/Cancellation)',
    complexity: 'Simple',
    triggers: ['order defect rate', 'ODR', 'late delivery', 'LDR', 'cancellation rate', 'pre-fulfillment cancel', 'performance metrics'],
    evidence: ['Root cause analysis of metric failures', 'Operational changes documentation', 'Carrier/supplier agreements', 'New fulfillment process description'],
    whyUs: 'Metric suspension POAs succeed when they show Amazon a root cause they believe and an operational fix they trust will hold. We know what Amazon\'s metrics team wants to see in a credible fix.',
  },
  sellerVerification: {
    id: 'sellerVerification',
    label: 'Identity / Seller Verification Failure',
    complexity: 'Medium',
    triggers: ['identity verification', 'seller verification', 'documentation required', 'account information', 'verify identity', 'business documents'],
    evidence: ['Government-issued photo ID', 'Business registration/incorporation docs', 'Bank statement matching account', 'Utility bill (address verification)', 'Business license'],
    whyUs: 'Verification cases fail when sellers submit the wrong document format or quality. We guide you through Amazon\'s exact document specifications and review submissions before they go in.',
  },
};

// Published market rates for comparable third-party appeal services, for context only.
// Not a claim about Appeal Edge's own pricing, which is not published (see live FAQ).
const COMPETITOR_PRICING = {
  'Riverbend Consulting': { range: '$1,500 to $2,500', low: 1500, high: 2500 },
  'CJ Rosenbaum': { range: 'around $3,000', low: 2800, high: 3200 },
  'eGrowth Partners': { range: 'around $2,500', low: 2200, high: 2800 },
  'Appeal Guru': { range: '$1,495', low: 1495, high: 1495 },
  'Thompson & Holt': { range: '$600 to $1,000', low: 600, high: 1000 },
};

const SYSTEM_PROMPT = `You are an expert Amazon suspension appeal analyst with 10+ years of experience working on Seller Performance appeals. You have reviewed thousands of Amazon suspension notices and Plan of Action submissions.

Your job: analyze the provided Amazon suspension notice and return a structured JSON object with your analysis. Be specific — reference actual ASINs, dates, product names, and violation language from the notice.

Respond ONLY with valid JSON. No markdown, no explanation — pure JSON.

The 8 suspension case types you must classify into:
1. inauthentic — Inauthentic Item Complaint (customer or rights owner complaints about product authenticity)
2. intellectualProperty — Intellectual Property / Copyright Violation (trademark, patent, copyright, DMCA)
3. productCondition — Used Sold as New / Product Condition (condition mismatch complaints)
4. safetyComplaint — Product Safety / Hazmat Complaint (dangerous goods, CPSC, safety issues)
5. reviewManipulation — Review Manipulation / Incentivized Reviews (fake or paid reviews)
6. policyViolation — General Policy Violation (ToS, selling agreement, prohibited activity)
7. performanceMetrics — Performance Metrics (ODR, LDR, cancellation rate thresholds breached)
8. sellerVerification — Identity / Seller Verification Failure (identity docs required)

If the text is clearly NOT an Amazon suspension notice, set caseTypeId to "unrecognized".

JSON structure to return:
{
  "caseType": "<human readable label>",
  "caseTypeId": "<one of the 8 IDs above or 'unrecognized'>",
  "complexityTier": "<Simple|Medium|Complex>",
  "synthesis": "<1-2 sentences in plain, everyday English. Tell them what happened and why they need help. No jargon. Reference the specific violation type and why it's serious.>",
  "rootCausePreview": "<1-2 sentences: likely operational root cause based on the notice>",
  "evidenceNeeded": ["<specific document 1>", "<specific document 2>", "<specific document 3>", "<specific document 4>"],
  "competitorPricing": {
    "Riverbend Consulting": "$1,500 to $2,500",
    "CJ Rosenbaum": "around $3,000",
    "eGrowth Partners": "around $2,500",
    "Appeal Guru": "$1,495",
    "Thompson & Holt": "$600 to $1,000"
  },
  "whyThisMatters": "<2 sentences in plain English on what makes this specific case type hard to win and what a credible appeal needs to show. Ground it in the notice, not in generic advice.>",
  "urgencyNote": "<1 plain English sentence about urgency — time is running out, act now>",
  "keyInsight": "<1 plain English sentence that shows you spotted something specific in this notice that a generic template would miss>"
}

Do not invent win rates, success percentages, case counts, or any pricing for Appeal Edge itself. Appeal Edge's pricing is not published and is discussed only after a case review, so never generate a price, tier, or rate for Appeal Edge. The competitorPricing object is fixed, third-party market data, not something to estimate.

Never use an em dash, en dash, or a hyphen used as a sentence-connecting dash anywhere in your output. Use a period, comma, or the word "and" instead. Hyphens inside real compound words (e.g. "24-hour", "self-reported") are fine.`;

module.exports = { CASE_TYPES, COMPETITOR_PRICING, SYSTEM_PROMPT };
