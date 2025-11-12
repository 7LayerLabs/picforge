'use client';

import { useState } from 'react';
import { Copy, Check, Share2, Twitter, Mail, MessageCircle } from 'lucide-react';

interface ReferralShareButtonProps {
  referralLink: string;
  referralCode: string;
  variant?: 'default' | 'compact';
}

export default function ReferralShareButton({
  referralLink,
  referralCode,
  variant = 'default'
}: ReferralShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = `Hey! I'm using PicForge to transform images with AI. Sign up with my referral code ${referralCode} and we both get 10 FREE bonus images! ${referralLink}`;

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const subject = 'Join me on PicForge - Get 10 FREE Images!';
    const body = `Hey!\n\nI've been using PicForge to transform images with AI and it's amazing.\n\nSign up with my referral code and we BOTH get 10 FREE bonus images!\n\nReferral Code: ${referralCode}\nLink: ${referralLink}\n\nLet me know what you create!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-2 bg-teal-500 text-black rounded-lg font-bold hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
        <button
          onClick={handleTwitterShare}
          className="px-4 py-2 bg-gray-900 text-teal-500 rounded-lg hover:bg-gray-800 transition-all"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        className="w-full px-6 py-4 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            Link Copied!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Copy Referral Link
          </>
        )}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </button>

      {/* Share Options */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleTwitterShare}
          className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all flex flex-col items-center gap-2 group"
        >
          <Twitter className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
          <span className="font-body text-xs">Twitter</span>
        </button>

        <button
          onClick={handleEmailShare}
          className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all flex flex-col items-center gap-2 group"
        >
          <Mail className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
          <span className="font-body text-xs">Email</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all flex flex-col items-center gap-2 group"
        >
          <MessageCircle className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
          <span className="font-body text-xs">WhatsApp</span>
        </button>
      </div>

      {/* Share Tip */}
      <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-xl">
        <Share2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-body font-semibold text-teal-500 text-sm mb-1">Pro Tip:</h4>
          <p className="font-body text-white text-xs">
            The more friends you invite, the more bonus images you earn. Each friend gives you 10 free images!
          </p>
        </div>
      </div>
    </div>
  );
}
