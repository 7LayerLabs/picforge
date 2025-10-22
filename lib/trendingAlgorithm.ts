/**
 * Trending Algorithm for PicForge Showcase
 *
 * Calculates trending scores for showcase items based on:
 * - Recent likes (last 7 days) - weighted more heavily
 * - Total likes - weighted less
 * - Recency - newer items get a boost
 * - Views - engagement indicator
 *
 * Formula: score = (recentLikes * 3) + (totalLikes * 1) + (recencyBoost * 2) + (viewBoost * 0.5)
 */

export interface ShowcaseItem {
  id: string;
  likes: number;
  views: number;
  timestamp: number;
  featured: boolean;
}

export interface TrendingScore {
  score: number;
  recentLikes: number;
  recencyBoost: number;
  viewBoost: number;
  isTrending: boolean; // Score > threshold
}

/**
 * Calculate trending score for a single showcase item
 */
export function calculateTrendingScore(
  showcase: ShowcaseItem,
  recentLikeCount: number
): TrendingScore {
  const now = Date.now();
  const ageInDays = (now - showcase.timestamp) / (24 * 60 * 60 * 1000);

  // Recency boost: exponential decay over 30 days
  // New items (0-7 days): 100-70% boost
  // Recent items (7-14 days): 70-40% boost
  // Older items (14-30 days): 40-10% boost
  // Very old items (30+ days): minimal boost
  const recencyBoost = Math.max(0, Math.exp(-ageInDays / 10) * 100);

  // View boost: normalized view count (capped at 1000 views = max boost)
  const viewBoost = Math.min(100, (showcase.views / 1000) * 100);

  // Trending score calculation
  const score =
    recentLikeCount * 3 + // Recent engagement (most important)
    showcase.likes * 1 + // Total engagement
    recencyBoost * 2 + // Freshness factor
    viewBoost * 0.5; // View count factor

  // Trending threshold: score > 10 (adjustable)
  const isTrending = score > 10;

  return {
    score,
    recentLikes: recentLikeCount,
    recencyBoost,
    viewBoost,
    isTrending,
  };
}

/**
 * Get trending showcases from a list
 */
export function getTrendingShowcases<T extends ShowcaseItem>(
  showcases: T[],
  likes: Array<{ showcaseId: string; timestamp: number }>,
  limit = 8
): Array<T & { trendingScore: TrendingScore }> {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Count recent likes per showcase
  const recentLikeCounts = likes
    .filter((like) => like.timestamp > sevenDaysAgo)
    .reduce((acc, like) => {
      acc[like.showcaseId] = (acc[like.showcaseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Calculate scores and sort
  return showcases
    .map((showcase) => {
      const recentLikes = recentLikeCounts[showcase.id] || 0;
      const trendingScore = calculateTrendingScore(showcase, recentLikes);

      return {
        ...showcase,
        trendingScore,
      };
    })
    .sort((a, b) => b.trendingScore.score - a.trendingScore.score)
    .slice(0, limit);
}

/**
 * Get most liked showcases (all-time)
 */
export function getMostLikedShowcases<T extends ShowcaseItem>(
  showcases: T[],
  limit = 8
): T[] {
  return [...showcases]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

/**
 * Get recent showcases (last 7 days)
 */
export function getRecentShowcases<T extends ShowcaseItem>(
  showcases: T[],
  limit = 8
): T[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return [...showcases]
    .filter((item) => item.timestamp > sevenDaysAgo)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Get featured showcases (manually flagged by admin)
 */
export function getFeaturedShowcases<T extends ShowcaseItem>(
  showcases: T[],
  limit = 8
): T[] {
  return [...showcases]
    .filter((item) => item.featured)
    .sort((a, b) => b.likes - a.likes) // Sort featured by popularity
    .slice(0, limit);
}
