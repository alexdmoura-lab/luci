import { createClient } from './supabase/server';
import type { DailyLog, WorkoutLog, WorkoutOverride } from './types';

export async function getUserOrThrow() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthenticated');
  return user;
}

export async function getWorkoutLogs(workoutIds?: string[]): Promise<WorkoutLog[]> {
  const supabase = await createClient();
  let q = supabase.from('workout_logs').select('*');
  if (workoutIds && workoutIds.length) q = q.in('workout_id', workoutIds);
  const { data, error } = await q.order('performed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as WorkoutLog[];
}

export async function getOverrides(workoutIds?: string[]): Promise<WorkoutOverride[]> {
  const supabase = await createClient();
  let q = supabase.from('workout_overrides').select('*');
  if (workoutIds && workoutIds.length) q = q.in('workout_id', workoutIds);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as WorkoutOverride[];
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data as DailyLog | null;
}

export async function getDailyLogs(limit = 30): Promise<DailyLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DailyLog[];
}
