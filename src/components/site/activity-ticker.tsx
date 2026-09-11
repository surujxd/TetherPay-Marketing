'use client'

import * as React from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { formatINR } from '@/lib/money'

type Txn = {
  id: string
  recipient: string
  inr: string
  ago: string
}

const SEED: Txn[] = [
  { id: 'TP-9F2A', recipient: 'rent@okaxis', inr: '15000', ago: 'just now' },
  { id: 'TP-7C1B', recipient: 'vendor@paytm', inr: '4200', ago: '32s ago' },
  { id: 'TP-4A8D', recipient: 'family@ybl', inr: '850', ago: '1m ago' },
  { id: 'TP-2E5C', recipient: 'supplier@ibl', inr: '27500', ago: '2m ago' },
  { id: 'TP-8B3F', recipient: 'friend@apl', inr: '1200', ago: '3m ago' },
  { id: 'TP-6D1E', recipient: 'shop@oksbi', inr: '640', ago: '4m ago' },
  { id: 'TP-1A9B', recipient: 'office@ybl', inr: '38000', ago: '6m ago' },
  { id: 'TP-5F4C', recipient: 'cafe@paytm', inr: '320', ago: '7m ago' },
  { id: 'TP-3E7A', recipient: 'delivery@okaxis', inr: '95', ago: '8m ago' },
  { id: 'TP-9B2D', recipient: 'tuition@ibl', inr: '12500', ago: '9m ago' },
]

/** A live-feeling marquee of recently settled payments. Purely illustrative. */
export function ActivityTicker() {
  // duplicate the list for a seamless loop
  const items = [...SEED, ...SEED]
  return (
    <section aria-label="Live activity" className="relative overflow-hidden border-y border-border bg-background/40 py-3">
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-2.5">
        {items.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="flex items-center gap-2.5 rounded-full border border-border bg-background/60 px-3.5 py-1.5 backdrop-blur"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
            <ArrowRight className="h-3 w-3 text-[var(--accent)]" />
            <span className="text-xs font-medium">{t.recipient}</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-[var(--accent)]">{formatINR(t.inr)}</span>
            <span className="text-[11px] text-muted-foreground">· {t.ago}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
