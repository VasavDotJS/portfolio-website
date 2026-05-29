import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import MarkdownIt from 'markdown-it';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import CommentForm from '@/components/CommentForm';
import { ArrowLeft, Calendar, Clock, MessageSquare, User } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) {
    return {
      title: 'Broadcast Not Found // Vasav P Ramesh Archive',
    };
  }

  return {
    title: `${post.title} // Vasav P Ramesh Broadcasts`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} // Vasav P Ramesh Broadcasts`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: ['Vasav P Ramesh'],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Parse Markdown into secure HTML
  const md = new MarkdownIt({ html: true, linkify: true });
  const parsedContent = md.render(post.content);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f3f3f3] py-24 px-6 md:px-12 lg:px-24 select-none relative">
      {/* Scroll indicator */}
      <ReadingProgressBar />

      {/* Aesthetic terminal backgrounds */}
      <div className="noise-overlay" />
      <div className="crt-overlay crt-flicker" />

      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        {/* Navigation Return */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white duration-300 interactive group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 duration-300" />
          <span>RETURN TO ESSAY ARCHIVES</span>
        </Link>

        {/* Article Title Header */}
        <header className="space-y-6 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#ff5d22]/10 border border-[#ff5d22]/20 px-2.5 py-0.5 rounded text-[8px] font-mono text-[#ff5d22] uppercase tracking-widest">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              <Clock size={12} />
              <span>{post.readingTime} MIN READ</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-mono font-black text-white leading-tight uppercase tracking-tight">
            {post.title}
          </h1>
        </header>

        {/* Dynamic parsed HTML blocks */}
        <article
          className="markdown-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />

        {/* Community Comments Section */}
        <section className="pt-16 border-t border-white/10 space-y-8 select-none">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <MessageSquare size={16} className="text-[#ff5d22]" />
            <h3 className="text-md font-mono font-bold tracking-tight uppercase text-white/90">
              Community Decoders ({post.comments.length})
            </h3>
          </div>

          {/* Comments listings */}
          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const commentDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={comment.id}
                    className="glass-panel border-white/5 p-4 rounded-lg space-y-2 select-none"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                      <div className="flex items-center gap-1.5 text-white/70">
                        <User size={10} className="text-[#ff5d22]" />
                        <span className="font-bold">{comment.authorName}</span>
                      </div>
                      <span>{commentDate}</span>
                    </div>
                    <p className="text-xs font-sans text-white/60 leading-relaxed pl-4 border-l border-[#ff5d22]/30">
                      {comment.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs font-mono text-white/30 italic text-center py-6">
                [ No comments validated. Be the first to broadcast a comment signal. ]
              </p>
            )}
          </div>

          {/* Comment Form Submit Block */}
          <CommentForm postId={post.id} />
        </section>
      </div>
    </div>
  );
}
