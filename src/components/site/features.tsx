'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GlassCard, SectionHeading } from './primitives'
import { FEATURES } from './content'

export function Features() {
  return (
    <section id="features" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What you can do"
          title={<>Three steps from USDT to INR</>}
          subtitle="TetherPay turns a stablecoin balance into real INR payments — verified by humans, locked by math."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard hover className="group h-full p-6">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {f.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowUpRight className="h-4 w-4" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
