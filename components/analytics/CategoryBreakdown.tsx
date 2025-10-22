'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tag } from 'lucide-react';

interface CategoryBreakdownProps {
  favorites: any[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Art Styles': '#14b8a6', // teal
  'Nature': '#10b981', // emerald
  'People': '#f97316', // orange
  'Sports': '#3b82f6', // blue
  'Politics': '#ef4444', // red
  'Wellness': '#8b5cf6', // purple
  'Events': '#ec4899', // pink
  'Pro Photography': '#f59e0b', // amber
  'Fantasy': '#6366f1', // indigo
  'Abstract': '#06b6d4', // cyan
  'Film': '#84cc16', // lime
  'Business': '#64748b', // slate
  'Other': '#9ca3af', // gray
};

export function CategoryBreakdown({ favorites }: CategoryBreakdownProps) {
  const categoryData = useMemo(() => {
    const counts: { [key: string]: number } = {};

    favorites.forEach((fav: any) => {
      const category = fav.category || 'Other';
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS['Other'],
      }))
      .sort((a, b) => b.value - a.value);
  }, [favorites]);

  const totalFavorites = useMemo(() => {
    return categoryData.reduce((sum, item) => sum + item.value, 0);
  }, [categoryData]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Tag className="w-6 h-6 text-teal-500" />
        Category Breakdown
      </h3>

      {categoryData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No favorites yet</p>
      ) : (
        <>
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={((props: any) => {
                  const percent = ((props.value / totalFavorites) * 100).toFixed(0);
                  return Number(percent) >= 5 ? `${percent}%` : '';
                }) as any}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Category List */}
          <div className="mt-6 space-y-2">
            {categoryData.map((category) => {
              const percentage = ((category.value / totalFavorites) * 100).toFixed(1);
              return (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{percentage}%</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {category.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
