'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { todayISO } from '@/lib/dates';

export type DailyLogInput = {
  date?: string;
  weight_kg?: number | null;
  sleep_hours?: number | null;
  energy?: number | null;
  meals_done?: number;
  supplements?: Record<string, boolean>;
  notes?: string | null;
};

export async function upsertDailyLog(input: DailyLogInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthenticated' };

  const date = input.date ?? todayISO();

  // Lê o atual pra fazer merge nos suplementos (jsonb)
  const { data: existing } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .maybeSingle();

  const merged = {
    user_id: user.id,
    date,
    weight_kg: input.weight_kg ?? existing?.weight_kg ?? null,
    sleep_hours: input.sleep_hours ?? existing?.sleep_hours ?? null,
    energy: input.energy ?? existing?.energy ?? null,
    meals_done: input.meals_done ?? existing?.meals_done ?? 0,
    supplements: { ...(existing?.supplements ?? {}), ...(input.supplements ?? {}) },
    notes: input.notes ?? existing?.notes ?? null,
  };

  const { error } = await supabase
    .from('daily_logs')
    .upsert(merged, { onConflict: 'user_id,date' });

  if (error) return { error: error.message };

  revalidatePath('/hoje');
  revalidatePath('/nutricao');
  revalidatePath('/progresso');
  return { ok: true };
}
