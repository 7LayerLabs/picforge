'use client';

import { TrendingUp, Flame, Zap, Star } from 'lucide-react';

interface TrendingBadgeProps {
  rank?: number; // 1, 2, 3 for top trending
  variant?: 'fire' | 'trending' | 'hot' | 'star';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function TrendingBadge({
  rank,
  variant = 'trending',
  size = 'md',
  className = '',
}: TrendingBadgeProps) {
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  // Rank-based styling
  if (rank) {
    const rankConfig = {
      1: {
        gradient: 'from-yellow-500 to-amber-600',
        text: '#1 Trending',
        icon: <TrendingUp className={iconSizes[size]} />,
        animate: 'animate-pulse',
      },
      2: {
        gradient: 'from-gray-400 to-gray-600',
        text: '#2 Trending',
        icon: <TrendingUp className={iconSizes[size]} />,
        animate: '',
      },
      3: {
        gradient: 'from-orange-400 to-orange-600',
        text: '#3 Trending',
        icon: <TrendingUp className={iconSizes[size]} />,
        animate: '',
      },
    };

    const config = rankConfig[rank as 1 | 2 | 3];
    if (!config) return null;

    return (
      <div
        className={`inline-flex items-center bg-gradient-to-r ${config.gradient} text-white rounded-full font-bold shadow-lg ${sizeClasses[size]} ${config.animate} ${className}`}
      >
        {config.icon}
        <span>{config.text}</span>
      </div>
    );
  }

  // Variant-based styling
  const variants = {
    fire: {
      gradient: 'from-red-500 to-orange-600',
      icon: <Flame className={`${iconSizes[size]} animate-pulse`} />,
      text: 'On Fire',
    },
    trending: {
      gradient: 'from-teal-500 to-purple-600',
      icon: <TrendingUp className={iconSizes[size]} />,
      text: 'Trending',
    },
    hot: {
      gradient: 'from-pink-500 to-rose-600',
      icon: <Zap className={iconSizes[size]} />,
      text: 'Hot',
    },
    star: {
      gradient: 'from-yellow-400 to-amber-500',
      icon: <Star className={`${iconSizes[size]} fill-current`} />,
      text: 'Popular',
    },
  };

  const config = variants[variant];

  return (
    <div
      className={`inline-flex items-center bg-gradient-to-r ${config.gradient} text-white rounded-full font-bold shadow-lg ${sizeClasses[size]} ${className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
