'use client';

import { useCallback } from 'react';
import { db } from '@/lib/instantdb';
import { id } from '@instantdb/react';
import { logger } from '@/lib/logger';

/**
 * Hook to handle showcase voting logic
 * Manages upvotes/downvotes with real-time updates
 */
export function useShowcaseVotes() {
  const { user } = db.useAuth();

  /**
   * Toggle like/unlike for a showcase item
   */
  const toggleVote = useCallback(
    async (showcaseId: string) => {
      if (!user) {
        throw new Error('Must be signed in to vote');
      }

      // Query for existing like
      // @ts-expect-error InstantDB queryOnce type inference issue
      const { data } = await db.queryOnce({
        showcaseLikes: {
          $: {
            where: {
              showcaseId,
              userId: user.id,
            },
          },
        },
        showcaseSubmissions: {
          $: {
            where: {
              id: showcaseId,
            },
          },
        },
      } as any);

      const existingLike = (data as any)?.showcaseLikes?.[0];
      const showcase = (data as any)?.showcaseSubmissions?.[0];

      if (!showcase) {
        throw new Error('Showcase not found');
      }

      if (existingLike) {
        // Unlike - remove like and decrement counter
        await db.transact([
          // @ts-expect-error InstantDB transaction type issue
          db.tx.showcaseLikes[existingLike.id].delete(),
          // @ts-expect-error InstantDB transaction type issue
          db.tx.showcaseSubmissions[showcaseId].update({
            likes: Math.max(0, showcase.likes - 1),
          }),
        ]);
        return { action: 'unliked', newCount: Math.max(0, showcase.likes - 1) };
      } else {
        // Like - add like and increment counter
        await db.transact([
          // @ts-expect-error InstantDB transaction type issue
          db.tx.showcaseLikes[id()].update({
            userId: user.id,
            showcaseId,
            timestamp: Date.now(),
          }),
          // @ts-expect-error InstantDB transaction type issue
          db.tx.showcaseSubmissions[showcaseId].update({
            likes: showcase.likes + 1,
          }),
        ]);
        return { action: 'liked', newCount: showcase.likes + 1 };
      }
    },
    [user]
  );

  /**
   * Increment view count for a showcase item
   */
  const incrementViews = useCallback(async (showcaseId: string) => {
    try {
      // @ts-expect-error InstantDB queryOnce type inference issue
      const { data } = await db.queryOnce({
        showcaseSubmissions: {
          $: {
            where: {
              id: showcaseId,
            },
          },
        },
      } as any);

      const showcase = (data as any)?.showcaseSubmissions?.[0];
      if (!showcase) return;

      await db.transact([
        // @ts-expect-error InstantDB transaction type issue
        db.tx.showcaseSubmissions[showcaseId].update({
          views: showcase.views + 1,
        }),
      ]);
    } catch (error) {
      logger.error('Failed to increment views:', error);
    }
  }, []);

  /**
   * Check if user has liked a showcase
   */
  const checkIfLiked = useCallback(
    async (showcaseId: string) => {
      if (!user) return false;

      // @ts-expect-error InstantDB queryOnce type inference issue
      const { data } = await db.queryOnce({
        showcaseLikes: {
          $: {
            where: {
              showcaseId,
              userId: user.id,
            },
          },
        },
      } as any);

      return (data as any)?.showcaseLikes?.length > 0;
    },
    [user]
  );

  return {
    toggleVote,
    incrementViews,
    checkIfLiked,
    user,
  };
}
