'use client';

import { Lock, Trophy } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    type: string;
    reward: {
      bonusImages: number;
      message: string;
    };
  };
  isUnlocked: boolean;
  progress?: number; // Current progress toward unlocking (0-100)
  onClick?: () => void;
}

export default function AchievementBadge({
  achievement,
  isUnlocked,
  progress = 0,
  onClick
}: AchievementBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 text-center transition-all cursor-pointer group ${
        isUnlocked
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-lg hover:shadow-xl hover:scale-105'
          : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
      }`}
    >
      {/* Badge Icon */}
      <div className="relative mb-3">
        <div
          className={`text-5xl transition-transform ${
            isUnlocked ? 'animate-bounce' : 'grayscale'
          } ${onClick ? 'group-hover:scale-110' : ''}`}
        >
          {achievement.icon}
        </div>

        {/* Lock Overlay for Locked Achievements */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-600 rounded-full p-2">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Trophy Badge for Unlocked */}
        {isUnlocked && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
            <Trophy className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Achievement Name */}
      <div className="font-bold text-sm text-gray-900 mb-1">{achievement.name}</div>

      {/* Description */}
      <div className="text-xs text-gray-600 mb-2">{achievement.description}</div>

      {/* Progress Bar (for unlocked achievements) */}
      {!isUnlocked && progress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</div>
        </div>
      )}

      {/* Reward Info */}
      {isUnlocked && achievement.reward.bonusImages > 0 && (
        <div className="mt-2 text-xs bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 font-semibold">
          +{achievement.reward.bonusImages} images
        </div>
      )}

      {/* Locked Status */}
      {!isUnlocked && (
        <div className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Locked
        </div>
      )}
    </div>
  );
}
