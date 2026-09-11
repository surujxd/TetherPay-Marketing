'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Network as NetworkIcon,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Link2,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatUSDT } from '@/lib/money'

type Step = 0 | 1 | 2 | 3 | 4

const NETWORKS = [
  { id: 'tron', name: 'TRON (TRC-20)', fee: '~1 USDT', time: '~1 min', recommended: true },
  { id: 'bsc', name: 'BSC (BEP-20)', fee: '~0.3 USDT', time: '~3 min', recommended: false },
  { id: 'eth', name: 'Ethereum (ERC-20)', fee: '~15 USDT', time: '~5 min', recommended: false },
]

const CENTRAL_ADDRESS = 'TQn9Y2khEsLJW7xq3a2M8n4pK6vR1dZ5cE'
const MIN_DEPOSIT = 10
const MAX_DEPOSIT = 50000

export function DepositFlowButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
      >
        {children}
      </button>
      <DepositModal open={open} onOpenChange={setOpen} />
    </>
  )
}

function DepositModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = React.useState<Step>(0)
  const [network, setNetwork] = React.useState(NETWORKS[0])
  const [amount, setAmount] = React.useState('100')
  const [txHash, setTxHash] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Esc to close (keyboard accessibility)
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 3) onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step, onOpenChange])

  // reset when closed
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(0)
        setTxHash('')
        setSubmitting(false)
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const amountNum = Number(amount) || 0
  const amountValid = amountNum >= MIN_DEPOSIT && amountNum <= MAX_DEPOSIT
  const txValid = txHash.length >= 20

  const copyAddress = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CENTRAL_ADDRESS)
      } else {
        const ta = document.createElement('textarea')
        ta.value = CENTRAL_ADDRESS
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      toast.success('Wallet address copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please select manually')
    }
  }

  const submitTx = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1400))
    setSubmitting(false)
    setStep(4)
  }

  const steps = ['Network', 'Amount', 'Deposit', 'Verify', 'Done']

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Deposit USDT demo"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                  <NetworkIcon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Deposit USDT</div>
                  <div className="text-[11px] text-muted-foreground">Interactive demo · step {step + 1} of {steps.length}</div>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background/60 transition-colors hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* step indicator */}
            <div className="flex items-center gap-1 border-b border-border bg-background/30 px-5 py-3">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-[var(--accent)]' : 'bg-muted'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto scroll-area p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {/* Step 0: Network */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Select a network</h4>
                    <p className="mt-1 text-sm text-muted-foreground">TRC-20 is recommended for lowest fees.</p>
                    <div className="mt-4 space-y-2">
                      {NETWORKS.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => setNetwork(n)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                            network.id === n.id
                              ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                              : 'border-border bg-background/40 hover:bg-muted'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              {n.name}
                              {n.recommended && (
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">Fee {n.fee} · {n.time}</div>
                          </div>
                          <span className={`h-4 w-4 rounded-full border-2 ${network.id === n.id ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-border'}`} />
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <span>Always confirm you are sending <span className="font-semibold">USDT</span> on the selected network. Cross-network sends can be lost permanently.</span>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Amount */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Enter deposit amount</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Min {formatUSDT(MIN_DEPOSIT)} · Max {formatUSDT(MAX_DEPOSIT)}</p>
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        className="w-full bg-transparent font-mono text-2xl font-semibold tabular-nums outline-none"
                        placeholder="100"
                        aria-label="Deposit amount in USDT"
                      />
                      <span className="text-sm font-medium text-muted-foreground">USDT</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['50', '100', '500', '1000'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setAmount(p)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                            amount === p ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]' : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {p} USDT
                        </button>
                      ))}
                    </div>
                    {amount && !amountValid && (
                      <p className="mt-3 text-xs text-rose-500">Amount must be between {MIN_DEPOSIT} and {MAX_DEPOSIT} USDT.</p>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Address + QR */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Send to the central wallet</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Send <span className="font-semibold text-[var(--accent)]">{formatUSDT(amount)}</span> on {network.name} to:
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
                      {/* QR mock */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-2xl border border-border bg-white p-2">
                          <QrPlaceholder />
                          <span className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--primary-foreground)] shadow-accent">
                            <QrCode className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Scan to pay</span>
                      </div>
                      {/* Address */}
                      <div className="flex flex-col gap-2">
                        <div className="rounded-2xl border border-border bg-background/50 p-3">
                          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Central wallet address</div>
                          <div className="mt-1 break-all font-mono text-sm font-medium">{CENTRAL_ADDRESS}</div>
                          <button
                            onClick={copyAddress}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-muted/70 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                          >
                            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copied' : 'Copy address'}
                          </button>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-muted-foreground">
                          <ShieldAlert className="mr-1 inline h-3 w-3 text-amber-500" />
                          Send only USDT on {network.name}. Other tokens or networks will be lost.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: TX hash */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Submit transaction hash</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Paste the TX hash from the blockchain explorer after you send the USDT.</p>
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        className="w-full bg-transparent font-mono text-sm outline-none"
                        placeholder="0x... or T..."
                        aria-label="Transaction hash"
                      />
                    </div>
                    <a
                      href={`https://tronscan.org/#/search/${txHash || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      Verify on Tronscan <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="mt-4 text-xs text-muted-foreground">
                      A manager will verify your transaction on-chain before crediting your ledger balance. This typically takes a few minutes.
                    </p>
                  </motion.div>
                )}

                {/* Step 4: Done */}
                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h4 className="mt-4 text-lg font-semibold">Deposit submitted</h4>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Your transaction is now pending verification. We&apos;ll notify you the moment your balance is credited.
                    </p>
                    <div className="mt-4 w-full rounded-2xl border border-border bg-background/40 p-4 text-left text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-mono font-semibold">{formatUSDT(amount)}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Network</span><span className="font-medium">{network.name}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-amber-500">Pending verification</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* footer actions */}
            <div className="flex items-center justify-between gap-2 border-t border-border bg-background/30 px-5 py-4">
              <button
                onClick={() => (step === 0 ? onOpenChange(false) : setStep((step - 1) as Step))}
                disabled={step === 4}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              {step < 4 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !amountValid) {
                      toast.error('Enter a valid amount')
                      return
                    }
                    if (step === 3) {
                      if (!txValid) {
                        toast.error('Enter a valid transaction hash')
                        return
                      }
                      submitTx()
                      return
                    }
                    setStep((step + 1) as Step)
                  }}
                  disabled={(step === 1 && !amountValid) || (step === 3 && submitting)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                >
                  {step === 3 && submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                  ) : step === 2 ? (
                    <>I&apos;ve sent the USDT <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Continue <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** A deterministic SVG QR-code-style placeholder (not a real QR — purely decorative). */
function QrPlaceholder() {
  // 21x21 grid with finder patterns + pseudo-random modules
  const cells: boolean[] = []
  let seed = 12345
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let i = 0; i < 21 * 21; i++) cells.push(rand() > 0.5)

  const isFinder = (x: number, y: number) => {
    const inBox = (bx: number, by: number) =>
      x >= bx && x < bx + 7 && y >= by && y < by + 7 &&
      (x === bx || x === bx + 6 || y === by || y === by + 6 ||
        (x >= bx + 2 && x <= bx + 4 && y >= by + 2 && y <= by + 4))
    return inBox(0, 0) || inBox(14, 0) || inBox(0, 14)
  }

  return (
    <svg viewBox="0 0 21 21" className="h-full w-full" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="21" height="21" fill="white" />
      {cells.map((on, i) => {
        const x = i % 21
        const y = Math.floor(i / 21)
        const fill = on || isFinder(x, y) ? '#0a0a0a' : 'white'
        return <rect key={i} x={x} y={y} width={1} height={1} fill={fill} />
      })}
    </svg>
  )
}
