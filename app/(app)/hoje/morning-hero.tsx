'use client';

import { useState } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { WorkoutIcon } from '@/components/ui/workout-icon';
import { HalfGauge } from '@/components/ui/half-gauge';
import { DayDots, type DayDot } from '@/components/ui/day-dots';
import { CoachHint } from '@/components/ui/coach-hint';
import { LogModal } from '@/components/tracking/log-modal';
import type { WorkoutItem } from '@/lib/plan-data';
import type { WorkoutLog, WorkoutOverride } from '@/lib/types';

type Props = {
  workoutId: string;
  item: WorkoutItem | undefined;
  log: WorkoutLog | null;
  override: WorkoutOverride | null;
  streak: number;
  weekDone: number;
  weekPlan: number;
  pct: number;
  dayDots: DayDot[];
  coachNote?: string;
};

export function MorningHero({
  workoutId,
  item,
  log,
  override,
  streak,
  weekDone,
  weekPlan,
  pct,
  dayDots,
  coachNote,
}: Props) {
  const [openLog, setOpenLog] = useState(false);
  const [pulse, setPulse] = useState(false);

  if (!item) return null;

  const type = (override?.new_type as WorkoutItem['type']) ?? item.type;
  const label = override?.new_label ?? item.label;
  const detail = override?.new_detail ?? item.detail;
  const isDone = log?.status === 'done';

  const isQuality =
    type === 'run' && /tempo|fartlek|intervalo|vo2|km @|tune-up/i.test(label);

  function onTapLog() {
    setPulse(true);
    setTimeout(() => setPulse(false), 450);
    setOpenLog(true);
  }

  return (
    <>
      <div
        className={`rounded-[24px] bg-[var(--color-card)] p-[22px] ${pulse ? 'animate-card-pulse' : ''}`}
        style={{ boxShadow: 'var(--shadow-soft)' }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            treino de hoje
          </div>
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-ink)] text-white text-[11px] font-semibold">
              <Flame className="w-2.5 h-2.5" strokeWidth={2.4} />
              {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
            </span>
          )}
        </div>

        <div className="flex gap-3.5 items-center mt-1">
          <WorkoutIcon type={type} size={48} variant={isQuality ? 'quality' : 'default'} />
          <div className="flex-1 min-w-0">
            <div className="font-serif text-[18px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)]">
              {label}
            </div>
            {detail && (
              <div className="text-xs text-[var(--color-muted)] mt-1">{detail}</div>
            )}
          </div>
        </div>

        {(item.hint || coachNote) && (
          <CoachHint className="mt-3">{item.hint || coachNote}</CoachHint>
        )}

        {/* Adesão da semana + gauge */}
        <div className="flex items-center justify-between gap-2 mt-[18px] mb-1.5">
          <div className="shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
              adesão · semana
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif tab-num text-[40px] font-medium leading-none">
                {weekDone}
              </span>
              <span className="text-sm text-[var(--color-muted)]">/ {weekPlan}</span>
            </div>
            <div
              className="text-[11px] text-[var(--color-muted)] mt-1.5 font-serif italic"
              style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 14" }}
            >
              treinos da semana
            </div>
          </div>
          <div className="w-[140px] shrink-0">
            <HalfGauge value={weekDone} max={Math.max(1, weekPlan)} size={140} label={`${pct}%`} />
          </div>
        </div>

        <DayDots days={dayDots} showLabel />

        {!isDone ? (
          <button
            onClick={onTapLog}
            className="tap mt-[18px] w-full rounded-full py-[18px] px-6 font-bold text-[15px] text-white border-0 cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-pop)' }}
          >
            marcar feito <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </button>
        ) : (
          <button
            onClick={onTapLog}
            className="tap mt-[18px] w-full rounded-full py-[18px] px-6 font-semibold text-[14px] cursor-pointer flex items-center justify-center gap-2 border bg-[var(--color-done-soft)] text-[var(--color-done)] border-[var(--color-done-soft)]"
          >
            feito · editar
          </button>
        )}
      </div>

      {openLog && item && (
        <LogModal
          workoutId={workoutId}
          workout={{ ...item, type, label, detail }}
          current={log}
          onClose={() => setOpenLog(false)}
        />
      )}
    </>
  );
}
