'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Zap, Image, Download, Sparkles } from 'lucide-react';

export default function BatchQuickStart() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-purple-200 p-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Info className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 text-lg">How to Use Batch Processing</h3>
            <p className="text-sm text-purple-600">
              {isExpanded ? 'Hide guide' : 'Click to see step-by-step instructions'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Step-by-step guide */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-teal-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <Image className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-teal-900">Upload Images</span>
              </div>
              <p className="text-sm text-teal-700 mb-2">
                Drag and drop up to 100 images, or click to browse. You can also paste images from your clipboard!
              </p>
              <div className="text-xs text-teal-600 bg-white rounded p-2">
                <strong>Tip:</strong> Drop files anywhere on the page
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900">Choose Effects</span>
              </div>
              <p className="text-sm text-purple-700 mb-2">
                Pick from 21 effects or try a popular combination. Hover over effects to see what they do!
              </p>
              <div className="text-xs text-purple-600 bg-white rounded p-2">
                <strong>Tip:</strong> Combine 2-3 effects for best results
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <Download className="w-5 h-5 text-teal-600" />
                <span className="font-bold text-teal-900">Process & Download</span>
              </div>
              <p className="text-sm text-teal-700 mb-2">
                Click &quot;Start Processing&quot; and watch the magic happen. Download all as ZIP when done!
              </p>
              <div className="text-xs text-teal-600 bg-white rounded p-2">
                <strong>Tip:</strong> Use &quot;High Priority&quot; for urgent images
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="border-t border-purple-200 pt-4">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Pro Tips for Best Results
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <h5 className="font-semibold text-purple-900 text-sm mb-2">Effect Combinations That Work Great:</h5>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>&quot;warm vignette grain&quot;</strong> - Vintage film look</li>
                  <li>• <strong>&quot;sharpen enhance saturation&quot;</strong> - Product photos</li>
                  <li>• <strong>&quot;cool grain contrast&quot;</strong> - Moody portraits</li>
                  <li>• <strong>&quot;sepia vignette&quot;</strong> - Classic vintage</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <h5 className="font-semibold text-purple-900 text-sm mb-2">Common Mistakes to Avoid:</h5>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Don&apos;t use more than 3-4 effects at once</li>
                  <li>• Order matters: &quot;grayscale contrast&quot; ≠ &quot;contrast grayscale&quot;</li>
                  <li>• Test on 1 image before processing all 100</li>
                  <li>• Check your export settings before downloading</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl+V</kbd>
                <span className="ml-2 text-gray-600">Paste image</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl+S</kbd>
                <span className="ml-2 text-gray-600">Download all</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">ESC</kbd>
                <span className="ml-2 text-gray-600">Pause processing</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Del</kbd>
                <span className="ml-2 text-gray-600">Remove last image</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
