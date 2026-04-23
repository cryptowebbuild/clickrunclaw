import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/blog');
const siteUrl = 'https://clickrunclaw.com';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  content: string;
  category: string;
  tags: string[];
  canonicalUrl: string;
  keywords: string[];
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return [];

  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const tags = Array.isArray(matterResult.data.tags) ? matterResult.data.tags.map(String) : [];
      const keywords = Array.isArray(matterResult.data.keywords) ? matterResult.data.keywords.map(String) : tags;

      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        description: matterResult.data.description || '',
        date: matterResult.data.date || 'Unknown Date',
        author: matterResult.data.author || 'ClickRunClaw Team',
        image: matterResult.data.image || `https://picsum.photos/seed/${slug}/1200/630`,
        content: matterResult.content,
        category: matterResult.data.category || 'OpenClaw Hosting',
        tags,
        canonicalUrl: matterResult.data.canonicalUrl || `${siteUrl}/blog/${slug}`,
        keywords,
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
