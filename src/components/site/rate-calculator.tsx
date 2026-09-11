'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calculator, Loader2, RefreshCw, ShieldCheck, Timer, Zap } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatINR, formatUSDT } from '@/lib/money'
import { toast } from 'sonner'

type Quote = {
  inrAmount: string
  platformFeeInr: string
  totalInr: string
  usdtDebit: string
  rate: string
}
type Settlement = {
  baseUsdt: string
  commissionInr: string
  commissionUsdt: string
  totalUsdt: string
}

const PRESETS = ['500', '2000', '5000', '10000', '25000']

export function RateCalculator() {
  const [inr, setInr] = React.useState('5000')
  const [rates, setRates] = React.useState<{ customer_quote_rate: string; agent_settlement_rate: string; standard_commission_rate: string } | null>(null)
  const [quote, setQuote] = React.useState<Quote | null>(null)
  const [settlement, setSettlement] = React.useState<Settlement | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [available, setAvailable] = React.useState('1248.5040')

  // fetch live rates once
  React.useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((d) => setRates(d.settings))
      .catch(() => {})
  }, [])

  // debounce compute
  React.useEffect(() => {
    if (!/^\d+(\.\d+)?$/.test(inr) || Number(inr) <= 0) {
      setQuote(null)
      setSettlement(null)
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inrAmount: inr }),
        })
        const data = await res.json()
        setQuote(data.quote)
        setSettlement(data.settlement)
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [inr])

  const usdtDebit = quote ? Number(quote.usdtDebit) : 0
  const after = Math.max(0, Number(available) - usdtDebit)
  const insufficient = usdtDebit > Number(available)

  return (
    <section id="calculator" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Live rate calculator"
          title={<>See exactly what you&apos;ll pay</>}
          subtitle="Enter an INR amount to get a transparent quote. The rate is snapshotted and locked the moment you confirm a payment order."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* Input panel */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">You pay (INR)</label>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]">
                <Calculator className="h-3 w-3" /> Live quote
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <span className="font-mono text-2xl font-semibold text-muted-foreground">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={inr}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, '')
                  setInr(v)
                }}
                className="w-full bg-transparent font-mono text-3xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
                placeholder="5000"
                aria-label="INR amount to pay"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInr(p)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    inr === p
                      ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]'
                      : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  ₹{Number(p).toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Available balance</span>
              <span className="font-mono font-semibold tabular-nums">{formatUSDT(available)}</span>
            </div>

            <button
              disabled={!quote || insufficient || loading}
              onClick={() => {
                if (insufficient) {
                  toast.error('Insufficient USDT balance. Deposit more to cover this payment.')
                  return
                }
                toast.success('Quote locked — order reserved at ₹' + quote?.rate + ' / USDT', {
                  description: 'USDT debited: ' + formatUSDT(quote?.usdtDebit ?? '0'),
                })
                setAvailable(after.toFixed(4))
              }}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {insufficient ? 'Insufficient balance' : 'Reserve & lock rate'}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
              Rate locked at quote time — never changes after confirmation.
            </p>
          </GlassCard>

          {/* Breakdown panel */}
          <GlassCard className="overflow-hidden p-0">
            <div className="border-b border-border bg-background/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quote breakdown</h3>
                <RefreshTimer />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {quote ? (
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1 p-6"
                >
                  <Row label="INR amount" value={formatINR(quote.inrAmount)} />
                  <Row label="Platform fee" value={formatINR(quote.platformFeeInr)} muted />
                  <div className="my-2 h-px bg-border" />
                  <Row label="Total INR" value={formatINR(quote.totalInr)} strong />
                  <div className="my-3 flex items-center justify-between rounded-xl bg-[var(--accent-light)] px-4 py-3">
                    <span className="text-sm font-medium text-muted-foreground">Locked rate</span>
                    <span className="font-mono text-lg font-semibold tabular-nums text-[var(--accent-dark)] dark:text-[var(--accent)]">
                      ₹{Number(quote.rate).toFixed(2)} / USDT
                    </span>
                  </div>
                  <Row
                    label="USDT debit"
                    value={formatUSDT(quote.usdtDebit)}
                    strong
                    accent
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MiniStat label="Available" value={formatUSDT(available)} />
                    <MiniStat
                      label="After payment"
                      value={formatUSDT(after)}
                      danger={insufficient}
                    />
                  </div>

                  {settlement && (
                    <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/30 p-4">
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5" /> Agent settlement (illustrative)
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <span className="text-muted-foreground">Base USDT</span>
                        <span className="text-right font-mono tabular-nums">{formatUSDT(settlement.baseUsdt)}</span>
                        <span className="text-muted-foreground">Commission (1.50%)</span>
                        <span className="text-right font-mono tabular-nums text-emerald-500">+{formatUSDT(settlement.commissionUsdt)}</span>
                        <span className="font-medium">Agent receives</span>
                        <span className="text-right font-mono font-semibold tabular-nums">{formatUSDT(settlement.totalUsdt)}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter an amount to see your quote'}
                </div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          <RefreshCw className="mr-1 inline h-3 w-3" />
          Rates are illustrative and subject to change. Snapshot rates are locked at order creation. (PRD §24.1)
        </p>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  strong,
  muted,
  accent,
}: {
  label: string
  value: string
  strong?: boolean
  muted?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-sm ${muted ? 'text-muted-foreground' : 'text-foreground/80'}`}>{label}</span>
      <span
        className={`font-mono tabular-nums ${
          strong ? 'text-lg font-semibold' : 'text-base'
        } ${accent ? 'text-[var(--accent)]' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function MiniStat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${danger ? 'bg-rose-500/10' : 'bg-muted/60'}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${danger ? 'text-rose-500' : ''}`}>{value}</div>
    </div>
  )
}

/** A 5-minute quote countdown — illustrative of the order expiry timer (PRD A14). */
function RefreshTimer() {
  const [secs, setSecs] = React.useState(300)
  React.useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 300 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const low = secs <= 60
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${low ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
      <Timer className="h-3 w-3" />
      <span className="font-mono tabular-nums">{mm}:{ss}</span>
    </span>
  )
}
