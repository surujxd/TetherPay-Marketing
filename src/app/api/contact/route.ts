import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const InquirySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  topic: z.enum(['general', 'agents', 'support', 'press']).default('general'),
  message: z.string().min(10).max(2000),
})

/**
 * POST /api/contact
 * Capture a public contact / sales inquiry (PRD §13 support).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = InquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const inquiry = await db.contactInquiry.create({ data: parsed.data })
    return NextResponse.json({
      ok: true,
      id: inquiry.id,
      message: 'Thanks for reaching out. Our team will respond within 24 hours.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Submission failed', message: String(err) },
      { status: 500 },
    )
  }
}
