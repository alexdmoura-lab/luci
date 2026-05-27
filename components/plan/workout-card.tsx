'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { DoneToggle } from '@/components/tracking/done-toggle';
import { LogModal } from '@/components/tracking/log-modal';
import { TYPE_STYLES } from '@/components/ui/workout-type-icon';
import type { WorkoutItem, WorkoutType } from '@/lib/plan-data';
import type { WorkoutLog, WorkoutOverride } from '@/lib/types';
import { paceSecToString } from '@/lib/format';

export function WorkoutCard({
  workoutId,
  item,
  override,
  log,
  compact = false,
}: {
  workoutId: string;
  item: WorkoutItem;
  override?: WorkoutOverride | null;
  log?: WorkoutLog | null;
  compact?: boolean;
}) {
  const [openLog, setOpenLog] = useState(false);

  // Aplica override
  const type: WorkoutType = (override?.new_type as WorkoutType) ?? item.type;
  const label = override?.new_label ?? item.label;
  const detail = override?.new_detail ?? item.detail;

  const style = TYPE_STYLES[type];
  const { Icon } = style;
  const done = log?.status === 'done';
  const skipped = log?.status === 'skipped';
  const partial = log?.status === 'partial';

  return (
    <>
      <div
        className={`bg-white rounded-xl border transition ${
          done ? 'border-emerald-200' :
          skipped ? 'border-stone-200 opacity-60' :
          partial ? 'border-amber-200' :
          'border-stone-200'
        }`}
      >
        <div className="flex items-start gap-3 p-4">
          <DoneToggle
            workoutId={workoutId}
            status={log?.status ?? null}
            onClick={type === 'rest' ? undefined : () => setOpenLog(true)}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                <Icon className="w-2.5 h-2.5" />
                {style.label}
              </span>
              <span className={`font-medium text-stone-900 ${done ? 'line-through decoration-emerald-400/60' : ''}`}>
                {label}
              </span>
              {override && (
                <span className="text-[10px] uppercase tracking-wider text-amber-700">
                  ajustado
                </span>
              )}
            </div>

            {detail && !compact && (
              <p className="mt-1 text-sm text-stone-600">{detail}</p>
            )}

            {item.hint && !compact && (
              <p className="mt-2 text-xs italic text-stone-500 border-l-2 border-stone-200 pl-2.5">
                {item.hint}
              </p>
            )}

            {log && (log.avg_pace_sec_per_km || log.distance_km || log.rpe) && (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-600">
                {log.distance_km != null && (
                  <span><strong className="text-stone-900 tabular-nums">{log.distance_km}</strong> km</span>
                )}
                {log.avg_pace_sec_per_km != null && (
                  <span><strong className="text-stone-900 tabular-nums">{paceSecToString(log.avg_pace_sec_per_km)}</strong></span>
                )}
                {log.avg_hr != null && (
                  <span>FC <strong className="text-stone-900 tabular-nums">{log.avg_hr}</strong></span>
                )}
                {log.rpe != null && (
                  <span>RPE <strong className="text-stone-900 tabular-nums">{log.rpe}</strong></span>
                )}
              </div>
            )}

            {log?.notes && (
              <p className="mt-1 text-xs text-stone-500">&ldquo;{log.notes}&rdquo;</p>
            )}
          </div>

          {type !== 'rest' && (
            <button
              onClick={() => setOpenLog(true)}
              className="shrink-0 -mr-1 -mt-1 p-1.5 text-stone-400 hover:text-stone-900 rounded transition"
              aria-label="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
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
