'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Wallet, ArrowDownToLine, Calculator, Info } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatUSDT } from '@/lib/money'

const NETWORKS = [
  { id: 'tron', name: 'TRON (TRC-20)', fee: 1, time: '~1 min' },
  { id: 'bsc', name: 'BSC (BEP-20)', fee: 0.3, time: '~3 min' },
  { id: 'eth', name: 'Ethereum (ERC-20)', fee: 15, time: '~5 min' },
]

export function WithdrawalCalculator() {
  const [balance, setBalance] = React.useState('55.7692')
  const [networkId, setNetworkId] = React.useState('tron')
  const [withdrawAmt, setWithdrawAmt] = React.useState('50')

  const network = NETWORKS.find((n) => n.id === networkId)!
  const balNum = Number(balance) || 0
  const wdNum = Number(withdrawAmt) || 0
  const fee = network.fee
  const receivable = Math.max(0, wdNum - fee)
  const feePercent = wdNum > 0 ? (fee / wdNum) * 100 : 0
  const remainingAfter = Math.max(0, balNum - wdNum)
  const tooMuch = wdNum > balNum
  const highFeeRatio = feePercent > 2

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Agent withdrawals"
          title={<>Plan your USDT payout</>}
          subtitle="Agents request USDT payouts to an external wallet. Estimate the network fee and what you'll actually receive — before you request."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* Inputs */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Withdrawal request</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]">
                <Calculator className="h-3 w-3" /> Estimator
              </span>
            </div>

            <label className="mt-5 block text-xs font-medium text-muted-foreground">Available agent balance</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-2.5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                inputMode="decimal"
                value={balance}
                onChange={(e) => setBalance(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-transparent font-mono text-lg font-semibold tabular-nums text-foreground outline-none"
                aria-label="Available agent balance"
              />
              <span className="text-xs text-muted-foreground">USDT</span>
            </div>

            <label className="mt-4 block text-xs font-medium text-muted-foreground">Withdraw amount</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <ArrowDownToLine className="h-4 w-4 text-[var(--accent)]" />
              <input
                type="text"
                inputMode="decimal"
                value={withdrawAmt}
                onChange={(e) => setWithdrawAmt(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-transparent font-mono text-2xl font-semibold tabular-nums text-foreground outline-none"
                aria-label="Withdraw amount in USDT"
              />
              <span className="text-sm text-muted-foreground">USDT</span>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Payout network</label>
              <div className="grid grid-cols-3 gap-2">
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
                    <div className="font-mono text-xs text-muted-foreground">{n.fee}U</div>
                  </button>
                ))}
              </div>
            </div>

            {tooMuch && (
              <p className="mt-3 text-xs text-rose-500">Withdrawal exceeds your available balance.</p>
            )}
          </GlassCard>

          {/* Results */}
          <GlassCard className="overflow-hidden p-0">
            <div className="border-b border-border bg-background/30 px-6 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payout breakdown</h3>
            </div>

            <motion.div key={`${networkId}-${withdrawAmt}`} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="space-y-1.5 p-6">
              <Row label="Withdraw amount" value={formatUSDT(wdNum.toFixed(8))} />
              <Row label="Network fee" value={`−${fee.toFixed(2)} USDT`} muted accent="text-amber-500" />
              <div className="my-2 h-px bg-border" />
              <Row label="You receive" value={formatUSDT(receivable.toFixed(8))} strong accent="text-[var(--accent)]" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/60 p-3">
                  <div className="text-[11px] text-muted-foreground">Balance before</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{formatUSDT(balNum.toFixed(4))}</div>
                </div>
                <div className={`rounded-xl p-3 ${tooMuch ? 'bg-rose-500/10' : 'bg-muted/60'}`}>
                  <div className="text-[11px] text-muted-foreground">Balance after</div>
                  <div className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${tooMuch ? 'text-rose-500' : ''}`}>
                    {formatUSDT(remainingAfter.toFixed(4))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-background/40 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">{network.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/40 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">Estimated time</span>
                <span className="font-mono font-medium">{network.time}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/40 px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">Fee as % of withdrawal</span>
                <span className={`font-mono font-medium ${highFeeRatio ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {feePercent.toFixed(2)}%
                </span>
              </div>

              {highFeeRatio && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>
                    Network fee is <span className="font-semibold text-amber-500">{feePercent.toFixed(2)}%</span> of your
                    withdrawal. Consider TRC-20 or batching smaller payouts.
                  </span>
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Payouts are reviewed and sent manually by treasury. Reimbursement + commission must clear before requesting.
              </p>
            </motion.div>
          </GlassCard>
        </div>
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
  accent?: string
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-sm ${muted ? 'text-muted-foreground' : 'text-foreground/80'}`}>{label}</span>
      <span
        className={`font-mono tabular-nums ${strong ? 'text-base font-semibold' : 'text-sm'} ${accent ?? ''}`}
      >
        {value}
      </span>
    </div>
  )
}
