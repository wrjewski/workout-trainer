'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExerciseRow } from './ExerciseRow'
import { CompletionBar } from './CompletionBar'
import { Trophy, CheckCircle2, Dumbbell } from 'lucide-react'
import type { WorkoutDay, WorkoutSession, ExerciseSet, ProgressionSuggestion } from '@/lib/types'
import { format } from 'date-fns'

interface Props {
  day: WorkoutDay
  session: WorkoutSession
  initialSets: ExerciseSet[]
  initialSuggestions: ProgressionSuggestion[]
}

export function WorkoutCard({ day, session, initialSets, initialSuggestions }: Props) {
  const [sets, setSets] = useState(initialSets)
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [completing, setCompleting] = useState(false)
  const [sessionDone, setSessionDone] = useState(!!session.completed_at)

  const supabase = createClient()

  const allSets = sets.length
  const doneSets = sets.filter((s) => s.completed).length
  const allDone = allSets > 0 && doneSets === allSets

  function getSetsForExercise(exerciseKey: string) {
    return sets.filter((s) => s.exercise_key === exerciseKey)
  }

  function handleSetsUpdate(exerciseKey: string, updatedSets: ExerciseSet[]) {
    setSets((prev) =>
      prev.map((s) => {
        const updated = updatedSets.find((u) => u.id === s.id)
        return updated ?? s
      })
    )

    // Auto-update current weight in DB when first set of an exercise is logged
    const firstDone = updatedSets.find((s) => s.completed && s.weight_lbs != null)
    if (firstDone?.weight_lbs) {
      supabase.from('user_exercise_weights').upsert({
        exercise_key: exerciseKey,
        current_weight_lbs: firstDone.weight_lbs,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,exercise_key' })
    }
  }

  function handleSuggestionDismiss(exerciseKey: string) {
    setSuggestions((prev) => prev.filter((s) => s.exercise_key !== exerciseKey))
  }

  async function handleCompleteSession() {
    setCompleting(true)
    await supabase
      .from('workout_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', session.id)
    setSessionDone(true)
    setCompleting(false)
  }

  const dateLabel = format(new Date(session.scheduled_date + 'T12:00:00'), 'EEEE, MMM d')

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          {dateLabel}
        </p>
        <h1 className="text-2xl font-bold mt-0.5" style={{ color: 'var(--foreground)' }}>
          {day.label}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {day.focus}
        </p>
      </div>

      {/* Progress */}
      <CompletionBar total={allSets} completed={doneSets} />

      {/* Session complete state */}
      {sessionDone && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
        >
          <CheckCircle2 style={{ color: 'var(--success)' }} size={20} />
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--success)' }}>Session Complete!</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Great work today, Ray.</p>
          </div>
          <Trophy size={18} className="ml-auto" style={{ color: '#fbbf24' }} />
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-2">
        {day.exercises.map((exercise) => (
          <ExerciseRow
            key={exercise.key}
            exercise={exercise}
            sets={getSetsForExercise(exercise.key)}
            suggestion={suggestions.find((s) => s.exercise_key === exercise.key)}
            onSetsUpdate={(updated) => handleSetsUpdate(exercise.key, updated)}
            onSuggestionDismiss={handleSuggestionDismiss}
          />
        ))}
      </div>

      {/* Complete session button */}
      {!sessionDone && allDone && (
        <button
          onClick={handleCompleteSession}
          disabled={completing}
          className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
          style={{ background: 'var(--success)', color: 'white' }}
        >
          <Dumbbell size={20} />
          {completing ? 'Saving…' : 'Complete Session'}
        </button>
      )}
    </div>
  )
}
