'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Range = '7d' | '30d' | '90d'

// Deterministic pseudo-random rate series around 91.5 INR/USDT
function buildSeries(days: number): { d: string; rate: number }[] {
  const pts: { d: string; rate: number }[] = []
  let r = 91.2
  let seed = days === 7 ? 11 : days === 30 ? 31 : 71
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let i = days - 1; i >= 0; i--) {
    r = Math.min(92.6, Math.max(90.4, r + (rand() - 0.5) * 0.22))
    const date = new Date()
    date.setDate(date.getDate() - i)
    const label = `${date.getDate()}/${date.getMonth() + 1}`
    pts.push({ d: label, rate: Number(r.toFixed(2)) })
  }
  return pts
}

const RANGES: { id: Range; label: string; days: number }[] = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
      <div className="font-medium">{label}</div>
      <div className="mt-0.5 font-mono font-semibold tabular-nums text-[var(--accent)]">₹{payload[0].payload.rate.toFixed(2)} / USDT</div>
    </div>
  )
}

export function RateHistoryChart() {
  const [range, setRange] = React.useState<Range>('30d')
  const [data, setData] = React.useState(buildSeries(30))

  React.useEffect(() => {
    const days = RANGES.find((r) => r.id === range)!.days
    setData(buildSeries(days))
  }, [range])

  const current = data[data.length - 1]?.rate ?? 91.5
  const first = data[0]?.rate ?? 91.5
  const change = current - first
  const changePct = (change / first) * 100
  const up = change >= 0
  const min = Math.min(...data.map((d) => d.rate))
  const max = Math.max(...data.map((d) => d.rate))
  const avg = data.reduce((s, d) => s + d.rate, 0) / data.length

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Rate history"
          title={<>Track INR/USDT over time</>}
          subtitle="Historical rate trend with range selector. The rate at order creation is always locked — this chart shows how the market moves between orders."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <GlassCard className="p-5 sm:p-6">
            {/* header: current + range selector */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-baseline gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current rate</div>
                  <div className="mt-0.5 font-mono text-3xl font-bold tabular-nums">₹{current.toFixed(2)}</div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? '+' : ''}{change.toFixed(2)} ({changePct.toFixed(2)}%)
                </span>
              </div>

              <div className="flex gap-1.5 rounded-xl border border-border bg-background/40 p-1">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRange(r.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      range === r.id
                        ? 'bg-[var(--accent)] text-[var(--primary-foreground)] shadow-soft'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* chart */}
            <div className="mt-5 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rateHistFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} interval={range === '90d' ? 9 : range === '30d' ? 4 : 0} />
                  <YAxis domain={[min - 0.15, max + 0.15]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v.toFixed(1)}`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--accent)', strokeOpacity: 0.3, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="rate" stroke="var(--accent)" strokeWidth={2.5} fill="url(#rateHistFill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Period low" value={`₹${min.toFixed(2)}`} sub="lowest rate" />
              <Stat label="Period high" value={`₹${max.toFixed(2)}`} sub="highest rate" />
              <Stat label="Period avg" value={`₹${avg.toFixed(2)}`} sub="average rate" />
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Illustrative data. Snapshot rates are locked at order creation (PRD §24.1).
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3 text-center">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  )
}
