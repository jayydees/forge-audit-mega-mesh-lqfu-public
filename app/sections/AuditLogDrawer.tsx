'use client'

import { useState, useMemo } from 'react'
import { FiChevronUp, FiChevronDown, FiClock, FiFilter } from 'react-icons/fi'

interface AuditLogEntry {
  timestamp?: string
  agent?: string
  action_type?: string
  field?: string
  detail?: string
  asin?: string
}

interface AuditLogDrawerProps {
  auditLogs: AuditLogEntry[]
  isOpen: boolean
  onToggle: () => void
}

const AGENT_ROW_COLORS: Record<string, string> = {
  'defect hunter': 'border-l-red-500',
  'discovery': 'border-l-blue-500',
  'ae visibility': 'border-l-purple-500',
  'competitor gap': 'border-l-orange-500',
  'rewrite': 'border-l-green-500',
  'qa auditor': 'border-l-emerald-500',
}

function getRowBorderColor(agent?: string): string {
  if (!agent) return 'border-l-gray-700'
  const lower = agent.toLowerCase()
  for (const [key, cls] of Object.entries(AGENT_ROW_COLORS)) {
    if (lower.includes(key)) return cls
  }
  return 'border-l-gray-700'
}

export default function AuditLogDrawer({ auditLogs, isOpen, onToggle }: AuditLogDrawerProps) {
  const [filterAgent, setFilterAgent] = useState('all')
  const [filterAction, setFilterAction] = useState('all')
  const [filterAsin, setFilterAsin] = useState('all')
  const [searchText, setSearchText] = useState('')

  const logs = Array.isArray(auditLogs) ? auditLogs : []

  const uniqueAgents = useMemo(() => {
    const set = new Set<string>()
    logs.forEach(l => { if (l?.agent) set.add(l.agent) })
    return Array.from(set).sort()
  }, [logs])

  const uniqueActions = useMemo(() => {
    const set = new Set<string>()
    logs.forEach(l => { if (l?.action_type) set.add(l.action_type) })
    return Array.from(set).sort()
  }, [logs])

  const uniqueAsins = useMemo(() => {
    const set = new Set<string>()
    logs.forEach(l => { if (l?.asin) set.add(l.asin) })
    return Array.from(set).sort()
  }, [logs])

  const filteredLogs = useMemo(() => {
    let result = [...logs]

    if (filterAgent !== 'all') {
      result = result.filter(l => l?.agent === filterAgent)
    }
    if (filterAction !== 'all') {
      result = result.filter(l => l?.action_type === filterAction)
    }
    if (filterAsin !== 'all') {
      result = result.filter(l => l?.asin === filterAsin)
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(l =>
        (l?.detail ?? '').toLowerCase().includes(q) ||
        (l?.field ?? '').toLowerCase().includes(q) ||
        (l?.agent ?? '').toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      const ta = a?.timestamp ?? ''
      const tb = b?.timestamp ?? ''
      return tb.localeCompare(ta)
    })

    return result
  }, [logs, filterAgent, filterAction, filterAsin, searchText])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Toggle bar */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 px-4 py-1.5 bg-gray-900 border-t border-gray-800 hover:bg-gray-800/80 transition-colors text-xs text-gray-400"
      >
        <FiClock className="w-3 h-3" />
        <span>Audit Log ({logs.length} entries)</span>
        {isOpen ? <FiChevronDown className="w-3 h-3" /> : <FiChevronUp className="w-3 h-3" />}
      </button>

      {/* Drawer panel */}
      {isOpen && (
        <div className="bg-gray-950 border-t border-gray-800 max-h-[40vh] flex flex-col">
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 flex-wrap">
            <FiFilter className="w-3 h-3 text-gray-500" />

            <input
              type="text"
              placeholder="Search logs..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 w-40 focus:outline-none focus:border-gray-600 placeholder-gray-600"
            />

            <select
              value={filterAgent}
              onChange={e => setFilterAgent(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option value="all">All Agents</option>
              {uniqueAgents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            {uniqueAsins.length > 1 && (
              <select
                value={filterAsin}
                onChange={e => setFilterAsin(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-gray-600"
              >
                <option value="all">All ASINs</option>
                {uniqueAsins.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}

            <span className="text-[10px] text-gray-600 ml-auto">{filteredLogs.length} / {logs.length}</span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 bg-gray-900">
                <tr className="text-gray-500 text-[9px] uppercase tracking-wider">
                  <th className="text-left px-3 py-1 font-medium w-36">Timestamp</th>
                  <th className="text-left px-2 py-1 font-medium w-32">Agent</th>
                  <th className="text-left px-2 py-1 font-medium w-28">Action</th>
                  <th className="text-left px-2 py-1 font-medium w-24">Field</th>
                  <th className="text-left px-2 py-1 font-medium">Detail</th>
                  <th className="text-left px-2 py-1 font-medium w-24">ASIN</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-600 text-xs">No log entries match filters</td>
                  </tr>
                ) : (
                  filteredLogs.map((entry, i) => (
                    <tr key={i} className={`border-b border-gray-900/50 hover:bg-gray-900/40 border-l-2 ${getRowBorderColor(entry?.agent)}`}>
                      <td className="px-3 py-1 font-mono text-gray-500 whitespace-nowrap">{entry?.timestamp ?? '--'}</td>
                      <td className="px-2 py-1 text-gray-300">{entry?.agent ?? '--'}</td>
                      <td className="px-2 py-1">
                        <span className="bg-gray-800 text-gray-400 rounded px-1.5 py-0.5 text-[10px] font-mono">{entry?.action_type ?? '--'}</span>
                      </td>
                      <td className="px-2 py-1 font-mono text-gray-500">{entry?.field ?? '--'}</td>
                      <td className="px-2 py-1 text-gray-400 truncate max-w-xs">{entry?.detail ?? '--'}</td>
                      <td className="px-2 py-1 font-mono text-gray-500">{entry?.asin ?? '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
