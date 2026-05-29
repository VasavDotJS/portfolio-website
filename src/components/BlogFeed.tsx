'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: number;
  createdAt: string;
}

export default function BlogFeed() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        // Limit to latest 3 posts on homepage
        setPosts(data.slice(0, 3));
      })
      .catch((err) => console.error('Failed to load blog feed:', err));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      id="blog-section"
      className="relative py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 select-none"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest">
              04 // BROADCAST // EDITORIAL
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
              Theoretical <br />
              <span className="text-stroke-white text-white/5">Broadcasts</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="text-xs font-mono text-white/50 hover:text-white border border-white/10 hover:border-[#ff5d22]/50 px-4 py-2 rounded transition-all duration-300 flex items-center gap-1.5 interactive cursor-pointer"
          >
            <span>Browse Full Library</span>
            <ArrowUpRight size={12} className="text-white/40 group-hover:text-white" />
          </Link>
        </div>

        {/* Editorial Feed List */}
        <div className="divide-y divide-white/5">
          {posts.map((post, idx) => {
            const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="py-8 first:pt-0 last:pb-0 group"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block space-y-4 interactive cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Title and Category */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-[#ff5d22]/10 border border-[#ff5d22]/20 px-2 py-0.5 rounded text-[8px] font-mono text-[#ff5d22] uppercase tracking-widest">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30">
                          <Calendar size={10} />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <h3 className="text-lg md:text-xl font-mono font-bold text-white/90 group-hover:text-[#ff5d22] duration-300 leading-snug">
                        {post.title}
                      </h3>
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex items-center gap-4 text-xs font-mono text-white/30 md:self-start">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{post.readingTime} MIN</span>
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
