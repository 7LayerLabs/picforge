import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireEnvVar } from '@/lib/validateEnv';
import { Errors, handleApiError } from '@/lib/apiErrors';
import { logger } from '@/lib/logger';

// Initialize Stripe
const stripe = new Stripe(requireEnvVar('STRIPE_SECRET_KEY', 'Stripe payments'), {
  apiVersion: '2025-09-30.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    if (!priceId) {
      throw Errors.missingParameter('priceId');
    }
    if (!userId) {
      throw Errors.missingParameter('userId');
    }
    if (!userEmail) {
      throw Errors.missingParameter('userEmail');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Price ID from Stripe dashboard
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
      },
      allow_promotion_codes: true, // Allow promo codes at checkout
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      logger.error('Stripe error:', error.message);
      throw Errors.externalServiceError('Stripe', error.message);
    }

    return handleApiError(error);
  }
}
