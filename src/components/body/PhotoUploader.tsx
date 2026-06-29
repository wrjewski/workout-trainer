'use client'

import { useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

type Angle = 'front' | 'side' | 'back'

interface Props {
  onUploaded: () => void
}

export function PhotoUploader({ onUploaded }: Props) {
  const [angle, setAngle] = useState<Angle>('front')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const ext = file.name.split('.').pop() ?? 'jpg'
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const path = `${user.id}/${today}/${angle}_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase.from('progress_photos').insert({
        photo_date: today,
        storage_path: path,
        angle,
      })

      if (dbError) throw dbError

      onUploaded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Add Progress Photo</h2>

      {/* Angle selector */}
      <div className="flex gap-2">
        {(['front', 'side', 'back'] as Angle[]).map((a) => (
          <button
            key={a}
            onClick={() => setAngle(a)}
            className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
            style={{
              background: angle === a ? 'var(--primary)' : 'var(--muted)',
              color: angle === a ? 'white' : 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Upload button */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
          style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
        >
          <Camera size={16} />
          Camera
        </button>
        <button
          onClick={() => {
            if (fileRef.current) {
              fileRef.current.removeAttribute('capture')
              fileRef.current.click()
              setTimeout(() => fileRef.current?.setAttribute('capture', 'environment'), 100)
            }
          }}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
          style={{ background: 'var(--primary)', color: 'white' }}
        >
          <Upload size={16} />
          {uploading ? 'Uploading…' : 'Gallery'}
        </button>
      </div>

      {error && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{error}</p>}
    </div>
  )
}
