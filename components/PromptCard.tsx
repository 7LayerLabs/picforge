'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/prompts';
import { useImageTracking } from '@/hooks/useImageTracking';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user, favorites, saveFavorite } = useImageTracking();

  // Check if prompt is favorited (checks both InstantDB and localStorage for migration)
  useEffect(() => {
    // Check InstantDB favorites first (if user is logged in)
    if (user && favorites && favorites.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isInDB = favorites.some((fav: any) => fav.prompt === prompt.description);
      setIsFavorited(isInDB);
    } else {
      // Fallback to localStorage for non-authenticated users
      const localFavorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');
      setIsFavorited(localFavorites.some((fav: Prompt) => fav.id === prompt.id));
    }
  }, [prompt.id, prompt.description, user, favorites]);

  const handleCopy = () => {
    const fullPrompt = `${prompt.title}\n\nSubject: ${prompt.subject}\nMood: ${prompt.mood}\nComposition: ${prompt.composition}${prompt.equipment ? `\nEquipment: ${prompt.equipment}` : ''}${prompt.platform ? `\nPlatform: ${prompt.platform}` : ''}\n\n${prompt.description}`;

    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = async () => {
    if (user) {
      // User is logged in - use InstantDB
      if (isFavorited) {
        // Remove from favorites - show message for now (delete not implemented in hook)
        alert('To remove favorites, visit your Favorites page');
      } else {
        // Add to InstantDB favorites
        await saveFavorite(prompt.description, prompt.category);
        setIsFavorited(true);
      }
    } else {
      // Not logged in - use localStorage
      const localFavorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');

      if (isFavorited) {
        // Remove from localStorage favorites
        const updated = localFavorites.filter((fav: Prompt) => fav.id !== prompt.id);
        localStorage.setItem('favoritePrompts', JSON.stringify(updated));
      } else {
        // Add to localStorage favorites
        localFavorites.push(prompt);
        localStorage.setItem('favoritePrompts', JSON.stringify(localFavorites));
      }

      setIsFavorited(!isFavorited);
    }
  };

  // Example thumbnail mapping (extend as you add more examples)
  const exampleImages: Record<string, { before: string; after: string }> = {
    'art-1': { before: '/examples/elon.jpg', after: '/examples/elon_sketch.png' },
    'art-2': { before: '/examples/sidney.webp', after: '/examples/sidney_sketch.png' },
    'fantasy-1': { before: '/examples/derek.jpg', after: '/examples/derek_zombie.png' },
  };

  const hasExample = exampleImages[prompt.id];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition touch-manipulation">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-1 break-words">{prompt.title}</h3>
          <p className="text-sm text-gray-600">{prompt.category}</p>
          {prompt.subcategory && (
            <p className="text-xs text-gray-500 mt-1">→ {prompt.subcategory}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <button
            onClick={handleFavorite}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded font-medium transition touch-manipulation ${
              isFavorited
                ? 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
            }`}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
          <button
            onClick={handleCopy}
            title="Copy prompt"
            className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded font-medium transition text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
              copied
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
            }`}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Example Thumbnail Preview */}
      {hasExample && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-2">Example Result:</p>
          <div className="grid grid-cols-2 gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exampleImages[prompt.id].before}
                alt="Before"
                className="w-full aspect-square object-cover rounded border border-gray-300"
              />
              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                Before
              </span>
            </div>
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exampleImages[prompt.id].after}
                alt="After"
                className="w-full aspect-square object-cover rounded border border-gray-300"
              />
              <span className="absolute bottom-1 left-1 bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                After
              </span>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-700 mb-4">{prompt.description}</p>

      <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-gray-500">Subject: </span>
          <span className="text-gray-800">{prompt.subject}</span>
        </div>
        <div>
          <span className="text-gray-500">Mood: </span>
          <span className="text-gray-800">{prompt.mood}</span>
        </div>
        <div>
          <span className="text-gray-500">Composition: </span>
          <span className="text-gray-800">{prompt.composition}</span>
        </div>
        {prompt.equipment && (
          <div>
            <span className="text-gray-500">Equipment: </span>
            <span className="text-gray-800">{prompt.equipment}</span>
          </div>
        )}
        {prompt.platform && (
          <div>
            <span className="text-gray-500">Platform: </span>
            <span className="text-gray-800">{prompt.platform}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {prompt.tags.map(tag => (
          <span
            key={tag}
            className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium border border-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
