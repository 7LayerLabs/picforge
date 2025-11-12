import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Guides, how-tos, and inspiration for AI image creation with PicForge.',
  alternates: { canonical: 'https://pic-forge.com/blog' },
}

const POSTS = [
  {
    slug: 'getting-started-ai-image-editing',
    title: 'Getting Started with AI Image Editing',
    excerpt: 'A fast primer on transforming photos with AI and PicForge.',
  },
  {
    slug: 'batch-processing-workflows',
    title: 'Time-Saving Batch Processing Workflows',
    excerpt: 'Process dozens of images at once with consistent styles.',
  },
]

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">SEO-friendly articles to help you get the most from PicForge.</p>
        <div className="space-y-4">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="block p-5 rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold text-gray-900">{p.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


