/**
 * PicForge Watermark System
 *
 * Adds "Pic-Forge.com" dual watermarks (top-right and bottom-left) to images for Free tier users.
 * Uses HTML5 Canvas API for client-side watermarking.
 * Dual placement prevents easy cropping.
 *
 * @module watermark
 */

export interface WatermarkOptions {
  /**
   * Text to display as watermark
   * @default "Pic-Forge.com"
   */
  text?: string;

  /**
   * Opacity of the watermark (0-1)
   * @default 0.4
   */
  opacity?: number;

  /**
   * Position of the watermark
   * @default "bottom-right"
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

  /**
   * Font size as percentage of image height
   * @default 0.05 (5% of image height)
   */
  fontSize?: number;

  /**
   * Padding from edges in pixels
   * @default 20
   */
  padding?: number;

  /**
   * Font family for watermark text
   * @default "Arial, sans-serif"
   */
  fontFamily?: string;

  /**
   * Text color
   * @default "white"
   */
  textColor?: string;

  /**
   * Shadow color for better visibility
   * @default "rgba(0, 0, 0, 0.8)"
   */
  shadowColor?: string;

  /**
   * Shadow blur radius
   * @default 8
   */
  shadowBlur?: number;
}

/**
 * Default watermark options
 */
const DEFAULT_OPTIONS: Required<WatermarkOptions> = {
  text: 'Pic-Forge.com',
  opacity: 0.4,
  position: 'bottom-right',
  fontSize: 0.05,
  padding: 20,
  fontFamily: 'Arial, sans-serif',
  textColor: 'white',
  shadowColor: 'rgba(0, 0, 0, 0.8)',
  shadowBlur: 8,
};

/**
 * Loads an image from a data URL or image URL
 *
 * @param imageUrl - Data URL or image URL
 * @returns Promise that resolves with the loaded Image element
 */
function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Enable CORS for external images
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${error}`));

    img.src = imageUrl;
  });
}

/**
 * Calculates the position coordinates for the watermark
 *
 * @param canvas - Canvas element
 * @param textWidth - Width of the watermark text
 * @param fontSize - Font size
 * @param padding - Padding from edges
 * @param position - Desired position
 * @returns Coordinates {x, y}
 */
function calculatePosition(
  canvas: HTMLCanvasElement,
  textWidth: number,
  fontSize: number,
  padding: number,
  position: WatermarkOptions['position']
): { x: number; y: number } {
  const { width, height } = canvas;

  switch (position) {
    case 'bottom-right':
      return {
        x: width - textWidth - padding,
        y: height - padding,
      };

    case 'bottom-left':
      return {
        x: padding,
        y: height - padding,
      };

    case 'top-right':
      return {
        x: width - textWidth - padding,
        y: fontSize + padding,
      };

    case 'top-left':
      return {
        x: padding,
        y: fontSize + padding,
      };

    case 'center':
      return {
        x: (width - textWidth) / 2,
        y: height / 2,
      };

    default:
      return {
        x: width - textWidth - padding,
        y: height - padding,
      };
  }
}

/**
 * Adds a watermark to an image
 *
 * @param imageDataUrl - Data URL or image URL of the source image
 * @param options - Watermark options (optional)
 * @returns Promise that resolves with a new data URL containing the watermarked image
 *
 * @example
 * ```typescript
 * // Basic usage with default options
 * const watermarked = await addWatermark(imageDataUrl);
 *
 * // Custom opacity
 * const watermarked = await addWatermark(imageDataUrl, { opacity: 0.3 });
 *
 * // Custom text and position
 * const watermarked = await addWatermark(imageDataUrl, {
 *   text: 'Custom Watermark',
 *   position: 'top-right',
 *   opacity: 0.5
 * });
 * ```
 */
export async function addWatermark(
  imageDataUrl: string,
  options: WatermarkOptions = {}
): Promise<string> {
  // Merge options with defaults
  const config: Required<WatermarkOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  try {
    // Load the image
    const img = await loadImage(imageDataUrl);

    // Create canvas with same dimensions as image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    // Calculate font size based on image height
    const fontSize = Math.max(16, Math.floor(img.height * config.fontSize));

    // Configure text style
    ctx.font = `bold ${fontSize}px ${config.fontFamily}`;
    ctx.fillStyle = config.textColor;
    ctx.globalAlpha = config.opacity;

    // Add shadow for better visibility
    ctx.shadowColor = config.shadowColor;
    ctx.shadowBlur = config.shadowBlur;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Measure text width
    const textMetrics = ctx.measureText(config.text);
    const textWidth = textMetrics.width;

    // Add dual watermarks to prevent easy cropping
    // Top-right watermark
    const topRight = calculatePosition(
      canvas,
      textWidth,
      fontSize,
      config.padding,
      'top-right'
    );
    ctx.fillText(config.text, topRight.x, topRight.y);

    // Bottom-left watermark
    const bottomLeft = calculatePosition(
      canvas,
      textWidth,
      fontSize,
      config.padding,
      'bottom-left'
    );
    ctx.fillText(config.text, bottomLeft.x, bottomLeft.y);

    // Convert canvas to data URL
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw error;
  }
}

/**
 * Adds watermark to an image if the user is on the Free tier
 *
 * @param imageDataUrl - Data URL or image URL of the source image
 * @param tier - User's subscription tier
 * @param options - Watermark options (optional)
 * @returns Promise that resolves with the image data URL (watermarked if free tier, original otherwise)
 *
 * @example
 * ```typescript
 * import { addWatermarkIfFree } from '@/lib/watermark';
 * import { useImageTracking } from '@/hooks/useImageTracking';
 *
 * const { usage } = useImageTracking();
 * const imageToDownload = await addWatermarkIfFree(
 *   transformedImageUrl,
 *   usage?.tier
 * );
 * ```
 */
export async function addWatermarkIfFree(
  imageDataUrl: string,
  tier: 'free' | 'pro' | 'unlimited' | undefined,
  options: WatermarkOptions = {}
): Promise<string> {
  // Only add watermark for free tier users
  if (tier === 'free') {
    return addWatermark(imageDataUrl, options);
  }

  // Return original image for pro/unlimited users
  return imageDataUrl;
}

/**
 * Batch watermark multiple images
 *
 * @param imageDataUrls - Array of data URLs or image URLs
 * @param options - Watermark options (optional)
 * @returns Promise that resolves with array of watermarked data URLs
 *
 * @example
 * ```typescript
 * const watermarkedImages = await addWatermarkBatch([img1, img2, img3], {
 *   opacity: 0.3
 * });
 * ```
 */
export async function addWatermarkBatch(
  imageDataUrls: string[],
  options: WatermarkOptions = {}
): Promise<string[]> {
  return Promise.all(
    imageDataUrls.map(url => addWatermark(url, options))
  );
}

/**
 * Adds watermark to batch of images if the user is on the Free tier
 *
 * @param imageDataUrls - Array of data URLs or image URLs
 * @param tier - User's subscription tier
 * @param options - Watermark options (optional)
 * @returns Promise that resolves with array of data URLs (watermarked if free tier, original otherwise)
 */
export async function addWatermarkBatchIfFree(
  imageDataUrls: string[],
  tier: 'free' | 'pro' | 'unlimited' | undefined,
  options: WatermarkOptions = {}
): Promise<string[]> {
  if (tier === 'free') {
    return addWatermarkBatch(imageDataUrls, options);
  }

  return imageDataUrls;
}

/**
 * Downloads an image with optional watermark based on user tier
 *
 * @param imageDataUrl - Data URL or image URL
 * @param filename - Filename for the download
 * @param tier - User's subscription tier
 * @param options - Watermark options (optional)
 *
 * @example
 * ```typescript
 * import { downloadImageWithWatermark } from '@/lib/watermark';
 *
 * await downloadImageWithWatermark(
 *   transformedImageUrl,
 *   'edited-image.png',
 *   usage?.tier
 * );
 * ```
 */
export async function downloadImageWithWatermark(
  imageDataUrl: string,
  filename: string,
  tier: 'free' | 'pro' | 'unlimited' | undefined,
  options: WatermarkOptions = {}
): Promise<void> {
  try {
    // Add watermark if free tier
    const finalImage = await addWatermarkIfFree(imageDataUrl, tier, options);

    // Create download link
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image with watermark:', error);
    throw error;
  }
}

/**
 * Converts a Blob to data URL
 * Utility function for working with different image formats
 *
 * @param blob - Blob to convert
 * @returns Promise that resolves with data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a data URL to Blob
 * Utility function for working with different image formats
 *
 * @param dataUrl - Data URL to convert
 * @returns Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
