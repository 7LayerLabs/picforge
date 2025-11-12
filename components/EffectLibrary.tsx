'use client';

import { useState } from 'react';
import EffectTooltip from './EffectTooltip';
import { Palette, Zap, Camera, Sparkles } from 'lucide-react';

interface EffectCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  effects: Array<{
    effect: string;
    icon: string;
    description: string;
    example: string;
  }>;
}

const EFFECT_CATEGORIES: EffectCategory[] = [
  {
    name: 'Color Adjustments',
    icon: <Palette className="w-4 h-4" />,
    color: 'bg-pink-100 border-pink-300 text-pink-900',
    effects: [
      { effect: 'grayscale', icon: '🎨', description: 'Converts image to black and white', example: 'grayscale contrast' },
      { effect: 'invert', icon: '🔄', description: 'Reverses all colors (negative effect)', example: 'invert blur' },
      { effect: 'sepia', icon: '📜', description: 'Vintage brown-toned filter', example: 'sepia grain vignette' },
      { effect: 'red', icon: '🟥', description: 'Boosts red channel, reduces others', example: 'red dark' },
      { effect: 'blue', icon: '🟦', description: 'Boosts blue channel, reduces others', example: 'blue dark' },
      { effect: 'green', icon: '🟩', description: 'Boosts green channel, reduces others', example: 'green bright' },
      { effect: 'warm', icon: '🔥', description: 'Adds warm orange/yellow tones', example: 'warm vignette' },
      { effect: 'cool', icon: '❄️', description: 'Adds cool blue tones', example: 'cool grain' },
      { effect: 'saturation', icon: '🎨', description: 'Boosts color intensity', example: 'saturation sharpen' }
    ]
  },
  {
    name: 'Enhancement',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    effects: [
      { effect: 'sharpen', icon: '✨', description: 'Enhances edges and details', example: 'sharpen enhance' },
      { effect: 'enhance', icon: '⚙️', description: 'Auto-adjusts levels and contrast', example: 'enhance sharpen' },
      { effect: 'contrast', icon: '⚡', description: 'Boosts difference between lights/darks', example: 'grayscale contrast' },
      { effect: 'bright', icon: '☀️', description: 'Increases brightness by 50%', example: 'bright contrast' },
      { effect: 'dark', icon: '🌙', description: 'Reduces brightness by 50%', example: 'dark vignette' }
    ]
  },
  {
    name: 'Artistic Effects',
    icon: <Camera className="w-4 h-4" />,
    color: 'bg-purple-100 border-purple-300 text-purple-900',
    effects: [
      { effect: 'vignette', icon: '📷', description: 'Darkens corners for focus', example: 'warm vignette' },
      { effect: 'grain', icon: '🎞️', description: 'Adds film grain texture', example: 'sepia grain' },
      { effect: 'blur', icon: '💫', description: 'Softens image with gaussian blur', example: 'blur bright' },
      { effect: 'sketch', icon: '✏️', description: 'Pencil drawing effect', example: 'sketch sharpen' },
      { effect: 'glitch', icon: '📺', description: 'VHS distortion effect', example: 'glitch grain' },
      { effect: 'pixelate', icon: '🎮', description: '8-bit retro pixel effect', example: 'pixelate' }
    ]
  },
  {
    name: 'Utilities',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'bg-teal-100 border-teal-300 text-teal-900',
    effects: [
      { effect: 'resize', icon: '📐', description: 'Optimizes to max 1920px width', example: 'resize enhance' }
    ]
  }
];

interface EffectLibraryProps {
  onEffectClick?: (effect: string) => void;
}

export default function EffectLibrary({ onEffectClick }: EffectLibraryProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Color Adjustments');

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="bg-purple-50 rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-purple-900 mb-3 text-lg">
        ✨ 21 Available Effects - Organized by Category
      </h3>
      <p className="text-sm text-purple-700 mb-4">
        Click any effect to add it to your prompt. Hover for details and examples!
      </p>

      <div className="space-y-3">
        {EFFECT_CATEGORIES.map((category) => (
          <div key={category.name} className="bg-white rounded-lg border-2 overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className={`w-full flex items-center justify-between p-4 transition-colors ${category.color}`}
            >
              <div className="flex items-center gap-3">
                {category.icon}
                <span className="font-bold text-sm">{category.name}</span>
                <span className="text-xs opacity-75">({category.effects.length} effects)</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedCategory === category.name && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {category.effects.map((effect) => (
                    <div
                      key={effect.effect}
                      onClick={() => onEffectClick?.(effect.effect)}
                      className="cursor-pointer"
                    >
                      <EffectTooltip
                        effect={effect.effect}
                        icon={effect.icon}
                        description={effect.description}
                        example={effect.example}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
        <p className="text-xs text-purple-700 font-semibold mb-1">💡 Pro Tips:</p>
        <ul className="text-xs text-purple-600 space-y-1 pl-4">
          <li>• Click effects to add them to your prompt automatically</li>
          <li>• Combine effects from different categories: &quot;warm sharpen vignette&quot;</li>
          <li>• Order matters: &quot;grayscale contrast&quot; ≠ &quot;contrast grayscale&quot;</li>
          <li>• Start with 1-2 effects, then experiment with more!</li>
        </ul>
      </div>
    </div>
  );
}
