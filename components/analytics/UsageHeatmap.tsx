'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface UsageHeatmapProps {
  images: any[];
}

export function UsageHeatmap({ images }: UsageHeatmapProps) {
  const heatmapData = useMemo(() => {
    const data: { [day: string]: { [hour: number]: number } } = {};

    // Initialize with zeros
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach(day => {
      data[day] = {};
      for (let hour = 0; hour < 24; hour++) {
        data[day][hour] = 0;
      }
    });

    // Count images by day and hour
    images.forEach((img: any) => {
      const date = new Date(img.timestamp);
      const day = days[date.getDay()];
      const hour = date.getHours();
      data[day][hour] = (data[day][hour] || 0) + 1;
    });

    return data;
  }, [images]);

  // Find max value for color scaling
  const maxValue = useMemo(() => {
    let max = 0;
    Object.values(heatmapData).forEach(dayData => {
      Object.values(dayData).forEach(count => {
        max = Math.max(max, count);
      });
    });
    return max;
  }, [heatmapData]);

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = value / maxValue;
    if (intensity < 0.2) return 'bg-teal-200';
    if (intensity < 0.4) return 'bg-teal-300';
    if (intensity < 0.6) return 'bg-teal-400';
    if (intensity < 0.8) return 'bg-teal-500';
    return 'bg-teal-600';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-teal-500" />
        Usage Heatmap
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {hours.map(hour => (
              <div
                key={hour}
                className="w-8 text-xs text-gray-500 text-center"
                title={`${hour}:00`}
              >
                {hour % 3 === 0 ? hour : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {fullDays.map((fullDay, dayIndex) => (
            <div key={fullDay} className="flex mb-1">
              <div className="w-12 text-xs text-gray-600 flex items-center">
                {days[dayIndex]}
              </div>
              {hours.map(hour => {
                const value = heatmapData[fullDay]?.[hour] || 0;
                return (
                  <div
                    key={hour}
                    className={`w-8 h-8 ${getColor(value)} rounded-sm mx-px cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all`}
                    title={`${fullDay} ${hour}:00 - ${value} images`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-100 rounded-sm"></div>
          <div className="w-4 h-4 bg-teal-200 rounded-sm"></div>
          <div className="w-4 h-4 bg-teal-300 rounded-sm"></div>
          <div className="w-4 h-4 bg-teal-400 rounded-sm"></div>
          <div className="w-4 h-4 bg-teal-500 rounded-sm"></div>
          <div className="w-4 h-4 bg-teal-600 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
