'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'tetherpay-consent-v1'

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        // small delay so it doesn't flash on first paint
        const t = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(t)
      }
    } catch {
      // localStorage may be unavailable (privacy mode) — skip banner
    }
  }, [])

  const dismiss = (choice: 'accept' | 'decline') => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: new Date().toISOString() }))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[55] mx-auto max-w-3xl sm:left-4 sm:right-auto"
        >
          <div className="glass-card flex flex-col gap-3 rounded-2xl p-4 shadow-float sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <div className="flex items-start gap-3 sm:flex-1">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                <Cookie className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-medium">We use cookies to improve your experience.</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Essential cookies are always on. Optional analytics help us understand how you use TetherPay. See our{' '}
                  <a href="#" className="font-medium text-[var(--accent)] underline underline-offset-2">Cookie Policy</a>.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => dismiss('decline')}
                className="inline-flex h-9 items-center rounded-xl border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Decline
              </button>
              <button
                onClick={() => dismiss('accept')}
                className="inline-flex h-9 items-center rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Accept
              </button>
              <button
                onClick={() => dismiss('decline')}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 transition-colors hover:bg-muted sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
