interface Props {
  total: number
  completed: number
}

export function CompletionBar({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
        <span>{completed}/{total} sets</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--primary)' }}
        />
      </div>
    </div>
  )
}
