'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = (window.scrollY / scrollHeight) * 100;
        setProgress(percent);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50 pointer-events-none">
      <div
        className="h-full bg-[#ff5d22] transition-all duration-75 ease-out shadow-[0_0_8px_#ff5d22]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
