'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search prompts by title, description, or tags..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-white text-black placeholder-gray-400 rounded-lg border border-gray-300 focus:border-teal-600 focus:outline-none transition"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
