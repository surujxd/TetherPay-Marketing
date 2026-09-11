import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const SubscribeSchema = z.object({
  email: z.string().email(),
  role: z.enum(['customer', 'agent']).default('customer'),
})

/**
 * POST /api/subscribe
 * Add an email to the launch waitlist / newsletter (PRD public site CTA).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = SubscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { email, role } = parsed.data
    const existing = await db.subscriber.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: 'You are already on the list.',
        subscribed: true,
      })
    }

    await db.subscriber.create({ data: { email, role } })
    return NextResponse.json({
      ok: true,
      message: 'Welcome to TetherPay. We will be in touch.',
      subscribed: true,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Subscription failed', message: String(err) },
      { status: 500 },
    )
  }
}

/**
 * GET /api/subscribe
 * Returns a anonymized subscriber count for social proof.
 */
export async function GET() {
  const count = await db.subscriber.count()
  return NextResponse.json({ count })
}
