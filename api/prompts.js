const CASE_TYPES = {
  inauthentic: {
    id: 'inauthentic',
    label: 'Inauthentic Item Complaint',
    complexity: 'Medium',
    price: 497,
    tier: 'Standard',
    industryWinRateRange: [55, 72],
    appealEdgeWinRateRange: [87, 93],
    triggers: ['customer complaints', 'item authenticity', 'counterfeit allegations', 'rights owner complaint'],
    evidence: ['Supplier invoices (last 365 days)', 'Letter of Authorization from brand', 'Chain of custody documentation', 'Purchase orders'],
    whyUs: 'Inauthentic complaints require precise invoice matching and supplier authorization chains. Our team has resolved 400+ of these cases and knows exactly how Amazon\'s authentication review team evaluates evidence.',
  },
  intellectualProperty: {
    id: 'intellectualProperty',
    label: 'Intellectual Property / Copyright Violation',
    complexity: 'Complex',
    price: 797,
    tier: 'Rush',
    industryWinRateRange: [38, 55],
    appealEdgeWinRateRange: [74, 85],
    triggers: ['copyright', 'trademark', 'patent', 'brand registry', 'IP complaint', 'DMCA'],
    evidence: ['Trademark/copyright registration', 'Counter-notification letter', 'Retraction from rights owner', 'Legal authorization documents'],
    whyUs: 'IP cases involve legal nuance that generic appeal writers miss. Our specialists draft counter-notifications that satisfy Amazon\'s legal team while preserving your ability to list.',
  },
  productCondition: {
    id: 'productCondition',
    label: 'Used Sold as New / Product Condition',
    complexity: 'Simple',
    price: 497,
    tier: 'Standard',
    industryWinRateRange: [65, 78],
    appealEdgeWinRateRange: [90, 96],
    triggers: ['used sold as new', 'condition complaint', 'item not as described', 'product condition'],
    evidence: ['Supplier invoices confirming new condition', 'Packaging photos', 'FBA shipment records', 'Customer communication logs'],
    whyUs: 'Condition complaints are among the most winnable cases when documented correctly. We know the exact language Amazon wants to see in condition POAs.',
  },
  safetyComplaint: {
    id: 'safetyComplaint',
    label: 'Product Safety / Hazmat Complaint',
    complexity: 'Complex',
    price: 797,
    tier: 'Rush',
    industryWinRateRange: [30, 50],
    appealEdgeWinRateRange: [68, 80],
    triggers: ['safety complaint', 'hazmat', 'dangerous goods', 'chemical', 'flammable', 'battery', 'CPSC', 'recalled'],
    evidence: ['Safety Data Sheet (SDS/MSDS)', 'Test reports from accredited lab', 'Certificate of Compliance', 'Children\'s Product Certificate if applicable'],
    whyUs: 'Safety cases require lab test documentation that most sellers don\'t have ready. We partner with accredited labs and know exactly which certifications Amazon\'s hazmat team accepts.',
  },
  reviewManipulation: {
    id: 'reviewManipulation',
    label: 'Review Manipulation / Incentivized Reviews',
    complexity: 'Complex',
    price: 797,
    tier: 'Rush',
    industryWinRateRange: [25, 45],
    appealEdgeWinRateRange: [62, 75],
    triggers: ['review manipulation', 'incentivized reviews', 'fake reviews', 'review trading', 'buyer-seller messaging'],
    evidence: ['Internal communication policy documents', 'Email templates showing compliance', 'Training records for staff', 'Proof of policy changes'],
    whyUs: 'Amazon takes review manipulation extremely seriously. Our POAs demonstrate a systemic overhaul of your review-gathering processes, which is the only thing that convinces their trust team.',
  },
  policyViolation: {
    id: 'policyViolation',
    label: 'General Policy Violation',
    complexity: 'Medium',
    price: 497,
    tier: 'Standard',
    industryWinRateRange: [50, 65],
    appealEdgeWinRateRange: [82, 91],
    triggers: ['policy violation', 'terms of service', 'selling agreement', 'code of conduct', 'prohibited activity'],
    evidence: ['Detailed corrective action plan', 'Internal policy documentation', 'Staff training records', 'Process improvement documentation'],
    whyUs: 'Policy violations require showing Amazon a credible systemic fix, not just apologizing. Our POAs are structured around Amazon\'s exact reinstatement framework.',
  },
  performanceMetrics: {
    id: 'performanceMetrics',
    label: 'Performance Metrics (ODR/LDR/Cancellation)',
    complexity: 'Simple',
    price: 497,
    tier: 'Standard',
    industryWinRateRange: [60, 75],
    appealEdgeWinRateRange: [88, 95],
    triggers: ['order defect rate', 'ODR', 'late delivery', 'LDR', 'cancellation rate', 'pre-fulfillment cancel', 'performance metrics'],
    evidence: ['Root cause analysis of metric failures', 'Operational changes documentation', 'Carrier/supplier agreements', 'New fulfillment process description'],
    whyUs: 'Metric suspension POAs succeed when they show Amazon a root cause they believe AND an operational fix they trust will hold. We\'ve written hundreds of these and know what metrics teams want to see.',
  },
  sellerVerification: {
    id: 'sellerVerification',
    label: 'Identity / Seller Verification Failure',
    complexity: 'Medium',
    price: 497,
    tier: 'Standard',
    industryWinRateRange: [55, 70],
    appealEdgeWinRateRange: [83, 92],
    triggers: ['identity verification', 'seller verification', 'documentation required', 'account information', 'verify identity', 'business documents'],
    evidence: ['Government-issued photo ID', 'Business registration/incorporation docs', 'Bank statement matching account', 'Utility bill (address verification)', 'Business license'],
    whyUs: 'Verification cases fail when sellers submit the wrong document format or quality. We guide you through Amazon\'s exact document specifications and review submissions before they go in.',
  },
};

const COMPETITOR_PRICING = {
  'Riverbend Consulting': { range: '$1,500 – $2,500', low: 1500, high: 2500 },
  'CJ Rosenbaum': { range: '~$3,000', low: 2800, high: 3200 },
  'eGrowth Partners': { range: '~$2,500', low: 2200, high: 2800 },
  'Appeal Guru': { range: '$1,495', low: 1495, high: 1495 },
  'Thompson & Holt': { range: '$600 – $1,000', low: 600, high: 1000 },
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
  "industryWinRate": <integer 0-100>,
  "appealEdgeWinRate": <integer 0-100>,
  "competitorPricing": {
    "Riverbend Consulting": "$1,500 – $2,500",
    "CJ Rosenbaum": "~$3,000",
    "eGrowth Partners": "~$2,500",
    "Appeal Guru": "$1,495",
    "Thompson & Holt": "$600 – $1,000"
  },
  "appealEdgePrice": <497 or 797>,
  "appealEdgeTier": "<Standard Action or Rush Appeal>",
  "whyAppealEdge": "<2 sentences in plain English on why Appeal Edge wins this type of case. Focus on our track record and results, not on what needs to be done.>",
  "urgencyNote": "<1 plain English sentence about urgency — time is running out, act now>",
  "keyInsight": "<1 plain English sentence that shows we spotted something important that generic services miss>"
}

Win rate calibration:
- industryWinRate: realistic market average for this case type, in range appropriate to complexity (Simple: 60-78, Medium: 50-72, Complex: 25-55)
- appealEdgeWinRate: Appeal Edge's rate, always 15-25 points above industry average, never above 97
- Both must be integers`;

module.exports = { CASE_TYPES, COMPETITOR_PRICING, SYSTEM_PROMPT };
