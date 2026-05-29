'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, MapPin, Sparkles, ArrowDown } from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface StatusData {
  statusText: string;
  location: string;
  availability: string;
}

export default function Hero() {
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => {
        setStatus({
          statusText: 'Active // Synthesizing deep learning models at MAC Ramapuram',
          location: 'MAC Ramapuram',
          availability: 'Open for creative collaboration',
        });
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 },
    },
  } as const;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Large Typography */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 space-y-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#ff5d22] uppercase">
            <Sparkles size={10} className="animate-spin" />
            <span>Digital Archive // Established 2026</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter uppercase leading-none"
          >
            Vasav P <br />
            <span className="text-stroke-white text-white/5 font-extrabold transition-all duration-300">Ramesh</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-mono text-white/60 tracking-tight max-w-xl"
          >
            Creative Developer &amp; Artistic Technologist specializing in the intersection of Artificial Intelligence, deep learning telemetry, and WebGL architectures.
          </motion.p>

          {/* Social Links Network */}
          <motion.div variants={itemVariants} className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/vasav-p-ramesh-88446131b/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel hover:border-[#ff5d22]/50 p-3 rounded-full text-white/60 hover:text-white duration-300 interactive flex items-center justify-center"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://github.com/VasavDotJS"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel hover:border-[#ff5d22]/50 p-3 rounded-full text-white/60 hover:text-white duration-300 interactive flex items-center justify-center"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.instagram.com/vlonevasu/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel hover:border-[#ff5d22]/50 p-3 rounded-full text-white/60 hover:text-white duration-300 interactive flex items-center justify-center"
            >
              <InstagramIcon />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Cybernetic HUD Telemetry Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:col-span-4 w-full h-full flex justify-center lg:justify-end items-center"
        >
          <div className="w-full max-w-sm glass-panel border-white/10 rounded-lg p-6 space-y-6 glow-orange select-none">
            {/* Terminal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5">
                <Terminal size={12} className="text-[#ff5d22]" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                  HUD // SYSTEM CORE
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              </div>
            </div>

            {/* Terminal Body */}
            <div className="font-mono text-xs space-y-4">
              <div className="space-y-1">
                <div className="text-white/40 uppercase text-[9px] tracking-widest">
                  Status Telemetry
                </div>
                <div className="text-white/90 leading-relaxed">
                  {status ? status.statusText : 'CONNECTING...'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-white/40 uppercase text-[9px] tracking-widest flex items-center gap-1">
                    <MapPin size={9} /> Location
                  </div>
                  <div className="text-white/90">
                    {status ? status.location : 'MAC Ramapuram'}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-white/40 uppercase text-[9px] tracking-widest">
                    Academic Node
                  </div>
                  <div className="text-white/90">MAC Ramapuram</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-white/40 uppercase text-[9px] tracking-widest">
                  Academics
                </div>
                <div className="text-white/90">BCA (AI/ML &amp; Data Science)</div>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                    {status ? status.availability : 'ONLINE'}
                  </span>
                </div>
                <span className="text-[10px] text-white/30 uppercase">
                  HOST STABLE
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Down Scroll indicator */}
      <div className="flex justify-center items-center w-full z-10 mt-6 lg:mt-0">
        <button
          onClick={() => {
            const element = document.getElementById('about');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-white/30 hover:text-[#ff5d22] flex flex-col items-center gap-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 interactive cursor-pointer"
        >
          <span>Scroll to enter archive</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
