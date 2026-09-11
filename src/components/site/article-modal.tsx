'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, ArrowRight, Calendar, Share2, Bookmark } from 'lucide-react'
import { toast } from 'sonner'

type Article = {
  category: string
  title: string
  excerpt: string
  readTime: string
  date: string
  accent: string
}

export type ArticleModalProps = {
  article: Article | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function ArticleModal({ article, open, onOpenChange }: ArticleModalProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  return (
    <AnimatePresence>
      {open && article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={article.title}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden="true" />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card relative z-10 max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl"
          >
            {/* header banner */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)]">
              <div className="absolute inset-0 bg-dots opacity-20" />
              <div className="absolute left-5 top-5">
                <span className={`rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur`}>
                  {article.category}
                </span>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scroll-area p-6 sm:p-8">
              {/* meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime} read</span>
              </div>

              <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight">{article.title}</h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>

              {/* article body (illustrative) */}
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80">
                <p>
                  TetherPay was built on a simple premise: stablecoin holders should be able to spend their USDT
                  on real-world INR obligations without navigating exchange withdrawal limits, bank hold times,
                  or opaque fee structures.
                </p>
                <p>
                  The architecture we settled on uses a <span className="font-semibold text-foreground">central wallet model</span> —
                  one treasury address per network — paired with an internal ledger that tracks every customer&apos;s balance
                  as an append-only record. This means your balance is never a mutable number; it&apos;s the sum of every
                  verified credit and debit.
                </p>
                <blockquote className="border-l-2 border-[var(--accent)] bg-muted/40 py-3 pl-4 pr-3 text-sm italic text-foreground/70">
                  &ldquo;No direct balance mutations from the frontend. Every change flows through a verified ledger entry.&rdquo;
                </blockquote>
                <p>
                  The rate you see when you create a payment order is snapshotted immutably. Market moves after
                  confirmation do not affect your USDT debit. This is what we mean by &ldquo;rate locked at quote.&rdquo;
                </p>
                <p>
                  In production, deposits and payouts are verified manually by operations on the blockchain before
                  any ledger movement. This deliberate manual step is why we say &ldquo;slower is safer&rdquo; — no blind
                  automation, no silent failures.
                </p>
              </div>

              {/* actions */}
              <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                <button
                  onClick={() => toast.success('Article bookmarked')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Bookmark className="h-3.5 w-3.5" /> Save
                </button>
                <button
                  onClick={() => toast.success('Link copied to clipboard')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 text-xs font-semibold text-[var(--primary-foreground)] transition-all hover:brightness-110"
                >
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
