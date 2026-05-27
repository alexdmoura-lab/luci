import { Activity, Dumbbell, Moon, TrendingUp, Trophy, Waves } from 'lucide-react';
import type { WorkoutType } from '@/lib/plan-data';

export const TYPE_STYLES: Record<WorkoutType, {
  bg: string; text: string; ring: string; label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = {
  rest: { bg: 'bg-stone-100', text: 'text-stone-600', ring: 'ring-stone-300', label: 'Descanso', Icon: Moon },
  swim: { bg: 'bg-sky-100', text: 'text-sky-700', ring: 'ring-sky-300', label: 'Natação', Icon: Waves },
  run: { bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-300', label: 'Corrida', Icon: Activity },
  long: { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-300', label: 'Longão', Icon: TrendingUp },
  strength: { bg: 'bg-slate-200', text: 'text-slate-700', ring: 'ring-slate-300', label: 'Força', Icon: Dumbbell },
  race: { bg: 'bg-stone-900', text: 'text-white', ring: 'ring-stone-900', label: 'Prova', Icon: Trophy },
};

export function TypeBadge({ type }: { type: WorkoutType }) {
  const s = TYPE_STYLES[type];
  const { Icon } = s;
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}
