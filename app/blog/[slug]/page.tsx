import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import StaticHeader from '../../components/StaticHeader';
import Footer from '../../components/Footer';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ArrowRight } from 'lucide-react';
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
    alternates: {
      canonical: post.canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonicalUrl,
      images: [post.image || '/blog-og-clickrunclaw.svg'],
    },
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
      <StaticHeader />
      
      <main className="pt-32 pb-24 px-6 md:px-8 max-w-4xl mx-auto relative z-10">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-coral mb-12 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </Link>
        
        <article className="px-4 md:px-0">
          <header className="mb-12 overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111318] shadow-sm">
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image src={post.image || '/blog-og-clickrunclaw.svg'} alt={post.title} fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="rounded-full border border-coral/20 bg-coral/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-coral">{post.category}</span>
                <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">{post.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-coral/50"></span>
                <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">{post.author}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-space text-zinc-900 dark:text-white mb-5 leading-[1.05]">
                {post.title}
              </h1>
              <p className="max-w-3xl text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          
          <div className="rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111318] p-6 md:p-10 shadow-sm">
            <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                            prose-headings:font-space prose-headings:font-bold prose-headings:tracking-tight 
                            prose-a:text-coral hover:prose-a:text-coral-hover prose-a:no-underline hover:prose-a:underline
                            prose-pre:bg-[#111318] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                            prose-img:rounded-3xl">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>

          <section className="mt-10 rounded-[2rem] border border-coral/20 bg-gradient-to-br from-coral/10 to-white dark:to-[#111318] p-6 md:p-8 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-widest text-coral">Next step</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-black font-space text-zinc-900 dark:text-white">{post.ctaTitle}</h2>
            <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed">{post.ctaText}</p>
            <Link href={post.ctaHref || '/'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white shadow-[0_4px_18px_rgba(255,90,95,0.25)] hover:bg-coral-hover transition-colors">
              Join Priority Waitlist
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
