'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendingPromptsProps {
  images: any[];
}

interface PromptTrend {
  prompt: string;
  currentCount: number;
  previousCount: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

export function TrendingPrompts({ images }: TrendingPromptsProps) {
  const trendingData = useMemo(() => {
    const now = Date.now();
    const last7Days = now - 7 * 24 * 60 * 60 * 1000;
    const previous7Days = last7Days - 7 * 24 * 60 * 60 * 1000;

    // Count prompts in last 7 days
    const currentCounts: { [key: string]: number } = {};
    images
      .filter((img: any) => img.timestamp >= last7Days)
      .forEach((img: any) => {
        const prompt = img.prompt?.toLowerCase() || 'unknown';
        currentCounts[prompt] = (currentCounts[prompt] || 0) + 1;
      });

    // Count prompts in previous 7 days
    const previousCounts: { [key: string]: number } = {};
    images
      .filter((img: any) => img.timestamp >= previous7Days && img.timestamp < last7Days)
      .forEach((img: any) => {
        const prompt = img.prompt?.toLowerCase() || 'unknown';
        previousCounts[prompt] = (previousCounts[prompt] || 0) + 1;
      });

    // Calculate trends
    const trends: PromptTrend[] = [];
    const allPrompts = new Set([
      ...Object.keys(currentCounts),
      ...Object.keys(previousCounts),
    ]);

    allPrompts.forEach(prompt => {
      const current = currentCounts[prompt] || 0;
      const previous = previousCounts[prompt] || 0;

      // Only include prompts with at least 2 uses in current period
      if (current < 2) return;

      let percentChange = 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (previous === 0 && current > 0) {
        percentChange = 100;
        trend = 'up';
      } else if (previous > 0) {
        percentChange = ((current - previous) / previous) * 100;
        if (percentChange > 10) trend = 'up';
        else if (percentChange < -10) trend = 'down';
      }

      trends.push({
        prompt,
        currentCount: current,
        previousCount: previous,
        trend,
        percentChange,
      });
    });

    // Sort by current count, then by percent change
    return trends
      .sort((a, b) => {
        if (b.currentCount !== a.currentCount) {
          return b.currentCount - a.currentCount;
        }
        return Math.abs(b.percentChange) - Math.abs(a.percentChange);
      })
      .slice(0, 15);
  }, [images]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      case 'stable':
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-teal-500" />
        Trending Prompts (7 Days)
      </h3>

      {trendingData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Not enough data to show trends yet
        </p>
      ) : (
        <div className="space-y-3">
          {trendingData.map((item, index) => (
            <div
              key={item.prompt}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 w-6 text-sm font-bold text-gray-400">
                  #{index + 1}
                </span>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.prompt}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {item.currentCount}
                  </p>
                  <p className="text-xs text-gray-500">uses</p>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTrendColor(
                    item.trend
                  )}`}
                >
                  {getTrendIcon(item.trend)}
                  <span className="text-xs font-semibold">
                    {item.percentChange > 0 ? '+' : ''}
                    {item.percentChange.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Comparing last 7 days vs. previous 7 days. Minimum 2 uses required.
        </p>
      </div>
    </div>
  );
}
