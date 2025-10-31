'use client';

import { Search } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { prompts } from '@/lib/prompts';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, resultCount }, ref) {
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
      const q = value.trim().toLowerCase();
      if (!q) return [] as Array<{ type: 'title' | 'tag'; text: string }>;
      const titleMatches = prompts
        .map(p => p.title)
        .filter(t => t.toLowerCase().includes(q))
        .slice(0, 6)
        .map(t => ({ type: 'title' as const, text: t }));
      const tagMatches = Array.from(new Set(prompts.flatMap(p => p.tags)))
        .filter(tag => tag.toLowerCase().includes(q))
        .slice(0, 6)
        .map(t => ({ type: 'tag' as const, text: t }));
      return [...titleMatches, ...tagMatches].slice(0, 8);
    }, [value]);

    useEffect(() => {
      setOpen(!!value && suggestions.length > 0);
      setHighlightIndex(-1);
    }, [value, suggestions.length]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!containerRef.current) return;
        if (!containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applySuggestion = (text: string) => {
      onChange(text);
      setOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || suggestions.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex(i => (i + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
      } else if (e.key === 'Enter' && highlightIndex >= 0) {
        e.preventDefault();
        applySuggestion(suggestions[highlightIndex].text);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    return (
      <div className="mb-8" ref={containerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={ref}
            type="text"
            placeholder="Search prompts by title, description, or tags..."
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
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
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <ul className="max-h-64 overflow-y-auto py-1">
            {suggestions.map((s, idx) => (
              <li key={`${s.type}-${s.text}`}>
                <button
                  onMouseDown={e => {
                    e.preventDefault();
                    applySuggestion(s.text);
                  }}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm ${
                    idx === highlightIndex ? 'bg-teal-50 text-teal-800' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${s.type === 'tag' ? 'bg-gray-200 text-gray-700' : 'bg-teal-100 text-teal-700'}`}>
                    {s.type === 'tag' ? 'TAG' : 'TITLE'}
                  </span>
                  <span className="truncate">{s.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
});

export default SearchBar;
