'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

type ThemeOption = 'light' | 'dark' | 'system'

const OPTIONS: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = (mounted ? theme : 'dark') as ThemeOption
  const CurrentIcon = OPTIONS.find((o) => o.value === current)?.icon ?? Moon

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Theme settings"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-full',
          'border border-border bg-background/60 backdrop-blur',
          'transition-all hover:bg-muted hover:shadow-soft',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1 shadow-float backdrop-blur-md"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              role="menuitemradio"
              aria-checked={current === o.value}
              onClick={() => {
                setTheme(o.value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors',
                current === o.value
                  ? 'bg-[var(--accent-light)] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]'
                  : 'text-foreground/80 hover:bg-muted',
              )}
            >
              <o.icon className="h-4 w-4" />
              {o.label}
              {current === o.value && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
