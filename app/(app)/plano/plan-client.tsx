'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WEEKS, type PhaseColor } from '@/lib/plan-data';
import { workoutId } from '@/lib/workout-id';
import { DAY_LABELS } from '@/lib/day-helpers';
import { todayDayCode, currentWeekNum } from '@/lib/dates';
import type { WorkoutLog, WorkoutOverride } from '@/lib/types';

import { PhaseBadge, PHASE_COLORS } from '@/components/ui/phase-badge';
import { Card } from '@/components/ui/card';
import { WorkoutCard } from '@/components/plan/workout-card';

type Props = {
  initialWeek: number;
  logs: WorkoutLog[];
  overrides: WorkoutOverride[];
};

export function PlanClient({ initialWeek, logs, overrides }: Props) {
  const [weekNum, setWeekNum] = useState(initialWeek);
  const week = WEEKS.find((w) => w.num === weekNum)!;
  const currentNum = currentWeekNum();
  const todayCode = todayDayCode();

  const logMap = useMemo(() => new Map(logs.map((l) => [l.workout_id, l])), [logs]);
  const overrideMap = useMemo(
    () => new Map(overrides.map((o) => [o.workout_id, o])),
    [overrides]
  );

  // Compute adherence for each week (non-rest)
  const weekStats = useMemo(() => {
    return WEEKS.map((w) => {
      const nonRest = w.days.flatMap((d) =>
        d.items
          .map((it, i) => ({ id: workoutId(w.num, d.d, i), type: it.type }))
          .filter((x) => x.type !== 'rest')
      );
      const done = nonRest.filter((x) => logMap.get(x.id)?.status === 'done').length;
      const pct = nonRest.length > 0 ? Math.round((done / nonRest.length) * 100) : 0;
      return { num: w.num, done, total: nonRest.length, pct };
    });
  }, [logMap]);

  const currentStat = weekStats[weekNum - 1];

  // Build days-of-week mini bar
  const dayBars = week.days.map((d) => {
    const ids = d.items.map((_, i) => workoutId(week.num, d.d, i));
    const allRest = d.items.every((it) => it.type === 'rest');
    const anyDone = ids.some((id) => logMap.get(id)?.status === 'done');
    const isToday = d.d === todayCode && week.num === currentNum;
    return { code: d.d, label: DAY_LABELS[d.d], done: anyDone, isToday, rest: allRest };
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="pt-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          o plano
        </div>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          oito semanas.
          <br />
          <span className="italic text-[var(--color-accent-deep)]">uma prova.</span>
        </h1>
      </header>

      {/* 8 phase dots timeline */}
      <PhaseTimeline
        weeks={WEEKS}
        selected={weekNum}
        current={currentNum}
        stats={weekStats}
        onSelect={setWeekNum}
      />

      {/* Current week card */}
      <Card
        className={`!p-[22px] ${week.num === 8 ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-paper)]' : ''}`}
      >
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div>
            {week.num === 8 ? (
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 pl-2 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-white"
                style={{ background: 'var(--color-accent)' }}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                semana da prova
              </span>
            ) : (
              <PhaseBadge week={week.num} phaseColor={week.phaseColor} label={week.phase} />
            )}
            <div className="font-serif text-[28px] font-medium leading-none tracking-[-0.02em] mt-2.5">
              semana <span className="tab-num">{String(week.num).padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-[var(--color-muted)] mt-1">
              {week.dates.toLowerCase()} · {week.phase.toLowerCase()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
              adesão
            </div>
            <div className="font-serif tab-num text-[32px] font-medium leading-none text-[var(--color-accent-deep)]">
              {currentStat.pct}
              <span className="text-base text-[var(--color-muted)]">%</span>
            </div>
          </div>
        </div>

        {/* Mini bar of days */}
        <div className="mt-[18px] flex gap-1 items-end h-9">
          {dayBars.map((d, i) => (
            <div
              key={i}
              className="flex-1 rounded-md transition-all"
              style={{
                height: d.done ? '100%' : d.isToday ? '70%' : '30%',
                background: d.done
                  ? 'var(--color-accent)'
                  : d.isToday
                    ? 'var(--color-accent-soft)'
                    : 'var(--color-paper-soft)',
                border: d.isToday
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-line)',
              }}
            />
          ))}
        </div>
        <div className="flex gap-1 mt-1.5">
          {dayBars.map((d, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[10px] uppercase tracking-[0.05em] text-[var(--color-muted)]"
              style={{ fontWeight: d.isToday ? 700 : 500 }}
            >
              {d.label}
            </div>
          ))}
        </div>

        {week.note && (
          <div className="mt-3.5 p-3 rounded-[14px] bg-[var(--color-paper-soft)] text-[13px] text-[var(--color-ink-soft)] leading-[1.5]">
            <span className="font-serif italic text-[var(--color-accent-deep)]">
              nota da semana —
            </span>{' '}
            {week.note}
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <button
            onClick={() => setWeekNum(Math.max(1, weekNum - 1))}
            disabled={weekNum === 1}
            className="tap p-2 rounded-full text-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)] font-bold">
            {currentStat.done} de {currentStat.total} feitos
          </div>
          <button
            onClick={() => setWeekNum(Math.min(WEEKS.length, weekNum + 1))}
            disabled={weekNum === WEEKS.length}
            className="tap p-2 rounded-full text-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Próxima semana"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Days list */}
      <div className="space-y-2.5">
        {week.days.map((d) => {
          const isToday = d.d === todayCode && week.num === currentNum;
          return d.items.map((item, i) => {
            const id = workoutId(week.num, d.d, i);
            return (
              <WorkoutCard
                key={id}
                workoutId={id}
                item={item}
                log={logMap.get(id)}
                override={overrideMap.get(id)}
                dayLabel={DAY_LABELS[d.d]}
                isToday={isToday}
              />
            );
          });
        })}
      </div>
    </div>
  );
}

function PhaseTimeline({
  weeks,
  selected,
  current,
  stats,
  onSelect,
}: {
  weeks: typeof WEEKS;
  selected: number;
  current: number;
  stats: { num: number; done: number; total: number; pct: number }[];
  onSelect: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {weeks.map((w, i) => {
        const isActive = w.num === selected;
        const isCurrent = w.num === current;
        const isPast = w.num < current;
        const stat = stats[i];
        const phaseColor = PHASE_COLORS[w.phaseColor as PhaseColor];
        const state: 'done' | 'current' | 'future' = isPast
          ? 'done'
          : isCurrent
            ? 'current'
            : 'future';

        const filled = state === 'done' || state === 'current';
        const isFutureSelected = state === 'future' && isActive;

        return (
          <div key={w.num} className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => onSelect(w.num)}
              className="tap shrink-0 rounded-full flex items-center justify-center font-bold transition-all"
              style={{
                width: isActive ? 36 : 22,
                height: isActive ? 36 : 22,
                background: filled || isFutureSelected ? phaseColor : 'transparent',
                border:
                  state === 'future' && !isFutureSelected
                    ? `2px dashed ${phaseColor}`
                    : 'none',
                color: '#fff',
                fontSize: isActive ? 13 : 10,
                boxShadow: isActive ? `0 4px 12px ${phaseColor}55` : 'none',
                opacity: state === 'future' && !isActive ? 0.55 : 1,
              }}
              aria-label={`Semana ${w.num} · ${w.phase}${stat?.pct ? ` · ${stat.pct}%` : ''}`}
            >
              {w.num}
            </button>
            {i < weeks.length - 1 && (
              <div
                className="flex-1 h-0.5 rounded-full min-w-[4px]"
                style={{
                  background:
                    w.num <= current ? phaseColor : '#D9D0BD',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
