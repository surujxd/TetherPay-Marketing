'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Network as NetworkIcon, Zap, Clock, ShieldCheck, Check, AlertTriangle } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Network = {
  id: string
  name: string
  shortName: string
  fee: string
  feeUsdt: number
  time: string
  timeMins: number
  reliability: number
  recommended: boolean
  color: string
  desc: string
}

const NETWORKS: Network[] = [
  {
    id: 'tron',
    name: 'TRON (TRC-20)',
    shortName: 'TRC-20',
    fee: '~1 USDT',
    feeUsdt: 1,
    time: '~1 min',
    timeMins: 1,
    reliability: 99.9,
    recommended: true,
    color: '#16A6A3',
    desc: 'Lowest fees and fastest confirmation. Recommended for USDT deposits.',
  },
  {
    id: 'bsc',
    name: 'BSC (BEP-20)',
    shortName: 'BEP-20',
    fee: '~0.3 USDT',
    feeUsdt: 0.3,
    time: '~3 min',
    timeMins: 3,
    reliability: 99.5,
    recommended: false,
    color: '#F0B90B',
    desc: 'Very low fees with reasonable speed. Good alternative to TRON.',
  },
  {
    id: 'eth',
    name: 'Ethereum (ERC-20)',
    shortName: 'ERC-20',
    fee: '~15 USDT',
    feeUsdt: 15,
    time: '~5 min',
    timeMins: 5,
    reliability: 99.99,
    recommended: false,
    color: '#627EEA',
    desc: 'Highest security but expensive gas. Use only for large deposits.',
  },
]

export function NetworkChooser() {
  const [selected, setSelected] = React.useState<Network>(NETWORKS[0])
  const [amount, setAmount] = React.useState('1000')

  const amountNum = Number(amount) || 0
  const totalCost = amountNum + selected.feeUsdt
  const lossPercent = amountNum > 0 ? (selected.feeUsdt / amountNum) * 100 : 0

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Network chooser"
          title={<>Pick the right chain for your deposit</>}
          subtitle="Compare fees, speed, and reliability across supported USDT networks. TRC-20 is recommended for most deposits — lowest cost, fastest settlement."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* Network cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {NETWORKS.map((n, i) => (
              <motion.button
                key={n.id}
                onClick={() => setSelected(n)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                  selected.id === n.id
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-accent'
                    : 'border-border bg-background/40 hover:border-[var(--accent)]/40 hover:bg-muted/40'
                }`}
              >
                {n.recommended && (
                  <span className="absolute right-2 top-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                    Best
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ background: n.color }}
                  >
                    <NetworkIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold">{n.shortName}</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Fee</span>
                    <span className="font-mono text-xs font-semibold">{n.fee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Time</span>
                    <span className="font-mono text-xs font-semibold">{n.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Uptime</span>
                    <span className="font-mono text-xs font-semibold text-emerald-500">{n.reliability}%</span>
                  </div>
                </div>
                {selected.id === n.id && (
                  <motion.span
                    layoutId="net-select"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)]"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Cost preview */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cost preview</h3>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ background: selected.color }}
              >
                {selected.shortName}
              </span>
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">Deposit amount (USDT)</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-transparent font-mono text-2xl font-semibold tabular-nums text-foreground outline-none"
                placeholder="1000"
                aria-label="Deposit amount in USDT"
              />
              <span className="text-sm font-medium text-muted-foreground">USDT</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-2 rounded-2xl bg-muted/60 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">You deposit</span>
                  <span className="font-mono font-semibold tabular-nums">{amountNum.toFixed(2)} USDT</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network fee</span>
                  <span className="font-mono font-semibold tabular-nums text-amber-500">−{selected.feeUsdt} USDT</span>
                </div>
                <div className="my-1 h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Credited to ledger</span>
                  <span className="font-mono text-base font-bold tabular-nums text-[var(--accent)]">{Math.max(0, amountNum - selected.feeUsdt).toFixed(2)} USDT</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Warning for high fee ratio */}
            {amountNum > 0 && lossPercent > 1.5 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  Network fee is <span className="font-semibold text-amber-500">{lossPercent.toFixed(2)}%</span> of your deposit.
                  {selected.id === 'eth' && ' Consider TRC-20 for small deposits.'}
                </span>
              </motion.div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-background/40 p-2.5">
                <Zap className="mx-auto h-3.5 w-3.5 text-[var(--accent)]" />
                <div className="mt-1 text-[10px] text-muted-foreground">Speed</div>
                <div className="font-mono text-xs font-semibold">{selected.timeMins}m</div>
              </div>
              <div className="rounded-xl bg-background/40 p-2.5">
                <ShieldCheck className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                <div className="mt-1 text-[10px] text-muted-foreground">Reliability</div>
                <div className="font-mono text-xs font-semibold">{selected.reliability}%</div>
              </div>
              <div className="rounded-xl bg-background/40 p-2.5">
                <Clock className="mx-auto h-3.5 w-3.5 text-sky-500" />
                <div className="mt-1 text-[10px] text-muted-foreground">Fee</div>
                <div className="font-mono text-xs font-semibold">{selected.feeUsdt}U</div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{selected.desc}</p>
          </GlassCard>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/30 px-4 py-3 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          Always confirm the network matches your wallet. Cross-network sends can result in permanent loss of funds.
        </div>
      </div>
    </section>
  )
}
