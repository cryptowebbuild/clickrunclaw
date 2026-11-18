import type { Metadata } from 'next';
import BlogIndex from '@/app/components/BlogIndex';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Engineering notes | ClickRunClaw',
  description:
    'Technical writing from the ClickRunClaw build team: EU data residency, async delivery, invoice reconciliation agents and the unit economics of custom AI.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Engineering notes | ClickRunClaw',
    description:
      'Technical writing on EU data residency, async delivery and the economics of custom AI agents.',
    url: 'https://clickrunclaw.com/blog',
    type: 'website',
  },
};

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'ClickRunClaw engineering notes',
  url: 'https://clickrunclaw.com/blog',
  publisher: { '@id': 'https://clickrunclaw.com/#organization' },
  blogPost: BLOG_POSTS.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `https://clickrunclaw.com/blog/${post.slug}`,
    author: { '@type': 'Person', name: post.author.name },
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogIndex />
    </>
  );
}
