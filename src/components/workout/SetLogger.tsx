'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ExerciseSet } from '@/lib/types'

interface Props {
  set: ExerciseSet
  weightType: 'variable' | 'fixed' | 'bodyweight'
  repLabel?: string
  onComplete: (setId: string, actualReps: number, weightLbs: number | null) => void
}

export function SetLogger({ set, weightType, repLabel, onComplete }: Props) {
  const [weight, setWeight] = useState(set.weight_lbs?.toString() ?? '')
  const [reps, setReps] = useState(set.actual_reps?.toString() ?? set.target_reps.toString())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setWeight(set.weight_lbs?.toString() ?? '')
    setReps(set.actual_reps?.toString() ?? set.target_reps.toString())
  }, [set])

  async function handleComplete() {
    setSaving(true)
    const supabase = createClient()
    const actualReps = parseInt(reps) || set.target_reps
    const weightLbs = weightType === 'bodyweight' ? null : parseFloat(weight) || null

    const update = {
      actual_reps: actualReps,
      weight_lbs: weightLbs,
      completed: true,
      completed_at: new Date().toISOString(),
    }

    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('set_queue') ?? '[]')
      queue.push({ id: set.id, ...update })
      localStorage.setItem('set_queue', JSON.stringify(queue))
      onComplete(set.id, actualReps, weightLbs)
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('exercise_sets')
      .update(update)
      .eq('id', set.id)

    if (!error) {
      onComplete(set.id, actualReps, weightLbs)
    }
    setSaving(false)
  }

  if (set.completed) {
    return (
      <div
        className="flex items-center gap-3 py-2 px-3 rounded-lg"
        style={{ background: 'rgba(34, 197, 94, 0.08)' }}
      >
        <span className="text-sm font-medium w-6 text-center" style={{ color: 'var(--muted-foreground)' }}>
          {set.set_number}
        </span>
        {weightType !== 'bodyweight' && (
          <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
            {set.weight_lbs ?? '—'} lbs
          </span>
        )}
        <span className="text-sm" style={{ color: 'var(--success)' }}>
          × {set.actual_reps ?? set.target_reps}{typeof set.target_reps === 'string' ? '' : ' reps'}
        </span>
        <Check size={14} className="ml-auto" style={{ color: 'var(--success)' }} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm font-medium w-6 text-center shrink-0" style={{ color: 'var(--muted-foreground)' }}>
        {set.set_number}
      </span>

      {weightType === 'variable' && (
        <div className="flex-1">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="lbs"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded-lg text-sm text-center font-medium outline-none"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          />
          <div className="text-xs text-center mt-0.5" style={{ color: 'var(--muted-foreground)' }}>lbs</div>
        </div>
      )}

      {weightType === 'fixed' && (
        <div className="flex-1 px-3 py-2 rounded-lg text-sm text-center font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
          {set.weight_lbs} lbs
        </div>
      )}

      {weightType !== 'bodyweight' && <span className="text-[var(--muted-foreground)] text-sm">×</span>}

      <div className="flex-1">
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          inputMode="numeric"
          className="w-full px-3 py-2 rounded-lg text-sm text-center font-medium outline-none"
          style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
        />
        <div className="text-xs text-center mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          {repLabel ?? 'reps'}
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={saving}
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
        style={{ background: 'var(--primary)' }}
        aria-label="Mark set done"
      >
        <Check size={16} style={{ color: 'white' }} />
      </button>
    </div>
  )
}
