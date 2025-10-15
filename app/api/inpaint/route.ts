import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const { image, mask, prompt } = await request.json();

    if (!image || !mask || !prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters: image, mask, or prompt' },
        { status: 400 }
      );
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
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
