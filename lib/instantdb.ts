import { init } from '@instantdb/react';

// Initialize InstantDB
// Schema for PicForge data
type Schema = {
  users: {
    id: string;
    email: string;
    name?: string;
    createdAt: number;
  };
  images: {
    id: string;
    userId: string;
    prompt: string;
    originalUrl?: string;
    transformedUrl?: string;
    locked: boolean;
    timestamp: number;
  };
  favorites: {
    id: string;
    userId: string;
    prompt: string;
    category?: string;
    originalUrl?: string;
    transformedUrl?: string;
    locked?: boolean;
    timestamp: number;
  };
  usage: {
    id: string;
    userId: string;
    count: number;
    lastReset: number;
    tier: 'free' | 'pro' | 'unlimited';
    subscriptionId?: string;
  };
  promoCodes: {
    id: string;
    code: string;
    tier: string;
    isRedeemed: boolean;
    redeemedBy?: string;
    redeemedAt?: number;
    createdAt: number;
    createdBy?: string;
  };
  showcaseSubmissions: {
    id: string;
    userId: string;
    title: string;
    description?: string;
    prompt: string;
    originalImageUrl: string;
    transformedImageUrl: string;
    style?: string;
    likes: number;
    views: number;
    featured: boolean;
    approved: boolean;
    timestamp: number;
  };
  showcaseLikes: {
    id: string;
    userId: string;
    showcaseId: string;
    timestamp: number;
  };
  referrals: {
    id: string;
    referrerId: string; // User who created the referral code
    referralCode: string; // Unique code (e.g., "DEREK-ABC123")
    referredUserId?: string; // User who used the code
    status: 'pending' | 'completed'; // pending = code created, completed = someone used it
    bonusImagesReferrer: number; // Images earned by referrer (10)
    bonusImagesReferred: number; // Images earned by referred user (10)
    createdAt: number;
    redeemedAt?: number;
  };
  emailPreferences: {
    id: string;
    userId: string;
    welcomeEmails: boolean;
    limitWarnings: boolean;
    weeklyDigests: boolean;
    marketingEmails: boolean;
    updatedAt: number;
  };
  rouletteStreaks: {
    id: string;
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastSpinDate: string;
    totalSpins: number;
    categoriesUnlocked: string[]; // Array of category names
    createdAt: number;
    updatedAt: number;
  };
  rouletteAchievements: {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: number;
  };
  rouletteSpins: {
    id: string;
    userId: string;
    category: string;
    prompt: string;
    originalImageUrl?: string;
    transformedImageUrl?: string;
    isRare: boolean;
    timestamp: number;
    shareCount: number;
    voteCount: number;
  };
  rouletteVotes: {
    id: string;
    spinId: string;
    userId: string;
    voteType: 'creative' | 'funny' | 'chaotic';
    timestamp: number;
  };
};

// Initialize with app ID from environment variable
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

// @ts-expect-error InstantDB Schema type constraint issue
const db = init<Schema>({
  appId: APP_ID
});

export { db };
