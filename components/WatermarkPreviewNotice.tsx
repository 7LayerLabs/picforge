'use client';

import { useState } from 'react';
import { Info, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { shouldApplyWatermark, generateWatermarkPreview } from '@/lib/watermark';
import { logger } from '@/lib/logger';

interface WatermarkPreviewNoticeProps {
  tier: 'free' | 'pro' | 'unlimited' | undefined;
  currentImage: string | null;
  onPreviewToggle?: (showPreview: boolean) => void;
}

export default function WatermarkPreviewNotice({
  tier,
  currentImage,
  onPreviewToggle
}: WatermarkPreviewNoticeProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Don't show for Pro/Unlimited users
  if (!shouldApplyWatermark(tier)) {
    return null;
  }

  const handlePreviewToggle = async () => {
    if (!currentImage) return;

    if (!showPreview) {
      // Generate preview
      setIsGeneratingPreview(true);
      try {
        const preview = await generateWatermarkPreview(currentImage);
        setPreviewImage(preview);
        setShowPreview(true);
        onPreviewToggle?.(true);
      } catch (error) {
        logger.error('Failed to generate watermark preview:', error);
      } finally {
        setIsGeneratingPreview(false);
      }
    } else {
      // Hide preview
      setShowPreview(false);
      onPreviewToggle?.(false);
    }
  };

  return (
    <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
          <Info className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            Free Tier Watermark
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              Preview Available
            </span>
          </h3>
          <p className="text-sm text-gray-700">
            Your downloaded images will include a &quot;Pic-Forge.com&quot; watermark. Upgrade to Pro for watermark-free downloads.
          </p>
        </div>
      </div>

      {/* Preview Toggle Button */}
      {currentImage && (
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handlePreviewToggle}
            disabled={isGeneratingPreview}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              showPreview
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-white text-gray-700 border-2 border-teal-200 hover:border-teal-300 hover:bg-gray-50'
            }`}
          >
            {isGeneratingPreview ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Preview...
              </>
            ) : showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Watermark Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview Watermark Placement
              </>
            )}
          </button>

          {showPreview && previewImage && (
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Preview shows approximate placement
            </div>
          )}
        </div>
      )}

      {/* Preview Image */}
      {showPreview && previewImage && (
        <div className="mb-3 relative rounded-lg overflow-hidden border-2 border-teal-300 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Watermark preview"
            className="w-full h-auto"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            Watermark Preview
          </div>
        </div>
      )}

      {/* Watermark Details */}
      <div className="bg-white/80 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-700 font-medium mb-2">What to expect:</p>
        <ul className="text-xs text-gray-600 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-teal-500 font-bold">•</span>
            <span>Dual watermarks in top-right and bottom-left corners</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 font-bold">•</span>
            <span>Semi-transparent text reading &quot;Pic-Forge.com&quot;</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 font-bold">•</span>
            <span>Prevents easy cropping while keeping image usable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 font-bold">•</span>
            <span>No watermark on Pro or Unlimited tiers</span>
          </li>
        </ul>
      </div>

      {/* Upgrade CTA */}
      <div className="flex items-center justify-between bg-purple-600 text-white rounded-lg p-3">
        <div className="flex-1">
          <p className="text-sm font-bold mb-0.5">Want watermark-free downloads?</p>
          <p className="text-xs opacity-90">Upgrade to Pro for unlimited images without watermarks</p>
        </div>
        <Link
          href="/pricing"
          className="flex-shrink-0 px-4 py-2 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
