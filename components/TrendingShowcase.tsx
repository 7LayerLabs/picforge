'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Award, Clock, Sparkles } from 'lucide-react';
import { db } from '@/lib/instantdb';
import ShowcaseCard from './ShowcaseCard';
import { getTrendingShowcases, getRecentShowcases, getFeaturedShowcases } from '@/lib/trendingAlgorithm';

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
  trendingScore?: number;
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

export default function TrendingShowcase() {
  const { user } = db.useAuth();
  const [activeTab, setActiveTab] = useState<'trending' | 'featured' | 'recent'>('trending');
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseItem | null>(null);

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

  // Calculate trending scores and process data using the new algorithm
  const { trendingItems, featuredItems, recentItems, userLikes } = useMemo(() => {
    if (!typedData?.showcaseSubmissions) {
      return { trendingItems: [], featuredItems: [], recentItems: [], userLikes: new Set() };
    }

    const allShowcases = typedData.showcaseSubmissions as ShowcaseItem[];
    const allLikes = (typedData.showcaseLikes || []) as any[];
    const allUsers = (typedData.users || []) as any[];

    // Get user's likes
    const userLikesSet = new Set(
      allLikes.filter((like: any) => like.userId === user?.id).map((like: any) => like.showcaseId)
    );

    // Helper function to add user data
    const addUserData = (showcase: ShowcaseItem) => {
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
    };

    // Use centralized trending algorithm
    const trending = getTrendingShowcases(allShowcases, allLikes, 6).map(addUserData);
    const featured = getFeaturedShowcases(allShowcases, 6).map(addUserData);
    const recent = getRecentShowcases(allShowcases, 6).map(addUserData);

    return {
      trendingItems: trending,
      featuredItems: featured,
      recentItems: recent,
      userLikes: userLikesSet,
    };
  }, [typedData, user]);

  // Get display items based on active tab
  const displayItems = useMemo(() => {
    switch (activeTab) {
      case 'featured':
        return featuredItems;
      case 'recent':
        return recentItems;
      default:
        return trendingItems;
    }
  }, [activeTab, trendingItems, featuredItems, recentItems]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't show if no data
  if (trendingItems.length === 0 && featuredItems.length === 0 && recentItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl shadow-2xl overflow-hidden border border-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 animate-pulse" />
              Community Spotlight
            </h2>
            <p className="text-white/90 text-sm md:text-base">
              Amazing transformations from our creative community
            </p>
          </div>
          <Link
            href="/showcase"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending This Week
            {trendingItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-teal-500 text-white rounded-full text-xs font-bold">
                {trendingItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'featured'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Award className="w-4 h-4" />
            Featured
            {featuredItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-yellow-500 text-white rounded-full text-xs font-bold">
                {featuredItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'recent'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            Recent
            {recentItems.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs font-bold">
                {recentItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="p-6">
        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'featured' ? '⭐' : activeTab === 'recent' ? '🕐' : '📈'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'featured'
                ? 'No featured showcases yet'
                : activeTab === 'recent'
                ? 'No recent submissions'
                : 'No trending items this week'}
            </h3>
            <p className="text-gray-600 mb-6">Be the first to share your amazing creation!</p>
            {user && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all hover:scale-105 shadow-lg"
              >
                Submit Your Work
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item, index) => (
                <ShowcaseCard
                  key={item.id}
                  showcase={item}
                  isLiked={userLikes.has(item.id)}
                  rank={activeTab === 'trending' ? index + 1 : undefined}
                  onClick={() => setSelectedShowcase(item)}
                  compact={false}
                />
              ))}
            </div>

            {/* View All CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-teal-700 transition-all hover:scale-105 shadow-lg"
              >
                Explore All Showcases
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedShowcase && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShowcase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-heading text-2xl font-bold">{selectedShowcase.title}</h2>
                <button
                  onClick={() => setSelectedShowcase(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Images comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Original</p>
                  <img
                    src={selectedShowcase.originalImageUrl}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Transformed</p>
                  <img
                    src={selectedShowcase.transformedImageUrl}
                    alt="Result"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2">Prompt Used:</p>
                <p className="text-gray-900 mb-3">{selectedShowcase.prompt}</p>
                <Link
                  href="/"
                  onClick={() => {
                    sessionStorage.setItem('tryPrompt', selectedShowcase.prompt);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                >
                  Try This Prompt
                </Link>
              </div>

              {/* Description */}
              {selectedShowcase.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-900">{selectedShowcase.description}</p>
                </div>
              )}

              {/* User info */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {selectedShowcase.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedShowcase.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedShowcase.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
