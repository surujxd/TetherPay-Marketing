'use client'

import { motion } from 'framer-motion'
import { STATS } from './content'
import { AnimatedNumber } from './scroll-progress'

// Each stat can be parsed into a numeric target + prefix/suffix for animation.
function parseStat(value: string) {
  // examples: "₹48.2 Cr+", "4 min", "1,240", "99.98%"
  const m = value.match(/([^\d]*)([\d,.]+)(.*)/)
  if (!m) return { prefix: '', num: 0, suffix: value, animated: false }
  const prefix = m[1] || ''
  const numStr = m[2].replace(/,/g, '')
  const num = parseFloat(numStr)
  const suffix = m[3] || ''
  // animate only clean numbers (avoid animating "48.2 Cr+" oddly)
  const animated = /^\d+(\.\d+)?$/.test(numStr) && num <= 100000
  return { prefix, num, suffix, animated }
}

export function TrustBar() {
  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const p = parseStat(s.value)
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass-card group relative overflow-hidden rounded-2xl p-4 sm:p-5"
              >
                {/* hover accent line */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="font-mono text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                  {p.animated ? (
                    <AnimatedNumber
                      value={p.num}
                      format={(n) => `${p.prefix}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}${p.suffix}`}
                    />
                  ) : (
                    s.value
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground/80">{s.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
