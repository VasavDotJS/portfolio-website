'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Terminal, ShieldAlert, Loader2, Key } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        setError('ERR: AUTHERROR_CREDENTIALS_DENIED. Check system credentials.');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('ERR: SYSTEM_CONN_FAILED. Connection to database timed out.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm glass-panel border-[#ff5d22]/20 rounded-lg p-6 md:p-8 space-y-6 select-none glow-orange">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5">
          <Terminal size={14} className="text-[#ff5d22]" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-white/70">
            SECURE ADM_GATEWAY // PROD
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            Console Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="e.g. admin"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] duration-300 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            Encryption Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••••••"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] duration-300 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 duration-300 disabled:opacity-50 interactive cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>VALIDATING DECRYPT KEYS...</span>
            </>
          ) : (
            <>
              <Key size={14} />
              <span>AUTHENTICATE CORE</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded text-[10px] font-mono text-red-400 flex gap-2 items-start leading-relaxed">
          <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper credentials notification in development */}
      <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest text-center">
        [ System Seed Active // Use Admin Credentials to decrypt ]
      </div>
    </div>
  );
}
