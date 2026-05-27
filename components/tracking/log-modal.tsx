'use client';

import { useState, useTransition, useEffect } from 'react';
import { X } from 'lucide-react';
import { logWorkout } from '@/actions/log-workout';
import { parsePace } from '@/lib/format';
import type { WorkoutItem } from '@/lib/plan-data';
import type { WorkoutLog, WorkoutStatus } from '@/lib/types';

type Props = {
  workoutId: string;
  workout: WorkoutItem;
  current: WorkoutLog | null;
  onClose: () => void;
};

export function LogModal({ workoutId, workout, current, onClose }: Props) {
  const [status, setStatus] = useState<WorkoutStatus>(current?.status ?? 'done');
  const [paceMin, setPaceMin] = useState<number>(
    current?.avg_pace_sec_per_km ? Math.floor(current.avg_pace_sec_per_km / 60) : 4
  );
  const [paceSec, setPaceSec] = useState<number>(
    current?.avg_pace_sec_per_km ? current.avg_pace_sec_per_km % 60 : 32
  );
  const [distance, setDistance] = useState(current?.distance_km?.toString() ?? '');
  const [hr, setHr] = useState<number>(current?.avg_hr ?? 152);
  const [rpe, setRpe] = useState(current?.rpe ?? 7);
  const [notes, setNotes] = useState(current?.notes ?? '');
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  const isRunish = workout.type === 'run' || workout.type === 'long' || workout.type === 'race';

  function save() {
    setError(null);
    const paceStr = `${paceMin}:${String(paceSec).padStart(2, '0')}`;
    const parsedPace = status !== 'skipped' ? parsePace(paceStr) : null;

    start(async () => {
      const res = await logWorkout({
        workout_id: workoutId,
        status,
        distance_km: distance ? Number(distance) : null,
        avg_pace_sec_per_km: status !== 'skipped' && parsedPace ? parsedPace : null,
        avg_hr: status !== 'skipped' ? hr : null,
        rpe: status !== 'skipped' ? rpe : null,
        notes: notes || null,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(onClose, 1200);
    });
  }

  if (saved) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 animate-fade-in"
          style={{ background: 'rgba(27,24,21,.42)' }}
        />
        <div
          className="fixed left-0 right-0 bottom-0 z-50 rounded-t-[28px] px-5 pt-8 pb-10 max-h-[88%] flex flex-col animate-sheet-up"
          style={{
            background: 'var(--color-paper)',
            backgroundImage:
              'radial-gradient(circle at center, rgba(27,24,21,.05) 1px, transparent 1.2px)',
            backgroundSize: '14px 14px',
          }}
        >
          <div className="w-10 h-1 bg-[#C7BFAE] rounded-full mx-auto mb-3.5" />
          <div className="text-center py-9">
            <div className="w-[84px] h-[84px] rounded-full mx-auto mb-[18px] flex items-center justify-center bg-[var(--color-done-soft)] text-[var(--color-done)]">
              <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path className="animate-check-draw" d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2 className="font-serif text-[28px] font-medium tracking-[-0.02em] m-0">feito.</h2>
            <div className="mt-2 text-sm font-serif italic text-[var(--color-ink-soft)]">
              registrado. continua firme.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 animate-fade-in"
        style={{ background: 'rgba(27,24,21,.42)' }}
        onClick={onClose}
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-50 rounded-t-[28px] px-5 pt-4 pb-7 max-h-[90%] flex flex-col animate-sheet-up"
        style={{
          background: 'var(--color-paper)',
          backgroundImage:
            'radial-gradient(circle at center, rgba(27,24,21,.05) 1px, transparent 1.2px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className="w-10 h-1 bg-[#C7BFAE] rounded-full mx-auto mb-3.5" />

        <div className="flex items-start justify-between mb-3.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              treino · {workout.label}
            </div>
            <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] mt-1 leading-tight">
              como foi?
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="tap w-8 h-8 rounded-full bg-[var(--color-card)] border-0 flex items-center justify-center text-[var(--color-ink-soft)]"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar flex-1 min-h-0 pb-2">
          {/* status */}
          <div className="mb-[18px]">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
              status
            </div>
            <div className="flex gap-2">
              {(
                [
                  { v: 'done' as WorkoutStatus, label: 'feito', color: 'var(--color-accent)' },
                  { v: 'partial' as WorkoutStatus, label: 'parcial', color: 'var(--color-warn)' },
                  { v: 'skipped' as WorkoutStatus, label: 'pulei', color: 'var(--color-muted)' },
                ]
              ).map((s) => (
                <button
                  key={s.v}
                  onClick={() => setStatus(s.v)}
                  className="tap flex-1 rounded-full px-4 py-3 font-semibold text-[13px] cursor-pointer transition"
                  style={
                    status === s.v
                      ? {
                          background: s.color,
                          color: '#fff',
                          border: 'none',
                          boxShadow: '0 4px 10px rgba(0,0,0,.08)',
                        }
                      : {
                          background: 'var(--color-card)',
                          color: 'var(--color-ink-soft)',
                          border: '1px solid var(--color-line)',
                        }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {status !== 'skipped' && (
            <>
              {isRunish && (
                <div className="rounded-[18px] p-4 mb-3 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
                    pace médio
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline">
                      <input
                        type="number"
                        value={paceMin}
                        onChange={(e) => setPaceMin(Math.max(0, Number(e.target.value)))}
                        className="bg-transparent border-0 outline-none font-serif tab-num text-[32px] font-medium w-[50px] text-center text-[var(--color-ink)] tracking-[-0.02em]"
                      />
                      <span className="font-serif text-[32px] text-[var(--color-muted)]">:</span>
                      <input
                        type="number"
                        value={String(paceSec).padStart(2, '0')}
                        onChange={(e) => setPaceSec(Math.min(59, Math.max(0, Number(e.target.value))))}
                        className="bg-transparent border-0 outline-none font-serif tab-num text-[32px] font-medium w-[50px] text-center text-[var(--color-ink)] tracking-[-0.02em]"
                      />
                      <span className="text-sm text-[var(--color-muted)] ml-1.5">/km</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div className="rounded-[18px] p-4 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
                    fc média
                  </div>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      value={hr}
                      onChange={(e) => setHr(Number(e.target.value))}
                      className="bg-transparent border-0 outline-none font-serif tab-num text-[28px] font-medium w-[70px] text-[var(--color-ink)] tracking-[-0.02em]"
                    />
                    <span className="text-xs text-[var(--color-muted)]">bpm</span>
                  </div>
                </div>
                <div className="rounded-[18px] p-4 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
                    rpe
                  </div>
                  <div className="flex gap-[3px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRpe(n)}
                        className="tap flex-1 h-[22px] border-0 rounded-[4px] cursor-pointer transition-colors"
                        style={{
                          background: n <= rpe ? 'var(--color-accent)' : 'var(--color-paper)',
                        }}
                        aria-label={`RPE ${n}`}
                      />
                    ))}
                  </div>
                  <div className="mt-1.5 text-[11px] text-[var(--color-muted)]">
                    {rpe} de 10 · {rpe <= 4 ? 'fácil' : rpe <= 7 ? 'firme' : 'duro'}
                  </div>
                </div>
              </div>

              {isRunish && (
                <div className="rounded-[18px] p-4 mb-3 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
                    distância (opc)
                  </div>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="—"
                      className="bg-transparent border-0 outline-none font-serif tab-num text-[24px] font-medium w-[80px] text-[var(--color-ink)] placeholder-[var(--color-muted)]"
                    />
                    <span className="text-xs text-[var(--color-muted)]">km</span>
                  </div>
                </div>
              )}

              <div className="rounded-[18px] p-4 mb-3.5 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
                  nota
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="como tu se sentiu? pé, perna, cabeça…"
                  className="w-full border-0 bg-transparent outline-none text-[13px] text-[var(--color-ink)] resize-none placeholder-[var(--color-muted)]"
                />
              </div>
            </>
          )}

          {status === 'skipped' && (
            <div className="rounded-[18px] p-4 mb-3.5 bg-[var(--color-paper-soft)] border border-[var(--color-line)]">
              <div className="font-serif italic text-sm text-[var(--color-ink-soft)] border-l-2 border-[var(--color-accent)] pl-2.5">
                tudo bem. amanhã tem mais. anota o porquê pra ver padrões depois.
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="motivo?"
                className="mt-2.5 w-full border-0 bg-[var(--color-paper)] rounded-xl outline-none text-[13px] text-[var(--color-ink)] resize-none p-3 placeholder-[var(--color-muted)]"
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800 mb-2">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={save}
          disabled={pending}
          className="tap mt-1.5 w-full rounded-full py-4 px-6 font-bold text-[15px] text-white border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-pop)' }}
        >
          {pending ? 'salvando…' : 'salvar treino'}
        </button>
      </div>
    </>
  );
}
