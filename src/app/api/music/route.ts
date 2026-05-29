import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activeMusic = await prisma.musicEntry.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!activeMusic) {
      return NextResponse.json({
        trackName: 'After Hours',
        artistName: 'The Weeknd',
        albumName: 'After Hours',
        artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
        mood: 'Cinematic night vibes',
        notes: 'Listening to synth waves while writing 3D shader layouts.',
      });
    }

    return NextResponse.json(activeMusic);
  } catch (error) {
    console.error('Failed to fetch listening telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music telemetry.' },
      { status: 500 }
    );
  }
}
