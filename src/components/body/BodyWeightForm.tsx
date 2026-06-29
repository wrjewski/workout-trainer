'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface Props {
  todayLog: { weight_lbs: number } | null
  onLogged: (weight: number) => void
}

export function BodyWeightForm({ todayLog, onLogged }: Props) {
  const [weight, setWeight] = useState(todayLog?.weight_lbs?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!todayLog)
  const supabase = createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const lbs = parseFloat(weight)
    if (!lbs) return
    setSaving(true)
    await supabase.from('body_weight_logs').upsert(
      { logged_date: today, weight_lbs: lbs },
      { onConflict: 'user_id,logged_date' }
    )
    setSaved(true)
    setSaving(false)
    onLogged(lbs)
  }

  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
        Today&apos;s Weight
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => { setWeight(e.target.value); setSaved(false) }}
          placeholder="lbs"
          inputMode="decimal"
          className="flex-1 px-4 py-3 rounded-xl text-base font-medium outline-none"
          style={{
            background: 'var(--muted)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
        />
        <button
          type="submit"
          disabled={saving || !weight}
          className="px-5 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
          style={{ background: saved ? 'var(--success)' : 'var(--primary)', color: 'white' }}
        >
          {saving ? '…' : saved ? '✓' : 'Log'}
        </button>
      </form>
    </div>
  )
}
