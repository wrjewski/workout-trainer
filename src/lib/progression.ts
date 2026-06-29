import { createClient } from '@/lib/supabase/server'
import { getWorkoutDay } from './workout-data'
import type { DayKey, ProgressionSuggestion } from './types'

export async function checkProgression(
  userId: string,
  exerciseKey: string,
  muscleGroup: 'upper' | 'lower',
  currentWeightLbs: number
): Promise<ProgressionSuggestion | null> {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select('id')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('scheduled_date', { ascending: false })
    .limit(10)

  if (!sessions || sessions.length < 2) return null

  const sessionIds = sessions.map((s) => s.id)

  const { data: allSets } = await supabase
    .from('exercise_sets')
    .select('session_id, target_reps, actual_reps, completed')
    .eq('exercise_key', exerciseKey)
    .in('session_id', sessionIds)

  if (!allSets || allSets.length === 0) return null

  const bySession = new Map<string, typeof allSets>()
  for (const set of allSets) {
    const arr = bySession.get(set.session_id) ?? []
    arr.push(set)
    bySession.set(set.session_id, arr)
  }

  const qualifyingSessions = sessionIds.filter((id) => bySession.has(id)).slice(0, 2)

  if (qualifyingSessions.length < 2) return null

  const allTopRange = qualifyingSessions.every((sessionId) => {
    const sets = bySession.get(sessionId)!
    return sets.every(
      (s) =>
        s.completed && s.actual_reps !== null && s.actual_reps >= s.target_reps
    )
  })

  if (!allTopRange) return null

  const increment = muscleGroup === 'lower' ? 10 : 5
  return {
    exercise_key: exerciseKey,
    exercise_name: exerciseKey,
    current_weight_lbs: currentWeightLbs,
    suggested_weight_lbs: currentWeightLbs + increment,
    increment_lbs: increment,
  }
}

export async function getSessionProgressionSuggestions(
  userId: string,
  dayKey: DayKey
): Promise<ProgressionSuggestion[]> {
  const supabase = await createClient()
  const day = getWorkoutDay(dayKey)
  const variableExercises = day.exercises.filter((e) => e.weightType === 'variable')

  const { data: currentWeights } = await supabase
    .from('user_exercise_weights')
    .select('exercise_key, current_weight_lbs')
    .eq('user_id', userId)
    .in(
      'exercise_key',
      variableExercises.map((e) => e.key)
    )

  const weightMap = new Map(
    (currentWeights ?? []).map((w) => [w.exercise_key, Number(w.current_weight_lbs)])
  )

  const suggestions: ProgressionSuggestion[] = []
  for (const ex of variableExercises) {
    const current = weightMap.get(ex.key) ?? 0
    if (current === 0) continue

    const suggestion = await checkProgression(userId, ex.key, ex.muscleGroup as 'upper' | 'lower', current)
    if (suggestion) {
      suggestions.push({ ...suggestion, exercise_name: ex.name })
    }
  }

  return suggestions
}
