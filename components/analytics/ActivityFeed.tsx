'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Image as ImageIcon, Heart, UserPlus, Sparkles, Zap } from 'lucide-react';

interface Activity {
  id: string;
  type: 'image' | 'favorite' | 'signup' | 'promo_code';
  timestamp: number;
  user?: string;
  details?: string;
}

interface ActivityFeedProps {
  images: any[];
  favorites: any[];
  users: any[];
  promoCodes: any[];
  limit?: number;
}

export function ActivityFeed({
  images,
  favorites,
  users,
  promoCodes,
  limit = 20
}: ActivityFeedProps) {
  const activities = useMemo(() => {
    const activities: Activity[] = [];

    // Add image generations
    images.forEach((img: any) => {
      activities.push({
        id: `img-${img.id}`,
        type: 'image',
        timestamp: img.timestamp,
        user: img.userId,
        details: img.prompt?.substring(0, 50),
      });
    });

    // Add favorites
    favorites.forEach((fav: any) => {
      activities.push({
        id: `fav-${fav.id}`,
        type: 'favorite',
        timestamp: fav.timestamp,
        user: fav.userId,
        details: fav.prompt?.substring(0, 50),
      });
    });

    // Add signups
    users.forEach((user: any) => {
      activities.push({
        id: `user-${user.id}`,
        type: 'signup',
        timestamp: user.createdAt,
        user: user.email,
        details: 'New user registered',
      });
    });

    // Add promo code redemptions
    promoCodes
      .filter((code: any) => code.isRedeemed && code.redeemedAt)
      .forEach((code: any) => {
        activities.push({
          id: `code-${code.id}`,
          type: 'promo_code',
          timestamp: code.redeemedAt,
          user: code.redeemedBy,
          details: `Redeemed ${code.code} (${code.tier})`,
        });
      });

    // Sort by most recent
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [images, favorites, users, promoCodes, limit]);

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-teal-500" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'signup':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'promo_code':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'image':
        return 'Generated image';
      case 'favorite':
        return 'Saved favorite';
      case 'signup':
        return 'New signup';
      case 'promo_code':
        return 'Redeemed code';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Live Activity Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-gray-500">Real-time</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {getActivityText(activity)}
                </p>
                {activity.details && (
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    {activity.details}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500">
                {getTimeAgo(activity.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
