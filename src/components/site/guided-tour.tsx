'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'tetherpay-tour-v1'

type TourStep = {
  target: string // CSS selector
  title: string
  desc: string
  placement: 'bottom' | 'top' | 'center'
}

const STEPS: TourStep[] = [
  {
    target: 'body',
    title: 'Welcome to TetherPay',
    desc: 'Earn in USDT. Spend in INR. This 30-second tour shows you the key features. You can dismiss it anytime.',
    placement: 'center',
  },
  {
    target: '#calculator',
    title: 'Rate calculator',
    desc: 'Enter an INR amount to see exactly how much USDT you\'ll pay — with the rate locked at quote time.',
    placement: 'top',
  },
  {
    target: '#pricing',
    title: 'Agent tiers',
    desc: 'Agents earn 1.50–2.00% commission depending on tier. Upgrades are automatic based on volume.',
    placement: 'top',
  },
  {
    target: '#security',
    title: 'Ledger-first security',
    desc: 'Your balance is an append-only ledger entry — never silently mutated. Every move is manual where it matters.',
    placement: 'top',
  },
  {
    target: '#glossary',
    title: 'Glossary & resources',
    desc: 'New to USDT or UPI? Our searchable glossary and blog explain every term. Plus inline tooltips throughout.',
    placement: 'top',
  },
]

export function GuidedTour() {
  const [active, setActive] = React.useState(false)
  const [idx, setIdx] = React.useState(0)
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null)

  // Start tour on first visit
  React.useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY)
      if (!done) {
        const t = setTimeout(() => setActive(true), 2500)
        return () => clearTimeout(t)
      }
    } catch {
      // localStorage unavailable — skip tour
    }
  }, [])

  // Update target rect on step change + scroll/resize
  React.useEffect(() => {
    if (!active) return
    const update = () => {
      const step = STEPS[idx]
      const el = document.querySelector(step.target)
      if (el && step.placement !== 'center') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setTargetRect(el.getBoundingClientRect()), 400)
      } else {
        setTargetRect(null)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [active, idx])

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: new Date().toISOString() })) } catch {}
    setActive(false)
  }

  const next = () => {
    if (idx < STEPS.length - 1) setIdx(idx + 1)
    else finish()
  }
  const prev = () => { if (idx > 0) setIdx(idx - 1) }

  const step = STEPS[idx]
  const isLast = idx === STEPS.length - 1

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          {/* backdrop with spotlight cutout */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={finish}
            style={
              targetRect
                ? {
                    boxShadow: `0 0 0 9999px rgba(0,0,0,0.6)`,
                    borderRadius: '12px',
                    left: targetRect.left - 8,
                    top: targetRect.top - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                  }
                : undefined
            }
          />

          {/* tooltip card */}
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute"
            style={{
              left: targetRect
                ? Math.min(window.innerWidth - 340, Math.max(16, targetRect.left + targetRect.width / 2 - 160))
                : '50%',
              top: targetRect
                ? step.placement === 'top'
                  ? Math.min(window.innerHeight - 200, targetRect.bottom + 16)
                  : Math.max(16, targetRect.top - 200)
                : '50%',
              transform: targetRect ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className="glass-card w-80 rounded-2xl p-5 shadow-float">
              <div className="flex items-start justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <button
                  onClick={finish}
                  aria-label="Skip tour"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">Step {idx + 1} / {STEPS.length}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.span
                    className="block h-full bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={prev}
                  disabled={idx === 0}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${i === idx ? 'bg-[var(--accent)]' : i < idx ? 'bg-[var(--accent)]/40' : 'bg-muted'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="inline-flex h-9 items-center gap-1 rounded-xl bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--primary-foreground)] transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  {isLast ? (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Done</>
                  ) : (
                    <>Next <ArrowRight className="h-3.5 w-3.5" /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
