import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog';

const siteUrl = 'https://clickrunclaw.com';

/**
 * Route-level dates, not `new Date()`. A sitemap that reports every URL as
 * modified today teaches crawlers to ignore the lastmod field entirely.
 */
const STATIC_ROUTES: { path: string; lastModified: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '', lastModified: '2026-11-18', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', lastModified: '2026-11-18', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', lastModified: '2026-11-18', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/case-studies', lastModified: '2026-11-18', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/how-it-works', lastModified: '2026-11-18', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', lastModified: '2026-11-14', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/security', lastModified: '2026-11-18', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy', lastModified: '2026-11-18', priority: 0.4, changeFrequency: 'yearly' as 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
