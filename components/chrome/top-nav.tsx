'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const primaryItems = [
  { href: '/hoje', label: 'Hoje' },
  { href: '/plano', label: 'Plano' },
  { href: '/progresso', label: 'Progresso' },
];

const refItems = [
  { href: '/corrida', label: 'Corrida' },
  { href: '/natacao', label: 'Natação' },
  { href: '/forca', label: 'Força' },
  { href: '/nutricao', label: 'Nutrição' },
  { href: '/prova', label: 'Prova' },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="pt-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/hoje" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center font-serif italic text-lg font-semibold leading-none">
            L
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              luci
            </span>
            <span className="text-[11px] text-[var(--color-ink-soft)]">
              plano do felipe
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[...primaryItems, ...refItems].map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-1.5 text-sm rounded-full transition ${
                  active
                    ? 'bg-[var(--color-ink)] text-white'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          disabled={signingOut}
          aria-label="Sair"
          title="Sair"
          className="tap focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none w-[38px] h-[38px] rounded-full bg-[var(--color-card)] border-0 flex items-center justify-center text-[var(--color-ink-soft)] disabled:opacity-50"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          {signingOut ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={1.8} />
          ) : (
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Sub-nav de referência (mobile, scrollable) */}
      <div className="md:hidden overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 px-4 pb-2 min-w-max">
          {refItems.map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition ${
                  active
                    ? 'bg-[var(--color-ink)] text-white'
                    : 'bg-[var(--color-card)] text-[var(--color-ink-soft)] border border-[var(--color-line)]'
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
