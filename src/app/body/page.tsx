'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BodyWeightForm } from '@/components/body/BodyWeightForm'
import { WeightChart } from '@/components/body/WeightChart'
import { PhotoUploader } from '@/components/body/PhotoUploader'
import { ProgressPhotoGrid } from '@/components/body/ProgressPhotoGrid'
import { format } from 'date-fns'
import type { BodyWeightLog, ProgressPhoto } from '@/lib/types'

export default function BodyPage() {
  const [weightLogs, setWeightLogs] = useState<BodyWeightLog[]>([])
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  async function loadData() {
    const [{ data: logs }, { data: photoData }] = await Promise.all([
      supabase
        .from('body_weight_logs')
        .select('*')
        .order('logged_date', { ascending: false })
        .limit(60),
      supabase
        .from('progress_photos')
        .select('*')
        .order('photo_date', { ascending: false }),
    ])
    setWeightLogs(logs ?? [])
    setPhotos(photoData ?? [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const todayLog = weightLogs.find((l) => l.logged_date === today) ?? null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading…</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-5">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Body</h1>

      {/* Body weight */}
      <BodyWeightForm
        todayLog={todayLog}
        onLogged={(w) => {
          setWeightLogs((prev) => {
            const filtered = prev.filter((l) => l.logged_date !== today)
            return [{ id: 'tmp', user_id: '', logged_date: today, weight_lbs: w, notes: null, created_at: '' }, ...filtered]
          })
        }}
      />

      {/* Chart */}
      {weightLogs.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Weight Trend</h2>
            {weightLogs[0] && (
              <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                {Number(weightLogs[0].weight_lbs).toFixed(1)} lbs
              </span>
            )}
          </div>
          <WeightChart logs={weightLogs} />
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Last 60 days · Starting weight: 190 lbs
          </p>
        </div>
      )}

      {/* Photos */}
      <PhotoUploader onUploaded={loadData} />
      <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Progress Photos</h2>
        <ProgressPhotoGrid photos={photos} />
      </div>
    </div>
  )
}
