'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Gift, Users, Share2, Sparkles } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { toast } from 'sonner'

const REFERRAL_CODE = 'TP-EARN-4F2A'

const STATS = [
  { label: 'Friends invited', value: '12' },
  { label: 'Qualified', value: '7' },
  { label: 'Rewards earned', value: '7.00 USDT' },
  { label: 'Pending', value: '5' },
]

export function ReferralPanel() {
  const [copied, setCopied] = React.useState<'code' | 'link' | null>(null)
  const link = `https://tetherpay.fun/r/${REFERRAL_CODE}`

  const copy = async (which: 'code' | 'link') => {
    const text = which === 'code' ? REFERRAL_CODE : link
    try {
      // Try modern clipboard API first (requires secure context / HTTPS)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Legacy fallback for non-secure contexts
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(which)
      toast.success(which === 'code' ? 'Referral code copied' : 'Referral link copied')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Could not copy — please select and copy manually')
    }
  }

  return (
    <section id="referrals" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Referrals"
          title={<>Invite friends. Earn USDT when they pay.</>}
          subtitle="One-level referral depth — earn a USDT reward the first time each referred customer completes a payment order. No MLM, no multi-tier gaming."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Code + link card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="relative h-full overflow-hidden p-7">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/15 blur-[60px]" />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
                  <Gift className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">Your referral code</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share this code or link. You earn <span className="font-semibold text-[var(--accent)]">1.00 USDT</span> per qualifying referral.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent-light)]/40 px-4 py-3">
                    <span className="font-mono text-lg font-bold tracking-wider text-[var(--accent-dark)] dark:text-[var(--accent)]">
                      {REFERRAL_CODE}
                    </span>
                    <button
                      onClick={() => copy('code')}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-background/70 px-3 py-1.5 text-xs font-medium transition-all hover:bg-background"
                      aria-label="Copy referral code"
                    >
                      {copied === 'code' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === 'code' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3">
                    <Share2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-mono text-sm">{link}</span>
                    <button
                      onClick={() => copy('link')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition-all hover:brightness-110"
                    >
                      {copied === 'link' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied === 'link' ? 'Copied' : 'Copy link'}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {['WhatsApp', 'Telegram', 'X', 'Copy'].map((s) => (
                    <button
                      key={s}
                      onClick={() => copy('link')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/40 px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted"
                    >
                      <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="h-full p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-[var(--accent)]" />
                  <h3 className="text-base font-semibold">Your referral stats</h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="font-mono text-xl font-semibold tabular-nums">{s.value}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)] p-4 text-white">
                <div className="text-xs text-white/80">How rewards work</div>
                <div className="mt-1 text-sm font-medium leading-relaxed">
                  You earn <span className="font-bold">1.00 USDT</span> the first time each referred customer completes a payment order.
                  Rewards credit automatically to your available balance.
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                1-level referral depth only. Anti-fraud checks apply. Rewards subject to referral terms.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
