'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Cell = { value: string; status: 'yes' | 'no' | 'partial' }

const ROWS: { label: string; tetherpay: Cell; bank: Cell; exchange: Cell }[] = [
  {
    label: 'Settlement speed',
    tetherpay: { value: '~4 min', status: 'yes' },
    bank: { value: 'Hours–days', status: 'no' },
    exchange: { value: '10–30 min', status: 'partial' },
  },
  {
    label: 'Holds INR deposits',
    tetherpay: { value: 'No', status: 'yes' },
    bank: { value: 'Yes', status: 'no' },
    exchange: { value: 'Yes', status: 'no' },
  },
  {
    label: 'Rate locked at quote',
    tetherpay: { value: 'Yes — snapshot', status: 'yes' },
    bank: { value: 'Variable', status: 'no' },
    exchange: { value: 'Market moves', status: 'no' },
  },
  {
    label: 'UPI-native',
    tetherpay: { value: 'Yes', status: 'yes' },
    bank: { value: 'Partial', status: 'partial' },
    exchange: { value: 'No', status: 'no' },
  },
  {
    label: 'Custody model',
    tetherpay: { value: 'Ledger entry', status: 'yes' },
    bank: { value: 'Bank-held', status: 'partial' },
    exchange: { value: 'Exchange-held', status: 'partial' },
  },
  {
    label: 'Manual on-chain verify',
    tetherpay: { value: 'Yes', status: 'yes' },
    bank: { value: 'N/A', status: 'no' },
    exchange: { value: 'Automated only', status: 'no' },
  },
  {
    label: 'Per-order audit trail',
    tetherpay: { value: 'Full', status: 'yes' },
    bank: { value: 'Limited', status: 'partial' },
    exchange: { value: 'Limited', status: 'partial' },
  },
]

function StatusIcon({ status }: { status: Cell['status'] }) {
  if (status === 'yes')
    return <Check className="h-4 w-4 text-emerald-500" aria-label="yes" />
  if (status === 'no') return <X className="h-4 w-4 text-rose-500" aria-label="no" />
  return <Minus className="h-4 w-4 text-amber-500" aria-label="partial" />
}

export function Comparison() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Why TetherPay"
          title={<>Not a bank. Not an exchange. Something better for cross-asset payments.</>}
          subtitle="A focused settlement layer that moves USDT to INR without holding your rupees or acting as a trading venue."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <GlassCard className="overflow-hidden p-0">
            {/* header */}
            <div className="grid grid-cols-4 border-b-2 border-[var(--accent)]/30 bg-background/60">
              <div className="px-4 py-5 text-sm font-semibold uppercase tracking-wider text-foreground/70 sm:px-6">
                Feature
              </div>
              <div className="border-l border-border bg-[var(--accent-light)]/50 px-3 py-5 text-center sm:px-6">
                <div className="text-base font-bold text-[var(--accent)]">TetherPay</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--accent-dark)]/70 dark:text-[var(--accent)]/70">Recommended</div>
              </div>
              <div className="border-l border-border px-3 py-5 text-center sm:px-6">
                <div className="text-base font-semibold text-foreground/80">Bank wire</div>
              </div>
              <div className="border-l border-border px-3 py-5 text-center sm:px-6">
                <div className="text-base font-semibold text-foreground/80">Crypto exchange</div>
              </div>
            </div>

            {/* rows */}
            <div className="divide-y divide-border">
              {ROWS.map((r) => (
                <div key={r.label} className="grid grid-cols-4 transition-colors hover:bg-muted/30">
                  <div className="px-4 py-3.5 text-sm font-medium sm:px-6">{r.label}</div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-border px-2 py-3.5 text-center sm:px-6">
                    <StatusIcon status={r.tetherpay.status} />
                    <span className="text-[11px] text-muted-foreground sm:text-xs">{r.tetherpay.value}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-border px-2 py-3.5 text-center sm:px-6">
                    <StatusIcon status={r.bank.status} />
                    <span className="text-[11px] text-muted-foreground sm:text-xs">{r.bank.value}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-border px-2 py-3.5 text-center sm:px-6">
                    <StatusIcon status={r.exchange.status} />
                    <span className="text-[11px] text-muted-foreground sm:text-xs">{r.exchange.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          Comparison is illustrative. TetherPay is not a bank or a regulated exchange; it coordinates verified USDT
          deposits and INR payments through a managed agent network.
        </p>
      </div>
    </section>
  )
}
