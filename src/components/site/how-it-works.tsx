'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './primitives'
import { HOW_STEPS } from './content'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title={<>Customer → wallet → agent settlement</>}
          subtitle="A clear, auditable flow from your USDT deposit to the recipient's UPI inbox. No magic, just verified steps."
        />

        <div className="relative mt-14">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {HOW_STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                <div className="glass-card relative h-full overflow-hidden rounded-3xl p-6">
                  <div className="relative flex items-center justify-between">
                    <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 ring-1 ring-border">
                      <s.icon className="h-6 w-6 text-[var(--accent)]" />
                      <span className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-bold text-[var(--primary-foreground)] shadow-accent">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="relative mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>

                {i < HOW_STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background ring-1 ring-border">
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#calculator"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background/60 px-5 text-sm font-semibold backdrop-blur transition-all hover:bg-muted"
          >
            Try the rate calculator
            <ArrowRight className="h-4 w-4 text-[var(--accent)]" />
          </a>
        </div>
      </div>
    </section>
  )
}
