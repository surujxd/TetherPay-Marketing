'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from './i18n'
import { cn } from '@/lib/utils'

type Lang = 'en' | 'hi'

const LANGS: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
]

export function LangSelector({ className }: { className?: string }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = LANGS.find((l) => l.value === lang)!

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Select language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 text-xs font-medium backdrop-blur transition-all hover:bg-muted hover:shadow-soft"
      >
        <Globe className="h-3.5 w-3.5 text-[var(--accent)]" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="uppercase">{lang}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1 shadow-float backdrop-blur-md"
        >
          {LANGS.map((l) => (
            <button
              key={l.value}
              role="menuitemradio"
              aria-checked={lang === l.value}
              onClick={() => { setLang(l.value); setOpen(false) }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors',
                lang === l.value
                  ? 'bg-[var(--accent-light)] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]'
                  : 'text-foreground/80 hover:bg-muted',
              )}
            >
              <span className="text-base">{l.flag}</span>
              {l.label}
              {lang === l.value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
