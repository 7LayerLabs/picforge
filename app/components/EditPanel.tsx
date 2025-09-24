'use client';

import React, { useState } from 'react';
import {
  Sliders, Crop, RotateCw, Palette, Sparkles,
  Package, Home, Coffee, Wand2, Save, Play,
  Sun, Contrast, Droplets, Image, Type, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface EditOperation {
  type: string;
  params: any;
  aiPowered?: boolean;
}

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  operations: EditOperation[];
  category: 'standard' | 'industry' | 'custom';
}

const industryTemplates: Template[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce Standard',
    icon: <Package className="w-4 h-4" />,
    category: 'industry',
    operations: [
      { type: 'resize', params: { width: 1000, height: 1000 } },
      { type: 'removeBackground', params: {}, aiPowered: true },
      { type: 'enhance', params: { brightness: 10, contrast: 15 } },
      { type: 'compress', params: { quality: 0.9 } }
    ]
  },
  {
    id: 'realestate',
    name: 'Real Estate MLS',
    icon: <Home className="w-4 h-4" />,
    category: 'industry',
    operations: [
      { type: 'resize', params: { width: 1024, height: 768 } },
      { type: 'enhance', params: { brightness: 20, contrast: 10 }, aiPowered: true },
      { type: 'watermark', params: { text: 'Your Agency', position: 'bottom-right' } }
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant Menu',
    icon: <Coffee className="w-4 h-4" />,
    category: 'industry',
    operations: [
      { type: 'crop', params: { aspectRatio: '1:1' } },
      { type: 'enhance', params: { saturation: 20, vibrance: 15 }, aiPowered: true },
      { type: 'resize', params: { width: 800, height: 800 } }
    ]
  }
];

export default function EditPanel({
  onApplyEdits,
  imageCount = 0
}: {
  onApplyEdits: (operations: EditOperation[]) => void;
  imageCount?: number;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customOperations, setCustomOperations] = useState<EditOperation[]>([]);
  const [activeTab, setActiveTab] = useState<'templates' | 'manual'>('templates');

  // Manual edit controls
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [rotation, setRotation] = useState(0);

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template);
    onApplyEdits(template.operations);
  };

  const applyManualEdits = () => {
    const operations: EditOperation[] = [];

    if (brightness !== 0) {
      operations.push({ type: 'brightness', params: { value: brightness } });
    }
    if (contrast !== 0) {
      operations.push({ type: 'contrast', params: { value: contrast } });
    }
    if (saturation !== 0) {
      operations.push({ type: 'saturation', params: { value: saturation } });
    }
    if (rotation !== 0) {
      operations.push({ type: 'rotate', params: { degrees: rotation } });
    }

    setCustomOperations(operations);
    onApplyEdits(operations);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Edit All Images</h2>
        {imageCount > 0 && (
          <p className="text-sm text-gray-600">
            Applying to {imageCount} image{imageCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Wand2 className="w-4 h-4 inline mr-2" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Sliders className="w-4 h-4 inline mr-2" />
          Manual
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Industry Presets</h3>
            <div className="space-y-2">
              {industryTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyTemplate(template)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {template.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{template.name}</p>
                        <p className="text-xs text-gray-500">
                          {template.operations.length} operations
                          {template.operations.some(op => op.aiPowered) && (
                            <span className="ml-2 text-blue-600">
                              <Sparkles className="w-3 h-3 inline" /> AI
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <button
            onClick={() => selectedTemplate && onApplyEdits(selectedTemplate.operations)}
            disabled={!selectedTemplate}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white
                     rounded-lg font-medium hover:from-blue-700 hover:to-blue-800
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Apply Template to All Images
          </button>
        </div>
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          {/* Brightness */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Brightness
              </span>
              <span className="text-xs text-gray-500">{brightness}</span>
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                Contrast
              </span>
              <span className="text-xs text-gray-500">{contrast}</span>
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Saturation
              </span>
              <span className="text-xs text-gray-500">{saturation}</span>
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation
              </span>
              <span className="text-xs text-gray-500">{rotation}°</span>
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <button
              onClick={() => onApplyEdits([{ type: 'removeBackground', params: {}, aiPowered: true }])}
              className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Remove BG
            </button>
            <button
              onClick={() => onApplyEdits([{ type: 'enhance', params: {}, aiPowered: true }])}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              AI Enhance
            </button>
            <button
              onClick={() => onApplyEdits([{ type: 'watermark', params: { text: 'Sample' } }])}
              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Type className="w-4 h-4 inline mr-1" />
              Watermark
            </button>
            <button
              onClick={() => onApplyEdits([{ type: 'compress', params: { quality: 0.8 } }])}
              className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <Image className="w-4 h-4 inline mr-1" />
              Compress
            </button>
          </div>

          <button
            onClick={applyManualEdits}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white
                     rounded-lg font-medium hover:from-blue-700 hover:to-blue-800
                     transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Apply Manual Edits
          </button>
        </div>
      )}

      {/* Save Template Button */}
      <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <Save className="w-4 h-4" />
        Save as Template
      </button>
    </div>
  );
}