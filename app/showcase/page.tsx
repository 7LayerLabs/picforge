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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black border-b-4 border-brutal-cyan sticky top-16 z-40 shadow-brutal-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-brutal-cyan mb-3 tracking-tight">
              Community Showcase
            </h1>
            <p className="text-white text-lg max-w-2xl mx-auto mb-4 font-bold">
              Discover amazing transformations created by our community
            </p>

            {/* Social Proof Stats */}
            <div className="mb-6">
              <SocialProofCounter variant="compact" showTransformations showUsers showShowcases className="mx-auto" />
            </div>

            {user && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow hover:text-black transition-all mt-4 shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
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
                className="w-full pl-12 pr-4 py-3 border-4 border-brutal-cyan focus:border-brutal-pink focus:outline-none transition-all shadow-brutal bg-gray-900 text-white placeholder-gray-500 font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brutal-cyan transition-colors"
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
                className={`flex items-center gap-2 px-4 py-2 font-black uppercase transition-all border-4 ${
                  sort === 'trending'
                    ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-cyan hover:bg-brutal-cyan hover:text-black'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setSort('most-liked')}
                className={`flex items-center gap-2 px-4 py-2 font-black uppercase transition-all border-4 ${
                  sort === 'most-liked'
                    ? 'bg-brutal-pink text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-pink hover:bg-brutal-pink hover:text-black'
                }`}
              >
                <Heart className="w-4 h-4" />
                Most Liked
              </button>
              <button
                onClick={() => setSort('recent')}
                className={`flex items-center gap-2 px-4 py-2 font-black uppercase transition-all border-4 ${
                  sort === 'recent'
                    ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-cyan hover:bg-brutal-cyan hover:text-black'
                }`}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSort('featured')}
                className={`flex items-center gap-2 px-4 py-2 font-black uppercase transition-all border-4 ${
                  sort === 'featured'
                    ? 'bg-brutal-yellow text-black border-black shadow-brutal'
                    : 'bg-gray-900 text-white border-brutal-yellow hover:bg-brutal-yellow hover:text-black'
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
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 border-4 border-brutal-cyan text-white hover:bg-brutal-cyan hover:text-black transition-colors font-black uppercase"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="hidden md:block px-4 py-2 bg-gray-900 border-4 border-brutal-cyan font-black uppercase focus:outline-none focus:border-brutal-pink transition-all shadow-brutal text-white"
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
            <div className="md:hidden mt-4 p-4 bg-gray-900 border-4 border-brutal-cyan">
              <label className="block text-sm font-black uppercase text-brutal-cyan mb-2">Style:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-2 bg-black border-4 border-brutal-cyan font-black uppercase focus:outline-none focus:border-brutal-pink text-white"
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
              <div key={i} className="bg-black border-4 border-brutal-cyan shadow-brutal overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-900" />
                <div className="p-4">
                  <div className="h-6 bg-gray-900 mb-2" />
                  <div className="h-4 bg-gray-900" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedShowcases.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-black uppercase text-black mb-2 tracking-tight">
              {searchQuery ? 'No showcases found' : 'No showcases yet'}
            </h2>
            <p className="text-gray-600 mb-6 font-bold">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Be the first to share your amazing creation!'}
            </p>
            {user && !searchQuery && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
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
              className="p-2 bg-black border-4 border-brutal-cyan shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brutal-cyan transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-brutal-cyan hover:text-black" />
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
                    className={`w-10 h-10 font-black transition-all border-4 ${
                      page === pageNum
                        ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                        : 'bg-black text-brutal-cyan border-brutal-cyan shadow-brutal hover:bg-brutal-cyan hover:text-black'
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
              className="p-2 bg-black border-4 border-brutal-cyan shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brutal-cyan transition-all"
            >
              <ChevronRight className="w-5 h-5 text-brutal-cyan hover:text-black" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedShowcase && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShowcase(null)}
        >
          <div
            className="bg-black border-4 border-brutal-cyan shadow-brutal-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-heading text-2xl font-black uppercase text-brutal-cyan tracking-tight">{selectedShowcase.title}</h2>
                <button
                  onClick={() => setSelectedShowcase(null)}
                  className="p-2 hover:bg-gray-900 transition-colors border-4 border-brutal-cyan"
                >
                  <X className="w-6 h-6 text-brutal-cyan" />
                </button>
              </div>

              {/* Images comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-black uppercase text-brutal-cyan mb-2">Original</p>
                  <img
                    src={selectedShowcase.originalImageUrl}
                    alt="Original"
                    className="w-full border-4 border-brutal-cyan shadow-brutal"
                  />
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-brutal-pink mb-2">Transformed</p>
                  <img
                    src={selectedShowcase.transformedImageUrl}
                    alt="Result"
                    className="w-full border-4 border-brutal-pink shadow-brutal"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-gray-900 p-4 mb-6 border-4 border-brutal-cyan">
                <p className="text-sm font-black uppercase text-brutal-cyan mb-2">Prompt Used:</p>
                <p className="text-white mb-3 font-bold">{selectedShowcase.prompt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedShowcase.prompt);
                      const toast = document.createElement('div');
                      toast.className =
                        'fixed bottom-4 right-4 bg-brutal-cyan text-black px-4 py-3 border-4 border-black shadow-brutal z-50 font-black uppercase';
                      toast.textContent = 'Prompt copied!';
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white border-4 border-brutal-cyan hover:bg-brutal-cyan hover:text-black transition-colors font-black uppercase"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </button>
                  <Link
                    href="/"
                    onClick={() => {
                      sessionStorage.setItem('tryPrompt', selectedShowcase.prompt);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brutal-pink text-black border-4 border-black hover:bg-brutal-yellow transition-all font-black uppercase shadow-brutal"
                  >
                    Try This Prompt
                  </Link>
                </div>
              </div>

              {/* Description */}
              {selectedShowcase.description && (
                <div className="mb-6">
                  <p className="text-sm font-black uppercase text-brutal-cyan mb-2">Description:</p>
                  <p className="text-white font-bold">{selectedShowcase.description}</p>
                </div>
              )}

              {/* User info */}
              <div className="flex items-center justify-between pt-4 border-t-4 border-brutal-cyan">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brutal-cyan flex items-center justify-center text-black font-black border-4 border-black">
                    {selectedShowcase.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-black text-white uppercase">
                      {selectedShowcase.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-400 font-bold">
                      {new Date(selectedShowcase.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-brutal-pink">
                    <Award className="w-5 h-5 fill-current" />
                    <span className="font-black">{selectedShowcase.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brutal-cyan">
                    <Clock className="w-5 h-5" />
                    <span className="font-black">{selectedShowcase.views}</span>
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
