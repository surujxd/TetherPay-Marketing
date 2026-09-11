'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle2, AlertTriangle, Info, X, Zap } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'

type EventDef = {
  id: string
  label: string
  icon: typeof CheckCircle2
  type: 'success' | 'warning' | 'info'
  title: string
  message: string
}

const EVENTS: EventDef[] = [
  {
    id: 'deposit',
    label: 'Deposit credited',
    icon: CheckCircle2,
    type: 'success',
    title: 'Deposit verified ✓',
    message: '250.00 USDT credited to your ledger. Operations confirmed on TRON.',
  },
  {
    id: 'order',
    label: 'Order completed',
    icon: Zap,
    type: 'success',
    title: 'Payment settled ✓',
    message: '₹5,000 sent to landlord@okaxis. Receipt ready to download.',
  },
  {
    id: 'agent',
    label: 'Agent claimed',
    icon: Info,
    type: 'info',
    title: 'Agent claimed your order',
    message: 'priya-s is processing your UPI payment. Avg. fulfilment: 4 min.',
  },
  {
    id: 'rate',
    label: 'Rate alert',
    icon: AlertTriangle,
    type: 'warning',
    title: 'Rate moved ⚡',
    message: 'INR/USDT is now ₹91.72 — up 0.24% since your last quote.',
  },
  {
    id: 'withdrawal',
    label: 'Payout sent',
    icon: CheckCircle2,
    type: 'success',
    title: 'USDT payout sent ✓',
    message: '50.00 USDT dispatched to your external wallet on TRC-20.',
  },
  {
    id: 'referral',
    label: 'Referral reward',
    icon: Zap,
    type: 'success',
    title: 'Referral reward earned! 🎉',
    message: '1.00 USDT credited — your referral completed their first payment.',
  },
]

const TYPE_STYLES: Record<EventDef['type'], { ring: string; iconColor: string }> = {
  success: { ring: 'ring-emerald-500/30', iconColor: 'text-emerald-500' },
  warning: { ring: 'ring-amber-500/30', iconColor: 'text-amber-500' },
  info: { ring: 'ring-sky-500/30', iconColor: 'text-sky-500' },
}

export function NotificationDemo() {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const fire = (ev: EventDef) => {
    sonnerToast[ev.type](ev.title, { description: ev.message, duration: 5000 })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Trigger notification demo"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition-all hover:bg-muted hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover/95 p-2 shadow-float backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trigger event
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-1 grid gap-1">
              {EVENTS.map((ev) => {
                const style = TYPE_STYLES[ev.type]
                return (
                  <button
                    key={ev.id}
                    onClick={() => fire(ev)}
                    className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted`}
                  >
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 ring-1 ${style.ring} ${style.iconColor}`}>
                      <ev.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-xs font-semibold">{ev.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">{ev.title}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-1 border-t border-border px-2 py-1.5 text-[10px] text-muted-foreground">
              Demo only — these toasts appear in the bottom-right.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
