'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from './primitives'
import { ThemeToggle } from '@/components/theme-toggle'
import { NotificationDemo } from './notification-demo'
import { NAV_LINKS } from './content'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300 sm:px-4',
          scrolled ? 'glass-card shadow-soft' : 'border border-transparent',
        )}
      >
        <Link href="/" className="shrink-0" aria-label="TetherPay home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <NotificationDemo />
          <ThemeToggle />
          <a
            href="#calculator"
            className="hidden items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] sm:inline-flex"
          >
            Get a quote
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl xl:hidden"
          >
            <div className="glass-card rounded-2xl p-3">
              <div className="grid gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
                  >
                    {l.label}
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </a>
                ))}
                <a
                  href="#calculator"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                  Get a quote
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
