/**
 * Google Analytics Usage Examples
 * Quick reference for common tracking scenarios in PicForge
 */

import {
  trackImageTransformation,
  trackPromptUsage,
  trackSignUp,
  trackSignIn,
  trackPromoCodeRedemption,
  trackDailyLimitReached,
  trackUpgradeClick,
  trackSocialShare,
  trackDownload,
  trackFavoritePrompt,
  trackBatchProcess,
  trackRoastGeneration,
  trackCanvasGeneration,
  trackRouletteSpinned,
  trackPromptWizardComplete,
  trackTemplateUsed,
  trackError,
  setUserProperties,
} from './analytics';

/**
 * Example 1: Track image transformation on main editor
 */
export function exampleImageTransformation() {
  // When user successfully generates an image
  trackImageTransformation({
    prompt_category: 'Art Styles',
    prompt_title: 'Van Gogh Starry Night style',
    locked_composition: true, // User had Lock Composition checked
    processing_time: 2300, // Optional: 2.3 seconds
    image_size: 1024000, // Optional: 1MB
  });
}

/**
 * Example 2: Track prompt selection from library
 */
export function examplePromptUsage() {
  // When user clicks a prompt in /prompts library
  trackPromptUsage({
    prompt_category: 'Fantasy',
    prompt_title: 'Dragon breathing fire',
    source: 'library', // 'library', 'custom', 'template', 'roulette', 'wizard'
  });
}

/**
 * Example 3: Track user sign up
 */
export function exampleSignUp() {
  // After successful magic link authentication
  trackSignUp('magic_link');

  // Set user properties for segmentation
  setUserProperties({
    user_tier: 'free',
    has_generated_images: false,
    total_transformations: 0,
  });
}

/**
 * Example 4: Track promo code redemption
 */
export function examplePromoCodeRedemption() {
  // When user successfully redeems a code
  trackPromoCodeRedemption({
    code_tier: 'unlimited',
    code_type: 'founder', // 'founder', 'family', 'beta'
  });

  // Update user properties
  setUserProperties({
    user_tier: 'unlimited',
  });
}

/**
 * Example 5: Track daily limit reached
 */
export function exampleDailyLimitReached() {
  // When free user hits 20 image limit
  const currentCount = 20;
  const limit = 20;

  trackDailyLimitReached(currentCount, limit);
}

/**
 * Example 6: Track upgrade button clicks
 */
export function exampleUpgradeClick() {
  // When user clicks "Upgrade to Pro" from limit modal
  trackUpgradeClick({
    source: 'limit_reached', // 'limit_reached', 'pricing_page', 'profile', 'watermark_notice'
    tier_clicked: 'pro', // 'pro', 'yearly'
  });
}

/**
 * Example 7: Track social shares
 */
export function exampleSocialShare() {
  // When user shares to Twitter
  trackSocialShare({
    platform: 'twitter', // 'twitter', 'instagram', 'tiktok', 'download'
    content_type: 'before_after', // 'single', 'before_after'
  });
}

/**
 * Example 8: Track image downloads
 */
export function exampleDownload() {
  // When user downloads from main editor
  trackDownload('main_editor'); // 'main_editor', 'batch', 'share_modal', 'gallery'
}

/**
 * Example 9: Track favorite prompt actions
 */
export function exampleFavoritePrompt() {
  // When user clicks heart icon on a prompt
  trackFavoritePrompt(
    'Transform into anime character', // Prompt title
    'Art Styles', // Category
    'add' // 'add' or 'remove'
  );
}

/**
 * Example 10: Track batch processing
 */
export function exampleBatchProcess() {
  // When batch processing completes
  trackBatchProcess(
    25, // Number of images processed
    'sharpen', // Effect type
    false // is NSFW batch?
  );
}

/**
 * Example 11: Track roast generation
 */
export function exampleRoastGeneration() {
  // When user generates a roast
  trackRoastGeneration('nuclear'); // 'mild', 'spicy', 'nuclear'
}

/**
 * Example 12: Track canvas generation
 */
export function exampleCanvasGeneration() {
  // When AI image generation completes
  trackCanvasGeneration(
    'A majestic dragon flying over mountains at sunset', // User's prompt
    '1024x1024', // Size
    'standard', // Quality
    true // Success?
  );
}

/**
 * Example 13: Track roulette spin
 */
export function exampleRouletteSpin() {
  // When roulette lands on a prompt
  trackRouletteSpinned({
    category: 'Movie Magic',
    prompt_title: 'Star Wars poster style',
    spin_number: 1,
    streak: 1,
  });
}

/**
 * Example 14: Track prompt wizard completion
 */
export function examplePromptWizardComplete() {
  // When user completes all wizard steps
  trackPromptWizardComplete(
    5, // Number of steps completed
    150 // Length of final generated prompt
  );
}

/**
 * Example 15: Track template usage
 */
export function exampleTemplateUsed() {
  // When user selects a template
  trackTemplateUsed('Professional Headshot Transform');
}

/**
 * Example 16: Track errors
 */
export function exampleErrorTracking() {
  // When an error occurs
  try {
    // Your code that might fail
    throw new Error('Image processing failed');
  } catch (error) {
    trackError({
      error_type: 'image_processing',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      page_path: window.location.pathname,
    });
  }
}

/**
 * Example 17: Update user properties for segmentation
 */
export function exampleUpdateUserProperties() {
  // After user generates their 10th image (power user!)
  setUserProperties({
    user_tier: 'free',
    has_generated_images: true,
    total_transformations: 10,
    favorite_category: 'Art Styles', // Optional: track most-used category
  });
}

/**
 * Example 18: Complete user journey tracking
 */
export function exampleCompleteUserJourney() {
  // Step 1: User lands on site (automatic)

  // Step 2: User signs up
  trackSignUp('magic_link');
  setUserProperties({
    user_tier: 'free',
    has_generated_images: false,
    total_transformations: 0,
  });

  // Step 3: User selects a prompt
  trackPromptUsage({
    prompt_category: 'Art Styles',
    prompt_title: 'Van Gogh style',
    source: 'library',
  });

  // Step 4: User generates first image
  trackImageTransformation({
    prompt_category: 'Art Styles',
    prompt_title: 'Van Gogh style',
    locked_composition: false,
  });

  // Update user properties
  setUserProperties({
    user_tier: 'free',
    has_generated_images: true,
    total_transformations: 1,
    favorite_category: 'Art Styles',
  });

  // Step 5: User shares on social media
  trackSocialShare({
    platform: 'twitter',
    content_type: 'single',
  });

  // Step 6: User hits daily limit
  trackDailyLimitReached(20, 20);

  // Step 7: User clicks upgrade
  trackUpgradeClick({
    source: 'limit_reached',
    tier_clicked: 'pro',
  });

  // Step 8: User redeems promo code instead
  trackPromoCodeRedemption({
    code_tier: 'unlimited',
    code_type: 'beta',
  });

  // Update final user properties
  setUserProperties({
    user_tier: 'unlimited',
    has_generated_images: true,
    total_transformations: 20,
    favorite_category: 'Art Styles',
  });
}

/**
 * HOW TO USE IN YOUR COMPONENTS:
 *
 * 1. Import the tracking function you need:
 *    import { trackImageTransformation } from '@/lib/analytics';
 *
 * 2. Call it at the appropriate time:
 *    const handleSubmit = async () => {
 *      const result = await processImage();
 *
 *      // Track the event
 *      trackImageTransformation({
 *        prompt_category: category,
 *        prompt_title: prompt,
 *        locked_composition: isLocked,
 *      });
 *    };
 *
 * 3. Events are non-blocking and won't affect user experience
 * 4. Check browser console in development to see "GA Event" logs
 * 5. View events in GA4 Realtime reports within 30 seconds
 */
