'use client';

import dynamic from 'next/dynamic';

const Scene3DInner = dynamic(() => import('./Scene3DInner'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#0b0b0c] pointer-events-none" />
  ),
});

export default function Scene3D() {
  return <Scene3DInner />;
}
