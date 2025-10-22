'use client';

import { useState } from 'react';
import { Share2, Copy, Check, X, Twitter, Facebook, MessageCircle, Gift } from 'lucide-react';

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
  onShare: () => void;
  onClose: () => void;
}

export default function RouletteShareModal({
  result,
  stats,
  spinId,
  onShare,
  onClose
}: RouletteShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareText = `🎰 Transform Roulette landed on ${result.category}!\n\n"${result.prompt}"\n\n🔥 ${stats.totalSpins} total spins | ${stats.currentStreak} day streak!\n\nTry your luck at pic-forge.com/roulette`;

  const shareUrl = 'https://pic-forge.com/roulette';

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      action: () => {
        const tweetText = encodeURIComponent(`🎰 Transform Roulette: "${result.prompt}"\n\n🔥 ${stats.currentStreak} day streak!\n\nTry it yourself:`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        handleShare('twitter');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        handleShare('facebook');
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        const whatsappText = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
        handleShare('whatsapp');
      }
    },
    {
      id: 'copy',
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        handleShare('copy');
      }
    }
  ];

  const handleShare = (platform: string) => {
    setSelectedPlatform(platform);
    onShare();

    // Show success message
    setTimeout(() => {
      setSelectedPlatform(null);
    }, 2000);
  };

  const useNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transform Roulette Result',
          text: shareText,
          url: shareUrl
        });
        onShare();
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Share2 className="w-6 h-6" />
              Share Your Spin
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reward Callout */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
            <div className="bg-yellow-400 rounded-full p-2">
              <Gift className="w-5 h-5 text-yellow-900" />
            </div>
            <div>
              <div className="font-bold">Earn Bonus Images!</div>
              <div className="text-sm text-purple-100">Share to unlock +2 bonus images</div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={result.transformedImage}
                  alt="Result preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 mb-1">{result.category}</div>
                <div className="text-sm text-gray-600 line-clamp-2">&quot;{result.prompt}&quot;</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🔥 {stats.currentStreak} day streak</span>
              <span>•</span>
              <span>🎯 {stats.totalSpins} total spins</span>
            </div>
          </div>

          {/* Share Platforms */}
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.id;

              return (
                <button
                  key={platform.id}
                  onClick={platform.action}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all ${platform.color} ${
                    isSelected ? 'ring-4 ring-green-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {platform.name}
                </button>
              );
            })}
          </div>

          {/* Native Share (mobile) */}
          {navigator.share && (
            <button
              onClick={useNativeShare}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share via...
            </button>
          )}
        </div>

        {/* Benefits */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-teal-50">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Help friends discover Transform Roulette</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              <span>Earn bonus images by sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Compete on the leaderboard</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {selectedPlatform && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="font-bold">+2 bonus images earned!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
