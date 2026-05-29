import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Terminal, Calendar, Clock, ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0; // Ensure fresh articles are loaded

export const metadata: Metadata = {
  title: 'Theoretical Broadcasts // Vasav P Ramesh Blog Archive',
  description:
    'Read theoretical essays and technical articles by Vasav P Ramesh. Covering the philosophy of creative WebGL design, AI fine-tuning metrics, and deep learning algorithms.',
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f3f3f3] py-24 px-6 md:px-12 lg:px-24 select-none relative">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      <div className="crt-overlay crt-flicker" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* Navigation back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white duration-300 interactive group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 duration-300" />
          <span>RETURN TO INTEGRATED PORTAL</span>
        </Link>

        {/* Title */}
        <div className="space-y-4">
          <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <Terminal size={12} className="animate-pulse" />
            <span>04 // DIGITAL ARCHIVES // ESSAYS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-none">
            Theoretical <br />
            <span className="text-stroke-white text-white/5">Broadcasts</span>
          </h1>
          <p className="font-mono text-xs text-white/40 tracking-tight max-w-xl">
            An introspective archive documenting experiments in WebGL pipelines, deep learning telemetry classifications, and visual philosophy.
          </p>
        </div>

        {/* Articles Grid List */}
        <div className="divide-y divide-white/5 pt-6">
          {posts.length > 0 ? (
            posts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <article key={post.id} className="py-10 first:pt-0 last:pb-0 group">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block space-y-4 interactive cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Title and details */}
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-[#ff5d22]/10 border border-[#ff5d22]/20 px-2 py-0.5 rounded text-[8px] font-mono text-[#ff5d22] uppercase tracking-widest">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30">
                            <Calendar size={10} />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-white/90 group-hover:text-[#ff5d22] duration-300 leading-snug">
                          {post.title}
                        </h2>
                      </div>

                      {/* Info items */}
                      <div className="flex items-center gap-4 text-xs font-mono text-white/30 md:self-start">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{post.readingTime} MIN READ</span>
                        </div>
                        <div className="p-2 border border-white/5 group-hover:border-[#ff5d22]/50 group-hover:bg-[#ff5d22]/5 rounded-full text-white/40 group-hover:text-white duration-300">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-sans max-w-3xl">
                      {post.excerpt}
                    </p>
                  </Link>
                </article>
              );
            })
          ) : (
            <div className="text-center py-16 text-xs font-mono text-white/30">
              No theoretical broadcasts compiled at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
