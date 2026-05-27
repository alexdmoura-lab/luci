import type { PhaseColor } from '@/lib/plan-data';

export const PHASE_LABELS: Record<PhaseColor, string> = {
  amber: 'Base',
  orange: 'Build',
  green: 'Deload',
  red: 'Peak',
  blue: 'Polish',
  purple: 'Taper',
};

export const PHASE_COLORS: Record<PhaseColor, string> = {
  amber: 'var(--color-phase-base)',
  orange: 'var(--color-phase-build)',
  green: 'var(--color-phase-deload)',
  red: 'var(--color-phase-peak)',
  blue: 'var(--color-phase-polish)',
  purple: 'var(--color-phase-taper)',
};

type Props = {
  week: number;
  phaseColor: PhaseColor;
  /** Override the displayed phase label */
  label?: string;
  className?: string;
};

export function PhaseBadge({ week, phaseColor, label, className = '' }: Props) {
  const color = PHASE_COLORS[phaseColor];
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 pl-2 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] bg-[var(--color-paper-soft)] border border-[var(--color-line)] text-[var(--color-ink-soft)] ${className}`}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      Semana {week} · {label ?? PHASE_LABELS[phaseColor]}
    </span>
  );
}
