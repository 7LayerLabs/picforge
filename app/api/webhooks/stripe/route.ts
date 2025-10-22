import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/instantdb';
import { id as generateId } from '@instantdb/react';
import { requireEnvVar } from '@/lib/validateEnv';
import { Errors, handleApiError } from '@/lib/apiErrors';

const stripe = new Stripe(requireEnvVar('STRIPE_SECRET_KEY', 'Stripe webhooks'));
const webhookSecret = requireEnvVar('STRIPE_WEBHOOK_SECRET', 'Stripe webhook verification');

// Helper function to upgrade user to Pro in InstantDB
async function upgradeUserToPro(userId: string, subscriptionId: string) {
  try {
    // Find the user's usage record
    // @ts-expect-error InstantDB query type inference issue
    const { data } = await db.useQuery({
      usage: {
        $: {
          where: {
            userId: userId
          }
        }
      }
    });

    // @ts-expect-error InstantDB data type inference issue
    const usage = data?.usage?.[0];
    const usageId = usage?.id || generateId();

    // Update user to Pro tier with unlimited images
    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.usage[usageId].update({
        userId: userId,
        tier: 'pro',
        count: usage?.count || 0,
        lastReset: usage?.lastReset || Date.now(),
        subscriptionId: subscriptionId,
      })
    ]);

    console.log(`✅ User ${userId} upgraded to Pro tier`);
  } catch (error) {
    console.error(`Error upgrading user ${userId}:`, error);
    throw error;
  }
}

// Helper function to downgrade user to Free in InstantDB
async function downgradeUserToFree(userId: string) {
  try {
    // Find the user's usage record
    // @ts-expect-error InstantDB query type inference issue
    const { data } = await db.useQuery({
      usage: {
        $: {
          where: {
            userId: userId
          }
        }
      }
    });

    // @ts-expect-error InstantDB data type inference issue
    const usage = data?.usage?.[0];
    if (!usage) {
      console.log(`No usage record found for user ${userId}`);
      return;
    }

    // Downgrade to free tier
    await db.transact([
      // @ts-expect-error InstantDB tx type inference issue
      db.tx.usage[usage.id].update({
        tier: 'free',
        subscriptionId: null,
      })
    ]);

    console.log(`✅ User ${userId} downgraded to Free tier`);
  } catch (error) {
    console.error(`Error downgrading user ${userId}:`, error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw Errors.unauthorized('Missing Stripe signature');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw Errors.unauthorized('Invalid webhook signature');
    }

  console.log(`📥 Stripe webhook received: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId && session.subscription) {
        const subscriptionId = session.subscription as string;
        await upgradeUserToPro(userId, subscriptionId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        if (subscription.status === 'active') {
          await upgradeUserToPro(userId, subscription.id);
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await downgradeUserToFree(userId);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await downgradeUserToFree(userId);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error, {
      route: '/api/webhooks/stripe',
      method: 'POST',
    });
  }
}
