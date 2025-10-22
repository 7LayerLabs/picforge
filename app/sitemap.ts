import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for PicForge
 * Helps Google Search Console index all pages
 *
 * SEO Best Practices:
 * - Priority: 1.0 = most important, 0.0 = least important
 * - Change Frequency: how often page content changes
 * - Last Modified: when page was last updated
 *
 * Priority Guidelines:
 * - Homepage: 1.0
 * - Core features (prompts, batch): 0.9
 * - Secondary features (canvas, roulette): 0.8
 * - Pricing/showcase: 0.7-0.8
 * - Support pages: 0.5-0.6
 * - Legal pages: 0.3
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pic-forge.com';
  const currentDate = new Date();

  // Set last modified dates for different page types
  const recentUpdate = new Date('2025-10-22'); // Major feature updates
  const monthlyUpdate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const weeklyUpdate = new Date(currentDate.setDate(currentDate.getDate() - 7));

  // Main pages with priority and change frequency
  const routes: MetadataRoute.Sitemap = [
    // HOMEPAGE - Highest priority
    {
      url: baseUrl,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // CORE FEATURES - High priority (0.9)
    {
      url: `${baseUrl}/prompts`,
      lastModified: recentUpdate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/batch`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // MAIN FEATURES - Secondary priority (0.8)
    {
      url: `${baseUrl}/canvas`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/roulette`,
      lastModified: recentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prompt-wizard`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // CONTENT PAGES - Medium-high priority (0.7)
    {
      url: `${baseUrl}/examples`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: new Date(), // Updates daily with user submissions
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roast`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // SUPPORT PAGES - Medium priority (0.6)
    {
      url: `${baseUrl}/prompts/favorites`,
      lastModified: weeklyUpdate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // USER PAGES - Lower priority (0.5)
    {
      url: `${baseUrl}/contact`,
      lastModified: monthlyUpdate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // LEGAL PAGES - Lowest priority (0.3)
    {
      url: `${baseUrl}/terms`,
      lastModified: monthlyUpdate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: monthlyUpdate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Note: NSFW pages intentionally excluded from sitemap (noindex)
  // Note: Admin, API, and user-specific pages excluded (see robots.ts)

  return routes;
}
