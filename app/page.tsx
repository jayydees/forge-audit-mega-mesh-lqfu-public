'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import Header from './sections/Header'
import InputPanel from './sections/InputPanel'
import ResultsDashboard from './sections/ResultsDashboard'
import DetailPanel from './sections/DetailPanel'
import { DEMO_DEFECT_RESULT, DEMO_DISCOVERY_RESULT, DEMO_AE_VISIBILITY_RESULT, DEMO_COMPETITOR_GAP_RESULT, DEMO_REWRITE_RESULT, DEMO_QA_AUDITOR_RESULT } from './sections/demoCache'

const AGENT_ID = '69ec55b100909ed28e9a6f6b'
const DISCOVERY_AGENT_ID = '69ec5eecc2c6ef271d513837'
const AE_VISIBILITY_AGENT_ID = '69ec61d402d94d1a4c21c2b8'
const COMPETITOR_GAP_AGENT_ID = '69ec677a25fab808843feca5'
const REWRITE_AGENT_ID = '69ec6dd03f7664b6c5b537f2'
const QA_AUDITOR_AGENT_ID = '69ec75352aed0bb18664bccb'

const DEMO_PRODUCT = {
  title: "Dyazo Overhead Long Arm LED Desk Lamp | 360\u00b0Adjustable Swing Arm Clamp | 3 Color Modes & 10 Brightness Levels | Eye Caring 12W Table Light for Home, Office, Reading, Study with Memory Function (Black)",
  url: "https://www.amazon.in/dp/B0GM8111XD",
  asin: "B0GM8111XD",
  price: { value: 1099, currency: "\u20b9" },
  listPrice: { value: 2499, currency: "\u20b9" },
  brand: "Dyazo",
  stars: 4.6,
  reviewsCount: 42,
  breadCrumbs: "Home & Kitchen > Indoor Lighting > Desk Lights",
  thumbnailImage: "https://m.media-amazon.com/images/I/41f+oA2HgKL._SY300_SX300_QL70_FMwebp_.jpg",
  highResolutionImages: [
    "https://m.media-amazon.com/images/I/61Dq-MPpDkL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71ium9KPYHL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71DSndDwTvL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71mgrFSoH3L._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61gsLa8lhiL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71LJ59OJTqL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71X4ObodfHL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/714KZNHgLJL._SL1500_.jpg"
  ],
  description: null,
  features: [
    "3 Color Modes with 10-Level Dimming for Every Task : Experience customizable lighting with three adjustable color modes\u2014white, daylight and warm paired with 10 brightness levels.",
    "360\u00b0 Adjustable Swing Arm with Space-Saving Clamp Design : The lamp features a fully 360\u00b0 rotatable light head, 180\u00b0 adjustable metal swing arm and 360\u00b0 rotating base.",
    "Eye-Caring Illumination with No Flicker or Glare : Designed for long, comfortable use, this lamp delivers stable, uniform light with zero flicker, zero buzzing and no shadowing.",
    "Durable Metal Build with Better Heat Dissipation & Energy Saving : Crafted with high-grade metal, the lamp ensures excellent heat dissipation and long lasting performance.",
    "USB Powered with Memory Function for Convenience : The lamp supports multiple power options through USB\u2014laptops, power banks or adapters and ensures stable performance."
  ],
  attributes: [
    { key: "Light Source Type", value: "LED" },
    { key: "Power Source", value: "USB Powered" },
    { key: "Voltage", value: "5 Volts" },
    { key: "Brand", value: "Dyazo" },
    { key: "Manufacturer", value: "Dyazo, Dyazo, Alliance Trade Links, F-15 Ground Floor Industrial Area Okhla Phase 1, New Delhi - 110020, Customer Care 7270000727, E-mail-support@dyazo.in" },
    { key: "Colour", value: "Black" },
    { key: "Style", value: "Overhead Desk Lamp" },
    { key: "Item Weight", value: "700 Grams" },
    { key: "Country of Origin", value: "China" }
  ],
  aPlusContent: { title: "Product Description", rawText: "Product Description\nThe video showcases the product in use.\nLED Desk Lamp- Black\nMerchant Video" },
  variantDetails: [
    { name: "White", asin: "B0GM81G77X", price: null },
    { name: "Black", asin: "B0GM8111XD", price: null }
  ],
  bestsellerRanks: [
    { rank: 5732, category: "Home & Kitchen" },
    { rank: 23, category: "Desk Lights" }
  ],
  monthlyPurchaseVolume: "200+ bought in past month",
  isAmazonChoice: false
}

function extractAsin(input: string): string | null {
  const trimmed = input.trim()
  // Match bare ASIN (exactly 10 alphanumeric chars starting with B0)
  if (/^B0[A-Z0-9]{8}$/i.test(trimmed)) return trimmed.toUpperCase()
  // Try structured URL patterns first: /dp/ASIN, /gp/product/ASIN, /product/ASIN
  const structuredMatch = trimmed.match(/(?:\/dp\/|\/gp\/product\/|\/product\/)(B0[A-Z0-9]{8})/i)
  if (structuredMatch) return structuredMatch[1].toUpperCase()
  // Fallback: find any B0-prefixed 10-char alphanumeric token in the string
  const fallbackMatch = trimmed.match(/\b(B0[A-Z0-9]{8})\b/i)
  return fallbackMatch ? fallbackMatch[1].toUpperCase() : null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC', color: '#1E293B' }}>
          <div className="text-center p-8 max-w-md">
            <h2 className="mb-2" style={{ fontSize: '20px', fontWeight: 700 }}>Something went wrong</h2>
            <p className="mb-4" style={{ fontSize: '13px', color: '#64748B' }}>{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="text-white" style={{ background: '#2563EB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600 }}>Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function escapeCsvCell(value: string): string {
  const str = String(value ?? '')
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export default function Page() {
  const [urls, setUrls] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusMessages, setStatusMessages] = useState<string[]>([])
  const [error, setError] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [productDataMap, setProductDataMap] = useState<Record<string, any>>({})
  const [selectedAsin, setSelectedAsin] = useState<string | null>(null)
  const [discoveryResults, setDiscoveryResults] = useState<Record<string, any>>({})
  const [discoveryLoading, setDiscoveryLoading] = useState<Record<string, boolean>>({})
  const [aeVisibilityData, setAeVisibilityData] = useState<Record<string, any>>({})
  const [aeVisibilityLoading, setAeVisibilityLoading] = useState<Record<string, boolean>>({})
  const [competitorGapData, setCompetitorGapData] = useState<Record<string, any>>({})
  const [competitorGapLoading, setCompetitorGapLoading] = useState<Record<string, boolean>>({})
  const [rewriteData, setRewriteData] = useState<Record<string, any>>({})
  const [rewriteLoading, setRewriteLoading] = useState<Record<string, boolean>>({})
  const [competitorMarks, setCompetitorMarks] = useState<Record<string, boolean>>({})
  const [primaryAsin, setPrimaryAsin] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [inputCollapsed, setInputCollapsed] = useState(false)
  const [qaAuditorData, setQaAuditorData] = useState<Record<string, any>>({})
  const [qaAuditorLoading, setQaAuditorLoading] = useState<Record<string, boolean>>({})

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('dqs-theme')
    const initial = stored === 'dark' ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')

    try {
      const session = localStorage.getItem('dqs-session')
      if (session) {
        const s = JSON.parse(session)
        if (s.urls) setUrls(s.urls)
        if (Array.isArray(s.results) && s.results.length > 0) setResults(s.results)
        if (s.productDataMap && Object.keys(s.productDataMap).length > 0) setProductDataMap(s.productDataMap)
        if (s.selectedAsin) setSelectedAsin(s.selectedAsin)
        if (s.discoveryResults) setDiscoveryResults(s.discoveryResults)
        if (s.aeVisibilityData) setAeVisibilityData(s.aeVisibilityData)
        if (s.competitorGapData) setCompetitorGapData(s.competitorGapData)
        if (s.rewriteData) setRewriteData(s.rewriteData)
        if (s.qaAuditorData) setQaAuditorData(s.qaAuditorData)
        if (Array.isArray(s.statusMessages) && s.statusMessages.length > 0) setStatusMessages(s.statusMessages)
        if (s.competitorMarks) setCompetitorMarks(s.competitorMarks)
        if (s.primaryAsin) setPrimaryAsin(s.primaryAsin)
      }
    } catch {}
  }, [])

  // Save session to localStorage whenever key state changes
  useEffect(() => {
    try {
      const session = {
        urls,
        results,
        productDataMap,
        selectedAsin,
        discoveryResults,
        aeVisibilityData,
        competitorGapData,
        rewriteData,
        qaAuditorData,
        statusMessages,
        competitorMarks,
        primaryAsin,
      }
      localStorage.setItem('dqs-session', JSON.stringify(session))
    } catch {}
  }, [urls, results, productDataMap, selectedAsin, discoveryResults, aeVisibilityData, competitorGapData, rewriteData, qaAuditorData, statusMessages, competitorMarks, primaryAsin])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('dqs-theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }, [])

  const addStatus = useCallback((msg: string) => {
    setStatusMessages(prev => [...prev, msg])
  }, [])

  const clearSession = useCallback(() => {
    setUrls('')
    setResults([])
    setProductDataMap({})
    setSelectedAsin(null)
    setDiscoveryResults({})
    setDiscoveryLoading({})
    setAeVisibilityData({})
    setAeVisibilityLoading({})
    setCompetitorGapData({})
    setCompetitorGapLoading({})
    setRewriteData({})
    setRewriteLoading({})
    setCompetitorMarks({})
    setPrimaryAsin(null)
    setStatusMessages([])
    setError('')
    setQaAuditorData({})
    setQaAuditorLoading({})
    setLoading(false)
    localStorage.removeItem('dqs-session')
  }, [])

  const scrapeWithApify = async (productUrls: string[]): Promise<any[]> => {
    addStatus(`Calling Apify to scrape ${productUrls.length} product(s)...`)

    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productUrls })
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      throw new Error(json.error ?? `Apify API error (${res.status})`)
    }

    addStatus(`Scraped ${json.data.length} product(s) successfully`)
    return json.data
  }

  const analyzeProduct = async (product: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Analyzing ${asin} with Defect Hunter...`)

    const message = `Analyze this Amazon product listing for compliance defects:\n\n${JSON.stringify(product, null, 2)}`
    const result = await callAIAgent(message, AGENT_ID)

    if (!result?.success) {
      addStatus(`Failed to analyze ${asin}: ${result?.error ?? 'Unknown error'}`)
      return null
    }

    const parsed = result?.response?.result ?? result?.response ?? null
    addStatus(`Analysis complete for ${asin} - Score: ${parsed?.overall_score ?? '?'}`)
    return { ...parsed, thumbnail: product?.thumbnailImage }
  }

  const analyzeDiscovery = async (product: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Running Discovery simulation for ${asin}...`)
    setDiscoveryLoading(prev => ({ ...prev, [asin]: true }))

    const message = `Analyze this Amazon product listing for AI shopping assistant discoverability. Simulate 10 realistic shopper intent queries and determine match results:\n\n${JSON.stringify(product, null, 2)}`
    const result = await callAIAgent(message, DISCOVERY_AGENT_ID)

    setDiscoveryLoading(prev => ({ ...prev, [asin]: false }))

    if (!result?.success) {
      addStatus(`Discovery simulation failed for ${asin}: ${result?.error ?? 'Unknown error'}`)
      return null
    }

    const parsed = result?.response?.result ?? result?.response ?? null
    addStatus(`Discovery complete for ${asin} - Match Rate: ${parsed?.discovery_match_rate ?? '?'}%`)
    return parsed
  }

  const analyzeAEVisibility = async (product: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Generating AE queries for ${asin}...`)
    setAeVisibilityLoading(prev => ({ ...prev, [asin]: true }))

    try {
      const message = `Generate 10 realistic shopper queries for this product listing that a consumer might type into Google Gemini AI search:\n\n${JSON.stringify(product, null, 2)}`
      const agentResult = await callAIAgent(message, AE_VISIBILITY_AGENT_ID)

      if (!agentResult?.success) {
        setAeVisibilityLoading(prev => ({ ...prev, [asin]: false }))
        addStatus(`AE query generation failed for ${asin}`)
        return null
      }

      const agentData = agentResult?.response?.result ?? agentResult?.response ?? null
      const queries = Array.isArray(agentData?.queries) ? agentData.queries : []

      if (queries.length === 0) {
        setAeVisibilityLoading(prev => ({ ...prev, [asin]: false }))
        addStatus(`No queries generated for ${asin}`)
        return null
      }

      addStatus(`Generated ${queries.length} queries. Calling Gemini API...`)

      const geminiRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: queries.map((q: any) => ({ query: q?.query ?? '', query_type: q?.query_type ?? '' })),
          productBrand: agentData?.brand ?? product?.brand ?? '',
          productTitle: agentData?.product_title ?? product?.title ?? '',
          keyAttributes: Array.isArray(agentData?.key_attributes) ? agentData.key_attributes : []
        })
      })

      const geminiData = await geminiRes.json()
      setAeVisibilityLoading(prev => ({ ...prev, [asin]: false }))

      if (!geminiData?.success) {
        addStatus(`Gemini analysis failed for ${asin}: ${geminiData?.error ?? 'Unknown'}`)
        return null
      }

      addStatus(`AE Visibility complete for ${asin} — Appeared in ${geminiData?.summary?.appeared_count ?? 0}/${geminiData?.summary?.total_queries ?? 10} searches`)
      return geminiData
    } catch (err: any) {
      setAeVisibilityLoading(prev => ({ ...prev, [asin]: false }))
      addStatus(`AE Visibility error for ${asin}: ${err?.message ?? 'Unknown'}`)
      return null
    }
  }

  const analyzeCompetitorGap = async (product: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Running Competitor Gap analysis for ${asin}...`)
    setCompetitorGapLoading(prev => ({ ...prev, [asin]: true }))

    try {
      const message = `Analyze this Amazon India product listing and find competing products in the same category. Compare their attributes, bullet topics, and title keywords against this listing to identify gaps:\n\n${JSON.stringify(product, null, 2)}`
      const result = await callAIAgent(message, COMPETITOR_GAP_AGENT_ID)

      setCompetitorGapLoading(prev => ({ ...prev, [asin]: false }))

      if (!result?.success) {
        addStatus(`Competitor Gap analysis failed for ${asin}: ${result?.error ?? 'Unknown error'}`)
        return null
      }

      const parsed = result?.response?.result ?? result?.response ?? null
      addStatus(`Competitor Gap complete for ${asin} -- ${parsed?.total_gaps ?? 0} gaps found`)
      return parsed
    } catch (err: any) {
      setCompetitorGapLoading(prev => ({ ...prev, [asin]: false }))
      addStatus(`Competitor Gap error for ${asin}: ${err?.message ?? 'Unknown'}`)
      return null
    }
  }

  const analyzeRewrite = async (product: any, defectResult: any, discoveryResult: any, competitorGapResult: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Generating AI-optimized rewrite for ${asin}...`)
    setRewriteLoading(prev => ({ ...prev, [asin]: true }))

    try {
      const message = `Analyze this Amazon product listing and generate optimized rewrites based on the audit findings.

PRODUCT DATA:
${JSON.stringify(product, null, 2)}

DEFECT HUNTER FINDINGS:
${JSON.stringify(defectResult, null, 2)}

DISCOVERY AGENT FINDINGS:
${JSON.stringify(discoveryResult, null, 2)}

COMPETITOR GAP FINDINGS:
${JSON.stringify(competitorGapResult, null, 2)}

Generate optimized rewrites for the title, bullet points, and description.`
      const result = await callAIAgent(message, REWRITE_AGENT_ID)

      setRewriteLoading(prev => ({ ...prev, [asin]: false }))

      if (!result?.success) {
        addStatus(`Rewrite generation failed for ${asin}: ${result?.error ?? 'Unknown error'}`)
        return null
      }

      const parsed = result?.response?.result ?? result?.response ?? null
      addStatus(`Rewrite complete for ${asin} — Confidence: ${parsed?.confidence_score ?? '?'}%`)
      return parsed
    } catch (err: any) {
      setRewriteLoading(prev => ({ ...prev, [asin]: false }))
      addStatus(`Rewrite error for ${asin}: ${err?.message ?? 'Unknown'}`)
      return null
    }
  }

  const analyzeQAAuditor = async (product: any, defectResult: any, discoveryResult: any, aeResult: any, competitorResult: any, rewriteResult: any): Promise<any> => {
    const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
    addStatus(`Running QA Auditor for ${asin}...`)
    setQaAuditorLoading(prev => ({ ...prev, [asin]: true }))

    try {
      const message = `You are the QA Auditor. Review ALL agent outputs below and:
1. Flag conflicts between agent recommendations
2. Assign confidence scores (0-100) to each recommendation
3. Route items with confidence < 70 to human review
4. Compute AI Readiness Score using the formula
5. Generate timestamped audit log

PRODUCT DATA:
${JSON.stringify(product, null, 2)}

DEFECT HUNTER OUTPUT:
${JSON.stringify(defectResult, null, 2)}

DISCOVERY AGENT OUTPUT:
${JSON.stringify(discoveryResult, null, 2)}

AE VISIBILITY AGENT OUTPUT:
${JSON.stringify(aeResult, null, 2)}

COMPETITOR GAP AGENT OUTPUT:
${JSON.stringify(competitorResult, null, 2)}

REWRITE AGENT OUTPUT:
${JSON.stringify(rewriteResult, null, 2)}`

      const result = await callAIAgent(message, QA_AUDITOR_AGENT_ID)
      setQaAuditorLoading(prev => ({ ...prev, [asin]: false }))

      if (!result?.success) {
        addStatus(`QA Auditor failed for ${asin}: ${result?.error ?? 'Unknown error'}`)
        return null
      }

      const parsed = result?.response?.result ?? result?.response ?? null
      addStatus(`QA Auditor complete for ${asin} -- AI Readiness Score: ${parsed?.ai_readiness_score ?? '?'}`)
      return parsed
    } catch (err: any) {
      setQaAuditorLoading(prev => ({ ...prev, [asin]: false }))
      addStatus(`QA Auditor error for ${asin}: ${err?.message ?? 'Unknown'}`)
      return null
    }
  }

  const toggleCompetitorMark = (asin: string) => {
    setCompetitorMarks(prev => ({ ...prev, [asin]: !prev[asin] }))
  }

  const setPrimaryProduct = (asin: string | null) => {
    setPrimaryAsin(asin)
    if (asin) {
      setCompetitorMarks(prev => {
        const next = { ...prev }
        delete next[asin]
        return next
      })
    }
  }

  const handleSubmit = async () => {
    setError('')
    setStatusMessages([])
    setResults([])
    setProductDataMap({})
    setSelectedAsin(null)
    setDiscoveryResults({})
    setDiscoveryLoading({})
    setAeVisibilityData({})
    setAeVisibilityLoading({})
    setCompetitorGapData({})
    setCompetitorGapLoading({})
    setRewriteData({})
    setRewriteLoading({})
    setCompetitorMarks({})
    setPrimaryAsin(null)
    setQaAuditorData({})
    setQaAuditorLoading({})

    setLoading(true)

    try {
      const inputLines = urls.split('\n').filter(l => l.trim()).slice(0, 5)
      const extractedAsins = inputLines.map(l => extractAsin(l)).filter(Boolean) as string[]

      if (extractedAsins.length === 0) {
        setError('No valid Amazon ASINs found. Paste Amazon URLs or ASINs (e.g. B0CKW4VGLK).')
        setLoading(false)
        return
      }

      const normalizedUrls = extractedAsins.map(asin => `https://www.amazon.in/dp/${asin}`)
      addStatus(`Starting audit for ${normalizedUrls.length} product(s)`)
      const scraped = await scrapeWithApify(normalizedUrls)

      const pdMap: Record<string, any> = {}
      for (const p of scraped) {
        const a = p?.asin ?? extractAsin(p?.url ?? '')
        if (a) pdMap[a] = p
      }
      setProductDataMap(pdMap)

      const auditResults: any[] = []
      for (const product of scraped) {
        const r = await analyzeProduct(product)
        if (r) {
          auditResults.push(r)
          setResults([...auditResults])
        }
        const asin = product?.asin ?? extractAsin(product?.url ?? '') ?? 'unknown'
        const dr = await analyzeDiscovery(product)
        if (dr) {
          setDiscoveryResults(prev => ({ ...prev, [asin]: dr }))
        }
        const ae = await analyzeAEVisibility(product)
        if (ae) {
          setAeVisibilityData(prev => ({ ...prev, [asin]: ae }))
        }
        const cg = await analyzeCompetitorGap(product)
        if (cg) {
          setCompetitorGapData(prev => ({ ...prev, [asin]: cg }))
        }
        const rw = await analyzeRewrite(product, r, dr, cg)
        if (rw) {
          setRewriteData(prev => ({ ...prev, [asin]: rw }))
        }
        const qa = await analyzeQAAuditor(product, r, dr, ae, cg, rw)
        if (qa) {
          setQaAuditorData(prev => ({ ...prev, [asin]: qa }))
        }
      }

      if (auditResults.length === 0) {
        setError('No products could be analyzed. Check the status log for details.')
      } else {
        addStatus(`Audit complete: ${auditResults.length} SKU(s) analyzed`)
        setInputCollapsed(true)
      }
    } catch (err: any) {
      setError(err?.message ?? 'An unexpected error occurred')
      addStatus(`Error: ${err?.message ?? 'Unknown'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    setError('')
    setStatusMessages([])
    setResults([])
    setSelectedAsin(null)
    setDiscoveryResults({})
    setDiscoveryLoading({})
    setAeVisibilityData({})
    setAeVisibilityLoading({})
    setCompetitorGapData({})
    setCompetitorGapLoading({})
    setRewriteData({})
    setRewriteLoading({})
    setCompetitorMarks({})
    setPrimaryAsin(null)
    setQaAuditorData({})
    setQaAuditorLoading({})


    // Load pre-cached demo data instantly — no API calls
    const asin = DEMO_PRODUCT.asin
    setProductDataMap({ [asin]: DEMO_PRODUCT })
    setResults([DEMO_DEFECT_RESULT])
    setDiscoveryResults({ [asin]: DEMO_DISCOVERY_RESULT })
    setAeVisibilityData({ [asin]: DEMO_AE_VISIBILITY_RESULT })
    setCompetitorGapData({ [asin]: DEMO_COMPETITOR_GAP_RESULT })
    setRewriteData({ [asin]: DEMO_REWRITE_RESULT })
    setQaAuditorData({ [asin]: DEMO_QA_AUDITOR_RESULT })
    setStatusMessages([
      'Loaded demo product data (B0GM8111XD)',
      'Defect Hunter: 7 defects found (score 62)',
      'Discovery: 50% match rate across 10 queries',
      'AE Visibility: 3/10 Gemini appearances',
      'Competitor Gap: 8 gaps from 4 competitors',
      'Rewrite: optimized content generated (82% confidence)',
      'QA Auditor: AI Readiness Score 58/100',
      'Demo loaded instantly from cached data'
    ])
    setInputCollapsed(true)
  }

  const handleCsvUpload = (asins: string[]) => {
    const newUrls = asins.slice(0, 5).map(asin => `https://www.amazon.in/dp/${asin}`).join('\n')
    setUrls(newUrls)
    addStatus(`Loaded ${Math.min(asins.length, 5)} ASIN(s) from CSV${asins.length > 5 ? ` (${asins.length - 5} trimmed, max 5)` : ''}`)
  }

  const handleExportCsv = () => {
    if (results.length === 0) return

    const headers = [
      'ASIN',
      'Title',
      'AI Readiness Score',
      'AE Visibility Score (X/10)',
      'Attribute Overlap %',
      'Defect Count',
      'Critical',
      'Warning',
      'Discovery Match Rate',
      'Defects (severity | description)',
      'Recommendations',
      'Competitors Mentioned by Gemini',
      'Competitor Total Gaps',
      'Competitor Critical Gaps',
      'Identified Category'
    ]

    const rows = results.map(r => {
      const asin = r?.asin ?? ''
      const ae = aeVisibilityData[asin]
      const disc = discoveryResults[asin]
      const cg = competitorGapData[asin]
      const defects = Array.isArray(r?.defects) ? r.defects : []

      const aeScore = ae?.summary?.appeared_count != null
        ? `${ae.summary.appeared_count}/${ae.summary.total_queries ?? 10}`
        : ''
      const attrOverlap = ae?.summary?.avg_attribute_overlap != null
        ? `${ae.summary.avg_attribute_overlap}%`
        : ''
      const discoveryRate = disc?.discovery_match_rate != null
        ? `${disc.discovery_match_rate}%`
        : ''
      const defectsList = defects
        .map((d: any) => `[${d?.severity ?? 'unknown'}] ${d?.description ?? ''}`)
        .join(' | ')
      const recommendations = defects
        .filter((d: any) => d?.recommendation)
        .map((d: any) => d.recommendation)
        .join(' | ')
      const competitors = Array.isArray(ae?.summary?.top_competitors)
        ? ae.summary.top_competitors.map((c: any) => c?.brand ?? '').filter(Boolean).join(', ')
        : ''

      return [
        asin,
        r?.product_title ?? '',
        r?.overall_score ?? '',
        aeScore,
        attrOverlap,
        r?.total_defects ?? '',
        r?.critical_defects ?? '',
        r?.major_defects ?? '',
        discoveryRate,
        defectsList,
        recommendations,
        competitors,
        cg?.total_gaps ?? '',
        cg?.critical_gaps ?? '',
        cg?.identified_category ?? ''
      ]
    })

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => escapeCsvCell(String(cell))).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dqs-audit-${new Date().toISOString().slice(0, 10)}.csv`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    // Delay cleanup so the browser can start the download before revoking
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 150)
  }

  const selectedResult = results.find(r => r?.asin === selectedAsin)
  const selectedProduct = selectedAsin ? (productDataMap[selectedAsin] ?? {}) : {}

  return (
    <ErrorBoundary>
        <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC', color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <Header totalAudited={results.length} theme={theme} onToggleTheme={toggleTheme} onClearSession={clearSession} />
          <InputPanel
            urls={urls}
            onUrlsChange={setUrls}
            onSubmit={handleSubmit}
            onDemo={handleDemo}
            loading={loading}
            statusMessages={statusMessages}
            error={error}
            onCsvUpload={handleCsvUpload}
            collapsed={inputCollapsed}
            onToggleCollapse={() => setInputCollapsed(prev => !prev)}
            totalAudited={results.length}
            onClearSession={clearSession}
          />
          <ResultsDashboard
            results={results}
            productDataMap={productDataMap}
            selectedAsin={selectedAsin}
            onSelectAsin={setSelectedAsin}
            onExportCsv={handleExportCsv}
            competitorMarks={competitorMarks}
            primaryAsin={primaryAsin}
            onToggleCompetitor={toggleCompetitorMark}
            onSetPrimary={setPrimaryProduct}
            discoveryResults={discoveryResults}
            aeVisibilityData={aeVisibilityData}
            competitorGapData={competitorGapData}
          />
          {selectedResult && selectedAsin && (
            <DetailPanel
              result={selectedResult}
              productData={selectedProduct}
              onClose={() => setSelectedAsin(null)}
              discoveryData={selectedAsin ? discoveryResults[selectedAsin] : undefined}
              discoveryLoading={selectedAsin ? (discoveryLoading[selectedAsin] ?? false) : false}
              aeVisibilityData={selectedAsin ? aeVisibilityData[selectedAsin] : undefined}
              aeVisibilityLoading={selectedAsin ? (aeVisibilityLoading[selectedAsin] ?? false) : false}
              competitorGapData={selectedAsin ? competitorGapData[selectedAsin] : undefined}
              competitorGapLoading={selectedAsin ? (competitorGapLoading[selectedAsin] ?? false) : false}
              rewriteData={selectedAsin ? rewriteData[selectedAsin] : undefined}
              rewriteLoading={selectedAsin ? (rewriteLoading[selectedAsin] ?? false) : false}
              qaAuditorData={selectedAsin ? qaAuditorData[selectedAsin] : undefined}
              qaAuditorLoading={selectedAsin ? (qaAuditorLoading[selectedAsin] ?? false) : false}
            />
          )}

          {/* Agent Info Footer */}
          <div className="flex items-center justify-between flex-wrap" style={{ borderTop: '1px solid #E2E8F0', background: 'white', padding: '8px 24px', fontSize: '10px', color: '#94A3B8' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <span>Agents: <span style={{ color: '#64748B' }}>Defect Hunter</span></span>
              <span style={{ color: '#E2E8F0' }}>|</span>
              <span style={{ color: '#64748B' }}>Discovery</span>
              <span style={{ color: '#E2E8F0' }}>|</span>
              <span style={{ color: '#64748B' }}>AE Visibility</span>
              <span style={{ color: '#E2E8F0' }}>|</span>
              <span style={{ color: '#64748B' }}>Competitor Gap</span>
              <span style={{ color: '#E2E8F0' }}>|</span>
              <span style={{ color: '#64748B' }}>Rewrite</span>
              <span style={{ color: '#E2E8F0' }}>|</span>
              <span style={{ color: '#64748B' }}>QA Auditor</span>
              {loading && <span className="flex items-center gap-1" style={{ color: '#2563EB' }}><span className="rounded-full animate-pulse" style={{ width: '6px', height: '6px', background: '#2563EB' }} /> Active</span>}
            </div>
            <span style={{ color: '#94A3B8' }}>Data Quality Sentinel v5.0</span>
          </div>
        </div>
    </ErrorBoundary>
  )
}
