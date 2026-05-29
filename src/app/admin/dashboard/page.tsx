import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'System Control Center // Vasav P Ramesh Dashboard',
  description: 'Manage active portfolios, blogs CMS, listening frequencies, status banners, and visitor comments moderation.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // If no active auth token exists, immediately redirect to login gate
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  // 1. Fetch entire portfolio tables directly on server
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  });

  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const comments = await prisma.comment.findMany({
    include: {
      post: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const status = (await prisma.systemStatus.findFirst()) || {
    statusText: 'Active / Synthesizing neural generative textures at MAC Ramapuram',
    location: 'MAC Ramapuram',
    availability: 'Open for creative technology collaborations',
  };

  const activeMusic = (await prisma.musicEntry.findFirst({
    where: { active: true },
    orderBy: { updatedAt: 'desc' },
  })) || {
    trackName: 'After Hours',
    artistName: 'The Weeknd',
    albumName: 'After Hours',
    artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
    mood: 'Cinematic night vibes',
    notes: 'Listening to synth waves while writing 3D shader layouts.',
  };

  return (
    <DashboardClient
      initialProjects={projects}
      initialBlogPosts={blogPosts}
      initialComments={comments}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialStatus={status as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialMusic={activeMusic as any}
    />
  );
}
