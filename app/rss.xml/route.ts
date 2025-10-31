import { NextResponse } from 'next/server'

const POSTS = [
  {
    slug: 'getting-started-ai-image-editing',
    title: 'Getting Started with AI Image Editing',
    description: 'A fast primer on transforming photos with AI and PicForge.',
    date: '2025-01-15'
  },
  {
    slug: 'batch-processing-workflows',
    title: 'Time-Saving Batch Processing Workflows',
    description: 'Process dozens of images at once with consistent styles.',
    date: '2025-01-20'
  }
]

export async function GET() {
  const baseUrl = 'https://pic-forge.com'
  const items = POSTS.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid>${baseUrl}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>
  `).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>PicForge Blog</title>
      <link>${baseUrl}/blog</link>
      <description>Guides and updates from PicForge</description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  })
}


