'use client'

import { Logo } from './primitives'
import { FOOTER_COLUMNS } from './content'
import { ShieldAlert } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/60 backdrop-blur">
      {/* Legal disclaimer strip */}
      <div className="border-b border-border bg-amber-500/5">
        <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 text-xs text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-pretty">
            <span className="font-semibold text-foreground/80">Risk disclosure.</span>{' '}
            Virtual Digital Assets (VDAs) including USDT are subject to market and regulatory risk. TetherPay is a
            technical platform, not a bank or regulated exchange. This page is a product preview; any public-money
            launch requires qualified Indian legal and compliance review (AML/KYC, FIU, TDS, DPDPA 2023).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Earn in USDT. Spend in INR. A verified settlement network for stablecoin-to-fiat payments in India.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All systems operational
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-[var(--accent)]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TetherPay. Built on a ledger-first settlement engine.
          </p>
          <p className="text-xs text-muted-foreground">
            The &quot;TetherPay&quot; wordmark is original. &quot;Tether&quot; / &quot;USDT&quot; are trademarks of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
