import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import StaticHeader from '../../components/StaticHeader';
import Footer from '../../components/Footer';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ArrowRight, Calendar, User, Tag } from 'lucide-react';
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
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: post.canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.canonicalUrl,
      siteName: 'ClickRunClaw',
      images: [
        {
          url: post.image || '/blog-og-clickrunclaw.svg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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

  // Format date nicely if possible
  let formattedDate = post.date;
  try {
    const d = new Date(post.date);
    if (!isNaN(d.getTime())) {
      formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
    }
  } catch (e) {
    // fallback to raw string
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans flex flex-col">
      <StaticHeader />
      
      <main className="flex-grow pt-24 pb-24 px-6 md:px-8 max-w-3xl mx-auto w-full relative z-10">
        
        <article className="w-full">
          {/* Minimalist Header Area */}
          <header className="mb-10 text-center md:text-left">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-coral mb-8 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to all posts
            </Link>

            <div className="mb-6">
              <span className="inline-block rounded-full bg-coral/10 text-coral px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-black tracking-tight font-space text-zinc-900 dark:text-white leading-[1.2] mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{formattedDate}</time>
                </div>
              </div>
            </div>
          </header>

          {/* Large Clean Featured Image */}
          <div className="w-full h-auto aspect-[16/9] relative rounded-2xl overflow-hidden mb-12 shadow-lg border border-zinc-100 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={post.image || '/blog-og-clickrunclaw.svg'}
              alt={post.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
          
          {/* Ultra-readable Content Area */}
          <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none w-full
                          prose-headings:font-space prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white
                          prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-8
                          prose-a:text-coral hover:prose-a:text-coral-hover prose-a:underline prose-a:underline-offset-4 prose-a:decoration-coral/30 hover:prose-a:decoration-coral
                          prose-pre:bg-zinc-50 dark:prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-white/10 prose-pre:rounded-xl
                          prose-code:text-coral dark:prose-code:text-coral-hover prose-code:bg-coral/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                          prose-img:rounded-2xl prose-img:border prose-img:border-zinc-100 dark:prose-img:border-white/5
                          prose-strong:text-zinc-900 dark:prose-strong:text-white prose-strong:font-bold
                          prose-blockquote:border-l-4 prose-blockquote:border-coral prose-blockquote:bg-coral/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-300
                          prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:marker:text-coral">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-3">
              <Tag className="w-4 h-4 text-zinc-400" />
              {post.tags.map((tag) => (
                <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-md text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Clean CTA Section */}
          <section className="mt-16 rounded-3xl bg-zinc-50 dark:bg-[#0D1117] border border-zinc-200 dark:border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
             {/* Subtle brand accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral to-coral-hover" />

            <h2 className="text-2xl md:text-3xl font-black font-space text-zinc-900 dark:text-white mb-4">{post.ctaTitle}</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">{post.ctaText}</p>
            <Link
              href={post.ctaHref || '/'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-base font-bold text-white shadow-lg shadow-coral/20 hover:bg-coral-hover hover:shadow-xl hover:shadow-coral/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
