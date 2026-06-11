'use client'

import { useState } from 'react'
import { FiTarget, FiTrendingUp, FiUsers, FiChevronDown, FiChevronUp, FiLoader, FiAlertTriangle } from 'react-icons/fi'

interface CompetitorGapData {
  asin?: string
  product_title?: string
  identified_category?: string
  competitors?: {
    asin?: string
    title?: string
    brand?: string
    price?: string
    rating?: string
    review_count?: string
    key_attributes?: string[]
    bullet_topics?: string[]
    title_keywords?: string[]
  }[]
  attribute_gaps?: {
    attribute?: string
    competitor_value?: string
    competitor_brand?: string
    gap_type?: string
    recommendation?: string
  }[]
  bullet_gaps?: {
    topic?: string
    competitor_example?: string
    competitor_brand?: string
    recommendation?: string
  }[]
  title_keyword_gaps?: {
    keyword?: string
    used_by?: string[]
    recommendation?: string
  }[]
  summary?: string
  total_gaps?: number
  critical_gaps?: number
}

interface AEVisibilityData {
  success?: boolean
  results?: {
    query?: string
    competitors_mentioned?: string[]
  }[]
  summary?: {
    top_competitors?: { brand?: string; mention_count?: number }[]
  }
}

interface CompetitorGapSectionProps {
  data?: CompetitorGapData
  isLoading?: boolean
  aeVisibilityData?: AEVisibilityData
}

function CollapsibleInner({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg" style={{ border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors" style={{ fontSize: '13px', color: '#1E293B' }}>
        {icon}
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span className="ml-auto">{open ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}</span>
      </button>
      {open && <div className="px-3 pb-3" style={{ borderTop: '1px solid #E2E8F0' }}>{children}</div>}
    </div>
  )
}

function gapTypeBadgeStyle(gapType?: string): { color: string; bg: string; border: string } {
  const t = (gapType ?? '').toLowerCase()
  if (t.includes('missing') || t.includes('critical')) return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
  if (t.includes('weak') || t.includes('inferior')) return { color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' }
  if (t.includes('partial')) return { color: '#EAB308', bg: '#FEFCE8', border: '#FEF08A' }
  return { color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' }
}

export default function CompetitorGapSection({ data, isLoading, aeVisibilityData }: CompetitorGapSectionProps) {
  const [sectionOpen, setSectionOpen] = useState(false)

  if (isLoading) {
    return (
      <div style={{ padding: '16px' }}>
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
          <FiLoader className="w-4 h-4 animate-spin" style={{ color: '#F97316' }} />
          <span>Running Competitor Gap Analysis...</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const competitors = Array.isArray(data?.competitors) ? data.competitors : []
  const attributeGaps = Array.isArray(data?.attribute_gaps) ? data.attribute_gaps : []
  const bulletGaps = Array.isArray(data?.bullet_gaps) ? data.bullet_gaps : []
  const keywordGaps = Array.isArray(data?.title_keyword_gaps) ? data.title_keyword_gaps : []
  const totalGaps = data?.total_gaps ?? 0
  const criticalGaps = data?.critical_gaps ?? 0

  const gapBrands = competitors.map(c => (c?.brand ?? '').toLowerCase()).filter(Boolean)
  const aeCompetitors: string[] = []
  if (aeVisibilityData) {
    const topComps = Array.isArray(aeVisibilityData?.summary?.top_competitors) ? aeVisibilityData.summary.top_competitors : []
    topComps.forEach(c => {
      const b = (c?.brand ?? '').toLowerCase()
      if (b) aeCompetitors.push(b)
    })
    const aeResults = Array.isArray(aeVisibilityData?.results) ? aeVisibilityData.results : []
    aeResults.forEach(r => {
      const mentioned = Array.isArray(r?.competitors_mentioned) ? r.competitors_mentioned : []
      mentioned.forEach(m => {
        const lower = (m ?? '').toLowerCase()
        if (lower && !aeCompetitors.includes(lower)) aeCompetitors.push(lower)
      })
    })
  }

  const inBoth = gapBrands.filter(b => aeCompetitors.includes(b))
  const onlyInGap = gapBrands.filter(b => !aeCompetitors.includes(b))
  const onlyInAE = aeCompetitors.filter(b => !gapBrands.includes(b))
  const hasCrossRef = aeVisibilityData && (inBoth.length > 0 || onlyInGap.length > 0 || onlyInAE.length > 0)

  return (
    <div>
      <button onClick={() => setSectionOpen(!sectionOpen)} className="w-full flex items-center gap-2 transition-colors" style={{ padding: '12px 20px', color: '#1E293B' }}>
        <FiTarget className="w-4 h-4" style={{ color: '#F97316' }} />
        <span style={{ fontSize: '16px', fontWeight: 600 }}>Competitor Gap Analysis</span>
        {totalGaps > 0 && (
          <span className="font-mono rounded px-1.5 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA' }}>{totalGaps} gaps</span>
        )}
        <span className="ml-auto">{sectionOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}</span>
      </button>
      {sectionOpen && (
        <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="leading-relaxed" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Compares this listing against competitors in the same category to find attribute, bullet, and keyword gaps.</p>

          {/* Hero metrics */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: '#F97316' }}>{totalGaps}</span>
                <p className="uppercase" style={{ fontSize: '10px', fontWeight: 600, color: '#F97316' }}>Total Gaps</p>
              </div>
              {criticalGaps > 0 && (
                <div style={{ borderLeft: '1px solid #FED7AA', paddingLeft: '12px' }}>
                  <span className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>{criticalGaps}</span>
                  <p className="uppercase" style={{ fontSize: '10px', fontWeight: 600, color: '#EF4444' }}>Critical</p>
                </div>
              )}
            </div>
            {data?.identified_category && (
              <span className="rounded-lg px-2.5 py-1" style={{ fontSize: '11px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B' }}>
                Category: <span style={{ fontWeight: 600, color: '#1E293B' }}>{data.identified_category}</span>
              </span>
            )}
          </div>

          {competitors.length > 0 && (
            <CollapsibleInner title={`Competitors Found (${competitors.length})`} icon={<FiUsers className="w-3 h-3" style={{ color: '#2563EB' }} />} defaultOpen={false}>
              <div className="space-y-2 pt-2 max-h-64 overflow-y-auto pr-1">
                {competitors.map((c, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono" style={{ fontSize: '11px', color: '#64748B' }}>{c?.asin ?? '--'}</span>
                      {c?.brand && <span className="rounded px-1.5 py-0.5" style={{ fontSize: '10px', fontWeight: 500, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>{c.brand}</span>}
                      {c?.price && <span className="font-mono" style={{ fontSize: '11px', color: '#22C55E' }}>{c.price}</span>}
                      {c?.rating && <span style={{ fontSize: '11px', color: '#EAB308' }}>{c.rating}</span>}
                      {c?.review_count && <span style={{ fontSize: '11px', color: '#64748B' }}>({c.review_count} reviews)</span>}
                    </div>
                    <p className="mt-1 truncate" style={{ fontSize: '12px', color: '#64748B' }}>{c?.title ?? '--'}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {Array.isArray(c?.key_attributes) && c.key_attributes.slice(0, 6).map((attr, j) => (
                        <span key={j} className="rounded px-1 py-0.5" style={{ fontSize: '9px', color: '#64748B', background: '#F8FAFC' }}>{attr}</span>
                      ))}
                      {Array.isArray(c?.bullet_topics) && c.bullet_topics.slice(0, 4).map((bt, j) => (
                        <span key={`bt-${j}`} className="rounded px-1 py-0.5" style={{ fontSize: '9px', color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE' }}>{bt}</span>
                      ))}
                      {Array.isArray(c?.title_keywords) && c.title_keywords.slice(0, 4).map((kw, j) => (
                        <span key={`kw-${j}`} className="rounded px-1 py-0.5" style={{ fontSize: '9px', color: '#0891B2', background: '#ECFEFF', border: '1px solid #A5F3FC' }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleInner>
          )}

          {attributeGaps.length > 0 && (
            <CollapsibleInner title={`Attribute Gaps (${attributeGaps.length})`} icon={<FiTrendingUp className="w-3 h-3" style={{ color: '#EF4444' }} />} defaultOpen={false}>
              <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto pr-1">
                {attributeGaps.map((g, i) => {
                  const gs = gapTypeBadgeStyle(g?.gap_type)
                  return (
                    <div key={i} className="rounded-lg p-2.5" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{g?.attribute ?? '--'}</span>
                        <span className="rounded px-1.5 py-0.5" style={{ fontSize: '9px', fontWeight: 500, color: gs.color, background: gs.bg, border: `1px solid ${gs.border}` }}>{g?.gap_type ?? 'gap'}</span>
                        {g?.competitor_brand && (
                          <span className="rounded px-1.5 py-0.5" style={{ fontSize: '9px', color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>{g.competitor_brand}</span>
                        )}
                      </div>
                      {g?.competitor_value && <p style={{ fontSize: '11px', color: '#64748B' }}>Competitor value: <span style={{ color: '#1E293B' }}>{g.competitor_value}</span></p>}
                      {g?.recommendation && <p className="italic mt-0.5" style={{ fontSize: '11px', color: '#64748B' }}><FiAlertTriangle className="w-2.5 h-2.5 inline mr-1" style={{ color: '#EAB308' }} />{g.recommendation}</p>}
                    </div>
                  )
                })}
              </div>
            </CollapsibleInner>
          )}

          {bulletGaps.length > 0 && (
            <CollapsibleInner title={`Bullet Topic Gaps (${bulletGaps.length})`} icon={<FiTrendingUp className="w-3 h-3" style={{ color: '#F59E0B' }} />} defaultOpen={false}>
              <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto pr-1">
                {bulletGaps.map((g, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{g?.topic ?? '--'}</span>
                      {g?.competitor_brand && (
                        <span className="rounded px-1.5 py-0.5" style={{ fontSize: '9px', color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>{g.competitor_brand}</span>
                      )}
                    </div>
                    {g?.competitor_example && <p style={{ fontSize: '11px', color: '#64748B' }}>Example: <span style={{ color: '#1E293B' }}>{g.competitor_example}</span></p>}
                    {g?.recommendation && <p className="italic mt-0.5" style={{ fontSize: '11px', color: '#64748B' }}><FiAlertTriangle className="w-2.5 h-2.5 inline mr-1" style={{ color: '#EAB308' }} />{g.recommendation}</p>}
                  </div>
                ))}
              </div>
            </CollapsibleInner>
          )}

          {keywordGaps.length > 0 && (
            <CollapsibleInner title={`Title Keyword Gaps (${keywordGaps.length})`} icon={<FiTrendingUp className="w-3 h-3" style={{ color: '#0891B2' }} />} defaultOpen={false}>
              <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto pr-1">
                {keywordGaps.map((g, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: '#0891B2' }}>{g?.keyword ?? '--'}</span>
                      {Array.isArray(g?.used_by) && g.used_by.map((brand, j) => (
                        <span key={j} className="rounded px-1.5 py-0.5" style={{ fontSize: '9px', color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>{brand}</span>
                      ))}
                    </div>
                    {g?.recommendation && <p className="italic mt-0.5" style={{ fontSize: '11px', color: '#64748B' }}><FiAlertTriangle className="w-2.5 h-2.5 inline mr-1" style={{ color: '#EAB308' }} />{g.recommendation}</p>}
                  </div>
                ))}
              </div>
            </CollapsibleInner>
          )}

          {hasCrossRef && (
            <CollapsibleInner title="Cross-Reference: Competitor Gap vs Gemini Visibility" icon={<FiUsers className="w-3 h-3" style={{ color: '#7C3AED' }} />} defaultOpen={false}>
              <div className="space-y-2 pt-2">
                <p style={{ fontSize: '11px', color: '#64748B' }}>Comparing competitors found by gap analysis with those mentioned by Gemini AI.</p>
                {inBoth.length > 0 && (
                  <div>
                    <h6 className="uppercase tracking-wide mb-1" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>In Both Analyses</h6>
                    <div className="flex flex-wrap gap-1.5">
                      {inBoth.map((b, i) => (
                        <span key={i} className="rounded px-1.5 py-0.5 capitalize" style={{ fontSize: '10px', fontWeight: 500, color: '#22C55E', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}
                {onlyInGap.length > 0 && (
                  <div>
                    <h6 className="uppercase tracking-wide mb-1" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Only in Gap Analysis</h6>
                    <div className="flex flex-wrap gap-1.5">
                      {onlyInGap.map((b, i) => (
                        <span key={i} className="rounded px-1.5 py-0.5 capitalize" style={{ fontSize: '10px', color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}
                {onlyInAE.length > 0 && (
                  <div>
                    <h6 className="uppercase tracking-wide mb-1" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Only in Gemini Visibility</h6>
                    <div className="flex flex-wrap gap-1.5">
                      {onlyInAE.map((b, i) => (
                        <span key={i} className="rounded px-1.5 py-0.5 capitalize" style={{ fontSize: '10px', color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleInner>
          )}

          {data?.summary && (
            <div>
              <h5 className="uppercase tracking-wide mb-1" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Gap Analysis Summary</h5>
              <p className="leading-relaxed" style={{ fontSize: '13px', color: '#64748B' }}>{data.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
