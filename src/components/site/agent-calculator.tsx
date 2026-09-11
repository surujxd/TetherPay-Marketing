'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Wallet, Sparkles } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatINR, formatUSDT } from '@/lib/money'

const TIERS = [
  { key: 'STANDARD', rate: '1.50', label: 'Standard', desc: 'New agents' },
  { key: 'TRUSTED', rate: '1.75', label: 'Trusted', desc: 'After 100+ orders' },
  { key: 'PREMIUM', rate: '2.00', label: 'Premium', desc: 'Top performers' },
]

export function AgentCalculator() {
  const [volume, setVolume] = React.useState('500000')
  const [tierIdx, setTierIdx] = React.useState(0)
  const [agentRate, setAgentRate] = React.useState('91.00')

  const tier = TIERS[tierIdx]
  const vol = Number(volume) || 0
  const commissionInr = (vol * Number(tier.rate)) / 100
  const baseUsdt = vol / Number(agentRate)
  const commissionUsdt = commissionInr / Number(agentRate)
  const monthlyUsdt = baseUsdt + commissionUsdt
  const yearlyUsdt = monthlyUsdt * 12

  return (
    <section id="agents" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="For agents"
              title={<>Provide INR liquidity. Earn in USDT.</>}
              subtitle="Agents pay recipients via their own UPI channel and are reimbursed in USDT plus commission. Illustrative earnings below — not guaranteed."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Wallet, label: 'Reimbursed in USDT', sub: 'base + commission' },
                { icon: TrendingUp, label: 'Tier-based rates', sub: '1.50% → 2.00%' },
                { icon: Users, label: 'Partner rewards', sub: '5% on referrals' },
              ].map((b) => (
                <div key={b.label} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                    <b.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{b.label}</div>
                    <div className="text-xs text-muted-foreground">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Apply to become an agent
              <Sparkles className="h-4 w-4" />
            </a>
          </div>

          {/* Calculator card */}
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Earnings estimator</h3>
              <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]">
                Illustrative
              </span>
            </div>

            <label className="mt-5 block text-sm font-medium text-muted-foreground">Monthly INR volume</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
              <span className="font-mono text-xl font-semibold text-muted-foreground">₹</span>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={50000}
                value={Math.min(5000000, Math.max(50000, vol))}
                onChange={(e) => setVolume(e.target.value)}
                className="hidden flex-1 accent-[var(--accent)] md:block"
                aria-label="Monthly INR volume slider"
              />
              <input
                type="text"
                inputMode="decimal"
                value={volume}
                onChange={(e) => setVolume(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-transparent font-mono text-2xl font-semibold tabular-nums outline-none md:w-32 md:text-right"
                aria-label="Monthly INR volume"
              />
            </div>
            <input
              type="range"
              min={50000}
              max={5000000}
              step={50000}
              value={Math.min(5000000, Math.max(50000, vol))}
              onChange={(e) => setVolume(e.target.value)}
              className="mt-3 w-full accent-[var(--accent)] md:hidden"
              aria-label="Monthly INR volume slider"
            />

            <div className="mt-5">
              <label className="text-sm font-medium text-muted-foreground">Agent settlement rate</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-2.5">
                <span className="font-mono text-sm text-muted-foreground">₹</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={agentRate}
                  onChange={(e) => setAgentRate(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full bg-transparent font-mono text-lg font-semibold tabular-nums outline-none"
                />
                <span className="text-xs text-muted-foreground">/ USDT</span>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Commission tier</label>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t, i) => (
                  <button
                    key={t.key}
                    onClick={() => setTierIdx(i)}
                    className={`rounded-2xl border px-3 py-2.5 text-center transition-all ${
                      tierIdx === i
                        ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                        : 'border-border bg-background/40 hover:bg-muted'
                    }`}
                  >
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="font-mono text-base font-semibold text-[var(--accent)]">{t.rate}%</div>
                    <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={monthlyUsdt.toFixed(2)}
              initial={{ opacity: 0.6, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 grid grid-cols-2 gap-3"
            >
              <div className="rounded-2xl bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)] p-4 text-white">
                <div className="text-xs text-white/80">Est. monthly earnings</div>
                <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatUSDT(monthlyUsdt.toFixed(8))}</div>
                <div className="mt-1 text-xs text-white/70">incl. {formatINR(commissionInr.toFixed(2))} commission</div>
              </div>
              <div className="rounded-2xl bg-muted/60 p-4">
                <div className="text-xs text-muted-foreground">Est. yearly earnings</div>
                <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatUSDT(yearlyUsdt.toFixed(8))}</div>
                <div className="mt-1 text-xs text-muted-foreground">at current volume & tier</div>
              </div>
            </motion.div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Illustrative only — not guaranteed. Earnings depend on order availability, tier, and rate configuration.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
