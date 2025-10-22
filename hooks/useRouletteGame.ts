'use client';

import { db } from '@/lib/instantdb';
import { useCallback, useMemo } from 'react';
import { id } from '@instantdb/react';

// Achievement definitions with requirements and rewards
export const ACHIEVEMENTS = [
  // Spin-based achievements
  {
    id: 'first_spin',
    name: 'First Spin',
    description: 'Spin the wheel for the first time',
    icon: '🎲',
    requirement: 1,
    type: 'spins',
    reward: { bonusImages: 2, message: 'Earned 2 bonus images!' }
  },
  {
    id: 'spin_5',
    name: 'Getting Started',
    description: 'Spin 5 times',
    icon: '🌟',
    requirement: 5,
    type: 'spins',
    reward: { bonusImages: 3, message: 'Earned 3 bonus images!' }
  },
  {
    id: 'spin_10',
    name: 'Addicted',
    description: 'Spin 10 times',
    icon: '🔥',
    requirement: 10,
    type: 'spins',
    reward: { bonusImages: 5, message: 'Earned 5 bonus images!' }
  },
  {
    id: 'spin_25',
    name: 'Roulette Master',
    description: 'Spin 25 times',
    icon: '🏆',
    requirement: 25,
    type: 'spins',
    reward: { bonusImages: 10, message: 'Earned 10 bonus images!' }
  },
  {
    id: 'spin_50',
    name: 'Chaos Legend',
    description: 'Spin 50 times',
    icon: '👑',
    requirement: 50,
    type: 'spins',
    reward: { bonusImages: 20, message: 'Earned 20 bonus images!' }
  },
  {
    id: 'spin_100',
    name: 'Transformation God',
    description: 'Spin 100 times',
    icon: '⚡',
    requirement: 100,
    type: 'spins',
    reward: { bonusImages: 50, message: 'Earned 50 bonus images!' }
  },

  // Streak achievements
  {
    id: 'streak_3',
    name: 'Hot Streak',
    description: '3 consecutive daily spins',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    reward: { bonusImages: 5, message: 'Keep the streak alive!' }
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: '5 consecutive daily spins',
    icon: '🔥🔥',
    requirement: 5,
    type: 'streak',
    reward: { bonusImages: 10, message: 'You\'re unstoppable!' }
  },
  {
    id: 'streak_7',
    name: 'Lucky 7',
    description: '7 day spin streak',
    icon: '🍀',
    requirement: 7,
    type: 'streak',
    reward: { bonusImages: 15, message: 'Lucky you! Earned 15 bonus images!' }
  },
  {
    id: 'streak_14',
    name: 'Two Weeks Strong',
    description: '14 day spin streak',
    icon: '💪',
    requirement: 14,
    type: 'streak',
    reward: { bonusImages: 30, message: 'Dedication pays off!' }
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: '30 day spin streak',
    icon: '🎯',
    requirement: 30,
    type: 'streak',
    reward: { bonusImages: 100, message: 'Legendary dedication! 100 bonus images!' }
  },

  // Category exploration
  {
    id: 'all_categories',
    name: 'Category Explorer',
    description: 'Try all 8 categories',
    icon: '🌍',
    requirement: 8,
    type: 'categories',
    reward: { bonusImages: 10, message: 'Exploration bonus unlocked!' }
  },

  // Rare/jackpot achievements
  {
    id: 'first_rare',
    name: 'First Jackpot',
    description: 'Land your first rare transformation',
    icon: '💎',
    requirement: 1,
    type: 'rares',
    reward: { bonusImages: 5, message: 'Rare find!' }
  },
  {
    id: 'rare_5',
    name: 'Lucky Spinner',
    description: 'Land 5 rare transformations',
    icon: '🎰',
    requirement: 5,
    type: 'rares',
    reward: { bonusImages: 15, message: 'Fortune favors you!' }
  },

  // Social achievements
  {
    id: 'first_share',
    name: 'First Share',
    description: 'Share your first transformation',
    icon: '📢',
    requirement: 1,
    type: 'shares',
    reward: { bonusImages: 3, message: 'Spread the chaos!' }
  },
  {
    id: 'share_10',
    name: 'Social Butterfly',
    description: 'Share 10 transformations',
    icon: '🦋',
    requirement: 10,
    type: 'shares',
    reward: { bonusImages: 10, message: 'Your friends love the chaos!' }
  },
  {
    id: 'top_voter',
    name: 'Community Champion',
    description: 'Vote on 25 transformations',
    icon: '🏅',
    requirement: 25,
    type: 'votes',
    reward: { bonusImages: 8, message: 'Community engagement bonus!' }
  },
] as const;

// Rare prompts (5% chance) - 15-20 prompts marked as rare
export const RARE_PROMPTS = [
  "Transform into Banksy street art",
  "Make it look like Salvador Dali painting",
  "Turn into a Marvel superhero poster",
  "Transform into Wes Anderson symmetrical style",
  "Make it look like The Matrix green tint",
  "Transform into Studio Ghibli animation",
  "Turn into Christopher Nolan epic scene",
  "Make it look like ancient Egypt",
  "Transform to the year 3000",
  "Add dragons flying overhead",
  "Turn this into a zombie apocalypse",
  "Make it look like it's melting",
  "Replace everyone with rubber ducks",
  "Make it rain tacos",
  "Transform into Matrix digital rain",
  "Add alien invasion chaos",
  "Turn everything into candy",
  "Make it look like Tron grid world",
  "Add northern lights aurora",
  "Transform into hologram projection effect"
];

interface RouletteStats {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastSpinDate: string;
  totalSpins: number;
  categoriesUnlocked: string[];
  achievements: string[];
  rareSpinsCount: number;
  shareCount: number;
  voteCount: number;
}

/**
 * Hook for Transform Roulette gamification
 * Handles streaks, achievements, leaderboards, and rewards
 */
export function useRouletteGame() {
  const { user } = db.useAuth();

  // Query user's roulette streak data
  const { data: streakData } = db.useQuery(
    user ? { rouletteStreaks: { $: { where: { userId: user.id } } } } : null
  );

  // Query user's achievements
  const { data: achievementData } = db.useQuery(
    user ? { rouletteAchievements: { $: { where: { userId: user.id } } } } : null
  );

  // Query user's spins for history
  const { data: spinsData } = db.useQuery(
    user ? {
      rouletteSpins: {
        $: {
          where: { userId: user.id },
          order: { serverCreatedAt: 'desc' as const },
          limit: 50
        }
      }
    } : null
  );

  // Query all spins for leaderboard (top 100 by votes)
  const { data: leaderboardData } = db.useQuery({
    rouletteSpins: {
      $: {
        order: { voteCount: 'desc' as const },
        limit: 100
      }
    }
  });

  // Extract current streak record
  const currentStreak = useMemo(() => {
    return (streakData as any)?.rouletteStreaks?.[0] || null;
  }, [streakData]);

  // Extract unlocked achievement IDs
  const unlockedAchievements = useMemo(() => {
    return ((achievementData as any)?.rouletteAchievements || []).map((a: any) => a.achievementId);
  }, [achievementData]);

  // Get user's spin history
  const userSpins = useMemo(() => {
    return (spinsData as any)?.rouletteSpins || [];
  }, [spinsData]);

  // Calculate stats
  const stats: RouletteStats = useMemo(() => {
    const rareCount = userSpins.filter((s: any) => s.isRare).length;
    const shareCount = userSpins.reduce((sum: number, s: any) => sum + (s.shareCount || 0), 0);

    return {
      userId: user?.id || '',
      currentStreak: currentStreak?.currentStreak || 0,
      longestStreak: currentStreak?.longestStreak || 0,
      lastSpinDate: currentStreak?.lastSpinDate || '',
      totalSpins: currentStreak?.totalSpins || 0,
      categoriesUnlocked: currentStreak?.categoriesUnlocked || [],
      achievements: unlockedAchievements,
      rareSpinsCount: rareCount,
      shareCount: shareCount,
      voteCount: 0,
    };
  }, [currentStreak, unlockedAchievements, userSpins, user]);

  /**
   * Check if a prompt is rare (5% chance)
   */
  const isRarePrompt = useCallback((prompt: string) => {
    return RARE_PROMPTS.includes(prompt);
  }, []);

  /**
   * Check for new achievements and grant rewards
   */
  const checkAchievements = useCallback(async (updatedStats: RouletteStats) => {
    if (!user) return [];

    const newAchievements: typeof ACHIEVEMENTS[number][] = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (updatedStats.achievements.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.type) {
        case 'spins':
          shouldUnlock = updatedStats.totalSpins >= achievement.requirement;
          break;
        case 'streak':
          shouldUnlock = updatedStats.currentStreak >= achievement.requirement;
          break;
        case 'categories':
          shouldUnlock = updatedStats.categoriesUnlocked.length >= achievement.requirement;
          break;
        case 'rares':
          shouldUnlock = updatedStats.rareSpinsCount >= achievement.requirement;
          break;
        case 'shares':
          shouldUnlock = updatedStats.shareCount >= achievement.requirement;
          break;
        case 'votes':
          shouldUnlock = updatedStats.voteCount >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        // Unlock achievement in database
        const achievementId = id();
        await db.transact([
          db.tx.rouletteAchievements[achievementId].update({
            userId: user.id,
            achievementId: achievement.id,
            unlockedAt: Date.now(),
          })
        ]);

        // Grant bonus images to user's usage quota
        if (achievement.reward.bonusImages > 0) {
          await grantBonusImages(achievement.reward.bonusImages);
        }

        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }, [user]);

  /**
   * Grant bonus images to user
   */
  const grantBonusImages = async (amount: number) => {
    if (!user) return;

    // Query user's current usage
    const { data: usageData } = await db.queryOnce({
      usage: { $: { where: { userId: user.id } } }
    });

    const usage = (usageData as any)?.usage?.[0];

    if (usage) {
      const usageId = usage.id;
      const currentCount = usage.count || 0;

      // Reduce usage count (gives more images)
      const newCount = Math.max(0, currentCount - amount);

      await db.transact([
        db.tx.usage[usageId].update({
          count: newCount
        })
      ]);
    }
  };

  /**
   * Record a spin and update streaks
   */
  const recordSpin = useCallback(async (
    category: string,
    prompt: string,
    originalImageUrl?: string,
    transformedImageUrl?: string
  ) => {
    if (!user) {
      console.log('User not logged in - skipping roulette tracking');
      return { newAchievements: [], isRare: false, stats: null };
    }

    const now = Date.now();
    const today = new Date().toDateString();

    // Check if prompt is rare
    const isRare = isRarePrompt(prompt);

    // Record the spin
    const spinId = id();
    await db.transact([
      db.tx.rouletteSpins[spinId].update({
        userId: user.id,
        category,
        prompt,
        originalImageUrl,
        transformedImageUrl,
        isRare,
        timestamp: now,
        shareCount: 0,
        voteCount: 0,
      })
    ]);

    // Calculate streak
    const isConsecutiveDay = currentStreak?.lastSpinDate === today ||
      (currentStreak?.lastSpinDate &&
       new Date(currentStreak.lastSpinDate).getTime() === new Date(today).getTime() - 86400000);

    const newStreakCount = isConsecutiveDay
      ? (currentStreak?.currentStreak || 0) + 1
      : 1;

    // Update or create streak record
    const streakId = currentStreak?.id || id();
    const categoriesSet = new Set([...(currentStreak?.categoriesUnlocked || []), category]);

    await db.transact([
      db.tx.rouletteStreaks[streakId].update({
        userId: user.id,
        currentStreak: newStreakCount,
        longestStreak: Math.max(newStreakCount, currentStreak?.longestStreak || 0),
        lastSpinDate: today,
        totalSpins: (currentStreak?.totalSpins || 0) + 1,
        categoriesUnlocked: Array.from(categoriesSet),
        updatedAt: now,
        ...(currentStreak ? {} : { createdAt: now })
      })
    ]);

    // Calculate updated stats for achievement checking
    const updatedStats: RouletteStats = {
      userId: user.id,
      currentStreak: newStreakCount,
      longestStreak: Math.max(newStreakCount, currentStreak?.longestStreak || 0),
      lastSpinDate: today,
      totalSpins: (currentStreak?.totalSpins || 0) + 1,
      categoriesUnlocked: Array.from(categoriesSet),
      achievements: unlockedAchievements,
      rareSpinsCount: stats.rareSpinsCount + (isRare ? 1 : 0),
      shareCount: stats.shareCount,
      voteCount: stats.voteCount,
    };

    // Check for new achievements
    const newAchievements = await checkAchievements(updatedStats);

    return {
      newAchievements,
      isRare,
      spinId,
      stats: updatedStats
    };
  }, [user, currentStreak, unlockedAchievements, stats, isRarePrompt, checkAchievements]);

  /**
   * Increment share count for a spin
   */
  const recordShare = useCallback(async (spinId: string) => {
    if (!user) return;

    // Find the spin
    const spin = userSpins.find((s: any) => s.id === spinId);
    if (!spin) return;

    // Increment share count
    await db.transact([
      db.tx.rouletteSpins[spinId].update({
        shareCount: (spin.shareCount || 0) + 1
      })
    ]);

    // Check for share achievements
    const updatedStats = {
      ...stats,
      shareCount: stats.shareCount + 1
    };
    await checkAchievements(updatedStats);
  }, [user, userSpins, stats, checkAchievements]);

  /**
   * Vote on a transformation
   */
  const voteOnSpin = useCallback(async (
    spinId: string,
    voteType: 'creative' | 'funny' | 'chaotic'
  ) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }

    // Check if user already voted on this spin
    const { data: existingVoteData } = await db.queryOnce({
      rouletteVotes: {
        $: {
          where: {
            and: [
              { spinId: spinId },
              { userId: user.id }
            ]
          }
        }
      }
    });

    const existingVote = (existingVoteData as any)?.rouletteVotes?.[0];

    if (existingVote) {
      // Update existing vote
      await db.transact([
        db.tx.rouletteVotes[existingVote.id].update({
          voteType
        })
      ]);
    } else {
      // Create new vote
      const voteId = id();
      await db.transact([
        db.tx.rouletteVotes[voteId].update({
          spinId,
          userId: user.id,
          voteType,
          timestamp: Date.now()
        })
      ]);

      // Increment vote count on spin
      const { data: spinData } = await db.queryOnce({
        rouletteSpins: { $: { where: { id: spinId } } }
      });

      const spin = (spinData as any)?.rouletteSpins?.[0];
      if (spin) {
        await db.transact([
          db.tx.rouletteSpins[spinId].update({
            voteCount: (spin.voteCount || 0) + 1
          })
        ]);
      }
    }

    // Check for voting achievements
    const updatedStats = {
      ...stats,
      voteCount: stats.voteCount + 1
    };
    await checkAchievements(updatedStats);
  }, [user, stats, checkAchievements]);

  /**
   * Get top spins for leaderboard
   */
  const getLeaderboard = useCallback(() => {
    const allSpins = (leaderboardData as any)?.rouletteSpins || [];

    // Group by vote type
    const creative = [...allSpins].sort((a: any, b: any) => b.voteCount - a.voteCount).slice(0, 10);
    const funny = [...allSpins].slice(0, 10); // In production, filter by vote type
    const chaotic = [...allSpins].slice(0, 10);

    return { creative, funny, chaotic, all: allSpins.slice(0, 100) };
  }, [leaderboardData]);

  /**
   * Get progress to next achievement
   */
  const getProgress = useCallback(() => {
    // Find next spin milestone
    const nextSpinAchievement = ACHIEVEMENTS.find(
      a => a.type === 'spins' && !stats.achievements.includes(a.id)
    );

    // Find next streak milestone
    const nextStreakAchievement = ACHIEVEMENTS.find(
      a => a.type === 'streak' && !stats.achievements.includes(a.id)
    );

    return {
      nextSpin: nextSpinAchievement ? {
        achievement: nextSpinAchievement,
        current: stats.totalSpins,
        target: nextSpinAchievement.requirement,
        percentage: (stats.totalSpins / nextSpinAchievement.requirement) * 100
      } : null,
      nextStreak: nextStreakAchievement ? {
        achievement: nextStreakAchievement,
        current: stats.currentStreak,
        target: nextStreakAchievement.requirement,
        percentage: (stats.currentStreak / nextStreakAchievement.requirement) * 100
      } : null
    };
  }, [stats]);

  /**
   * Get achievement details by ID
   */
  const getAchievementDetails = useCallback((achievementId: string) => {
    return ACHIEVEMENTS.find(a => a.id === achievementId);
  }, []);

  return {
    // State
    user,
    stats,
    userSpins,

    // Actions
    recordSpin,
    recordShare,
    voteOnSpin,

    // Utilities
    isRarePrompt,
    getLeaderboard,
    getProgress,
    getAchievementDetails,

    // Constants
    allAchievements: ACHIEVEMENTS,
    rarePrompts: RARE_PROMPTS,
  };
}
