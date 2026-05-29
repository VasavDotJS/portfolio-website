'use client';

import dynamic from 'next/dynamic';

const CommandPaletteInner = dynamic(() => import('./CommandPalette'), {
  ssr: false,
});

export default function CommandPaletteWrapper() {
  return <CommandPaletteInner />;
}
