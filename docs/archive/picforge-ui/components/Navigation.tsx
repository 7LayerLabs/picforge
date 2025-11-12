'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🔥</span>
          <div className="flex flex-col -space-y-1">
            <span className="font-bold text-teal-600 text-base">PicForge</span>
            <span className="text-[10px] text-gray-500">Forge your images into art</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-5 text-sm flex-1 justify-center">
          <Link href="/" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
            <span className="text-base">📝</span>
            <span>Editor</span>
          </Link>
          <Link href="/batch" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
            <span className="text-base">📦</span>
            <span>Batch</span>
          </Link>
          <Link href="/canvas" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
            <span className="text-base">🎨</span>
            <span>Canvas</span>
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
              <span className="text-base">📚</span>
              <span>Resources</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
          <div className="relative group">
            <button className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
              <span className="text-base">🎮</span>
              <span>Games</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
          <Link href="/showcase" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
            <span className="text-base">🏆</span>
            <span>Showcase</span>
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
            <span className="text-base">💎</span>
            <span>Pricing</span>
          </Link>
          <div className="relative group">
            <button className="text-gray-700 hover:text-teal-600 transition flex items-center gap-1.5">
              <span className="text-base">👤</span>
              <span>Profile</span>
              <span className="text-xs">▼</span>
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <button className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition flex-shrink-0">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
