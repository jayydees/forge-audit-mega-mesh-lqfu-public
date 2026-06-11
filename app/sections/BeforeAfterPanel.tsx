'use client'

import { FiTrendingUp, FiArrowRight, FiSearch, FiEye, FiTarget, FiLoader, FiZap } from 'react-icons/fi'

interface BeforeAfterPanelProps {
  originalScore: number
  originalDiscoveryRate: number
  originalAeVisibility: number
  originalAeTotal: number
  projectedDiscoveryRate: number | null
  projectedAeVisibility: number | null
  projectedAeTotal: number
  projectedLoading: boolean
}

function deltaColor(delta: number): string {
  if (delta > 0) return 'text-emerald-400'
  if (delta < 0) return 'text-red-400'
  return 'text-gray-400'
}

function deltaBg(delta: number): string {
  if (delta > 0) return 'bg-emerald-950/60 border-emerald-900/50'
  if (delta < 0) return 'bg-red-950/60 border-red-900/50'
  return 'bg-gray-900/60 border-gray-800'
}

function formatDelta(delta: number, suffix: string = 'pp'): string {
  if (delta > 0) return `+${delta}${suffix}`
  if (delta < 0) return `${delta}${suffix}`
  return `0${suffix}`
}

function scoreGrade(score: number): string {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'
  if (score >= 20) return 'D'
  return 'F'
}

function gradeColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export default function BeforeAfterPanel({
  originalScore,
  originalDiscoveryRate,
  originalAeVisibility,
  originalAeTotal,
  projectedDiscoveryRate,
  projectedAeVisibility,
  projectedAeTotal,
  projectedLoading,
}: BeforeAfterPanelProps) {
  const hasProjectedData = projectedDiscoveryRate !== null || projectedAeVisibility !== null

  if (projectedLoading) {
    return (
      <div className="rounded-lg border-2 border-dashed border-emerald-900/50 bg-emerald-950/10 p-6">
        <div className="flex items-center gap-3 justify-center">
          <FiLoader className="w-5 h-5 animate-spin text-emerald-400" />
          <div>
            <p className="text-sm text-emerald-400 font-medium">Running Projected Impact Analysis</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Re-analyzing rewritten content through Discovery + AE Visibility agents...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasProjectedData) return null

  const discoveryDelta = projectedDiscoveryRate !== null ? Math.round(projectedDiscoveryRate - originalDiscoveryRate) : 0
  const aeDelta = projectedAeVisibility !== null ? (projectedAeVisibility - originalAeVisibility) : 0

  // Compute a projected "AI readiness" score boost based on discovery + AE improvements
  const projectedScoreBoost = Math.round((discoveryDelta * 0.4) + (aeDelta * 6))
  const projectedScore = Math.min(100, Math.max(0, originalScore + projectedScoreBoost))
  const scoreDelta = projectedScore - originalScore

  // Summary line
  const totalImprovementPp = Math.round((discoveryDelta + (aeDelta * 10)) / 2)

  return (
    <div className="rounded-lg border-2 border-emerald-800/60 bg-gradient-to-br from-emerald-950/30 via-gray-900/80 to-emerald-950/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-emerald-900/40 bg-emerald-950/30 flex items-center gap-2">
        <FiZap className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Projected Impact of Rewrites</h3>
        <span className="text-[10px] text-gray-500 ml-auto">Before vs After rewrite analysis</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-emerald-900/30">
        {/* AI Readiness Score */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <FiTarget className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">AI Readiness Score</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${gradeColor(originalScore)}`}>{originalScore}</div>
              <div className="text-[9px] text-gray-600 uppercase">Before</div>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${gradeColor(projectedScore)}`}>{projectedScore}</div>
              <div className="text-[9px] text-gray-600 uppercase">Projected</div>
            </div>
            <div className={`ml-auto rounded-full border px-2.5 py-1 text-xs font-bold font-mono ${deltaBg(scoreDelta)} ${deltaColor(scoreDelta)}`}>
              {formatDelta(scoreDelta, 'pts')}
            </div>
          </div>
          {/* Grade badges */}
          <div className="flex items-center gap-2 mt-2 text-[10px]">
            <span className={`font-bold ${gradeColor(originalScore)}`}>Grade {scoreGrade(originalScore)}</span>
            <FiArrowRight className="w-2.5 h-2.5 text-gray-700" />
            <span className={`font-bold ${gradeColor(projectedScore)}`}>Grade {scoreGrade(projectedScore)}</span>
          </div>
        </div>

        {/* Gemini Visibility */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <FiEye className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Gemini Visibility</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold">
                <span className={originalAeVisibility >= 5 ? 'text-emerald-400' : originalAeVisibility >= 3 ? 'text-yellow-400' : 'text-red-400'}>{originalAeVisibility}</span>
                <span className="text-sm text-gray-600">/{originalAeTotal}</span>
              </div>
              <div className="text-[9px] text-gray-600 uppercase">Before</div>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <div className="text-center">
              {projectedAeVisibility !== null ? (
                <>
                  <div className="text-2xl font-mono font-bold">
                    <span className={projectedAeVisibility >= 5 ? 'text-emerald-400' : projectedAeVisibility >= 3 ? 'text-yellow-400' : 'text-red-400'}>{projectedAeVisibility}</span>
                    <span className="text-sm text-gray-600">/{projectedAeTotal}</span>
                  </div>
                  <div className="text-[9px] text-gray-600 uppercase">Projected</div>
                </>
              ) : (
                <div className="text-sm text-gray-600">N/A</div>
              )}
            </div>
            {projectedAeVisibility !== null && (
              <div className={`ml-auto rounded-full border px-2.5 py-1 text-xs font-bold font-mono ${deltaBg(aeDelta)} ${deltaColor(aeDelta)}`}>
                {formatDelta(aeDelta, '')}
              </div>
            )}
          </div>
        </div>

        {/* Discovery Match Rate */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <FiSearch className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Discovery Match Rate</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${originalDiscoveryRate >= 70 ? 'text-emerald-400' : originalDiscoveryRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {originalDiscoveryRate}%
              </div>
              <div className="text-[9px] text-gray-600 uppercase">Before</div>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <div className="text-center">
              {projectedDiscoveryRate !== null ? (
                <>
                  <div className={`text-2xl font-mono font-bold ${projectedDiscoveryRate >= 70 ? 'text-emerald-400' : projectedDiscoveryRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {Math.round(projectedDiscoveryRate)}%
                  </div>
                  <div className="text-[9px] text-gray-600 uppercase">Projected</div>
                </>
              ) : (
                <div className="text-sm text-gray-600">N/A</div>
              )}
            </div>
            {projectedDiscoveryRate !== null && (
              <div className={`ml-auto rounded-full border px-2.5 py-1 text-xs font-bold font-mono ${deltaBg(discoveryDelta)} ${deltaColor(discoveryDelta)}`}>
                {formatDelta(discoveryDelta, 'pp')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Line */}
      <div className="px-4 py-3 border-t border-emerald-900/40 bg-emerald-950/20">
        <div className="flex items-center gap-2">
          <FiTrendingUp className="w-4 h-4 text-emerald-400" />
          <p className="text-sm text-gray-300">
            Implementing these changes could improve your AI visibility by{' '}
            <span className={`font-bold font-mono ${deltaColor(totalImprovementPp)}`}>
              {formatDelta(totalImprovementPp, 'pp')}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
