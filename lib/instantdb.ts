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
    timestamp: number;
  };
  usage: {
    id: string;
    userId: string;
    count: number;
    lastReset: number;
    tier: 'free' | 'pro';
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
    featured: boolean;
    timestamp: number;
  };
  showcaseLikes: {
    id: string;
    userId: string;
    showcaseId: string;
    timestamp: number;
  };
};

// Initialize with app ID from environment variable
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

const db = init<Schema>({
  appId: APP_ID
});

export { db };
