'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap, ChevronDown } from 'lucide-react'
import { Eyebrow } from './primitives'
import { formatINR, formatUSDT } from '@/lib/money'

/** Live USDT/INR ticker that animates small fluctuations for a "market alive" feel. */
function RateTicker() {
  const [rate, setRate] = React.useState(91.5)
  const [delta, setDelta] = React.useState(0.12)

  React.useEffect(() => {
    const id = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.08
      const next = Math.min(92.4, Math.max(90.6, rate + drift))
      setDelta(next - rate)
      setRate(next)
    }, 2600)
    return () => clearInterval(id)
  }, [rate])

  const up = delta >= 0
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/50 px-3.5 py-1.5 text-sm backdrop-blur">
      <span className="font-mono tabular-nums font-semibold">{rate.toFixed(2)}</span>
      <span className="text-muted-foreground">INR / USDT</span>
      <span className={up ? 'text-emerald-500' : 'text-rose-500'}>
        {up ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
      </span>
    </div>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

export function Hero() {
  return (
    <section className="relative px-4 pt-16 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center gap-6">
          <motion.div variants={item}>
            <Eyebrow>TRC-20 · UPI settlement network</Eyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]"
          >
            Earn in <span className="text-gradient-accent">USDT</span>.
            <br className="hidden sm:block" /> Spend in <span className="text-gradient-accent">INR</span>.
          </motion.h1>

          <motion.p variants={item} className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
            Deposit USDT, create an INR payment order, and have it fulfilled through TetherPay&apos;s
            verified settlement network. Pay anyone in India with stablecoin — no bank account needed.
          </motion.p>

          <motion.div variants={item} className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#calculator"
              className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Calculate your payment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-background/60 px-6 text-sm font-semibold backdrop-blur transition-all hover:bg-muted"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div variants={item} className="pt-2">
            <RateTicker />
          </motion.div>

          <motion.div variants={item} className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" /> Rate locked at quote</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-[var(--accent)]" /> Avg. 4 min settlement</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3.5 w-3.5 font-mono">₹</span> UPI ready</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating glass dashboard preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto mt-14 max-w-5xl px-1"
      >
        <HeroPreviewCard />
      </motion.div>

      <div className="mt-10 flex justify-center">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </div>
    </section>
  )
}

/** A compact glass mockup of the customer balance card, hinting at the app. */
function HeroPreviewCard() {
  return (
    <div className="glass-card relative overflow-hidden rounded-[28px] p-1.5 shadow-float">
      <div className="grid gap-1.5 md:grid-cols-[1.1fr_1fr]">
        {/* Balance card */}
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)] p-6 text-white">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">Available balance</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">USDT</span>
            </div>
            <div className="mt-3 font-mono text-4xl font-semibold tabular-nums tracking-tight">
              1,248.5040
            </div>
            <div className="mt-1 text-xs text-white/70">+ 86.3200 reserved in 2 orders</div>
            <div className="mt-6 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[var(--accent-dark)]">
                <ArrowRight className="h-3.5 w-3.5" /> Pay
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Order flow preview */}
        <div className="rounded-[22px] bg-background/40 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Latest order</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Completed
            </span>
          </div>
          <div className="mt-3 space-y-3">
            <FlowRow from={formatUSDT('54.6448')} to={formatINR('5000')} />
            <div className="h-px bg-border" />
            <FlowRow from={formatUSDT('109.2896')} to={formatINR('10000')} />
            <div className="h-px bg-border" />
            <FlowRow from={formatUSDT('27.3224')} to={formatINR('2500')} pending />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Rate locked</span>
            <span className="font-mono font-semibold text-[var(--accent)]">₹91.50 / USDT</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FlowRow({ from, to, pending = false }: { from: string; to: string; pending?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="font-mono tabular-nums text-muted-foreground">{from}</span>
      <ArrowRight className={pending ? 'h-3.5 w-3.5 animate-pulse text-amber-500' : 'h-3.5 w-3.5 text-[var(--accent)]'} />
      <span className="font-mono tabular-nums font-semibold">{to}</span>
    </div>
  )
}
