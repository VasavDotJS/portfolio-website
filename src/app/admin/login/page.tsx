import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Admin Decrypt // Vasav P Ramesh Archive',
  description: 'Gateway to access the administrative control nodes of the digital archive.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f3f3f3] flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Visual Overlays */}
      <div className="noise-overlay" />
      <div className="crt-overlay crt-flicker" />

      {/* Header return */}
      <div className="z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-white duration-300 interactive group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 duration-300" />
          <span>RETURN TO CIVILIAN NODE</span>
        </Link>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center z-10 my-12">
        <LoginForm />
      </div>

      {/* Footer */}
      <div className="text-center font-mono text-[9px] text-white/25 z-10 select-none">
        VASAV P RAMESH SECURE NETWORK // ACCESS ATTEMPT ENCRYPTED VIA CLIENT PORTAL
      </div>
    </div>
  );
}
