'use client';

import { Flame, Calendar, Trophy } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  lastSpinDate: string;
}

export default function StreakBadge({ currentStreak, longestStreak, lastSpinDate }: StreakBadgeProps) {
  const today = new Date().toDateString();
  const isToday = lastSpinDate === today;

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { color: 'purple', label: 'LEGENDARY', intensity: 5 };
    if (streak >= 14) return { color: 'red', label: 'UNSTOPPABLE', intensity: 4 };
    if (streak >= 7) return { color: 'orange', label: 'ON FIRE', intensity: 3 };
    if (streak >= 3) return { color: 'yellow', label: 'HEATING UP', intensity: 2 };
    return { color: 'teal', label: 'STARTING', intensity: 1 };
  };

  const level = getStreakLevel(currentStreak);

  const streakColors = {
    purple: 'bg-purple-600 border-purple-400',
    red: 'bg-red-600 border-red-400',
    orange: 'bg-orange-600 border-orange-400',
    yellow: 'bg-yellow-600 border-yellow-400',
    teal: 'bg-teal-600 border-teal-400',
  };

  if (currentStreak === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-2">🎲</div>
          <h3 className="font-bold text-gray-900 mb-1">Start Your Streak!</h3>
          <p className="text-sm text-gray-600">Spin daily to build your streak and unlock rewards</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${streakColors[level.color as keyof typeof streakColors]} rounded-xl shadow-2xl p-6 border-4 transform transition-all hover:scale-105`}>
      {/* Main Streak Display */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className={`w-8 h-8 text-white ${currentStreak >= 3 ? 'animate-pulse' : ''}`} />
          <span className="text-5xl font-bold text-white">{currentStreak}</span>
          <Flame className={`w-8 h-8 text-white ${currentStreak >= 3 ? 'animate-pulse' : ''}`} />
        </div>
        <div className="text-white font-bold text-xl mb-1">{level.label} STREAK</div>
        <p className="text-white/90 text-sm">
          {isToday ? 'Spun today! Keep it going!' : 'Last spin: ' + lastSpinDate}
        </p>
      </div>

      {/* Flame intensity indicator */}
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Flame
            key={i}
            className={`w-5 h-5 ${
              i < level.intensity
                ? 'text-white'
                : 'text-white/30'
            }`}
          />
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-white mx-auto mb-1" />
          <div className="text-white font-bold text-lg">{longestStreak}</div>
          <div className="text-white/80 text-xs">Longest Streak</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
          <Calendar className="w-5 h-5 text-white mx-auto mb-1" />
          <div className="text-white font-bold text-lg">
            {currentStreak === longestStreak ? 'ALL-TIME!' : `${longestStreak - currentStreak} away`}
          </div>
          <div className="text-white/80 text-xs">
            {currentStreak === longestStreak ? 'Personal Best' : 'From Best'}
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      {currentStreak < 30 && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-semibold">Next Milestone</span>
            <span className="text-white text-sm">
              {currentStreak}/{currentStreak >= 14 ? 30 : currentStreak >= 7 ? 14 : currentStreak >= 3 ? 7 : 3}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  currentStreak >= 14
                    ? ((currentStreak - 14) / (30 - 14)) * 100
                    : currentStreak >= 7
                    ? ((currentStreak - 7) / (14 - 7)) * 100
                    : currentStreak >= 3
                    ? ((currentStreak - 3) / (7 - 3)) * 100
                    : (currentStreak / 3) * 100
                }%`,
              }}
            />
          </div>
          <p className="text-white/80 text-xs mt-2 text-center">
            {currentStreak >= 14
              ? `${30 - currentStreak} more days to LEGENDARY!`
              : currentStreak >= 7
              ? `${14 - currentStreak} more days to UNSTOPPABLE!`
              : currentStreak >= 3
              ? `${7 - currentStreak} more days to ON FIRE!`
              : `${3 - currentStreak} more days to HEATING UP!`}
          </p>
        </div>
      )}

      {/* Warning if not spun today */}
      {!isToday && (
        <div className="mt-4 bg-red-500/30 backdrop-blur-sm rounded-lg p-3 border border-white/30">
          <p className="text-white text-sm text-center font-semibold">
            ⚠️ Spin today or lose your streak!
          </p>
        </div>
      )}
    </div>
  );
}
