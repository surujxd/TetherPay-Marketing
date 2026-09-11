'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { GLOSSARY } from './glossary'

export function GlossarySection() {
  const [query, setQuery] = React.useState('')
  const entries = Object.values(GLOSSARY)
  const filtered = entries.filter(
    (e) =>
      e.term.toLowerCase().includes(query.toLowerCase()) ||
      e.short.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section id="glossary" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Glossary"
          title={<>Decode the jargon</>}
          subtitle="USDT, UPI, TRC-20, ledger, KYC — every term we use, explained in plain English. Search to filter."
        />

        <div className="mx-auto mt-8 max-w-md">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-2.5 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              aria-label="Search glossary"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e, i) => (
            <motion.div
              key={e.term}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            >
              <GlassCard hover className="h-full p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-light)] text-[var(--accent)]">
                    <BookOpen className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="font-mono text-sm font-bold text-[var(--accent-dark)] dark:text-[var(--accent)]">
                    {e.term}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.short}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            No terms match “{query}”.
          </div>
        )}
      </div>
    </section>
  )
}
