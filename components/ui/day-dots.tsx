import { Check, X } from 'lucide-react';

export type DayDotState = 'past-done' | 'past-skip' | 'today' | 'future' | 'rest';

export type DayDot = {
  /** 1-char display ("S","T","Q") or day number */
  num?: string | number;
  /** Lowercase label ("seg", "ter"...) */
  label?: string;
  state: DayDotState;
  pop?: boolean;
};

const STATE_CLS: Record<DayDotState, string> = {
  'past-done': 'bg-[var(--color-accent-soft)] text-[var(--color-accent-deep)]',
  'past-skip': 'bg-[#ECE6DA] text-[var(--color-muted)]',
  today: 'bg-[var(--color-accent)] text-white shadow-[0_4px_12px_rgba(255,87,34,.4)] scale-[1.08]',
  future: 'bg-transparent text-[var(--color-muted)] border-[1.5px] border-dashed border-[#CCC2AC]',
  rest: 'bg-[var(--color-paper-soft)] text-[var(--color-muted)] border border-[var(--color-line)]',
};

export function DayDots({
  days,
  showLabel = false,
  className = '',
}: {
  days: DayDot[];
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-1 w-full ${className}`}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-200 ${STATE_CLS[d.state]} ${d.pop ? 'animate-pop' : ''}`}
          >
            {d.state === 'past-done' && <Check className="w-3.5 h-3.5" strokeWidth={2.6} />}
            {d.state === 'past-skip' && <X className="w-3 h-3" strokeWidth={2.6} />}
            {d.state === 'today' && (d.num ?? i + 1)}
            {d.state === 'future' && (d.num ?? i + 1)}
            {d.state === 'rest' && <span className="text-[10px]">·</span>}
          </div>
          {showLabel && d.label && (
            <div className="text-[10px] text-[var(--color-muted)] uppercase font-semibold tracking-[0.05em]">
              {d.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
