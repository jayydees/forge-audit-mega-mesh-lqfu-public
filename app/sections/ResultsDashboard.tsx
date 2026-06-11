'use client'

import { FiDownload, FiChevronDown, FiStar, FiFlag } from 'react-icons/fi'
import { HiOutlineShieldCheck } from 'react-icons/hi2'
import ComparisonView from './ComparisonView'

interface AuditResult {
  asin: string
  product_title: string
  overall_score: number
  total_defects: number
  critical_defects: number
  major_defects: number
  minor_defects: number
  thumbnail?: string
  summary: string
  defects?: any[]
}

interface ProductData {
  asin: string
  title?: string
  thumbnailImage?: string
  price?: { value?: number; currency?: string }
  stars?: number
  reviewsCount?: number
  brand?: string
  features?: string[]
  highResolutionImages?: string[]
  attributes?: { key?: string; value?: string }[]
  aPlusContent?: any
}

interface ResultsDashboardProps {
  results: AuditResult[]
  productDataMap: Record<string, ProductData>
  selectedAsin: string | null
  onSelectAsin: (asin: string | null) => void
  onExportCsv: () => void
  competitorMarks?: Record<string, boolean>
  primaryAsin?: string | null
  onToggleCompetitor?: (asin: string) => void
  onSetPrimary?: (asin: string | null) => void
  discoveryResults?: Record<string, any>
  aeVisibilityData?: Record<string, any>
  competitorGapData?: Record<string, any>
}

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

function getTopRecommendation(result: AuditResult): string {
  const defects = Array.isArray(result?.defects) ? result.defects : []
  const critical = defects.find((d: any) => d?.severity?.toLowerCase() === 'critical')
  if (critical?.recommendation) return critical.recommendation
  const major = defects.find((d: any) => d?.severity?.toLowerCase() === 'major')
  if (major?.recommendation) return major.recommendation
  if (defects[0]?.recommendation) return defects[0].recommendation
  return result?.summary ? result.summary.slice(0, 80) + '...' : 'No issues found'
}

export default function ResultsDashboard({ results, productDataMap, selectedAsin, onSelectAsin, onExportCsv, competitorMarks, primaryAsin, onToggleCompetitor, onSetPrimary, discoveryResults, aeVisibilityData, competitorGapData }: ResultsDashboardProps) {
  const marks = competitorMarks ?? {}
  const markedCompetitorAsins = Object.keys(marks).filter(a => marks[a] && a !== primaryAsin)

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
            <HiOutlineShieldCheck className="w-8 h-8" style={{ color: '#CBD5E1' }} />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', fontFamily: 'Inter, system-ui, sans-serif' }}>No audit results yet</p>
          <p className="mt-1" style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', fontFamily: 'Inter, system-ui, sans-serif' }}>Paste Amazon URLs above or try the demo to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Summary Bar */}
      <div className="flex items-center justify-between" style={{ padding: '12px 24px', borderBottom: '1px solid #E2E8F0', background: 'white' }}>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>SKUs</span>
            <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{results.length}</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Avg Score</span>
            {(() => {
              const avg = Math.round(results.reduce((s, r) => s + (r?.overall_score ?? 0), 0) / results.length)
              const grade = getLetterGrade(avg)
              return (
                <div className="flex items-center gap-1">
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: getScoreColor(avg) }}>{avg}</span>
                  <span className="rounded px-1.5 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: grade.color, background: grade.bg }}>{grade.letter}</span>
                </div>
              )
            })()}
          </div>
          <div style={{ width: '1px', height: '16px', background: '#E2E8F0' }} />
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>Total Defects</span>
            <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{results.reduce((s, r) => s + (r?.total_defects ?? 0), 0)}</span>
          </div>
        </div>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 transition-colors"
          style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <FiDownload className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-y-auto" style={{ background: 'white' }}>
        <table className="w-full" style={{ fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <thead className="sticky top-0 z-10" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th className="text-left px-5 font-semibold w-10 uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 20px', height: '48px' }}></th>
              <th className="text-left font-semibold w-28 uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>ASIN</th>
              <th className="text-left font-semibold uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>Title</th>
              <th className="text-center font-semibold w-24 uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>Score</th>
              <th className="text-center font-semibold w-24 uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>Defects</th>
              <th className="text-left font-semibold hidden lg:table-cell uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>Top Recommendation</th>
              {results.length > 1 && <th className="text-center font-semibold w-20 uppercase tracking-wide" style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', padding: '12px 12px' }}>Compare</th>}
              <th className="text-right px-5 font-semibold w-8" style={{ padding: '12px 20px' }}></th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => {
              const pd = productDataMap[r?.asin] ?? {}
              const isSelected = selectedAsin === r?.asin
              const isPrimary = primaryAsin === r?.asin
              const isMarkedCompetitor = marks[r?.asin] === true && !isPrimary
              const grade = getLetterGrade(r?.overall_score ?? 0)
              const topRec = getTopRecommendation(r)
              const rowBg = idx % 2 === 0 ? 'white' : '#F8FAFC'

              return (
                <tr
                  key={r?.asin ?? Math.random()}
                  onClick={() => onSelectAsin(isSelected ? null : r?.asin)}
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    height: '48px',
                    background: isSelected ? '#EFF6FF' : rowBg,
                    borderBottom: '1px solid #F1F5F9',
                    borderLeft: isPrimary ? '3px solid #22C55E' : isMarkedCompetitor ? '3px solid #F97316' : isSelected ? '3px solid #2563EB' : '3px solid transparent',
                  }}
                >
                  <td style={{ padding: '0 20px' }}>
                    {(pd as any)?.thumbnailImage ? (
                      <img src={(pd as any).thumbnailImage} alt="" className="rounded object-cover" style={{ width: '32px', height: '32px', background: '#F1F5F9' }} />
                    ) : (
                      <div className="rounded" style={{ width: '32px', height: '32px', background: '#F1F5F9' }} />
                    )}
                  </td>
                  <td className="font-mono" style={{ padding: '0 12px', fontSize: '12px', fontWeight: 500, color: '#1E293B' }}>{r?.asin ?? '-'}</td>
                  <td className="truncate max-w-[280px]" style={{ padding: '0 12px', fontSize: '13px', fontWeight: 400, color: '#64748B' }}>{r?.product_title ?? '-'}</td>
                  <td className="text-center" style={{ padding: '0 12px' }}>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: getScoreColor(r?.overall_score ?? 0) }}>{r?.overall_score ?? '-'}</span>
                      <span className="rounded px-1.5 py-0.5" style={{ fontSize: '10px', fontWeight: 700, color: grade.color, background: grade.bg }}>{grade.letter}</span>
                    </div>
                  </td>
                  <td className="text-center" style={{ padding: '0 12px' }}>
                    <div className="flex items-center justify-center gap-1">
                      {(r?.critical_defects ?? 0) > 0 && (
                        <span className="rounded px-1.5 py-0.5" style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', background: '#FEF2F2' }}>{r.critical_defects}C</span>
                      )}
                      {(r?.major_defects ?? 0) > 0 && (
                        <span className="rounded px-1.5 py-0.5" style={{ fontSize: '14px', fontWeight: 700, color: '#F97316', background: '#FFF7ED' }}>{r.major_defects}M</span>
                      )}
                      {(r?.minor_defects ?? 0) > 0 && (
                        <span className="rounded px-1.5 py-0.5" style={{ fontSize: '14px', fontWeight: 700, color: '#EAB308', background: '#FEFCE8' }}>{r.minor_defects}m</span>
                      )}
                      {(r?.total_defects ?? 0) === 0 && <span style={{ fontSize: '13px', fontWeight: 500, color: '#22C55E' }}>Clean</span>}
                    </div>
                  </td>
                  <td className="truncate max-w-[240px] hidden lg:table-cell" style={{ padding: '0 12px', fontSize: '13px', fontWeight: 400, color: '#64748B' }}>{topRec}</td>
                  {results.length > 1 && (
                    <td className="text-center" style={{ padding: '0 12px' }} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSetPrimary?.(isPrimary ? null : r?.asin) }}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ background: isPrimary ? '#F0FDF4' : 'transparent', color: isPrimary ? '#22C55E' : '#94A3B8' }}
                          title={isPrimary ? 'Remove as primary' : 'Set as primary'}
                        >
                          <FiStar className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if (!isPrimary) onToggleCompetitor?.(r?.asin) }}
                          disabled={isPrimary}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ background: isMarkedCompetitor ? '#FFF7ED' : 'transparent', color: isMarkedCompetitor ? '#F97316' : isPrimary ? '#E2E8F0' : '#94A3B8', cursor: isPrimary ? 'not-allowed' : 'pointer' }}
                          title={isPrimary ? 'Primary cannot be competitor' : isMarkedCompetitor ? 'Unmark as competitor' : 'Mark as competitor'}
                        >
                          <FiFlag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="text-right" style={{ padding: '0 20px', color: '#94A3B8' }}>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Comparison View */}
      {primaryAsin && markedCompetitorAsins.length > 0 && (
        <ComparisonView
          primaryAsin={primaryAsin}
          competitorAsins={markedCompetitorAsins}
          results={results}
          discoveryResults={discoveryResults ?? {}}
          aeVisibilityData={aeVisibilityData ?? {}}
          competitorGapData={competitorGapData ?? {}}
        />
      )}
    </div>
  )
}
