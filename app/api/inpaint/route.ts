import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv';
import { requireEnvVar } from '@/lib/validateEnv';
import { Errors, handleApiError } from '@/lib/apiErrors';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 25 requests per day per IP (Replicate costs ~$0.023/image!)
    const identifier = getClientIdentifier(request);
    const rateLimit = await checkRateLimitKv(identifier, 25, 24 * 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Inpainting limit exceeded. Please try again later.',
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      );
    }

    // Validate required environment variables
    const replicateToken = requireEnvVar('REPLICATE_API_TOKEN', 'Replicate inpainting');

    // Initialize Replicate client with validated token
    const replicate = new Replicate({
      auth: replicateToken,
    });

    const { image, mask, prompt } = await request.json();

    if (!image || !mask || !prompt) {
      throw Errors.missingParameter('image, mask, or prompt');
    }

    console.log('Starting inpainting with Replicate...');
    console.log('Prompt:', prompt);

    // Use Kandinsky 2.2 Inpainting model (better quality and mask handling)
    const output = await replicate.run(
      "ai-forever/kandinsky-2.2:ad9d7879fbffa2874e1d909d1d37d9bc682889cc65b31f7bb00d2362619f194a",
      {
        input: {
          image: image,
          mask: mask,
          prompt: prompt,
          num_outputs: 1,
          num_inference_steps: 75,
          guidance_scale: 9,
          scheduler: "p_sampler",
        },
      }
    ) as string[];

    if (!output || output.length === 0) {
      throw new Error('No output from Replicate');
    }

    const resultUrl = Array.isArray(output) ? output[0] : output;

    console.log('Inpainting successful!');

    return NextResponse.json({
      success: true,
      resultUrl: resultUrl,
    });
  } catch (error: unknown) {
    console.error('Inpainting error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Check if it's a payment/credit issue
    if (errorMessage.includes('402') || errorMessage.includes('Insufficient credit')) {
      return NextResponse.json(
        {
          error: 'Replicate API credits depleted',
          details: 'The selective editor requires Replicate API credits. Please contact support or try again later.',
        },
        { status: 402 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process inpainting',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
