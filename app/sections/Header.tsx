'use client'

import { FiHelpCircle } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  totalAudited: number
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onClearSession: () => void
}

export default function Header({ totalAudited, theme, onToggleTheme, onClearSession }: HeaderProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (howItWorksRef.current && !howItWorksRef.current.contains(e.target as Node)) {
        setShowHowItWorks(false)
      }
    }
    if (showHowItWorks) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showHowItWorks])

  return (
    <header className="px-6 py-2.5 flex items-center justify-between" style={{ background: '#0F172A' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: '#2563EB' }}>D</div>
        <div>
          <h1 className="font-bold text-white tracking-tight leading-none" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '20px', fontWeight: 700 }}>Data Quality Sentinel</h1>
          <p className="leading-none mt-0.5 uppercase tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fontWeight: 500, color: '#94A3B8' }}>Answer Engine Optimization for ecommerce listings</p>
        </div>
        <div className="relative" ref={howItWorksRef}>
          <button
            onClick={() => setShowHowItWorks(prev => !prev)}
            className="flex items-center gap-1 hover:opacity-80 rounded-lg px-2.5 py-1.5 transition-colors"
            style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <FiHelpCircle className="w-3.5 h-3.5" />
            How it works
          </button>
          {showHowItWorks && (
            <div className="absolute top-full left-0 mt-1.5 w-80 rounded-lg shadow-lg z-50 p-4 space-y-2.5" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
              <h3 className="uppercase tracking-wider mb-2" style={{ fontSize: '11px', fontWeight: 600, color: '#1E293B' }}>Agent Pipeline</h3>
              {[
                { name: 'Defect Hunter', desc: 'Scans listings for compliance violations, missing attributes, and suppression risks.' },
                { name: 'Discovery Agent', desc: 'Simulates AI shopping queries to measure how often your product gets matched.' },
                { name: 'AE Visibility', desc: 'Tests your listing against real Gemini AI searches to check brand visibility.' },
                { name: 'Competitor Gap', desc: 'Compares your listing against top competitors to find missing attributes and keywords.' },
                { name: 'Rewrite Agent', desc: 'Generates optimized title, bullets, and description based on all audit findings.' },
                { name: 'QA Auditor', desc: 'Cross-references all agent outputs, flags conflicts, and computes an AI Readiness Score.' },
              ].map(agent => (
                <div key={agent.name} className="flex gap-2">
                  <span className="whitespace-nowrap min-w-[95px]" style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB' }}>{agent.name}</span>
                  <span className="leading-relaxed" style={{ fontSize: '11px', fontWeight: 400, color: '#64748B' }}>{agent.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {totalAudited > 0 && (
          <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', background: 'rgba(255,255,255,0.08)' }}>
            {totalAudited} audited
          </span>
        )}
      </div>
    </header>
  )
}
