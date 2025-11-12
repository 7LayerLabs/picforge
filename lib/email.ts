import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';
import LimitWarningEmail from '@/emails/LimitWarningEmail';
import LimitReachedEmail from '@/emails/LimitReachedEmail';
import PromoCodeRedeemedEmail from '@/emails/PromoCodeRedeemedEmail';
import ProUpgradeEmail from '@/emails/ProUpgradeEmail';
import WeeklyDigestEmail from '@/emails/WeeklyDigestEmail';
import FeedbackEmail from '@/emails/FeedbackEmail';
import { isEnvVarConfigured } from '@/lib/validateEnv';
import { logger } from '@/lib/logger';

// Initialize Resend only if API key is configured
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type EmailType =
  | 'welcome'
  | 'limit-warning'
  | 'limit-reached'
  | 'promo-redeemed'
  | 'pro-upgrade'
  | 'weekly-digest'
  | 'feedback';

interface SendEmailParams {
  to: string;
  type: EmailType;
  data: any;
}

export async function sendEmail({ to, type, data }: SendEmailParams) {
  try {
    // Check if email service is configured
    if (!resend) {
      logger.error('RESEND_API_KEY not configured - email sending disabled');
      return {
        success: false,
        error: 'Email service not configured. Please add RESEND_API_KEY to .env.local'
      };
    }

    let subject = '';
    let html: string;

    switch (type) {
      case 'welcome':
        subject = 'Welcome to PicForge - (re)Imagine Everything';
        html = await render(
          WelcomeEmail({
            userName: data.userName,
            userEmail: to,
          })
        );
        break;

      case 'limit-warning':
        subject = `You have ${data.remainingImages} images left today`;
        html = await render(
          LimitWarningEmail({
            userName: data.userName,
            remainingImages: data.remainingImages,
          })
        );
        break;

      case 'limit-reached':
        subject = 'Daily limit reached - Upgrade for unlimited transformations';
        html = await render(
          LimitReachedEmail({
            userName: data.userName,
            resetTime: data.resetTime,
          })
        );
        break;

      case 'promo-redeemed':
        subject = 'Promo code activated - You now have unlimited access!';
        html = await render(
          PromoCodeRedeemedEmail({
            userName: data.userName,
            promoCode: data.promoCode,
            tier: data.tier,
          })
        );
        break;

      case 'pro-upgrade':
        subject = 'Welcome to PicForge Pro - Unlimited creativity starts now!';
        html = await render(
          ProUpgradeEmail({
            userName: data.userName,
            subscriptionId: data.subscriptionId,
            planName: data.planName || 'Pro',
            amount: data.amount || '$9.00',
          })
        );
        break;

      case 'weekly-digest':
        subject = `Your week in transformations - ${data.totalTransformations} images created!`;
        html = await render(
          WeeklyDigestEmail({
            userName: data.userName,
            totalTransformations: data.totalTransformations,
            favoritePrompts: data.favoritePrompts,
            topImages: data.topImages,
            weekStart: data.weekStart,
            weekEnd: data.weekEnd,
          })
        );
        break;

      case 'feedback':
        subject = `New Feedback: ${
          data.category ? String(data.category).toUpperCase() : 'GENERAL'
        }${data.rating ? ` • ${data.rating}/5` : ''}`;
        html = await render(
          FeedbackEmail({
            name: data.name,
            email: data.email,
            category: (data.category || 'other') as 'bug' | 'idea' | 'praise' | 'other',
            rating: data.rating || 5,
            message: data.message,
            submittedAt: data.submittedAt,
            userAgent: data.userAgent,
            ip: data.ip,
          })
        );
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const result = await resend.emails.send({
      from: 'PicForge <no-reply@pic-forge.com>',
      to,
      subject,
      html,
    });

    logger.log(`Email sent successfully: ${type} to ${to}`, result);
    return { success: true, result };
  } catch (error) {
    logger.error(`Failed to send email: ${type} to ${to}`, error);
    return { success: false, error };
  }
}

/**
 * Queue email for background sending (prevents blocking the main request)
 */
export async function queueEmail(params: SendEmailParams) {
  // In production, you'd use a queue service like BullMQ, AWS SQS, or Vercel Cron
  // For now, we'll send immediately but not block the main request
  setTimeout(async () => {
    await sendEmail(params);
  }, 0);
}

/**
 * Helper to format reset time as human-readable string
 */
export function formatResetTime(lastReset: number): string {
  const resetTime = new Date(lastReset + 24 * 60 * 60 * 1000);
  const now = new Date();
  const hoursUntilReset = Math.ceil((resetTime.getTime() - now.getTime()) / (1000 * 60 * 60));

  if (hoursUntilReset <= 1) {
    return 'in less than 1 hour';
  } else if (hoursUntilReset < 24) {
    return `in ${hoursUntilReset} hours`;
  } else {
    return resetTime.toLocaleDateString('en-US', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  }
}

/**
 * Helper to format date range for weekly digest
 */
export function formatWeekRange(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  return {
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
  };
}
