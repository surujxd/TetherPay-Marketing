'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I get paid in USDT for freelance work. TetherPay lets me pay my landlord in INR without the 3-day bank wire headache. The rate is locked the moment I confirm.",
    name: 'Arjun Mehta',
    role: 'Freelance designer · Bengaluru',
    initials: 'AM',
    rating: 5,
  },
  {
    quote: "As an agent, I clear about ₹4 lakh a month in UPI payments. The commission hits my USDT balance within minutes of approval. Cleaner than any exchange I've used.",
    name: 'Priya Sharma',
    role: 'Settlement agent · Mumbai',
    initials: 'PS',
    rating: 5,
  },
  {
    quote: "We needed to pay vendors across 12 states. TetherPay's verified agent network handled every UPI payment and gave us a single audit trail. Operations finally breathed.",
    name: 'Vikram Reddy',
    role: 'Ops lead · D2C brand',
    initials: 'VR',
    rating: 5,
  },
  {
    quote: "The ledger-first model is the right call. No floating balances, no surprises. Every debit maps to a confirmed order. Exactly what a fintech should be.",
    name: 'Ananya Iyer',
    role: 'Compliance consultant',
    initials: 'AI',
    rating: 5,
  },
]

const PRESS = [
  'Featured in YourStory',
  'TechCrunch Startup Spotlight',
  'Inc42 Fintech to Watch',
  'ProductHunt #2 of the day',
]

export function Testimonials() {
  const [idx, setIdx] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5500)
    return () => clearInterval(id)
  }, [paused])

  const t = TESTIMONIALS[idx]

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Loved by users"
          title={<>Trusted by earners, agents, and operators</>}
          subtitle="Real workflows, real relief. Here's what people say about settling USDT to INR with TetherPay."
        />

        <div
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <GlassCard className="relative overflow-hidden p-7 sm:p-10">
            {/* decorative quote mark */}
            <Quote className="absolute -right-4 -top-4 h-32 w-32 text-[var(--accent)]/[0.05]" aria-hidden="true" />

            <div className="relative min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-balance text-lg font-medium leading-relaxed sm:text-xl">
                    “{t.quote}”
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] font-mono text-sm font-bold text-white">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* controls */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground'}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/60 transition-colors hover:bg-muted"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/60 transition-colors hover:bg-muted"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* press strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-60">
          {PRESS.map((p) => (
            <span key={p} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
