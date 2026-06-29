'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import Image from 'next/image'
import type { ProgressPhoto } from '@/lib/types'

interface Props {
  photos: ProgressPhoto[]
}

type Angle = 'all' | 'front' | 'side' | 'back'

export function ProgressPhotoGrid({ photos: initialPhotos }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<Angle>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchUrls() {
      const newUrls: Record<string, string> = {}
      for (const photo of photos) {
        if (!signedUrls[photo.storage_path]) {
          const { data } = await supabase.storage
            .from('progress-photos')
            .createSignedUrl(photo.storage_path, 3600)
          if (data?.signedUrl) newUrls[photo.storage_path] = data.signedUrl
        }
      }
      if (Object.keys(newUrls).length > 0) {
        setSignedUrls((prev) => ({ ...prev, ...newUrls }))
      }
    }
    fetchUrls()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos])

  const filtered = filter === 'all' ? photos : photos.filter((p) => p.angle === filter)

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        No progress photos yet. Take your first photo above!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'front', 'side', 'back'] as Angle[]).map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize"
            style={{
              background: filter === a ? 'var(--primary)' : 'var(--muted)',
              color: filter === a ? 'white' : 'var(--muted-foreground)',
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((photo) => {
          const url = signedUrls[photo.storage_path]
          const date = parseISO(photo.photo_date + 'T12:00:00')
          return (
            <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--muted)' }}>
              {url ? (
                <Image src={url} alt={`${photo.angle} - ${photo.photo_date}`} fill className="object-cover" sizes="33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Loading…
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-center"
                style={{ background: 'rgba(0,0,0,0.6)', fontSize: '9px', color: 'white' }}
              >
                {format(date, 'MMM d')}
                {photo.angle && ` · ${photo.angle}`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
