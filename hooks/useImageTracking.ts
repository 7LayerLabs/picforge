'use client';

import { db } from '@/lib/instantdb';
import { useEffect } from 'react';
import { id } from '@instantdb/react';

/**
 * Hook to track user's image generation usage
 * Handles both authenticated and anonymous users
 */
export function useImageTracking() {
  const { user } = db.useAuth();

  // Query user's usage data
  const { data, isLoading, error } = db.useQuery(
    (user
      ? { usage: { $: { where: { userId: user.id } } } }
      : null) as any
  );

  const usage = (data as any)?.usage?.[0];

  /**
   * Track a new image generation
   */
  const trackImageGeneration = async (imageData: {
    prompt: string;
    originalUrl?: string;
    transformedUrl?: string;
    locked: boolean;
  }) => {
    if (!user) {
      console.log('User not logged in - skipping tracking');
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

    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.usage[usageId].update({
        userId: user.id,
        count: shouldReset ? 1 : currentCount + 1,
        lastReset: shouldReset ? now : lastReset,
        tier,
      })
    ]);

    return imageId;
  };

  /**
   * Save a favorite prompt or image
   */
  const saveFavorite = async (
    prompt: string,
    category?: string,
    originalUrl?: string,
    transformedUrl?: string,
    locked?: boolean
  ) => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
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
  };

  /**
   * Get user's favorite prompts
   */
  const { data: favoritesData } = db.useQuery(
    (user
      ? { favorites: { $: { where: { userId: user.id } } } }
      : null) as any
  );

  /**
   * Get user's image history
   */
  const { data: imagesData } = db.useQuery(
    (user
      ? { images: { $: { where: { userId: user.id } } } }
      : null) as any
  );

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
  const migrateFavoritesFromLocalStorage = async () => {
    if (!user) return;

    const localFavorites = localStorage.getItem('favoritePrompts');
    if (!localFavorites) return;

    try {
      const parsedFavorites = JSON.parse(localFavorites);
      if (!Array.isArray(parsedFavorites) || parsedFavorites.length === 0) return;

      console.log(`Migrating ${parsedFavorites.length} favorites from localStorage to InstantDB...`);

      // Migrate each favorite
      for (const fav of parsedFavorites) {
        await saveFavorite(fav.description, fav.category);
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('favoritePrompts');
      console.log('Migration complete! localStorage favorites cleared.');
    } catch (error) {
      console.error('Failed to migrate favorites:', error);
    }
  };

  return {
    user,
    usage,
    favorites: (favoritesData as any)?.favorites || [],
    imageHistory: (imagesData as any)?.images || [],
    trackImageGeneration,
    saveFavorite,
    deleteImage,
    hasReachedLimit,
    getRemainingImages,
    migrateFavoritesFromLocalStorage,
    isLoading,
    error,
  };
}
