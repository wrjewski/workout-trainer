import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTodayWorkout, getTodayDayKey } from '@/lib/workout-data'
import { getSessionProgressionSuggestions } from '@/lib/progression'
import { WorkoutCard } from '@/components/workout/WorkoutCard'
import { format } from 'date-fns'
import { Moon } from 'lucide-react'
import type { DayKey } from '@/lib/types'

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const todayWorkout = getTodayWorkout()
  const todayKey = getTodayDayKey()
  const todayDate = format(new Date(), 'yyyy-MM-dd')

  // Rest day
  if (!todayWorkout || !todayKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <Moon size={48} style={{ color: 'var(--muted-foreground)' }} />
        <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--foreground)' }}>Rest Day</h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          {format(new Date(), 'EEEE')} is a rest day. Recover well!
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Next workout: Monday (Push A)
        </p>
      </div>
    )
  }

  // Upsert session for today
  const { data: existingSession } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('scheduled_date', todayDate)
    .single()

  let session = existingSession
  if (!session) {
    const { data: newSession } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        day_key: todayKey,
        scheduled_date: todayDate,
      })
      .select('*')
      .single()
    session = newSession
  }

  if (!session) {
    return <div className="p-4" style={{ color: 'var(--destructive)' }}>Error creating session.</div>
  }

  // Fetch or generate sets
  const { data: existingSets } = await supabase
    .from('exercise_sets')
    .select('*')
    .eq('session_id', session.id)
    .order('exercise_key')
    .order('set_number')

  let sets = existingSets ?? []

  if (sets.length === 0) {
    // Fetch current working weights
    const exerciseKeys = todayWorkout.exercises
      .filter((e) => e.weightType !== 'bodyweight')
      .map((e) => e.key)

    const { data: currentWeights } = await supabase
      .from('user_exercise_weights')
      .select('exercise_key, current_weight_lbs')
      .eq('user_id', user.id)
      .in('exercise_key', exerciseKeys)

    const weightMap = new Map(
      (currentWeights ?? []).map((w) => [w.exercise_key, Number(w.current_weight_lbs)])
    )

    const setRows = todayWorkout.exercises.flatMap((exercise) =>
      Array.from({ length: exercise.sets }, (_, i) => ({
        session_id: session!.id,
        exercise_key: exercise.key,
        set_number: i + 1,
        target_reps: typeof exercise.reps === 'number' ? exercise.reps : 45,
        weight_lbs:
          exercise.weightType === 'fixed'
            ? exercise.fixedWeightLbs ?? null
            : exercise.weightType === 'bodyweight'
            ? null
            : weightMap.get(exercise.key) ?? null,
        completed: false,
      }))
    )

    const { data: inserted } = await supabase
      .from('exercise_sets')
      .insert(setRows)
      .select('*')

    sets = inserted ?? []
  }

  // Progression suggestions (only for completed session history check)
  const suggestions = await getSessionProgressionSuggestions(user.id, todayKey as DayKey)

  return (
    <WorkoutCard
      day={todayWorkout}
      session={session}
      initialSets={sets}
      initialSuggestions={suggestions}
    />
  )
}
