'use client';

import { useState, useEffect } from 'react';
import { Users, Image as ImageIcon, TrendingUp, Sparkles } from 'lucide-react';
import { db } from '@/lib/instantdb';

interface CounterProps {
  variant?: 'compact' | 'full' | 'inline';
  showTransformations?: boolean;
  showUsers?: boolean;
  showShowcases?: boolean;
  className?: string;
}

export default function SocialProofCounter({
  variant = 'compact',
  showTransformations = true,
  showUsers = true,
  showShowcases = false,
  className = '',
}: CounterProps) {
  const [stats, setStats] = useState({
    transformations: 0,
    users: 0,
    showcases: 0,
  });

  // Query data from InstantDB
  const { data } = db.useQuery({
    images: {},
    users: {},
    showcaseSubmissions: {
      $: {
        where: {
          approved: true,
        },
      },
    },
  } as any);

  useEffect(() => {
    if (data) {
      const typedData = data as any;
      setStats({
        transformations: typedData?.images?.length || 0,
        users: typedData?.users?.length || 0,
        showcases: typedData?.showcaseSubmissions?.length || 0,
      });
    }
  }, [data]);

  // Compact variant - single line
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 ${className}`}
      >
        {showTransformations && (
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-gray-900">
              {stats.transformations.toLocaleString()}
            </span>
            <span className="text-xs text-gray-600">transformations</span>
          </div>
        )}
        {showUsers && (
          <div className="flex items-center gap-1.5 border-l pl-4 border-gray-300">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-900">
              {stats.users.toLocaleString()}+
            </span>
            <span className="text-xs text-gray-600">users</span>
          </div>
        )}
        {showShowcases && (
          <div className="flex items-center gap-1.5 border-l pl-4 border-gray-300">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-gray-900">
              {stats.showcases.toLocaleString()}
            </span>
            <span className="text-xs text-gray-600">showcases</span>
          </div>
        )}
      </div>
    );
  }

  // Inline variant - minimal
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {showTransformations && (
          <span className="text-sm text-gray-600">
            <span className="font-bold text-teal-600">
              {stats.transformations.toLocaleString()}
            </span>{' '}
            transformations created
          </span>
        )}
        {showUsers && (
          <span className="text-sm text-gray-600">
            • Join{' '}
            <span className="font-bold text-purple-600">{stats.users.toLocaleString()}+</span> users
          </span>
        )}
      </div>
    );
  }

  // Full variant - grid cards
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {showTransformations && (
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-teal-500 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-900">
                {stats.transformations.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-teal-700">Transformations Created</p>
          <p className="text-xs text-teal-600 mt-1">AI-powered image edits</p>
        </div>
      )}
      {showUsers && (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-900">
                {stats.users.toLocaleString()}+
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-purple-700">Active Users</p>
          <p className="text-xs text-purple-600 mt-1">Creative community</p>
        </div>
      )}
      {showShowcases && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-amber-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-900">
                {stats.showcases.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-amber-700">Showcase Submissions</p>
          <p className="text-xs text-amber-600 mt-1">Community highlights</p>
        </div>
      )}
    </div>
  );
}
