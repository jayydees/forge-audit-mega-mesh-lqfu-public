'use client'

import { useState } from 'react'
import { FiEdit, FiRefreshCw, FiChevronDown, FiChevronUp, FiLoader, FiCheckCircle, FiArrowRight, FiTag, FiSearch, FiBarChart2 } from 'react-icons/fi'

interface RewriteData {
  original_title?: string
  rewritten_title?: string
  title_char_count?: number
  title_changes?: { change_type?: string; detail?: string }[]
  original_bullets?: string[]
  rewritten_bullets?: string[]
  bullet_changes?: { bullet_index?: number; change_type?: string; detail?: string }[]
  original_description?: string | null
  rewritten_description?: string
  description_generated?: boolean
  description_changes?: { change_type?: string; detail?: string }[]
  incorporated_competitor_gaps?: string[]
  incorporated_discovery_terms?: string[]
  improvement_summary?: string
  confidence_score?: number
}

interface RewriteSectionProps {
  data?: RewriteData
  isLoading?: boolean
}

function changeTypeBadgeStyle(changeType?: string): { color: string; bg: string; border: string } {
  const ct = (changeType ?? '').toLowerCase()
  if (ct === 'added') return { color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0' }
  if (ct === 'removed') return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
  if (ct === 'modified') return { color: '#EAB308', bg: '#FEFCE8', border: '#FEF08A' }
  return { color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' }
}

function ChangeList({ changes }: { changes?: { change_type?: string; detail?: string }[] }) {
  const list = Array.isArray(changes) ? changes : []
  if (list.length === 0) return null
  return (
    <div className="space-y-1 mt-2">
      {list.map((c, i) => {
        const s = changeTypeBadgeStyle(c?.change_type)
        return (
          <div key={i} className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5 rounded px-1.5 py-0.5" style={{ fontSize: '9px', fontWeight: 500, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
              {(c?.change_type ?? 'unknown').toLowerCase()}
            </span>
            <span className="leading-relaxed" style={{ fontSize: '11px', color: '#64748B' }}>{c?.detail ?? ''}</span>
          </div>
        )
      })}
    </div>
  )
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 transition-colors" style={{ padding: '12px 20px', color: '#1E293B' }}>
        {icon}
        <span style={{ fontSize: '16px', fontWeight: 600 }}>{title}</span>
        <span className="ml-auto">{open ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}</span>
      </button>
      {open && <div style={{ padding: '0 20px 20px', borderTop: '1px solid #E2E8F0' }}>{children}</div>}
    </div>
  )
}

export default function RewriteSection({ data, isLoading }: RewriteSectionProps) {
  const [activeTab, setActiveTab] = useState<'title' | 'bullets' | 'description'>('title')

  if (isLoading) {
    return (
      <div style={{ padding: '16px 20px' }}>
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
          <FiLoader className="w-4 h-4 animate-spin" style={{ color: '#22C55E' }} />
          <span>Generating AI-optimized rewrite...</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const originalBullets = Array.isArray(data?.original_bullets) ? data.original_bullets : []
  const rewrittenBullets = Array.isArray(data?.rewritten_bullets) ? data.rewritten_bullets : []
  const bulletChanges = Array.isArray(data?.bullet_changes) ? data.bullet_changes : []
  const titleChanges = Array.isArray(data?.title_changes) ? data.title_changes : []
  const descChanges = Array.isArray(data?.description_changes) ? data.description_changes : []
  const competitorGaps = Array.isArray(data?.incorporated_competitor_gaps) ? data.incorporated_competitor_gaps : []
  const discoveryTerms = Array.isArray(data?.incorporated_discovery_terms) ? data.incorporated_discovery_terms : []
  const confidence = data?.confidence_score ?? 0
  const maxBullets = Math.max(originalBullets.length, rewrittenBullets.length)

  const tabs = [
    { key: 'title' as const, label: 'Title' },
    { key: 'bullets' as const, label: 'Bullets' },
    { key: 'description' as const, label: 'Description' },
  ]

  return (
    <CollapsibleSection title="AI Rewrite Suggestions" icon={<FiEdit className="w-3 h-3" style={{ color: '#22C55E' }} />} defaultOpen>
      <div className="space-y-3 pt-3">
        <p className="leading-relaxed" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>
          AI-generated optimized rewrites based on Defect Hunter, Discovery, and Competitor Gap findings.
        </p>

        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex-1 py-1.5 px-2 rounded-md transition-colors"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                background: activeTab === t.key ? 'white' : 'transparent',
                color: activeTab === t.key ? '#1E293B' : '#64748B',
                boxShadow: activeTab === t.key ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Title View */}
        {activeTab === 'title' && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="rounded-lg p-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#EF4444' }}>Original</span>
                </div>
                <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{data?.original_title ?? '--'}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#22C55E' }}>Rewritten</span>
                  <FiArrowRight className="w-2.5 h-2.5" style={{ color: '#22C55E' }} />
                </div>
                <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{data?.rewritten_title ?? '--'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: '12px' }}>
              <span style={{ color: '#64748B' }}>Character count:</span>
              <span className="font-mono" style={{ fontWeight: 500, color: (data?.title_char_count ?? 0) > 200 ? '#EF4444' : '#22C55E' }}>
                {data?.title_char_count ?? 0}/200
              </span>
              {(data?.title_char_count ?? 0) <= 200 && <FiCheckCircle className="w-3 h-3" style={{ color: '#22C55E' }} />}
            </div>
            {titleChanges.length > 0 && (
              <div>
                <h5 className="uppercase tracking-wide mb-1" style={{ fontSize: '10px', fontWeight: 500, color: '#64748B' }}>Changes</h5>
                <ChangeList changes={titleChanges} />
              </div>
            )}
          </div>
        )}

        {/* Bullets View */}
        {activeTab === 'bullets' && (
          <div className="space-y-2">
            {Array.from({ length: maxBullets }).map((_, idx) => {
              const orig = originalBullets[idx]
              const rewr = rewrittenBullets[idx]
              const bulletChgs = bulletChanges.filter(bc => bc?.bullet_index === idx)
              return (
                <div key={idx} className="space-y-1">
                  <div className="uppercase tracking-wide" style={{ fontSize: '10px', fontWeight: 600, color: '#64748B' }}>Bullet {idx + 1}</div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="rounded-lg p-2.5" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                      <span className="block mb-1 uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#EF4444' }}>Original</span>
                      <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{orig ?? '--'}</p>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <span className="block mb-1 uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#22C55E' }}>Rewritten</span>
                      <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{rewr ?? '--'}</p>
                    </div>
                  </div>
                  {bulletChgs.length > 0 && <ChangeList changes={bulletChgs} />}
                </div>
              )
            })}
          </div>
        )}

        {/* Description View */}
        {activeTab === 'description' && (
          <div className="space-y-2">
            {data?.description_generated && (
              <div className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ fontSize: '10px', fontWeight: 500, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <FiRefreshCw className="w-3 h-3" />
                Generated (original was empty)
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="rounded-lg p-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <span className="block mb-1.5 uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#EF4444' }}>Original</span>
                <p className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: '13px', color: '#1E293B' }}>
                  {data?.original_description ?? '(No description)'}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <span className="block mb-1.5 uppercase tracking-wide" style={{ fontSize: '9px', fontWeight: 600, color: '#22C55E' }}>Rewritten</span>
                <p className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: '13px', color: '#1E293B' }}>
                  {data?.rewritten_description ?? '--'}
                </p>
              </div>
            </div>
            {descChanges.length > 0 && (
              <div>
                <h5 className="uppercase tracking-wide mb-1" style={{ fontSize: '10px', fontWeight: 500, color: '#64748B' }}>Changes</h5>
                <ChangeList changes={descChanges} />
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="pt-3 space-y-3" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <FiBarChart2 className="w-3.5 h-3.5" style={{ color: '#94A3B8' }} />
            <span className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Confidence</span>
            <div className="flex-1 rounded-full overflow-hidden max-w-xs" style={{ height: '8px', background: '#E2E8F0' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(confidence, 100)}%`, background: confidence >= 70 ? '#22C55E' : confidence >= 40 ? '#EAB308' : '#EF4444' }}
              />
            </div>
            <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: confidence >= 70 ? '#22C55E' : confidence >= 40 ? '#EAB308' : '#EF4444' }}>
              {confidence}%
            </span>
          </div>

          {competitorGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FiTag className="w-3 h-3" style={{ color: '#F97316' }} />
                <h5 className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Incorporated Competitor Gaps</h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {competitorGaps.map((gap, i) => (
                  <span key={i} className="rounded-full px-2 py-0.5" style={{ fontSize: '10px', color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {discoveryTerms.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FiSearch className="w-3 h-3" style={{ color: '#2563EB' }} />
                <h5 className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Incorporated Discovery Terms</h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {discoveryTerms.map((term, i) => (
                  <span key={i} className="rounded-full px-2 py-0.5" style={{ fontSize: '10px', color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data?.improvement_summary && (
            <div>
              <h5 className="uppercase tracking-wide mb-1" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Improvement Summary</h5>
              <p className="leading-relaxed" style={{ fontSize: '13px', color: '#64748B' }}>{data.improvement_summary}</p>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}
