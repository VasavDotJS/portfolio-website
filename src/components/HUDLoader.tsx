'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HUDLoaderProps {
  onComplete: () => void;
}

export default function HUDLoader({ onComplete }: HUDLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const bootLogs = [
    'SYSTEM: INITIALIZING COMPUTE BOOT CHAIN...',
    'NET: LINKING TO PORTFOLIO_DB VIA PRISMA... [OK]',
    'CORE: MOUNTING TSX VIRTUAL COMPILER...',
    'IDENTITY: DETECTING SUBJECT: VASAV P RAMESH // AGE: 19',
    'IDENTITY: ACADEMICS: BACHELOR OF COMPUTER APPLICATIONS [BCA]',
    'IDENTITY: FOCUS: ARTIFICIAL INTELLIGENCE, DEEP LEARNING & DATA SCIENCE',
    'LOC: MAC RAMAPURAM INTRANET ROUTE ACTIVE...',
    'GRAPHICS: BOOTING WEBGL PORTAL PIPELINE...',
    'GRAPHICS: SHADER KERNEL COMPILED SUCCESSFULLY.',
    'MODEL: LOADED TENSORFLOW/PYTORCH MODEL WEIGHTS... [OK]',
    'CMS: CACHING MARKDOWN ARCHIVE SYSTEM...',
    'SYSTEM: HANDSHAKE COMPLETED. PIPELINE STABLE.',
    'READY: DEPLOYING DIGITAL ARCHIVE...',
  ];

  useEffect(() => {
    // 1. Log print simulation loop
    const logInterval = setInterval(() => {
      if (currentIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 180);

    return () => clearInterval(logInterval);
  }, [currentIndex]);

  useEffect(() => {
    // 2. Loading percentage simulation with realistic speed fluctuations
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        // Variable speed changes: slow down during complex "model mounting" or database "linking"
        let increment = 1;
        if (prev < 30) increment = Math.floor(Math.random() * 8) + 4;
        else if (prev >= 30 && prev < 60) increment = Math.floor(Math.random() * 3) + 1;
        else if (prev >= 60 && prev < 85) increment = Math.floor(Math.random() * 6) + 3;
        else increment = Math.floor(Math.random() * 2) + 1;

        const nextVal = prev + increment;
        return nextVal > 100 ? 100 : nextVal;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b0c] flex flex-col justify-between p-6 md:p-12 font-mono text-xs select-none">
      {/* HUD Header */}
      <div className="flex justify-between items-start text-white/40 uppercase tracking-widest text-[10px]">
        <div>
          <div>Host: VasavDotJS // Terminal</div>
          <div>Port: 3000 // Active</div>
        </div>
        <div className="text-right">
          <div>LOC: MAC Ramapuram, India</div>
          <div>SYS STATUS: STABLE</div>
        </div>
      </div>

      {/* Boot Logs Terminal */}
      <div className="flex-1 my-8 overflow-hidden flex flex-col justify-end max-w-2xl space-y-1.5 border-l border-white/5 pl-4">
        <AnimatePresence>
          {logs.slice(-10).map((log, idx) => {
            const isOk = log.includes('[OK]');
            const isSystem = log.startsWith('SYSTEM:');
            return (
              <motion.div
                key={log + idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${
                  isOk
                    ? 'text-[#ff5d22]'
                    : isSystem
                    ? 'text-white/80'
                    : 'text-white/40'
                }`}
              >
                <span className="text-white/20 mr-2">&gt;&gt;</span>
                {log}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Metrics Loading */}
      <div className="space-y-4">
        {/* Progress Bar Grid */}
        <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <div className="flex justify-between items-end font-mono">
          <div className="space-y-1">
            <div className="text-white/30 text-[9px] uppercase tracking-widest">
              Synthesizing digital identity
            </div>
            <div className="text-white font-semibold text-lg flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-[#ff5d22] animate-ping rounded-full" />
              VASAV_SYS_V1.0
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[2.5rem] md:text-[4rem] font-light leading-none tracking-tighter text-white">
              {progress.toString().padStart(3, '0')}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
