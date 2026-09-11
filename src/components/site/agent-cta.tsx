'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Users, Wallet, TrendingUp } from 'lucide-react'
import { GlassCard } from './primitives'

export function AgentCta() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="relative overflow-hidden p-8 sm:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/15 blur-[80px]" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[var(--accent-dark)]/20 blur-[70px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent-dark)] dark:text-[var(--accent)]">
                  <Users className="h-3.5 w-3.5" /> Agent network
                </span>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Turn your UPI liquidity into USDT earnings
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
                  Agents fulfil customer INR payments through their own UPI channel and get reimbursed in USDT plus a
                  tier-based commission. Built-in partner rewards let you earn from agents you refer.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    Apply to become an agent
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#calculator"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background/60 px-6 text-sm font-semibold backdrop-blur transition-all hover:bg-muted"
                  >
                    Estimate earnings
                    <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Wallet, label: 'Reimbursement', value: 'USDT base', sub: 'INR paid ÷ agent rate' },
                  { icon: TrendingUp, label: 'Commission', value: '1.50–2.00%', sub: 'by tier' },
                  { icon: Users, label: 'Partner reward', value: '5%', sub: 'on referral commissions' },
                  { icon: ArrowRight, label: 'Payouts', value: 'On-demand', sub: 'to your wallet' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-background/40 p-4">
                    <s.icon className="h-5 w-5 text-[var(--accent)]" />
                    <div className="mt-3 text-lg font-semibold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground/70">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
