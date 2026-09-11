'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LifeBuoy, X, MessageSquare, ArrowRight, Search } from 'lucide-react'
import { toast } from 'sonner'

const QUICK_LINKS = [
  { label: 'How deposits work', href: '#how-it-works' },
  { label: 'Current rates & fees', href: '#calculator' },
  { label: 'Agent earnings', href: '#pricing' },
  { label: 'Security model', href: '#security' },
  { label: 'Glossary', href: '#glossary' },
  { label: 'FAQ', href: '#faq' },
]

const QUICK_QUESTIONS = [
  'How do I deposit USDT?',
  'What rate will I get?',
  'How long does a payment take?',
  'Is my balance safe?',
]

export function HelpWidget() {
  const [open, setOpen] = React.useState(false)

  const sendQuestion = (q: string) => {
    toast.success('Question sent!', { description: 'Our team typically replies within 24 hours.' })
    setOpen(false)
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-14 left-0 w-80 overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-float backdrop-blur-md"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-light)] text-[var(--accent)]">
                  <LifeBuoy className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-semibold">Help & quick links</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close help"
                className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scroll-area p-3">
              {/* quick questions */}
              <div className="mb-3">
                <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick questions
                </div>
                <div className="space-y-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendQuestion(q)}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span className="text-foreground/80">{q}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              {/* quick links */}
              <div className="mb-3 border-t border-border pt-3">
                <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Jump to section
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {QUICK_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-[var(--accent)]"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* contact */}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:brightness-110"
              >
                <MessageSquare className="h-4 w-4" />
                Contact support
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Help and quick links"
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 shadow-float backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
      >
        <LifeBuoy className="h-5 w-5 text-[var(--accent)]" />
      </motion.button>
    </div>
  )
}
