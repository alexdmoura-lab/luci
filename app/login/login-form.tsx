'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

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
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
        <div className="font-serif text-xl mb-1">Olha o e-mail.</div>
        <p className="text-sm text-stone-600">
          Mandamos o link pra <strong>{email}</strong>. Clica e tá dentro.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="email"
        required
        autoFocus
        autoComplete="email"
        inputMode="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Enviar link
      </button>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
    </form>
  );
}
