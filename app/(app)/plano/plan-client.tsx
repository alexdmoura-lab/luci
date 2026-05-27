'use client';

import { useMemo, useState } from 'react';
import { WEEKS } from '@/lib/plan-data';
import { workoutId } from '@/lib/workout-id';
import type { WorkoutLog, WorkoutOverride } from '@/lib/types';
import { PhaseBadge } from '@/components/ui/phase-badge';
import { WorkoutCard } from '@/components/plan/workout-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PlanClient({
  initialWeek,
  logs,
  overrides,
}: {
  initialWeek: number;
  logs: WorkoutLog[];
  overrides: WorkoutOverride[];
}) {
  const [weekNum, setWeekNum] = useState(initialWeek);
  const week = WEEKS.find((w) => w.num === weekNum)!;

  const logMap = useMemo(() => new Map(logs.map((l) => [l.workout_id, l])), [logs]);
  const overrideMap = useMemo(() => new Map(overrides.map((o) => [o.workout_id, o])), [overrides]);

  const nonRestIds = week.days.flatMap((d) =>
    d.items.map((it, i) => ({ id: workoutId(weekNum, d.d, i), type: it.type }))
  ).filter((x) => x.type !== 'rest').map((x) => x.id);
  const doneCount = nonRestIds.filter((id) => logMap.get(id)?.status === 'done').length;
  const pct = Math.round((doneCount / Math.max(1, nonRestIds.length)) * 100);

  return (
    <div className="space-y-5">
      {/* Timeline horizontal */}
      <div className="flex items-center gap-1">
        {WEEKS.map((w) => {
          const isActive = w.num === weekNum;
          return (
            <button
              key={w.num}
              onClick={() => setWeekNum(w.num)}
              className={`flex-1 h-1.5 rounded-full transition ${
                isActive ? `bg-${w.phaseColor}-600` : 'bg-stone-200'
              }`}
              style={isActive ? { background: phaseColor(w.phaseColor) } : undefined}
              aria-label={`Semana ${w.num}`}
            />
          );
        })}
      </div>

      {/* Header da semana */}
      <header className="bg-white rounded-2xl border border-stone-200 p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <PhaseBadge phase={`Semana ${week.num} · ${week.phase}`} color={week.phaseColor} />
            <h1 className="font-serif text-2xl tracking-tight mt-2">{week.title}</h1>
            <p className="text-sm text-stone-500 mt-0.5">{week.dates}</p>
          </div>
          <div className="text-right text-xs text-stone-600 space-y-0.5">
            <div><strong className="text-stone-900">{week.runVol} km</strong> corrida</div>
            <div>{week.swimVol} natação</div>
            <div>Força: {week.strength}</div>
          </div>
        </div>

        {week.note && (
          <p className="mt-4 text-sm italic text-stone-600 border-l-2 border-stone-300 pl-3">
            {week.note}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setWeekNum(Math.max(1, weekNum - 1))}
            disabled={weekNum === 1}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-[10px] text-stone-500 text-center">
              {doneCount}/{nonRestIds.length} treinos feitos · {pct}%
            </div>
          </div>
          <button
            onClick={() => setWeekNum(Math.min(WEEKS.length, weekNum + 1))}
            disabled={weekNum === WEEKS.length}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Dias */}
      <div className="space-y-4">
        {week.days.map((day) => (
          <div key={day.d}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5 px-1">
              {day.d}
            </div>
            <div className="space-y-2">
              {day.items.map((item, i) => {
                const id = workoutId(weekNum, day.d, i);
                return (
                  <WorkoutCard
                    key={id}
                    workoutId={id}
                    item={item}
                    log={logMap.get(id)}
                    override={overrideMap.get(id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function phaseColor(c: string): string {
  const map: Record<string, string> = {
    amber: '#d97706',
    orange: '#ea580c',
    green: '#16a34a',
    red: '#dc2626',
    blue: '#2563eb',
    purple: '#9333ea',
  };
  return map[c] ?? '#1c1917';
}
