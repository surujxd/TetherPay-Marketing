'use client'

import * as React from 'react'
import { motion, useScroll, useSpring, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

/** Top-of-page scroll progress indicator. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-dark)]"
      aria-hidden="true"
    />
  )
}

/** Animates a number from 0 → target when scrolled into view. */
export function AnimatedNumber({
  value,
  format,
  duration = 1.6,
  className,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    format ? format(latest) : Math.round(latest).toLocaleString('en-IN'),
  )

  React.useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, { duration, ease: [0.4, 0, 0.2, 1] })
      return controls.stop
    }
  }, [inView, value, duration, motionValue])

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>
}
