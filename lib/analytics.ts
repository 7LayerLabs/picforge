/**
 * Google Analytics 4 Helper Functions
 * Provides type-safe event tracking for PicForge
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Event types for PicForge
export type GAEvent =
  | 'image_transformation'
  | 'prompt_usage'
  | 'sign_up'
  | 'sign_in'
  | 'promo_code_redemption'
  | 'daily_limit_reached'
  | 'upgrade_click'
  | 'social_share'
  | 'download_image'
  | 'favorite_prompt'
  | 'batch_process'
  | 'roast_generation'
  | 'canvas_generation'
  | 'roulette_spin'
  | 'prompt_wizard_complete'
  | 'template_used'
  | 'page_view'
  | 'error_occurred';

export interface ImageTransformationEvent {
  prompt_category?: string;
  prompt_title?: string;
  locked_composition: boolean;
  is_nsfw: boolean;
  processing_time?: number;
  image_size?: number;
}

export interface PromptUsageEvent {
  prompt_category: string;
  prompt_title: string;
  source: 'library' | 'custom' | 'template' | 'roulette' | 'wizard';
}

export interface PromoCodeRedemptionEvent {
  code_tier: string;
  code_type: string;
}

export interface SocialShareEvent {
  platform: 'twitter' | 'instagram' | 'tiktok' | 'download';
  content_type: 'single' | 'before_after';
}

export interface UpgradeClickEvent {
  source: 'limit_reached' | 'pricing_page' | 'profile' | 'watermark_notice';
  tier_clicked: 'pro' | 'yearly';
}

export interface ErrorEvent {
  error_type: string;
  error_message: string;
  page_path: string;
}

/**
 * Initialize Google Analytics
 * Call this once in the root layout
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Initialize with timestamp
  window.gtag('js', new Date());

  // Configure GA4
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  console.log('Google Analytics initialized:', measurementId);
};

/**
 * Track page views manually
 * Useful for client-side navigation in Next.js
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
    page_path: url,
  });
};

/**
 * Generic event tracking
 */
export const trackEvent = (
  eventName: GAEvent,
  eventParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('GA Event (dev):', eventName, eventParams);
    return;
  }

  window.gtag('event', eventName, {
    ...eventParams,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track image transformation
 */
export const trackImageTransformation = (params: ImageTransformationEvent) => {
  trackEvent('image_transformation', {
    event_category: 'engagement',
    event_label: params.prompt_title || 'custom_prompt',
    prompt_category: params.prompt_category,
    locked_composition: params.locked_composition,
    is_nsfw: params.is_nsfw,
    processing_time_ms: params.processing_time,
    image_size_bytes: params.image_size,
  });
};

/**
 * Track prompt usage from library
 */
export const trackPromptUsage = (params: PromptUsageEvent) => {
  trackEvent('prompt_usage', {
    event_category: 'content',
    event_label: params.prompt_title,
    prompt_category: params.prompt_category,
    source: params.source,
  });
};

/**
 * Track user sign up
 */
export const trackSignUp = (method: 'magic_link' | 'email') => {
  trackEvent('sign_up', {
    event_category: 'user',
    method,
  });
};

/**
 * Track user sign in
 */
export const trackSignIn = (method: 'magic_link' | 'email') => {
  trackEvent('sign_in', {
    event_category: 'user',
    method,
  });
};

/**
 * Track promo code redemption
 */
export const trackPromoCodeRedemption = (params: PromoCodeRedemptionEvent) => {
  trackEvent('promo_code_redemption', {
    event_category: 'conversion',
    event_label: params.code_tier,
    code_tier: params.code_tier,
    code_type: params.code_type,
    value: params.code_tier === 'unlimited' ? 1 : 0, // For conversion tracking
  });
};

/**
 * Track when user hits daily limit
 */
export const trackDailyLimitReached = (
  currentCount: number,
  limit: number
) => {
  trackEvent('daily_limit_reached', {
    event_category: 'engagement',
    current_count: currentCount,
    limit,
  });
};

/**
 * Track upgrade button clicks
 */
export const trackUpgradeClick = (params: UpgradeClickEvent) => {
  trackEvent('upgrade_click', {
    event_category: 'conversion',
    event_label: params.tier_clicked,
    source: params.source,
    tier_clicked: params.tier_clicked,
  });
};

/**
 * Track social shares
 */
export const trackSocialShare = (params: SocialShareEvent) => {
  trackEvent('social_share', {
    event_category: 'engagement',
    event_label: params.platform,
    platform: params.platform,
    content_type: params.content_type,
  });
};

/**
 * Track image downloads
 */
export const trackDownload = (source: 'main_editor' | 'batch' | 'share_modal' | 'gallery') => {
  trackEvent('download_image', {
    event_category: 'engagement',
    source,
  });
};

/**
 * Track favorite prompts
 */
export const trackFavoritePrompt = (
  promptTitle: string,
  category: string,
  action: 'add' | 'remove'
) => {
  trackEvent('favorite_prompt', {
    event_category: 'engagement',
    event_label: promptTitle,
    action,
    category,
  });
};

/**
 * Track batch processing
 */
export const trackBatchProcess = (
  imageCount: number,
  effectType: string,
  isNSFW: boolean
) => {
  trackEvent('batch_process', {
    event_category: 'engagement',
    image_count: imageCount,
    effect_type: effectType,
    is_nsfw: isNSFW,
  });
};

/**
 * Track roast generation
 */
export const trackRoastGeneration = (intensity: 'mild' | 'spicy' | 'nuclear') => {
  trackEvent('roast_generation', {
    event_category: 'engagement',
    intensity,
  });
};

/**
 * Track canvas/AI image generation
 */
export const trackCanvasGeneration = (
  prompt: string,
  size: string,
  quality: string,
  success: boolean
) => {
  trackEvent('canvas_generation', {
    event_category: 'engagement',
    size,
    quality,
    success,
    prompt_length: prompt.length,
  });
};

/**
 * Track roulette spins
 */
export const trackRouletteSpinned = (category: string, promptTitle: string) => {
  trackEvent('roulette_spin', {
    event_category: 'engagement',
    event_label: promptTitle,
    category,
  });
};

/**
 * Track prompt wizard completion
 */
export const trackPromptWizardComplete = (
  steps_completed: number,
  final_prompt_length: number
) => {
  trackEvent('prompt_wizard_complete', {
    event_category: 'engagement',
    steps_completed,
    final_prompt_length,
  });
};

/**
 * Track template usage
 */
export const trackTemplateUsed = (templateName: string) => {
  trackEvent('template_used', {
    event_category: 'content',
    event_label: templateName,
  });
};

/**
 * Track errors
 */
export const trackError = (params: ErrorEvent) => {
  trackEvent('error_occurred', {
    event_category: 'error',
    error_type: params.error_type,
    error_message: params.error_message,
    page_path: params.page_path,
  });
};

/**
 * Set user properties (useful for segmentation)
 */
export const setUserProperties = (properties: {
  user_tier?: 'free' | 'pro' | 'unlimited';
  has_generated_images?: boolean;
  total_transformations?: number;
  favorite_category?: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Track conversions (for Google Ads)
 */
export const trackConversion = (
  conversionLabel: string,
  value?: number,
  currency: string = 'USD'
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}/${conversionLabel}`,
    value,
    currency,
  });
};
