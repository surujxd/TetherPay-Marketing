'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Clock, TrendingUp, Users, Eye } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { OrderTrackingButton } from './order-tracking-modal'
import { formatINR } from '@/lib/money'

type Order = {
  id: string
  upi: string
  inr: number
  agent?: string
  status: 'available' | 'assigned' | 'verifying' | 'completed'
  time: string
}

const SEED: Order[] = [
  { id: 'TP-9F2A', upi: 'rent@okaxis', inr: 15000, status: 'completed', agent: 'priya-s', time: '2m ago' },
  { id: 'TP-7C1B', upi: 'vendor@paytm', inr: 4200, status: 'verifying', agent: 'arjun-m', time: '5m ago' },
  { id: 'TP-4A8D', upi: 'family@ybl', inr: 850, status: 'assigned', agent: 'vikram-r', time: '1m ago' },
  { id: 'TP-2E5C', upi: 'supplier@ibl', inr: 27500, status: 'available', time: 'just now' },
  { id: 'TP-8B3F', upi: 'cafe@paytm', inr: 320, status: 'available', time: '12s ago' },
  { id: 'TP-6D1E', upi: 'tuition@oksbi', inr: 12500, status: 'available', time: '34s ago' },
]

const STATUS_META: Record<Order['status'], { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  assigned: { label: 'Assigned', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  verifying: { label: 'Verifying', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  completed: { label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
}

export function OrderBook() {
  const [orders, setOrders] = React.useState(SEED)

  // simulate live updates: periodically shift an available → assigned, assigned → verifying, etc.
  React.useEffect(() => {
    const id = setInterval(() => {
      setOrders((prev) => {
        const next = [...prev]
        // advance one order's status
        const order = next[Math.floor(Math.random() * next.length)]
        if (order.status === 'available') {
          order.status = 'assigned'
          order.agent = ['priya-s', 'arjun-m', 'vikram-r'][Math.floor(Math.random() * 3)]
          order.time = 'just now'
        } else if (order.status === 'assigned') {
          order.status = 'verifying'
          order.time = 'just now'
        } else if (order.status === 'verifying') {
          order.status = 'completed'
          order.time = 'just now'
        } else if (order.status === 'completed') {
          order.status = 'available'
          order.agent = undefined
          order.time = 'just now'
        }
        return next
      })
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const available = orders.filter((o) => o.status === 'available').length
  const inFlight = orders.filter((o) => o.status === 'assigned' || o.status === 'verifying').length
  const completed = orders.filter((o) => o.status === 'completed').length
  const totalInr = orders.reduce((s, o) => s + o.inr, 0)

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Live marketplace"
          title={<>Watch orders settle in real time</>}
          subtitle="A peek at the TetherPay order marketplace — available INR payment orders waiting for verified agents, and orders moving through the settlement pipeline."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Order list */}
          <GlassCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="text-sm font-semibold">Order stream</h3>
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">auto-updating</span>
            </div>

            <div className="max-h-[420px] divide-y divide-border overflow-y-auto scroll-area">
              {orders.map((o) => {
                const meta = STATUS_META[o.status]
                return (
                  <motion.div
                    key={o.id}
                    layout
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.color.replace('text-', 'bg-')}`} />
                          {meta.label}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-sm font-medium">{o.upi}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.agent ? `agent: ${o.agent}` : 'awaiting claim'} · {o.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold tabular-nums">{formatINR(o.inr)}</div>
                      <div className="font-mono text-[11px] text-muted-foreground tabular-nums">
                        {(o.inr / 91.5).toFixed(4)} USDT
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>

          {/* Stats sidebar */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatTile icon={Clock} label="Available" value={String(available)} accent="text-sky-500" />
              <StatTile icon={Activity} label="In flight" value={String(inFlight)} accent="text-amber-500" />
              <StatTile icon={TrendingUp} label="Completed" value={String(completed)} accent="text-emerald-500" />
              <StatTile icon={Users} label="Active agents" value="38" accent="text-[var(--accent)]" />
            </div>

            <GlassCard className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Marketplace volume</div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatINR(totalInr.toFixed(0))}</div>
              <div className="mt-1 text-xs text-muted-foreground">across {orders.length} visible orders</div>

              <div className="mt-4 space-y-2">
                {(['available', 'assigned', 'verifying', 'completed'] as const).map((s) => {
                  const count = orders.filter((o) => o.status === s).length
                  const pct = (count / orders.length) * 100
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-16 text-[11px] capitalize text-muted-foreground">{STATUS_META[s].label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={`h-full ${STATUS_META[s].color.replace('text-', 'bg-')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="w-4 text-right font-mono text-[11px] tabular-nums">{count}</span>
                    </div>
                  )
                })}
              </div>
            </GlassCard>

            <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/30 px-4 py-3 text-xs text-muted-foreground">
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent)]" />
              Orders expire after <span className="font-mono font-semibold">10:00</span> if unclaimed
            </div>

            <OrderTrackingButton className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]">
              <Eye className="h-4 w-4" /> Watch a live order demo
            </OrderTrackingButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatTile({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <Icon className={`h-4 w-4 ${accent}`} />
      <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
