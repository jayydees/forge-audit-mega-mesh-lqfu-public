'use client'

import { FiShield, FiSearch, FiEye, FiTrendingUp, FiEdit, FiCheckSquare, FiCheck } from 'react-icons/fi'

interface Conflict {
  id?: string
  agent_a?: string
  agent_b?: string
  agent_a_position?: string
  agent_b_position?: string
  agent_a_reasoning?: string
  agent_b_reasoning?: string
  agent_a_confidence?: number
  agent_b_confidence?: number
  field?: string
  severity?: string
  resolution_suggestion?: string
}

interface DebateCardsProps {
  conflicts?: Conflict[]
  resolutions?: Record<string, string>
  onResolve?: (conflictId: string, chosenAgent: string) => void
}

const AGENT_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Defect Hunter': { icon: <FiShield className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-950/40 border-red-900/50' },
  'Discovery Agent': { icon: <FiSearch className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-900/50' },
  'AE Visibility Agent': { icon: <FiEye className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-900/50' },
  'Competitor Gap Agent': { icon: <FiTrendingUp className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-900/50' },
  'Rewrite Agent': { icon: <FiEdit className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-950/40 border-green-900/50' },
  'QA Auditor': { icon: <FiCheckSquare className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-900/50' },
}

function getAgentStyle(name?: string) {
  if (!name) return { icon: <FiCheckSquare className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700' }
  for (const [key, val] of Object.entries(AGENT_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase().split(' ')[0].toLowerCase())) return val
  }
  return AGENT_ICONS['QA Auditor']
}

function severityBadgeColor(severity?: string): string {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return 'bg-red-950 text-red-400 border-red-800'
  if (s === 'high') return 'bg-orange-950 text-orange-400 border-orange-800'
  if (s === 'medium') return 'bg-yellow-950 text-yellow-400 border-yellow-800'
  return 'bg-gray-800 text-gray-400 border-gray-700'
}

function confidenceBarColor(c: number): string {
  if (c >= 80) return 'bg-emerald-500'
  if (c >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

function confidenceTextColor(c: number): string {
  if (c >= 80) return 'text-emerald-400'
  if (c >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

export default function DebateCards({ conflicts, resolutions, onResolve }: DebateCardsProps) {
  const items = Array.isArray(conflicts) ? conflicts : []
  const resolved = resolutions ?? {}

  if (items.length === 0) {
    return (
      <div className="border border-gray-800 rounded bg-gray-900/50 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>No agent disagreements detected -- all agents are aligned.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Agent Disagreements</span>
        <span className="text-[10px] font-mono bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded">{items.length}</span>
      </div>

      {items.map((conflict, idx) => {
        const id = conflict?.id ?? `conflict-${idx}`
        const agentAStyle = getAgentStyle(conflict?.agent_a)
        const agentBStyle = getAgentStyle(conflict?.agent_b)
        const isResolved = resolved[id] != null
        const resolvedAgent = resolved[id]
        const confA = conflict?.agent_a_confidence ?? 0
        const confB = conflict?.agent_b_confidence ?? 0

        return (
          <div key={id} className="rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-900/20 via-gray-900 to-blue-900/20 relative overflow-hidden" style={{ borderImage: 'linear-gradient(135deg, #7c3aed33, #3b82f633) 1' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/60">
              <div className="flex items-center gap-2">
                {conflict?.field && (
                  <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{conflict.field}</span>
                )}
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${severityBadgeColor(conflict?.severity)}`}>
                  {conflict?.severity ?? 'unknown'}
                </span>
              </div>
              {isResolved && (
                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1">
                  <FiCheck className="w-3 h-3" /> Resolved: {resolvedAgent}
                </span>
              )}
            </div>

            {/* Split panel */}
            <div className="grid grid-cols-2 divide-x divide-gray-800/60">
              {/* Agent A */}
              <div className={`p-3 space-y-2 ${isResolved && resolvedAgent !== conflict?.agent_a ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={agentAStyle.color}>{agentAStyle.icon}</span>
                  <span className="text-xs font-medium text-gray-200">{conflict?.agent_a ?? 'Agent A'}</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Position</p>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{conflict?.agent_a_position ?? '--'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Reasoning</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{conflict?.agent_a_reasoning ?? '--'}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-gray-500">Confidence</span>
                    <span className={`font-mono font-medium ${confidenceTextColor(confA)}`}>{confA}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${confidenceBarColor(confA)}`} style={{ width: `${Math.min(confA, 100)}%` }} />
                  </div>
                </div>
                {!isResolved && onResolve && (
                  <button
                    onClick={() => onResolve(id, conflict?.agent_a ?? 'Agent A')}
                    className="w-full text-[10px] py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors font-medium"
                  >
                    Follow {conflict?.agent_a ?? 'Agent A'}
                  </button>
                )}
              </div>

              {/* Agent B */}
              <div className={`p-3 space-y-2 ${isResolved && resolvedAgent !== conflict?.agent_b ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={agentBStyle.color}>{agentBStyle.icon}</span>
                  <span className="text-xs font-medium text-gray-200">{conflict?.agent_b ?? 'Agent B'}</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Position</p>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{conflict?.agent_b_position ?? '--'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Reasoning</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{conflict?.agent_b_reasoning ?? '--'}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-gray-500">Confidence</span>
                    <span className={`font-mono font-medium ${confidenceTextColor(confB)}`}>{confB}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${confidenceBarColor(confB)}`} style={{ width: `${Math.min(confB, 100)}%` }} />
                  </div>
                </div>
                {!isResolved && onResolve && (
                  <button
                    onClick={() => onResolve(id, conflict?.agent_b ?? 'Agent B')}
                    className="w-full text-[10px] py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors font-medium"
                  >
                    Follow {conflict?.agent_b ?? 'Agent B'}
                  </button>
                )}
              </div>
            </div>

            {/* Resolution suggestion */}
            {conflict?.resolution_suggestion && (
              <div className="px-4 py-2 border-t border-gray-800/60 bg-gray-950/30">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">QA Auditor Suggestion</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{conflict.resolution_suggestion}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
