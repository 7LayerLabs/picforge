'use client';

import { db } from '@/lib/instantdb';
import { useCallback } from 'react';
import { id } from '@instantdb/react';

/**
 * Hook to manage user's email preferences
 */
export function useEmailPreferences() {
  const { user } = db.useAuth();

  // Query user's email preferences
  const { data, isLoading, error } = db.useQuery(
    user
      ? ({ emailPreferences: { $: { where: { userId: user.id } } } } as any)
      : null
  );

  const preferences = (data as any)?.emailPreferences?.[0];

  /**
   * Get email preferences with defaults
   */
  const getPreferences = useCallback(() => {
    return {
      welcomeEmails: preferences?.welcomeEmails ?? true,
      limitWarnings: preferences?.limitWarnings ?? true,
      weeklyDigests: preferences?.weeklyDigests ?? true,
      marketingEmails: preferences?.marketingEmails ?? false,
    };
  }, [preferences]);

  /**
   * Update email preferences
   */
  const updatePreferences = useCallback(
    async (newPreferences: {
      welcomeEmails?: boolean;
      limitWarnings?: boolean;
      weeklyDigests?: boolean;
      marketingEmails?: boolean;
    }) => {
      if (!user) {
        console.warn('User not logged in - cannot update preferences');
        return false;
      }

      const preferencesId = preferences?.id || id();
      const currentPrefs = getPreferences();

      try {
        await db.transact([
          // @ts-expect-error InstantDB tx type inference issue
          db.tx.emailPreferences[preferencesId].update({
            userId: user.id,
            welcomeEmails: newPreferences.welcomeEmails ?? currentPrefs.welcomeEmails,
            limitWarnings: newPreferences.limitWarnings ?? currentPrefs.limitWarnings,
            weeklyDigests: newPreferences.weeklyDigests ?? currentPrefs.weeklyDigests,
            marketingEmails: newPreferences.marketingEmails ?? currentPrefs.marketingEmails,
            updatedAt: Date.now(),
          }),
        ]);

        console.log('Email preferences updated successfully');
        return true;
      } catch (error) {
        console.error('Failed to update email preferences:', error);
        return false;
      }
    },
    [user, preferences, getPreferences]
  );

  /**
   * Check if a specific email type is enabled
   */
  const isEmailEnabled = useCallback(
    (emailType: 'welcome' | 'limit-warning' | 'weekly-digest' | 'marketing') => {
      const prefs = getPreferences();

      switch (emailType) {
        case 'welcome':
          return prefs.welcomeEmails;
        case 'limit-warning':
          return prefs.limitWarnings;
        case 'weekly-digest':
          return prefs.weeklyDigests;
        case 'marketing':
          return prefs.marketingEmails;
        default:
          return false;
      }
    },
    [getPreferences]
  );

  /**
   * Unsubscribe from all emails
   */
  const unsubscribeAll = useCallback(async () => {
    return updatePreferences({
      welcomeEmails: false,
      limitWarnings: false,
      weeklyDigests: false,
      marketingEmails: false,
    });
  }, [updatePreferences]);

  return {
    user,
    preferences: getPreferences(),
    isLoading,
    error,
    updatePreferences,
    isEmailEnabled,
    unsubscribeAll,
  };
}
