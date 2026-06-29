import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getWorkoutDay } from '@/lib/workout-data'
import { WorkoutCard } from '@/components/workout/WorkoutCard'
import type { DayKey } from '@/lib/types'

interface Props {
  params: Promise<{ dayId: string }>
}

export default async function WorkoutSessionPage({ params }: Props) {
  const { dayId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', dayId)
    .eq('user_id', user.id)
    .single()

  if (!session) notFound()

  const day = getWorkoutDay(session.day_key as DayKey)
  if (!day) notFound()

  const { data: sets } = await supabase
    .from('exercise_sets')
    .select('*')
    .eq('session_id', session.id)
    .order('exercise_key')
    .order('set_number')

  return (
    <WorkoutCard
      day={day}
      session={session}
      initialSets={sets ?? []}
      initialSuggestions={[]}
    />
  )
}
