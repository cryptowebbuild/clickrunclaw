import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | ClickRunClaw Blog`,
    description: post.description,
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans">
      <Header />
      
      <main className="pt-32 pb-24 px-6 md:px-8 max-w-3xl mx-auto relative z-10">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-coral mb-12 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>
        
        <article className="px-1 md:px-0">
          <header className="mb-14">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-space text-zinc-900 dark:text-white mb-6 leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                {post.date}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-coral/50"></span>
              <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                {post.author}
              </span>
            </div>
          </header>
          
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                          prose-headings:font-space prose-headings:font-bold prose-headings:tracking-tight 
                          prose-a:text-coral hover:prose-a:text-coral-hover prose-a:no-underline hover:prose-a:underline
                          prose-pre:bg-[#111318] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                          prose-img:rounded-3xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
