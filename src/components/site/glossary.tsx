'use client'

import * as React from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Glossary of TetherPay / fintech / crypto terms.
 * Used by <Glossary> inline tooltips and the standalone glossary section.
 */
export const GLOSSARY: Record<string, { term: string; short: string; long: string }> = {
  USDT: {
    term: 'USDT',
    short: 'Tether USD — a stablecoin pegged to the US dollar.',
    long: 'USDT (Tether) is a fiat-collateralized stablecoin issued by Tether Operations Limited, designed to track the value of the US dollar 1:1. It is the most liquid stablecoin on TRON and Ethereum.',
  },
  UPI: {
    term: 'UPI',
    short: 'Unified Payments Interface — India’s instant bank-to-bank payment rail.',
    long: 'UPI (Unified Payments Interface) is a real-time payment system developed by NPCI that links bank accounts to a virtual payment address (e.g. name@bank). It is the dominant digital payment method in India.',
  },
  'TRC-20': {
    term: 'TRC-20',
    short: 'The token standard on the TRON network (lowest USDT fees).',
    long: 'TRC-20 is the technical token standard used for USDT on the TRON blockchain. Transfers are fast (~1 min) and inexpensive (~1 USDT), making it the recommended network for TetherPay deposits.',
  },
  'ERC-20': {
    term: 'ERC-20',
    short: 'The token standard on Ethereum (higher gas, highest security).',
    long: 'ERC-20 is the token standard for fungible tokens on Ethereum. USDT on Ethereum is highly secure but gas fees can be $10–30 per transfer — best reserved for large deposits.',
  },
  'BEP-20': {
    term: 'BEP-20',
    short: 'The token standard on BNB Smart Chain.',
    long: 'BEP-20 is the token standard on the BNB Smart Chain. It offers low fees (~$0.30) and 3-second block times, a reasonable middle ground between TRON and Ethereum.',
  },
  ledger: {
    term: 'ledger',
    short: 'An append-only record of every credit and debit.',
    long: 'TetherPay uses a ledger-first model: your balance is not a mutable number but the result of every credited and debited entry. No direct balance mutations are possible from the frontend — all changes flow through verified ledger entries.',
  },
  TX: {
    term: 'TX hash',
    short: 'A unique identifier for a blockchain transaction.',
    long: 'A transaction hash (TX) is a 64-character string that uniquely identifies a transaction on a blockchain. You paste it after sending USDT so operations can verify your deposit on-chain.',
  },
  'central wallet': {
    term: 'central wallet',
    short: 'A single treasury address per network that receives all deposits.',
    long: 'TetherPay uses one central USDT wallet address per supported network. All customer deposits go to this address; individual balances are maintained as internal ledger entries.',
  },
  quote: {
    term: 'quote',
    short: 'A rate-locked price for an INR payment order.',
    long: 'When you create a payment order, the current INR/USDT rate is snapshotted into a quote. That rate is locked for the order’s lifetime — market moves afterwards do not change your USDT debit.',
  },
  settlement: {
    term: 'settlement',
    short: 'Reimbursing an agent in USDT after they fulfil an INR payment.',
    long: 'Settlement is the process of crediting a verified agent’s USDT balance (base reimbursement + commission) after they pay a recipient via UPI and operations approves the proof of payment.',
  },
  commission: {
    term: 'commission',
    short: 'A percentage agent earns on each fulfilled INR payment.',
    long: 'Commission is the percentage reward paid to agents on top of their USDT base reimbursement. Tiers range from 1.50% (Standard) to 2.00% (Premium), set per-agent in their profile.',
  },
  KYC: {
    term: 'KYC',
    short: 'Know Your Customer — identity verification.',
    long: 'KYC (Know Your Customer) is the process of verifying a user’s identity with government-issued documents. TetherPay requires KYC for both customers and agents to support AML obligations.',
  },
  'TDS': {
    term: 'TDS',
    short: 'Tax Deducted at Source — Indian tax withholding.',
    long: 'TDS (Tax Deducted at Source) is an Indian tax mechanism where a percentage is withheld at the point of payment. VDA transactions may attract 1% TDS under Section 194S. Consult a tax advisor.',
  },
  VDA: {
    term: 'VDA',
    short: 'Virtual Digital Asset — the legal term for crypto in India.',
    long: 'VDA (Virtual Digital Asset) is the legal classification for cryptocurrencies, NFTs, and similar tokens under Indian tax law (Finance Act 2022). USDT is a VDA.',
  },
  UTR: {
    term: 'UTR',
    short: 'Unique Transaction Reference — a bank/UPI transaction ID.',
    long: 'A UTR (Unique Transaction Reference) is the reference number a bank or UPI assigns to a completed transfer. Agents submit the UTR as proof of their UPI payment.',
  },
}

type GlossaryProps = {
  term: keyof typeof GLOSSARY | string
  children?: React.ReactNode
  className?: string
}

/**
 * Inline glossary tooltip. Wraps a term; hover/focus reveals a popover with
 * the short definition. Click opens the long definition in a small popover.
 */
export function Glossary({ term, children, className }: GlossaryProps) {
  const entry = GLOSSARY[term]
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  if (!entry) {
    return <span className={className}>{children ?? term}</span>
  }

  return (
    <span
      ref={ref}
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-0.5 border-b border-dashed border-[var(--accent)]/50 text-[var(--accent)] decoration-dotted underline-offset-2 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label={`Definition of ${entry.term}`}
        aria-expanded={open}
      >
        {children ?? entry.term}
        <Info className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-popover p-3 text-left text-xs leading-relaxed text-popover-foreground shadow-lg"
        >
          <span className="mb-1 block font-semibold text-[var(--accent)]">{entry.term}</span>
          <span className="block text-foreground/80">{entry.short}</span>
        </span>
      )}
    </span>
  )
}
