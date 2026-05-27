'use client';

import { useState, useTransition } from 'react';
import { X, Loader2 } from 'lucide-react';
import { logWorkout } from '@/actions/log-workout';
import { parsePace } from '@/lib/format';
import type { WorkoutItem } from '@/lib/plan-data';
import type { WorkoutLog, WorkoutStatus } from '@/lib/types';

export function LogModal({
  workoutId,
  workout,
  current,
  onClose,
}: {
  workoutId: string;
  workout: WorkoutItem;
  current: WorkoutLog | null;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<WorkoutStatus>(current?.status ?? 'done');
  const [distance, setDistance] = useState(current?.distance_km?.toString() ?? '');
  const [duration, setDuration] = useState(current?.duration_min?.toString() ?? '');
  const [pace, setPace] = useState(
    current?.avg_pace_sec_per_km
      ? `${Math.floor(current.avg_pace_sec_per_km / 60)}:${String(current.avg_pace_sec_per_km % 60).padStart(2, '0')}`
      : ''
  );
  const [hr, setHr] = useState(current?.avg_hr?.toString() ?? '');
  const [rpe, setRpe] = useState(current?.rpe ?? 5);
  const [notes, setNotes] = useState(current?.notes ?? '');
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const showRunFields = workout.type === 'run' || workout.type === 'long' || workout.type === 'race';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsedPace = pace ? parsePace(pace) : null;
    if (pace && parsedPace === null) {
      setError('Pace inválido. Use formato "4:35".');
      return;
    }
    start(async () => {
      const res = await logWorkout({
        workout_id: workoutId,
        status,
        distance_km: distance ? Number(distance) : null,
        duration_min: duration ? Number(duration) : null,
        avg_pace_sec_per_km: parsedPace,
        avg_hr: hr ? Number(hr) : null,
        rpe: status === 'skipped' ? null : rpe,
        notes: notes || null,
      });
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-stone-100 px-5 py-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
              Registrar treino
            </div>
            <div className="font-medium text-stone-900">{workout.label}</div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-5">
          {/* Status */}
          <div>
            <Label>Como foi</Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'done', label: 'Feito', color: 'emerald' },
                { v: 'partial', label: 'Parcial', color: 'amber' },
                { v: 'skipped', label: 'Pulado', color: 'stone' },
              ] as const).map((s) => (
                <button
                  key={s.v}
                  type="button"
                  onClick={() => setStatus(s.v)}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                    status === s.v
                      ? s.color === 'emerald' ? 'bg-emerald-500 border-emerald-500 text-white'
                        : s.color === 'amber' ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-stone-700 border-stone-700 text-white'
                      : 'bg-white border-stone-200 text-stone-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {status !== 'skipped' && showRunFields && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Distância (km)">
                <input type="number" inputMode="decimal" step="0.1" value={distance}
                  onChange={(e) => setDistance(e.target.value)} className={inputCls} placeholder="—" />
              </Field>
              <Field label="Duração (min)">
                <input type="number" inputMode="numeric" value={duration}
                  onChange={(e) => setDuration(e.target.value)} className={inputCls} placeholder="—" />
              </Field>
              <Field label="Pace médio">
                <input type="text" inputMode="decimal" value={pace}
                  onChange={(e) => setPace(e.target.value)} className={inputCls} placeholder="4:35" />
              </Field>
              <Field label="FC média (bpm)">
                <input type="number" inputMode="numeric" value={hr}
                  onChange={(e) => setHr(e.target.value)} className={inputCls} placeholder="—" />
              </Field>
            </div>
          )}

          {status !== 'skipped' && (
            <div>
              <div className="flex items-baseline justify-between">
                <Label>Esforço (RPE)</Label>
                <span className="font-serif text-2xl tabular-nums text-stone-900">{rpe}</span>
              </div>
              <input
                type="range" min={1} max={10} step={1} value={rpe}
                onChange={(e) => setRpe(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1 fácil</span><span>5 médio</span><span>10 all-out</span>
              </div>
            </div>
          )}

          <Field label="Nota (opc)">
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={2} placeholder="Sensação, contexto, dor..."
              className={inputCls}
            />
          </Field>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-stone-200 text-stone-700 font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={pending}
              className="flex-1 py-3 rounded-lg bg-stone-900 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">{children}</div>;
}
