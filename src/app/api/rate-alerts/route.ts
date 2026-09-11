import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const AlertSchema = z.object({
  email: z.string().email(),
  direction: z.enum(['above', 'below']),
  threshold: z
    .string()
    .refine((v) => /^\d+(\.\d+)?$/.test(v) && Number(v) > 0, {
      message: 'threshold must be a positive number string',
    }),
})

/**
 * POST /api/rate-alerts
 * Create a rate-alert subscription — notify the user when INR/USDT crosses the threshold.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = AlertSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { email, direction, threshold } = parsed.data
    const alert = await db.rateAlert.create({
      data: { email, direction, threshold, active: true },
    })
    return NextResponse.json({
      ok: true,
      id: alert.id,
      message: `Alert set — you'll be notified when INR/USDT goes ${direction} ₹${threshold}.`,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Subscription failed', message: String(err) },
      { status: 500 },
    )
  }
}

/**
 * GET /api/rate-alerts
 * Returns a count of active rate-alert subscriptions (anonymized, for social proof).
 */
export async function GET() {
  const count = await db.rateAlert.count({ where: { active: true } })
  return NextResponse.json({ count })
}
