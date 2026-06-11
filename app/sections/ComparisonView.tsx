'use client'

import { FiTarget, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi'

interface ComparisonViewProps {
  primaryAsin: string
  competitorAsins: string[]
  results: any[]
  discoveryResults: Record<string, any>
  aeVisibilityData: Record<string, any>
  competitorGapData: Record<string, any>
}

function scoreColor(score: number): string {
  if (score < 40) return 'text-red-400'
  if (score < 70) return 'text-yellow-400'
  return 'text-emerald-400'
}

function scoreBgClass(score: number): string {
  if (score < 40) return 'bg-red-500'
  if (score < 70) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

export default function ComparisonView({ primaryAsin, competitorAsins, results, discoveryResults, aeVisibilityData, competitorGapData }: ComparisonViewProps) {
  if (!primaryAsin || competitorAsins.length === 0) return null

  const allAsins = [primaryAsin, ...competitorAsins]
  const resultMap: Record<string, any> = {}
  if (Array.isArray(results)) {
    results.forEach(r => {
      if (r?.asin) resultMap[r.asin] = r
    })
  }

  // Gather competitor gap info for what competitors have that primary doesn't
  const primaryGap = competitorGapData[primaryAsin]
  const primaryAttrGaps = Array.isArray(primaryGap?.attribute_gaps) ? primaryGap.attribute_gaps : []
  const primaryBulletGaps = Array.isArray(primaryGap?.bullet_gaps) ? primaryGap.bullet_gaps : []
  const primaryKeywordGaps = Array.isArray(primaryGap?.title_keyword_gaps) ? primaryGap.title_keyword_gaps : []

  return (
    <div className="border-t border-orange-900/30 bg-gray-900/60 px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <FiTarget className="w-4 h-4 text-orange-400" />
        <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Competitor Comparison</h3>
        <span className="text-[10px] text-gray-500">Primary vs {competitorAsins.length} competitor(s)</span>
      </div>

      {/* Side-by-side scores */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(allAsins.length, 4)}, 1fr)` }}>
        {allAsins.slice(0, 4).map((asin) => {
          const r = resultMap[asin]
          const isPrimary = asin === primaryAsin
          const score = r?.overall_score ?? 0
          const disc = discoveryResults[asin]
          const ae = aeVisibilityData[asin]
          const cg = competitorGapData[asin]

          return (
            <div key={asin} className={`border rounded p-2 ${isPrimary ? 'border-emerald-800 bg-emerald-950/20' : 'border-gray-800 bg-gray-950/50'}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-mono text-gray-400">{asin}</span>
                {isPrimary && <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/50 rounded px-1 py-0.5">PRIMARY</span>}
              </div>
              <p className="text-[10px] text-gray-500 truncate mb-2">{r?.product_title ?? '—'}</p>

              {/* Score bar */}
              <div className="mb-1.5">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-gray-600">AI Readiness</span>
                  <span className={`font-mono font-bold ${scoreColor(score)}`}>{score}/100</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBgClass(score)}`} style={{ width: `${Math.min(score, 100)}%` }} />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">Defects</span>
                  <span className="text-gray-300 font-mono">{r?.total_defects ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical</span>
                  <span className={`font-mono ${(r?.critical_defects ?? 0) > 0 ? 'text-red-400' : 'text-gray-500'}`}>{r?.critical_defects ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discovery</span>
                  <span className="text-gray-300 font-mono">{disc?.discovery_match_rate != null ? `${disc.discovery_match_rate}%` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AE Visibility</span>
                  <span className="text-gray-300 font-mono">{ae?.summary?.appeared_count != null ? `${ae.summary.appeared_count}/${ae.summary.total_queries ?? 10}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comp Gaps</span>
                  <span className="text-orange-400 font-mono">{cg?.total_gaps ?? '—'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* What competitors have that primary doesn't */}
      {(primaryAttrGaps.length > 0 || primaryBulletGaps.length > 0 || primaryKeywordGaps.length > 0) && (
        <div className="mt-3 border border-orange-900/30 rounded bg-orange-950/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <h4 className="text-[11px] font-bold text-orange-300 uppercase tracking-wider">What Competitors Have That You Don&apos;t</h4>
          </div>

          {primaryAttrGaps.length > 0 && (
            <div className="mb-2">
              <h5 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Attribute Gaps ({primaryAttrGaps.length})</h5>
              <div className="flex flex-wrap gap-1.5">
                {primaryAttrGaps.slice(0, 8).map((g: any, i: number) => (
                  <span key={i} className="text-[10px] bg-red-950/50 text-red-400 border border-red-900/30 rounded px-1.5 py-0.5">
                    {g?.attribute ?? '—'} <span className="text-red-500/60">({g?.gap_type ?? 'gap'})</span>
                  </span>
                ))}
                {primaryAttrGaps.length > 8 && <span className="text-[10px] text-gray-600">+{primaryAttrGaps.length - 8} more</span>}
              </div>
            </div>
          )}

          {primaryBulletGaps.length > 0 && (
            <div className="mb-2">
              <h5 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Bullet Gaps ({primaryBulletGaps.length})</h5>
              <div className="flex flex-wrap gap-1.5">
                {primaryBulletGaps.slice(0, 6).map((g: any, i: number) => (
                  <span key={i} className="text-[10px] bg-amber-950/50 text-amber-400 border border-amber-900/30 rounded px-1.5 py-0.5">
                    {g?.topic ?? '—'}
                  </span>
                ))}
                {primaryBulletGaps.length > 6 && <span className="text-[10px] text-gray-600">+{primaryBulletGaps.length - 6} more</span>}
              </div>
            </div>
          )}

          {primaryKeywordGaps.length > 0 && (
            <div>
              <h5 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Missing Keywords ({primaryKeywordGaps.length})</h5>
              <div className="flex flex-wrap gap-1.5">
                {primaryKeywordGaps.slice(0, 8).map((g: any, i: number) => (
                  <span key={i} className="text-[10px] bg-cyan-950/50 text-cyan-400 border border-cyan-900/30 rounded px-1.5 py-0.5 font-mono">
                    {g?.keyword ?? '—'}
                  </span>
                ))}
                {primaryKeywordGaps.length > 8 && <span className="text-[10px] text-gray-600">+{primaryKeywordGaps.length - 8} more</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
