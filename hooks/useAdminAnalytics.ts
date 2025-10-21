'use client';

import { db } from '@/lib/instantdb';
import { useMemo } from 'react';
import { startOfDay, subDays, format } from 'date-fns';

/**
 * Hook to fetch and analyze admin analytics data
 * Only accessible to admin users
 */
export function useAdminAnalytics() {
  // Query all data needed for analytics
  const { data: usersData, isLoading: usersLoading } = db.useQuery({ users: {} } as any);
  const { data: imagesData, isLoading: imagesLoading } = db.useQuery({ images: {} } as any);
  const { data: usageData, isLoading: usageLoading } = db.useQuery({ usage: {} } as any);
  const { data: favoritesData, isLoading: favoritesLoading } = db.useQuery({ favorites: {} } as any);
  const { data: promoCodesData, isLoading: promoCodesLoading } = db.useQuery({ promoCodes: {} } as any);

  const users = (usersData as any)?.users || [];
  const images = (imagesData as any)?.images || [];
  const usage = (usageData as any)?.usage || [];
  const favorites = (favoritesData as any)?.favorites || [];
  const promoCodes = (promoCodesData as any)?.promoCodes || [];

  const isLoading = usersLoading || imagesLoading || usageLoading || favoritesLoading || promoCodesLoading;

  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;
    const last7Days = now - 7 * 24 * 60 * 60 * 1000;
    const last30Days = now - 30 * 24 * 60 * 60 * 1000;

    // Total users
    const totalUsers = users.length;

    // Total images generated
    const totalImages = images.length;

    // Daily active users (last 24 hours)
    const dailyActiveUsers = new Set(
      images.filter((img: any) => img.timestamp >= last24Hours).map((img: any) => img.userId)
    ).size;

    // Promo code redemptions
    const redeemedCodes = promoCodes.filter((code: any) => code.isRedeemed).length;
    const totalCodes = promoCodes.length;

    // User tier distribution
    const tierDistribution = usage.reduce((acc: any, u: any) => {
      acc[u.tier] = (acc[u.tier] || 0) + 1;
      return acc;
    }, { free: 0, pro: 0, unlimited: 0 });

    // Average images per user
    const avgImagesPerUser = totalUsers > 0 ? (totalImages / totalUsers).toFixed(1) : '0';

    // Images generated today
    const today = startOfDay(now).getTime();
    const imagesToday = images.filter((img: any) => img.timestamp >= today).length;

    // Images last 7 days
    const imagesLast7Days = images.filter((img: any) => img.timestamp >= last7Days).length;

    // New users today
    const newUsersToday = users.filter((u: any) => u.createdAt >= today).length;

    // Total favorites
    const totalFavorites = favorites.length;

    return {
      totalUsers,
      totalImages,
      dailyActiveUsers,
      redeemedCodes,
      totalCodes,
      tierDistribution,
      avgImagesPerUser,
      imagesToday,
      imagesLast7Days,
      newUsersToday,
      totalFavorites,
    };
  }, [users, images, usage, favorites, promoCodes]);

  // Calculate daily signups for chart (last 30 days)
  const dailySignups = useMemo(() => {
    const now = Date.now();
    const data: { date: string; signups: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = startOfDay(subDays(now, i)).getTime();
      const nextDate = startOfDay(subDays(now, i - 1)).getTime();

      const signupsOnDay = users.filter(
        (u: any) => u.createdAt >= date && u.createdAt < nextDate
      ).length;

      data.push({
        date: format(date, 'MM/dd'),
        signups: signupsOnDay,
      });
    }

    return data;
  }, [users]);

  // Calculate daily image generations for chart (last 30 days)
  const dailyImageGenerations = useMemo(() => {
    const now = Date.now();
    const data: { date: string; images: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = startOfDay(subDays(now, i)).getTime();
      const nextDate = startOfDay(subDays(now, i - 1)).getTime();

      const imagesOnDay = images.filter(
        (img: any) => img.timestamp >= date && img.timestamp < nextDate
      ).length;

      data.push({
        date: format(date, 'MM/dd'),
        images: imagesOnDay,
      });
    }

    return data;
  }, [images]);

  // Calculate most popular prompts
  const popularPrompts = useMemo(() => {
    const promptCounts: { [key: string]: { count: number; lastUsed: number } } = {};

    images.forEach((img: any) => {
      const prompt = img.prompt?.toLowerCase() || 'unknown';
      if (!promptCounts[prompt]) {
        promptCounts[prompt] = { count: 0, lastUsed: 0 };
      }
      promptCounts[prompt].count += 1;
      promptCounts[prompt].lastUsed = Math.max(promptCounts[prompt].lastUsed, img.timestamp);
    });

    return Object.entries(promptCounts)
      .map(([prompt, data]) => ({
        prompt,
        uses: data.count,
        lastUsed: data.lastUsed,
      }))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 20);
  }, [images]);

  // Calculate favorite counts by prompt
  const favoriteCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};

    favorites.forEach((fav: any) => {
      const prompt = fav.prompt?.toLowerCase() || 'unknown';
      counts[prompt] = (counts[prompt] || 0) + 1;
    });

    return counts;
  }, [favorites]);

  // Merge prompts with favorites
  const promptsWithFavorites = useMemo(() => {
    return popularPrompts.map(p => ({
      ...p,
      favorites: favoriteCounts[p.prompt] || 0,
    }));
  }, [popularPrompts, favoriteCounts]);

  // Calculate user analytics
  const userAnalytics = useMemo(() => {
    return users.map((user: any) => {
      const userImages = images.filter((img: any) => img.userId === user.id);
      const userUsage = usage.find((u: any) => u.userId === user.id);
      const lastImage = userImages.sort((a: any, b: any) => b.timestamp - a.timestamp)[0];

      return {
        id: user.id,
        email: user.email,
        tier: userUsage?.tier || 'free',
        imagesGenerated: userImages.length,
        joinDate: user.createdAt,
        lastActive: lastImage?.timestamp || user.createdAt,
      };
    }).sort((a: any, b: any) => b.imagesGenerated - a.imagesGenerated);
  }, [users, images, usage]);

  // Calculate retention metrics
  const retentionMetrics = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Users who joined yesterday
    const joinedYesterday = users.filter(
      (u: any) => u.createdAt >= oneDayAgo - 24 * 60 * 60 * 1000 && u.createdAt < oneDayAgo
    );

    // Of those, how many generated an image in the last 24 hours
    const day1Retained = joinedYesterday.filter((u: any) =>
      images.some((img: any) => img.userId === u.id && img.timestamp >= oneDayAgo)
    );

    // Users who joined 7 days ago
    const joined7DaysAgo = users.filter(
      (u: any) => u.createdAt >= sevenDaysAgo - 24 * 60 * 60 * 1000 && u.createdAt < sevenDaysAgo
    );

    // Of those, how many generated an image in the last 24 hours
    const day7Retained = joined7DaysAgo.filter((u: any) =>
      images.some((img: any) => img.userId === u.id && img.timestamp >= oneDayAgo)
    );

    // Users who joined 30 days ago
    const joined30DaysAgo = users.filter(
      (u: any) => u.createdAt >= thirtyDaysAgo - 24 * 60 * 60 * 1000 && u.createdAt < thirtyDaysAgo
    );

    // Of those, how many generated an image in the last 24 hours
    const day30Retained = joined30DaysAgo.filter((u: any) =>
      images.some((img: any) => img.userId === u.id && img.timestamp >= oneDayAgo)
    );

    return {
      day1: joinedYesterday.length > 0 ? ((day1Retained.length / joinedYesterday.length) * 100).toFixed(1) : 'N/A',
      day7: joined7DaysAgo.length > 0 ? ((day7Retained.length / joined7DaysAgo.length) * 100).toFixed(1) : 'N/A',
      day30: joined30DaysAgo.length > 0 ? ((day30Retained.length / joined30DaysAgo.length) * 100).toFixed(1) : 'N/A',
    };
  }, [users, images]);

  return {
    isLoading,
    overviewMetrics,
    dailySignups,
    dailyImageGenerations,
    promptsWithFavorites,
    userAnalytics,
    retentionMetrics,
    promoCodes,
  };
}
