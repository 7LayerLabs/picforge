'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Images, Layers, Sparkles, Menu, X, Lightbulb, Trophy, Flame, Shuffle, Wand2, ChevronDown, Gamepad2, Crown, User, Star, Target } from 'lucide-react';
import { useState } from 'react';
import AuthButton from './AuthButton';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isGameActive = () => isActive('/roast') || isActive('/roulette');
  const isResourceActive = () =>
    isActive('/prompts') ||
    isActive('/prompt-wizard') ||
    isActive('/tips') ||
    isActive('/examples');
  const isProfileActive = () =>
    isActive('/profile') ||
    isActive('/my-images') ||
    isActive('/favorites');

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center gap-3"
                onClick={(e) => {
                  e.preventDefault();
                  // Clear all localStorage to reset state
                  localStorage.clear();
                  // Force full page reload to reset all state
                  window.location.href = '/';
                }}
              >
                <Image
                  src="/polaroid-logo.svg"
                  alt="PicForge Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-xl bg-gradient-to-r from-teal-500 to-coral-500 bg-clip-text text-transparent">PicForge</span>
                  <span className="text-xs text-gray-600">Forge your images into art</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-4 sm:flex sm:space-x-2">
              <Link
                href="/"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/')
                    ? 'border-teal-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ImageIcon className="w-3 h-3 mr-1.5" />
                Editor
              </Link>

              <Link
                href="/batch"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/batch')
                    ? 'border-teal-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="w-3 h-3 mr-1.5" />
                Batch
              </Link>

              <Link
                href="/canvas"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/canvas')
                    ? 'border-teal-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                Canvas
              </Link>

              <Link
                href="/selective-edit"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/selective-edit')
                    ? 'border-pink-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="w-3 h-3 mr-1.5 text-pink-500" />
                Selective
              </Link>

              {/* Resources Dropdown */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium h-full ${
                    isResourceActive()
                      ? 'border-teal-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layers className="w-3 h-3 mr-1.5" />
                  Resources
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>

                {resourcesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100]">
                    <Link
                      href="/prompt-wizard"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/prompt-wizard')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Wand2 className="w-3 h-3 mr-1.5" />
                      Prompt Wizard
                    </Link>
                    <Link
                      href="/prompts"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/prompts')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Layers className="w-3 h-3 mr-1.5" />
                      Prompts Library
                    </Link>
                    <Link
                      href="/examples"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/examples')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3 mr-1.5" />
                      Templates Gallery
                    </Link>
                    <Link
                      href="/tips"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/tips')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lightbulb className="w-3 h-3 mr-1.5" />
                      Tips & Tricks
                    </Link>
                  </div>
                )}
              </div>

              {/* Games Dropdown */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setGamesDropdownOpen(true)}
                onMouseLeave={() => setGamesDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium h-full ${
                    isGameActive()
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Gamepad2 className="w-3 h-3 mr-1.5" />
                  Games
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>

                {gamesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100]">
                    <Link
                      href="/roast"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/roast')
                          ? 'bg-amber-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Flame className="w-3 h-3 mr-1.5" />
                      Roast Mode
                    </Link>
                    <Link
                      href="/roulette"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/roulette')
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Shuffle className="w-3 h-3 mr-1.5" />
                      Transform Roulette
                    </Link>
                    <div className="border-t border-gray-200 mt-2 pt-2 px-4 py-2">
                      <p className="text-xs text-gray-500 italic">More coming soon...</p>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/showcase"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/showcase')
                    ? 'border-teal-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Trophy className="w-3 h-3 mr-1.5" />
                Showcase
              </Link>

              <Link
                href="/pricing"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium ${
                  isActive('/pricing')
                    ? 'border-coral-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Crown className="w-3 h-3 mr-1.5 text-coral-500" />
                Pricing
              </Link>

              {/* Profile Dropdown */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-xs font-medium h-full ${
                    isProfileActive()
                      ? 'border-teal-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-3 h-3 mr-1.5" />
                  Profile
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100]">
                    <Link
                      href="/profile"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/profile')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-3 h-3 mr-1.5" />
                      My Account
                    </Link>
                    <Link
                      href="/my-images"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/my-images')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Images className="w-3 h-3 mr-1.5" />
                      My Images
                    </Link>
                    <Link
                      href="/favorites"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/favorites')
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Star className="w-3 h-3 mr-1.5" />
                      Favorites
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - User menu for desktop */}
          <div className="hidden sm:flex items-center ml-auto pl-8">
            <AuthButton />
          </div>

          {/* Mobile menu button and user menu */}
          <div className="flex items-center sm:hidden gap-2">
            <AuthButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ImageIcon className="w-3 h-3 mr-1.5" />
                Editor
              </div>
            </Link>

            <Link
              href="/batch"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/batch')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Layers className="w-3 h-3 mr-1.5" />
                Batch
              </div>
            </Link>

            <Link
              href="/canvas"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/canvas')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Sparkles className="w-3 h-3 mr-1.5" />
                Canvas
              </div>
            </Link>

            <Link
              href="/selective-edit"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/selective-edit')
                  ? 'bg-pink-50 border-pink-500 text-pink-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Target className="w-3 h-3 mr-1.5" />
                Selective Edit
              </div>
            </Link>

            {/* Resources Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <Layers className="w-3 h-3 mr-1" />
                Resources
              </div>
            </div>

            <Link
              href="/prompt-wizard"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/prompt-wizard')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Wand2 className="w-3 h-3 mr-1.5" />
                Prompt Wizard
              </div>
            </Link>

            {/* Games Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <Gamepad2 className="w-3 h-3 mr-1" />
                Games
              </div>
            </div>

            <Link
              href="/roast"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/roast')
                  ? 'bg-amber-50 border-coral-500 text-red-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Flame className="w-3 h-3 mr-1.5" />
                Roast Mode
              </div>
            </Link>

            <Link
              href="/roulette"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/roulette')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Shuffle className="w-3 h-3 mr-1.5" />
                Transform Roulette
              </div>
            </Link>

            <div className="pl-6 pr-4 py-2">
              <p className="text-xs text-gray-500 italic">More coming soon...</p>
            </div>

            <Link
              href="/showcase"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/showcase')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Trophy className="w-3 h-3 mr-1.5" />
                Showcase
              </div>
            </Link>

            <Link
              href="/prompts"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/prompts')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Layers className="w-3 h-3 mr-1.5" />
                Prompts Library
              </div>
            </Link>

            <Link
              href="/examples"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/examples')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ImageIcon className="w-3 h-3 mr-1.5" />
                Templates Gallery
              </div>
            </Link>

            <Link
              href="/tips"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/tips')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Lightbulb className="w-3 h-3 mr-1.5" />
                Tips & Tricks
              </div>
            </Link>


            <Link
              href="/pricing"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/pricing')
                  ? 'bg-coral-50 border-coral-500 text-coral-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Crown className="w-3 h-3 mr-1.5 text-coral-500" />
                Pricing
              </div>
            </Link>

            {/* Profile Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <User className="w-3 h-3 mr-1" />
                Profile
              </div>
            </div>

            <Link
              href="/profile"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/profile')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1.5" />
                My Account
              </div>
            </Link>

            <Link
              href="/my-images"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/my-images')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Images className="w-3 h-3 mr-1.5" />
                My Images
              </div>
            </Link>

            <Link
              href="/favorites"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/favorites')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1.5" />
                Favorites
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
