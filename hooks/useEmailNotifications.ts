'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook to trigger email notifications based on user actions
 */
export function useEmailNotifications() {
  const sentEmails = useRef<Set<string>>(new Set());

  /**
   * Send an email notification (non-blocking)
   */
  const sendEmailNotification = useCallback(
    async (
      to: string,
      type: 'welcome' | 'limit-warning' | 'limit-reached' | 'promo-redeemed' | 'weekly-digest',
      data: any
    ) => {
      // Create unique key to prevent duplicate emails in same session
      const emailKey = `${to}-${type}-${JSON.stringify(data)}`;

      // Don't send duplicate emails in the same session
      if (sentEmails.current.has(emailKey)) {
        console.log('Skipping duplicate email:', type, to);
        return;
      }

      // Mark as sent
      sentEmails.current.add(emailKey);

      try {
        // Send email in background (non-blocking)
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to, type, data }),
        }).then((response) => {
          if (response.ok) {
            console.log(`Email notification sent: ${type} to ${to}`);
          } else {
            console.error(`Failed to send email: ${type} to ${to}`);
          }
        });
      } catch (error) {
        console.error('Error sending email notification:', error);
      }
    },
    []
  );

  /**
   * Send welcome email for new users
   */
  const sendWelcomeEmail = useCallback(
    (userEmail: string, userName?: string) => {
      sendEmailNotification(userEmail, 'welcome', {
        userName,
        userEmail,
      });
    },
    [sendEmailNotification]
  );

  /**
   * Send limit warning email when user has 5 images remaining
   */
  const sendLimitWarningEmail = useCallback(
    (userEmail: string, userName: string | undefined, remainingImages: number) => {
      // Only send when exactly 5 images remaining
      if (remainingImages === 5) {
        sendEmailNotification(userEmail, 'limit-warning', {
          userName,
          remainingImages,
        });
      }
    },
    [sendEmailNotification]
  );

  /**
   * Send limit reached email when user hits daily limit
   */
  const sendLimitReachedEmail = useCallback(
    (userEmail: string, userName: string | undefined, lastReset: number) => {
      const resetTime = new Date(lastReset + 24 * 60 * 60 * 1000);
      const now = new Date();
      const hoursUntilReset = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));

      let resetTimeText = '';
      if (hoursUntilReset <= 1) {
        resetTimeText = 'in less than 1 hour';
      } else if (hoursUntilReset < 24) {
        resetTimeText = `in ${hoursUntilReset} hours`;
      } else {
        resetTimeText = resetTime.toLocaleDateString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        });
      }

      sendEmailNotification(userEmail, 'limit-reached', {
        userName,
        resetTime: resetTimeText,
      });
    },
    [sendEmailNotification]
  );

  /**
   * Send promo code redeemed email
   */
  const sendPromoRedeemedEmail = useCallback(
    (userEmail: string, userName: string | undefined, promoCode: string, tier: string) => {
      sendEmailNotification(userEmail, 'promo-redeemed', {
        userName,
        promoCode,
        tier,
      });
    },
    [sendEmailNotification]
  );

  /**
   * Send weekly digest email
   */
  const sendWeeklyDigestEmail = useCallback(
    (
      userEmail: string,
      userName: string | undefined,
      stats: {
        totalTransformations: number;
        favoritePrompts: string[];
        topImages?: Array<{
          originalUrl: string;
          transformedUrl: string;
          prompt: string;
        }>;
      }
    ) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);

      sendEmailNotification(userEmail, 'weekly-digest', {
        userName,
        totalTransformations: stats.totalTransformations,
        favoritePrompts: stats.favoritePrompts,
        topImages: stats.topImages,
        weekStart: weekStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        weekEnd: now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });
    },
    [sendEmailNotification]
  );

  return {
    sendWelcomeEmail,
    sendLimitWarningEmail,
    sendLimitReachedEmail,
    sendPromoRedeemedEmail,
    sendWeeklyDigestEmail,
  };
}
