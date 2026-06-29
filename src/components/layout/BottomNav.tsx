'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Scale } from 'lucide-react'
import { cn } from '@/lib/cn'

const tabs = [
  { href: '/today', label: 'Today', icon: Home },
  { href: '/history', label: 'History', icon: History },
  { href: '/body', label: 'Body', icon: Scale },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 pb-safe flex items-center justify-around"
      style={{
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
      }}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 py-3 px-6 text-xs font-medium transition-colors',
              active ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
            )}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
