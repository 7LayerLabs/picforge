'use client';

import { useState } from 'react';
import { X, Share2, Copy, CheckCircle, Twitter, Facebook, Download, Sparkles } from 'lucide-react';

interface RouletteShareModalProps {
  result: {
    category: string;
    prompt: string;
    transformedImage: string;
  };
  stats: {
    totalSpins: number;
    currentStreak: number;
  };
  spinId?: string;
  onShare?: (spinId: string) => void;
  onClose: () => void;
}

export default function RouletteShareModal({
  result,
  stats,
  spinId,
  onShare,
  onClose,
}: RouletteShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/roulette' : 'pic-forge.com/roulette';

  const getShareText = (platform: 'default' | 'twitter' | 'facebook') => {
    const baseText = `🎲 Transform Roulette landed on ${result.category}!\n\n"${result.prompt}"\n\n`;
    const statsText = stats.currentStreak >= 3
      ? `🔥 ${stats.currentStreak} day streak! ${stats.totalSpins} total spins!\n\n`
      : `${stats.totalSpins} total spins!\n\n`;

    if (platform === 'twitter') {
      return `${baseText}${statsText}Try it: ${shareUrl} #PicForge #AIArt`;
    }

    if (platform === 'facebook') {
      return `${baseText}${statsText}Let chaos decide your image's destiny at ${shareUrl}`;
    }

    return `${baseText}${statsText}Try your luck at ${shareUrl}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText('default'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track share
      if (spinId && onShare) {
        onShare(spinId);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transform Roulette Result',
          text: getShareText('default'),
          url: shareUrl,
        });

        // Track share
        if (spinId && onShare) {
          onShare(spinId);
        }
      } catch (err) {
        // User cancelled or error
        console.error('Share failed:', err);
      }
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const text = getShareText(platform);
    let url = '';

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
    }

    window.open(url, '_blank', 'width=600,height=400');

    // Track share
    if (spinId && onShare) {
      onShare(spinId);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create canvas with result and branding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (Instagram square format)
      canvas.width = 1080;
      canvas.height = 1080;

      // Load transformed image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = result.transformedImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image (centered, maintain aspect ratio)
      const imgAspect = img.width / img.height;
      const maxSize = 900;
      let drawWidth, drawHeight;

      if (imgAspect > 1) {
        drawWidth = maxSize;
        drawHeight = maxSize / imgAspect;
      } else {
        drawHeight = maxSize;
        drawWidth = maxSize * imgAspect;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = 90; // Leave room for header

      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      // Add branding overlay at top
      ctx.fillStyle = 'rgba(139, 92, 246, 0.95)';
      ctx.fillRect(0, 0, canvas.width, 80);

      // Add text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎲 Transform Roulette', canvas.width / 2, 55);

      // Add bottom overlay
      const bottomY = y + drawHeight;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, bottomY, canvas.width, canvas.height - bottomY);

      // Add category and prompt
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(result.category, canvas.width / 2, bottomY + 45);

      ctx.font = '24px Arial';
      ctx.fillStyle = '#e0e0e0';
      // Wrap prompt text if too long
      const promptText = `"${result.prompt}"`;
      const maxWidth = canvas.width - 80;
      const words = promptText.split(' ');
      let line = '';
      let lineY = bottomY + 85;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), canvas.width / 2, lineY);
          line = word + ' ';
          lineY += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), canvas.width / 2, lineY);

      // Add website URL
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#a78bfa';
      ctx.fillText('pic-forge.com/roulette', canvas.width / 2, canvas.height - 25);

      // Download canvas
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `transform-roulette-${Date.now()}.png`;
      link.click();

      // Track download (implicit share)
      if (spinId && onShare) {
        onShare(spinId);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to create shareable image. Try the regular download instead.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Share2 className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Share This Chaos!</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-purple-100 text-sm">
            Show off your transformation and challenge your friends!
          </p>
        </div>

        {/* Preview */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <img
              src={result.transformedImage}
              alt="Transformed result"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-600">{result.category}</span>
              </div>
              <p className="text-gray-700 text-sm italic">&quot;{result.prompt}&quot;</p>
              {stats.currentStreak >= 3 && (
                <div className="mt-2 inline-flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
                  <span className="text-orange-600 text-xs font-semibold">
                    🔥 {stats.currentStreak} Day Streak!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Share Text Preview */}
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {getShareText('default')}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
              >
                <Share2 className="w-5 h-5" />
                Share Now
              </button>
            )}

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Share Text
                </>
              )}
            </button>

            {/* Download Branded Image */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Branded Image
                </>
              )}
            </button>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-xl font-semibold hover:bg-[#1a8cd8] transition-all"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-xl font-semibold hover:bg-[#0d65d9] transition-all"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <p className="text-center text-xs text-gray-600">
            Earn bonus images by sharing! Every share helps grow the PicForge community.
          </p>
        </div>
      </div>
    </div>
  );
}
