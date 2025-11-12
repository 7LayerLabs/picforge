'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface ProgressiveRevealProps {
  category: string;
  prompt: string;
  isRare?: boolean;
  onComplete: () => void;
}

export default function ProgressiveReveal({
  category,
  prompt,
  isRare = false,
  onComplete,
}: ProgressiveRevealProps) {
  const [stage, setStage] = useState<'teasing' | 'revealing' | 'complete'>('teasing');
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Stage progression
    const teasingTimer = setTimeout(() => {
      setStage('revealing');
    }, 2000);

    const revealingTimer = setTimeout(() => {
      setStage('complete');
      setTimeout(onComplete, 500);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(teasingTimer);
      clearTimeout(revealingTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="max-w-lg w-full mx-4">
        {/* Teasing Stage */}
        {stage === 'teasing' && (
          <div className="text-center animate-pulse">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 shadow-2xl animate-bounce">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Transformation Incoming{dots}
            </h2>
            <p className="text-xl text-purple-200">
              The wheel of fate is spinning...
            </p>
          </div>
        )}

        {/* Revealing Stage */}
        {stage === 'revealing' && (
          <div className="text-center">
            {/* Rare badge */}
            {isRare && (
              <div className="mb-6 animate-bounce">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full shadow-2xl border-4 border-yellow-300">
                  <Zap className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-xl">RARE TRANSFORMATION!</span>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="text-yellow-300 text-sm mt-2 font-semibold">
                  1 in 20 chance! You lucky spinner!
                </p>
              </div>
            )}

            {/* Category reveal */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl border-4 border-white/20 transform scale-110 transition-transform">
              <div className="text-6xl mb-4 animate-pulse">🎲</div>
              <div className="text-3xl font-bold text-white mb-4">
                {category}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-white text-lg font-semibold italic">
                  &quot;{prompt}&quot;
                </p>
              </div>
            </div>

            {/* Loading indicator */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-white text-lg mt-4 font-semibold">
              Applying transformation magic...
            </p>
          </div>
        )}

        {/* Complete Stage */}
        {stage === 'complete' && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Transformation Complete!
            </h2>
            <p className="text-xl text-purple-200">
              Prepare to be amazed...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
