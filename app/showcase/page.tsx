/**
 * Enhanced Showcase Gallery with Upvoting System
 * Features trending algorithm, filters, and real-time voting
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/instantdb';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  Award,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Copy,
  Heart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ShowcaseCard from '@/components/ShowcaseCard';
import SocialProofCounter from '@/components/SocialProofCounter';
import { getTrendingShowcases, getMostLikedShowcases, getRecentShowcases } from '@/lib/trendingAlgorithm';

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
    id?: string;
    name?: string | null;
    image?: string | null;
  };
}

export default function ShowcasePage() {
  const { user } = db.useAuth();
  const router = useRouter();
  const [sort, setSort] = useState<'trending' | 'most-liked' | 'recent' | 'featured'>('trending');
  const [style, setStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Query showcases from InstantDB
  const { data, isLoading } = db.useQuery({
    showcaseSubmissions: {
      $: {
        where: {
          approved: true,
          ...(style !== 'all' && { style }),
        },
      },
    },
    showcaseLikes: {},
    users: {},
  } as any);

  const typedData = data as any;

  // Process showcases with trending algorithm
  const processedShowcases = useMemo(() => {
    if (!typedData?.showcaseSubmissions) return [];

    const allShowcases = typedData.showcaseSubmissions as ShowcaseItem[];
    const allLikes = (typedData.showcaseLikes || []) as any[];
    const allUsers = (typedData.users || []) as any[];

    // Add user data to all showcases
    return allShowcases.map((showcase) => {
      const showcaseUser = allUsers.find((u: any) => u.id === showcase.userId);

      // Calculate trending score using the new algorithm
      const trendingData = getTrendingShowcases([showcase], allLikes, 1)[0];

      return {
        ...showcase,
        trendingScore: trendingData?.trendingScore?.score || 0,
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
  }, [typedData]);

  // Filter and sort showcases
  const filteredShowcases = useMemo(() => {
    let items = [...processedShowcases];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.prompt.toLowerCase().includes(query)
      );
    }

    // Featured filter
    if (sort === 'featured') {
      items = items.filter((item) => item.featured);
    }

    // Sort
    switch (sort) {
      case 'trending':
        items.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case 'most-liked':
        items.sort((a, b) => b.likes - a.likes);
        break;
      case 'recent':
        items.sort((a, b) => b.timestamp - a.timestamp);
        break;
      default:
        items.sort((a, b) => b.timestamp - a.timestamp);
    }

    return items;
  }, [processedShowcases, sort, searchQuery]);

  // Pagination
  const limit = 12;
  const totalPages = Math.ceil(filteredShowcases.length / limit);
  const paginatedShowcases = filteredShowcases.slice((page - 1) * limit, page * limit);

  // Get user's liked showcases
  const userLikes = useMemo(() => {
    if (!user || !typedData?.showcaseLikes) return new Set();
    return new Set(
      typedData.showcaseLikes
        .filter((like: any) => like.userId === user.id)
        .map((like: any) => like.showcaseId)
    );
  }, [user, typedData?.showcaseLikes]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, style, searchQuery]);

  // Handle modal view detail
  const handleViewDetail = (showcase: ShowcaseItem) => {
    setSelectedShowcase(showcase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Community Showcase
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
              Discover amazing transformations created by our community
            </p>

            {/* Social Proof Stats */}
            <div className="mb-6">
              <SocialProofCounter variant="compact" showTransformations showUsers showShowcases className="mx-auto" />
            </div>

            {user && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-purple-700 transition-all mt-4 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Submit Your Work
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search showcases..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Sort buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSort('trending')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'trending'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setSort('most-liked')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'most-liked'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className="w-4 h-4" />
                Most Liked
              </button>
              <button
                onClick={() => setSort('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'recent'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSort('featured')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'featured'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Award className="w-4 h-4" />
                Featured
              </button>
            </div>

            {/* Style filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="hidden md:block px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-medium focus:outline-none focus:border-teal-500 transition-all shadow-sm"
              >
                <option value="all">All Styles</option>
                <option value="general">General</option>
                <option value="anime">Anime</option>
                <option value="realistic">Realistic</option>
                <option value="artistic">Artistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="3d">3D Render</option>
                <option value="abstract">Abstract</option>
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">Style:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-medium focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Styles</option>
                <option value="general">General</option>
                <option value="anime">Anime</option>
                <option value="realistic">Realistic</option>
                <option value="artistic">Artistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="3d">3D Render</option>
                <option value="abstract">Abstract</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedShowcases.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No showcases found' : 'No showcases yet'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Be the first to share your amazing creation!'}
            </p>
            {user && !searchQuery && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Submit Your Work
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedShowcases.map((showcase, index) => (
              <ShowcaseCard
                key={showcase.id}
                showcase={showcase}
                isLiked={userLikes.has(showcase.id)}
                rank={
                  sort === 'trending' && page === 1 && index < 3 ? index + 1 : undefined
                }
                onClick={() => handleViewDetail(showcase)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white shadow-lg hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedShowcase && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Images comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Original</p>
                  <img
                    src={selectedShowcase.originalImageUrl}
                    alt="Original"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Transformed</p>
                  <img
                    src={selectedShowcase.transformedImageUrl}
                    alt="Result"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg p-4 mb-6 border border-teal-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Prompt Used:</p>
                <p className="text-gray-900 mb-3">{selectedShowcase.prompt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedShowcase.prompt);
                      const toast = document.createElement('div');
                      toast.className =
                        'fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in';
                      toast.textContent = 'Prompt copied!';
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </button>
                  <Link
                    href="/"
                    onClick={() => {
                      sessionStorage.setItem('tryPrompt', selectedShowcase.prompt);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all"
                  >
                    Try This Prompt
                  </Link>
                </div>
              </div>

              {/* Description */}
              {selectedShowcase.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-900">{selectedShowcase.description}</p>
                </div>
              )}

              {/* User info */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
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

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-coral-500">
                    <Award className="w-5 h-5 fill-current" />
                    <span className="font-medium">{selectedShowcase.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{selectedShowcase.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
