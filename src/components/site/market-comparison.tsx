'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Source = {
  name: string
  rate: number
  fee: number
  feeType: 'percent' | 'flat'
  time: string
  lock: boolean
}

const SOURCES: Source[] = [
  { name: 'TetherPay', rate: 91.5, fee: 0, feeType: 'percent', time: '~4 min', lock: true },
  { name: 'Binance P2P', rate: 90.8, fee: 0.1, feeType: 'percent', time: '5–30 min', lock: false },
  { name: 'WazirX', rate: 90.2, fee: 0.2, feeType: 'percent', time: '10–60 min', lock: false },
  { name: 'Coindcx', rate: 89.9, fee: 0.15, feeType: 'percent', time: '10–45 min', lock: false },
  { name: 'Bank wire', rate: 88.5, fee: 250, feeType: 'flat', time: '1–3 days', lock: false },
]

export function MarketComparison() {
  const [amount, setAmount] = React.useState('50000')

  const amt = Number(amount) || 0
  const usdtAmt = amt / 91.5 // base USDT for comparison

  const rows = SOURCES.map((s) => {
    const grossUsdt = amt / s.rate
    const feeUsdt = s.feeType === 'percent' ? grossUsdt * (s.fee / 100) : s.fee / s.rate
    const netUsdt = grossUsdt - feeUsdt
    const diff = netUsdt - amt / 91.5 // vs TetherPay baseline
    return { ...s, grossUsdt, feeUsdt, netUsdt, diff }
  })

  const best = rows.reduce((a, b) => (b.netUsdt > a.netUsdt ? b : a), rows[0])

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Rate comparison"
          title={<>See how TetherPay stacks up</>}
          subtitle="Compare the effective USDT you'd receive for the same INR amount across popular rails. Rates are illustrative — actual market rates fluctuate."
        />

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
            <span className="font-mono text-lg font-semibold text-muted-foreground">₹</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-28 bg-transparent font-mono text-xl font-semibold tabular-nums text-foreground outline-none sm:w-36"
              aria-label="INR amount to compare"
            />
            <span className="text-sm text-muted-foreground">INR</span>
          </div>
        </div>

        <GlassCard className="mt-6 overflow-hidden p-0">
          {/* header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-border bg-background/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-6">
            <div>Source</div>
            <div className="text-right">Rate</div>
            <div className="hidden text-right sm:block">Fee</div>
            <div className="text-right">You receive</div>
          </div>

          {/* rows */}
          <div className="divide-y divide-border">
            {rows.map((r, i) => {
              const isBest = r.name === best.name
              const isTetherPay = r.name === 'TetherPay'
              return (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-4 py-3.5 sm:px-6 ${
                    isTetherPay ? 'bg-[var(--accent-light)]/40' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isTetherPay ? 'text-[var(--accent)]' : ''}`}>{r.name}</span>
                    {r.lock && (
                      <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500">
                        LOCKED
                      </span>
                    )}
                    {isBest && !isTetherPay && (
                      <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500">
                        BEST*
                      </span>
                    )}
                  </div>
                  <div className="text-right font-mono text-sm tabular-nums">₹{r.rate.toFixed(2)}</div>
                  <div className="hidden text-right font-mono text-sm tabular-nums text-muted-foreground sm:block">
                    {r.feeType === 'percent' ? `${r.fee}%` : `₹${r.fee}`}
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-sm font-semibold tabular-nums ${isTetherPay ? 'text-[var(--accent)]' : ''}`}>
                      {r.netUsdt.toFixed(4)}
                    </span>
                    {!isTetherPay && (
                      <span className={`ml-1 inline-flex items-center text-[10px] ${r.diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {r.diff >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {Math.abs(r.diff).toFixed(4)}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </GlassCard>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          *“Best” reflects the highest net USDT for the entered amount. TetherPay&apos;s rate is locked at quote time;
          other rails may move before you settle. Comparison is illustrative.
        </p>
      </div>
    </section>
  )
}
