'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface JackpotCelebrationProps {
  prompt: string;
  bonusImages: number;
  onClose: () => void;
}

export default function JackpotCelebration({
  prompt,
  bonusImages,
  onClose
}: JackpotCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Generate random confetti
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#fbbf24', '#f59e0b', '#fde047', '#a855f7', '#ec4899'][Math.floor(Math.random() * 5)]
    }));
    setConfettiPieces(pieces);

    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }}
    >
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-2 h-2 rounded-full animate-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div
        className={`relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
          isVisible ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
          className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Jackpot Badge */}
        <div className="text-center mb-6">
          <div className="inline-block animate-bounce">
            <div className="text-8xl mb-4">💎</div>
          </div>
          <div className="text-5xl font-black text-white mb-2 animate-pulse tracking-wider">
            JACKPOT!
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
            <span className="text-xl font-bold text-yellow-200">RARE TRANSFORMATION</span>
            <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
          </div>
        </div>

        {/* Prompt Display */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border-2 border-white/40">
          <p className="text-white font-bold text-center text-lg leading-relaxed">
            &quot;{prompt}&quot;
          </p>
        </div>

        {/* Bonus Reward */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-black text-yellow-900 mb-1">
            +{bonusImages} BONUS IMAGES
          </div>
          <div className="text-sm text-yellow-800 font-semibold">
            Added to your account!
          </div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute -top-2 -left-2">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Celebration Message */}
        <div className="text-center mt-6 text-white text-sm">
          Only 5% chance to land a rare transformation!
          <br />
          You got lucky! 🍀
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
