'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

/**
 * Single-user app: username "luci" (or the full e-mail) maps to the internal
 * Supabase account. Auth uses signInWithPassword — RLS continues working.
 */
const APP_USER = 'luci';
const INTERNAL_EMAIL = 'luci@app.com';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const typed = username.trim().toLowerCase();
    const validUser = typed === APP_USER || typed === INTERNAL_EMAIL;
    if (!validUser) {
      setError('usuário ou senha inválidos.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: INTERNAL_EMAIL,
      password,
    });

    setLoading(false);
    if (err) {
      setError('usuário ou senha inválidos.');
      return;
    }
    router.push('/hoje');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-2.5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
          usuário
        </div>
        <div
          className="bg-[var(--color-card)] rounded-full px-5 py-1.5"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <input
            type="text"
            required
            autoFocus
            autoComplete="username"
            placeholder="luci"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-0 outline-none bg-transparent text-[15px] py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2 mt-3">
          senha
        </div>
        <div
          className="bg-[var(--color-card)] rounded-full py-1.5 pl-5 pr-1.5 flex items-center gap-2"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 border-0 outline-none bg-transparent text-[15px] py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
          <button
            type="submit"
            disabled={loading || !username || !password}
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
                entrar <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
    </form>
  );
}
