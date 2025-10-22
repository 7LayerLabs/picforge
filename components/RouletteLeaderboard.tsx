'use client';

import { useState } from 'react';
import { Trophy, Flame, Sparkles, TrendingUp, ThumbsUp, ChevronDown, ChevronUp, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  userId: string;
  category: string;
  prompt: string;
  transformedImageUrl?: string;
  isRare: boolean;
  voteCount: number;
  timestamp: number;
}

interface RouletteLeaderboardProps {
  leaderboard: {
    creative: LeaderboardEntry[];
    funny: LeaderboardEntry[];
    chaotic: LeaderboardEntry[];
    all: LeaderboardEntry[];
  };
  onVote?: (spinId: string, voteType: 'creative' | 'funny' | 'chaotic') => void;
  userHasVoted?: (spinId: string) => boolean;
}

export default function RouletteLeaderboard({
  leaderboard,
  onVote,
  userHasVoted
}: RouletteLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'creative' | 'funny' | 'chaotic' | 'all'>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const tabs = [
    { id: 'all' as const, label: 'Top Spins', icon: Trophy, color: 'purple' },
    { id: 'creative' as const, label: 'Most Creative', icon: Sparkles, color: 'blue' },
    { id: 'funny' as const, label: 'Funniest', icon: Flame, color: 'orange' },
    { id: 'chaotic' as const, label: 'Most Chaotic', icon: TrendingUp, color: 'red' },
  ];

  const currentLeaderboard = leaderboard[activeTab] || [];

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return 'bg-yellow-100 border-yellow-400';
    if (index === 1) return 'bg-gray-100 border-gray-400';
    if (index === 2) return 'bg-orange-100 border-orange-400';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Leaderboard
        </h3>
        <div className="text-sm text-gray-500">
          Top transformations voted by the community
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? `bg-${tab.color}-600 text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {currentLeaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No entries yet. Be the first!</p>
            <p className="text-sm text-gray-400 mt-2">
              Spin the wheel and share your transformation to appear on the leaderboard.
            </p>
          </div>
        ) : (
          currentLeaderboard.slice(0, 10).map((entry, index) => {
            const isExpanded = expandedEntry === entry.id;
            const hasVoted = userHasVoted ? userHasVoted(entry.id) : false;

            return (
              <div
                key={entry.id}
                className={`border-2 rounded-xl p-4 transition-all ${getMedalColor(index)} ${
                  isExpanded ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="text-3xl font-bold w-12 text-center flex-shrink-0">
                    {getMedalEmoji(index)}
                  </div>

                  {/* Thumbnail */}
                  {entry.transformedImageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={entry.transformedImageUrl}
                        alt="Transformation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 truncate">
                        {entry.prompt}
                      </span>
                      {entry.isRare && (
                        <span className="text-yellow-500 text-sm flex-shrink-0">💎 RARE</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {entry.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Votes */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ThumbsUp className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-lg text-purple-600">{entry.voteCount}</span>
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {/* Full Image */}
                    {entry.transformedImageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={entry.transformedImageUrl}
                          alt="Full transformation"
                          className="w-full max-h-64 object-contain bg-gray-50"
                        />
                      </div>
                    )}

                    {/* Vote Buttons */}
                    {onVote && !hasVoted && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onVote(entry.id, 'creative')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          Creative
                        </button>
                        <button
                          onClick={() => onVote(entry.id, 'funny')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
                        >
                          <Flame className="w-4 h-4" />
                          Funny
                        </button>
                        <button
                          onClick={() => onVote(entry.id, 'chaotic')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Chaotic
                        </button>
                      </div>
                    )}

                    {hasVoted && (
                      <div className="text-center text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        You voted on this transformation
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Message */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
        Vote on transformations to help the community discover the best spins!
        <br />
        Share your spins to compete for the top spot.
      </div>
    </div>
  );
}
