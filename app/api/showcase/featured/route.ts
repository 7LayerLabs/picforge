/**
 * @deprecated This API route needs refactoring (Issue #12)
 *
 * PROBLEM:
 * - Uses db.useQuery() which is a React hook (client-side only)
 * - Cannot be used in server-side API routes
 * - Should either:
 *   1. Move this logic to frontend (client-side useQuery)
 *   2. Use InstantDB's server SDK if available
 *   3. Keep commented out until proper solution is implemented
 *
 * TEMPORARILY DISABLED - Returns 501 Not Implemented
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/instantdb';

interface ShowcaseSubmission {
  id: string;
  featured?: boolean;
  timestamp: number;
}

interface ShowcaseLike {
  showcaseId: string;
  timestamp: number;
}

/**
 * GET /api/showcase/featured
 * Returns featured and trending showcases
 *
 * Featured: Top 3 manually featured items
 * Trending: Top 10 items by likes in last 7 days
 */
export async function GET() {
  // Temporarily disabled - needs refactoring
  return NextResponse.json({
    error: 'This endpoint needs refactoring to work with InstantDB server-side',
    suggestion: 'Move this logic to frontend using db.useQuery() hook'
  }, { status: 501 }); // 501 Not Implemented

  /* NEEDS REFACTORING - Cannot use React hooks in API routes:
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get all showcases
    const showcasesQuery = await db.useQuery({
      showcaseSubmissions: {},
    });

    const allShowcases = showcasesQuery?.showcaseSubmissions || [];

    // Featured showcases (manually flagged)
    const featured = allShowcases
      .filter((item: ShowcaseSubmission) => item.featured === true)
      .slice(0, 3);

    // Trending: Get likes from last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const likesQuery = await db.useQuery({
      showcaseLikes: {
        $: {
          where: {
            timestamp: { $gt: sevenDaysAgo }
          }
        }
      },
    });

    const recentLikes = likesQuery?.showcaseLikes || [];

    // Count likes per showcase
    const likeCounts = recentLikes.reduce((acc: Record<string, number>, like: ShowcaseLike) => {
      acc[like.showcaseId] = (acc[like.showcaseId] || 0) + 1;
      return acc;
    }, {});

    // Sort showcases by recent likes
    const trending = allShowcases
      .map((showcase: ShowcaseSubmission) => ({
        ...showcase,
        trendingScore: likeCounts[showcase.id] || 0,
      }))
      .filter((item: ShowcaseSubmission & { trendingScore: number }) => item.trendingScore > 0)
      .sort((a: ShowcaseSubmission & { trendingScore: number }, b: ShowcaseSubmission & { trendingScore: number }) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      featured,
      trending,
      stats: {
        featuredCount: featured.length,
        trendingCount: trending.length,
        totalShowcases: allShowcases.length,
      }
    });

  } catch (error) {
    console.error('Error fetching featured showcases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured showcases' },
      { status: 500 }
    );
  }
  */
}

/**
 * POST /api/showcase/featured
 * Mark a showcase as featured (admin only)
 *
 * Body: { showcaseId: string, featured: boolean }
 */
export async function POST() {
  // Temporarily disabled - needs refactoring
  return NextResponse.json({
    error: 'This endpoint needs refactoring to work with InstantDB server-side',
    suggestion: 'Move this logic to frontend using db.transact() directly'
  }, { status: 501 }); // 501 Not Implemented

  /* NEEDS REFACTORING:
  try {
    const body = await request.json();
    const { showcaseId, featured } = body;

    if (!showcaseId || typeof featured !== 'boolean') {
      return NextResponse.json(
        { error: 'showcaseId and featured boolean required' },
        { status: 400 }
      );
    }

    // TODO: Add admin authentication check
    // For now, anyone can mark as featured (change in production)

    // Update showcase featured status
    await db.transact([
      db.tx.showcaseSubmissions[showcaseId].update({
        featured,
      }),
    ]);

    return NextResponse.json({
      success: true,
      showcaseId,
      featured,
    });

  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 }
    );
  }
  */
}
