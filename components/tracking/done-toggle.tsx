'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { logWorkout, deleteWorkoutLog } from '@/actions/log-workout';
import type { WorkoutStatus } from '@/lib/types';

export function DoneToggle({
  workoutId,
  status,
  onClick,
}: {
  workoutId: string;
  status: WorkoutStatus | null;
  /** Se passado, abre log modal em vez de só marcar. */
  onClick?: () => void;
}) {
  const [pending, start] = useTransition();
  const done = status === 'done';

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) return onClick();
    start(async () => {
      if (done) await deleteWorkoutLog(workoutId);
      else await logWorkout({ workout_id: workoutId, status: 'done' });
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={done ? 'Desmarcar treino' : 'Marcar treino como feito'}
      className={`relative shrink-0 w-7 h-7 rounded-full border-2 transition flex items-center justify-center ${
        done
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-stone-300 bg-white hover:border-stone-500'
      } ${pending ? 'opacity-50' : ''}`}
    >
      {pending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : done ? (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline className="animate-draw-check" points="5 12 10 17 19 8" />
        </svg>
      ) : null}
    </button>
  );
}
