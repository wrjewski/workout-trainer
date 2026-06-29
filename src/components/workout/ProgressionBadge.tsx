'use client'

import { TrendingUp, Check, X } from 'lucide-react'
import type { ProgressionSuggestion } from '@/lib/types'

interface Props {
  suggestion: ProgressionSuggestion
  onAccept: () => void
  onDismiss: () => void
}

export function ProgressionBadge({ suggestion, onAccept, onDismiss }: Props) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
      style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)' }}
    >
      <TrendingUp size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
      <span className="flex-1 text-xs" style={{ color: '#fbbf24' }}>
        Try +{suggestion.increment_lbs} lbs → <strong>{suggestion.suggested_weight_lbs} lbs</strong>
      </span>
      <button
        onClick={onAccept}
        className="p-1 rounded-lg transition-colors hover:bg-white/10"
        style={{ color: 'var(--success)' }}
        aria-label="Accept progression"
      >
        <Check size={14} />
      </button>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg transition-colors hover:bg-white/10"
        style={{ color: 'var(--muted-foreground)' }}
        aria-label="Dismiss progression"
      >
        <X size={14} />
      </button>
    </div>
  )
}
