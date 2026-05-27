import type { PhaseColor } from '@/lib/plan-data';

const STYLES: Record<PhaseColor, string> = {
  amber: 'bg-amber-50 text-amber-800 border-amber-300',
  orange: 'bg-orange-50 text-orange-800 border-orange-300',
  green: 'bg-green-50 text-green-800 border-green-300',
  red: 'bg-red-50 text-red-800 border-red-300',
  blue: 'bg-blue-50 text-blue-800 border-blue-300',
  purple: 'bg-purple-50 text-purple-800 border-purple-300',
};

export function PhaseBadge({ phase, color }: { phase: string; color: PhaseColor }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border ${STYLES[color]}`}
    >
      {phase}
    </span>
  );
}
