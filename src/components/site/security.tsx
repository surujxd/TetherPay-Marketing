'use client'

import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { SECURITY_POINTS } from './content'

export function Security() {
  return (
    <section id="security" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Trust & security"
          title={<>Ledger-first. Human-verified. Fully auditable.</>}
          subtitle="TetherPay is engineered so your balance can never be silently mutated. Every credit and debit is deliberate, manual where it matters, and traceable end-to-end."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassCard hover className="h-full p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <GlassCard className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold">Not a bank. Not an exchange. A settlement layer.</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                TetherPay does not hold INR deposits or execute trades. It coordinates verified USDT deposits and INR
                payments through a managed agent network. Regulatory clearances for any public-money launch require
                qualified Indian legal and compliance review.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
