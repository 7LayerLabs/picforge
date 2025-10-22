import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv';
import { requireEnvVar } from '@/lib/validateEnv';
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 25 requests per day per IP (Replicate costs ~$0.023/image!)
    const identifier = getClientIdentifier(request);
    const rateLimit = await checkRateLimitKv(identifier, 25, 24 * 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
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
    return handleApiError(error, {
      route: '/api/inpaint',
      method: 'POST',
    });
  }
}
