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
          <header className="mb-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0D1117] shadow-[0_0_60px_rgba(255,90,95,0.05)] relative">
            <div className="absolute inset-0 bg-coral opacity-[0.03] pointer-events-none blur-[100px] rounded-full" />
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-black/50">
              <Image src={post.image || '/blog-og-clickrunclaw.svg'} alt={post.title} fill className="object-cover opacity-80 mix-blend-screen" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-black/40 to-transparent" />
            </div>
            <div className="p-8 md:p-12 relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="rounded-full border border-coral/30 bg-coral/10 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-coral shadow-[0_0_15px_rgba(255,90,95,0.1)]">{post.category}</span>
                <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 uppercase">{post.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-coral/50"></span>
                <span className="text-xs font-bold font-mono tracking-widest text-zinc-400 uppercase">{post.author}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter font-space text-white mb-6 leading-[1.1]">
                {post.title}
              </h1>
              <p className="max-w-3xl text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                {post.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          
          <div className="rounded-[2.5rem] border border-white/10 bg-[#0D1117]/80 backdrop-blur-xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,90,95,0.03),transparent_50%)] pointer-events-none" />
            <div className="prose prose-zinc prose-invert prose-lg max-w-none relative z-10
                            prose-headings:font-space prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                            prose-p:text-zinc-300 prose-p:font-light prose-p:leading-relaxed
                            prose-a:text-coral hover:prose-a:text-coral-hover prose-a:no-underline hover:prose-a:underline
                            prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                            prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-xl
                            prose-strong:text-white prose-strong:font-bold">
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
