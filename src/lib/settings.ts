import { db } from '@/lib/db'

/**
 * Default platform settings (PRD §24).
 * These mirror the example values in the specification and are seeded into
 * the RateSetting table on first read. Admins can mutate them at runtime.
 */
export const DEFAULT_SETTINGS: Record<string, { value: string; unit: string; note?: string }> = {
  customer_quote_rate: { value: '91.50', unit: 'inr_per_usdt', note: 'INR per USDT charged to customer' },
  agent_settlement_rate: { value: '91.00', unit: 'inr_per_usdt', note: 'INR per USDT paid to agent' },
  platform_fee_percent: { value: '0.00', unit: 'percent', note: 'Percentage fee on order INR amount' },
  platform_fee_flat_inr: { value: '0.00', unit: 'inr', note: 'Flat fee per order (INR)' },
  standard_commission_rate: { value: '1.50', unit: 'percent', note: 'Standard agent commission tier' },
  trusted_commission_rate: { value: '1.75', unit: 'percent', note: 'Trusted agent commission tier' },
  premium_commission_rate: { value: '2.00', unit: 'percent', note: 'Premium agent commission tier' },
  customer_referral_reward_usdt: { value: '1.00', unit: 'usdt', note: 'Reward per qualifying customer referral' },
  agent_partner_reward_percent: { value: '5.00', unit: 'percent', note: 'Partner reward on referred agent commissions' },
  min_deposit_usdt: { value: '10', unit: 'usdt', note: 'Minimum USDT deposit' },
  max_deposit_usdt: { value: '50000', unit: 'usdt', note: 'Maximum USDT deposit' },
  order_expiry_minutes: { value: '10', unit: 'minutes', note: 'Payment order expiry window' },
}

let seededPromise: Promise<void> | null = null

/** Ensure default settings exist in the database (idempotent, concurrency-safe). */
export function ensureSettingsSeeded(): Promise<void> {
  if (!seededPromise) {
    seededPromise = (async () => {
      try {
        const existing = await db.rateSetting.count()
        if (existing === 0) {
          await db.rateSetting.createMany({
            // skipDuplicates guards against concurrent first-insert races (P2002)
            skipDuplicates: true,
            data: Object.entries(DEFAULT_SETTINGS).map(([key, s]) => ({
              key,
              value: s.value,
              unit: s.unit,
              note: s.note ?? null,
            })),
          })
        }
      } catch {
        // ignore — concurrent inserts are fine; reads will still work
      }
    })()
  }
  return seededPromise
}

/** Read all settings as a key→value map. */
export async function getSettings(): Promise<Record<string, string>> {
  await ensureSettingsSeeded()
  const rows = await db.rateSetting.findMany()
  const map: Record<string, string> = {}
  for (const r of rows) map[r.key] = r.value
  return map
}

/** Read a single setting, falling back to the default if missing. */
export async function getSetting(key: string): Promise<string> {
  await ensureSettingsSeeded()
  const row = await db.rateSetting.findUnique({ where: { key } })
  if (row) return row.value
  return DEFAULT_SETTINGS[key]?.value ?? '0'
}
