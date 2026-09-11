'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Gift,
  Bell,
  LifeBuoy,
  Settings,
  ArrowRight,
  ArrowDownToLine,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { DepositFlowButton } from './deposit-modal'
import { formatINR, formatUSDT } from '@/lib/money'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Send, label: 'Pay' },
  { icon: ArrowLeftRight, label: 'Activity' },
  { icon: Wallet, label: 'Wallet' },
  { icon: Gift, label: 'Referrals' },
  { icon: Bell, label: 'Notifications' },
  { icon: LifeBuoy, label: 'Support' },
  { icon: Settings, label: 'Settings' },
]

const ORDERS = [
  { id: 'TP-9F2A', recipient: 'rent@okaxis', inr: '15000', usdt: '163.9344', status: 'completed', time: '2 min ago' },
  { id: 'TP-7C1B', recipient: 'shopkeeper@paytm', inr: '2500', usdt: '27.3224', status: 'verifying', time: '8 min ago' },
  { id: 'TP-4A8D', recipient: 'friend@ybl', inr: '750', usdt: '8.1967', status: 'available', time: '14 min ago' },
]

export function DashboardPreview() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The customer app"
          title={<>A fintech-grade dashboard, built for clarity</>}
          subtitle="Liquid-glass surfaces, realtime order tracking, and a ledger-first balance you can trust. This is a live preview of the in-app experience."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <GlassCard className="overflow-hidden p-0">
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-400/70" />
                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                app.tetherpay.fun/dashboard
              </div>
              <div className="w-10" />
            </div>

            <div className="grid md:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <aside className="hidden border-r border-border bg-background/20 p-3 md:block">
                <div className="space-y-1">
                  {NAV.map((n) => (
                    <div
                      key={n.label}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        n.active
                          ? 'bg-[var(--accent-light)] font-semibold text-[var(--accent-dark)] dark:text-[var(--accent)]'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <n.icon className="h-4 w-4" />
                      {n.label}
                      {n.active && <ChevronRight className="ml-auto h-4 w-4" />}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main */}
              <div className="p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                  {/* Balance + actions */}
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent-dark)] to-[var(--accent)] p-5 text-white">
                      <div className="absolute inset-0 bg-dots opacity-15" />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wider text-white/70">Available</span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">USDT</span>
                        </div>
                        <div className="mt-2 font-mono text-3xl font-semibold tabular-nums">1,248.5040</div>
                        <div className="mt-1 text-xs text-white/70">+ 86.3200 reserved</div>
                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <DepositActionBtn icon={ArrowDownToLine} label="Deposit" />
                          <ActionBtn icon={Send} label="Pay" primary />
                          <ActionBtn icon={ArrowLeftRight} label="Activity" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent activity</span>
                        <a className="text-xs font-medium text-[var(--accent)]" href="#calculator">View all</a>
                      </div>
                      <div className="mt-3 space-y-3">
                        {ORDERS.map((o) => (
                          <div key={o.id} className="flex items-center gap-3">
                            <StatusDot status={o.status} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">{o.recipient}</div>
                              <div className="text-xs text-muted-foreground">{o.id} · {o.time}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm font-semibold tabular-nums">{formatINR(o.inr)}</div>
                              <div className="font-mono text-xs text-muted-foreground tabular-nums">{formatUSDT(o.usdt)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order timeline */}
                  <div className="rounded-2xl border border-border bg-background/40 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order</div>
                        <div className="font-mono text-lg font-semibold">TP-7C1B</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
                        <Loader2 className="h-3 w-3 animate-spin" /> Verifying
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="shrink-0 text-muted-foreground">Recipient</span>
                        <span className="min-w-0 truncate font-mono font-medium">shopkeeper@paytm</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-mono font-semibold">{formatINR('2500')}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">USDT debit</span>
                        <span className="font-mono text-[var(--accent)]">{formatUSDT('27.3224')}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Timeline />
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-xl border border-dashed border-border px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Rate locked
                      </span>
                      <span className="font-mono text-sm font-semibold text-[var(--accent)]">₹91.50 / USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

function ActionBtn({ icon: Icon, label, primary }: { icon: any; label: string; primary?: boolean }) {
  return (
    <button
      className={`inline-flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-semibold transition-all active:scale-95 ${
        primary ? 'bg-white text-[var(--accent-dark)]' : 'bg-white/15 text-white backdrop-blur'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function DepositActionBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <DepositFlowButton>
      <span className="inline-flex w-full flex-col items-center gap-1 rounded-xl bg-white/15 py-2.5 text-[11px] font-semibold text-white backdrop-blur transition-all active:scale-95">
        <Icon className="h-4 w-4" />
        {label}
      </span>
    </DepositFlowButton>
  )
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500',
    verifying: 'bg-amber-500 animate-pulse',
    available: 'bg-sky-500',
  }
  return <span className={`h-2 w-2 shrink-0 rounded-full ${map[status] ?? 'bg-muted-foreground'}`} />
}

function Timeline() {
  const steps = [
    { label: 'Order created', time: '14:02', state: 'done' },
    { label: 'Funds reserved', time: '14:02', state: 'done' },
    { label: 'Agent claimed', time: '14:05', state: 'done' },
    { label: 'Payment submitted', time: '14:08', state: 'active' },
    { label: 'Manager verifying', time: '—', state: 'pending' },
    { label: 'Payment confirmed', time: '—', state: 'pending' },
  ]
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                s.state === 'done'
                  ? 'bg-emerald-500 text-white'
                  : s.state === 'active'
                  ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20'
                  : 'border border-border bg-background text-muted-foreground'
              }`}
            >
              {s.state === 'done' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : s.state === 'active' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="text-[10px]">{i + 1}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`my-0.5 h-6 w-px ${s.state === 'done' ? 'bg-emerald-500/40' : 'bg-border'}`} />
            )}
          </div>
          <div className="pb-1">
            <div className={`text-sm ${s.state === 'pending' ? 'text-muted-foreground' : 'font-medium'}`}>{s.label}</div>
            <div className="font-mono text-xs text-muted-foreground">{s.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
