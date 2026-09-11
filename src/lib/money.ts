import Decimal from 'decimal.js'

Decimal.set({ precision: 38, rounding: Decimal.ROUND_HALF_UP })

/** Round a decimal to N decimal places (HALF_UP). */
export function roundDP(value: Decimal, dp: number): string {
  return value.toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toFixed(dp)
}

/** Format INR amount with grouping and ₹ symbol, 2 dp. */
export function formatINR(value: string | number | Decimal): string {
  const d = new Decimal(value)
  const fixed = roundDP(d, 2)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `₹${grouped}.${decPart}`
}

/** Format USDT amount with 4 dp display precision. */
export function formatUSDT(value: string | number | Decimal, dp = 4): string {
  const d = new Decimal(value)
  const fixed = roundDP(d, dp)
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${grouped}.${decPart} USDT`
}

/** Format a plain number for compact display (e.g. 12.4K). */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** Mask an address/wallet for display. */
export function maskAddress(addr: string, head = 6, tail = 4): string {
  if (!addr) return ''
  if (addr.length <= head + tail) return addr
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`
}

/** Compute a customer quote per PRD §11.1. */
export function computeCustomerQuote(params: {
  inrAmount: string
  platformFeePercent: string
  platformFeeFlatInr: string
  customerRate: string
}) {
  const inr = new Decimal(params.inrAmount)
  const feePercent = new Decimal(params.platformFeePercent)
  const feeFlat = new Decimal(params.platformFeeFlatInr)
  const rate = new Decimal(params.customerRate)

  const platformFeeInr = inr.mul(feePercent).div(100).add(feeFlat)
  const totalInr = inr.add(platformFeeInr)
  const usdtDebit = totalInr.div(rate)

  return {
    inrAmount: roundDP(inr, 2),
    platformFeeInr: roundDP(platformFeeInr, 2),
    totalInr: roundDP(totalInr, 2),
    usdtDebit: roundDP(usdtDebit, 8),
    rate: roundDP(rate, 8),
  }
}

/** Compute agent settlement per PRD §11.2. */
export function computeAgentSettlement(params: {
  inrPaid: string
  agentRate: string
  commissionRate: string
}) {
  const inr = new Decimal(params.inrPaid)
  const rate = new Decimal(params.agentRate)
  const commission = new Decimal(params.commissionRate)

  const baseUsdt = inr.div(rate)
  const commissionInr = inr.mul(commission).div(100)
  const commissionUsdt = commissionInr.div(rate)
  const totalUsdt = baseUsdt.add(commissionUsdt)

  return {
    baseUsdt: roundDP(baseUsdt, 8),
    commissionInr: roundDP(commissionInr, 2),
    commissionUsdt: roundDP(commissionUsdt, 8),
    totalUsdt: roundDP(totalUsdt, 8),
  }
}

/** Platform contribution per order per PRD §11.3. */
export function computePlatformContribution(params: {
  inrAmount: string
  customerRate: string
  agentRate: string
  commissionRate: string
  platformFeePercent: string
  platformFeeFlat: string
  referralCostUsdt: string
}) {
  const quote = computeCustomerQuote({
    inrAmount: params.inrAmount,
    platformFeePercent: params.platformFeePercent,
    platformFeeFlatInr: params.platformFeeFlat,
    customerRate: params.customerRate,
  })
  const settlement = computeAgentSettlement({
    inrPaid: params.inrAmount,
    agentRate: params.agentRate,
    commissionRate: params.commissionRate,
  })
  const referralCost = new Decimal(params.referralCostUsdt)
  const customerDebit = new Decimal(quote.usdtDebit)
  const agentTotal = new Decimal(settlement.totalUsdt)
  const contribution = customerDebit.sub(agentTotal).sub(referralCost)
  const contributionPercent = customerDebit.gt(0)
    ? contribution.div(customerDebit).mul(100)
    : new Decimal(0)

  return {
    customerDebit: roundDP(customerDebit, 8),
    agentTotal: roundDP(agentTotal, 8),
    referralCostUsdt: roundDP(referralCost, 8),
    contribution: roundDP(contribution, 8),
    contributionPercent: roundDP(contributionPercent, 4),
    isNegative: contribution.lt(0),
  }
}
