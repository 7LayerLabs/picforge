/**
 * Tier Configuration for PicForge
 *
 * Central source of truth for all tier-based limits and features.
 * Used by hooks, components, and API routes to enforce limits.
 */

export type TierType = 'free' | 'starter' | 'creator' | 'pro' | 'unlimited' | 'elite';

// AI model types for tier-based model selection
export type AIModelType = 'gemini-2.0-flash-exp' | 'gemini-2.5-flash-preview-05-20';

export interface TierConfig {
  name: string;
  displayName: string;
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    // Image generation limits
    imagesPerDay: number | null; // null = unlimited, only for free tier (daily)
    imagesPerMonth: number | null; // null = unlimited

    // Batch processing limits
    batchSize: number; // Max images per batch

    // Feature flags
    hasWatermark: boolean;
    hasPriorityQueue: boolean;
    hasApiAccess: boolean;

    // AI Model selection (Elite gets premium model)
    aiModel: AIModelType;
  };
  features: string[];
}

export const TIER_CONFIG: Record<TierType, TierConfig> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: { monthly: 0, yearly: 0 },
    limits: {
      imagesPerDay: 10,
      imagesPerMonth: null, // Uses daily limit instead
      batchSize: 5,
      hasWatermark: true,
      hasPriorityQueue: false,
      hasApiAccess: false,
      aiModel: 'gemini-2.0-flash-exp',
    },
    features: [
      '10 images/day',
      '272+ AI templates',
      'Basic batch (5 images)',
      'Canvas generation',
    ],
  },
  starter: {
    name: 'starter',
    displayName: 'Starter',
    price: { monthly: 7, yearly: 59 },
    limits: {
      imagesPerDay: null, // Uses monthly limit
      imagesPerMonth: 100,
      batchSize: 20,
      hasWatermark: false,
      hasPriorityQueue: false,
      hasApiAccess: false,
      aiModel: 'gemini-2.0-flash-exp',
    },
    features: [
      '100 images/month',
      '272+ AI templates',
      'Batch up to 20 images',
      'No watermark',
      'Canvas generation',
    ],
  },
  creator: {
    name: 'creator',
    displayName: 'Creator',
    price: { monthly: 19, yearly: 159 },
    limits: {
      imagesPerDay: null,
      imagesPerMonth: 500,
      batchSize: 50,
      hasWatermark: false,
      hasPriorityQueue: true,
      hasApiAccess: false,
      aiModel: 'gemini-2.0-flash-exp',
    },
    features: [
      '500 images/month',
      '272+ AI templates',
      'Batch up to 50 images',
      'No watermark',
      'Priority queue',
      'Canvas generation',
    ],
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    price: { monthly: 39, yearly: 329 },
    limits: {
      imagesPerDay: null,
      imagesPerMonth: 2000,
      batchSize: 100,
      hasWatermark: false,
      hasPriorityQueue: true,
      hasApiAccess: false,
      aiModel: 'gemini-2.0-flash-exp',
    },
    features: [
      '2,000 images/month',
      '272+ AI templates',
      'Batch up to 100 images',
      'No watermark',
      'Priority queue',
      'Canvas generation',
    ],
  },
  unlimited: {
    name: 'unlimited',
    displayName: 'Unlimited',
    price: { monthly: 79, yearly: 669 },
    limits: {
      imagesPerDay: null,
      imagesPerMonth: null, // Truly unlimited
      batchSize: 200,
      hasWatermark: false,
      hasPriorityQueue: true,
      hasApiAccess: true,
      aiModel: 'gemini-2.0-flash-exp',
    },
    features: [
      'Unlimited images',
      '272+ AI templates',
      'Batch up to 200 images',
      'No watermark',
      'Priority queue',
      'API access (coming soon)',
      'Dedicated support',
    ],
  },
  elite: {
    name: 'elite',
    displayName: 'Elite',
    price: { monthly: 79, yearly: 659 },
    limits: {
      imagesPerDay: null,
      imagesPerMonth: null, // Truly unlimited
      batchSize: 500,
      hasWatermark: false,
      hasPriorityQueue: true,
      hasApiAccess: true,
      aiModel: 'gemini-2.5-flash-preview-05-20', // Premium Gemini 2.5 model
    },
    features: [
      'Unlimited images',
      '🔥 Gemini 2.5 Flash (Premium AI)',
      'Batch up to 500 images',
      'No watermark',
      'Priority queue',
      'API access',
      'Dedicated support',
      'Early access to new features',
    ],
  },
};

/**
 * Get tier config for a given tier
 */
export function getTierConfig(tier: TierType | undefined): TierConfig {
  return TIER_CONFIG[tier || 'free'];
}

/**
 * Get the AI model to use for a given tier
 * Elite tier gets premium Gemini 2.5, others get standard model
 */
export function getAIModel(tier: TierType | undefined): AIModelType {
  return getTierConfig(tier).limits.aiModel;
}

/**
 * Check if tier is an elite/premium tier
 */
export function isEliteTier(tier: TierType | undefined): boolean {
  return tier === 'elite';
}

/**
 * Check if a tier has reached its limit
 */
export function hasReachedLimit(
  tier: TierType | undefined,
  dailyCount: number,
  monthlyCount: number
): boolean {
  const config = getTierConfig(tier);

  // Free tier uses daily limits
  if (tier === 'free' || !tier) {
    return config.limits.imagesPerDay !== null && dailyCount >= config.limits.imagesPerDay;
  }

  // Unlimited and Elite tiers never reach limit
  if (tier === 'unlimited' || tier === 'elite') {
    return false;
  }

  // Paid tiers use monthly limits
  return config.limits.imagesPerMonth !== null && monthlyCount >= config.limits.imagesPerMonth;
}

/**
 * Get remaining images for a tier
 */
export function getRemainingImages(
  tier: TierType | undefined,
  dailyCount: number,
  monthlyCount: number
): number | 'Unlimited' {
  const config = getTierConfig(tier);

  // Unlimited and Elite tiers
  if (tier === 'unlimited' || tier === 'elite') {
    return 'Unlimited';
  }

  // Free tier uses daily limits
  if (tier === 'free' || !tier) {
    const limit = config.limits.imagesPerDay || 10;
    return Math.max(0, limit - dailyCount);
  }

  // Paid tiers use monthly limits
  const limit = config.limits.imagesPerMonth || 0;
  return Math.max(0, limit - monthlyCount);
}

/**
 * Get the batch size limit for a tier
 */
export function getBatchLimit(tier: TierType | undefined): number {
  return getTierConfig(tier).limits.batchSize;
}

/**
 * Check if tier should have watermark
 */
export function shouldHaveWatermark(tier: TierType | undefined): boolean {
  return getTierConfig(tier).limits.hasWatermark;
}

/**
 * Check if tier has priority queue access
 */
export function hasPriorityQueue(tier: TierType | undefined): boolean {
  return getTierConfig(tier).limits.hasPriorityQueue;
}

/**
 * Check if tier is a paid tier
 */
export function isPaidTier(tier: TierType | undefined): boolean {
  return tier !== 'free' && tier !== undefined;
}

/**
 * Get the limit display text for a tier
 */
export function getLimitDisplayText(tier: TierType | undefined): string {
  const config = getTierConfig(tier);

  if (tier === 'unlimited') {
    return 'Unlimited';
  }

  if (tier === 'free' || !tier) {
    return `${config.limits.imagesPerDay}/day`;
  }

  return `${config.limits.imagesPerMonth}/month`;
}

/**
 * Check if monthly reset is needed (for paid tiers)
 */
export function needsMonthlyReset(lastMonthlyReset: number | undefined): boolean {
  if (!lastMonthlyReset) return true;

  const now = Date.now();
  const lastReset = new Date(lastMonthlyReset);
  const currentMonth = new Date(now);

  // Reset if we're in a different month
  return lastReset.getMonth() !== currentMonth.getMonth() ||
    lastReset.getFullYear() !== currentMonth.getFullYear();
}

/**
 * Check if daily reset is needed (for free tier)
 */
export function needsDailyReset(lastDailyReset: number | undefined): boolean {
  if (!lastDailyReset) return true;

  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return now - lastDailyReset > twentyFourHours;
}
