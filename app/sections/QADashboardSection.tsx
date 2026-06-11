'use client'

import { useState } from 'react'
import { FiCheckSquare, FiChevronDown, FiChevronUp, FiAlertCircle, FiUser, FiLoader } from 'react-icons/fi'

interface ScoreBreakdown {
  defect_free_pct?: number
  attribute_completeness_pct?: number
  discovery_match_rate?: number
  ae_visibility_score?: number
  qa_confidence_avg?: number
}

interface Recommendation {
  source_agent?: string
  recommendation?: string
  field?: string
  confidence?: number
  needs_human_review?: boolean
  review_reason?: string
}

interface HumanReviewItem {
  source_agent?: string
  recommendation?: string
  field?: string
  confidence?: number
  reason?: string
}

interface QAData {
  asin?: string
  product_title?: string
  ai_readiness_score?: number
  score_breakdown?: ScoreBreakdown
  recommendations?: Recommendation[]
  human_review_queue?: HumanReviewItem[]
  summary?: string
}

interface QADashboardSectionProps {
  data?: QAData
  isLoading?: boolean
}

function confidenceColor(c: number): string {
  if (c >= 80) return '#22C55E'
  if (c >= 70) return '#EAB308'
  return '#EF4444'
}

function confidenceBg(c: number): string {
  if (c >= 80) return '#22C55E'
  if (c >= 70) return '#EAB308'
  return '#EF4444'
}

function confidenceBorder(c: number): string {
  if (c >= 80) return '#BBF7D0'
  if (c >= 70) return '#FEF08A'
  return '#FECACA'
}

function scoreGaugeColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 60) return '#EAB308'
  if (score >= 40) return '#F97316'
  return '#EF4444'
}

const BREAKDOWN_ITEMS: { key: keyof ScoreBreakdown; label: string; weight: string }[] = [
  { key: 'defect_free_pct', label: 'Defect Free', weight: '0.25' },
  { key: 'attribute_completeness_pct', label: 'Attribute Completeness', weight: '0.20' },
  { key: 'discovery_match_rate', label: 'Discovery Match Rate', weight: '0.25' },
  { key: 'ae_visibility_score', label: 'AE Visibility Score', weight: '0.20' },
  { key: 'qa_confidence_avg', label: 'QA Confidence Avg', weight: '0.10' },
]

export default function QADashboardSection({ data, isLoading }: QADashboardSectionProps) {
  const [showRecs, setShowRecs] = useState(true)
  const [showHumanReview, setShowHumanReview] = useState(true)

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: '#64748B' }}>
          <FiLoader className="w-4 h-4 animate-spin" style={{ color: '#2563EB' }} />
          <span>Running QA Auditor -- cross-referencing all agent outputs...</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const score = data?.ai_readiness_score ?? 0
  const breakdown = data?.score_breakdown
  const recommendations = Array.isArray(data?.recommendations) ? data.recommendations : []
  const humanQueue = Array.isArray(data?.human_review_queue) ? data.human_review_queue : []
  const gaugeColor = scoreGaugeColor(score)
  // 64px max diameter ring
  const ringRadius = 26
  const circumference = 2 * Math.PI * ringRadius
  const dashOffset = circumference - (circumference * Math.min(score, 100)) / 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* AI Readiness Score */}
      <div className="rounded-lg" style={{ border: '1px solid #E2E8F0', background: 'white', padding: '16px' }}>
        <div className="flex items-center gap-2 mb-3">
          <FiCheckSquare className="w-4 h-4" style={{ color: '#22C55E' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>QA Auditor -- AI Readiness Score</h3>
        </div>

        <div className="flex items-center gap-6">
          {/* 64px circular progress ring */}
          <div className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth="5" />
              <circle
                cx="32" cy="32" r={ringRadius} fill="none"
                stroke={gaugeColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 32 32)"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: gaugeColor, lineHeight: 1 }}>{score}</span>
            </div>
          </div>

          {/* Score breakdown bars */}
          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BREAKDOWN_ITEMS.map(item => {
              const val = breakdown?.[item.key] ?? 0
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>{item.label} <span className="font-mono" style={{ color: '#94A3B8' }}>({item.weight})</span></span>
                    <span className="font-mono" style={{ fontSize: '11px', fontWeight: 600, color: confidenceColor(val) }}>{val}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: '6px', background: '#E2E8F0' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(val, 100)}%`, background: confidenceBg(val) }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {data?.summary && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
            <p className="leading-relaxed" style={{ fontSize: '13px', color: '#64748B' }}>{data.summary}</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-lg" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
          <button onClick={() => setShowRecs(!showRecs)} className="w-full flex items-center gap-2 rounded-lg transition-colors" style={{ padding: '10px 16px', fontSize: '13px', color: '#1E293B' }}>
            <FiAlertCircle className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />
            <span style={{ fontWeight: 600 }}>Recommendations ({recommendations.length})</span>
            <span className="ml-auto">{showRecs ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}</span>
          </button>
          {showRecs && (
            <div className="max-h-56 overflow-y-auto" style={{ padding: '0 16px 12px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
              {recommendations.map((rec, i) => {
                const conf = rec?.confidence ?? 0
                return (
                  <div key={i} className="rounded-lg p-2.5" style={{ background: '#F8FAFC', border: `1px solid ${confidenceBorder(conf)}` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono rounded px-1.5 py-0.5" style={{ fontSize: '10px', color: '#64748B', background: '#E2E8F0' }}>{rec?.source_agent ?? 'unknown'}</span>
                      {rec?.field && <span className="font-mono rounded px-1.5 py-0.5" style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9' }}>{rec.field}</span>}
                      <span className="font-mono ml-auto" style={{ fontSize: '11px', fontWeight: 600, color: confidenceColor(conf) }}>{conf}%</span>
                      {rec?.needs_human_review && <FiUser className="w-3 h-3" style={{ color: '#F97316' }} title="Needs human review" />}
                    </div>
                    <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{rec?.recommendation ?? ''}</p>
                    {rec?.review_reason && (
                      <p className="mt-1 italic" style={{ fontSize: '11px', color: '#F97316' }}>Review: {rec.review_reason}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Human Review Queue */}
      {humanQueue.length > 0 && (
        <div className="rounded-lg" style={{ border: '1px solid #FED7AA', background: '#FFF7ED' }}>
          <button onClick={() => setShowHumanReview(!showHumanReview)} className="w-full flex items-center gap-2 rounded-lg transition-colors" style={{ padding: '10px 16px', fontSize: '13px', color: '#9A3412' }}>
            <FiUser className="w-3.5 h-3.5" style={{ color: '#F97316' }} />
            <span style={{ fontWeight: 600 }}>Human Review Queue ({humanQueue.length})</span>
            <span className="ml-auto">{showHumanReview ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}</span>
          </button>
          {showHumanReview && (
            <div className="max-h-48 overflow-y-auto" style={{ padding: '0 16px 12px', borderTop: '1px solid #FED7AA', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
              {humanQueue.map((item, i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ border: '1px solid #FED7AA', background: 'white' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono rounded px-1.5 py-0.5" style={{ fontSize: '10px', color: '#F97316', background: '#FFF7ED' }}>{item?.source_agent ?? 'unknown'}</span>
                    {item?.field && <span className="font-mono rounded px-1.5 py-0.5" style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9' }}>{item.field}</span>}
                    <span className="font-mono ml-auto" style={{ fontSize: '11px', fontWeight: 600, color: confidenceColor(item?.confidence ?? 0) }}>{item?.confidence ?? 0}%</span>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: '13px', color: '#1E293B' }}>{item?.recommendation ?? ''}</p>
                  {item?.reason && (
                    <p className="mt-1 italic" style={{ fontSize: '11px', color: '#F97316' }}>Reason: {item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
