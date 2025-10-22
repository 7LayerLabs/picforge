'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Eye, Copy, Award, TrendingUp, Sparkles } from 'lucide-react';
import { useShowcaseVotes } from '@/hooks/useShowcaseVotes';

interface ShowcaseCardProps {
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
  rank?: number; // For trending badges (#1, #2, #3)
  onClick?: () => void;
  compact?: boolean;
}

export default function ShowcaseCard({
  showcase,
  isLiked = false,
  rank,
  onClick,
  compact = false,
}: ShowcaseCardProps) {
  const { toggleVote, user } = useShowcaseVotes();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(showcase.likes);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle like with optimistic updates
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      // Show toast notification
      const toast = document.createElement('div');
      toast.className =
        'fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in flex items-center gap-2';
      toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Sign in to like showcases!</span>
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
      // Revert on error
      console.error('Failed to toggle vote:', error);
      setLiked(wasLiked);
      setLikeCount(prevCount);

      // Show error toast
      const toast = document.createElement('div');
      toast.className =
        'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-fade-in';
      toast.textContent = 'Failed to update like. Please try again.';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Copy prompt to clipboard
  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(showcase.prompt);

    // Show success toast
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

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer border border-gray-200 ${
        compact ? 'hover:shadow-xl hover:scale-[1.02]' : 'hover:shadow-2xl hover:scale-[1.03]'
      }`}
      onClick={onClick}
    >
      {/* Featured/Trending Badge */}
      {showcase.featured && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
          <Award className="w-3.5 h-3.5" />
          Featured
        </div>
      )}
      {!showcase.featured && rank && rank <= 3 && (
        <div
          className={`absolute top-3 left-3 z-10 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg ${
            rank === 1
              ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
              : rank === 2
              ? 'bg-gradient-to-r from-gray-400 to-gray-600'
              : 'bg-gradient-to-r from-orange-400 to-orange-600'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />#{rank} Trending
        </div>
      )}

      {/* Image with hover effect */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Transformed image (default) */}
        <Image
          src={showcase.transformedImageUrl}
          alt={showcase.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          quality={85}
        />
        {/* Original image (on hover) */}
        <Image
          src={showcase.originalImageUrl}
          alt="Original"
          fill
          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          quality={85}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-white font-semibold text-sm bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Hover to see original
          </span>
        </div>

        {/* Quick action buttons (on hover) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <button
            onClick={copyPrompt}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:scale-110 transition-all shadow-lg"
            title="Copy prompt"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
          {showcase.title}
        </h3>

        {/* User info */}
        <div className="flex items-center gap-2 mb-3">
          {showcase.user?.image ? (
            <img
              src={showcase.user.image}
              alt={showcase.user.name || 'User'}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {showcase.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-xs text-gray-600 line-clamp-1">
            {showcase.user?.name || 'Anonymous'}
          </span>
          {showcase.style && (
            <span className="ml-auto text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
              {showcase.style}
            </span>
          )}
        </div>

        {/* Stats and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all group/like ${
                liked
                  ? 'text-coral-500 scale-105'
                  : 'text-gray-500 hover:text-coral-500 hover:scale-105'
              } ${isAnimating ? 'animate-bounce' : ''}`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  liked ? 'fill-current' : 'group-hover/like:fill-coral-200'
                }`}
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{showcase.views}</span>
            </div>
          </div>

          {/* Sparkle indicator for high engagement */}
          {likeCount >= 10 && (
            <div className="text-yellow-500 animate-pulse" title="Popular!">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
