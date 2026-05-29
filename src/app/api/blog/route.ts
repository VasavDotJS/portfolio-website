import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article libraries.' },
      { status: 500 }
    );
  }
}
