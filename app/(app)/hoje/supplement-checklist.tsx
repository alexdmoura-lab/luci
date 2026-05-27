'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { upsertDailyLog } from '@/actions/daily-log';

const SUPPS = [
  { id: 'whey', short: 'whey', label: 'whey' },
  { id: 'creatina', short: 'cre', label: 'creat.' },
  { id: 'cafeina', short: 'caf', label: 'cafeína' },
  { id: 'vitd', short: 'vd', label: 'vit d' },
  { id: 'omega', short: 'om', label: 'ômega' },
  { id: 'mag', short: 'mg', label: 'mag' },
];

export function SupplementChecklist({
  supplements,
}: {
  supplements: Record<string, boolean>;
}) {
  const [state, setState] = useState<Record<string, boolean>>(supplements);
  const [, start] = useTransition();

  function toggle(id: string) {
    const next = { ...state, [id]: !state[id] };
    setState(next);
    start(async () => {
      await upsertDailyLog({ supplements: { [id]: next[id] } });
    });
  }

  const doneCount = SUPPS.filter((s) => state[s.id]).length;

  return (
    <div className="rounded-[24px] bg-[var(--color-paper-soft)] border border-[var(--color-line)] p-5">
      <div className="flex justify-between items-baseline mb-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            do dia
          </div>
          <div className="font-serif text-[17px] font-medium mt-0.5 text-[var(--color-ink)]">
            suplementos
          </div>
        </div>
        <div className="text-[11px] text-[var(--color-muted)]">
          {doneCount} de {SUPPS.length}
        </div>
      </div>

      <div className="flex gap-2.5 justify-between flex-wrap">
        {SUPPS.map((s) => {
          const filled = !!state[s.id];
          return (
            <div key={s.id} className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => toggle(s.id)}
                aria-label={s.label}
                className={`tap w-[38px] h-[38px] rounded-full border-[1.5px] flex items-center justify-center font-bold text-[11px] transition-all ${
                  filled
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white scale-[1.04]'
                    : 'bg-[var(--color-paper-soft)] border-[var(--color-line)] text-[var(--color-muted)]'
                }`}
              >
                {filled ? <Check className="w-4 h-4" strokeWidth={2.6} /> : s.short}
              </button>
              <div className="text-[10px] text-[var(--color-muted)] uppercase font-semibold">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
