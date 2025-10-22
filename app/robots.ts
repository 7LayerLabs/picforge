import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for PicForge
 * Tells search engines what to crawl
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/_next/',
          '/batch-nsfw/', // Don't index NSFW content
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/batch-nsfw/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/batch-nsfw/',
        ],
      },
    ],
    sitemap: 'https://pic-forge.com/sitemap.xml',
  };
}
