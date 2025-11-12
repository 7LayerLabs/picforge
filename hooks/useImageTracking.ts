'use client';

import { db } from '@/lib/instantdb';
import { useEffect, useCallback } from 'react';
import { id } from '@instantdb/react';
import { trackImageTransformation, trackFavoritePrompt, setUserProperties } from '@/lib/analytics';
import { logger } from '@/lib/logger';

/**
 * Hook to track user's image generation usage
 * Handles both authenticated and anonymous users
 */
export function useImageTracking() {
  let user = null;
  let authError = null;

  try {
    const auth = db.useAuth();
    user = auth.user;
  } catch (e) {
    authError = e;
    logger.error('InstantDB auth failed:', e);
  }

  /**
   * Send email notification (helper function)
   */
  const sendEmailNotification = useCallback(
    async (type: string, data: any) => {
      if (!user?.email) return;

      try {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: user.email, type, data }),
        });
      } catch (error) {
        logger.error('Failed to send email notification:', error);
      }
    },
    [user]
  );

  // Query user's usage data with error handling
  let data, isLoading, error;
  try {
    const queryResult = db.useQuery(
      (user
        ? { usage: { $: { where: { userId: user.id } } } }
        : null) as any
    );
    data = queryResult.data;
    isLoading = queryResult.isLoading;
    error = queryResult.error || authError;
  } catch (e) {
    logger.error('InstantDB query failed:', e);
    data = null;
    isLoading = false;
    error = e;
  }

  const usage = (data as any)?.usage?.[0];

  /**
   * Get user's favorite prompts
   */
  let favoritesData;
  try {
    const result = db.useQuery(
      (user
        ? { favorites: { $: { where: { userId: user.id } } } }
        : null) as any
    );
    favoritesData = result.data;
  } catch (e) {
    logger.error('InstantDB favorites query failed:', e);
    favoritesData = null;
  }

  /**
   * Get user's image history
   */
  let imagesData;
  try {
    const result = db.useQuery(
      (user
        ? { images: { $: { where: { userId: user.id } } } }
        : null) as any
    );
    imagesData = result.data;
  } catch (e) {
    logger.error('InstantDB images query failed:', e);
    imagesData = null;
  }

  /**
   * Track a new image generation
   */
  const trackImageGeneration = async (imageData: {
    prompt: string;
    originalUrl?: string;
    transformedUrl?: string;
    locked: boolean;
    category?: string;
    isNSFW?: boolean;
  }) => {
    if (!user) {
      logger.log('User not logged in - skipping tracking');
      return;
    }

    const imageId = id();
    const now = Date.now();

    // Save the image record
    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.images[imageId].update({
        userId: user.id,
        prompt: imageData.prompt,
        originalUrl: imageData.originalUrl,
        transformedUrl: imageData.transformedUrl,
        locked: imageData.locked,
        timestamp: now,
      })
    ]);

    // Update usage count
    const usageId = usage?.id || id();
    const currentCount = usage?.count || 0;
    const lastReset = usage?.lastReset || now;
    const tier = usage?.tier || 'free';

    // Check if we need to reset (24 hours for free tier)
    const shouldReset = tier === 'free' && now - lastReset > 24 * 60 * 60 * 1000;

    const newCount = shouldReset ? 1 : currentCount + 1;

    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.usage[usageId].update({
        userId: user.id,
        count: newCount,
        lastReset: shouldReset ? now : lastReset,
        tier,
      })
    ]);

    // Track in Google Analytics
    trackImageTransformation({
      prompt_category: imageData.category,
      prompt_title: imageData.prompt.substring(0, 100), // Limit length
      locked_composition: imageData.locked,
      is_nsfw: imageData.isNSFW || false,
    });

    // Update user properties for segmentation
    setUserProperties({
      user_tier: tier,
      has_generated_images: true,
      total_transformations: newCount,
    });

    // Send email notifications for free tier users
    if (tier === 'free') {
      const remaining = 20 - newCount;

      // Send warning at 5 images remaining
      if (remaining === 5) {
        sendEmailNotification('limit-warning', {
          userName: user.email?.split('@')[0],
          remainingImages: remaining,
        });
      }

      // Send limit reached notification
      if (remaining === 0) {
        const resetTime = new Date(lastReset + 24 * 60 * 60 * 1000);
        const hoursUntilReset = Math.ceil((resetTime.getTime() - now) / (1000 * 60 * 60));

        let resetTimeText = '';
        if (hoursUntilReset <= 1) {
          resetTimeText = 'in less than 1 hour';
        } else if (hoursUntilReset < 24) {
          resetTimeText = `in ${hoursUntilReset} hours`;
        } else {
          resetTimeText = resetTime.toLocaleDateString('en-US', {
            weekday: 'long',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short',
          });
        }

        sendEmailNotification('limit-reached', {
          userName: user.email?.split('@')[0],
          resetTime: resetTimeText,
        });
      }
    }

    return imageId;
  };

  /**
   * Save a favorite prompt or image
   */
  const saveFavorite = useCallback(async (
    prompt: string,
    category?: string,
    originalUrl?: string,
    transformedUrl?: string,
    locked?: boolean
  ) => {
    if (!user) {
      return { success: false, error: 'Please sign in to save favorites' };
    }

    try {
      // Check if already favorited
      const existingFavorite = (favoritesData as any)?.favorites?.find(
        (fav: any) => fav.prompt === prompt && fav.userId === user.id
      );

      if (existingFavorite) {
        return { success: false, error: 'Already in favorites' };
      }

      const favoriteId = id();
      await db.transact([
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.favorites[favoriteId].update({
          userId: user.id,
          prompt,
          category,
          originalUrl,
          transformedUrl,
          locked,
          timestamp: Date.now(),
        })
      ]);

      // Track in Google Analytics
      trackFavoritePrompt(prompt.substring(0, 100), category || 'uncategorized', 'add');

      return { success: true };
    } catch (error) {
      logger.error('Failed to save favorite:', error);
      return { success: false, error: 'Failed to save favorite' };
    }
  }, [user, favoritesData]);

  /**
   * Remove a favorite prompt
   */
  const removeFavorite = useCallback(async (favoriteId: string) => {
    if (!user) {
      return { success: false, error: 'Please sign in to remove favorites' };
    }

    try {
      await db.transact([
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.favorites[favoriteId].delete()
      ]);

      // Track in Google Analytics
      trackFavoritePrompt('removed', 'uncategorized', 'remove');

      return { success: true };
    } catch (error) {
      logger.error('Failed to remove favorite:', error);
      return { success: false, error: 'Failed to remove favorite' };
    }
  }, [user]);

  /**
   * Check if user has reached their limit
   */
  const hasReachedLimit = () => {
    if (!user || !usage) return false;
    if (usage.tier === 'pro' || usage.tier === 'unlimited') return false; // Pro and code users have unlimited

    // Free tier: 20 images per day
    return usage.count >= 20;
  };

  /**
   * Get remaining images for free tier
   */
  const getRemainingImages = () => {
    if (!user || !usage) return null;
    if (usage.tier === 'pro' || usage.tier === 'unlimited') return 'Unlimited';

    const remaining = Math.max(0, 20 - usage.count);
    return remaining;
  };

  /**
   * Delete an image from history
   */
  const deleteImage = async (imageId: string) => {
    if (!user) {
      alert('Please sign in to delete images');
      return;
    }

    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.images[imageId].delete()
    ]);
  };

  /**
   * Migrate localStorage favorites to InstantDB (one-time migration)
   */
  const migrateFavoritesFromLocalStorage = useCallback(async () => {
    if (!user) return { success: false, migrated: 0 };

    const localFavorites = localStorage.getItem('favoritePrompts');
    if (!localFavorites) return { success: true, migrated: 0 };

    try {
      const parsedFavorites = JSON.parse(localFavorites);
      if (!Array.isArray(parsedFavorites) || parsedFavorites.length === 0) {
        localStorage.removeItem('favoritePrompts');
        return { success: true, migrated: 0 };
      }

      logger.log(`Migrating ${parsedFavorites.length} favorites from localStorage to InstantDB...`);

      let migrated = 0;
      // Migrate each favorite
      for (const fav of parsedFavorites) {
        const result = await saveFavorite(fav.description, fav.category);
        if (result.success) {
          migrated++;
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('favoritePrompts');
      logger.log(`Migration complete! ${migrated} favorites migrated, localStorage cleared.`);

      return { success: true, migrated };
    } catch (error) {
      logger.error('Failed to migrate favorites:', error);
      return { success: false, migrated: 0, error: String(error) };
    }
  }, [user, saveFavorite]);

  return {
    user,
    usage,
    favorites: (favoritesData as any)?.favorites || [],
    imageHistory: (imagesData as any)?.images || [],
    trackImageGeneration,
    saveFavorite,
    removeFavorite,
    deleteImage,
    hasReachedLimit,
    getRemainingImages,
    migrateFavoritesFromLocalStorage,
    isLoading,
    error,
  };
}
