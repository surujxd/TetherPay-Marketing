import { NextResponse } from 'next/server'

/**
 * GET /api/network-status
 * Returns illustrative blockchain network status (block height, avg fee, confirmation time).
 * In production, this would fetch live data from blockchain APIs (e.g. Trongrid, Etherscan).
 */
export async function GET() {
  const now = Date.now()
  const networks = [
    {
      key: 'tron',
      name: 'TRON',
      blockHeight: 71284503 + Math.floor((now / 3000) % 100),
      avgFee: '~1 USDT',
      avgConfirmTime: '~1 min',
      tps: 78,
      status: 'operational',
      lastBlockAgo: 3,
    },
    {
      key: 'bsc',
      name: 'BSC',
      blockHeight: 45128390 + Math.floor((now / 3000) % 100),
      avgFee: '~0.3 USDT',
      avgConfirmTime: '~3 min',
      tps: 142,
      status: 'operational',
      lastBlockAgo: 1,
    },
    {
      key: 'eth',
      name: 'Ethereum',
      blockHeight: 21845731 + Math.floor((now / 12000) % 100),
      avgFee: '~15 USDT',
      avgConfirmTime: '~5 min',
      tps: 14,
      status: 'operational',
      lastBlockAgo: 8,
    },
  ]

  return NextResponse.json({
    networks,
    checkedAt: new Date(now).toISOString(),
    source: 'illustrative',
  })
}
