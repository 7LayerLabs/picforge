'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Images, Layers, Sparkles, Menu, X, Lightbulb, Trophy, Flame, Shuffle, Wand2, ChevronDown, Gamepad2, Crown, User, Star, Scale, Shield, FileText } from 'lucide-react';
import { useState } from 'react';
import AuthButton from './AuthButton';
import MegaMenu from './MegaMenu';
import { MessageSquare } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isGameActive = () => isActive('/roast') || isActive('/roulette');
  const isResourceActive = () =>
    isActive('/prompts') ||
    isActive('/prompt-wizard') ||
    isActive('/tips') ||
    isActive('/examples');
  const isProfileActive = () =>
    isActive('/profile') ||
    isActive('/favorites');
  const isLegalActive = () =>
    isActive('/legal/privacy') ||
    isActive('/legal/terms');

  return (
    <nav className="bg-brutal-yellow border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2"
              >
                <div className="flex flex-col">
                  <span className="font-black text-2xl text-black uppercase">PIC-FORGE</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link
                href="/forge"
                className={`inline-flex items-center px-3 py-2 text-sm md:text-base font-black uppercase ${
                  isActive('/forge')
                    ? 'text-black underline decoration-4 underline-offset-4'
                    : 'text-black hover:underline decoration-2 underline-offset-4'
                }`}
              >
                FORGE
              </Link>

              <Link
                href="/batch"
                className={`inline-flex items-center px-3 py-2 text-sm md:text-base font-black uppercase ${
                  isActive('/batch')
                    ? 'text-black underline decoration-4 underline-offset-4'
                    : 'text-black hover:underline decoration-2 underline-offset-4'
                }`}
              >
                FOUNDRY
              </Link>

              <Link
                href="/canvas"
                className={`inline-flex items-center px-3 py-2 text-sm md:text-base font-black uppercase ${
                  isActive('/canvas')
                    ? 'text-black underline decoration-4 underline-offset-4'
                    : 'text-black hover:underline decoration-2 underline-offset-4'
                }`}
              >
                CANVAS
              </Link>

              {/* Explore Mega Menu */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm md:text-base font-semibold h-full ${
                    isResourceActive()
                      ? 'border-teal-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layers className="w-3 h-3 mr-1.5" />
                  Explore
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>
                <MegaMenu
                  open={resourcesDropdownOpen}
                  sections={[
                    {
                      title: 'Discover',
                      items: [
                        { href: '/prompts', label: 'Prompts Library', description: '272+ curated prompts', icon: <Layers className="w-4 h-4" /> },
                        { href: '/examples', label: 'Templates Gallery', description: '110+ sample transformations', icon: <ImageIcon className="w-4 h-4" /> },
                        { href: '/feedback', label: 'Feedback', description: 'Tell us what to build next', icon: <MessageSquare className="w-4 h-4" /> },
                      ],
                    },
                    {
                      title: 'Create Faster',
                      items: [
                        { href: '/prompt-wizard', label: 'Prompt Wizard', description: 'Step-by-step prompt builder', icon: <Wand2 className="w-4 h-4" /> },
                        { href: '/tips', label: 'Tips & Tricks', description: 'Best practices and guides', icon: <Lightbulb className="w-4 h-4" /> },
                      ],
                    },
                  ]}
                />
              </div>

              {/* Play Mega Menu */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setGamesDropdownOpen(true)}
                onMouseLeave={() => setGamesDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm md:text-base font-semibold h-full ${
                    isGameActive()
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Gamepad2 className="w-3 h-3 mr-1.5" />
                  Play
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>
                <MegaMenu
                  open={gamesDropdownOpen}
                  sections={[
                    {
                      title: 'Games',
                      items: [
                        { href: '/roast', label: 'Roast Mode', description: 'Hilarious AI feedback', icon: <Flame className="w-4 h-4" /> },
                        { href: '/roulette', label: 'Transform Roulette', description: 'Spin for random effects', icon: <Shuffle className="w-4 h-4" /> },
                      ],
                    },
                    { title: 'Coming Soon', items: [{ href: '/roulette', label: 'More game modes', description: 'Stay tuned' }] },
                  ]}
                />
              </div>

              <Link
                href="/pricing"
                className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm md:text-base font-semibold ${
                  isActive('/pricing')
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Crown className="w-3 h-3 mr-1.5 text-coral-500" />
                Pricing
              </Link>

              {/* Legal Dropdown */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setLegalDropdownOpen(true)}
                onMouseLeave={() => setLegalDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm md:text-base font-semibold h-full ${
                    isLegalActive()
                      ? 'border-teal-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Scale className="w-3 h-3 mr-1.5" />
                  Legal
                  <ChevronDown className="w-2.5 h-2.5 ml-1" />
                </button>

                {legalDropdownOpen && (
                  <div className="absolute top-full right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[100]">
                    <Link
                      href="/legal/privacy"
                      className={`flex items-center px-4 py-2 text-sm font-semibold ${
                        isActive('/legal/privacy')
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Shield className="w-3 h-3 mr-1.5" />
                      Privacy Policy
                    </Link>
                    <Link
                      href="/legal/terms"
                      className={`flex items-center px-4 py-2 text-sm font-semibold ${
                        isActive('/legal/terms')
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FileText className="w-3 h-3 mr-1.5" />
                      Terms of Service
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div
                className="relative z-[100]"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-2 pt-1 border-b-2 text-sm md:text-base font-semibold h-full ${
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
                      className={`flex items-center px-4 py-2 text-sm font-semibold ${
                        isActive('/profile')
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-3 h-3 mr-1.5" />
                      My Account
                    </Link>
                    <Link
                      href="/favorites"
                      className={`flex items-center px-4 py-2 text-sm font-semibold ${
                        isActive('/favorites')
                          ? 'bg-teal-50 text-teal-700'
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

          {/* Right side - CTA for desktop */}
          <div className="hidden sm:flex items-center ml-auto gap-4">
            <AuthButton />
            <Link
              href="/forge"
              className="px-6 py-3 bg-black text-brutal-yellow text-sm font-black uppercase border-4 border-black hover:bg-brutal-pink hover:text-white transition-all"
            >
              GET STARTED
            </Link>
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
              href="/forge"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/forge')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ImageIcon className="w-3 h-3 mr-1.5" />
                The Forge
              </div>
            </Link>

            <Link
              href="/batch"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/batch')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Layers className="w-3 h-3 mr-1.5" />
                Foundry
              </div>
            </Link>

            <Link
              href="/canvas"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
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

            {/* Resources Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <Layers className="w-3 h-3 mr-1" />
                Resources
              </div>
            </div>

            <Link
              href="/prompt-wizard"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
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
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/roast')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
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
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
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
              href="/prompts"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/prompts')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
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
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/examples')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
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
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/tips')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
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
              className={`block pl-3 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/pricing')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Crown className="w-3 h-3 mr-1.5 text-coral-500" />
                Pricing
              </div>
            </Link>

            {/* Legal Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <Scale className="w-3 h-3 mr-1" />
                Legal
              </div>
            </div>

            <Link
              href="/legal/privacy"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/legal/privacy')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1.5" />
                Privacy Policy
              </div>
            </Link>

            <Link
              href="/legal/terms"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
                isActive('/legal/terms')
                  ? 'bg-teal-50 border-teal-500 text-teal-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1.5" />
                Terms of Service
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
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
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
              href="/favorites"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base md:text-lg font-semibold ${
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
