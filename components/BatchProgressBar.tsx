'use client';

import { CheckCircle, Loader2, AlertCircle, Clock, Zap } from 'lucide-react';

interface BatchProgressBarProps {
  total: number;
  completed: number;
  processing: number;
  errors: number;
  queued: number;
  currentFileName?: string;
  isProcessing: boolean;
  totalTime: number;
}

export default function BatchProgressBar({
  total,
  completed,
  processing,
  errors,
  queued,
  currentFileName,
  isProcessing,
  totalTime
}: BatchProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgTimePerImage = completed > 0 ? totalTime / completed : 0;
  const estimatedTimeRemaining = avgTimePerImage * queued;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (total === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-teal-200">
      {/* Header with main stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Batch Progress</h3>
          <p className="text-sm text-gray-600">
            {completed} of {total} images completed ({percentage}%)
          </p>
        </div>
        <div className="text-right">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-teal-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-semibold">Processing...</span>
            </div>
          ) : completed === total ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Complete!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Main progress bar */}
      <div className="mb-4">
        <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          {/* Completed segment */}
          <div
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${(completed / total) * 100}%` }}
          />
          {/* Processing segment */}
          <div
            className="absolute top-0 h-full bg-teal-500 transition-all duration-300 animate-pulse"
            style={{
              left: `${(completed / total) * 100}%`,
              width: `${(processing / total) * 100}%`
            }}
          />
          {/* Errors segment */}
          {errors > 0 && (
            <div
              className="absolute top-0 h-full bg-red-500 transition-all duration-300"
              style={{
                left: `${((completed + processing) / total) * 100}%`,
                width: `${(errors / total) * 100}%`
              }}
            />
          )}
          {/* Percentage text overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Current file being processed */}
      {isProcessing && currentFileName && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600 animate-pulse" />
            <span className="text-sm font-semibold text-teal-900">Currently processing:</span>
          </div>
          <p className="text-sm text-teal-700 font-mono mt-1 truncate">{currentFileName}</p>
        </div>
      )}

      {/* Detailed stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Queued</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{queued}</p>
        </div>

        <div className="bg-teal-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Loader2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs text-teal-700">Processing</span>
          </div>
          <p className="text-xl font-bold text-teal-900">{processing}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">Completed</span>
          </div>
          <p className="text-xl font-bold text-green-900">{completed}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-700">Errors</span>
          </div>
          <p className="text-xl font-bold text-red-900">{errors}</p>
        </div>
      </div>

      {/* Time estimates */}
      {isProcessing && queued > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div>
            <span className="font-semibold">Elapsed:</span> {formatTime(totalTime)}
          </div>
          <div>
            <span className="font-semibold">Avg per image:</span> {formatTime(avgTimePerImage)}
          </div>
          <div>
            <span className="font-semibold">Est. remaining:</span> {formatTime(estimatedTimeRemaining)}
          </div>
        </div>
      )}
    </div>
  );
}
