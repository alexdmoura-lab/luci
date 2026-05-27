'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { WorkoutStatus } from '@/lib/types';

export type LogWorkoutInput = {
  workout_id: string;
  status: WorkoutStatus;
  distance_km?: number | null;
  duration_min?: number | null;
  avg_pace_sec_per_km?: number | null;
  avg_hr?: number | null;
  rpe?: number | null;
  notes?: string | null;
  performed_at?: string;
};

export async function logWorkout(input: LogWorkoutInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthenticated' };

  const { error } = await supabase
    .from('workout_logs')
    .upsert(
      {
        user_id: user.id,
        workout_id: input.workout_id,
        status: input.status,
        distance_km: input.distance_km ?? null,
        duration_min: input.duration_min ?? null,
        avg_pace_sec_per_km: input.avg_pace_sec_per_km ?? null,
        avg_hr: input.avg_hr ?? null,
        rpe: input.rpe ?? null,
        notes: input.notes ?? null,
        performed_at: input.performed_at ?? new Date().toISOString(),
      },
      { onConflict: 'user_id,workout_id' }
    );

  if (error) return { error: error.message };

  revalidatePath('/hoje');
  revalidatePath('/plano');
  revalidatePath('/progresso');
  return { ok: true };
}

export async function deleteWorkoutLog(workout_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthenticated' };

  const { error } = await supabase
    .from('workout_logs')
    .delete()
    .eq('user_id', user.id)
    .eq('workout_id', workout_id);

  if (error) return { error: error.message };

  revalidatePath('/hoje');
  revalidatePath('/plano');
  revalidatePath('/progresso');
  return { ok: true };
}
