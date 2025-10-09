import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ImageHistory {
  id: string
  prompt: string
  image: string
  timestamp: Date
  isOriginal?: boolean
}

interface UserPreferences {
  defaultQuality: 'standard' | 'hd'
  defaultSize: '1024x1024' | '1792x1024' | '1024x1792'
  autoSave: boolean
  lockComposition: boolean
}

interface AppState {
  // Image Editor State
  currentImage: string | null
  originalImage: string | null
  history: ImageHistory[]
  isProcessing: boolean

  // User Preferences
  preferences: UserPreferences

  // Rate Limiting
  dailyUsage: number
  dailyLimit: number
  lastReset: Date

  // UI State
  activeMode: 'editor' | 'batch' | 'canvas' | 'roulette' | 'roast'
  sidebarOpen: boolean

  // Actions
  setCurrentImage: (image: string | null) => void
  setOriginalImage: (image: string | null) => void
  addToHistory: (item: ImageHistory) => void
  clearHistory: () => void
  setProcessing: (state: boolean) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  incrementUsage: () => void
  resetDailyUsage: () => void
  setActiveMode: (mode: AppState['activeMode']) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      currentImage: null,
      originalImage: null,
      history: [],
      isProcessing: false,

      preferences: {
        defaultQuality: 'standard',
        defaultSize: '1024x1024',
        autoSave: false,
        lockComposition: false,
      },

      dailyUsage: 0,
      dailyLimit: 500,
      lastReset: new Date(),

      activeMode: 'editor',
      sidebarOpen: true,

      // Actions
      setCurrentImage: (image) => set({ currentImage: image }),
      setOriginalImage: (image) => set({ originalImage: image }),

      addToHistory: (item) => set((state) => ({
        history: [...state.history, item]
      })),

      clearHistory: () => set({ history: [] }),

      setProcessing: (state) => set({ isProcessing: state }),

      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      incrementUsage: () => set((state) => {
        const now = new Date()
        const lastReset = new Date(state.lastReset)
        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

        // Reset if more than 24 hours
        if (hoursSinceReset >= 24) {
          return {
            dailyUsage: 1,
            lastReset: now
          }
        }

        return {
          dailyUsage: state.dailyUsage + 1
        }
      }),

      resetDailyUsage: () => set({
        dailyUsage: 0,
        lastReset: new Date()
      }),

      setActiveMode: (mode) => set({ activeMode: mode }),

      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      })),
    }),
    {
      name: 'picforge-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        dailyUsage: state.dailyUsage,
        lastReset: state.lastReset,
      }),
    }
  )
)