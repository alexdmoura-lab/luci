'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';

const refItems = [
  { href: '/corrida', label: 'Corrida' },
  { href: '/natacao', label: 'Natação' },
  { href: '/forca', label: 'Força' },
  { href: '/nutricao', label: 'Nutrição' },
  { href: '/prova', label: 'Prova' },
];

const primaryItems = [
  { href: '/hoje', label: 'Hoje' },
  { href: '/plano', label: 'Plano' },
  { href: '/progresso', label: 'Progresso' },
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
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur border-b border-stone-200 pt-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/hoje" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl font-medium tracking-tight text-stone-900">
            Luci
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-orange-700">
            Felipe · meia 19/07
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[...primaryItems, ...refItems].map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-2.5 py-1.5 text-sm rounded transition ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
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
          className="text-stone-400 hover:text-stone-700 transition p-1.5"
          aria-label="Sair"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-nav de referência no mobile */}
      <div className="md:hidden border-t border-stone-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {refItems.map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`px-2.5 py-1 text-xs rounded-full transition whitespace-nowrap ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600'
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
