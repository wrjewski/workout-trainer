'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { format, parseISO } from 'date-fns'
import type { BodyWeightLog } from '@/lib/types'

interface Props {
  logs: BodyWeightLog[]
}

export function WeightChart({ logs }: Props) {
  if (logs.length < 2) {
    return (
      <div className="flex items-center justify-center h-24 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        Log at least 2 days to see your trend.
      </div>
    )
  }

  const data = [...logs]
    .sort((a, b) => a.logged_date.localeCompare(b.logged_date))
    .map((l) => ({
      date: format(parseISO(l.logged_date + 'T12:00:00'), 'MMM d'),
      weight: Number(l.weight_lbs),
    }))

  const weights = data.map((d) => d.weight)
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--foreground)',
            }}
            formatter={(v) => [`${v} lbs`, 'Weight']}
          />
          <ReferenceLine y={avg} stroke="var(--border)" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
