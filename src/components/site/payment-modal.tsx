'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ScanLine,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Clock,
  QrCode,
  Upload,
  Camera,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatINR, formatUSDT } from '@/lib/money'

type Step = 0 | 1 | 2 | 3 | 4

const STEPS = ['Method', 'Recipient', 'Review', 'Confirm', 'Done']

export function PaymentFlowButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <PaymentModal open={open} onOpenChange={setOpen} />
    </>
  )
}

function PaymentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = React.useState<Step>(0)
  const [method, setMethod] = React.useState<'scan' | 'manual' | null>(null)
  const [upiId, setUpiId] = React.useState('')
  const [recipientName, setRecipientName] = React.useState('')
  const [inrAmount, setInrAmount] = React.useState('2500')
  const [confirming, setConfirming] = React.useState(false)

  // Esc to close (keyboard accessibility)
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 3) onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step, onOpenChange])

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(0); setMethod(null); setUpiId(''); setRecipientName(''); setConfirming(false)
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const upiValid = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId)
  const amountValid = Number(inrAmount) > 0 && Number(inrAmount) <= 100000
  const canReview = upiValid && amountValid

  const usdtDebit = amountValid ? (Number(inrAmount) / 91.5).toFixed(8) : '0'
  const available = 1248.504
  const after = Math.max(0, available - Number(usdtDebit))

  const confirm = async () => {
    setConfirming(true)
    await new Promise((r) => setTimeout(r, 1600))
    setConfirming(false)
    setStep(4)
  }

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
          aria-label="Create INR payment demo"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden="true" />
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
                  <ScanLine className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Create INR payment</div>
                  <div className="text-[11px] text-muted-foreground">Interactive demo · step {step + 1} of {STEPS.length}</div>
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
              {STEPS.map((s, i) => (
                <div key={s} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? 'var(--accent)' : 'var(--muted)' }} />
              ))}
            </div>

            <div className="max-h-[58vh] overflow-y-auto scroll-area p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {/* Step 0: Method */}
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Choose a payment method</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Scan a UPI QR code or enter a UPI ID manually.</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setMethod('scan'); setStep(1) }}
                        className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/40 p-5 text-center transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                      >
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] transition-transform group-hover:scale-110">
                          <ScanLine className="h-6 w-6" />
                        </span>
                        <span className="text-sm font-semibold">Scan QR</span>
                        <span className="text-[11px] text-muted-foreground">Camera</span>
                      </button>
                      <button
                        onClick={() => { setMethod('manual'); setStep(1) }}
                        className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/40 p-5 text-center transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                      >
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] transition-transform group-hover:scale-110">
                          <ArrowRight className="h-6 w-6" />
                        </span>
                        <span className="text-sm font-semibold">Enter UPI ID</span>
                        <span className="text-[11px] text-muted-foreground">Manual</span>
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                      <span className="text-xs text-muted-foreground">Available balance</span>
                      <span className="font-mono text-sm font-semibold tabular-nums">{formatUSDT(available.toFixed(4))}</span>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Recipient */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    {method === 'scan' ? (
                      <>
                        <h4 className="text-base font-semibold">Scan UPI QR</h4>
                        <p className="mt-1 text-sm text-muted-foreground">Point your camera at a UPI QR code. (Demo — no real camera.)</p>
                        <div className="mt-4 relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-black">
                          {/* faux camera viewfinder */}
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative h-48 w-48">
                              {/* corner brackets */}
                              <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[var(--accent)]" />
                              <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[var(--accent)]" />
                              <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[var(--accent)]" />
                              <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[var(--accent)]" />
                              {/* scanning line */}
                              <motion.div
                                animate={{ y: [-96, 96, -96] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute left-0 right-0 h-0.5 bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                              />
                              <QrCode className="absolute inset-0 m-auto h-16 w-16 text-white/20" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/60">
                            <Camera className="mr-1 inline h-3 w-3" /> Align QR within the frame
                          </div>
                        </div>
                        <button
                          onClick={() => { setUpiId('merchant@okaxis'); setRecipientName('Merchant'); toast.success('QR detected: merchant@okaxis'); setStep(2) }}
                          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98]"
                        >
                          <Check className="h-4 w-4" /> Simulate scan
                        </button>
                        <button
                          onClick={() => setStep(1) || (setMethod('manual'), setStep(1))}
                          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background/60 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                        >
                          <Upload className="h-3.5 w-3.5" /> Upload QR image instead
                        </button>
                      </>
                    ) : (
                      <>
                        <h4 className="text-base font-semibold">Enter recipient details</h4>
                        <p className="mt-1 text-sm text-muted-foreground">The UPI ID and amount you want to send.</p>
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">UPI ID</label>
                            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value.trim())}
                                className="w-full bg-transparent font-mono text-sm outline-none"
                                placeholder="name@bank"
                                aria-label="UPI ID"
                              />
                              {upiValid && <Check className="h-4 w-4 text-emerald-500" />}
                            </div>
                            {upiId && !upiValid && (
                              <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-500">
                                <AlertCircle className="h-3 w-3" /> Format: name@bank (letters only after @)
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Recipient name (optional)</label>
                            <input
                              type="text"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                              placeholder="e.g. Ramesh K."
                              aria-label="Recipient name"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount (INR)</label>
                            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
                              <span className="font-mono text-lg font-semibold text-muted-foreground">₹</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={inrAmount}
                                onChange={(e) => setInrAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="w-full bg-transparent font-mono text-xl font-semibold tabular-nums outline-none"
                                placeholder="2500"
                                aria-label="Amount in INR"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <h4 className="text-base font-semibold">Review your payment</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Confirm the details and lock the rate.</p>

                    <div className="mt-4 rounded-2xl border border-border bg-background/40 p-4">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-light)] font-mono text-sm font-bold text-[var(--accent)]">
                          {(recipientName || upiId || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{recipientName || 'Recipient'}</div>
                          <div className="truncate font-mono text-xs text-muted-foreground">{upiId || 'merchant@okaxis'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 rounded-2xl bg-muted/60 p-4">
                      <ReviewRow label="INR amount" value={formatINR(inrAmount)} />
                      <ReviewRow label="Platform fee" value={formatINR('0.00')} muted />
                      <div className="my-1 h-px bg-border" />
                      <ReviewRow label="Total INR" value={formatINR(inrAmount)} strong />
                      <ReviewRow label="Locked rate" value="₹91.50 / USDT" accent />
                      <ReviewRow label="USDT debit" value={formatUSDT(usdtDebit)} strong accent />
                      <div className="my-1 h-px bg-border" />
                      <ReviewRow label="Available" value={formatUSDT(available.toFixed(4))} muted />
                      <ReviewRow label="After payment" value={formatUSDT(after.toFixed(4))} muted />
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-500/5 px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-amber-500" /> Quote expires in
                      </span>
                      <QuoteCountdown />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirming */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-10 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[var(--accent)]" />
                    <h4 className="mt-4 text-base font-semibold">Reserving funds & creating order…</h4>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Locking the rate at ₹91.50 / USDT and reserving {formatUSDT(usdtDebit)} from your balance.
                    </p>
                  </motion.div>
                )}

                {/* Step 4: Done */}
                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h4 className="mt-4 text-lg font-semibold">Order created</h4>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Your payment order is now in the marketplace. A verified agent will fulfil it shortly.
                    </p>
                    <div className="mt-4 w-full rounded-2xl border border-border bg-background/40 p-4 text-left text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">TP-{Math.random().toString(36).slice(2, 6).toUpperCase()}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Recipient</span><span className="font-mono">{upiId || 'merchant@okaxis'}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-mono font-semibold">{formatINR(inrAmount)}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">USDT debit</span><span className="font-mono text-[var(--accent)]">{formatUSDT(usdtDebit)}</span></div>
                      <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-sky-500">Awaiting agent</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* footer actions */}
            <div className="flex items-center justify-between gap-2 border-t border-border bg-background/30 px-5 py-4">
              <button
                onClick={() => (step === 0 ? onOpenChange(false) : setStep((step - 1) as Step))}
                disabled={step === 3 || step === 4}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background/60 px-4 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !canReview) {
                      toast.error(upiValid ? 'Enter a valid amount' : 'Enter a valid UPI ID and amount')
                      return
                    }
                    if (step === 2) {
                      setStep(3)
                      confirm()
                      return
                    }
                    setStep((step + 1) as Step)
                  }}
                  disabled={step === 1 && !canReview}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                >
                  {step === 2 ? <><ShieldCheck className="h-4 w-4" /> Confirm & lock rate</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                </button>
              ) : step === 4 ? (
                <button
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110"
                >
                  Done
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Processing…</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ReviewRow({ label, value, strong, muted, accent }: { label: string; value: string; strong?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-sm ${muted ? 'text-muted-foreground' : 'text-foreground/80'}`}>{label}</span>
      <span className={`font-mono tabular-nums ${strong ? 'text-base font-semibold' : 'text-sm'} ${accent ? 'text-[var(--accent)]' : ''}`}>{value}</span>
    </div>
  )
}

function QuoteCountdown() {
  const [secs, setSecs] = React.useState(600)
  React.useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 600 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  return <span className="font-mono text-sm font-semibold tabular-nums text-amber-500">{mm}:{ss}</span>
}
