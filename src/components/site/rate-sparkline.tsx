'use client'

import * as React from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts'

/** Deterministic-ish 24h rate series around 91.50 INR/USDT. */
function buildSeries(): { t: string; rate: number }[] {
  const pts: { t: string; rate: number }[] = []
  let r = 91.2
  // pseudo-random but stable per render-cycle seed
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let h = 23; h >= 0; h--) {
    r = Math.min(92.4, Math.max(90.6, r + (rand() - 0.5) * 0.18))
    const label = `${String((24 - h) % 24).padStart(2, '0')}:00`
    pts.push({ t: label, rate: Number(r.toFixed(2)) })
  }
  return pts
}

type Point = { t: string; rate: number }

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
      <div className="font-mono font-semibold tabular-nums text-[var(--accent)]">₹{p.rate.toFixed(2)}</div>
      <div className="text-muted-foreground">{p.t}</div>
    </div>
  )
}

/** Compact 24h rate sparkline for the calculator panel. */
export function RateSparkline({ current = 91.5 }: { current?: number }) {
  const [data] = React.useState(buildSeries)
  const min = Math.min(...data.map((d) => d.rate))
  const max = Math.max(...data.map((d) => d.rate))
  const change = current - data[0].rate
  const up = change >= 0

  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">24h rate</div>
          <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
            ₹{current.toFixed(2)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ USDT</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({((change / data[0].rate) * 100).toFixed(2)}%)
        </span>
      </div>
      <div className="mt-2 h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[min - 0.1, max + 0.1]} hide />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--accent)', strokeOpacity: 0.3, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#rateFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>₹{min.toFixed(2)}</span>
        <span>24h range</span>
        <span>₹{max.toFixed(2)}</span>
      </div>
    </div>
  )
}
