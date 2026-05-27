'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, BarChart3, Menu, Plus } from 'lucide-react';

type NavItem =
  | { kind: 'link'; id: string; href: string; Icon: typeof Home; label: string; group?: string[] }
  | { kind: 'fab' };

const items: NavItem[] = [
  { kind: 'link', id: 'hoje', href: '/hoje', Icon: Home, label: 'Hoje' },
  { kind: 'link', id: 'plano', href: '/plano', Icon: Calendar, label: 'Plano' },
  { kind: 'fab' },
  { kind: 'link', id: 'progresso', href: '/progresso', Icon: BarChart3, label: 'Progresso' },
  {
    kind: 'link',
    id: 'treinos',
    href: '/corrida',
    Icon: Menu,
    label: 'Manual',
    group: ['/corrida', '/natacao', '/forca', '/nutricao', '/prova'],
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  function onFab() {
    // Navigates to /hoje where Felipe can open the log modal
    router.push('/hoje?log=1');
  }

  return (
    <nav
      className="md:hidden fixed z-40 left-3.5 right-3.5 bottom-[max(env(safe-area-inset-bottom),22px)] flex items-center justify-around bg-white/92 backdrop-blur-md backdrop-saturate-150 rounded-full px-3 py-2.5 border border-black/[0.04]"
      style={{
        boxShadow:
          '0 4px 12px rgba(27,24,21,.06), 0 20px 40px rgba(27,24,21,.12)',
      }}
    >
      {items.map((it, idx) => {
        if (it.kind === 'fab') {
          return (
            <button
              key="fab"
              onClick={onFab}
              aria-label="Registrar treino"
              className="tap w-[54px] h-[54px] -my-1.5 bg-[var(--color-accent)] text-white border-0 rounded-full flex items-center justify-center"
              style={{ boxShadow: 'var(--shadow-pop)' }}
            >
              <Plus className="w-[22px] h-[22px]" strokeWidth={2.4} />
            </button>
          );
        }
        const { href, Icon, label, group } = it;
        const active = group ? group.some((g) => pathname.startsWith(g)) : pathname.startsWith(href);
        return (
          <Link
            key={`${it.id}-${idx}`}
            href={href}
            aria-label={label}
            className={`tap relative w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-150 ${
              active ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.1 : 1.8} />
            {active && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
