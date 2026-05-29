'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitComment, CommentFormState } from '@/app/actions/comments';
import { Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const initialState: CommentFormState = {
  success: false,
  message: '',
};

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(submitComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <div className="glass-panel border-white/5 rounded-lg p-6 space-y-6 select-none">
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white/80">
          Transmit Comment Telemetry
        </h4>
        <span className="text-[8px] font-mono text-white/30 uppercase">Moderated Queue</span>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="postId" value={postId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
              Your Name
            </label>
            <input
              type="text"
              name="authorName"
              required
              disabled={isPending}
              placeholder="e.g. Robin"
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] duration-300 disabled:opacity-50"
            />
            {state.errors?.authorName && (
              <p className="text-[9px] font-mono text-red-500 flex items-center gap-1">
                <AlertTriangle size={8} /> {state.errors.authorName[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
              Your Email
            </label>
            <input
              type="email"
              name="authorEmail"
              required
              disabled={isPending}
              placeholder="e.g. robin@aether.org"
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] duration-300 disabled:opacity-50"
            />
            {state.errors?.authorEmail && (
              <p className="text-[9px] font-mono text-red-500 flex items-center gap-1">
                <AlertTriangle size={8} /> {state.errors.authorEmail[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
            Comment Message
          </label>
          <textarea
            name="content"
            required
            rows={4}
            disabled={isPending}
            placeholder="Write your editorial thoughts..."
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#ff5d22] duration-300 disabled:opacity-50 resize-none"
          />
          {state.errors?.content && (
            <p className="text-[9px] font-mono text-red-500 flex items-center gap-1">
              <AlertTriangle size={8} /> {state.errors.content[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 duration-300 disabled:opacity-50 interactive cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>QUEUING TELEMETRY...</span>
            </>
          ) : (
            <>
              <Send size={12} />
              <span>QUEUE COMMENT</span>
            </>
          )}
        </button>

        {state.message && (
          <div
            className={`p-3 rounded text-[10px] font-mono flex items-center gap-2 ${
              state.success
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {state.success ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            <span>{state.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
