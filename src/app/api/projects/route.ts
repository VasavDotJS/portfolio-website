import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project files.' },
      { status: 500 }
    );
  }
}
