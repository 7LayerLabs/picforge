'use client';

import { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'V'], description: 'Paste image from clipboard', category: 'Editing' },
  { keys: ['Ctrl', 'Enter'], description: 'Submit transformation', category: 'Editing' },
  { keys: ['Ctrl', 'S'], description: 'Download current image', category: 'Editing' },
  { keys: ['Esc'], description: 'Close modals and dialogs', category: 'Navigation' },
  { keys: ['?'], description: 'Toggle this help menu', category: 'Navigation' },
  { keys: ['Ctrl', 'Z'], description: 'Undo last action (when available)', category: 'Editing' },
  { keys: ['Tab'], description: 'Navigate through input fields', category: 'Navigation' },
  { keys: ['Enter'], description: 'Submit forms and actions', category: 'General' },
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open on '?' key (Shift + /)
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Don't trigger if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-teal-500 text-white rounded-full shadow-xl hover:bg-teal-600 hover:scale-110 transition-all duration-300 group z-40"
        title="Keyboard Shortcuts (Press ?)"
      >
        <Keyboard className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          ?
        </span>
      </button>
    );
  }

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl mx-4">
          {/* Header */}
          <div className="bg-teal-500 rounded-t-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Keyboard className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-teal-100 text-sm mt-1">Work faster. Break reality quicker.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-teal-500 rounded-full"></span>
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-gray-700 font-medium">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <div key={keyIndex} className="flex items-center gap-1">
                            <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-900 font-mono text-sm font-semibold group-hover:border-teal-500 group-hover:text-teal-600 transition-all">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 font-semibold">+</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pro Tip */}
            <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
              <p className="text-sm text-teal-800 font-medium">
                <span className="font-bold">Pro Tip:</span> Press <kbd className="px-2 py-1 bg-white border border-teal-300 rounded text-teal-700 font-mono text-xs font-semibold">?</kbd> anywhere to toggle this menu. Most shortcuts work best when you&apos;re not typing in an input field.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 rounded-b-2xl p-4 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600">
              More shortcuts coming soon. Got ideas? Let us know!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
}
