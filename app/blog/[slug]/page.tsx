import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const POSTS: Record<string, { title: string; description: string; content: string }> = {
  'getting-started-ai-image-editing': {
    title: 'Getting Started with AI Image Editing',
    description: 'A fast primer on transforming photos with AI and PicForge.',
    content: `
Welcome to PicForge! This quick guide helps you transform your first image using templates or custom prompts. Keep experiments short and iterative for best results.
    `.trim(),
  },
  'batch-processing-workflows': {
    title: 'Time-Saving Batch Processing Workflows',
    description: 'Process dozens of images at once with consistent styles.',
    content: `
Use the Batch tool to upload multiple images and apply the same prompt or style. This is perfect for product shots, headshots, and more.
    `.trim(),
  },
}

type Props = { params: { slug: string } }

export function generateMetadata({ params }: Props): Metadata {
  const post = POSTS[params.slug]
  if (!post) return { title: 'Blog' }
  const url = `https://pic-forge.com/blog/${params.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url },
    twitter: { title: post.title, description: post.description },
  }
}

export default function BlogPost({ params }: Props) {
  const post = POSTS[params.slug]
  if (!post) return notFound()
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1>{post.title}</h1>
        <p className="text-gray-600">{post.description}</p>
        <div className="mt-6 whitespace-pre-line text-gray-800">{post.content}</div>
      </div>
    </div>
  )
}


