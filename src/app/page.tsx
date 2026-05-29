'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HUDLoader from '@/components/HUDLoader';
import Scene3D from '@/components/Scene3D';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import CurrentlyListening from '@/components/Music';
import BlogFeed from '@/components/BlogFeed';
import Contact from '@/components/Contact';
import { Terminal, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <HUDLoader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Sticky Editorial Navigation Header */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#0b0b0c]/40 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="font-mono text-sm font-black tracking-widest uppercase hover:text-[#ff5d22] duration-300 interactive cursor-pointer"
                >
                  VASAV // .
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse hidden sm:inline-block" />
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest hidden sm:inline-block">
                  System active
                </span>
              </div>

              {/* Navigation Nodes */}
              <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-wider text-white/50">
                <button
                  onClick={() =>
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="hover:text-white duration-300 interactive cursor-pointer"
                >
                  Identity
                </button>
                <button
                  onClick={() =>
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="hover:text-white duration-300 interactive cursor-pointer"
                >
                  Inventions
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('blog-section')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="hover:text-white duration-300 interactive cursor-pointer"
                >
                  Broadcasts
                </button>
                <button
                  onClick={() =>
                    document.getElementById('listening')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="hover:text-white duration-300 interactive cursor-pointer"
                >
                  Atmosphere
                </button>
                <button
                  onClick={() =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="hover:text-white duration-300 interactive cursor-pointer"
                >
                  Console
                </button>
              </nav>

              {/* Admin Portal Gateway Link */}
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/dashboard"
                  className="glass-panel border-white/10 hover:border-[#ff5d22]/40 px-3 py-1.5 rounded text-[9px] font-mono uppercase tracking-widest text-white/60 hover:text-white duration-300 flex items-center gap-1.5 interactive"
                >
                  <Shield size={10} className="text-[#ff5d22]" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            </header>

            {/* Immersive 3D Space Background */}
            <Scene3D />

            {/* Cinematic Content Flow */}
            <div className="relative z-10 w-full overflow-hidden">
              <Hero />
              <About />
              <Projects />
              <CurrentlyListening />
              <BlogFeed />
              <Contact />

              {/* Cinematic brutalist footer */}
              <footer className="border-t border-white/5 bg-[#080809] py-12 px-6 md:px-12 lg:px-24 font-mono text-[9px] text-white/35 flex flex-col md:flex-row justify-between items-center gap-6 select-none">
                <div className="space-y-1 text-center md:text-left">
                  <div>© 2026 VASAV P RAMESH. ALL RIGHTS RESERVED.</div>
                  <div>LOC: CHENNAI, IND // 12.9818° N, 80.1636° E</div>
                </div>
                <div className="flex items-center gap-2 border border-white/5 bg-white/2 px-3 py-1 rounded">
                  <Terminal size={10} className="text-[#ff5d22]" />
                  <span>DESIGNED BY ANTIGRAVITY &amp; VASAV // PROD NODE READY</span>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
