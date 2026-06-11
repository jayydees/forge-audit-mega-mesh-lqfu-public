'use client'

import { useRef, useState } from 'react'
import { FiLoader, FiAlertTriangle, FiUpload, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi'
import { BiAnalyse } from 'react-icons/bi'

interface InputPanelProps {
  urls: string
  onUrlsChange: (urls: string) => void
  onSubmit: () => void
  onDemo: () => void
  loading: boolean
  statusMessages: string[]
  error: string
  onCsvUpload: (asins: string[]) => void
  collapsed: boolean
  onToggleCollapse: () => void
  totalAudited: number
  onClearSession: () => void
}

function parseCsvForAsins(text: string): string[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []
  const delimiter = lines[0].includes('\t') ? '\t' : ','
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''))
  const asinColIndex = headers.findIndex(h => /^asin[s]?$/i.test(h.trim()))
  if (asinColIndex >= 0) {
    return lines.slice(1).map(l => {
      const cells = l.split(delimiter)
      return (cells[asinColIndex] || '').trim().replace(/^["']|["']$/g, '')
    }).filter(v => /^[A-Z0-9]{10}$/i.test(v))
  }
  const colCount = headers.length
  for (let col = 0; col < colCount; col++) {
    const values = lines.slice(1).map(l => {
      const cells = l.split(delimiter)
      return (cells[col] || '').trim().replace(/^["']|["']$/g, '')
    })
    const asinValues = values.filter(v => /^[A-Z0-9]{10}$/i.test(v))
    if (asinValues.length > 0) return asinValues
  }
  return []
}

export default function InputPanel({ urls, onUrlsChange, onSubmit, onDemo, loading, statusMessages, error, onCsvUpload, collapsed, onToggleCollapse, totalAudited, onClearSession }: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputExpanded, setInputExpanded] = useState(false)
  const urlLines = urls.split('\n').filter(l => l.trim())
  const hasAsin = (s: string) => /\bB0[A-Z0-9]{8}\b/i.test(s.trim()) || /^[A-Z0-9]{10}$/i.test(s.trim())
  const validCount = urlLines.filter(l => hasAsin(l)).length
  const invalidCount = urlLines.filter(l => l.trim() && !hasAsin(l)).length

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      if (!text) return
      const asins = parseCsvForAsins(text)
      if (asins.length > 0) onCsvUpload(asins)
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Collapsed strip after audit
  if (collapsed && totalAudited > 0 && !loading) {
    const firstScore = totalAudited > 0 ? '' : ''
    return (
      <div
        className="sticky top-0 z-20 flex items-center justify-between cursor-pointer"
        onClick={onToggleCollapse}
        style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '6px 24px', maxHeight: '36px' }}
      >
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', fontFamily: 'Inter, system-ui, sans-serif' }}>
          {totalAudited} SKU{totalAudited !== 1 ? 's' : ''} audited
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse() }}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors"
            style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', background: 'white', border: '1px solid #D1D5DB' }}
          >
            <FiChevronDown className="w-3 h-3" />
            Expand
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClearSession(); onToggleCollapse() }}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors"
            style={{ fontSize: '11px', fontWeight: 500, color: '#2563EB', background: 'white', border: '1px solid #D1D5DB' }}
          >
            <FiPlus className="w-3 h-3" />
            New Audit
          </button>
        </div>
      </div>
    )
  }

  const truncatedUrl = urls.length > 80 ? urls.slice(0, 80) + '...' : urls.replace(/\n/g, ', ')

  return (
    <div style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', padding: '12px 24px' }}>
      {/* Collapse button when results exist */}
      {totalAudited > 0 && !loading && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-1 transition-colors"
            style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}
          >
            <FiChevronUp className="w-3 h-3" />
            Collapse
          </button>
        </div>
      )}

      {!inputExpanded ? (
        /* Collapsed single-line input bar, max 56px */
        <div
          className="flex items-center gap-3 cursor-text"
          onClick={() => setInputExpanded(true)}
          style={{ maxHeight: '56px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="truncate" style={{ fontSize: '13px', fontWeight: 400, color: urls ? '#1E293B' : '#94A3B8', fontFamily: 'monospace' }}>
              {urls ? truncatedUrl : 'Paste Amazon URLs or ASINs...'}
            </span>
            {urls && (
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>({urls.length} chars)</span>
            )}
            {validCount > 0 && (
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 500, color: '#22C55E', background: '#F0FDF4' }}>{validCount} valid</span>
            )}
            {invalidCount > 0 && (
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 500, color: '#EF4444', background: '#FEF2F2' }}>{invalidCount} invalid</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onSubmit() }}
              disabled={loading || validCount === 0}
              className="flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              style={{ background: '#2563EB', color: 'white', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {loading ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <BiAnalyse className="w-3.5 h-3.5" />}
              {loading ? 'Auditing...' : 'Audit Listings'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDemo() }}
              disabled={loading}
              className="flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Try Demo
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
              disabled={loading}
              className="flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <FiUpload className="w-3.5 h-3.5" />
              Upload CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      ) : (
        /* Expanded input */
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, system-ui, sans-serif' }}>Product URLs or ASINs</label>
              {validCount > 0 && (
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 500, color: '#22C55E', background: '#F0FDF4' }}>{validCount} valid</span>
              )}
              {invalidCount > 0 && (
                <span className="rounded-full px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 500, color: '#EF4444', background: '#FEF2F2' }}>{invalidCount} invalid</span>
              )}
            </div>
            <button
              onClick={() => setInputExpanded(false)}
              className="transition-colors"
              style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}
            >
              <FiChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={urls}
            onChange={(e) => onUrlsChange(e.target.value)}
            placeholder={"Paste Amazon URLs (one per line, max 5)\nhttps://www.amazon.in/dp/B0GM8111XD"}
            className="w-full outline-none resize-none"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: 400, color: '#1E293B', padding: '10px 12px', fontFamily: 'monospace' }}
            rows={3}
            disabled={loading}
            autoFocus
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={onSubmit}
              disabled={loading || validCount === 0}
              className="flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              style={{ background: '#2563EB', color: 'white', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {loading ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <BiAnalyse className="w-3.5 h-3.5" />}
              {loading ? 'Auditing...' : 'Audit Listings'}
            </button>
            <button
              onClick={onDemo}
              disabled={loading}
              className="flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Try Demo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              style={{ background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              <FiUpload className="w-3.5 h-3.5" />
              Upload CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2" style={{ fontSize: '13px', color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '8px 12px' }}>
          <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading && statusMessages.length > 0 && (
        <div className="mt-2 max-h-20 overflow-y-auto" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '6px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          {statusMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: '#94A3B8' }}>[{String(i + 1).padStart(2, '0')}]</span>
              {i === statusMessages.length - 1 && <FiLoader className="w-2.5 h-2.5 animate-spin flex-shrink-0" style={{ color: '#2563EB' }} />}
              <span style={{ color: i === statusMessages.length - 1 ? '#2563EB' : '#64748B' }}>{msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
