import { getAllPosts } from '@/lib/blog';
import BlogIndexClient from './BlogIndexClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ClickRunClaw AI Cloud Hosting',
  description: 'Learn how to deploy, scale, and manage OpenClaw AI agents with actionable insights, tutorials, and guides.',
};

export default function BlogPage() {
  const blogPosts = getAllPosts();

  // Strip content to minimize payload size
  const sanitizedPosts = blogPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    author: post.author,
    image: post.image,
    content: '',
    category: post.category,
    tags: post.tags,
    canonicalUrl: post.canonicalUrl,
    keywords: post.keywords,
  }));

  return <BlogIndexClient blogPosts={sanitizedPosts} />;
}
