'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Crown, Award, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Tier = {
  name: string
  tagline: string
  commission: string
  monthlyFee: string
  payoutPriority: string
  badge: typeof Star
  badgeColor: string
  featured: boolean
  perks: string[]
}

const TIERS: Tier[] = [
  {
    name: 'Standard',
    tagline: 'For new agents getting started',
    commission: '1.50%',
    monthlyFee: 'Free',
    payoutPriority: 'Standard queue',
    badge: Award,
    badgeColor: 'text-sky-500',
    featured: false,
    perks: [
      '1.50% commission on every order',
      'Access to the public order marketplace',
      'Standard payout processing (24h)',
      'Basic analytics dashboard',
      'Community support',
    ],
  },
  {
    name: 'Trusted',
    tagline: 'For proven agents with volume',
    commission: '1.75%',
    monthlyFee: 'Free',
    payoutPriority: 'Priority queue',
    badge: Shield,
    badgeColor: 'text-[var(--accent)]',
    featured: true,
    perks: [
      '1.75% commission on every order',
      'Priority access to high-value orders',
      'Priority payout processing (4h)',
      'Advanced analytics + performance insights',
      'Dedicated support channel',
      'Partner referral rewards (5%)',
    ],
  },
  {
    name: 'Premium',
    tagline: 'For top-performing agents',
    commission: '2.00%',
    monthlyFee: 'Free',
    payoutPriority: 'Instant',
    badge: Crown,
    badgeColor: 'text-amber-500',
    featured: false,
    perks: [
      '2.00% commission on every order',
      'Instant order pre-claim (5s window)',
      'Instant USDT payouts',
      'Full treasury + reconciliation reports',
      'White-glove support + account manager',
      'Partner referral rewards (5%)',
      'Co-branded settlement pages',
    ],
  },
]

export function AgentPricing() {
  return (
    <section id="pricing" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Agent tiers"
          title={<>Earn more as you scale</>}
          subtitle="Three commission tiers reward verified agents for volume, reliability, and tenure. Upgrade automatically as you qualify — no applications, no fees."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={t.featured ? 'lg:-mt-4' : ''}
            >
              <GlassCard
                className={`relative h-full overflow-hidden p-6 sm:p-7 ${
                  t.featured ? 'border-[var(--accent)]/50 ring-2 ring-[var(--accent)]/30' : ''
                }`}
              >
                {/* featured ribbon */}
                {t.featured && (
                  <div className="absolute -right-12 top-5 rotate-45 bg-[var(--accent)] px-12 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-foreground)] shadow-accent">
                    Popular
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 ring-1 ring-border ${t.badgeColor}`}>
                    <t.badge className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{t.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{t.tagline}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold tabular-nums text-[var(--accent)]">{t.commission}</span>
                    <span className="text-sm text-muted-foreground">commission</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">{t.monthlyFee}</span> monthly · {t.payoutPriority}
                  </div>
                </div>

                <div className="my-5 h-px bg-border" />

                <ul className="space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)]">
                        <Check className="h-3 w-3 text-[var(--accent)]" />
                      </span>
                      <span className="text-foreground/80">{p}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    t.featured
                      ? 'bg-[var(--accent)] text-[var(--primary-foreground)] shadow-accent hover:brightness-110'
                      : 'border border-border bg-background/60 hover:bg-muted'
                  }`}
                >
                  {t.featured && <Sparkles className="h-4 w-4" />}
                  Apply as {t.name}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/30 px-4 py-3 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-[var(--accent)]" />
          Tier upgrades are automatic based on verified order volume + reliability score. No manual applications.
        </div>
      </div>
    </section>
  )
}
