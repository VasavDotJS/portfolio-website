'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { submitContact, FormState } from '@/app/actions/contact';
import { Send, Terminal, Loader2, AlertTriangle, ArrowUpRight } from 'lucide-react';

const initialState: FormState = {
  success: false,
  message: '',
};

export default function Contact() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isPending) {
      setConsoleLogs([
        'SYS: ESTABLISHING CRYPTOGRAPHIC TUNNEL...',
        'SYS: PARSING VISITOR PACKET TELEMETRY...',
        'SYS: ENCODING UTF-8 METADATA CHAINS...',
      ]);
    }
  }, [isPending]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setConsoleLogs((prev) => [
          ...prev,
          'NET: PACKETS COMPRESSED & CRYPTO-SIGNED.',
          'NET: ROUTING VIA MAC RAMAPURAM CORE BRIDGE...',
          `NET: ${state.message.toUpperCase()}`,
          'SYS: CONNECTION SHUTDOWN CLEANLY. [OK]',
        ]);
        if (formRef.current) formRef.current.reset();
      } else {
        setConsoleLogs((prev) => [
          ...prev,
          `ERR: SCHEMA VALIDATION MISMATCH REJECTED.`,
          `ERR: ${state.message.toUpperCase()}`,
          'SYS: SESSION ABORTED WITH FAULT CODE 400.',
        ]);
      }
    }
  }, [state]);

  return (
    <section
      id="contact"
      className="relative py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 select-none"
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest">
            05 // LINK // TERMINAL OUTBOX
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
            Transmit <br />
            <span className="text-stroke-white text-white/5">Telemetry</span>
          </h2>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <form
            ref={formRef}
            action={formAction}
            className="lg:col-span-7 space-y-5"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Visitor Identity / Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isPending}
                placeholder="e.g. Neo Hacker"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] focus:ring-1 focus:ring-[#ff5d22]/30 duration-300 disabled:opacity-50"
              />
              {state.errors?.name && (
                <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                  <AlertTriangle size={10} /> {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Outbound Address / Email
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                placeholder="e.g. neo@matrix.io"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] focus:ring-1 focus:ring-[#ff5d22]/30 duration-300 disabled:opacity-50"
              />
              {state.errors?.email && (
                <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                  <AlertTriangle size={10} /> {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Signal Transmission / Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                disabled={isPending}
                placeholder="Type your cryptographic message here..."
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] focus:ring-1 focus:ring-[#ff5d22]/30 duration-300 disabled:opacity-50 resize-none"
              />
              {state.errors?.message && (
                <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                  <AlertTriangle size={10} /> {state.errors.message[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 duration-300 disabled:opacity-50 interactive cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>TRANSMITTING SIGNAL...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>SEND TELEMETRY PACKET</span>
                </>
              )}
            </button>
          </form>

          {/* Console Log Log Output */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel border-white/5 rounded-lg p-5 space-y-4 glow-orange">
              {/* Console Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-[#ff5d22]" />
                  <span className="text-[10px] font-mono tracking-wider uppercase text-white/60">
                    CONSOLE // OUTBOUND_LOG
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
              </div>

              {/* Console logs output */}
              <div className="font-mono text-[10px] space-y-2 h-[180px] overflow-y-auto pl-2 border-l border-white/5">
                {consoleLogs.length > 0 ? (
                  consoleLogs.map((log, idx) => {
                    const isErr = log.startsWith('ERR:');
                    const isOk = log.includes('[OK]') || log.includes('SUCCESSFULLY');
                    return (
                      <div
                        key={log + idx}
                        className={
                          isErr ? 'text-red-400' : isOk ? 'text-[#ff5d22]' : 'text-white/40'
                        }
                      >
                        <span className="text-white/10 mr-1.5">&gt;</span>
                        {log}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-white/20 italic flex items-center justify-center h-full">
                    [ Console idle. Waiting for outbound sequence... ]
                  </div>
                )}
              </div>
            </div>

            {/* Quick social channels */}
            <div className="space-y-4 font-mono text-xs">
              <div className="text-[10px] text-white/30 uppercase tracking-widest">
                Direct Channels
              </div>
              <div className="space-y-2.5 pl-2">
                <a
                  href="mailto:vasavpramesh@gmail.com"
                  className="flex items-center justify-between text-white/60 hover:text-white border-b border-white/5 pb-2.5 duration-300 interactive"
                >
                  <span>vasavpramesh@gmail.com</span>
                  <ArrowUpRight size={14} className="text-white/40" />
                </a>
                <a
                  href="https://github.com/VasavDotJS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-white/60 hover:text-white border-b border-white/5 pb-2.5 duration-300 interactive"
                >
                  <span>github.com/VasavDotJS</span>
                  <ArrowUpRight size={14} className="text-white/40" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
