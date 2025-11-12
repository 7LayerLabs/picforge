'use client';

import { Flame, TrendingUp, Target } from 'lucide-react';

interface RouletteStreakProps {
  currentStreak: number;
  longestStreak: number;
  totalSpins: number;
  nextMilestone?: {
    name: string;
    requirement: number;
    icon: string;
  };
}

export default function RouletteStreak({
  currentStreak,
  longestStreak,
  totalSpins,
  nextMilestone
}: RouletteStreakProps) {
  const streakMessages = [
    { min: 0, message: 'Start your streak today!' },
    { min: 3, message: 'Getting hot!' },
    { min: 5, message: 'You\'re on fire!' },
    { min: 7, message: 'Lucky 7! Keep it going!' },
    { min: 14, message: 'Two weeks strong!' },
    { min: 30, message: 'Legendary dedication!' }
  ];

  const currentMessage = streakMessages
    .slice()
    .reverse()
    .find(m => currentStreak >= m.min)?.message || 'Start your streak today!';

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Your Streak
        </h3>
        {currentStreak >= 3 && (
          <div className="animate-pulse">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
        )}
      </div>

      {/* Main Streak Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">{currentStreak}</div>
        <p className="text-purple-200 text-sm">{currentMessage}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-purple-200" />
          </div>
          <div className="font-bold text-xl">{totalSpins}</div>
          <div className="text-purple-200 text-xs">Total Spins</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="font-bold text-xl">{currentStreak}</div>
          <div className="text-purple-200 text-xs">Current</div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="font-bold text-xl">{longestStreak}</div>
          <div className="text-purple-200 text-xs">Best</div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{nextMilestone.name}</div>
              <div className="text-xs text-purple-200">
                {nextMilestone.requirement - currentStreak} more days to go!
              </div>
            </div>
            <div className="text-2xl">{nextMilestone.icon}</div>
          </div>
        </div>
      )}

      {/* Streak Tips */}
      <div className="mt-4 text-xs text-purple-200 text-center">
        Spin daily to maintain your streak and unlock rewards!
      </div>
    </div>
  );
}
