'use client';

import { Heart, Moon, Scale, Zap } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { EnergyDots } from '@/components/ui/energy-dots';

type Props = {
  weight: number | null;
  sleep: number | null;
  energy: number | null;
  weekDone: number;
  weekPlan: number;
};

export function StatGrid({ weight, sleep, energy, weekDone, weekPlan }: Props) {
  function focusInput(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Tiny delay so the scroll animation kicks in before focus.
    setTimeout(() => {
      if (el instanceof HTMLInputElement) el.focus();
    }, 280);
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <StatCard
        icon={<Scale className="w-4 h-4" strokeWidth={2} />}
        label="peso"
        value={weight != null ? `${weight}` : '—'}
        sub={weight != null ? 'kg' : 'toque pra registrar'}
        onClick={() => focusInput('input-peso')}
      />
      <StatCard
        icon={<Moon className="w-4 h-4" strokeWidth={2} />}
        label="sono"
        value={sleep != null ? `${sleep}h` : '—'}
        sub={sleep != null ? 'horas' : 'toque pra registrar'}
        onClick={() => focusInput('input-sono')}
      />
      <StatCard
        icon={<Zap className="w-4 h-4" strokeWidth={2} />}
        label="energia"
        value={
          energy != null ? (
            <EnergyDots value={energy} />
          ) : (
            <span className="text-[var(--color-muted)]">—</span>
          )
        }
        sub={energy != null ? `${energy} de 5` : 'toque pra registrar'}
        onClick={() => focusInput('input-energia')}
      />
      <StatCard
        icon={<Heart className="w-4 h-4" strokeWidth={2} />}
        label="semana"
        value={
          <span className="tab-num">
            {weekDone}
            <span className="text-[var(--color-muted)] text-base">/{weekPlan}</span>
          </span>
        }
        sub="treinos feitos"
      />
    </div>
  );
}
