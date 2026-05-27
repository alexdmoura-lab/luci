'use client';

import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-7 rounded-[24px] bg-[var(--color-card)] p-5 text-center shadow-[var(--shadow-soft)]">
        <div className="font-serif text-xl font-medium mb-1">olha o e-mail.</div>
        <p className="text-sm text-[var(--color-ink-soft)]">
          mandamos o link pra <strong className="font-semibold">{email}</strong>. clica e tá dentro.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
        e-mail
      </div>
      <form
        onSubmit={onSubmit}
        className="bg-[var(--color-card)] rounded-full py-1.5 pl-5 pr-1.5 flex items-center gap-2"
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          inputMode="email"
          placeholder="felipe@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border-0 outline-none bg-transparent text-[15px] py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="tap px-5 py-3 rounded-full font-bold text-sm text-white border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
          style={{
            background: 'var(--color-accent)',
            boxShadow: '0 4px 10px rgba(255,87,34,.32)',
          }}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              mandar link <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </>
          )}
        </button>
      </form>
      <div className="mt-3 text-[11px] text-[var(--color-muted)] text-center">
        sem senha. magic link no e-mail.
      </div>
      {error && (
        <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
