'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Disc, Sparkles } from 'lucide-react';

interface MusicData {
  trackName: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  mood?: string | null;
  notes?: string | null;
}

export default function CurrentlyListening() {
  const [track, setTrack] = useState<MusicData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    // 1. Fetch current database music logs
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => setTrack(data))
      .catch(() => {
        setTrack({
          trackName: 'After Hours',
          artistName: 'The Weeknd',
          albumName: 'After Hours',
          artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
          mood: 'Introspective night drives',
          notes: 'Synthesizing visualizers and tweaking shaders at 3 AM.',
        });
      });
  }, []);

  useEffect(() => {
    // 2. Interactive Audio Waveform Canvas Animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    canvas.height = 80;

    // Track resize
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 400;
    };
    window.addEventListener('resize', handleResize);

    const barCount = 48;
    const barWidth = 3;
    const gap = 4;
    const amplitudes = new Array(barCount).fill(5);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', onMouseMove);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        // Calculate ambient sine oscillations
        let targetHeight =
          Math.sin(time * 0.005 + i * 0.2) * 15 +
          Math.cos(time * 0.003 - i * 0.1) * 8 +
          18;

        // If cursor is hovering, amplify bars based on physical distance to cursor
        if (isHovered.current) {
          const barX = (width / barCount) * i;
          const dist = Math.abs(mousePos.current.x - barX);
          if (dist < 100) {
            const factor = (100 - dist) / 100;
            targetHeight += factor * 35 * (Math.sin(time * 0.02) + 1.2);
          }
        }

        // Dampen amplitudes toward target values
        amplitudes[i] += (targetHeight - amplitudes[i]) * 0.2;

        const h = Math.max(4, amplitudes[i]);
        const x = (width / barCount) * i + (width / barCount - barWidth) / 2;
        const y = canvas.height / 2 - h / 2;

        // Draw visualizer bars
        ctx.fillStyle = isHovered.current
          ? `rgba(255, 93, 34, ${0.4 + (h / 65) * 0.6})`
          : `rgba(255, 255, 255, ${0.15 + (h / 45) * 0.45})`;

        ctx.fillRect(x, y, barWidth, h);
      }

      animId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [track]);

  if (!track) return null;

  return (
    <section
      id="listening"
      className="relative py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 select-none"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <Music size={12} className="animate-pulse" />
            <span>03 // FREQUENCY // ATMOSPHERE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
            Currently <br />
            <span className="text-stroke-white text-white/5">Listening</span>
          </h2>
        </div>

        {/* High-Fi Deck Card */}
        <div
          onMouseEnter={() => {
            isHovered.current = true;
          }}
          onMouseLeave={() => {
            isHovered.current = false;
          }}
          className="glass-panel border-white/5 hover:border-[#ff5d22]/20 rounded-lg p-6 md:p-8 relative overflow-hidden group duration-500 glow-orange flex flex-col md:flex-row gap-8 items-center"
        >
          {/* Vinyl spinning representation */}
          <div className="relative w-44 h-44 flex-shrink-0 cursor-default select-none">
            {/* Spinning disc back */}
            <div className="absolute inset-0 bg-[#161618] rounded-full border border-white/10 flex items-center justify-center animate-spin [animation-duration:8s] shadow-2xl group-hover:[animation-duration:4s] duration-1000">
              <div className="w-40 h-40 rounded-full border border-black/80 flex items-center justify-center relative bg-radial from-transparent to-black">
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-white/5" />
                <div className="absolute inset-6 rounded-full border border-white/5" />
                <div className="absolute inset-10 rounded-full border border-white/5" />
                <div className="absolute inset-14 rounded-full border border-white/5" />
              </div>
            </div>

            {/* Inner album cover */}
            <div className="absolute inset-8 rounded-full overflow-hidden border border-black shadow-lg flex items-center justify-center bg-black/50 z-10 animate-spin [animation-duration:8s] group-hover:[animation-duration:4s] duration-1000">
              <img
                src={track.artworkUrl}
                alt={track.albumName}
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute w-4 h-4 bg-[#0b0b0c] border border-white/20 rounded-full z-20" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6 w-full text-center md:text-left select-none">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-[#ff5d22] uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles size={10} className="animate-spin" /> Live Telemetry Broadcast
              </div>
              <h3 className="text-2xl font-mono font-black text-white tracking-tight uppercase">
                {track.trackName}
              </h3>
              <p className="text-sm font-mono text-white/50">
                {track.artistName} — <span className="italic">{track.albumName}</span>
              </p>
            </div>

            {track.mood && (
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Signal Mood
                </div>
                <p className="text-xs font-mono text-[#ff5d22]/80 uppercase font-semibold">
                  &lt; {track.mood} &gt;
                </p>
              </div>
            )}

            {track.notes && (
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Personal Insights
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl italic">
                  &quot;{track.notes}&quot;
                </p>
              </div>
            )}

            {/* Waveform Visualization Canvas Container */}
            <div className="w-full pt-4 border-t border-white/5">
              <canvas
                ref={canvasRef}
                className="w-full h-16 pointer-events-auto cursor-pointer"
              />
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest text-center mt-2">
                [ Interactive Visualizer // Hover cursor near wave to interact ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
