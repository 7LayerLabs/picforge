'use client';

import { Sparkles } from 'lucide-react';

interface CombinationPreset {
  name: string;
  effects: string;
  description: string;
  icon: string;
  color: string;
}

const POPULAR_COMBINATIONS: CombinationPreset[] = [
  {
    name: 'Vintage Photo',
    effects: 'sepia grain vignette',
    description: 'Classic old-school film look',
    icon: '📷',
    color: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  },
  {
    name: 'Modern Portrait',
    effects: 'warm sharpen saturation',
    description: 'Professional photo enhancement',
    icon: '✨',
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200'
  },
  {
    name: 'Moody Aesthetic',
    effects: 'cool vignette grain',
    description: 'Dark and atmospheric vibe',
    icon: '🌙',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  },
  {
    name: 'Retro VHS',
    effects: 'glitch grain warm',
    description: '80s throwback style',
    icon: '📼',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  },
  {
    name: 'Artistic Sketch',
    effects: 'sketch sharpen contrast',
    description: 'Hand-drawn illustration effect',
    icon: '✏️',
    color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  },
  {
    name: 'Instagram Ready',
    effects: 'warm saturation sharpen',
    description: 'Social media perfect',
    icon: '📱',
    color: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
  }
];

interface PopularCombinationsProps {
  onSelectCombination: (effects: string) => void;
}

export default function PopularCombinations({ onSelectCombination }: PopularCombinationsProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-purple-900 text-lg">Popular Effect Combinations</h3>
      </div>
      <p className="text-sm text-purple-700 mb-4">
        Not sure where to start? Try these proven effect combinations with one click!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {POPULAR_COMBINATIONS.map((combo) => (
          <button
            key={combo.name}
            onClick={() => onSelectCombination(combo.effects)}
            className={`${combo.color} rounded-lg p-4 text-left transition-all transform hover:scale-105 hover:shadow-md`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{combo.icon}</span>
              <span className="font-bold text-sm">{combo.name}</span>
            </div>
            <p className="text-xs mb-2 opacity-80">{combo.description}</p>
            <div className="text-xs font-mono bg-white bg-opacity-50 rounded px-2 py-1">
              {combo.effects}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
