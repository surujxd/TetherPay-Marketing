'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, ArrowDownToLine, TrendingDown, Sparkles } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatUSDT } from '@/lib/money'

const NETWORKS = [
  { id: 'tron', name: 'TRON (TRC-20)', fee: 1, time: '~1 min' },
  { id: 'bsc', name: 'BSC (BEP-20)', fee: 0.3, time: '~3 min' },
  { id: 'eth', name: 'Ethereum (ERC-20)', fee: 15, time: '~5 min' },
]

export function DepositCalculator() {
  const [targetAmount, setTargetAmount] = React.useState('1000')
  const [networkId, setNetworkId] = React.useState('tron')
  const [hasReferral, setHasReferral] = React.useState(false)

  const network = NETWORKS.find((n) => n.id === networkId)!
  const target = Number(targetAmount) || 0
  const fee = network.fee
  const referralCredit = hasReferral ? 1 : 0
  const youSend = Math.max(0, target + fee - referralCredit)
  const youReceive = target
  const feePercent = youSend > 0 ? (fee / youSend) * 100 : 0
  const highFeeRatio = feePercent > 2

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Deposit calculator"
          title={<>Know exactly what to send</>}
          subtitle="Enter your target credit amount and we'll show what to send — accounting for network fees and referral credits. No surprises."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Deposit planner</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]">
                <Calculator className="h-3 w-3" /> Live
              </span>
            </div>

            <label className="mt-5 block text-xs font-medium text-muted-foreground">I want to receive (USDT)</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <ArrowDownToLine className="h-4 w-4 text-[var(--accent)]" />
              <input
                type="text"
                inputMode="decimal"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-transparent font-mono text-2xl font-semibold tabular-nums text-foreground outline-none"
                placeholder="1000"
                aria-label="Target credit amount in USDT"
              />
              <span className="text-sm text-muted-foreground">USDT</span>
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">Deposit network</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {NETWORKS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNetworkId(n.id)}
                  className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                    networkId === n.id
                      ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                      : 'border-border bg-background/40 hover:bg-muted'
                  }`}
                >
                  <div className="text-[11px] font-semibold">{n.name.split(' ')[0]}</div>
                  <div className="font-mono text-xs text-muted-foreground">{n.fee}U fee</div>
                </button>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
              <button
                type="button"
                role="switch"
                aria-checked={hasReferral}
                onClick={() => setHasReferral((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  hasReferral ? 'bg-[var(--accent)]' : 'bg-muted'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${hasReferral ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium">Apply referral credit</div>
                <div className="text-[11px] text-muted-foreground">−1.00 USDT referral reward</div>
              </div>
              <Sparkles className={`h-4 w-4 ${hasReferral ? 'text-[var(--accent)]' : 'text-muted-foreground/40'}`} />
            </label>
          </GlassCard>

          {/* Results */}
          <GlassCard className="overflow-hidden p-0">
            <div className="border-b border-border bg-background/30 px-6 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Send breakdown</h3>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${networkId}-${targetAmount}-${hasReferral}`}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="space-y-1.5 p-6"
              >
                <Row label="You receive" value={formatUSDT(youReceive.toFixed(4))} accent />
                <div className="my-1 h-px bg-border" />
                <Row label="Network fee" value={`+${fee.toFixed(2)} USDT`} muted accentClass="text-amber-500" />
                {hasReferral && (
                  <Row label="Referral credit" value={`−1.00 USDT`} muted accentClass="text-emerald-500" />
                )}
                <div className="my-2 h-px bg-border" />
                <Row label="You send (total)" value={formatUSDT(youSend.toFixed(4))} strong accent />

                {/* Visual breakdown bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Composition of what you send</span>
                    <span className="font-mono">{feePercent.toFixed(2)}% fee</span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${youSend > 0 ? (youReceive / youSend) * 100 : 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      className="bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${youSend > 0 ? (fee / youSend) * 100 : 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    {hasReferral && (
                      <motion.div
                        className="bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${youSend > 0 ? (referralCredit / youSend) * 100 : 0}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px]">
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Credit</span>
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Fee</span>
                    {hasReferral && <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Referral</span>}
                  </div>
                </div>

                {highFeeRatio && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground">
                    <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>
                      Network fee is <span className="font-semibold text-amber-500">{feePercent.toFixed(2)}%</span> of your deposit.
                      {networkId === 'eth' && ' Consider TRC-20 for smaller deposits.'}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-background/40 px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">Estimated time</span>
                  <span className="font-mono font-medium">{network.time}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          Illustrative. Actual fees vary by network congestion. Snapshot rates are locked at order creation (PRD §24.1).
        </p>
      </div>
    </section>
  )
}

function Row({ label, value, strong, muted, accent, accentClass }: { label: string; value: string; strong?: boolean; muted?: boolean; accent?: boolean; accentClass?: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-sm ${muted ? 'text-muted-foreground' : 'text-foreground/80'}`}>{label}</span>
      <span className={`font-mono tabular-nums ${strong ? 'text-base font-semibold' : 'text-sm'} ${accent ? 'text-[var(--accent)]' : ''} ${accentClass ?? ''}`}>
        {value}
      </span>
    </div>
  )
}
