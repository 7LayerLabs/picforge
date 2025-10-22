'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Sparkles, Award, Eye } from 'lucide-react';
import { db } from '@/lib/instantdb';
import { getTrendingShowcases } from '@/lib/trendingAlgorithm';
import FeaturedCard from './FeaturedCard';

interface ShowcaseItem {
  id: string;
  title: string;
  description?: string | null;
  prompt: string;
  originalImageUrl: string;
  transformedImageUrl: string;
  style?: string;
  likes: number;
  views: number;
  featured: boolean;
  approved: boolean;
  timestamp: number;
  userId: string;
  user?: {
    id?: string;
    name?: string | null;
    image?: string | null;
  };
}

interface FeaturedTransformationsProps {
  limit?: number;
  variant?: 'grid' | 'masonry' | 'carousel';
  showHeader?: boolean;
  className?: string;
}

export default function FeaturedTransformations({
  limit = 6,
  variant = 'grid',
  showHeader = true,
  className = '',
}: FeaturedTransformationsProps) {
  const { user } = db.useAuth();
  const [activeFilter, setActiveFilter] = useState<'trending' | 'featured' | 'recent'>('trending');

  // Query showcases from InstantDB
  const { data, isLoading } = db.useQuery({
    showcaseSubmissions: {
      $: {
        where: {
          approved: true,
        },
      },
    },
    showcaseLikes: {},
    users: {},
  } as any);

  const typedData = data as any;

  // Process and filter showcases
  const { displayItems, userLikes, totalViews } = useMemo(() => {
    if (!typedData?.showcaseSubmissions) {
      return { displayItems: [], userLikes: new Set(), totalViews: 0 };
    }

    const allShowcases = typedData.showcaseSubmissions as ShowcaseItem[];
    const allLikes = (typedData.showcaseLikes || []) as any[];
    const allUsers = (typedData.users || []) as any[];

    // Calculate total views
    const views = allShowcases.reduce((sum, item) => sum + item.views, 0);

    // Get user's likes
    const userLikesSet = new Set(
      allLikes.filter((like: any) => like.userId === user?.id).map((like: any) => like.showcaseId)
    );

    // Add user data to showcases
    const showcasesWithUsers = allShowcases.map((showcase) => {
      const showcaseUser = allUsers.find((u: any) => u.id === showcase.userId);
      return {
        ...showcase,
        user: showcaseUser
          ? {
              id: showcaseUser.id,
              name: showcaseUser.name || null,
              image: null,
            }
          : {
              id: showcase.userId,
              name: null,
              image: null,
            },
      };
    });

    // Filter based on active filter
    let items: ShowcaseItem[] = [];

    if (activeFilter === 'trending') {
      // Use trending algorithm
      const trendingItems = getTrendingShowcases(showcasesWithUsers, allLikes, limit);
      items = trendingItems.map((item) => ({
        ...item,
        trendingScore: item.trendingScore.score,
      })) as any;
    } else if (activeFilter === 'featured') {
      // Featured items (manually flagged)
      items = showcasesWithUsers.filter((item) => item.featured).slice(0, limit);
    } else {
      // Recent items (last 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      items = showcasesWithUsers
        .filter((item) => item.timestamp > sevenDaysAgo)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    }

    return {
      displayItems: items,
      userLikes: userLikesSet,
      totalViews: views,
    };
  }, [typedData, activeFilter, limit, user]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {showHeader && (
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Show example transformations if database is empty
  const exampleTransformations = [
    {
      id: 'example-1',
      title: 'Van Gogh Style',
      prompt: 'Transform into Van Gogh painting',
      originalImageUrl: '/examples/before-1.jpg',
      transformedImageUrl: '/examples/after-1.jpg',
      likes: 42,
      views: 128,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    },
    {
      id: 'example-2',
      title: 'Cyberpunk',
      prompt: 'Turn into cyberpunk character',
      originalImageUrl: '/examples/before-2.jpg',
      transformedImageUrl: '/examples/after-2.jpg',
      likes: 38,
      views: 94,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    },
    {
      id: 'example-3',
      title: 'Watercolor',
      prompt: 'Transform into watercolor painting',
      originalImageUrl: '/examples/before-3.jpg',
      transformedImageUrl: '/examples/after-3.jpg',
      likes: 35,
      views: 87,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    },
    {
      id: 'example-4',
      title: 'Zombie',
      prompt: 'Turn into zombie',
      originalImageUrl: '/examples/before-4.jpg',
      transformedImageUrl: '/examples/after-4.jpg',
      likes: 52,
      views: 156,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    },
    {
      id: 'example-5',
      title: 'Oil Painting',
      prompt: 'Transform into classical oil painting',
      originalImageUrl: '/examples/before-5.jpg',
      transformedImageUrl: '/examples/after-5.jpg',
      likes: 29,
      views: 73,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    },
    {
      id: 'example-6',
      title: 'Anime Style',
      prompt: 'Turn into anime character',
      originalImageUrl: '/examples/before-6.jpg',
      transformedImageUrl: '/examples/after-6.jpg',
      likes: 64,
      views: 201,
      featured: true,
      approved: true,
      timestamp: Date.now(),
      userId: 'system',
      user: { name: 'PicForge Examples' }
    }
  ];

  // Use examples if no real submissions
  const itemsToShow = displayItems.length > 0 ? displayItems : exampleTransformations.slice(0, limit);

  return (
    <div className={`${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Featured Transformations</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            See What&apos;s Possible
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Get inspired by amazing transformations from our creative community
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveFilter('trending')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'trending'
                  ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending This Week
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'featured'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Award className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => setActiveFilter('recent')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'recent'
                  ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Recent
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span>
                <span className="font-bold text-gray-900">{totalViews.toLocaleString()}</span> total
                views
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>
                <span className="font-bold text-gray-900">{itemsToShow.length}</span> amazing
                transformations
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div
        className={`grid gap-6 ${
          variant === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : variant === 'masonry'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {itemsToShow.map((item, index) => (
          <FeaturedCard
            key={item.id}
            showcase={item}
            isLiked={userLikes.has(item.id)}
            rank={activeFilter === 'trending' && index < 3 ? index + 1 : undefined}
            showTrendingBadge={activeFilter === 'trending'}
            showFeaturedBadge={activeFilter === 'featured' || item.featured}
          />
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-teal-600 hover:to-purple-700 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          View Full Showcase
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-500 mt-3">
          Explore hundreds of amazing transformations from our community
        </p>
      </div>
    </div>
  );
}
