'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
}

export default function BatchUploader({ onFilesReady }: { onFilesReady: (files: File[]) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f =>
          f.id === file.id
            ? { ...f, status: 'processing', progress: 50 }
            : f
        ));

        setTimeout(() => {
          setFiles(prev => prev.map(f =>
            f.id === file.id
              ? { ...f, status: 'complete', progress: 100 }
              : f
          ));
        }, 1000);
      }, index * 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const processFiles = () => {
    const fileList = files.map(f => f.file);
    onFilesReady(fileList);
    setIsProcessing(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Upload className="w-16 h-16 text-gray-400" />
          </motion.div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700">
              {isDragActive ? 'Drop your images here' : 'Drag & drop up to 100 images'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              or click to browse • PNG, JPG, WebP • Max 50MB each
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full">
              <p className="text-sm font-medium text-blue-700">
                {files.length} image{files.length !== 1 ? 's' : ''} ready for processing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File Grid */}
      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Uploaded Images ({files.length})
            </h3>
            <button
              onClick={processFiles}
              disabled={isProcessing || files.some(f => f.status === 'processing')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Process All ${files.length} Images`}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {files.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-2 left-2">
                      {file.status === 'complete' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 bg-white rounded-full" />
                      )}
                      {file.status === 'processing' && (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin bg-white" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'processing' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-gray-600 truncate">
                    {file.file.name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}