'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Monitor, Terminal, HelpCircle, FileText, Music, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommandItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  const toggleCRT = () => {
    const crt = document.getElementById('crt-overlay-layer');
    if (crt) {
      if (crt.style.display === 'none') {
        crt.style.display = 'block';
      } else {
        crt.style.display = 'none';
      }
    }
  };

  const triggerGlitchConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#000000', '#ff5d22', '#212124'],
    });
    setIsOpen(false);
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${id}`);
    }
  };

  const commands: CommandItem[] = [
    {
      category: 'Navigation',
      label: 'Jump to Home',
      icon: Terminal,
      action: () => scrollToSection('hero'),
    },
    {
      category: 'Navigation',
      label: 'Jump to About Identity',
      icon: HelpCircle,
      action: () => scrollToSection('about'),
    },
    {
      category: 'Navigation',
      label: 'Jump to Project Showcase',
      icon: FileText,
      action: () => scrollToSection('projects'),
    },
    {
      category: 'Navigation',
      label: 'Jump to Editorial Blog',
      icon: FileText,
      action: () => scrollToSection('blog-section'),
    },
    {
      category: 'Navigation',
      label: 'Jump to Currently Listening',
      icon: Music,
      action: () => scrollToSection('listening'),
    },
    {
      category: 'Navigation',
      label: 'Jump to Contact Console',
      icon: Terminal,
      action: () => scrollToSection('contact'),
    },
    {
      category: 'System Diagnostics',
      label: 'Toggle Analog CRT Scanlines',
      icon: Monitor,
      action: () => {
        toggleCRT();
        setIsOpen(false);
      },
    },
    {
      category: 'System Diagnostics',
      label: 'Trigger Codebase Seeding Diagnostics (Confetti)',
      icon: Sparkles,
      action: triggerGlitchConfetti,
    },
    {
      category: 'Administrative Secure Gateway',
      label: 'Admin Control Center Dashboard',
      icon: Terminal,
      action: () => {
        setIsOpen(false);
        router.push('/admin/dashboard');
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Floating Trigger HUD Node */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 glass-panel hover:border-[#ff5d22]/50 px-4 py-2 text-xs font-mono tracking-wider text-white/70 uppercase flex items-center gap-2 duration-300 interactive cursor-pointer"
      >
        <Terminal size={14} className="text-[#ff5d22] animate-pulse" />
        <span>Console // Cmd+K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Console Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl glass-panel border-[#ff5d22]/20 shadow-2xl rounded-lg overflow-hidden flex flex-col glow-orange"
            >
              {/* Input Header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
                <Search size={18} className="text-white/40" />
                <input
                  type="text"
                  placeholder="Enter terminal query or jump destination..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full bg-transparent border-0 text-white placeholder-white/30 text-sm font-mono focus:ring-0 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-white/30 border border-white/15 px-1.5 py-0.5 rounded uppercase">
                  ESC to close
                </span>
              </div>

              {/* Suggestions List */}
              <div
                ref={listRef}
                className="max-h-[350px] overflow-y-auto p-2 space-y-1 scrollbar-thin"
              >
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, idx) => {
                    const IconComponent = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.label}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-3 rounded flex items-center justify-between text-xs font-mono transition-all duration-150 ${
                          isSelected
                            ? 'bg-white/10 border-l-2 border-[#ff5d22] pl-4 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent
                            size={16}
                            className={isSelected ? 'text-[#ff5d22]' : 'text-white/40'}
                          />
                          <span>{cmd.label}</span>
                        </div>
                        <span className="text-[10px] text-white/30 opacity-70 uppercase tracking-widest">
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs font-mono text-white/40">
                    No matching terminal queries found.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/5 bg-black/40 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1.5">
                  Press <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-white">↑↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1.5">
                  Press <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-white">Enter</kbd> to execute
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
