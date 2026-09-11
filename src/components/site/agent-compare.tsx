'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, X, Minus, Users } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatINR, formatUSDT } from '@/lib/money'

type AgentProfile = {
  id: string
  name: string
  tier: 'Standard' | 'Trusted' | 'Premium'
  commission: string
  monthlyVolume: string
  completion: string
  payoutTime: string
  partnerReward: string
  perks: string[]
  cons: string[]
}

const AGENTS: AgentProfile[] = [
  {
    id: 'newbie',
    name: 'New agent',
    tier: 'Standard',
    commission: '1.50%',
    monthlyVolume: '₹0 – ₹10L',
    completion: '98%+',
    payoutTime: '24h',
    partnerReward: '5%',
    perks: ['Public marketplace access', 'Basic analytics', 'Community support'],
    cons: ['Standard payout queue', 'No pre-claim window'],
  },
  {
    id: 'pro',
    name: 'Proven agent',
    tier: 'Trusted',
    commission: '1.75%',
    monthlyVolume: '₹10L – ₹50L',
    completion: '99%+',
    payoutTime: '4h',
    partnerReward: '5%',
    perks: ['Priority high-value orders', 'Advanced analytics', 'Dedicated support channel', 'Partner referral rewards'],
    cons: ['No instant payouts'],
  },
  {
    id: 'elite',
    name: 'Top performer',
    tier: 'Premium',
    commission: '2.00%',
    monthlyVolume: '₹50L+',
    completion: '99.5%+',
    payoutTime: 'Instant',
    partnerReward: '5%',
    perks: ['Instant pre-claim (5s)', 'Instant USDT payouts', 'Full treasury reports', 'Account manager', 'Co-branded pages'],
    cons: ['High volume threshold'],
  },
]

const COMPARISON_ROWS: { label: string; key: (a: AgentProfile) => string; highlight?: (a: AgentProfile) => boolean }[] = [
  { label: 'Commission rate', key: (a) => a.commission },
  { label: 'Monthly volume range', key: (a) => a.monthlyVolume },
  { label: 'Completion rate', key: (a) => a.completion, highlight: (a) => parseFloat(a.completion) >= 99 },
  { label: 'Payout processing', key: (a) => a.payoutTime, highlight: (a) => a.payoutTime === 'Instant' },
  { label: 'Partner reward', key: (a) => a.partnerReward + ' on referrals' },
]

export function AgentCompare() {
  const [leftId, setLeftId] = React.useState('newbie')
  const [rightId, setRightId] = React.useState('pro')

  const left = AGENTS.find((a) => a.id === leftId)!
  const right = AGENTS.find((a) => a.id === rightId)!
  const showDiff = leftId !== rightId

  const compareValue = (l: string, r: string) => {
    // Extract numeric values for comparison
    const ln = parseFloat(l.replace(/[^0-9.]/g, '')) || 0
    const rn = parseFloat(r.replace(/[^0-9.]/g, '')) || 0
    if (ln === rn) return 'same' as const
    return ln > rn ? 'left' as const : 'right' as const
  }

  return (
    <section id="compare-agents" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Compare agents"
          title={<>Side-by-side agent tier comparison</>}
          subtitle="Pick two agent profiles and compare their commission, volume, perks, and limitations head-to-head."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {/* Selector */}
          {(['left', 'right'] as const).map((side) => {
            const selectedId = side === 'left' ? leftId : rightId
            const setFn = side === 'left' ? setLeftId : setRightId
            return (
              <div key={side} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {side === 'left' ? 'Compare' : 'vs'}
                </span>
                <div className="flex gap-1.5">
                  {AGENTS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setFn(a.id)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedId === a.id
                          ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]'
                          : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {a.tier}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Comparison cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="wait">
              {[left, right].map((agent, idx) => (
                <motion.div
                  key={agent.id + idx}
                  initial={{ opacity: 0, x: idx === 0 ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard className="h-full p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">{agent.name}</div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          agent.tier === 'Premium' ? 'bg-amber-500/10 text-amber-500' :
                          agent.tier === 'Trusted' ? 'bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]' :
                          'bg-sky-500/10 text-sky-500'
                        }`}>
                          {agent.tier}
                        </span>
                      </div>
                      {idx === 0 && showDiff && (
                        <Trophy className="h-5 w-5 text-amber-500" aria-label="vs" />
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      {COMPARISON_ROWS.map((row) => (
                        <div key={row.label} className="flex items-center justify-between border-b border-border/50 py-1.5 text-sm last:border-0">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className={`font-mono font-semibold tabular-nums ${row.highlight?.(agent) ? 'text-emerald-500' : ''}`}>
                            {row.key(agent)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
                        <Check className="h-3 w-3" /> Perks
                      </div>
                      <ul className="space-y-1">
                        {agent.perks.map((p) => (
                          <li key={p} className="flex items-start gap-1.5 text-xs text-foreground/80">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-500">
                        <X className="h-3 w-3" /> Limitations
                      </div>
                      <ul className="space-y-1">
                        {agent.cons.map((c) => (
                          <li key={c} className="flex items-start gap-1.5 text-xs text-foreground/80">
                            <Minus className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/30 px-4 py-3 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-[var(--accent)]" />
          Tier upgrades are automatic — based on verified 30-day volume + completion rate. No manual applications.
        </div>
      </div>
    </section>
  )
}
