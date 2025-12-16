import { NextRequest, NextResponse } from 'next/server';
import { init, id } from '@instantdb/admin';
import { logger } from '@/lib/logger';

// Initialize InstantDB Admin SDK
const db = init({
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
    adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

// Admin email for security check
const ADMIN_EMAIL = 'derek.bobola@gmail.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, tier, adminEmail } = body;

        // Security check - only allow admin
        if (adminEmail !== ADMIN_EMAIL) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!code || !tier) {
            return NextResponse.json(
                { error: 'Missing code or tier' },
                { status: 400 }
            );
        }

        // Check if admin token is configured
        if (!process.env.INSTANT_ADMIN_TOKEN) {
            return NextResponse.json(
                { error: 'INSTANT_ADMIN_TOKEN not configured' },
                { status: 500 }
            );
        }

        const codeId = id();
        const upperCode = code.toUpperCase().trim();

        // Add the promo code
        await db.transact([
            db.tx.promoCodes[codeId].update({
                code: upperCode,
                tier: tier,
                isRedeemed: false,
                createdAt: Date.now(),
                createdBy: 'admin',
            })
        ]);

        logger.info(`Created promo code: ${upperCode} with tier: ${tier}`);

        return NextResponse.json({
            success: true,
            message: `Promo code ${upperCode} created with tier ${tier}`,
            codeId,
        });

    } catch (error) {
        logger.error('Error creating promo code:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create promo code' },
            { status: 500 }
        );
    }
}
