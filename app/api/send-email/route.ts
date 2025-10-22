import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, EmailType } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, type, data } = body;

    // Validate required fields
    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate email type
    const validTypes: EmailType[] = [
      'welcome',
      'limit-warning',
      'limit-reached',
      'promo-redeemed',
      'weekly-digest',
    ];
    if (!validTypes.includes(type as EmailType)) {
      return NextResponse.json(
        { error: `Invalid email type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
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
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
