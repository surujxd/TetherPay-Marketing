'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp, CheckCircle2 } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatINR, formatUSDT } from '@/lib/money'

type Agent = {
  rank: number
  name: string
  initials: string
  tier: 'Standard' | 'Trusted' | 'Premium'
  volume: number
  orders: number
  completion: number
  earnings: number
  trend: 'up' | 'down' | 'same'
}

const AGENTS: Agent[] = [
  { rank: 1, name: 'Priya Sharma', initials: 'PS', tier: 'Premium', volume: 4820000, orders: 1240, completion: 99.8, earnings: 9640.12, trend: 'up' },
  { rank: 2, name: 'Arjun Mehta', initials: 'AM', tier: 'Premium', volume: 4180000, orders: 1108, completion: 99.6, earnings: 8360.44, trend: 'up' },
  { rank: 3, name: 'Vikram Reddy', initials: 'VR', tier: 'Trusted', volume: 3240000, orders: 892, completion: 99.2, earnings: 5670.18, trend: 'same' },
  { rank: 4, name: 'Ananya Iyer', initials: 'AI', tier: 'Trusted', volume: 2890000, orders: 768, completion: 98.9, earnings: 5057.50, trend: 'up' },
  { rank: 5, name: 'Rohit Gupta', initials: 'RG', tier: 'Trusted', volume: 2410000, orders: 645, completion: 98.7, earnings: 4217.25, trend: 'down' },
  { rank: 6, name: 'Sneha Patel', initials: 'SP', tier: 'Standard', volume: 1860000, orders: 502, completion: 98.4, earnings: 2790.00, trend: 'up' },
  { rank: 7, name: 'Karan Singh', initials: 'KS', tier: 'Standard', volume: 1640000, orders: 438, completion: 98.1, earnings: 2460.00, trend: 'same' },
]

const TIER_COLOR: Record<Agent['tier'], string> = {
  Premium: 'text-amber-500 bg-amber-500/10',
  Trusted: 'text-[var(--accent)] bg-[var(--accent-light)]',
  Standard: 'text-sky-500 bg-sky-500/10',
}

const RANK_ICON = [Trophy, Medal, Award]

export function AgentLeaderboard() {
  const [sortBy, setSortBy] = React.useState<'volume' | 'completion' | 'orders'>('volume')

  const sorted = [...AGENTS].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume
    if (sortBy === 'completion') return b.completion - a.completion
    return b.orders - a.orders
  })

  return (
    <section id="leaderboard" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Agent leaderboard"
          title={<>Top agents by volume</>}
          subtitle="Verified agents ranked by INR settled. Premium and Trusted tiers dominate the top spots — commission scales with volume."
        />

        {/* sort selector */}
        <div className="mt-8 flex justify-center gap-1.5 rounded-xl border border-border bg-background/40 p-1 mx-auto w-fit">
          {([
            { id: 'volume', label: 'Volume' },
            { id: 'orders', label: 'Orders' },
            { id: 'completion', label: 'Completion' },
          ] as const).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                sortBy === s.id
                  ? 'bg-[var(--accent)] text-[var(--primary-foreground)] shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <GlassCard className="overflow-hidden p-0">
            {/* header */}
            <div className="grid grid-cols-[40px_1fr_80px_70px_60px] items-center gap-2 border-b border-border bg-background/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[48px_1fr_120px_90px_90px_80px] sm:px-6">
              <div>#</div>
              <div>Agent</div>
              <div className="hidden text-right sm:block">Volume</div>
              <div className="hidden text-right sm:block">Orders</div>
              <div className="hidden text-right sm:block">Comp%</div>
              <div className="text-right">Earnings</div>
            </div>

            {/* rows */}
            <div className="divide-y divide-border">
              {sorted.map((a, i) => {
                const RankIcon = i < 3 ? RANK_ICON[i] : null
                const rankColor = i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-700 dark:text-orange-400' : 'text-muted-foreground'
                return (
                  <motion.div
                    key={a.name}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="grid grid-cols-[40px_1fr_80px_70px_60px] items-center gap-2 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:grid-cols-[48px_1fr_120px_90px_90px_80px] sm:px-6"
                  >
                    <div className={`flex items-center justify-center ${rankColor}`}>
                      {RankIcon ? <RankIcon className="h-5 w-5" /> : <span className="font-mono text-sm font-semibold">{a.rank}</span>}
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] font-mono text-xs font-bold text-white">
                        {a.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{a.name}</div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${TIER_COLOR[a.tier]}`}>
                          {a.tier}
                        </span>
                      </div>
                    </div>
                    <div className="hidden text-right font-mono text-xs font-medium tabular-nums sm:block">{formatINR(a.volume.toFixed(0))}</div>
                    <div className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground sm:block">{a.orders.toLocaleString('en-IN')}</div>
                    <div className="hidden text-right sm:block">
                      <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold tabular-nums ${a.completion >= 99.5 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        <CheckCircle2 className="h-3 w-3" />
                        {a.completion}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold tabular-nums text-[var(--accent)]">{formatUSDT(a.earnings.toFixed(4))}</div>
                      <div className={`flex items-center justify-end gap-0.5 text-[10px] ${a.trend === 'up' ? 'text-emerald-500' : a.trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'}`}>
                        <TrendingUp className={`h-2.5 w-2.5 ${a.trend === 'down' ? 'rotate-180' : a.trend === 'same' ? 'opacity-30' : ''}`} />
                        {a.trend}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          Leaderboard is illustrative. Agent identities are anonymized in production. Rankings refresh daily.
        </p>
      </div>
    </section>
  )
}
