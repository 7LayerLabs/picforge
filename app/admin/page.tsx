'use client';

import { useState, useEffect } from 'react';
import { useImageTracking } from '@/hooks/useImageTracking';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { createPromoCode, generatePromoCode } from '@/lib/promoCodes';
import { logger } from '@/lib/logger';
import {
  Check,
  X,
  Key,
  Sparkles,
  Crown,
  Gift,
  AlertCircle,
  Copy,
  BarChart3,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Activity,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ActivityFeed } from '@/components/analytics/ActivityFeed';
import { UsageHeatmap } from '@/components/analytics/UsageHeatmap';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { TrendingPrompts } from '@/components/analytics/TrendingPrompts';
import { ConversionMetrics } from '@/components/analytics/ConversionMetrics';

type TabType = 'overview' | 'prompts' | 'users' | 'codes' | 'insights';

export default function AdminPage() {
  const { user } = useImageTracking();
  const {
    isLoading,
    overviewMetrics,
    dailySignups,
    dailyImageGenerations,
    promptsWithFavorites,
    userAnalytics,
    retentionMetrics,
    promoCodes,
    users,
    images,
    favorites,
    referrals,
  } = useAdminAnalytics();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [customCode, setCustomCode] = useState('');
  const [tier, setTier] = useState<'unlimited' | 'pro'>('unlimited');
  const [isCreating, setIsCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [error, setError] = useState('');
  const [liveIndicator, setLiveIndicator] = useState(true);

  // Auto-refresh live indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIndicator(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // SECURITY: Only allow admin users (derek.bobola@gmail.com)
  const ADMIN_EMAIL = 'derek.bobola@gmail.com';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access the admin panel.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You do not have permission to access the admin panel.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerateRandom = async () => {
    setIsCreating(true);
    setError('');

    try {
      const code = generatePromoCode('PICFORGE');
      await createPromoCode(code, tier, user.id);
      setCreatedCode(code);
      setCustomCode('');
    } catch (err) {
      setError('Failed to create promo code');
      logger.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCustom = async () => {
    if (!customCode.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const code = customCode.toUpperCase().trim();
      await createPromoCode(code, tier, user.id);
      setCreatedCode(code);
      setCustomCode('');
    } catch (err) {
      setError('Failed to create promo code. Code may already exist.');
      logger.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdCode);
    alert('Code copied to clipboard!');
  };

  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle dates
          if (typeof value === 'number' && value > 1000000000000) {
            return format(value, 'yyyy-MM-dd HH:mm');
          }
          return String(value).replace(/,/g, ';');
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(Date.now(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const COLORS = ['#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Analytics</h1>
              <p className="text-gray-300">Real-time insights into PicForge usage</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${liveIndicator ? 'bg-green-400' : 'bg-green-600'} animate-pulse`} />
                <span className="text-sm text-gray-300">Live</span>
              </div>
              <Crown className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'prompts'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              Prompts
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'codes'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Key className="w-5 h-5" />
              Codes
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'insights'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-5 h-5" />
              Insights
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        )}

        {/* Overview Tab */}
        {!isLoading && activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-teal-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900">{overviewMetrics.totalUsers}</p>
                <p className="text-sm text-gray-500 mt-2">+{overviewMetrics.newUsersToday} today</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <ImageIcon className="w-8 h-8 text-coral-500" />
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Images</h3>
                <p className="text-3xl font-bold text-gray-900">{overviewMetrics.totalImages}</p>
                <p className="text-sm text-gray-500 mt-2">+{overviewMetrics.imagesToday} today</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div className={`w-2 h-2 rounded-full ${liveIndicator ? 'bg-green-400' : 'bg-green-600'} animate-pulse`} />
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Daily Active Users</h3>
                <p className="text-3xl font-bold text-gray-900">{overviewMetrics.dailyActiveUsers}</p>
                <p className="text-sm text-gray-500 mt-2">Last 24 hours</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Key className="w-8 h-8 text-yellow-500" />
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Promo Codes</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {overviewMetrics.redeemedCodes}/{overviewMetrics.totalCodes}
                </p>
                <p className="text-sm text-gray-500 mt-2">Redeemed</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Signups Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Signups (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="signups" stroke="#14b8a6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Image Generations Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Images Generated (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyImageGenerations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="images" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tier Distribution & Retention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tier Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Tier Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Free', value: overviewMetrics.tierDistribution.free },
                        { name: 'Pro', value: overviewMetrics.tierDistribution.pro },
                        { name: 'Unlimited', value: overviewMetrics.tierDistribution.unlimited },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={((props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`) as any}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Retention Metrics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">User Retention</h3>
                <div className="space-y-4 mt-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Day 1 Retention</span>
                      <span className="font-bold text-gray-900">{retentionMetrics.day1}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-teal-500 h-3 rounded-full"
                        style={{ width: `${retentionMetrics.day1 === 'N/A' ? 0 : retentionMetrics.day1}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Day 7 Retention</span>
                      <span className="font-bold text-gray-900">{retentionMetrics.day7}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-coral-500 h-3 rounded-full"
                        style={{ width: `${retentionMetrics.day7 === 'N/A' ? 0 : retentionMetrics.day7}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Day 30 Retention</span>
                      <span className="font-bold text-gray-900">{retentionMetrics.day30}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${retentionMetrics.day30 === 'N/A' ? 0 : retentionMetrics.day30}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-500">{overviewMetrics.avgImagesPerUser}</p>
                  <p className="text-gray-600 mt-2">Avg Images Per User</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-coral-500">{overviewMetrics.imagesLast7Days}</p>
                  <p className="text-gray-600 mt-2">Images Last 7 Days</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-500">{overviewMetrics.totalFavorites}</p>
                  <p className="text-gray-600 mt-2">Total Favorites</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {!isLoading && activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Most Popular Prompts</h3>
                <button
                  onClick={() => exportToCSV(promptsWithFavorites, 'prompts-analytics')}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prompt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Favorites
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Used
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {promptsWithFavorites.map((prompt, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                          {prompt.prompt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-semibold">
                            {prompt.uses}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-3 py-1 bg-coral-100 text-coral-800 rounded-full font-semibold">
                            {prompt.favorites}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(prompt.lastUsed, 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {!isLoading && activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">User Analytics</h3>
                <button
                  onClick={() => exportToCSV(userAnalytics, 'users-analytics')}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images Generated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {userAnalytics.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold ${
                              user.tier === 'unlimited'
                                ? 'bg-purple-100 text-purple-800'
                                : user.tier === 'pro'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {user.imagesGenerated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(user.joinDate, 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(user.lastActive, 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Generate Random Code */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-teal-500" />
                  Generate Random Code
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as 'unlimited' | 'pro')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                      disabled={isCreating}
                    >
                      <option value="unlimited">Unlimited (Free Forever)</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateRandom}
                    disabled={isCreating}
                    className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Generate Random Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Create Custom Code */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Key className="w-6 h-6 text-coral-500" />
                  Create Custom Code
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Code
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="DEREK-FOUNDER-2025"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral-500 focus:outline-none font-mono text-lg uppercase"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Tier
                    </label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as 'unlimited' | 'pro')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral-500 focus:outline-none"
                      disabled={isCreating}
                    >
                      <option value="unlimited">Unlimited (Free Forever)</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreateCustom}
                    disabled={isCreating || !customCode.trim()}
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Key className="w-5 h-5" />
                        Create Custom Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {createdCode && (
              <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-green-900 text-lg">Code Created Successfully!</h3>
                </div>
                <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-green-200">
                  <code className="flex-1 text-2xl font-mono font-bold text-gray-900">{createdCode}</code>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <p className="text-green-700 text-sm mt-3">
                  Share this code with the user. They can redeem it in their Profile page.
                </p>
              </div>
            )}

            {/* Promo Codes List */}
            {!isLoading && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">All Promo Codes</h3>
                  <button
                    onClick={() => exportToCSV(promoCodes, 'promo-codes')}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Redeemed At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {promoCodes.map((code: any) => (
                        <tr key={code.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 rounded-full font-semibold ${
                                code.tier === 'unlimited'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {code.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {code.isRedeemed ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                                Redeemed
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                                Available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(code.createdAt, 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {code.redeemedAt ? format(code.redeemedAt, 'MMM dd, yyyy') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {!isLoading && activeTab === 'insights' && (
          <div className="space-y-8">
            {/* Conversion Metrics */}
            <ConversionMetrics
              users={users}
              images={images}
              promoCodes={promoCodes}
              referrals={referrals}
            />

            {/* Activity Feed and Trending Prompts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed
                images={images}
                favorites={favorites}
                users={users}
                promoCodes={promoCodes}
                limit={15}
              />
              <TrendingPrompts images={images} />
            </div>

            {/* Usage Heatmap */}
            <UsageHeatmap images={images} />

            {/* Category Breakdown */}
            <CategoryBreakdown favorites={favorites} />
          </div>
        )}
      </div>
    </div>
  );
}
