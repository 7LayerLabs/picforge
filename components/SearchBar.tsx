'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export default function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search prompts by title, description, or tags..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-11 pr-12 py-3 bg-white text-black placeholder-gray-400 rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <p className="text-sm text-gray-600 mt-2 animate-fade-in">
          Found <span className="font-bold text-teal-600">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'}
        </p>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
