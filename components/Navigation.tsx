'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Layers, Sparkles, Menu, X, Lightbulb, Trophy, Flame, Shuffle, Wand2, ChevronDown, Gamepad2, Shield } from 'lucide-react';
import { useState } from 'react';
// import UserMenu from './UserMenu'; // Temporarily disabled - authentication not needed yet

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [editorDropdownOpen, setEditorDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isGameActive = () => isActive('/roast') || isActive('/roulette');

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="text-4xl">🔥</div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PicForge</span>
                  <span className="text-xs text-gray-600">Forge your images into art</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {/* Editor Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setEditorDropdownOpen(true)}
                onMouseLeave={() => setEditorDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${
                    isActive('/') || isActive('/editor-nsfw')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Editor
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>

                {editorDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link
                      href="/"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/')
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Regular Editor
                    </Link>
                    <Link
                      href="/editor-nsfw"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/editor-nsfw')
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      18+ Editor
                    </Link>
                  </div>
                )}
              </div>

              {/* Batch Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setBatchDropdownOpen(true)}
                onMouseLeave={() => setBatchDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${
                    isActive('/batch') || isActive('/batch-nsfw')
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Batch
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>

                {batchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link
                      href="/batch"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/batch')
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Regular Batch
                    </Link>
                    <Link
                      href="/batch-nsfw"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/batch-nsfw')
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      18+ Batch
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/canvas"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/canvas')
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Canvas
              </Link>

              <Link
                href="/prompt-wizard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/prompt-wizard')
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Wizard
              </Link>

              <Link
                href="/tips"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/tips')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </Link>

              <Link
                href="/prompts"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/prompts')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="w-4 h-4 mr-2" />
                Prompts
              </Link>

              <Link
                href="/examples"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/examples')
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Templates
              </Link>

              <Link
                href="/showcase"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/showcase')
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Showcase
              </Link>

              {/* Games Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setGamesDropdownOpen(true)}
                onMouseLeave={() => setGamesDropdownOpen(false)}
              >
                <button
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${
                    isGameActive()
                      ? 'border-pink-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Games
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>

                {gamesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link
                      href="/roast"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isActive('/roast')
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Flame className="w-4 h-4 mr-2" />
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
                      <Shuffle className="w-4 h-4 mr-2" />
                      Transform Roulette
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - User menu for desktop */}
          <div className="hidden sm:flex items-center">
            {/* <UserMenu /> */} {/* Temporarily disabled - authentication not needed yet */}
          </div>

          {/* Mobile menu button and user menu */}
          <div className="flex items-center sm:hidden gap-2">
            {/* <UserMenu /> */} {/* Temporarily disabled - authentication not needed yet */}
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
            {/* Editor Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <ImageIcon className="w-3 h-3 mr-1" />
                Editor
              </div>
            </div>

            <Link
              href="/"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Regular Editor
              </div>
            </Link>

            <Link
              href="/editor-nsfw"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/editor-nsfw')
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                18+ Editor
              </div>
            </Link>

            {/* Batch Section */}
            <div className="px-3 py-2">
              <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                <Layers className="w-3 h-3 mr-1" />
                Batch
              </div>
            </div>

            <Link
              href="/batch"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/batch')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Regular Batch
              </div>
            </Link>

            <Link
              href="/batch-nsfw"
              className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/batch-nsfw')
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                18+ Batch
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
                <Sparkles className="w-4 h-4 mr-2" />
                Canvas
              </div>
            </Link>

            <Link
              href="/prompt-wizard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/prompt-wizard')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Wand2 className="w-4 h-4 mr-2" />
                Wizard
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
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Flame className="w-4 h-4 mr-2" />
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
                <Shuffle className="w-4 h-4 mr-2" />
                Transform Roulette
              </div>
            </Link>

            <Link
              href="/prompts"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/prompts')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Layers className="w-4 h-4 mr-2" />
                Prompts
              </div>
            </Link>

            <Link
              href="/examples"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/examples')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Templates
              </div>
            </Link>

            <Link
              href="/tips"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/tips')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Tips
              </div>
            </Link>

            <Link
              href="/showcase"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/showcase')
                  ? 'bg-orange-50 border-orange-500 text-orange-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Showcase
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
