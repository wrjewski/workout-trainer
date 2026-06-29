'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react'
import { SetLogger } from './SetLogger'
import { ProgressionBadge } from './ProgressionBadge'
import { createClient } from '@/lib/supabase/client'
import type { ExerciseDefinition, ExerciseSet, ProgressionSuggestion } from '@/lib/types'
import { LOWER_BACK_CAUTION_KEYS } from '@/lib/workout-data'

interface Props {
  exercise: ExerciseDefinition
  sets: ExerciseSet[]
  suggestion?: ProgressionSuggestion
  onSetsUpdate: (updatedSets: ExerciseSet[]) => void
  onSuggestionDismiss?: (exerciseKey: string) => void
}

export function ExerciseRow({ exercise, sets, suggestion, onSetsUpdate, onSuggestionDismiss }: Props) {
  const [expanded, setExpanded] = useState(false)
  const allDone = sets.length > 0 && sets.every((s) => s.completed)
  const doneSets = sets.filter((s) => s.completed).length
  const supabase = createClient()

  const topWeight = sets.filter((s) => s.completed && s.weight_lbs != null)
    .sort((a, b) => (b.weight_lbs ?? 0) - (a.weight_lbs ?? 0))[0]?.weight_lbs

  const repLabel = typeof exercise.reps === 'string' ? exercise.reps : undefined

  function handleSetComplete(setId: string, actualReps: number, weightLbs: number | null) {
    const updated = sets.map((s) =>
      s.id === setId ? { ...s, completed: true, actual_reps: actualReps, weight_lbs: weightLbs } : s
    )
    onSetsUpdate(updated)
  }

  async function handleAcceptProgression() {
    if (!suggestion) return
    await supabase
      .from('user_exercise_weights')
      .upsert({
        exercise_key: exercise.key,
        current_weight_lbs: suggestion.suggested_weight_lbs,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,exercise_key' })
    onSuggestionDismiss?.(exercise.key)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {allDone && <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />}
            {LOWER_BACK_CAUTION_KEYS.has(exercise.key) && !allDone && (
              <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            )}
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
              {exercise.name}
            </span>
          </div>
          <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
            <span>{exercise.sets}×{exercise.reps}</span>
            {topWeight != null && <span>@ {topWeight} lbs</span>}
            {exercise.weightType === 'fixed' && <span>({exercise.fixedWeightLbs} lbs fixed)</span>}
            {exercise.weightType === 'bodyweight' && <span>bodyweight</span>}
            <span style={{ color: allDone ? 'var(--success)' : undefined }}>
              {doneSets}/{exercise.sets} done
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          {LOWER_BACK_CAUTION_KEYS.has(exercise.key) && (
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2 mt-3 text-xs"
              style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
            >
              <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--warning)' }} />
              <span style={{ color: '#fbbf24' }}>
                <strong>Lower back:</strong> Brace before every rep. {exercise.notes}
              </span>
            </div>
          )}

          {exercise.notes && !LOWER_BACK_CAUTION_KEYS.has(exercise.key) && (
            <p className="text-xs pt-2 pb-1" style={{ color: 'var(--muted-foreground)' }}>
              {exercise.notes}
            </p>
          )}

          <div className="pt-1 space-y-1">
            {sets.map((s) => (
              <SetLogger
                key={s.id}
                set={s}
                weightType={exercise.weightType}
                repLabel={repLabel}
                onComplete={handleSetComplete}
              />
            ))}
          </div>

          {suggestion && (
            <div className="pt-1">
              <ProgressionBadge
                suggestion={suggestion}
                onAccept={handleAcceptProgression}
                onDismiss={() => onSuggestionDismiss?.(exercise.key)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
