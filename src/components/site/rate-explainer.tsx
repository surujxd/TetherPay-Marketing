'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingDown, TrendingUp, ArrowRight, Split, Users } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

const TABS = [
  { id: 'customer', label: 'Customer rate', desc: 'INR per USDT you pay' },
  { id: 'agent', label: 'Agent rate', desc: 'INR per USDT agent gets' },
  { id: 'spread', label: 'The spread', desc: 'Where the platform earns' },
] as const

type TabId = typeof TABS[number]['id']

export function RateExplainer() {
  const [tab, setTab] = React.useState<TabId>('customer')
  const [inr] = React.useState('5000')

  const customerRate = 91.5
  const agentRate = 91.0
  const commission = 1.5 // %
  const inrNum = Number(inr)
  const customerUsdt = inrNum / customerRate
  const baseAgentUsdt = inrNum / agentRate
  const commissionInr = (inrNum * commission) / 100
  const commissionUsdt = commissionInr / agentRate
  const agentTotalUsdt = baseAgentUsdt + commissionUsdt
  const spread = customerUsdt - agentTotalUsdt

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="How rates work"
          title={<>One INR amount, three perspectives</>}
          subtitle="The customer pays a rate. The agent settles at a rate. The spread between them (plus fees, minus commission) is how the platform sustains itself."
        />

        {/* Tab switcher */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`group relative rounded-2xl border px-4 py-2.5 text-left transition-all ${
                tab === t.id
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                  : 'border-border bg-background/40 hover:bg-muted/40'
              }`}
            >
              <div className={`text-sm font-semibold ${tab === t.id ? 'text-[var(--accent-dark)] dark:text-[var(--accent)]' : ''}`}>
                {t.label}
              </div>
              <div className="text-[11px] text-muted-foreground">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Visual flow */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {tab === 'customer' && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 sm:p-8">
                  <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
                    <FlowNode
                      label="You pay"
                      value={`₹${inrNum.toLocaleString('en-IN')}`}
                      sub="INR amount"
                      color="from-[var(--accent-dark)] to-[var(--accent)]"
                    />
                    <FlowArrow label={`₹${customerRate} / USDT`} />
                    <FlowNode
                      label="USDT debited"
                      value={`${customerUsdt.toFixed(4)}`}
                      sub="from your ledger"
                      color="from-emerald-600 to-emerald-500"
                      highlight
                    />
                  </div>
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    The <span className="font-semibold text-[var(--accent)]">customer quote rate</span> (₹{customerRate}/USDT) is locked
                    the moment you confirm. Market moves after that don't change your debit.
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {tab === 'agent' && (
              <motion.div
                key="agent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 sm:p-8">
                  <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                    <FlowNode
                      label="Agent pays"
                      value={`₹${inrNum.toLocaleString('en-IN')}`}
                      sub="via own UPI"
                      color="from-amber-600 to-amber-500"
                    />
                    <FlowArrow label={`₹${agentRate} / USDT`} />
                    <FlowNode
                      label="Base USDT"
                      value={baseAgentUsdt.toFixed(4)}
                      sub="reimbursement"
                      color="from-[var(--accent-dark)] to-[var(--accent)]"
                    />
                    <div className="flex flex-col items-center gap-1 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                        <span className="text-xs font-bold">+</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">{commission}% commission</span>
                    </div>
                    <FlowNode
                      label="Agent receives"
                      value={agentTotalUsdt.toFixed(4)}
                      sub="base + commission"
                      color="from-emerald-600 to-emerald-500"
                      highlight
                    />
                  </div>
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    The agent settles at <span className="font-semibold text-[var(--accent)]">₹{agentRate}/USDT</span> and earns a
                    <span className="font-semibold text-emerald-500"> {commission}% commission</span> on the INR paid. Higher tiers earn more.
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {tab === 'spread' && (
              <motion.div
                key="spread"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 sm:p-8">
                  <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                    <FlowNode
                      label="Customer pays"
                      value={`${customerUsdt.toFixed(4)}`}
                      sub="USDT debited"
                      color="from-[var(--accent-dark)] to-[var(--accent)]"
                    />
                    <FlowArrow label="minus" muted />
                    <FlowNode
                      label="Agent receives"
                      value={`${agentTotalUsdt.toFixed(4)}`}
                      sub="base + commission"
                      color="from-emerald-600 to-emerald-500"
                    />
                    <FlowArrow label="equals" muted />
                    <FlowNode
                      label="Platform spread"
                      value={spread.toFixed(4)}
                      sub="per order"
                      color={spread >= 0 ? 'from-sky-600 to-sky-500' : 'from-rose-600 to-rose-500'}
                      highlight
                    />
                  </div>
                  <div className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
                    spread >= 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {spread >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {spread >= 0
                      ? `Positive spread: platform earns ${spread.toFixed(4)} USDT on this order`
                      : `Negative spread: platform loses ${Math.abs(spread).toFixed(4)} USDT — rate config needs review`}
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Illustrative. The admin profitability calculator highlights when rate configuration produces negative contribution (PRD §11.3).
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick legend */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Users, label: 'Customer rate', value: `₹${customerRate}`, sub: 'INR per USDT you pay' },
            { icon: Split, label: 'Agent rate', value: `₹${agentRate}`, sub: 'INR per USDT agent gets' },
            { icon: TrendingUp, label: 'Commission', value: `${commission}%`, sub: 'agent tier reward' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                <l.icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{l.label}</div>
                <div className="font-mono text-lg font-semibold tabular-nums">{l.value}</div>
                <div className="text-[11px] text-muted-foreground">{l.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FlowNode({
  label,
  value,
  sub,
  color,
  highlight,
}: {
  label: string
  value: string
  sub: string
  color: string
  highlight?: boolean
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 text-center text-white ${highlight ? 'ring-2 ring-white/20' : ''}`}>
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="relative">
        <div className="text-[11px] font-medium uppercase tracking-wider text-white/70">{label}</div>
        <div className="mt-1 font-mono text-xl font-bold tabular-nums sm:text-2xl">{value}</div>
        <div className="mt-0.5 text-[11px] text-white/70">{sub}</div>
      </div>
    </div>
  )
}

function FlowArrow({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ArrowRight className={`h-5 w-5 ${muted ? 'text-muted-foreground/50' : 'text-[var(--accent)]'}`} />
      <span className={`font-mono text-[10px] ${muted ? 'text-muted-foreground' : 'text-[var(--accent)] font-semibold'}`}>{label}</span>
    </div>
  )
}
