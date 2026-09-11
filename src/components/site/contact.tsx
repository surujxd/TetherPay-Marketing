'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Loader2, CheckCircle2, MessageSquare, Phone } from 'lucide-react'
import { SectionHeading, GlassCard } from './primitives'
import { toast } from 'sonner'

export function ContactCta() {
  return (
    <section id="contact" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Newsletter / waitlist */}
          <NewsletterCard />

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function NewsletterCard() {
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<'customer' | 'agent'>('customer')
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        toast.success(data.message)
      } else {
        toast.error(data.error ?? 'Something went wrong')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="relative h-full overflow-hidden p-7">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/15 blur-[60px]" />
        <div className="relative">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight">Join the launch list</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to know when TetherPay opens in your region. No spam — just product updates and rate alerts.
          </p>

          {done ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">You&apos;re on the list</div>
                <div className="text-xs text-muted-foreground">We&apos;ll be in touch soon.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-3">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--accent)]">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  aria-label="Email address"
                />
              </div>
              <div className="flex gap-2">
                {(['customer', 'agent'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-all ${
                      role === r
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-dark)] dark:text-[var(--accent)]'
                        : 'border-border bg-background/40 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    I&apos;m a {r}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Get launch updates
              </button>
            </form>
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ContactForm() {
  const [form, setForm] = React.useState({ name: '', email: '', topic: 'general', message: '' })
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.ok) {
        setDone(true)
        toast.success(data.message)
        setForm({ name: '', email: '', topic: 'general', message: '' })
      } else {
        toast.error(data.error ?? 'Submission failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <GlassCard className="h-full p-7">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Talk to us</h3>
            <p className="text-sm text-muted-foreground">Sales, support, partnerships — we reply within 24h.</p>
          </div>
        </div>

        {done ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">Message received</div>
              <div className="mt-1 text-sm text-muted-foreground">Our team will respond within 24 hours.</div>
            </div>
            <button
              onClick={() => setDone(false)}
              className="mt-2 text-sm font-medium text-[var(--accent)]"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your name"
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Topic</label>
              <select
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="general">General</option>
                <option value="agents">Become an agent</option>
                <option value="support">Support</option>
                <option value="press">Press / Partnerships</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                required
                minLength={10}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can we help?"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--primary-foreground)] shadow-accent transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send message
            </button>
          </form>
        )}

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          Prefer email? <a href="mailto:support@tetherpay.fun" className="font-medium text-[var(--accent)]">support@tetherpay.fun</a>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
    </div>
  )
}
