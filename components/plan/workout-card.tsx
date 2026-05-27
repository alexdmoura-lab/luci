'use client';

import { useState } from 'react';
import { Edit3, Moon, Check } from 'lucide-react';
import { WorkoutIcon } from '@/components/ui/workout-icon';
import { Pill, PillStatic } from '@/components/ui/pill';
import { LogModal } from '@/components/tracking/log-modal';
import type { WorkoutItem, WorkoutType } from '@/lib/plan-data';
import type { WorkoutLog, WorkoutOverride } from '@/lib/types';
import { paceSecToString } from '@/lib/format';

type Props = {
  workoutId: string;
  item: WorkoutItem;
  override?: WorkoutOverride | null;
  log?: WorkoutLog | null;
  /** Day label, e.g. "seg · 25" */
  dayLabel?: string;
  isToday?: boolean;
};

export function WorkoutCard({
  workoutId,
  item,
  override,
  log,
  dayLabel,
  isToday = false,
}: Props) {
  const [openLog, setOpenLog] = useState(false);

  const type: WorkoutType = (override?.new_type as WorkoutType) ?? item.type;
  const label = override?.new_label ?? item.label;
  const detail = override?.new_detail ?? item.detail;
  const isRest = type === 'rest';
  const isDone = log?.status === 'done';
  const isPartial = log?.status === 'partial';

  return (
    <>
      <div
        className={`rounded-[24px] p-4 transition ${
          isToday
            ? 'bg-[var(--color-card)] border-2 border-[var(--color-accent)]'
            : isRest
              ? 'bg-[var(--color-paper-soft)] border border-[var(--color-line)] opacity-90'
              : 'bg-[var(--color-card)] border-0'
        }`}
        style={{
          boxShadow: isToday
            ? 'var(--shadow-up)'
            : isRest
              ? 'none'
              : 'var(--shadow-soft)',
        }}
      >
        <div className="flex items-start gap-3">
          <WorkoutIcon
            type={type}
            size={44}
            variant={
              type === 'run' && /tempo|fartlek|intervalo|vo2|km @|tune-up/i.test(label)
                ? 'quality'
                : 'default'
            }
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              {dayLabel && (
                <div
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    isToday ? 'text-[var(--color-accent-deep)]' : 'text-[var(--color-muted)]'
                  }`}
                >
                  {dayLabel}
                </div>
              )}
              {isToday && (
                <PillStatic variant="soft" size="sm" className="!px-2 !py-0.5 !text-[10px]">
                  hoje
                </PillStatic>
              )}
              {override && (
                <PillStatic variant="warn" size="sm" className="!px-2 !py-0.5 !text-[10px]">
                  ajustado
                </PillStatic>
              )}
            </div>

            <div className="font-serif text-[16px] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--color-ink)]">
              {label}
            </div>

            {detail && (
              <div className="text-[11px] text-[var(--color-muted)] mt-1">{detail}</div>
            )}
          </div>

          {!isRest && (
            <button
              aria-label="Editar"
              onClick={() => setOpenLog(true)}
              className="tap w-7 h-7 border-0 bg-transparent text-[var(--color-muted)] flex items-center justify-center"
            >
              <Edit3 className="w-4 h-4" strokeWidth={1.8} />
            </button>
          )}
        </div>

        {item.hint && (
          <div
            className="mt-2.5 pl-[56px] text-xs leading-[1.4] text-[var(--color-ink-soft)] font-serif italic"
          >
            <span
              className="font-serif text-[var(--color-accent)] italic"
              style={{ fontSize: 18, lineHeight: 1 }}
            >
              &ldquo;
            </span>
            {item.hint}
          </div>
        )}

        <div className="mt-3 pl-[56px] flex items-center justify-between gap-2">
          <div className="text-[12px] text-[var(--color-muted)] font-semibold">
            {log?.distance_km != null && <span>{log.distance_km}km · </span>}
            {log?.avg_pace_sec_per_km != null && (
              <span>{paceSecToString(log.avg_pace_sec_per_km)}</span>
            )}
            {log?.avg_hr != null && <span> · FC {log.avg_hr}</span>}
            {!log && detail && <span className="opacity-0">.</span>}
          </div>

          {isRest ? (
            <PillStatic variant="paper" size="sm" className="!text-[11px] !px-3 !py-1.5">
              <Moon className="w-3 h-3" strokeWidth={2} />
              descanso
            </PillStatic>
          ) : isDone ? (
            <PillStatic variant="done" size="sm" className="!text-[11px] !px-3 !py-1.5">
              <Check className="w-3 h-3" strokeWidth={2.6} />
              feito
            </PillStatic>
          ) : isPartial ? (
            <PillStatic variant="warn" size="sm" className="!text-[11px] !px-3 !py-1.5">
              parcial
            </PillStatic>
          ) : isToday ? (
            <Pill variant="primary" size="sm" onClick={() => setOpenLog(true)}>
              marcar feito
            </Pill>
          ) : (
            <PillStatic variant="paper" size="sm" className="!text-[11px] !px-3 !py-1.5">
              planejado
            </PillStatic>
          )}
        </div>
      </div>

      {openLog && (
        <LogModal
          workoutId={workoutId}
          workout={{ ...item, type, label, detail }}
          current={log ?? null}
          onClose={() => setOpenLog(false)}
        />
      )}
    </>
  );
}
