'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { upsertDailyLog } from '@/actions/daily-log';
import type { DailyLog } from '@/lib/types';

export function MorningCheckin({ today }: { today: DailyLog | null }) {
  const [weight, setWeight] = useState(today?.weight_kg?.toString() ?? '');
  const [sleep, setSleep] = useState(today?.sleep_hours?.toString() ?? '');
  const [energy, setEnergy] = useState<number | null>(today?.energy ?? null);
  const [pending, start] = useTransition();
  const [savedFlash, setSavedFlash] = useState(false);

  function save() {
    start(async () => {
      await upsertDailyLog({
        weight_kg: weight ? Number(weight) : null,
        sleep_hours: sleep ? Number(sleep) : null,
        energy: energy ?? null,
      });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    });
  }

  return (
    <div className="rounded-[24px] bg-[var(--color-paper-soft)] border border-[var(--color-line)] p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            check-in matinal
          </div>
          <div className="font-serif text-[17px] font-medium mt-0.5 text-[var(--color-ink)]">
            como tu acordou?
          </div>
        </div>
        {savedFlash && (
          <span className="text-[11px] text-[var(--color-done)] font-semibold">salvo.</span>
        )}
        {pending && !savedFlash && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-muted)]" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="block">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
            peso (kg)
          </div>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={save}
            placeholder="—"
            className="w-full rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] px-3 py-2 text-sm tab-num focus:border-[var(--color-ink)] focus:outline-none"
          />
        </label>
        <label className="block">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
            sono (h)
          </div>
          <input
            type="number"
            inputMode="decimal"
            step="0.25"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            onBlur={save}
            placeholder="—"
            className="w-full rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] px-3 py-2 text-sm tab-num focus:border-[var(--color-ink)] focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
          energia
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                setEnergy(n);
                start(async () => {
                  await upsertDailyLog({ energy: n });
                  setSavedFlash(true);
                  setTimeout(() => setSavedFlash(false), 1200);
                });
              }}
              className={`tap py-2 rounded-full text-sm font-semibold transition ${
                energy === n
                  ? 'bg-[var(--color-accent)] text-white shadow-[0_4px_10px_rgba(255,87,34,.3)]'
                  : 'bg-[var(--color-card)] border border-[var(--color-line)] text-[var(--color-ink-soft)]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
