'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface EffectTooltipProps {
  effect: string;
  description: string;
  example?: string;
  icon: string;
}

export default function EffectTooltip({ effect, description, example, icon }: EffectTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="bg-white px-3 py-2 rounded-lg cursor-help hover:bg-gray-50 transition-colors border border-gray-200">
        <span className="text-lg mr-1">{icon}</span>
        <span className="font-semibold text-sm">{effect}</span>
      </div>

      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
            <div className="font-semibold mb-1">{effect}</div>
            <div className="text-gray-300 mb-2">{description}</div>
            {example && (
              <div className="text-teal-300 italic">
                Try: &quot;{example}&quot;
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
