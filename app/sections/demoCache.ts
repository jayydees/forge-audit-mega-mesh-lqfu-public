// Pre-cached demo results for ASIN B0GM8111XD (Dyazo LED Desk Lamp)
// These are representative outputs from each agent, used for instant demo loading.

export const DEMO_ASIN = 'B0GM8111XD'

export const DEMO_DEFECT_RESULT = {
  asin: 'B0GM8111XD',
  product_title: 'Dyazo Overhead Long Arm LED Desk Lamp | 360\u00b0Adjustable Swing Arm Clamp | 3 Color Modes & 10 Brightness Levels | Eye Caring 12W Table Light for Home, Office, Reading, Study with Memory Function (Black)',
  overall_score: 62,
  total_defects: 7,
  critical_defects: 2,
  major_defects: 3,
  minor_defects: 2,
  summary: 'Listing has compliance gaps in title length, missing key attributes, and weak A+ content. Title exceeds recommended length and uses pipe separators instead of hyphens. Several important attributes are missing from the structured data.',
  thumbnail: 'https://m.media-amazon.com/images/I/41f+oA2HgKL._SY300_SX300_QL70_FMwebp_.jpg',
  title_analysis: {
    char_count: 198,
    max_allowed: 200,
    is_compliant: true,
    title_case_violations: [],
    keyword_stuffing_detected: false,
    issues: ['Title uses pipe separators instead of recommended hyphens', 'Title is near max character limit (198/200)']
  },
  image_analysis: {
    total_images: 8,
    min_recommended: 6,
    has_sufficient_images: true,
    main_image_issues: [],
    general_image_issues: ['No lifestyle images showing product in use context', 'No infographic images highlighting key features']
  },
  attribute_analysis: {
    total_attributes: 9,
    pollution_detected: true,
    polluted_fields: ['Manufacturer field contains contact info and address data'],
    missing_critical: ['Wattage', 'Lamp Type', 'Bulb Shape Size', 'Material', 'Mounting Type'],
    title_conflicts: []
  },
  content_analysis: {
    bullet_count: 5,
    has_aplus_content: true,
    vague_claims: ['better heat dissipation', 'long lasting performance', 'stable performance'],
    keyword_stuffing_bullets: false
  },
  defects: [
    { severity: 'critical', category: 'Attribute Pollution', description: 'Manufacturer field contains customer care number, email, and physical address — violates attribute data quality standards', field: 'Manufacturer', recommendation: 'Keep manufacturer field to brand name only: "Dyazo"', suppression_risk: 'high', suppression_reason: 'Attribute pollution can trigger automated listing suppression' },
    { severity: 'critical', category: 'Missing Attributes', description: '5 critical category-specific attributes missing: Wattage, Lamp Type, Bulb Shape Size, Material, Mounting Type', field: 'Attributes', recommendation: 'Add all missing attributes with accurate values to improve discoverability and reduce suppression risk', suppression_risk: 'medium', suppression_reason: 'Missing required attributes can reduce search visibility' },
    { severity: 'major', category: 'A+ Content', description: 'A+ content is minimal — contains only a merchant video reference with no rich text, comparison charts, or feature modules', field: 'A+ Content', recommendation: 'Create comprehensive A+ content with feature highlights, comparison charts, and lifestyle imagery', suppression_risk: 'none', suppression_reason: '' },
    { severity: 'major', category: 'Vague Claims', description: '3 bullet points contain vague, unsubstantiated claims without specific data or certifications', field: 'Bullets', recommendation: 'Replace vague claims with specific metrics: e.g., "CRI>90 LED" instead of "eye-caring"', suppression_risk: 'low', suppression_reason: '' },
    { severity: 'major', category: 'Image Quality', description: 'No lifestyle or infographic images — all images are studio product shots', field: 'Images', recommendation: 'Add 2-3 lifestyle images showing the lamp on a desk/workspace and 1-2 infographic images with dimensions and feature callouts', suppression_risk: 'none', suppression_reason: '' },
    { severity: 'minor', category: 'Title Format', description: 'Title uses pipe (|) separators — Amazon style guide recommends hyphens (-) or commas', field: 'Title', recommendation: 'Replace pipe separators with hyphens for consistency with platform standards', suppression_risk: 'none', suppression_reason: '' },
    { severity: 'minor', category: 'Description', description: 'Product description field is null — no long-form description provided', field: 'Description', recommendation: 'Add a detailed product description (recommended 1000-2000 characters) covering use cases, specifications, and differentiators', suppression_risk: 'none', suppression_reason: '' }
  ]
}

export const DEMO_DISCOVERY_RESULT = {
  asin: 'B0GM8111XD',
  product_title: 'Dyazo Overhead Long Arm LED Desk Lamp',
  discovery_match_rate: 50,
  total_queries: 10,
  matched_queries: 5,
  queries: [
    { query: 'best LED desk lamp for studying', match_type: 'partial', confidence: 65, reasoning: 'Title mentions study use but lacks specific study-oriented keywords like "anti-glare" or "flicker-free LED"' },
    { query: 'adjustable swing arm clamp lamp for office desk', match_type: 'full', confidence: 90, reasoning: 'Title directly contains swing arm, clamp, and office keywords' },
    { query: 'eye caring reading lamp with brightness control', match_type: 'partial', confidence: 60, reasoning: 'Mentions eye caring and brightness levels but missing specific CRI or lux data' },
    { query: 'USB powered desk light with memory function', match_type: 'full', confidence: 95, reasoning: 'Perfect match — USB powered and memory function are both in the title' },
    { query: 'overhead desk lamp with clamp under 1500', match_type: 'full', confidence: 85, reasoning: 'Product matches all criteria including price point' },
    { query: 'LED lamp for computer work from home setup', match_type: 'miss', confidence: 30, reasoning: 'Missing work-from-home and computer-specific keywords in listing' },
    { query: 'dimmable desk lamp 3 color temperature modes', match_type: 'full', confidence: 88, reasoning: 'Title includes 3 color modes and brightness levels' },
    { query: 'architect desk lamp long arm for drawing', match_type: 'partial', confidence: 45, reasoning: 'Has long arm feature but missing architect/drawing/drafting context' },
    { query: 'warm light bedside reading lamp', match_type: 'miss', confidence: 20, reasoning: 'Product is a desk clamp lamp, not positioned for bedside use' },
    { query: 'best energy efficient LED table light India', match_type: 'full', confidence: 75, reasoning: 'Matches on LED, table light, and energy saving claims' }
  ],
  gap_keywords: ['work from home', 'computer monitor light', 'architect lamp', 'bedside', 'anti-glare', 'CRI rating', 'lux output'],
  strength_keywords: ['swing arm clamp', 'USB powered', 'memory function', '3 color modes', '10 brightness levels']
}

export const DEMO_AE_VISIBILITY_RESULT = {
  success: true,
  summary: {
    appeared_count: 3,
    total_queries: 10,
    avg_attribute_overlap: 42,
    ae_visibility_score: 42,
    top_competitors: [
      { brand: 'Wipro', mentions: 4 },
      { brand: 'Philips', mentions: 3 },
      { brand: 'Syska', mentions: 2 }
    ]
  },
  results: [
    { query: 'best LED desk lamp for studying in India', query_type: 'purchase_intent', appeared: false, visibility_result: 'category_mention', attribute_overlap: 35, competitors_mentioned: ['Wipro', 'Philips', 'Syska'], gemini_response_snippet: 'Gemini mentioned desk lamps in the category but did not reference Dyazo brand directly.' },
    { query: 'adjustable swing arm LED desk lamp with clamp', query_type: 'specific_feature', appeared: true, visibility_result: 'direct_mention', attribute_overlap: 78, competitors_mentioned: ['Wipro'], gemini_response_snippet: 'Dyazo Overhead Long Arm LED Desk Lamp was directly recommended by Gemini as a top option.' },
    { query: 'eye caring desk lamp for long hours', query_type: 'benefit_seeking', appeared: false, visibility_result: 'category_mention', attribute_overlap: 30, competitors_mentioned: ['Philips', 'BenQ'], gemini_response_snippet: 'Gemini mentioned eye-caring lamps but recommended Philips and BenQ instead of Dyazo.' },
    { query: 'USB powered desk lamp under 1500 rupees', query_type: 'budget_constrained', appeared: true, visibility_result: 'direct_mention', attribute_overlap: 65, competitors_mentioned: ['Syska'], gemini_response_snippet: 'Dyazo was listed as a budget-friendly USB desk lamp option in the under 1500 range.' },
    { query: 'desk lamp with color temperature adjustment', query_type: 'specific_feature', appeared: false, visibility_result: 'category_mention', attribute_overlap: 50, competitors_mentioned: ['Wipro', 'Philips'], gemini_response_snippet: 'Color temperature adjustable lamps were discussed but Dyazo was not named specifically.' },
    { query: 'best clamp desk light for home office', query_type: 'purchase_intent', appeared: true, visibility_result: 'direct_mention', attribute_overlap: 55, competitors_mentioned: [], gemini_response_snippet: 'Dyazo clamp desk lamp was mentioned as a suitable home office lighting option.' },
    { query: 'energy efficient LED table lamp for reading', query_type: 'benefit_seeking', appeared: false, visibility_result: 'not_mentioned', attribute_overlap: 38, competitors_mentioned: ['Philips', 'Wipro'], gemini_response_snippet: 'Gemini focused on Philips and Wipro for energy-efficient reading lamps. No mention of Dyazo.' },
    { query: 'dimmable LED lamp with multiple brightness settings', query_type: 'specific_feature', appeared: false, visibility_result: 'category_mention', attribute_overlap: 42, competitors_mentioned: ['Syska', 'Wipro'], gemini_response_snippet: 'Dimmable lamps were discussed with Syska and Wipro as top picks. Dyazo not mentioned.' },
    { query: 'overhead long arm desk lamp', query_type: 'specific_feature', appeared: false, visibility_result: 'not_mentioned', attribute_overlap: 25, competitors_mentioned: [], gemini_response_snippet: 'No specific brand recommendations were made for overhead long arm lamps.' },
    { query: 'desk lamp with warm and cool white modes', query_type: 'specific_feature', appeared: false, visibility_result: 'not_mentioned', attribute_overlap: 40, competitors_mentioned: ['Philips'], gemini_response_snippet: 'Philips was the only brand mentioned for warm/cool white mode lamps.' }
  ]
}

export const DEMO_COMPETITOR_GAP_RESULT = {
  asin: 'B0GM8111XD',
  identified_category: 'Desk Lights',
  total_gaps: 8,
  critical_gaps: 3,
  competitors_analyzed: 4,
  competitors: [
    { brand: 'Wipro', asin: 'B09EXAMPLE1', title: 'Wipro 10W LED Desk Lamp' },
    { brand: 'Philips', asin: 'B09EXAMPLE2', title: 'Philips EyeComfort LED Desk Light' },
    { brand: 'Syska', asin: 'B09EXAMPLE3', title: 'Syska Smart LED Desk Lamp' },
    { brand: 'MI', asin: 'B09EXAMPLE4', title: 'Mi Smart LED Desk Lamp 1S' }
  ],
  attribute_gaps: [
    { attribute: 'CRI (Color Rendering Index)', present_in_competitors: 3, severity: 'critical', recommendation: 'Add CRI rating (e.g., CRI>80) — competitors highlight this for eye comfort positioning' },
    { attribute: 'Luminous Flux (Lumens)', present_in_competitors: 4, severity: 'critical', recommendation: 'Specify lumen output — all competitors include this key spec' },
    { attribute: 'Warranty Period', present_in_competitors: 4, severity: 'critical', recommendation: 'Add warranty information — every competitor highlights 1-2 year warranty' },
    { attribute: 'Certifications (BIS/ISI)', present_in_competitors: 2, severity: 'major', recommendation: 'Add BIS certification if applicable — builds trust for Indian market' },
    { attribute: 'Arm Reach/Extension', present_in_competitors: 2, severity: 'major', recommendation: 'Specify arm extension length in cm — differentiator for overhead lamps' }
  ],
  bullet_topic_gaps: [
    { topic: 'Warranty and after-sales support', present_in_competitors: 4, severity: 'critical' },
    { topic: 'Specific lumen and CRI specifications', present_in_competitors: 3, severity: 'major' },
    { topic: 'Compatibility with smart home systems', present_in_competitors: 2, severity: 'minor' }
  ],
  title_keyword_gaps: [
    { keyword: 'warranty', present_in_competitors: 2 },
    { keyword: 'lumens', present_in_competitors: 2 },
    { keyword: 'BIS certified', present_in_competitors: 1 }
  ]
}

export const DEMO_REWRITE_RESULT = {
  asin: 'B0GM8111XD',
  confidence_score: 82,
  rewritten_title: 'Dyazo 12W LED Desk Lamp - 360\u00b0 Adjustable Long Swing Arm with Clamp - 3 Color Modes, 10 Brightness Levels - Eye Caring Flicker-Free Table Light for Home Office, Study, Reading - USB Powered with Memory Function (Black)',
  title_changes: [
    'Replaced pipe separators with hyphens per Amazon style guide',
    'Added wattage (12W) at the beginning for specification clarity',
    'Added "Flicker-Free" claim to eye caring section',
    'Reordered keywords for better discoverability priority'
  ],
  rewritten_bullets: [
    '12W Eye-Caring LED with CRI>80 & Flicker-Free Technology: Delivers stable, uniform illumination with zero flicker and zero buzzing. The high CRI>80 rating ensures accurate color rendering for reading, studying, and detailed work — comfortable even during extended use sessions.',
    '3 Color Modes (3000K-6500K) with 10-Level Brightness Dimming: Switch between warm white (3000K), natural daylight (4500K), and cool white (6500K) with 10 brightness levels per mode — 30 total lighting combinations to match any task or time of day.',
    '360\u00b0 Fully Adjustable Swing Arm with Space-Saving Desk Clamp: Features a 360\u00b0 rotatable lamp head, 180\u00b0 adjustable metal swing arm (45cm reach), and 360\u00b0 rotating base. Sturdy clamp fits desks up to 6cm thick — no drilling required.',
    'Premium Metal Construction with 50,000-Hour LED Lifespan: Built with aircraft-grade aluminum alloy for superior heat dissipation and durability. Energy-efficient 12W LED replaces 60W traditional bulbs — saves up to 80% electricity.',
    'USB Powered with Smart Memory Function: Powers via laptop, power bank, or USB adapter. Smart memory function remembers your last brightness and color setting — one-touch resume for instant convenience. Perfect for home office, dorm, and study desk setups.'
  ],
  rewritten_description: 'The Dyazo Overhead LED Desk Lamp combines professional-grade illumination with ergonomic design for the modern workspace. Featuring 12W power output with CRI>80 rating, this lamp delivers flicker-free, anti-glare light that reduces eye strain during long study or work sessions.\n\nWith 3 color temperature modes (warm 3000K, daylight 4500K, cool 6500K) and 10 brightness levels, you get 30 customizable lighting combinations. The 360-degree adjustable swing arm extends up to 45cm, providing overhead coverage for large desks while the space-saving clamp keeps your workspace clean.\n\nBuilt with premium metal construction for excellent heat dissipation and a 50,000-hour LED lifespan, this lamp is designed to last. USB-powered for versatile connectivity and equipped with a smart memory function that remembers your preferred settings.',
  key_improvements: [
    'Added specific technical specs: CRI>80, 3000K-6500K range, 50,000-hour lifespan',
    'Included dimensional data: 45cm arm reach, 6cm clamp capacity',
    'Added competitive differentiators: energy savings comparison, total lighting combinations',
    'Improved keyword coverage: flicker-free, anti-glare, work from home, dorm',
    'Eliminated vague claims — every benefit now has a quantifiable metric'
  ]
}

export const DEMO_QA_AUDITOR_RESULT = {
  asin: 'B0GM8111XD',
  product_title: 'Dyazo Overhead Long Arm LED Desk Lamp',
  ai_readiness_score: 58,
  score_breakdown: {
    defect_free_pct: 55,
    attribute_completeness_pct: 45,
    discovery_match_rate: 50,
    ae_visibility_score: 30,
    qa_confidence_avg: 75
  },
  recommendations: [
    { source_agent: 'Defect Hunter', recommendation: 'Clean manufacturer attribute — remove contact info and address to prevent suppression', field: 'Manufacturer', confidence: 95, needs_human_review: false },
    { source_agent: 'Defect Hunter', recommendation: 'Add 5 missing critical attributes: Wattage, Lamp Type, Bulb Shape Size, Material, Mounting Type', field: 'Attributes', confidence: 90, needs_human_review: false },
    { source_agent: 'Discovery', recommendation: 'Add work-from-home and computer monitor related keywords to improve discovery for remote work queries', field: 'Title/Bullets', confidence: 78, needs_human_review: false },
    { source_agent: 'Competitor Gap', recommendation: 'Add CRI rating, lumen output, and warranty information — all competitors include these specs', field: 'Attributes/Bullets', confidence: 88, needs_human_review: false },
    { source_agent: 'Rewrite', recommendation: 'Replace pipe separators with hyphens in title and add specific technical metrics to all bullet points', field: 'Title/Bullets', confidence: 82, needs_human_review: false },
    { source_agent: 'AE Visibility', recommendation: 'Product only appears in 3/10 Gemini searches — needs stronger keyword alignment with AI search patterns', field: 'Overall', confidence: 72, needs_human_review: true, review_reason: 'AE optimization strategies are emerging — human validation recommended' },
    { source_agent: 'Rewrite', recommendation: 'Add CRI>80 claim to bullets — verify actual CRI rating with manufacturer before publishing', field: 'Bullets', confidence: 65, needs_human_review: true, review_reason: 'Technical specification requires manufacturer verification' },
    { source_agent: 'Competitor Gap', recommendation: 'Consider adding smart home compatibility mention if product supports it', field: 'Bullets', confidence: 55, needs_human_review: true, review_reason: 'Feature availability needs confirmation with product team' }
  ],
  human_review_queue: [
    { source_agent: 'Rewrite', recommendation: 'CRI>80 claim in rewritten bullets needs manufacturer verification before publishing', field: 'Bullets', confidence: 65, reason: 'Unverified technical specification — could cause compliance issues if inaccurate' },
    { source_agent: 'Competitor Gap', recommendation: 'Smart home compatibility feature suggestion requires product capability confirmation', field: 'Features', confidence: 55, reason: 'Feature may not exist — adding false features violates marketplace policy' },
    { source_agent: 'AE Visibility', recommendation: 'AI search optimization keyword strategy needs human validation for brand alignment', field: 'Overall', confidence: 68, reason: 'Emerging optimization area — strategic direction should align with brand positioning' }
  ],
  conflicts: [
    { id: 'conflict-1', agents: ['Defect Hunter', 'Rewrite'], description: 'Defect Hunter flags title as near max length (198 chars), but Rewrite agent produced a longer title (205 chars). Recommendation: trim rewritten title to stay under 200 characters.', resolution_suggestion: 'Use Rewrite title but remove "(Black)" suffix since color is in attributes — brings it to 192 chars' }
  ],
  summary: 'This listing scores 58/100 on AI readiness. Critical issues: manufacturer attribute pollution (suppression risk), 5 missing category attributes, and low Gemini visibility (3/10). The rewrite agent produced strong improvements, but 3 items need human verification before publishing. Prioritize: (1) clean manufacturer field, (2) add missing attributes, (3) implement verified rewrites.',
  audit_log: [
    { timestamp: '2025-01-15T10:30:00Z', agent: 'Defect Hunter', action: 'Analyzed listing', result: '7 defects found (2 critical, 3 major, 2 minor)' },
    { timestamp: '2025-01-15T10:30:15Z', agent: 'Discovery', action: 'Simulated 10 queries', result: '50% match rate — 5 gap keywords identified' },
    { timestamp: '2025-01-15T10:30:30Z', agent: 'AE Visibility', action: 'Queried Gemini with 10 prompts', result: '3/10 appearances, 42% avg attribute overlap' },
    { timestamp: '2025-01-15T10:30:45Z', agent: 'Competitor Gap', action: 'Analyzed 4 competitors', result: '8 gaps found (3 critical)' },
    { timestamp: '2025-01-15T10:31:00Z', agent: 'Rewrite', action: 'Generated optimized content', result: '82% confidence score, 5 key improvements' },
    { timestamp: '2025-01-15T10:31:15Z', agent: 'QA Auditor', action: 'Cross-referenced all outputs', result: 'AI Readiness Score: 58, 3 items routed to human review' }
  ]
}
