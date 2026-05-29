import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await prisma.systemStatus.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!status) {
      return NextResponse.json({
        statusText: 'Active / Exploring generative structures at MAC Ramapuram',
        location: 'MAC Ramapuram',
        availability: 'Open for collaborations',
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to fetch status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status telemetry.' },
      { status: 500 }
    );
  }
}
