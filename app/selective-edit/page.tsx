'use client';

import { useState } from 'react';
import { Upload, Sparkles, AlertCircle, Check, Download } from 'lucide-react';
import SelectiveEditor from '@/components/SelectiveEditor';
import { useImageTracking } from '@/hooks/useImageTracking';

interface SelectionArea {
  id: string;
  mask: string;
  prompt: string;
  color: string;
  name: string;
}

export default function SelectiveEditPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, hasReachedLimit, trackImageGeneration } = useImageTracking();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setProcessedResults([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplySelections = async (areas: SelectionArea[]) => {
    if (!selectedImage) return;

    // Check usage limits
    if (!user) {
      setError('Please sign in to use selective editing');
      return;
    }

    if (hasReachedLimit()) {
      setError('Daily limit reached! Upgrade to Pro or redeem a promo code for unlimited images.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    const results: string[] = [];

    try {
      // Process each area sequentially
      let currentImage = selectedImage;

      for (const area of areas) {
        console.log(`Processing ${area.name}:`, area.prompt);

        const response = await fetch('/api/inpaint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: currentImage,
            mask: area.mask,
            prompt: area.prompt,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
          throw new Error(errorMsg || 'Failed to process area');
        }

        // Use the result as input for next area
        currentImage = data.resultUrl;
        results.push(data.resultUrl);

        // Track image generation
        await trackImageGeneration({
          prompt: `Selective edit: ${area.name} - ${area.prompt}`,
          originalUrl: selectedImage,
          transformedUrl: data.resultUrl,
          locked: false,
        });
      }

      setProcessedResults(results);
    } catch (err) {
      console.error('Selective editing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process selections');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `selective-edit-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-teal-500" />
            <h1 className="text-4xl font-bold text-gray-900">Selective Area Editor</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select specific areas of your image and transform them individually.
            Change the background on the left differently than the right, or edit multiple spots with unique prompts!
          </p>
        </div>

        {/* Upload Section */}
        {!selectedImage && (
          <div className="max-w-2xl mx-auto">
            <label className="block">
              <div className="border-4 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  Upload Your Image
                </p>
                <p className="text-gray-500">
                  Click to browse or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>

            {/* How It Works */}
            <div className="mt-12 bg-white rounded-xl p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Upload Your Image</h3>
                    <p className="text-gray-600 text-sm">
                      Start by uploading the image you want to selectively edit
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Select Areas</h3>
                    <p className="text-gray-600 text-sm">
                      Use brush, rectangle, or circle tools to paint over the areas you want to change.
                      Choose different colors for different areas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Describe Changes</h3>
                    <p className="text-gray-600 text-sm">
                      For each colored area, write what you want to see there
                      (e.g., &quot;sunset sky&quot;, &quot;tropical beach&quot;, &quot;city skyline&quot;)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Apply & Download</h3>
                    <p className="text-gray-600 text-sm">
                      Hit Apply All Selections and watch the magic happen. Download your results!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor Section */}
        {selectedImage && !isProcessing && processedResults.length === 0 && (
          <SelectiveEditor imageUrl={selectedImage} onApply={handleApplySelections} />
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <Sparkles className="w-8 h-8 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
              Processing Your Selections...
            </h2>
            <p className="text-gray-600">
              This may take a minute. We&apos;re applying AI magic to each area! ✨
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setError(null);
                setSelectedImage(null);
                setProcessedResults([]);
              }}
              className="mt-4 w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Results */}
        {processedResults.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-teal-200">
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-8 h-8 text-teal-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Results Ready!</h2>
                  <p className="text-gray-600">Your selective edits have been applied successfully</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Original */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Original</h3>
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full rounded-lg border-2 border-gray-200"
                    />
                  )}
                </div>

                {/* Final Result */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Final Result</h3>
                  {processedResults.length > 0 && (
                    <>
                      <img
                        src={processedResults[processedResults.length - 1]}
                        alt="Final result"
                        className="w-full rounded-lg border-2 border-teal-500"
                      />
                      <button
                        onClick={() => downloadResult(processedResults[processedResults.length - 1], processedResults.length - 1)}
                        className="mt-3 w-full px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Final
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progressive Results */}
              {processedResults.length > 1 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Progressive Steps</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {processedResults.slice(0, -1).map((result, idx) => (
                      <div key={idx}>
                        <img
                          src={result}
                          alt={`Step ${idx + 1}`}
                          className="w-full rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">Step {idx + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setProcessedResults([]);
                  setError(null);
                }}
                className="mt-6 w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Edit Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
