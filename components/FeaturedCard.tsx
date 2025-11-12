'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, Copy, Sparkles, Award } from 'lucide-react';
import { useShowcaseVotes } from '@/hooks/useShowcaseVotes';
import TrendingBadge from './TrendingBadge';
import dynamic from 'next/dynamic';
import { logger } from '@/lib/logger';
const BeforeAfterSlider = dynamic(() => import('./BeforeAfterSlider'), { ssr: false });

interface FeaturedCardProps {
  showcase: {
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
    timestamp: number;
    user?: {
      id?: string;
      name?: string | null;
      image?: string | null;
    };
  };
  isLiked?: boolean;
  rank?: number; // For trending rankings
  showTrendingBadge?: boolean;
  showFeaturedBadge?: boolean;
  onViewDetail?: () => void;
}

export default function FeaturedCard({
  showcase,
  isLiked = false,
  rank,
  showTrendingBadge = false,
  showFeaturedBadge = false,
  onViewDetail,
}: FeaturedCardProps) {
  const { toggleVote, user } = useShowcaseVotes();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(showcase.likes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showFullView, setShowFullView] = useState(false);

  // Handle like with optimistic updates
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      const toast = document.createElement('div');
      toast.className =
        'fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Sign in to like transformations!</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      return;
    }

    // Optimistic update
    const wasLiked = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setIsAnimating(true);

    try {
      const result = await toggleVote(showcase.id);
      setLikeCount(result.newCount);
      setLiked(result.action === 'liked');
    } catch (error) {
      logger.error('Failed to toggle vote:', error);
      setLiked(wasLiked);
      setLikeCount(prevCount);
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Copy prompt
  const copyPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(showcase.prompt);

    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2';
    toast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Prompt copied!</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail();
    } else {
      setShowFullView(true);
    }
  };

  return (
    <>
      {/* Card */}
      <div
        className="group relative bg-white rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 cursor-pointer border-2 border-gray-300 hover:border-teal-500 hover:shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:-translate-y-1"
        onClick={handleCardClick}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {showFeaturedBadge && showcase.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
              <Award className="w-3.5 h-3.5" />
              Featured
            </div>
          )}
          {showTrendingBadge && rank && <TrendingBadge rank={rank} size="sm" />}
        </div>

        {/* Toggle Before/After Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBeforeAfter(!showBeforeAfter);
          }}
          className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
        >
          {showBeforeAfter ? 'Show Result' : 'Show Original'}
        </button>

        {/* Image Display */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {showBeforeAfter ? (
            <BeforeAfterSlider
              beforeImage={showcase.originalImageUrl}
              afterImage={showcase.transformedImageUrl}
              beforeLabel="Original"
              afterLabel="Transformed"
              className="w-full h-full"
            />
          ) : (
            <>
              {/* Transformed Image */}
              <Image
                src={showcase.transformedImageUrl}
                alt={showcase.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {showcase.prompt}
                  </p>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-900 rounded-lg text-xs font-medium hover:bg-white transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Prompt
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg">{showcase.title}</h3>

          {/* User Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {showcase.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs text-gray-600 line-clamp-1">
              {showcase.user?.name || 'Anonymous'}
            </span>
            {showcase.style && (
              <span className="ml-auto text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                {showcase.style}
              </span>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-all ${
                  liked
                    ? 'text-coral-500 scale-105'
                    : 'text-gray-500 hover:text-coral-500 hover:scale-105'
                } ${isAnimating ? 'animate-bounce' : ''}`}
                title={liked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${liked ? 'fill-current' : ''}`}
                />
                <span className="text-sm font-semibold">{likeCount}</span>
              </button>

              {/* Views */}
              <div className="flex items-center gap-1.5 text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-sm">{showcase.views}</span>
              </div>
            </div>

            {/* Sparkle for high engagement */}
            {likeCount >= 10 && (
              <div className="text-yellow-500 animate-pulse" title="Popular!">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full View Modal */}
      {showFullView && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullView(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-heading text-2xl font-bold">{showcase.title}</h2>
                <button
                  onClick={() => setShowFullView(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Images */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Original</p>
                  <img
                    src={showcase.originalImageUrl}
                    alt="Original"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Transformed</p>
                  <img
                    src={showcase.transformedImageUrl}
                    alt="Result"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg p-4 mb-6 border border-teal-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Prompt Used:</p>
                <p className="text-gray-900 mb-3">{showcase.prompt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </button>
                  <Link
                    href="/"
                    onClick={() => {
                      sessionStorage.setItem('tryPrompt', showcase.prompt);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg hover:from-teal-600 hover:to-purple-700 transition-all"
                  >
                    Try This Prompt
                  </Link>
                </div>
              </div>

              {/* Description */}
              {showcase.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-900">{showcase.description}</p>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {showcase.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {showcase.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(showcase.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-coral-500">
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{showcase.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
