import { db } from './instantdb';
import { id } from '@instantdb/react';

/**
 * Generate a random promo code
 * Format: PREFIX-RANDOM-XXXX
 */
export function generatePromoCode(prefix: string = 'PICFORGE'): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
}

/**
 * Create a new promo code in the database
 * @param code - The promo code string (e.g., "DEREK-FOUNDER-2025")
 * @param tier - The tier to grant ('unlimited', 'pro')
 * @param createdBy - Optional user ID who created the code
 */
export async function createPromoCode(
  code: string,
  tier: 'unlimited' | 'pro' = 'unlimited',
  createdBy?: string
): Promise<string> {
  const codeId = id();
  const upperCode = code.toUpperCase().trim();

  await db.transact([
    // @ts-expect-error InstantDB tx type inference issue
    db.tx.promoCodes[codeId].update({
      code: upperCode,
      tier,
      isRedeemed: false,
      createdAt: Date.now(),
      createdBy,
    })
  ]);

  return codeId;
}

/**
 * Check if a promo code exists and is valid
 */
export async function validatePromoCode(code: string): Promise<{
  valid: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codeData?: any;
}> {
  const upperCode = code.toUpperCase().trim();

  // Query for the code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await db.useQuery({
    promoCodes: {
      $: {
        where: {
          code: upperCode
        }
      }
    }
  } as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const codes = (data as any)?.promoCodes || [];

  if (codes.length === 0) {
    return { valid: false, message: 'Invalid code. Please check and try again.' };
  }

  const codeData = codes[0];

  if (codeData.isRedeemed) {
    return { valid: false, message: 'This code has already been redeemed.' };
  }

  return { valid: true, message: 'Code is valid!', codeData };
}

/**
 * Redeem a promo code for a user
 * @param code - The promo code to redeem
 * @param userId - The user redeeming the code
 * @param usageId - The user's usage record ID
 */
export async function redeemPromoCode(
  code: string,
  userId: string,
  usageId: string
): Promise<{ success: boolean; message: string; tier?: string }> {
  const upperCode = code.toUpperCase().trim();

  // First, find the code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await db.useQuery({
    promoCodes: {
      $: {
        where: {
          code: upperCode
        }
      }
    }
  } as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const codes = (data as any)?.promoCodes || [];

  if (codes.length === 0) {
    return { success: false, message: 'Invalid code. Please check and try again.' };
  }

  const codeData = codes[0];

  if (codeData.isRedeemed) {
    return { success: false, message: 'This code has already been redeemed.' };
  }

  const now = Date.now();

  try {
    // Update both the promo code and the user's tier in a single transaction
    await db.transact([
      // Mark code as redeemed
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.promoCodes[codeData.id].update({
        isRedeemed: true,
        redeemedBy: userId,
        redeemedAt: now,
      }),
      // Upgrade user's tier
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.usage[usageId].update({
        tier: codeData.tier,
      })
    ]);

    return {
      success: true,
      message: `Success! You now have ${codeData.tier} access with unlimited images!`,
      tier: codeData.tier
    };
  } catch (error) {
    console.error('Error redeeming code:', error);
    return { success: false, message: 'Failed to redeem code. Please try again.' };
  }
}

/**
 * Pre-generate some codes for Derek and initial users
 */
export const INITIAL_CODES = [
  { code: 'DEREK-FOUNDER-2025', tier: 'unlimited' as const },
  { code: 'BOBOLA-FAM-01', tier: 'unlimited' as const },
  { code: 'BOBOLA-FAM-02', tier: 'unlimited' as const },
  { code: 'BOBOLA-FAM-03', tier: 'unlimited' as const },
  { code: 'BETA-VIP-001', tier: 'unlimited' as const },
  { code: 'BETA-VIP-002', tier: 'unlimited' as const },
  { code: 'BETA-VIP-003', tier: 'unlimited' as const },
];
