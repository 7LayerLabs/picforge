import { NextRequest, NextResponse } from 'next/server';
import { init } from '@instantdb/admin';
import { logger } from '@/lib/logger';

// Initialize InstantDB Admin SDK
const db = init({
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
    adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

// Admin email - only this user can be upgraded via this endpoint
const ADMIN_EMAIL = 'derek.bobola@gmail.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, tier } = body;

        // Security check - only allow upgrading the admin
        if (email !== ADMIN_EMAIL) {
            return NextResponse.json(
                { error: 'Unauthorized - only admin can use this endpoint' },
                { status: 401 }
            );
        }

        if (!tier) {
            return NextResponse.json(
                { error: 'Missing tier' },
                { status: 400 }
            );
        }

        // Check if admin token is configured
        if (!process.env.INSTANT_ADMIN_TOKEN) {
            return NextResponse.json(
                { error: 'INSTANT_ADMIN_TOKEN not configured. Add it to Vercel env vars.' },
                { status: 500 }
            );
        }

        // Query for the user by email
        const { users } = await db.query({ users: {} });
        const user = users?.find((u: any) => u.email === email);

        if (!user) {
            return NextResponse.json(
                { error: `User with email ${email} not found` },
                { status: 404 }
            );
        }

        // Query for the user's usage record
        const { usage } = await db.query({
            usage: {}
        });

        const userUsage = usage?.find((u: any) => u.userId === user.id);

        if (!userUsage) {
            // Create new usage record with the tier
            const { id } = await import('@instantdb/admin');
            const usageId = id();

            await db.transact([
                db.tx.usage[usageId].update({
                    userId: user.id,
                    tier: tier,
                    count: 0,
                    monthlyCount: 0,
                    lastReset: Date.now(),
                    lastMonthlyReset: Date.now(),
                })
            ]);

            logger.info(`Created usage record for ${email} with tier: ${tier}`);
        } else {
            // Update existing usage record
            await db.transact([
                db.tx.usage[userUsage.id].update({
                    tier: tier,
                })
            ]);

            logger.info(`Updated ${email} to tier: ${tier}`);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully upgraded ${email} to ${tier} tier!`,
            userId: user.id,
            tier: tier,
        });

    } catch (error) {
        logger.error('Error upgrading user:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upgrade user' },
            { status: 500 }
        );
    }
}
