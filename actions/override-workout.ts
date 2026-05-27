'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type OverrideInput = {
  workout_id: string;
  moved_to_day?: string | null;
  new_label?: string | null;
  new_detail?: string | null;
  new_type?: string | null;
  reason?: string | null;
};

export async function overrideWorkout(input: OverrideInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthenticated' };

  const { error } = await supabase
    .from('workout_overrides')
    .upsert(
      {
        user_id: user.id,
        workout_id: input.workout_id,
        moved_to_day: input.moved_to_day ?? null,
        new_label: input.new_label ?? null,
        new_detail: input.new_detail ?? null,
        new_type: input.new_type ?? null,
        reason: input.reason ?? null,
      },
      { onConflict: 'user_id,workout_id' }
    );

  if (error) return { error: error.message };

  revalidatePath('/hoje');
  revalidatePath('/plano');
  return { ok: true };
}

export async function clearOverride(workout_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthenticated' };

  const { error } = await supabase
    .from('workout_overrides')
    .delete()
    .eq('user_id', user.id)
    .eq('workout_id', workout_id);

  if (error) return { error: error.message };

  revalidatePath('/hoje');
  revalidatePath('/plano');
  return { ok: true };
}
