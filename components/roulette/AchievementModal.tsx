'use client';

import { useState } from 'react';
import { X, Trophy, Lock, CheckCircle, Gift } from 'lucide-react';
import { ACHIEVEMENTS } from '@/hooks/useRouletteGame';

interface AchievementModalProps {
  unlockedAchievements: string[];
  totalSpins: number;
  currentStreak: number;
  categoriesUnlocked: string[];
  rareSpinsCount: number;
  shareCount: number;
  voteCount: number;
  onClose: () => void;
}

export default function AchievementModal({
  unlockedAchievements,
  totalSpins,
  currentStreak,
  categoriesUnlocked,
  rareSpinsCount,
  shareCount,
  voteCount,
  onClose,
}: AchievementModalProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const getProgress = (achievement: typeof ACHIEVEMENTS[number]) => {
    switch (achievement.type) {
      case 'spins':
        return { current: totalSpins, target: achievement.requirement };
      case 'streak':
        return { current: currentStreak, target: achievement.requirement };
      case 'categories':
        return { current: categoriesUnlocked.length, target: achievement.requirement };
      case 'rares':
        return { current: rareSpinsCount, target: achievement.requirement };
      case 'shares':
        return { current: shareCount, target: achievement.requirement };
      case 'votes':
        return { current: voteCount, target: achievement.requirement };
      default:
        return { current: 0, target: 1 };
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);
    if (selectedTab === 'unlocked') return isUnlocked;
    if (selectedTab === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Achievements</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Overall Progress</span>
              <span className="font-bold">{unlockedCount}/{totalCount} ({completionPercentage.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${completionPercentage}%` }}
              >
                {completionPercentage > 10 && (
                  <Trophy className="w-3 h-3 text-purple-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'all'
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setSelectedTab('unlocked')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'unlocked'
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setSelectedTab('locked')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              selectedTab === 'locked'
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Achievement Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const progress = getProgress(achievement);
              const progressPercent = Math.min((progress.current / progress.target) * 100, 100);

              return (
                <div
                  key={achievement.id}
                  className={`relative rounded-xl p-4 border-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-md'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Unlocked Badge */}
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                        isUnlocked ? 'bg-white shadow-md' : 'bg-gray-200'
                      }`}
                    >
                      {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar (for locked achievements) */}
                  {!isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {progress.current}/{progress.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward Info */}
                  <div className={`mt-3 flex items-center gap-2 text-xs ${
                    isUnlocked ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    <Gift className="w-4 h-4" />
                    <span className="font-semibold">
                      {isUnlocked ? 'Earned:' : 'Reward:'} +{achievement.reward.bonusImages} images
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold mb-2">
                {selectedTab === 'unlocked' ? 'No achievements unlocked yet' : 'All achievements unlocked!'}
              </p>
              <p className="text-sm">
                {selectedTab === 'unlocked'
                  ? 'Keep spinning to unlock your first achievement!'
                  : 'Congratulations! You&apos;ve mastered the roulette!'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-600">
            Complete achievements to earn bonus images and show off your dedication!
          </p>
        </div>
      </div>
    </div>
  );
}
