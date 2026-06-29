import { redirect } from 'next/navigation'
import { getTodayDayKey } from '@/lib/workout-data'

export default function Home() {
  const todayKey = getTodayDayKey()
  if (todayKey) {
    redirect('/today')
  } else {
    redirect('/history')
  }
}
