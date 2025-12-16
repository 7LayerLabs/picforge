import { NextRequest, NextResponse } from 'next/server';
import { init, id } from '@instantdb/admin';
import { logger } from '@/lib/logger';

// Admin email - only this user can be upgraded via this endpoint
const ADMIN_EMAIL = 'derek.bobola@gmail.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, tier, userId, usageId } = body;

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

        // Initialize InstantDB Admin SDK
        const db = init({
            appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
            adminToken: process.env.INSTANT_ADMIN_TOKEN!,
        });

        // If usageId is provided, update directly (fastest path)
        if (usageId) {
            await db.transact([
                db.tx.usage[usageId].update({
                    tier: tier,
                })
            ]);

            logger.info(`Updated usage ${usageId} to tier: ${tier}`);

            return NextResponse.json({
                success: true,
                message: `Successfully upgraded to ${tier} tier!`,
                tier: tier,
            });
        }

        // If userId is provided, create/update usage for that user
        if (userId) {
            const newUsageId = id();

            await db.transact([
                db.tx.usage[newUsageId].update({
                    userId: userId,
                    tier: tier,
                    count: 0,
                    monthlyCount: 0,
                    lastReset: Date.now(),
                    lastMonthlyReset: Date.now(),
                })
            ]);

            logger.info(`Created/updated usage for user ${userId} with tier: ${tier}`);

            return NextResponse.json({
                success: true,
                message: `Successfully upgraded to ${tier} tier!`,
                userId: userId,
                tier: tier,
                usageId: newUsageId,
            });
        }

        return NextResponse.json(
            { error: 'Please provide userId or usageId. Check browser console on profile page for your user ID.' },
            { status: 400 }
        );

    } catch (error) {
        logger.error('Error upgrading user:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upgrade user' },
            { status: 500 }
        );
    }
}
