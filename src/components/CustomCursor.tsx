'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Position references
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // 1. Check if device has touch capability or is too small
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = window.innerWidth < 768;

    if (isTouch || isMobile) {
      return;
    }

    setVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // 2. Linear Interpolation (lerp) loop for the ring inertia
    let animationFrameId: number;
    const lerpFactor = 0.15; // Lower values = smoother/more lag

    const render = () => {
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * lerpFactor;
      ringPos.current.y += dy * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 3. Hover listeners for scaling states
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.classList.contains('interactive');

      if (isInteractive) {
        setHovered(true);
        document.body.classList.add('custom-cursor-hover');
      } else {
        setHovered(false);
        document.body.classList.remove('custom-cursor-hover');
      }
    };

    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-hover');
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor duration-75 ${
          hovered ? 'bg-[#ff5d22] scale-150' : 'bg-white'
        }`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${
          hovered ? 'border-[#ff5d22] scale-125' : 'border-white/30'
        }`}
      />
    </>
  );
}
