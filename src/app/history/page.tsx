import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getWorkoutDay } from '@/lib/workout-data'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import type { DayKey } from '@/lib/types'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('scheduled_date', { ascending: false })
    .limit(50)

  const sessionIds = (sessions ?? []).map((s) => s.id)

  // Get set completion counts per session
  const { data: setCounts } = sessionIds.length
    ? await supabase
        .from('exercise_sets')
        .select('session_id, completed')
        .in('session_id', sessionIds)
    : { data: [] }

  const countMap = new Map<string, { total: number; done: number }>()
  for (const s of setCounts ?? []) {
    const entry = countMap.get(s.session_id) ?? { total: 0, done: 0 }
    entry.total++
    if (s.completed) entry.done++
    countMap.set(s.session_id, entry)
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>History</h1>

      {(!sessions || sessions.length === 0) && (
        <div className="text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
          <p>No sessions yet. Start your first workout!</p>
        </div>
      )}

      <div className="space-y-2">
        {(sessions ?? []).map((session) => {
          const day = getWorkoutDay(session.day_key as DayKey)
          const counts = countMap.get(session.id)
          const date = parseISO(session.scheduled_date + 'T12:00:00')
          const isCompleted = !!session.completed_at

          return (
            <Link
              key={session.id}
              href={`/workout/${session.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div>
                {isCompleted ? (
                  <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                ) : (
                  <Circle size={20} style={{ color: 'var(--muted-foreground)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  {day?.label ?? session.day_key}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {format(date, 'EEEE, MMM d, yyyy')}
                  {counts && ` · ${counts.done}/${counts.total} sets`}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--muted-foreground)' }} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
