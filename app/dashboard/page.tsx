'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Images, Calendar, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalImages: 0,
    todayImages: 0,
    weekImages: 0,
    monthImages: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user statistics
      fetch('/api/user/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(console.error)
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Editor
          </Link>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>

        {/* User Info */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{session.user?.name || 'User'}</h2>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <Images className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">{stats.totalImages}</span>
            </div>
            <h3 className="text-blue-300 font-semibold">Total Images</h3>
            <p className="text-gray-400 text-sm">All time</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">{stats.todayImages}</span>
            </div>
            <h3 className="text-green-300 font-semibold">Today</h3>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-white">{stats.weekImages}</span>
            </div>
            <h3 className="text-purple-300 font-semibold">This Week</h3>
            <p className="text-gray-400 text-sm">Last 7 days</p>
          </div>

          <div className="bg-gradient-to-br from-teal-600/20 to-orange-800/20 backdrop-blur rounded-xl p-6 border border-teal-500/30">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-teal-400" />
              <span className="text-3xl font-bold text-white">{stats.monthImages}</span>
            </div>
            <h3 className="text-orange-300 font-semibold">This Month</h3>
            <p className="text-gray-400 text-sm">Last 30 days</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <p className="text-gray-400">Your recent image transformations will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}