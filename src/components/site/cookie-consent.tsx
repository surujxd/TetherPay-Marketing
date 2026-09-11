'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'

const STORAGE_KEY = 'tetherpay-consent-v1'

type ConsentData = {
  choice: 'accept' | 'decline' | 'custom'
  analytics: boolean
  marketing: boolean
  at: string
}

const DEFAULTS: ConsentData = { choice: 'decline', analytics: false, marketing: false, at: '' }

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false)
  const [prefsOpen, setPrefsOpen] = React.useState(false)
  const [prefs, setPrefs] = React.useState({ analytics: false, marketing: false })

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const t = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  React.useEffect(() => {
    if (visible) {
      document.body.style.paddingBottom = '140px'
      return () => { document.body.style.paddingBottom = '' }
    }
  }, [visible])

  const save = (data: ConsentData) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
    setVisible(false)
    setPrefsOpen(false)
  }

  const dismiss = (choice: 'accept' | 'decline') => {
    save({
      choice,
      analytics: choice === 'accept',
      marketing: choice === 'accept',
      at: new Date().toISOString(),
    })
  }

  const savePrefs = () => {
    save({
      choice: 'custom',
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      at: new Date().toISOString(),
    })
  }

  return (
    <>
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
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  onClick={() => setPrefsOpen(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Settings className="h-3.5 w-3.5" /> Preferences
                </button>
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {prefsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] flex items-end justify-center p-0 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPrefsOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="glass-card relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <Settings className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">Cookie preferences</span>
                </div>
                <button
                  onClick={() => setPrefsOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background/60 transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scroll-area p-5">
                <p className="text-xs text-muted-foreground">
                  Manage how we use cookies. Essential cookies are required for the site to function and cannot be disabled.
                </p>

                <div className="mt-4 space-y-3">
                  {/* Essential */}
                  <div className="rounded-xl border border-border bg-background/40 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Essential</div>
                        <div className="text-[11px] text-muted-foreground">Required for core functionality</div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                        <Check className="h-3 w-3" /> Always on
                      </span>
                    </div>
                  </div>

                  {/* Analytics */}
                  <ToggleRow
                    label="Analytics"
                    desc="Help us understand how you use TetherPay (anonymized)."
                    checked={prefs.analytics}
                    onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                  />

                  {/* Marketing */}
                  <ToggleRow
                    label="Marketing"
                    desc="Personalize content and show relevant rate alerts."
                    checked={prefs.marketing}
                    onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border bg-background/30 px-5 py-4">
                <button
                  onClick={() => { setPrefs({ analytics: false, marketing: false }); savePrefs() }}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-background/60 px-4 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Reject all
                </button>
                <button
                  onClick={() => { setPrefs({ analytics: true, marketing: true }); savePrefs() }}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-background/60 px-4 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Allow all
                </button>
                <button
                  onClick={savePrefs}
                  className="inline-flex h-10 items-center rounded-xl bg-[var(--accent)] px-5 text-xs font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110"
                >
                  Save preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-[11px] text-muted-foreground">{desc}</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-[var(--accent)]' : 'bg-muted'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  )
}
