import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSettings } from '@/lib/settings'
import { computeCustomerQuote, computeAgentSettlement, computePlatformContribution } from '@/lib/money'

const QuoteSchema = z.object({
  inrAmount: z.string().refine((v) => /^\d+(\.\d+)?$/.test(v) && Number(v) > 0, {
    message: 'inrAmount must be a positive number string',
  }),
})

/**
 * GET /api/rates
 * Returns the live platform rate / fee / commission settings snapshot (PRD §24.1).
 */
export async function GET() {
  const settings = await getSettings()
  return NextResponse.json({
    settings: {
      customer_quote_rate: settings.customer_quote_rate,
      agent_settlement_rate: settings.agent_settlement_rate,
      platform_fee_percent: settings.platform_fee_percent,
      platform_fee_flat_inr: settings.platform_fee_flat_inr,
      standard_commission_rate: settings.standard_commission_rate,
      trusted_commission_rate: settings.trusted_commission_rate,
      premium_commission_rate: settings.premium_commission_rate,
      customer_referral_reward_usdt: settings.customer_referral_reward_usdt,
      agent_partner_reward_percent: settings.agent_partner_reward_percent,
      min_deposit_usdt: settings.min_deposit_usdt,
      max_deposit_usdt: settings.max_deposit_usdt,
      order_expiry_minutes: settings.order_expiry_minutes,
    },
    note: 'Rates are subject to change. Snapshot rates are locked at order creation.',
    fetchedAt: new Date().toISOString(),
  })
}

/**
 * POST /api/rates
 * Body: { inrAmount: string }
 * Returns a full customer quote + agent settlement + platform contribution breakdown
 * using the live rate settings (PRD §11.1, §11.2, §11.3).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = QuoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const settings = await getSettings()
    const inrAmount = parsed.data.inrAmount

    const quote = computeCustomerQuote({
      inrAmount,
      platformFeePercent: settings.platform_fee_percent,
      platformFeeFlatInr: settings.platform_fee_flat_inr,
      customerRate: settings.customer_quote_rate,
    })

    const settlement = computeAgentSettlement({
      inrPaid: inrAmount,
      agentRate: settings.agent_settlement_rate,
      commissionRate: settings.standard_commission_rate,
    })

    const contribution = computePlatformContribution({
      inrAmount,
      customerRate: settings.customer_quote_rate,
      agentRate: settings.agent_settlement_rate,
      commissionRate: settings.standard_commission_rate,
      platformFeePercent: settings.platform_fee_percent,
      platformFeeFlat: settings.platform_fee_flat_inr,
      referralCostUsdt: '0',
    })

    return NextResponse.json({
      quote,
      settlement,
      contribution,
      rates: {
        customer_quote_rate: settings.customer_quote_rate,
        agent_settlement_rate: settings.agent_settlement_rate,
        standard_commission_rate: settings.standard_commission_rate,
      },
      computedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to compute quote', message: String(err) },
      { status: 500 },
    )
  }
}
