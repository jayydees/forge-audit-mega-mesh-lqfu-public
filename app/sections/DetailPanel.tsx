'use client'

import { useState, useMemo } from 'react'
import { FiXCircle, FiExternalLink, FiAlertTriangle, FiCheckCircle, FiSearch, FiLoader, FiEye, FiShield, FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown, FiMinusCircle } from 'react-icons/fi'
import CompetitorGapSection from './CompetitorGapSection'
import RewriteSection from './RewriteSection'
import QADashboardSection from './QADashboardSection'

// ── Types ──

interface Defect {
  severity?: string
  category?: string
  description?: string
  field?: string
  recommendation?: string
  suppression_risk?: string
  suppression_reason?: string
}

interface AuditResult {
  asin: string
  product_title: string
  overall_score: number
  total_defects: number
  critical_defects: number
  major_defects: number
  minor_defects: number
  summary: string
  title_analysis?: any
  image_analysis?: any
  attribute_analysis?: any
  content_analysis?: any
  defects?: Defect[]
}

interface ProductData {
  asin?: string
  title?: string
  thumbnailImage?: string
  price?: { value?: number; currency?: string }
  listPrice?: { value?: number; currency?: string }
  stars?: number
  reviewsCount?: number
  brand?: string
  features?: string[]
  highResolutionImages?: string[]
  attributes?: { key?: string; value?: string }[]
  aPlusContent?: any
  url?: string
  breadCrumbs?: string
  monthlyPurchaseVolume?: string
  bestsellerRanks?: { rank?: number; category?: string }[]
}

interface DiscoveryQuery {
  query?: string
  match_type?: string
  match_result?: string
  reasoning?: string
}

interface DiscoveryData {
  asin?: string
  product_title?: string
  discovery_match_rate?: number
  total_queries?: number
  full_matches?: number
  partial_matches?: number
  misses?: number
  queries?: DiscoveryQuery[]
  failed_queries?: { query?: string; match_result?: string; recommendation?: string }[]
  summary?: string
}

interface AEVisibilityResult {
  query?: string
  query_type?: string
  appeared?: boolean
  visibility_result?: string
  attribute_overlap_pct?: number
  attribute_overlap?: number
  matched_attributes?: string[]
  competitors_mentioned?: string[]
  gemini_response_snippet?: string
}

interface AEVisibilityData {
  success?: boolean
  results?: AEVisibilityResult[]
  summary?: {
    appeared_count?: number
    total_queries?: number
    avg_attribute_overlap?: number
    ae_visibility_score?: number
    top_competitors?: { brand?: string; mention_count?: number }[]
  }
}

interface DetailPanelProps {
  result: AuditResult
  productData: ProductData
  onClose: () => void
  discoveryData?: DiscoveryData
  discoveryLoading?: boolean
  aeVisibilityData?: AEVisibilityData
  aeVisibilityLoading?: boolean
  competitorGapData?: any
  competitorGapLoading?: boolean
  rewriteData?: any
  rewriteLoading?: boolean
  qaAuditorData?: any
  qaAuditorLoading?: boolean
}

// ── Helpers ──

function getLetterGrade(score: number): { letter: string; color: string; bg: string } {
  if (score >= 90) return { letter: 'A', color: '#22C55E', bg: '#F0FDF4' }
  if (score >= 75) return { letter: 'B', color: '#22C55E', bg: '#F0FDF4' }
  if (score >= 50) return { letter: 'C', color: '#EAB308', bg: '#FEFCE8' }
  return { letter: 'D', color: '#EF4444', bg: '#FEF2F2' }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#EAB308'
  return '#EF4444'
}

function getScoreRingColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#EAB308'
  return '#EF4444'
}

function classifySuppressionRisk(defect: Defect): { level: string; reason: string } {
  if (defect.suppression_risk && defect.suppression_risk !== 'none') {
    return { level: defect.suppression_risk, reason: defect.suppression_reason ?? '' }
  }
  const desc = (defect.description ?? '').toLowerCase()
  const cat = (defect.category ?? '').toLowerCase()
  const field = (defect.field ?? '').toLowerCase()
  if ((field.includes('main_image') || field.includes('main image') || desc.includes('main image')) &&
    (desc.includes('white background') || desc.includes('500px') || desc.includes('placeholder') || desc.includes('does not meet'))) {
    return { level: 'high', reason: 'Main image non-compliance can trigger listing suppression' }
  }
  if (desc.includes('no main image') || desc.includes('missing main image')) return { level: 'high', reason: 'Missing main image triggers immediate suppression' }
  if (desc.includes('title') && (desc.includes('exceeds 200') || desc.includes('over 200') || desc.includes('too long'))) return { level: 'high', reason: 'Title exceeding 200 characters can trigger suppression' }
  if (desc.includes('missing required') && (cat.includes('attribute') || desc.includes('attribute'))) return { level: 'high', reason: 'Missing required category attributes triggers suppression' }
  if (desc.includes('amazon trademark') || desc.includes('amazon badge') || desc.includes('amazon logo')) return { level: 'high', reason: 'Images with Amazon trademarks/badges trigger suppression' }
  if (desc.includes('placeholder image') || desc.includes('placeholder')) return { level: 'high', reason: 'Placeholder images trigger listing suppression' }
  if (desc.includes('image') && (desc.includes('does not match') || desc.includes('mismatch'))) return { level: 'medium', reason: 'Image-title mismatch may trigger suppression' }
  if (desc.includes('gtin') || desc.includes('ean') || desc.includes('upc')) return { level: 'medium', reason: 'Missing GTIN without exemption may cause suppression' }
  if (desc.includes('fewer') && desc.includes('image') || (desc.includes('insufficient') && desc.includes('image'))) return { level: 'medium', reason: 'Below minimum image count may trigger quality warnings' }
  if (desc.includes('keyword stuffing') || (cat.includes('title') && desc.includes('stuffing'))) return { level: 'low', reason: 'Keyword stuffing degrades ranking and may trigger review' }
  if (desc.includes('pollution') || desc.includes('polluted') || cat.includes('pollution')) return { level: 'low', reason: 'Attribute pollution affects listing quality score' }
  if (desc.includes('vague claim') || desc.includes('without spec') || desc.includes('unsubstantiated')) return { level: 'low', reason: 'Vague claims degrade listing quality' }
  if (desc.includes('missing recommended') || desc.includes('optional attribute')) return { level: 'low', reason: 'Missing recommended attributes reduce discoverability' }
  return { level: 'none', reason: '' }
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, major: 1, minor: 2 }

function suppressionBadgeStyle(level: string): { color: string; bg: string; border: string } {
  if (level === 'high') return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
  if (level === 'medium') return { color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' }
  if (level === 'low') return { color: '#EAB308', bg: '#FEFCE8', border: '#FEF08A' }
  return { color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' }
}

function severityBadgeStyle(severity: string): { color: string; bg: string } {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return { color: '#EF4444', bg: '#FEF2F2' }
  if (s === 'major') return { color: '#F97316', bg: '#FFF7ED' }
  return { color: '#EAB308', bg: '#FEFCE8' }
}

// ── Card wrapper ──

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '20px' }}>
      {children}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</h3>
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</h4>
}

// ── Discovery Section ──

function DiscoveryCard({ data, isLoading }: { data?: DiscoveryData; isLoading?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
          <FiLoader className="w-4 h-4 animate-spin" style={{ color: '#2563EB' }} />
          Running AI Discovery Simulation...
        </div>
      </Card>
    )
  }
  if (!data) return null

  const queries = Array.isArray(data?.queries) ? data.queries : []
  const failedQueries = Array.isArray(data?.failed_queries) ? data.failed_queries : []
  const rate = data?.discovery_match_rate ?? 0

  return (
    <Card>
      <SectionHeader>AI Discovery Simulation</SectionHeader>
      <p className="mb-3" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Simulates how AI shopping assistants match this listing against shopper queries.</p>

      <div className="flex items-center gap-6 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Match Rate</span>
          <span className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: rate >= 70 ? '#22C55E' : rate >= 40 ? '#EAB308' : '#EF4444' }}>{rate}%</span>
          <div className="rounded-full overflow-hidden" style={{ width: '80px', height: '8px', background: '#E2E8F0' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 70 ? '#22C55E' : rate >= 40 ? '#EAB308' : '#EF4444' }} />
          </div>
        </div>
        <div className="flex items-center gap-4" style={{ fontSize: '12px' }}>
          <span className="flex items-center gap-1"><span className="rounded-full" style={{ width: '8px', height: '8px', background: '#22C55E' }} /><span className="font-mono" style={{ color: '#22C55E' }}>{data?.full_matches ?? 0}</span><span style={{ color: '#64748B' }}>full</span></span>
          <span className="flex items-center gap-1"><span className="rounded-full" style={{ width: '8px', height: '8px', background: '#EAB308' }} /><span className="font-mono" style={{ color: '#EAB308' }}>{data?.partial_matches ?? 0}</span><span style={{ color: '#64748B' }}>partial</span></span>
          <span className="flex items-center gap-1"><span className="rounded-full" style={{ width: '8px', height: '8px', background: '#EF4444' }} /><span className="font-mono" style={{ color: '#EF4444' }}>{data?.misses ?? 0}</span><span style={{ color: '#64748B' }}>miss</span></span>
        </div>
      </div>

      {queries.length > 0 && (
        <div>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#1E293B' }}>
            {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            {queries.length} Simulated Queries
          </button>
          {expanded && (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {queries.map((q, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg" style={{ fontSize: '13px', background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                  <span className="flex-1 truncate" style={{ color: '#1E293B' }}>{q?.query ?? '-'}</span>
                  <span className="rounded px-1.5 py-0.5" style={{
                    fontSize: '10px', fontWeight: 600,
                    color: q?.match_result?.toLowerCase() === 'match' ? '#22C55E' : q?.match_result?.toLowerCase() === 'partial_match' ? '#EAB308' : '#EF4444',
                    background: q?.match_result?.toLowerCase() === 'match' ? '#F0FDF4' : q?.match_result?.toLowerCase() === 'partial_match' ? '#FEFCE8' : '#FEF2F2',
                  }}>
                    {(q?.match_result ?? '').replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {failedQueries.length > 0 && (
        <div className="mt-3">
          <SubHeader>Queries Failing Discovery</SubHeader>
          <div className="space-y-1.5 mt-2">
            {failedQueries.map((fq, i) => (
              <div key={i} className="rounded-lg p-2.5" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <p style={{ fontSize: '13px', color: '#1E293B' }}>{fq?.query ?? '-'}</p>
                {fq?.recommendation && <p className="mt-1" style={{ fontSize: '11px', color: '#64748B' }}>Fix: {fq.recommendation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.summary && <p className="mt-3 leading-relaxed" style={{ fontSize: '13px', color: '#64748B' }}>{data.summary}</p>}
    </Card>
  )
}

// ── AE Visibility Section ──

function QueryResultRow({ query, visibilityResult, reasoning, index }: { query: string; visibilityResult: string; reasoning: string; index: number }) {
  const [showReasoning, setShowReasoning] = useState(false)
  const icon = visibilityResult === 'direct_mention'
    ? <FiCheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#22C55E' }} />
    : visibilityResult === 'category_mention'
    ? <FiMinusCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EAB308' }} />
    : <FiXCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EF4444' }} />
  const label = visibilityResult === 'direct_mention' ? 'Direct' : visibilityResult === 'category_mention' ? 'Category' : 'Not Found'
  const labelColor = visibilityResult === 'direct_mention' ? '#22C55E' : visibilityResult === 'category_mention' ? '#EAB308' : '#EF4444'

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg cursor-pointer"
        style={{ fontSize: '13px', background: index % 2 === 0 ? 'white' : '#F8FAFC' }}
        onClick={() => reasoning && setShowReasoning(!showReasoning)}
        title={reasoning || undefined}
      >
        {icon}
        <span className="flex-1 truncate" style={{ color: '#1E293B' }}>{query}</span>
        <span className="font-mono" style={{ fontSize: '10px', fontWeight: 600, color: labelColor }}>{label}</span>
        {reasoning && (showReasoning ? <FiChevronUp className="w-3 h-3 flex-shrink-0" style={{ color: '#94A3B8' }} /> : <FiChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#94A3B8' }} />)}
      </div>
      {showReasoning && reasoning && (
        <div className="px-8 py-1.5" style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.5' }}>
          {reasoning}
        </div>
      )}
    </div>
  )
}

function AEVisibilityCard({ data, isLoading }: { data?: AEVisibilityData; isLoading?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
          <FiLoader className="w-4 h-4 animate-spin" style={{ color: '#2563EB' }} />
          Running AE Visibility Analysis (querying Gemini)...
        </div>
      </Card>
    )
  }
  if (!data) return null

  const results = Array.isArray(data?.results) ? data.results : []
  const summary = data?.summary
  const appearedCount = summary?.appeared_count ?? 0
  const avgOverlap = summary?.ae_visibility_score ?? summary?.avg_attribute_overlap ?? 0
  // Build competitor counts from per-query competitors_mentioned arrays
  const competitorTags = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of results) {
      const arr = Array.isArray(r?.competitors_mentioned) ? r.competitors_mentioned : []
      for (const name of arr) {
        if (typeof name === 'string' && name.trim()) {
          const key = name.trim()
          counts[key] = (counts[key] ?? 0) + 1
        }
      }
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [results])

  return (
    <Card>
      <SectionHeader>AE Visibility (Gemini)</SectionHeader>
      <p className="mb-3" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Checks if Gemini AI recommends this product in natural language searches.</p>

      <div className="rounded-lg p-4 mb-4" style={{
        background: appearedCount >= 5 ? '#F0FDF4' : appearedCount >= 3 ? '#FEFCE8' : '#FEF2F2',
        border: `1px solid ${appearedCount >= 5 ? '#BBF7D0' : appearedCount >= 3 ? '#FEF08A' : '#FECACA'}`,
      }}>
        <div className="flex items-center gap-4">
          <div>
            <span className="font-mono" style={{ fontSize: '36px', fontWeight: 700, color: appearedCount >= 5 ? '#22C55E' : appearedCount >= 3 ? '#EAB308' : '#EF4444' }}>{appearedCount}</span>
            <span className="font-mono" style={{ fontSize: '18px', color: '#94A3B8' }}>/10</span>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>Gemini Searches</p>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Avg Attribute Overlap: <span className="font-mono" style={{ fontWeight: 600 }}>{avgOverlap}%</span></p>
          </div>
        </div>
      </div>

      {competitorTags.length > 0 && (
        <div className="mb-3">
          <SubHeader>Competitors Gemini Prefers</SubHeader>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {competitorTags.slice(0, 8).map((c, i) => (
              <span key={i} className="rounded-lg px-2 py-1 font-mono" style={{ fontSize: '11px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }}>
                {c.name} <span style={{ color: '#94A3B8' }}>x{c.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#1E293B' }}>
            {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            {results.length} Query Results
          </button>
          {expanded && (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {results.map((r, i) => {
                const overlapVal = r?.attribute_overlap_pct ?? r?.attribute_overlap ?? 0
                const visResult = r?.visibility_result ?? (r?.appeared ? 'direct_mention' : (overlapVal > 0 ? 'category_mention' : 'not_mentioned'))
                const reasoning = r?.gemini_response_snippet ?? ''
                return (
                  <QueryResultRow key={i} query={r?.query ?? '-'} visibilityResult={visResult} reasoning={reasoning} index={i} />
                )
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ── Main DetailPanel ──

export default function DetailPanel({ result, productData, onClose, discoveryData, discoveryLoading, aeVisibilityData, aeVisibilityLoading, competitorGapData, competitorGapLoading, rewriteData, rewriteLoading, qaAuditorData, qaAuditorLoading }: DetailPanelProps) {
  const defects = Array.isArray(result?.defects) ? result.defects : []
  const [sortField, setSortField] = useState<'severity' | 'category'>('severity')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sortedDefects = useMemo(() => {
    const arr = [...defects]
    arr.sort((a, b) => {
      if (sortField === 'severity') {
        const aOrder = SEVERITY_ORDER[(a.severity ?? 'minor').toLowerCase()] ?? 3
        const bOrder = SEVERITY_ORDER[(b.severity ?? 'minor').toLowerCase()] ?? 3
        return sortDir === 'asc' ? aOrder - bOrder : bOrder - aOrder
      }
      const aVal = (a.category ?? '').toLowerCase()
      const bVal = (b.category ?? '').toLowerCase()
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
    return arr
  }, [defects, sortField, sortDir])

  const toggleSort = (field: 'severity' | 'category') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: 'severity' | 'category' }) => {
    if (sortField !== field) return null
    return sortDir === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
  }

  const grade = getLetterGrade(result?.overall_score ?? 0)
  const ringColor = getScoreRingColor(result?.overall_score ?? 0)
  // 64px max diameter = 32 radius, ring radius = 26 (for 6px stroke within 64px viewBox)
  const ringRadius = 26
  const circumference = 2 * Math.PI * ringRadius
  const dashOffset = circumference - (circumference * Math.min(result?.overall_score ?? 0, 100)) / 100

  const topActions = defects
    .filter(d => d?.recommendation)
    .sort((a, b) => (SEVERITY_ORDER[(a.severity ?? 'minor').toLowerCase()] ?? 3) - (SEVERITY_ORDER[(b.severity ?? 'minor').toLowerCase()] ?? 3))
    .slice(0, 3)
    .map(d => d.recommendation!)

  return (
    <div className="max-h-[70vh] overflow-y-auto" style={{ borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between" style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '12px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-3 min-w-0">
          {productData?.thumbnailImage && (
            <img src={productData.thumbnailImage} alt="" className="rounded-lg object-cover flex-shrink-0" style={{ width: '40px', height: '40px', background: '#F1F5F9' }} />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{result?.asin ?? '-'}</span>
              {productData?.url && (
                <a href={productData.url} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <span className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: getScoreColor(result?.overall_score ?? 0) }}>
                {result?.overall_score ?? 0}
              </span>
              <span className="rounded px-1.5 py-0.5" style={{ fontSize: '11px', fontWeight: 700, color: grade.color, background: grade.bg }}>{grade.letter}</span>
            </div>
            <p className="truncate max-w-lg" style={{ fontSize: '12px', color: '#64748B' }}>{result?.product_title ?? ''}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: '#94A3B8' }}>
          <FiXCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Single-column, max-width 900px, 16px gap */}
      <div className="mx-auto" style={{ maxWidth: '900px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 1. Product Card - single horizontal row, max 60px height */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '8px 20px', maxHeight: '60px', overflow: 'hidden' }}>
          <div className="flex items-center gap-3" style={{ height: '44px' }}>
            {productData?.thumbnailImage && (
              <img src={productData.thumbnailImage} alt="" className="rounded object-cover flex-shrink-0" style={{ width: '48px', height: '48px', background: '#F1F5F9' }} />
            )}
            {productData?.brand && (
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{productData.brand}</span>
            )}
            {productData?.price?.value != null && (
              <>
                <span style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#22C55E' }}>
                  {productData.price.currency ?? '\u20b9'}{productData.price.value}
                  {productData?.listPrice?.value != null && (
                    <span className="line-through ml-1.5" style={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>{productData.listPrice.currency ?? '\u20b9'}{productData.listPrice.value}</span>
                  )}
                </span>
              </>
            )}
            {productData?.stars != null && (
              <>
                <span style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#EAB308' }}>
                  {'★'.repeat(Math.round(productData.stars))} {productData.stars}
                  <span className="ml-1" style={{ fontSize: '11px', color: '#94A3B8' }}>({productData?.reviewsCount ?? 0})</span>
                </span>
              </>
            )}
            {productData?.breadCrumbs && (
              <>
                <span style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
                <span className="truncate" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>{productData.breadCrumbs}</span>
              </>
            )}
            {productData?.monthlyPurchaseVolume && (
              <>
                <span style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#22C55E' }}>{productData.monthlyPurchaseVolume}</span>
              </>
            )}
          </div>
        </div>

        {/* 2. Score Summary */}
        <Card>
          <div className="flex items-center gap-6 flex-wrap">
            {/* Score ring - max 64px */}
            <div className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth="5" />
                <circle cx="32" cy="32" r={ringRadius} fill="none" stroke={ringColor} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 32 32)" className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: ringColor, lineHeight: 1 }}>{result?.overall_score ?? 0}</span>
              </div>
            </div>

            {/* Letter grade pill */}
            <span className="rounded-full px-2.5 py-1" style={{ fontSize: '14px', fontWeight: 700, color: grade.color, background: grade.bg }}>{grade.letter}</span>

            {/* Severity counts - small inline badges */}
            <div className="flex items-center gap-2">
              <span className="rounded px-2 py-1" style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', background: '#FEF2F2' }}>{result?.critical_defects ?? 0} <span style={{ fontSize: '11px', fontWeight: 500 }}>critical</span></span>
              <span className="rounded px-2 py-1" style={{ fontSize: '14px', fontWeight: 700, color: '#F97316', background: '#FFF7ED' }}>{result?.major_defects ?? 0} <span style={{ fontSize: '11px', fontWeight: 500 }}>major</span></span>
              <span className="rounded px-2 py-1" style={{ fontSize: '14px', fontWeight: 700, color: '#EAB308', background: '#FEFCE8' }}>{result?.minor_defects ?? 0} <span style={{ fontSize: '11px', fontWeight: 500 }}>minor</span></span>
            </div>

            {/* Top actions */}
            {topActions.length > 0 && (
              <div className="flex-1 min-w-0">
                <div className="uppercase tracking-wide mb-1.5" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Top Actions</div>
                <div className="flex flex-wrap gap-1.5">
                  {topActions.map((action, i) => (
                    <span key={i} className="rounded-full px-2.5 py-1 cursor-default truncate max-w-[240px]" title={action} style={{ fontSize: '11px', color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result?.summary && <p className="mt-3 leading-relaxed" style={{ fontSize: '13px', color: '#64748B' }}>{result.summary}</p>}
        </Card>

        {/* 3. Defects Table */}
        <Card>
          <SectionHeader>Defects ({defects.length})</SectionHeader>

          {/* Suppression risk summary */}
          {(() => {
            const risked = defects.map(d => ({ defect: d, risk: classifySuppressionRisk(d) })).filter(r => r.risk.level !== 'none')
            const highCount = risked.filter(r => r.risk.level === 'high').length
            const medCount = risked.filter(r => r.risk.level === 'medium').length
            const lowCount = risked.filter(r => r.risk.level === 'low').length
            if (risked.length === 0) return null
            return (
              <div className="rounded-lg p-3 mb-4" style={{
                background: highCount > 0 ? '#FEF2F2' : medCount > 0 ? '#FFF7ED' : '#FEFCE8',
                border: `1px solid ${highCount > 0 ? '#FECACA' : medCount > 0 ? '#FED7AA' : '#FEF08A'}`,
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <FiShield className="w-4 h-4" style={{ color: highCount > 0 ? '#EF4444' : medCount > 0 ? '#F97316' : '#EAB308' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: highCount > 0 ? '#EF4444' : medCount > 0 ? '#F97316' : '#EAB308' }}>
                    {risked.length} defect{risked.length !== 1 ? 's' : ''} carry suppression risk
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {highCount > 0 && <span className="rounded px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA' }}>{highCount} HIGH</span>}
                  {medCount > 0 && <span className="rounded px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA' }}>{medCount} MEDIUM</span>}
                  {lowCount > 0 && <span className="rounded px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: '#EAB308', background: '#FEFCE8', border: '1px solid #FEF08A' }}>{lowCount} LOW</span>}
                </div>
              </div>
            )
          })()}

          {defects.length === 0 ? (
            <div className="flex items-center gap-2 py-3" style={{ fontSize: '13px', color: '#22C55E' }}>
              <FiCheckCircle className="w-4 h-4" /> No defects found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <th className="text-left pr-3 font-semibold cursor-pointer select-none uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 0' }} onClick={() => toggleSort('severity')}>
                      <span className="flex items-center gap-1">Severity <SortIcon field="severity" /></span>
                    </th>
                    <th className="text-left pr-3 font-semibold cursor-pointer select-none uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 0' }} onClick={() => toggleSort('category')}>
                      <span className="flex items-center gap-1">Type <SortIcon field="category" /></span>
                    </th>
                    <th className="text-left pr-3 font-semibold uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 0' }}>Description</th>
                    <th className="text-left pr-3 font-semibold uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 0' }}>Risk</th>
                    <th className="text-left font-semibold uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 0' }}>Recommended Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDefects.map((d, i) => {
                    const sr = classifySuppressionRisk(d)
                    const sStyle = severityBadgeStyle(d?.severity ?? 'minor')
                    const srStyle = suppressionBadgeStyle(sr.level)
                    return (
                      <tr key={i} className="transition-colors" style={{ height: '48px', background: i % 2 === 1 ? '#F8FAFC' : 'white', borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0 12px 0 0' }}>
                          <span className="uppercase rounded px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: sStyle.color, background: sStyle.bg }}>
                            {d?.severity ?? 'unknown'}
                          </span>
                        </td>
                        <td style={{ padding: '0 12px 0 0' }}>
                          <span className="rounded px-2 py-0.5" style={{ fontSize: '11px', color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>{d?.category ?? '-'}</span>
                        </td>
                        <td className="max-w-[300px]" style={{ padding: '0 12px 0 0', fontSize: '13px', color: '#1E293B' }}>{d?.description ?? ''}</td>
                        <td style={{ padding: '0 12px 0 0' }}>
                          {sr.level !== 'none' && (
                            <span className="inline-flex items-center gap-1 uppercase rounded px-1.5 py-0.5" title={sr.reason} style={{ fontSize: '10px', fontWeight: 700, color: srStyle.color, background: srStyle.bg, border: `1px solid ${srStyle.border}` }}>
                              <FiShield className="w-2.5 h-2.5" />
                              {sr.level}
                            </span>
                          )}
                        </td>
                        <td className="max-w-[240px]" style={{ fontSize: '13px', color: '#64748B' }}>{d?.recommendation ?? ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 4. Discovery */}
        <DiscoveryCard data={discoveryData} isLoading={discoveryLoading} />

        {/* 5. AE Visibility */}
        <AEVisibilityCard data={aeVisibilityData} isLoading={aeVisibilityLoading} />

        {/* 6. Competitor Gaps */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <CompetitorGapSection data={competitorGapData} isLoading={competitorGapLoading} aeVisibilityData={aeVisibilityData} />
        </div>

        {/* 7. Rewrite Diff */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <RewriteSection data={rewriteData} isLoading={rewriteLoading} />
        </div>

        {/* 8. QA Auditor */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '20px' }}>
            <QADashboardSection data={qaAuditorData} isLoading={qaAuditorLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
