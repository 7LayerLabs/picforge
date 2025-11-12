import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, EmailType } from '@/lib/email';
import { Errors, handleApiError } from '@/lib/apiErrors';
import { isEnvVarConfigured } from '@/lib/validateEnv';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if email service is configured
    if (!isEnvVarConfigured('RESEND_API_KEY')) {
      throw Errors.apiKeyMissing('Resend email service');
    }

    const body = await request.json();
    const { to, type, data } = body;

    // Validate required fields
    if (!to) {
      throw Errors.missingParameter('to');
    }
    if (!type) {
      throw Errors.missingParameter('type');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw Errors.invalidInput('Invalid email format');
    }

    // Validate email type
    const validTypes: EmailType[] = [
      'welcome',
      'limit-warning',
      'limit-reached',
      'promo-redeemed',
      'pro-upgrade',
      'weekly-digest',
    ];
    if (!validTypes.includes(type as EmailType)) {
      throw Errors.invalidInput(
        `Invalid email type. Must be one of: ${validTypes.join(', ')}`
      );
    }

    // Send email
    const result = await sendEmail({
      to,
      type: type as EmailType,
      data: data || {},
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${to}`,
      });
    } else {
      throw Errors.externalServiceError('Resend email service', String(result.error));
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/send-email',
      method: 'POST',
    });
  }
}
