'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { User, LogOut, Settings, Heart, History, Crown } from 'lucide-react'

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-coral-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-coral-600 transition-all"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-coral-500 flex items-center justify-center text-white font-bold text-sm">
            {session.user?.name?.[0] || 'U'}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {session.user?.name?.split(' ')[0] || 'User'}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>

            <Link
              href="/profile"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>

            <Link
              href="/profile/history"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <History className="w-4 h-4" />
              Image History
            </Link>

            <Link
              href="/profile/favorites"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Favorites
            </Link>

            <Link
              href="/profile/settings"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>

            <Link
              href="/pricing"
              onClick={() => setShowMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-teal-600 hover:bg-teal-50 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={() => {
                setShowMenu(false)
                signOut()
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}