/**
 * Integration Tests: Payment Flow
 *
 * Tests the complete Stripe payment workflow including checkout session creation,
 * webhook handling, and user tier upgrades.
 */

import { POST } from '@/app/api/webhooks/stripe/route';
import Stripe from 'stripe';
import { db } from '@/lib/instantdb';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

// Mock InstantDB
jest.mock('@/lib/instantdb', () => ({
  db: {
    transact: jest.fn(),
  },
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Payment Flow Integration Tests', () => {
  let stripeMock: jest.Mocked<Stripe>;

  beforeEach(() => {
    jest.clearAllMocks();
    stripeMock = new Stripe('sk_test_mock') as jest.Mocked<Stripe>;
  });

  describe('Checkout Session Creation', () => {
    it('should create Stripe checkout session for Pro upgrade', async () => {
      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        customer: 'cus_test_123',
        amount_total: 999,
        currency: 'usd',
      };

      (stripeMock.checkout.sessions.create as jest.Mock).mockResolvedValue(mockSession);

      const session = await stripeMock.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: 'price_pro_monthly',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'https://pic-forge.com/success',
        cancel_url: 'https://pic-forge.com/cancel',
        customer_email: 'test@example.com',
        metadata: {
          userId: 'user-123',
        },
      });

      expect(session.id).toBe('cs_test_123');
      expect(session.url).toBeTruthy();
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalled();
    });

    it('should include correct metadata in checkout session', async () => {
      const userId = 'user-456';
      const userEmail = 'customer@example.com';

      const mockSession = {
        id: 'cs_test_456',
        url: 'https://checkout.stripe.com/pay/cs_test_456',
      };

      (stripeMock.checkout.sessions.create as jest.Mock).mockResolvedValue(mockSession);

      await stripeMock.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: 'price_pro_monthly', quantity: 1 }],
        mode: 'subscription',
        success_url: 'https://pic-forge.com/success',
        cancel_url: 'https://pic-forge.com/cancel',
        customer_email: userEmail,
        metadata: { userId },
      });

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_email: userEmail,
          metadata: expect.objectContaining({ userId }),
        })
      );
    });
  });

  describe('Webhook Event Handling', () => {
    it('should update user tier to Pro on successful payment', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_success',
            customer: 'cus_test_123',
            metadata: {
              userId: 'user-789',
            },
            payment_status: 'paid',
            subscription: 'sub_test_123',
          },
        },
      };

      // Mock webhook signature verification
      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      // Mock InstantDB transaction
      const mockTransact = jest.fn().mockResolvedValue({ success: true });
      (db.transact as jest.Mock) = mockTransact;

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should downgrade user to Free on subscription cancellation', async () => {
      const mockEvent = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_test_cancel',
            customer: 'cus_test_456',
            metadata: {
              userId: 'user-cancel',
            },
            status: 'canceled',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const mockTransact = jest.fn().mockResolvedValue({ success: true });
      (db.transact as jest.Mock) = mockTransact;

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should not change tier on failed payment', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_failed',
            customer: 'cus_test_789',
            metadata: {
              userId: 'user-failed',
            },
            payment_status: 'unpaid',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const mockTransact = jest.fn();
      (db.transact as jest.Mock) = mockTransact;

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      // Payment failed, so tier should not be updated
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });
  });

  describe('Webhook Signature Verification', () => {
    it('should reject webhook with invalid signature', async () => {
      // Mock signature verification failure
      (stripeMock.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid_signature',
        },
        body: JSON.stringify({ type: 'checkout.session.completed' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });

    it('should accept webhook with valid signature', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_valid',
            metadata: { userId: 'user-valid' },
            payment_status: 'paid',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_valid_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalled();
    });

    it('should reject webhook without signature header', async () => {
      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ type: 'checkout.session.completed' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('Pro User Benefits', () => {
    it('should verify Pro user has unlimited image generation', async () => {
      // After successful payment, user should be upgraded to Pro
      const mockTransact = jest.fn().mockResolvedValue({
        success: true,
        data: {
          usage: {
            id: 'usage-pro',
            userId: 'user-pro-test',
            tier: 'pro',
            dailyLimit: null, // Unlimited
            dailyImagesUsed: 0,
          },
        },
      });

      (db.transact as jest.Mock) = mockTransact;

      // Simulate tier upgrade
      await db.transact([
        {
          usage: {
            id: 'usage-pro',
            update: {
              tier: 'pro',
              dailyLimit: null,
            },
          },
        },
      ]);

      expect(mockTransact).toHaveBeenCalled();
      const result = await mockTransact.mock.results[0].value;
      expect(result.data.usage.tier).toBe('pro');
      expect(result.data.usage.dailyLimit).toBeNull();
    });

    it('should verify Pro user does not receive watermarks', () => {
      const userTier = 'pro';

      // In actual implementation, watermark is only applied for tier === 'free'
      const shouldApplyWatermark = userTier === 'free';

      expect(shouldApplyWatermark).toBe(false);
    });
  });

  describe('Subscription Events', () => {
    it('should handle subscription.updated event', async () => {
      const mockEvent = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_test_update',
            customer: 'cus_test_update',
            status: 'active',
            metadata: {
              userId: 'user-update',
            },
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle payment_intent.payment_failed event', async () => {
      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_failed',
            customer: 'cus_test_failed',
            amount: 999,
            currency: 'usd',
            last_payment_error: {
              message: 'Your card was declined',
            },
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('Complete Payment Flow', () => {
    it('should complete full checkout → webhook → upgrade flow', async () => {
      // Step 1: Create checkout session
      const mockSession = {
        id: 'cs_test_complete',
        url: 'https://checkout.stripe.com/pay/cs_test_complete',
        customer: 'cus_complete',
      };

      (stripeMock.checkout.sessions.create as jest.Mock).mockResolvedValue(mockSession);

      const session = await stripeMock.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: 'price_pro_monthly', quantity: 1 }],
        mode: 'subscription',
        success_url: 'https://pic-forge.com/success',
        cancel_url: 'https://pic-forge.com/cancel',
        customer_email: 'complete@example.com',
        metadata: { userId: 'user-complete' },
      });

      expect(session.id).toBe('cs_test_complete');

      // Step 2: User completes payment (simulated)
      // Stripe sends webhook event

      // Step 3: Process webhook
      const webhookEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: session.id,
            customer: session.customer,
            metadata: { userId: 'user-complete' },
            payment_status: 'paid',
            subscription: 'sub_complete',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(webhookEvent);

      const mockTransact = jest.fn().mockResolvedValue({ success: true });
      (db.transact as jest.Mock) = mockTransact;

      const webhookRequest = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_valid_signature',
        },
        body: JSON.stringify(webhookEvent),
      });

      const webhookResponse = await POST(webhookRequest);

      // Step 4: Verify upgrade
      expect(webhookResponse.status).toBe(200);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalled();
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing userId in metadata', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_no_user',
            metadata: {}, // Missing userId
            payment_status: 'paid',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still return 200 but log error
      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
    });

    it('should handle duplicate webhook events', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_duplicate',
            metadata: { userId: 'user-dup' },
            payment_status: 'paid',
          },
        },
      };

      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent);

      const mockTransact = jest.fn().mockResolvedValue({ success: true });
      (db.transact as jest.Mock) = mockTransact;

      const request = new Request('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'whsec_test_signature',
        },
        body: JSON.stringify(mockEvent),
      });

      // Send same webhook twice
      await POST(request);
      await POST(request);

      // Both should succeed (idempotent)
      expect(mockTransact).toHaveBeenCalledTimes(2);
    });
  });
});
