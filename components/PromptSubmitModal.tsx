'use client';

import { useState } from 'react';

interface PromptSubmitModalProps {
  categories: string[];
  onClose: () => void;
}

export default function PromptSubmitModal({ categories, onClose }: PromptSubmitModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0] || '',
    subject: '',
    mood: '',
    composition: '',
    tags: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log('Submitted prompt:', formData);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 text-black p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Submit Your Prompt</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-black mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-4">Your prompt has been submitted and will be reviewed for potential inclusion in our library.</p>
            <p className="text-gray-500 text-sm">We may feature amazing community prompts as &quot;Prompt of the Day&quot;!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-black font-semibold mb-2">Prompt Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 'Retro 80s Neon Effect'"
                required
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-black font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this prompt does..."
                required
                rows={3}
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-black font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white text-black rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subject & Setting */}
            <div>
              <label className="block text-black font-semibold mb-2">Subject & Setting *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is the subject or scene?"
                required
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Mood & Lighting */}
            <div>
              <label className="block text-black font-semibold mb-2">Mood & Lighting *</label>
              <input
                type="text"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                placeholder="e.g., 'Warm, golden hour lighting'"
                required
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Composition */}
            <div>
              <label className="block text-black font-semibold mb-2">Composition *</label>
              <input
                type="text"
                name="composition"
                value={formData.composition}
                onChange={handleChange}
                placeholder="e.g., 'Wide shot with subject centered'"
                required
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-black font-semibold mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., 'vintage, aesthetic, colorful'"
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-black font-semibold mb-2">Your Email (optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="We'll credit you if your prompt is featured"
                className="w-full px-4 py-2 bg-white text-black placeholder-gray-400 rounded border border-gray-300 focus:border-teal-600 focus:outline-none"
              />
            </div>

            {/* Help Text */}
            <div className="bg-gray-50 rounded p-4 border border-gray-200">
              <p className="text-gray-600 text-sm">
                <strong>💡 Tip:</strong> Great prompts are specific and descriptive. Include details about the visual style, mood, and composition.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition"
              >
                Submit Prompt
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
