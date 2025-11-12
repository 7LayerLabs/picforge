'use client';

import { useMemo } from 'react';
import { TrendingUp, Users, Gift, Share2, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConversionMetricsProps {
  users: any[];
  images: any[];
  promoCodes: any[];
  referrals?: any[];
}

export function ConversionMetrics({
  users,
  images,
  promoCodes,
  referrals = []
}: ConversionMetricsProps) {
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalPromoCodes = promoCodes.length;
    const redeemedCodes = promoCodes.filter((code: any) => code.isRedeemed).length;

    // Promo code redemption rate
    const promoRedemptionRate = totalPromoCodes > 0
      ? ((redeemedCodes / totalPromoCodes) * 100).toFixed(1)
      : '0.0';

    // Referral conversion rate
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter((ref: any) => ref.status === 'completed').length;
    const referralConversionRate = totalReferrals > 0
      ? ((completedReferrals / totalReferrals) * 100).toFixed(1)
      : '0.0';

    // Users who generated at least one image
    const usersWithImages = new Set(images.map((img: any) => img.userId)).size;
    const activationRate = totalUsers > 0
      ? ((usersWithImages / totalUsers) * 100).toFixed(1)
      : '0.0';

    // Users who upgraded (redeemed promo codes or have pro tier)
    const upgradedUsers = promoCodes.filter((code: any) => code.isRedeemed).length;
    const upgradeRate = totalUsers > 0
      ? ((upgradedUsers / totalUsers) * 100).toFixed(1)
      : '0.0';

    // Average time to first image (in hours)
    let avgTimeToFirstImage = 0;
    if (users.length > 0 && images.length > 0) {
      const times: number[] = [];
      users.forEach((user: any) => {
        const firstImage = images
          .filter((img: any) => img.userId === user.id)
          .sort((a: any, b: any) => a.timestamp - b.timestamp)[0];

        if (firstImage) {
          const timeDiff = firstImage.timestamp - user.createdAt;
          times.push(timeDiff / (1000 * 60 * 60)); // Convert to hours
        }
      });

      if (times.length > 0) {
        avgTimeToFirstImage = times.reduce((sum, t) => sum + t, 0) / times.length;
      }
    }

    return {
      promoRedemptionRate,
      referralConversionRate,
      activationRate,
      upgradeRate,
      avgTimeToFirstImage: avgTimeToFirstImage.toFixed(1),
      totalReferrals,
      completedReferrals,
      usersWithImages,
      upgradedUsers,
    };
  }, [users, images, promoCodes, referrals]);

  const chartData = [
    {
      name: 'Promo Codes',
      rate: parseFloat(metrics.promoRedemptionRate),
      color: '#8b5cf6', // purple
    },
    {
      name: 'Referrals',
      rate: parseFloat(metrics.referralConversionRate),
      color: '#f97316', // orange
    },
    {
      name: 'Activation',
      rate: parseFloat(metrics.activationRate),
      color: '#14b8a6', // teal
    },
    {
      name: 'Upgrades',
      rate: parseFloat(metrics.upgradeRate),
      color: '#06b6d4', // cyan
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Gift className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-medium text-purple-500 bg-purple-50 px-2 py-1 rounded-full">
              Promo Codes
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Redemption Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {metrics.promoRedemptionRate}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {promoCodes.filter((c: any) => c.isRedeemed).length} of {promoCodes.length} redeemed
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Share2 className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
              Referrals
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Conversion Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {metrics.referralConversionRate}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {metrics.completedReferrals} of {metrics.totalReferrals} completed
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-teal-500" />
            <span className="text-xs font-medium text-teal-500 bg-teal-50 px-2 py-1 rounded-full">
              Activation
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            User Activation
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {metrics.activationRate}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {metrics.usersWithImages} users generated images
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Crown className="w-8 h-8 text-cyan-500" />
            <span className="text-xs font-medium text-cyan-500 bg-cyan-50 px-2 py-1 rounded-full">
              Upgrades
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            Upgrade Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {metrics.upgradeRate}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {metrics.upgradedUsers} users upgraded
          </p>
        </div>
      </div>

      {/* Conversion Funnel Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-teal-500" />
          Conversion Funnel
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Bar dataKey="rate" fill="#14b8a6" name="Conversion Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">User Journey Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-teal-500">
              {metrics.avgTimeToFirstImage}h
            </p>
            <p className="text-gray-600 mt-2">Avg Time to First Image</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-500">
              {(images.length / Math.max(metrics.usersWithImages, 1)).toFixed(1)}
            </p>
            <p className="text-gray-600 mt-2">Images per Active User</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-500">
              {((metrics.usersWithImages / Math.max(users.length, 1)) * 100).toFixed(1)}%
            </p>
            <p className="text-gray-600 mt-2">Users Who Activated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
