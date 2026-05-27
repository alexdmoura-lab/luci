'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, BarChart3, Layers } from 'lucide-react';

const items = [
  { href: '/hoje', label: 'Hoje', Icon: Home },
  { href: '/plano', label: 'Plano', Icon: Calendar },
  { href: '/progresso', label: 'Progresso', Icon: BarChart3 },
  { href: '/corrida', label: 'Referência', Icon: Layers, group: ['/corrida', '/natacao', '/forca', '/nutricao', '/prova'] },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 pb-safe">
      <ul className="flex">
        {items.map(({ href, label, Icon, group }) => {
          const active = group ? group.some((g) => pathname.startsWith(g)) : pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium uppercase tracking-wider transition ${
                  active ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : ''}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
