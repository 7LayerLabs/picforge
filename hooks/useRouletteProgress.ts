'use client';

import { useState, useEffect } from 'react';

interface RouletteStats {
  totalSpins: number;
  streak: number;
  maxStreak: number;
  categoriesUnlocked: Set<string>;
  achievements: string[];
  lastSpinDate: string;
}

const ACHIEVEMENTS = [
  { id: 'first_spin', name: 'First Spin', description: 'Spin the wheel for the first time', icon: '🎲', requirement: 1 },
  { id: 'spin_5', name: 'Getting Started', description: 'Spin 5 times', icon: '🌟', requirement: 5 },
  { id: 'spin_10', name: 'Addicted', description: 'Spin 10 times', icon: '🔥', requirement: 10 },
  { id: 'spin_25', name: 'Roulette Master', description: 'Spin 25 times', icon: '🏆', requirement: 25 },
  { id: 'spin_50', name: 'Legendary', description: 'Spin 50 times', icon: '👑', requirement: 50 },
  { id: 'streak_3', name: 'Hot Streak', description: '3 spins in a row', icon: '🔥', requirement: 3 },
  { id: 'streak_5', name: 'On Fire', description: '5 spins in a row', icon: '🔥🔥🔥', requirement: 5 },
  { id: 'all_categories', name: 'Category Explorer', description: 'Try all 8 categories', icon: '🌍', requirement: 8 },
];

export function useRouletteProgress() {
  const [stats, setStats] = useState<RouletteStats>({
    totalSpins: 0,
    streak: 0,
    maxStreak: 0,
    categoriesUnlocked: new Set(),
    achievements: [],
    lastSpinDate: ''
  });

  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Load stats from localStorage
    const saved = localStorage.getItem('rouletteStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      setStats({
        ...parsed,
        categoriesUnlocked: new Set(parsed.categoriesUnlocked || [])
      });
    }
  }, []);

  const saveStats = (newStats: RouletteStats) => {
    const toSave = {
      ...newStats,
      categoriesUnlocked: Array.from(newStats.categoriesUnlocked)
    };
    localStorage.setItem('rouletteStats', JSON.stringify(toSave));
    setStats(newStats);
  };

  const recordSpin = (category: string) => {
    const today = new Date().toDateString();
    const isNewDay = stats.lastSpinDate !== today;

    const newStats: RouletteStats = {
      totalSpins: stats.totalSpins + 1,
      streak: isNewDay ? 1 : stats.streak + 1,
      maxStreak: Math.max(stats.maxStreak, isNewDay ? 1 : stats.streak + 1),
      categoriesUnlocked: new Set([...stats.categoriesUnlocked, category]),
      achievements: [...stats.achievements],
      lastSpinDate: today
    };

    // Check for new achievements
    const earnedAchievements: string[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (stats.achievements.includes(achievement.id)) return;

      let earned = false;
      if (achievement.id.startsWith('spin_')) {
        earned = newStats.totalSpins >= achievement.requirement;
      } else if (achievement.id.startsWith('streak_')) {
        earned = newStats.streak >= achievement.requirement;
      } else if (achievement.id === 'all_categories') {
        earned = newStats.categoriesUnlocked.size >= achievement.requirement;
      }

      if (earned) {
        newStats.achievements.push(achievement.id);
        earnedAchievements.push(achievement.id);
      }
    });

    saveStats(newStats);

    if (earnedAchievements.length > 0) {
      setNewAchievements(earnedAchievements);
      setTimeout(() => setNewAchievements([]), 5000);
    }

    return earnedAchievements;
  };

  const getAchievementDetails = (id: string) => {
    return ACHIEVEMENTS.find(a => a.id === id);
  };

  const getProgress = () => {
    const nextMilestone = ACHIEVEMENTS.find(a =>
      !stats.achievements.includes(a.id) && a.id.startsWith('spin_')
    );

    return {
      current: stats.totalSpins,
      next: nextMilestone?.requirement || 100,
      percentage: nextMilestone
        ? (stats.totalSpins / nextMilestone.requirement) * 100
        : 100
    };
  };

  return {
    stats,
    recordSpin,
    newAchievements,
    getAchievementDetails,
    getProgress,
    allAchievements: ACHIEVEMENTS
  };
}
