'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, TrendingUp, Heart, Eye, ArrowRight } from 'lucide-react';
import { db } from '@/lib/instantdb';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string | null;
  prompt: string;
  originalImage: string;
  resultImage: string;
  style: string | null;
  featured: boolean;
  timestamp: number;
  trendingScore?: number;
  user?: {
    name: string | null;
  };
}

interface FeaturedShowcaseProps {
  variant?: 'compact' | 'full';
}

export default function FeaturedShowcase({ variant = 'full' }: FeaturedShowcaseProps) {
  const [featured, setFeatured] = useState<ShowcaseItem[]>([]);
  const [trending, setTrending] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'trending'>('featured');

  // Use InstantDB client-side queries instead of API route
  const showcasesQuery = db.useQuery({
    showcaseSubmissions: {},
    showcaseLikes: {},
  });

  useEffect(() => {
    if (!showcasesQuery.isLoading && showcasesQuery.data) {
      const allShowcases = (showcasesQuery.data as { showcaseSubmissions?: unknown[] }).showcaseSubmissions || [];
      const allLikes = (showcasesQuery.data as { showcaseLikes?: unknown[] }).showcaseLikes || [];

      // Featured showcases (manually flagged)
      const featuredItems = allShowcases
        .filter((item: unknown) => (item as { featured?: boolean }).featured === true)
        .slice(0, 3);

      // Trending: Get likes from last 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const recentLikes = allLikes.filter((like: unknown) => (like as { timestamp: number }).timestamp > sevenDaysAgo);

      // Count likes per showcase
      const likeCounts = recentLikes.reduce((acc: Record<string, number>, like: unknown) => {
        const showcaseId = (like as { showcaseId: string }).showcaseId;
        acc[showcaseId] = (acc[showcaseId] || 0) + 1;
        return acc;
      }, {});

      // Sort showcases by recent likes
      const trendingItems = allShowcases
        .map((showcase: unknown) => ({
          ...showcase as object,
          trendingScore: likeCounts[(showcase as { id: string }).id] || 0,
        }))
        .filter((item: unknown) => (item as { trendingScore: number }).trendingScore > 0)
        .sort((a: unknown, b: unknown) => (b as { trendingScore: number }).trendingScore - (a as { trendingScore: number }).trendingScore)
        .slice(0, 10);

      setFeatured(featuredItems);
      setTrending(trendingItems);
      setLoading(false);
    }
  }, [showcasesQuery.isLoading, showcasesQuery.data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't show if no data
  if (featured.length === 0 && trending.length === 0) {
    return null;
  }

  const displayItems = activeTab === 'featured' ? featured : trending.slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-teal-500 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">
              Community Spotlight
            </h2>
            <p className="text-purple-100">
              Amazing transformations from our creative community
            </p>
          </div>
          <Link
            href="/showcase"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all hover:scale-105"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'featured'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Award className="w-4 h-4" />
            Featured
            {featured.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white rounded-full text-xs">
                {featured.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'trending'
                ? 'bg-white text-teal-600 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending This Week
            {trending.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-teal-500 text-white rounded-full text-xs">
                {trending.length}
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
              {activeTab === 'featured' ? '⭐' : '📈'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'featured'
                ? 'No featured showcases yet'
                : 'No trending items this week'}
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your amazing creation!
            </p>
            <Link
              href="/showcase/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all hover:scale-105 shadow-lg"
            >
              Submit Your Work
            </Link>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              variant === 'compact'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200"
                >
                  {/* Featured/Trending Badge */}
                  {activeTab === 'featured' && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Award className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  {activeTab === 'trending' && index < 3 && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <TrendingUp className="w-3 h-3" />
                      #{index + 1} Trending
                    </div>
                  )}

                  {/* Before/After Images */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.resultImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <Image
                      src={item.originalImage}
                      alt="Original"
                      fill
                      className="absolute inset-0 object-cover opacity-0 transition-opacity group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                        Hover to see original
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.user?.name && (
                      <p className="text-xs text-gray-500 mb-2">
                        by {item.user.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description || item.prompt}
                    </p>

                    {/* Stats */}
                    {activeTab === 'trending' && item.trendingScore && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-coral-500">
                          <Heart className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">
                            {item.trendingScore}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">
                            {Math.floor(item.trendingScore * 10)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Link
                      href="/showcase"
                      className="block text-center px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-teal-600 transition-all hover:scale-105 shadow-lg"
              >
                Explore All Showcases
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
