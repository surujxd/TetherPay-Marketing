'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/** TetherPay original wordmark (PRD §1 brand notice — original wordmark, not Tether's trade dress). */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] shadow-accent">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden="true">
          <path d="M3 8.5L12 4l9 4.5-9 4.5-9-4.5z" fill="currentColor" opacity="0.95" />
          <path d="M7 12.5l5 2.5 5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 16.5l5 2.5 5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
      </span>
      {showText && (
        <span className="text-[17px] font-semibold tracking-tight">
          Tether<span className="text-[var(--accent)]">Pay</span>
        </span>
      )}
    </span>
  )
}

/** Translucent liquid-glass surface. */
export function GlassCard({
  className,
  children,
  hover = false,
  ...props
}: React.ComponentProps<'div'> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'glass-card rounded-3xl',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-float hover:border-[var(--accent)]/40',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent-light)] px-3 py-1 text-xs font-medium text-[var(--accent-dark)] dark:text-[var(--accent)]',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

/** Decorative aurora + grid background, fixed behind content. */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] opacity-40" />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-[120px]" />
    </div>
  )
}

/** Animated gradient divider between sections. */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-2', className)} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--accent)]/30" />
      <span className="h-1.5 w-1.5 rotate-45 rounded-sm bg-[var(--accent)]/40" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--accent)]/30" />
    </div>
  )
}
