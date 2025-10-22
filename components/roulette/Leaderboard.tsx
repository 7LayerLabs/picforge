'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, Flame, Users, Crown, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  category?: string;
  prompt?: string;
  transformedImageUrl?: string;
  voteCount?: number;
  timestamp?: number;
  // For user-level leaderboard
  totalSpins?: number;
  currentStreak?: number;
  longestStreak?: number;
  shareCount?: number;
}

interface LeaderboardProps {
  topSpins: LeaderboardEntry[];
  topStreaks: LeaderboardEntry[];
  currentUserRank?: {
    spinsRank?: number;
    streakRank?: number;
  };
}

export default function Leaderboard({ topSpins, topStreaks, currentUserRank }: LeaderboardProps) {
  const [selectedTab, setSelectedTab] = useState<'creative' | 'streaks' | 'spins'>('creative');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Leaderboard</h2>
        </div>
        <p className="text-purple-100">See where you rank among the chaos creators</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setSelectedTab('creative')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
            selectedTab === 'creative'
              ? 'bg-white text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Most Popular
        </button>
        <button
          onClick={() => setSelectedTab('streaks')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
            selectedTab === 'streaks'
              ? 'bg-white text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          Top Streaks
        </button>
        <button
          onClick={() => setSelectedTab('spins')}
          className={`flex-1 px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 ${
            selectedTab === 'spins'
              ? 'bg-white text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Most Active
        </button>
      </div>

      {/* Leaderboard Content */}
      <div className="p-6">
        {/* Most Popular Transformations */}
        {selectedTab === 'creative' && (
          <div className="space-y-3">
            {topSpins.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold mb-2">No votes yet</p>
                <p className="text-sm">Be the first to share and get votes!</p>
              </div>
            ) : (
              topSpins.slice(0, 10).map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBg(rank)} transition-all hover:shadow-md`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>

                    {/* Thumbnail */}
                    {entry.transformedImageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={entry.transformedImageUrl}
                          alt="Transformation"
                          className="w-16 h-16 rounded-lg object-cover shadow-md"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {entry.category || 'Unknown Category'}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        &quot;{entry.prompt || 'Unknown transformation'}&quot;
                      </div>
                    </div>

                    {/* Vote Count */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {entry.voteCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Top Streaks */}
        {selectedTab === 'streaks' && (
          <div className="space-y-3">
            {topStreaks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Flame className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold mb-2">No streaks yet</p>
                <p className="text-sm">Start spinning daily to build your streak!</p>
              </div>
            ) : (
              topStreaks.slice(0, 10).map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBg(rank)} transition-all hover:shadow-md`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>

                    {/* Flame Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        User #{entry.userId.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Longest: {entry.longestStreak || 0} days
                      </div>
                    </div>

                    {/* Streak Count */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                        <Flame className="w-6 h-6" />
                        {entry.currentStreak || 0}
                      </div>
                      <div className="text-xs text-gray-500">day streak</div>
                    </div>
                  </div>
                );
              })
            )}

            {currentUserRank?.streakRank && (
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <p className="text-center text-purple-900 font-semibold">
                  Your Rank: #{currentUserRank.streakRank}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Most Active (Total Spins) */}
        {selectedTab === 'spins' && (
          <div className="space-y-3">
            {topStreaks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold mb-2">No spins yet</p>
                <p className="text-sm">Be the first to spin the wheel!</p>
              </div>
            ) : (
              topStreaks.slice(0, 10).map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBg(rank)} transition-all hover:shadow-md`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">
                          {(entry.userId || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        User #{entry.userId.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.shareCount || 0} shares
                      </div>
                    </div>

                    {/* Spin Count */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {entry.totalSpins || 0}
                      </div>
                      <div className="text-xs text-gray-500">total spins</div>
                    </div>
                  </div>
                );
              })
            )}

            {currentUserRank?.spinsRank && (
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <p className="text-center text-purple-900 font-semibold">
                  Your Rank: #{currentUserRank.spinsRank}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <p className="text-center text-sm text-gray-600">
          Updated in real-time. Keep spinning and sharing to climb the ranks!
        </p>
      </div>
    </div>
  );
}
