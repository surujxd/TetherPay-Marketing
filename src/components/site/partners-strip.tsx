'use client'

import { motion } from 'framer-motion'

// Illustrative partner / integration logos rendered as styled text marks
const PARTNERS = [
  { name: 'TRON', style: 'font-bold text-red-500' },
  { name: 'Ethereum', style: 'font-semibold text-sky-500' },
  { name: 'BNB Chain', style: 'font-semibold text-amber-500' },
  { name: 'NPCI UPI', style: 'font-bold text-emerald-600 dark:text-emerald-400' },
  { name: 'Tronscan', style: 'font-semibold text-red-400' },
  { name: 'Etherscan', style: 'font-semibold text-sky-400' },
  { name: 'Cloudflare', style: 'font-semibold text-orange-500' },
  { name: 'Supabase', style: 'font-bold text-emerald-500' },
]

export function PartnersStrip() {
  return (
    <section className="px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Built on trusted infrastructure
        </motion.p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {PARTNERS.map((p, i) => (
            <motion.span
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`text-base opacity-60 transition-opacity hover:opacity-100 sm:text-lg ${p.style}`}
            >
              {p.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
