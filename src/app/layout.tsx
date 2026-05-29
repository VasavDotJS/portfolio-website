import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import CommandPaletteWrapper from '@/components/CommandPaletteWrapper';

export const metadata: Metadata = {
  title: 'Vasav P Ramesh // Creative Technologist & Artist',
  description:
    'A futuristic digital archive and engineering portfolio of Vasav P Ramesh. Specializing in AI/ML engineering, deep learning, computer vision, and experimental procedural WebGL design.',
  keywords: [
    'Vasav P Ramesh',
    'VasavDotJS',
    'Creative Coding',
    'AI Engineering',
    'Data Science',
    'WebGL Portfolio',
    'MAC Ramapuram',
    'Rick Owens Aesthetic',
  ],
  authors: [{ name: 'Vasav P Ramesh' }],
  creator: 'Vasav P Ramesh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://github.com/VasavDotJS',
    title: 'Vasav P Ramesh // Creative Technologist & Artist',
    description:
      'A futuristic digital archive of Vasav P Ramesh, creative AI/ML technologist. Visualizing the intersection of neural networks, data structures, and introspective digital art.',
    siteName: 'Vasav P Ramesh Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vasav P Ramesh // Creative Technologist',
    description:
      'A futuristic digital archive of Vasav P Ramesh, creative AI/ML technologist.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Load Google Fonts directly in the head to prevent compile-time connection fetches */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased bg-[#0b0b0c] text-[#f3f3f3] selection:bg-[#ff5d22] selection:text-white"
      >
        {/* Analog CRT Filter Layer */}
        <div id="crt-overlay-layer" className="crt-overlay crt-flicker" />

        {/* Dynamic Fractal Noise Grain Overlay */}
        <div className="noise-overlay" />

        {/* Global Cinematic Custom Cursor */}
        <CustomCursor />

        {/* Full-App Keyboard HUD Command Palette (Console) */}
        <CommandPaletteWrapper />

        {/* Main Workspace Frame */}
        <main className="relative min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
}
