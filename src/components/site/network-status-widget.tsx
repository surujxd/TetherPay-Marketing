'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Box, Zap, Clock, Activity, Loader2 } from 'lucide-react'

type Net = {
  key: string
  name: string
  blockHeight: number
  avgFee: string
  avgConfirmTime: string
  tps: number
  status: string
  lastBlockAgo: number
}

export function NetworkStatusWidget() {
  const [nets, setNets] = React.useState<Net[]>([])
  const [loading, setLoading] = React.useState(true)
  const [checkedAt, setCheckedAt] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      const res = await fetch('/api/network-status')
      const data = await res.json()
      setNets(data.networks ?? [])
      setCheckedAt(data.checkedAt ?? '')
    } catch {
      setNets([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
    const id = setInterval(load, 20000)
    return () => clearInterval(id)
  }, [load])

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-[var(--accent)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Blockchain network status
            </h3>
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {checkedAt ? new Date(checkedAt).toLocaleTimeString('en-IN') : '—'}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => <SkeletonNet key={i} />)
            : nets.map((n, i) => <NetCard key={n.key} net={n} delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  )
}

function NetCard({ net, delay }: { net: Net; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold">{net.name}</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {net.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Block height</div>
          <div className="font-mono font-semibold tabular-nums">{net.blockHeight.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg fee</div>
          <div className="font-mono font-semibold">{net.avgFee}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Confirm time</div>
          <div className="font-mono font-semibold">{net.avgConfirmTime}</div>
        </div>
        <div>
          <div className="text-muted-foreground">TPS</div>
          <div className="font-mono font-semibold tabular-nums">{net.tps}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-2 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3 text-[var(--accent)]" />
        Last block <span className="font-mono">{net.lastBlockAgo}s</span> ago
      </div>
    </motion.div>
  )
}

function SkeletonNet() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-2 w-12 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="mt-3 h-2 w-full animate-pulse rounded bg-muted" />
    </div>
  )
}
