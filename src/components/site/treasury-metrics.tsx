'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { formatINR } from '@/lib/money'

// 30-day settled volume (INR, illustrative)
const VOLUME = [
  { d: '01', v: 12.4 }, { d: '02', v: 14.1 }, { d: '03', v: 11.8 }, { d: '04', v: 15.2 },
  { d: '05', v: 16.9 }, { d: '06', v: 14.7 }, { d: '07', v: 18.3 }, { d: '08', v: 19.1 },
  { d: '09', v: 17.5 }, { d: '10', v: 21.2 }, { d: '11', v: 19.8 }, { d: '12', v: 22.4 },
  { d: '13', v: 20.6 }, { d: '14', v: 23.9 }, { d: '15', v: 25.1 }, { d: '16', v: 22.7 },
  { d: '17', v: 26.4 }, { d: '18', v: 28.2 }, { d: '19', v: 25.9 }, { d: '20', v: 29.7 },
  { d: '21', v: 31.4 }, { d: '22', v: 28.8 }, { d: '23', v: 33.2 }, { d: '24', v: 35.1 },
  { d: '25', v: 32.6 }, { d: '26', v: 36.8 }, { d: '27', v: 38.4 }, { d: '28', v: 35.9 },
  { d: '29', v: 40.2 }, { d: '30', v: 42.7 },
]

// 7-day deposits vs payouts (USDT)
const FLOW = [
  { d: 'Mon', dep: 1240, pay: 980 },
  { d: 'Tue', dep: 1580, pay: 1120 },
  { d: 'Wed', dep: 980, pay: 1340 },
  { d: 'Thu', dep: 1820, pay: 1450 },
  { d: 'Fri', dep: 2140, pay: 1680 },
  { d: 'Sat', dep: 1650, pay: 1920 },
  { d: 'Sun', dep: 1380, pay: 1240 },
]

const KPI = [
  { label: '30d settled volume', value: '₹548.2 Cr', delta: '+18.4%', up: true },
  { label: 'USDT in treasury', value: '184,920', delta: '+4.2%', up: true },
  { label: 'Active agents', value: '1,240', delta: '+62', up: true },
  { label: 'Avg. settlement', value: '4.2 min', delta: '-0.3 min', up: true },
]

function VolTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
      <div className="font-mono font-semibold tabular-nums text-[var(--accent)]">₹{payload[0].payload.v} Cr</div>
      <div className="text-muted-foreground">Day {payload[0].payload.d}</div>
    </div>
  )
}

function FlowTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
      <div className="mb-1 font-medium">{label}</div>
      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Deposits: <span className="font-mono font-semibold">{payload[0]?.value} USDT</span></div>
      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--accent-dark)]" /> Payouts: <span className="font-mono font-semibold">{payload[1]?.value} USDT</span></div>
    </div>
  )
}

export function TreasuryMetrics() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Treasury & metrics"
          title={<>A transparent window into the network</>}
          subtitle="Illustrative treasury metrics — settled volume, deposit vs payout flow, and operational KPIs. In production, these feed from the ledger in real time."
        />

        {/* KPI row */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {KPI.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard hover className="p-5">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${k.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.delta}
                  </span>
                </div>
                <div className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight">{k.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Volume area chart */}
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="text-sm font-semibold">30-day settled volume</h3>
              </div>
              <span className="font-mono text-xs text-muted-foreground">INR (Cr)</span>
            </div>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VOLUME} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<VolTooltip />} cursor={{ stroke: 'var(--accent)', strokeOpacity: 0.3 }} />
                  <Area type="monotone" dataKey="v" stroke="var(--accent)" strokeWidth={2.5} fill="url(#volFill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Deposit vs payout bar chart */}
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[var(--accent)]" />
                <h3 className="text-sm font-semibold">7-day flow</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Deposits</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--accent-dark)]" /> Payouts</span>
              </div>
            </div>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FLOW} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<FlowTooltip />} cursor={{ fill: 'var(--muted)', fillOpacity: 0.4 }} />
                  <Bar dataKey="dep" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={14} />
                  <Bar dataKey="pay" fill="var(--accent-dark)" radius={[3, 3, 0, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-muted-foreground">
          Figures are illustrative for product preview. Production metrics are sourced from the append-only ledger (PRD §9).
        </p>
      </div>
    </section>
  )
}
