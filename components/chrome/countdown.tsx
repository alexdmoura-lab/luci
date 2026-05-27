import { daysUntilRace } from '@/lib/dates';
import { plural } from '@/lib/format';

export function Countdown({ small = false }: { small?: boolean }) {
  const days = daysUntilRace();
  const past = days < 0;
  const absDays = Math.abs(days);

  if (small) {
    if (days === 0) {
      return (
        <span className="text-[11px] text-[var(--color-accent-deep)] font-semibold">
          é hoje.
        </span>
      );
    }
    if (past) {
      return (
        <span className="text-[11px] text-[var(--color-muted)]">
          prova foi há {absDays} {plural(absDays, 'dia', 'dias')}.
        </span>
      );
    }
    return (
      <span className="text-[11px] text-[var(--color-muted)]">
        <span className="font-medium text-[var(--color-ink)]">{days}</span>{' '}
        {plural(days, 'dia até 19/07', 'dias até 19/07')}
      </span>
    );
  }

  if (days === 0) {
    return (
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-deep)] mb-1.5">
          é hoje · 19 jul
        </div>
        <div className="font-serif italic text-2xl text-[var(--color-accent-deep)]">
          confia no que treinou.
        </div>
      </div>
    );
  }

  if (past) {
    return (
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
          meia maratona · 19 jul
        </div>
        <div className="font-serif italic text-base text-[var(--color-ink-soft)]">
          já era. e tu foi.
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
        meia maratona · 19 jul
      </div>
      <div className="inline-flex items-baseline gap-2">
        <span className="font-serif tab-num text-5xl font-medium leading-none tracking-[-0.04em]">
          {days}
        </span>
        <span className="text-sm text-[var(--color-muted)]">
          {plural(days, 'dia.', 'dias.')}
        </span>
        <span className="font-serif italic text-lg text-[var(--color-accent-deep)]">
          tá perto.
        </span>
      </div>
    </div>
  );
}
