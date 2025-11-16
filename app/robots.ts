import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for PicForge
 * Optimized for search engine crawling and SEO
 *
 * Key optimizations:
 * - Allow all major search engines to crawl public pages
 * - Block admin, API, and user-specific pages
 * - Specify crawl delay to prevent server overload
 * - Multiple user agent rules for different bots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General bots - most restrictive
      {
        userAgent: '*',
        allow: [
          '/',
          '/prompts',
          '/batch',
          '/canvas',
          '/roulette',
          '/roast',
          '/prompt-wizard',
          '/examples',
          '/tips',
          '/showcase',
          '/pricing',
          '/contact',
          '/terms',
          '/privacy',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/my-images/',
          '/_next/',
          '/success/',
          '/referral/',
          '/email-preferences/',
        ],
        crawlDelay: 1, // Seconds between requests
      },
      // Google's main crawler - most important
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/prompts',
          '/prompts/favorites',
          '/batch',
          '/canvas',
          '/roulette',
          '/roast',
          '/prompt-wizard',
          '/examples',
          '/tips',
          '/showcase',
          '/pricing',
          '/contact',
          '/terms',
          '/privacy',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/static/',
          '/success/',
          '/referral/',
          '/email-preferences/',
        ],
      },
      // Google Image Search - allow image indexing
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/examples',
          '/showcase',
          '/prompts',
        ],
        disallow: [
          '/api/',
          '/my-images/',
        ],
      },
      // Bing crawler
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/prompts',
          '/batch',
          '/canvas',
          '/roulette',
          '/examples',
          '/showcase',
        ],
        disallow: [
          '/api/',
          '/admin/',
        ],
        crawlDelay: 1,
      },
      // Block bad bots and scrapers
      {
        userAgent: [
          'GPTBot', // OpenAI crawler
          'CCBot', // Common Crawl
          'ChatGPT-User', // ChatGPT
          'Google-Extended', // Google's AI training
          'anthropic-ai', // Anthropic's crawler
          'Claude-Web', // Claude's crawler
          'cohere-ai', // Cohere's crawler
          'Omgilibot', // Content aggregator
          'FacebookBot', // Facebook crawler
          'Bytespider', // TikTok/ByteDance crawler
        ],
        disallow: '/',
        crawlDelay: 10,
      },
    ],
    sitemap: 'https://pic-forge.com/sitemap.xml',
    host: 'https://pic-forge.com', // Preferred domain
  };
}
