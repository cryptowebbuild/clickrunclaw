import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';
import { BLOG_POSTS, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | ClickRunClaw',
      description: 'The requested engineering research article was not found.',
    };
  }

  const articleUrl = `https://clickrunclaw.com/blog/${post.slug}`;

  // Long editorial headlines lose the brand suffix rather than being cut mid-phrase.
  const metaTitle = post.title.length > 52 ? post.title : `${post.title} | ClickRunClaw`;
  const metaDescription =
    post.excerpt.length > 158
      ? `${post.excerpt.slice(0, 155).replace(/\s+\S*$/, '')}…`
      : post.excerpt;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      url: articleUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.keywords,
      images: [
        {
          url: 'https://clickrunclaw.com/og.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      images: ['https://clickrunclaw.com/og.png'],
      creator: '@clickrunclaw',
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, 2);


  const articleUrl = `https://clickrunclaw.com/blog/${post.slug}`;

  // Helper function to format rich article content including headers, lists, blockquotes, and tables
  const renderContent = (content: string) => {
    const rawLines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i].trim();

      // Heading 2
      if (line.startsWith('## ')) {
        const headingMatch = line.match(/^##\s+(.+?)(?:\s+\{#(.+?)\})?$/);
        const headingText = headingMatch ? headingMatch[1] : line.replace('## ', '');
        const headingId = headingMatch && headingMatch[2] ? headingMatch[2] : undefined;
        elements.push(
          <h2
            key={`h2-${i}`}
            id={headingId}
            className="text-2xl sm:text-3xl font-black font-space text-white mt-12 mb-5 pt-4 border-t border-white/5 scroll-mt-24 tracking-tight"
          >
            {headingText}
          </h2>
        );
        i++;
        continue;
      }

      // Heading 3
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-xl sm:text-2xl font-bold font-space text-white mt-8 mb-4 tracking-tight"
          >
            {line.replace('### ', '')}
          </h3>
        );
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-6 p-5 rounded-2xl bg-[#FF5A5F]/10 border-l-4 border-[#FF5A5F] text-sm text-zinc-200 leading-relaxed italic"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
        i++;
        continue;
      }

      // Code / Diagram block
      if (line.startsWith('```')) {
        i++;
        const codeLines: string[] = [];
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        if (i < rawLines.length) i++; // skip closing ```
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-6 p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // Markdown Table
      if (line.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const parseRow = (r: string) =>
            r
              .split('|')
              .slice(1, -1)
              .map((cell) => cell.trim());

          const headerCells = parseRow(tableLines[0]);
          const bodyRows = tableLines.slice(2).map(parseRow);

          elements.push(
            <div key={`table-${i}`} className="my-8 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-zinc-400 font-mono uppercase text-[11px]">
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="py-3 px-4 font-bold text-white">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-3 px-4 text-zinc-300 font-mono text-xs">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // List Items (Unordered or Numbered)
      if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s+/.test(line)) {
        const listItems: React.ReactNode[] = [];
        let listIdx = 0;
        while (
          i < rawLines.length &&
          (rawLines[i].trim().startsWith('- ') ||
            rawLines[i].trim().startsWith('* ') ||
            /^\d+\.\s+/.test(rawLines[i].trim()))
        ) {
          const itemText = rawLines[i].trim();
          const isNum = /^\d+\.\s+/.test(itemText);
          const numMatch = isNum ? itemText.match(/^(\d+)\.\s+(.*)$/) : null;

          listItems.push(
            <li key={`item-${listIdx}`} className="flex items-start gap-2.5 text-sm text-zinc-300">
              {isNum ? (
                <span className="w-5 h-5 rounded-full bg-white/10 text-[#FF5A5F] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {numMatch ? numMatch[1] : listIdx + 1}
                </span>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
              )}
              <span>{isNum && numMatch ? numMatch[2] : itemText.replace(/^[-*]\s+/, '')}</span>
            </li>
          );
          listIdx++;
          i++;
        }
        elements.push(
          <ul key={`list-${i}`} className="space-y-2.5 my-5 pl-1">
            {listItems}
          </ul>
        );
        continue;
      }

      // Normal paragraph
      if (line.length > 0) {
        elements.push(
          <p
            key={`p-${i}`}
            className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal my-4"
          >
            {line}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
      </div>

      <StaticHeader />

      {/* JSON-LD Structured Data for BlogPosting and Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: 'https://clickrunclaw.com/og.png',
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: {
                '@type': 'Organization',
                name: post.author.name,
                url: 'https://clickrunclaw.com',
              },
              publisher: {
                '@type': 'Organization',
                name: 'ClickRunClaw',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://clickrunclaw.com/icon.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': articleUrl,
              },
              keywords: post.keywords.join(', '),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://clickrunclaw.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Blog & Research',
                  item: 'https://clickrunclaw.com/blog',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: post.title,
                  item: articleUrl,
                },
              ],
            },
          ]),
        }}
      />

      <main id="main" className="relative z-10 pt-16 pb-24">
        {/* ============================================================ */}
        {/* ARTICLE HEADER & BREADCRUMBS                                */}
        {/* ============================================================ */}
        <div className="max-w-5xl mx-auto px-6 mb-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog &amp; Research
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FF5A5F] truncate max-w-xs">{post.category}</span>
          </nav>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] font-bold">
              {post.category}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-space text-white tracking-tight leading-[1.15] mb-6">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-base sm:text-xl text-zinc-400 leading-relaxed font-normal mb-8">
            {post.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between py-6 border-y border-white/10 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-[#090A0F] flex items-center justify-center shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-bold font-space text-white">
                  {post.author.name}
                </div>
                <div className="text-xs text-zinc-400">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5A5F]/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy This Architecture</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN ARTICLE BODY & SIDEBAR                                 */}
        {/* ============================================================ */}
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Article Content (8 Cols) */}
          <article className="lg:col-span-8 bg-[#111318]/60 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            {renderContent(post.content)}

            {/* Mid-Article Conversion Box */}
            <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#141824] to-[#0D1117] border border-[#FF5A5F]/40 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>7-Day Turnaround Guarantee</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-space text-white">
                Need an identical sovereign agent deployed for your company?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Skip months of meetings. Fill out our 8-minute written spec form to receive a complete architecture sequence and guaranteed USD quote within 24 hours.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#FF5A5F]/20"
              >
                <span>Submit 8-Minute Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tags footer */}
            <div className="pt-8 mt-10 border-t border-white/10">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Related Topics &amp; Schemas:
              </div>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sticky Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
                <span>Table of Contents</span>
              </h4>
              <nav aria-label="Table of contents" className="space-y-2">
                {post.tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-xs text-zinc-400 hover:text-[#FF5A5F] transition-colors leading-relaxed hover:translate-x-1 transition-transform"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Calculator Teaser */}
            <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Automation Yield</span>
              </div>
              <h4 className="text-base font-bold font-space text-white">
                How much could your team save?
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Use our interactive simulator to calculate monthly hours reclaimed and 1st-year net financial ROI.
              </p>
              <Link
                href="/pricing"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
              >
                <span>Launch ROI Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Direct Consultation Link */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-xs text-zinc-400">
                Questions about European data isolation?
              </div>
              <a
                href="mailto:support@clickrunclaw.com"
                className="text-xs text-[#FF5A5F] hover:underline font-bold block"
              >
                support@clickrunclaw.com &rarr;
              </a>
            </div>
          </aside>
        </div>

        {/* ============================================================ */}
        {/* RELATED ARTICLES                                            */}
        {/* ============================================================ */}
        {relatedPosts.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 pt-20">
            <h3 className="text-2xl font-black font-space text-white mb-8 pb-4 border-b border-white/10">
              Related Research &amp; Blueprints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-all group"
                >
                  <div className="text-xs font-mono text-[#FF5A5F] font-bold">
                    {rel.category} &bull; {rel.readTime}
                  </div>
                  <h4 className="text-lg font-bold font-space text-white group-hover:text-[#FF5A5F] transition-colors leading-snug">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A5F] pt-2"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
