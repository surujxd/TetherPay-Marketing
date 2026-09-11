'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Loader2, CheckCircle2, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { toast } from 'sonner'

export function RateAlertForm() {
  const [email, setEmail] = React.useState('')
  const [direction, setDirection] = React.useState<'above' | 'below'>('above')
  const [threshold, setThreshold] = React.useState('92.00')
  const [digest, setDigest] = React.useState<'none' | 'daily' | 'weekly'>('weekly')
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [count, setCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetch('/api/rate-alerts')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => {})
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/rate-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, direction, threshold }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        setCount((c) => (c ?? 0) + 1)
        toast.success(data.message)
      } else {
        toast.error(data.error ?? 'Failed to set alert')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const currentRate = 91.5
  const thresholdNum = Number(threshold) || 0
  const wouldTrigger =
    direction === 'above' ? currentRate >= thresholdNum : currentRate <= thresholdNum

  return (
    <section id="rate-alert" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Rate alerts"
          title={<>Get notified when the rate moves</>}
          subtitle="Set a threshold and we'll email you the moment INR/USDT crosses it. Never miss a good rate again."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <GlassCard className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/15 blur-[60px]" />

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold">Alert set!</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    We&apos;ll email <span className="font-medium text-foreground">{email}</span> when INR/USDT goes{' '}
                    <span className="font-semibold text-[var(--accent)]">{direction} ₹{threshold}</span>.
                    {digest !== 'none' && (
                      <span className="block mt-1">
                        Plus a <span className="font-medium text-[var(--accent)]">{digest}</span> rate digest.
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => { setDone(false); setEmail('') }}
                    className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Set another alert
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  className="relative space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
                        <Bell className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">Rate alert subscription</h3>
                        <p className="text-[11px] text-muted-foreground">
                          {count !== null && `${count.toLocaleString('en-IN')} active alerts · `}
                          Current rate: ₹{currentRate.toFixed(2)} / USDT
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
                      <TrendingUp className="h-3 w-3" /> Live
                    </span>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notify me when</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDirection('above')}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                            direction === 'above'
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                              : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <ArrowUp className="h-3.5 w-3.5" /> Above
                        </button>
                        <button
                          type="button"
                          onClick={() => setDirection('below')}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                            direction === 'below'
                              ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                              : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <ArrowDown className="h-3.5 w-3.5" /> Below
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Threshold (₹/USDT)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        required
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="92.00"
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 font-mono text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    </div>
                  </div>

                  {/* Digest frequency */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Also subscribe to rate digest?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'none', label: 'No digest' },
                        { id: 'daily', label: 'Daily' },
                        { id: 'weekly', label: 'Weekly' },
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDigest(opt.id)}
                          className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                            digest === opt.id
                              ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]'
                              : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {wouldTrigger && thresholdNum > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Current rate (₹{currentRate.toFixed(2)}) already {direction} your threshold — you&apos;d be alerted immediately.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                    Set rate alert
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    We&apos;ll only email you about rate alerts. Unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
