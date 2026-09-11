'use client'

import { motion } from 'framer-motion'
import { STATS } from './content'

export function TrustBar() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass-card rounded-2xl p-4 sm:p-5"
            >
              <div className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground/80">{s.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
