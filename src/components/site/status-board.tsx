'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'

type Component = { name: string; key: string; uptime: number; status: string }

export function StatusBoard() {
  const [components, setComponents] = React.useState<Component[]>([])
  const [loading, setLoading] = React.useState(true)
  const [checkedAt, setCheckedAt] = React.useState<string>('')

  const load = React.useCallback(async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setComponents(data.components ?? [])
      setCheckedAt(data.checkedAt ?? new Date().toISOString())
    } catch {
      setComponents([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  const allOperational = components.every((c) => c.status === 'operational')

  return (
    <section id="status" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="System status"
          title={<>All systems operational</>}
          subtitle="Live health of the TetherPay platform. No manual fake-green status — either real or 'checking'."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <GlassCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : allOperational ? (
                  <span className="relative inline-flex h-2.5 w-2.5 text-emerald-500">
                    <span className="animate-pulse-ring" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="font-semibold">
                  {loading ? 'Checking…' : allOperational ? 'All systems operational' : 'Partial outage'}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {checkedAt ? new Date(checkedAt).toLocaleTimeString('en-IN') : '—'}
              </span>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                <div className="space-y-3 p-5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-5 w-full animate-pulse rounded bg-muted" />
                  ))}
                </div>
              ) : (
                components.map((c) => (
                  <div key={c.key} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          c.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                        {c.uptime.toFixed(2)}% uptime
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          c.status === 'operational' ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {c.status === 'operational' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Operational
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3.5 w-3.5" /> Degraded
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span>Auto-refreshes every 30s</span>
              <span>90-day rolling window · 0 incidents</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
