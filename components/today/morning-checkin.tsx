'use client';

import { useState, useTransition } from 'react';
import { upsertDailyLog } from '@/actions/daily-log';
import type { DailyLog } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function MorningCheckin({ today }: { today: DailyLog | null }) {
  const [weight, setWeight] = useState(today?.weight_kg?.toString() ?? '');
  const [sleep, setSleep] = useState(today?.sleep_hours?.toString() ?? '');
  const [energy, setEnergy] = useState<number | null>(today?.energy ?? null);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    start(async () => {
      await upsertDailyLog({
        weight_kg: weight ? Number(weight) : null,
        sleep_hours: sleep ? Number(sleep) : null,
        energy: energy ?? null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
          Check-in matinal
        </div>
        {saved && <span className="text-xs text-emerald-700">salvo</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <div className="text-xs text-stone-500 mb-1">Peso (kg)</div>
          <input
            type="number" inputMode="decimal" step="0.1"
            value={weight} onChange={(e) => setWeight(e.target.value)}
            onBlur={save}
            placeholder="—"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm tabular-nums focus:border-stone-900 focus:outline-none"
          />
        </label>
        <label className="block">
          <div className="text-xs text-stone-500 mb-1">Sono (h)</div>
          <input
            type="number" inputMode="decimal" step="0.25"
            value={sleep} onChange={(e) => setSleep(e.target.value)}
            onBlur={save}
            placeholder="—"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm tabular-nums focus:border-stone-900 focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-3">
        <div className="text-xs text-stone-500 mb-1.5">Energia</div>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => { setEnergy(n); start(async () => { await upsertDailyLog({ energy: n }); }); }}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                energy === n
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 border border-stone-200 text-stone-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      {pending && (
        <div className="mt-2 text-xs text-stone-400 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> salvando
        </div>
      )}
    </div>
  );
}
