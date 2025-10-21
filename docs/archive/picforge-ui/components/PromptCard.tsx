'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/prompts';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if prompt is favorited on mount and when favorites change
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');
    setIsFavorited(favorites.some((fav: Prompt) => fav.id === prompt.id));
  }, [prompt.id]);

  const handleCopy = () => {
    const fullPrompt = `${prompt.title}\n\nSubject: ${prompt.subject}\nMood: ${prompt.mood}\nComposition: ${prompt.composition}${prompt.equipment ? `\nEquipment: ${prompt.equipment}` : ''}${prompt.platform ? `\nPlatform: ${prompt.platform}` : ''}\n\n${prompt.description}`;

    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');

    if (isFavorited) {
      // Remove from favorites
      const updated = favorites.filter((fav: Prompt) => fav.id !== prompt.id);
      localStorage.setItem('favoritePrompts', JSON.stringify(updated));
    } else {
      // Add to favorites
      favorites.push(prompt);
      localStorage.setItem('favoritePrompts', JSON.stringify(favorites));
    }

    setIsFavorited(!isFavorited);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-black mb-1">{prompt.title}</h3>
          <p className="text-sm text-gray-600">{prompt.category}</p>
          {prompt.subcategory && (
            <p className="text-xs text-gray-500 mt-1">→ {prompt.subcategory}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleFavorite}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`px-3 py-2 rounded font-medium transition ${
              isFavorited
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
          <button
            onClick={handleCopy}
            title="Copy prompt"
            className={`px-3 py-2 rounded font-medium transition ${
              copied
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

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
