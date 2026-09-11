'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'tetherpay-tour-v2'

type TourStep = {
  target: string
  title: string
  desc: string
}

const STEPS: TourStep[] = [
  {
    target: 'body',
    title: 'Welcome to TetherPay',
    desc: 'Earn in USDT. Spend in INR. This 30-second tour shows you the key features. You can dismiss it anytime.',
  },
  {
    target: '#calculator',
    title: 'Rate calculator',
    desc: 'Enter an INR amount to see exactly how much USDT you\'ll pay — with the rate locked at quote time.',
  },
  {
    target: '#pricing',
    title: 'Agent tiers',
    desc: 'Agents earn 1.50–2.00% commission depending on tier. Upgrades are automatic based on volume.',
  },
  {
    target: '#security',
    title: 'Ledger-first security',
    desc: 'Your balance is an append-only ledger entry — never silently mutated. Every move is manual where it matters.',
  },
  {
    target: '#glossary',
    title: 'Glossary & resources',
    desc: 'New to USDT or UPI? Our searchable glossary and blog explain every term. Plus inline tooltips throughout.',
  },
]

const CARD_W = 320
const PAD = 16
const GAP = 12

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function GuidedTour() {
  const [active, setActive] = React.useState(false)
  const [idx, setIdx] = React.useState(0)
  const [rect, setRect] = React.useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [vw, setVw] = React.useState(0)
  const [vh, setVh] = React.useState(0)
  const idxRef = React.useRef(0)
  React.useEffect(() => {
    idxRef.current = idx
  }, [idx])

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setActive(true), 2500)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  React.useEffect(() => {
    const onRestart = () => {
      setIdx(0)
      setActive(true)
    }
    window.addEventListener('tetherpay:restart-tour', onRestart)
    return () => window.removeEventListener('tetherpay:restart-tour', onRestart)
  }, [])

  const measure = React.useCallback(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    setVw(w)
    setVh(h)
    const step = STEPS[idxRef.current]
    if (!step || step.target === 'body') {
      setRect(null)
      return
    }
    const el = document.querySelector(step.target)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) {
      setRect(null)
      return
    }
    const maxH = h * 0.6
    const height = Math.min(r.height, maxH)
    const top = r.height > maxH ? r.top + r.height / 2 - maxH / 2 : r.top
    setRect({ top, left: r.left, width: r.width, height })
  }, [])

  const finish = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: new Date().toISOString() }))
    } catch {}
    setActive(false)
  }, [])

  const next = React.useCallback(() => {
    if (idx < STEPS.length - 1) setIdx(idx + 1)
    else finish()
  }, [finish, idx])

  const prevStep = React.useCallback(() => {
    if (idx > 0) setIdx(idx - 1)
  }, [idx])

  React.useEffect(() => {
    if (!active) return
    const step = STEPS[idx]
    const el = step.target === 'body' ? null : document.querySelector(step.target)
    if (el) {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch {
        el.scrollIntoView()
      }
    }
    const t1 = setTimeout(measure, 80)
    const t2 = setTimeout(measure, 500)
    let raf = 0
    const onChange = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    window.addEventListener('resize', onChange)
    window.addEventListener('scroll', onChange, { passive: true, capture: true })
    window.addEventListener('orientationchange', onChange)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onChange, true)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [active, idx, measure])

  React.useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prevStep()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [active, finish, next, prevStep])

  const step = STEPS[idx]
  const isLast = idx === STEPS.length - 1
  const isMobile = vw > 0 && vw < 640
  const cardW = Math.min(CARD_W, (vw || 360) - PAD * 2)

  let cardLeft = 0
  let cardTop = 0
  let anchored = false
  if (rect && vw && vh && !isMobile) {
    anchored = true
    const cx = clamp(rect.left + rect.width / 2 - cardW / 2, PAD, vw - cardW - PAD)
    cardLeft = cx
    const below = rect.top + rect.height + GAP
    const above = rect.top - GAP
    const estH = 300
    if (below + estH <= vh - PAD) cardTop = below
    else if (above - estH >= PAD) cardTop = above - estH
    else if (below <= vh - PAD) cardTop = Math.max(PAD, vh - estH - PAD)
    else cardTop = PAD
  }

  const spot =
    rect && vw
      ? {
          left: clamp(rect.left - 8, 8, vw - 16),
          top: Math.max(8, rect.top - 8),
          width: Math.min(rect.width + 16, vw - 16),
          height: Math.min(rect.height + 16, vh - 16),
        }
      : null

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label="TetherPay guided tour"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={finish} aria-hidden="true" />

          {spot && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-xl border-2 border-[var(--accent)]"
              style={{
                left: spot.left,
                top: spot.top,
                width: spot.width,
                height: spot.height,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 24px rgba(31,196,192,0.35)',
              }}
            />
          )}

          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute"
            style={
              anchored
                ? { left: cardLeft, top: cardTop, width: cardW }
                : isMobile
                  ? { left: PAD, right: PAD, bottom: `max(${PAD}px, env(safe-area-inset-bottom))` }
                  : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: cardW }
            }
          >
            <div
              className="rounded-2xl p-5 shadow-float"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', width: isMobile ? '100%' : cardW }}
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                  <Sparkles className="h-4 w-4" />
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
                    initial={false}
                    animate={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={prevStep}
                  disabled={idx === 0}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <div className="flex gap-1" aria-hidden="true">
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

              <button onClick={finish} className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
                Skip tour
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
