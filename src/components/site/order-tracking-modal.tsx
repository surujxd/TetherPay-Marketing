'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Wallet,
  Send,
  ShieldCheck,
  Copy,
  Check,
  Download,
  RotateCcw,
} from 'lucide-react'
import { formatINR, formatUSDT } from '@/lib/money'

type Step = {
  id: string
  label: string
  desc: string
  time: string
  state: 'done' | 'active' | 'pending'
}

const INITIAL_STEPS: Step[] = [
  { id: 'created', label: 'Order created', desc: 'Order TP-9F2A4C placed and listed in the marketplace', time: '14:02', state: 'done' },
  { id: 'reserved', label: 'Funds reserved', desc: '54.6448 USDT reserved from your available balance', time: '14:02', state: 'done' },
  { id: 'claimed', label: 'Agent claimed', desc: 'priya-s (Trusted tier) claimed your order', time: '14:05', state: 'done' },
  { id: 'submitted', label: 'Payment submitted', desc: 'Agent sent ₹5,000 to landlord@okaxis via UPI', time: '14:08', state: 'active' },
  { id: 'verifying', label: 'Manager verifying', desc: 'Operations is verifying the UPI payment proof', time: '—', state: 'pending' },
  { id: 'confirmed', label: 'Payment confirmed', desc: 'Receipt generated and balance updated', time: '—', state: 'pending' },
]

export function OrderTrackingButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <OrderTrackingModal open={open} onOpenChange={setOpen} />
    </>
  )
}

function OrderTrackingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [steps, setSteps] = React.useState(INITIAL_STEPS)
  const [completed, setCompleted] = React.useState(false)

  // Esc to close
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // Auto-advance the timeline when opened
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setSteps(INITIAL_STEPS); setCompleted(false) }, 300)
      return () => clearTimeout(t)
    }
    setSteps(INITIAL_STEPS)
    setCompleted(false)

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => i === 3 ? { ...s, state: 'done' } : i === 4 ? { ...s, state: 'active', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : s))
    }, 2500))
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => i === 4 ? { ...s, state: 'done' } : i === 5 ? { ...s, state: 'active', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : s))
    }, 5000))
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => s.state === 'active' ? { ...s, state: 'done' } : s))
      setCompleted(true)
    }, 7000))

    return () => timers.forEach(clearTimeout)
  }, [open])

  const reset = () => {
    setSteps(INITIAL_STEPS)
    setCompleted(false)
    // re-trigger
    setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => i === 3 ? { ...s, state: 'done' } : i === 4 ? { ...s, state: 'active', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } : s))
    }, 2500)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Live order tracking demo"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden="true" />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Order tracking</div>
                  <div className="text-[11px] text-muted-foreground">Live demo · auto-advancing timeline</div>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background/60 transition-colors hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[68vh] overflow-y-auto scroll-area p-5 sm:p-6">
              {/* order summary */}
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Order ID</div>
                    <div className="font-mono text-base font-bold">TP-9F2A4C</div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${completed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                    {completed ? 'Completed' : 'In progress'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Recipient</div>
                    <div className="truncate font-mono text-xs font-medium">landlord@okaxis</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">Amount</div>
                    <div className="font-mono text-xs font-semibold">{formatINR('5000')}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">USDT debit</div>
                    <div className="font-mono text-xs font-semibold text-[var(--accent)]">54.6448</div>
                  </div>
                </div>
              </div>

              {/* timeline */}
              <div className="mt-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline</div>
                <div className="space-y-0">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.id}
                      layout
                      className="flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                            s.state === 'done'
                              ? 'bg-emerald-500 text-white'
                              : s.state === 'active'
                              ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20'
                              : 'border border-border bg-background text-muted-foreground'
                          }`}
                          animate={s.state === 'active' ? { scale: [1, 1.08, 1] } : {}}
                          transition={s.state === 'active' ? { duration: 1.5, repeat: Infinity } : {}}
                        >
                          {s.state === 'done' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : s.state === 'active' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <span className="text-[10px]">{i + 1}</span>
                          )}
                        </motion.div>
                        {i < steps.length - 1 && (
                          <div className={`my-0.5 h-8 w-px transition-colors ${s.state === 'done' ? 'bg-emerald-500/40' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-3">
                        <div className={`text-sm ${s.state === 'pending' ? 'text-muted-foreground' : 'font-medium'}`}>
                          {s.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{s.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* completed state */}
              <AnimatePresence>
                {completed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-600/20 to-[var(--accent)]/20 border border-emerald-500/20 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Payment confirmed</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ₹5,000 delivered to landlord@okaxis. Receipt is ready.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--primary-foreground)] transition-all hover:brightness-110">
                          <Download className="h-3.5 w-3.5" /> Download receipt
                        </button>
                        <button
                          onClick={reset}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Replay
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
