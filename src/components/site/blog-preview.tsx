'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Article = {
  category: string
  title: string
  excerpt: string
  readTime: string
  date: string
  accent: string
}

const ARTICLES: Article[] = [
  {
    category: 'Engineering',
    title: 'Why we built a ledger-first settlement engine',
    excerpt: 'No direct balance mutations, no floating state. Every USDT credit and debit flows through an append-only ledger with double-entry invariants.',
    readTime: '6 min',
    date: 'May 28, 2025',
    accent: 'text-[var(--accent)]',
  },
  {
    category: 'Product',
    title: 'How rate locking protects you from market moves',
    excerpt: 'The moment you confirm a payment order, the INR/USDT rate is snapshotted immutably. Here is why that matters for predictable settlements.',
    readTime: '4 min',
    date: 'May 21, 2025',
    accent: 'text-emerald-500',
  },
  {
    category: 'Agents',
    title: 'A day in the life of a TetherPay settlement agent',
    excerpt: 'Meet Priya — one of 1,240 verified agents providing INR liquidity across Mumbai. How agents earn, manage risk, and scale earnings.',
    readTime: '8 min',
    date: 'May 14, 2025',
    accent: 'text-amber-500',
  },
  {
    category: 'Compliance',
    title: 'Understanding VDA taxation in India (TDS basics)',
    excerpt: 'A plain-English overview of how TDS applies to virtual digital asset transactions. Illustrative only — not tax advice.',
    readTime: '5 min',
    date: 'May 7, 2025',
    accent: 'text-sky-500',
  },
  {
    category: 'Security',
    title: 'Manual on-chain verification: why slower is safer',
    excerpt: 'We deliberately verify deposits and payouts manually on the blockchain before any ledger movement. No blind automation, no silent failures.',
    readTime: '7 min',
    date: 'Apr 30, 2025',
    accent: 'text-purple-500',
  },
  {
    category: 'Guide',
    title: 'Depositing USDT on TRC-20: a step-by-step walkthrough',
    excerpt: 'From selecting the network to submitting your TX hash, here is exactly what happens when you deposit USDT to the central TetherPay wallet.',
    readTime: '3 min',
    date: 'Apr 23, 2025',
    accent: 'text-rose-500',
  },
]

export function BlogPreview() {
  const [featured, ...rest] = ARTICLES
  return (
    <section id="resources" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Resources"
            title={<>Guides, engineering notes & product thinking</>}
            subtitle="Learn how TetherPay works under the hood, and how to get the most out of USDT-to-INR settlements."
          />
          <a
            href="#resources"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-border bg-background/60 px-5 text-sm font-semibold backdrop-blur transition-all hover:bg-muted"
          >
            View all
            <ArrowRight className="h-4 w-4 text-[var(--accent)]" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Featured article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard hover className="group h-full overflow-hidden p-0">
              {/* gradient banner */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)]">
                <div className="absolute inset-0 bg-dots opacity-20" />
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    Featured · {featured.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-balance text-xl font-semibold tracking-tight">{featured.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{featured.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Article list */}
          <div className="grid gap-3">
            {rest.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <GlassCard hover className="group flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${a.accent}`}>{a.category}</span>
                      <span className="text-[11px] text-muted-foreground">· {a.date}</span>
                    </div>
                    <h4 className="mt-1 truncate text-sm font-semibold">{a.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.readTime}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
