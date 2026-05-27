'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  listActivities,
  mapStravaType,
  paceFromSpeed,
  type StravaActivity,
} from '@/lib/strava/client';
import { ensureFreshAccessToken } from '@/lib/strava/tokens';
import { WEEKS, type WorkoutType } from '@/lib/plan-data';
import { workoutId } from '@/lib/workout-id';
import { PLAN_START } from '@/lib/plan-data';
import { daysBetween } from '@/lib/dates';

export type SyncResult = {
  ok: boolean;
  error?: string;
  total: number;       // fetched from Strava
  saved: number;       // saved to strava_activities
  matched: number;     // matched & created workout_log entries
  skipped_existing: number; // manual log already existed
};

/**
 * Pulls activities from Strava and:
 *  - Stores each in strava_activities (idempotent via unique constraint)
 *  - For each activity, tries to match a planned workout by date + mapped type
 *  - If matched AND no manual log exists, upserts to workout_logs
 *
 * `sinceDays` defaults to 14 (last 2 weeks).
 */
export async function syncStrava(sinceDays = 14): Promise<SyncResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: 'unauthenticated', total: 0, saved: 0, matched: 0, skipped_existing: 0 };
  }

  let tokenRow;
  try {
    tokenRow = await ensureFreshAccessToken(user.id);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'token_error',
      total: 0,
      saved: 0,
      matched: 0,
      skipped_existing: 0,
    };
  }
  if (!tokenRow) {
    return { ok: false, error: 'not_connected', total: 0, saved: 0, matched: 0, skipped_existing: 0 };
  }

  const since = Math.floor((Date.now() - sinceDays * 86400 * 1000) / 1000);
  let activities: StravaActivity[] = [];
  try {
    activities = await listActivities({
      accessToken: tokenRow.access_token,
      after: since,
      perPage: 50,
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'fetch_failed',
      total: 0,
      saved: 0,
      matched: 0,
      skipped_existing: 0,
    };
  }

  let saved = 0;
  let matched = 0;
  let skipped_existing = 0;

  for (const a of activities) {
    const mappedType = mapStravaType(a.type, a.sport_type);
    if (!mappedType) continue;

    // Use local start date (no TZ shifting) — Strava sends local already.
    const startLocal = a.start_date_local || a.start_date;
    const startDate = startLocal.slice(0, 10); // YYYY-MM-DD
    const pace = a.average_speed ? paceFromSpeed(a.average_speed) : null;
    const movingMin = Math.round(a.moving_time / 60);
    const distanceKm = a.distance ? Number((a.distance / 1000).toFixed(2)) : null;
    const avgHr = a.average_heartrate ? Math.round(a.average_heartrate) : null;
    const maxHr = a.max_heartrate ? Math.round(a.max_heartrate) : null;

    // Find matching planned workout — same date in Brasília TZ + same mapped type
    const matchedWorkoutId = findMatchingWorkout(startDate, mappedType);

    // Save / upsert the raw activity record
    const { error: actErr } = await supabase
      .from('strava_activities')
      .upsert(
        {
          user_id: user.id,
          strava_id: a.id,
          type: a.sport_type ?? a.type,
          name: a.name,
          start_date: startDate,
          start_time: a.start_date,
          distance_m: a.distance ?? null,
          moving_time_s: a.moving_time ?? null,
          elapsed_time_s: a.elapsed_time ?? null,
          avg_pace_sec_per_km: pace,
          avg_hr: avgHr,
          max_hr: maxHr,
          total_elevation_m: a.total_elevation_gain ?? null,
          matched_workout_id: matchedWorkoutId,
          raw: a,
        },
        { onConflict: 'user_id,strava_id' }
      );

    if (!actErr) saved++;

    // If we have a match, try to create a workout_log — but only if Felipe
    // hasn't already manually logged something for this workout.
    if (matchedWorkoutId) {
      const { data: existing } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('workout_id', matchedWorkoutId)
        .maybeSingle();

      if (existing) {
        skipped_existing++;
        continue;
      }

      const { error: logErr } = await supabase.from('workout_logs').upsert(
        {
          user_id: user.id,
          workout_id: matchedWorkoutId,
          status: 'done',
          distance_km: distanceKm,
          duration_min: movingMin,
          avg_pace_sec_per_km: pace,
          avg_hr: avgHr,
          rpe: null,
          notes: `via strava · ${a.name}`,
          performed_at: a.start_date,
        },
        { onConflict: 'user_id,workout_id' }
      );

      if (!logErr) matched++;
    }
  }

  revalidatePath('/hoje');
  revalidatePath('/plano');
  revalidatePath('/progresso');

  return {
    ok: true,
    total: activities.length,
    saved,
    matched,
    skipped_existing,
  };
}

/**
 * Given a date (YYYY-MM-DD) and a workout type, find the first matching planned
 * workout id in the plan. Returns null if no match.
 */
function findMatchingWorkout(dateISO: string, mappedType: WorkoutType): string | null {
  const days = daysBetween(PLAN_START, dateISO);
  if (days < 0) return null;
  const weekIdx = Math.floor(days / 7);
  const dayIdx = days % 7;
  const week = WEEKS[weekIdx];
  if (!week) return null;
  const dayCodes = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'] as const;
  const dayCode = dayCodes[dayIdx];
  const dayPlan = week.days.find((d) => d.d === dayCode);
  if (!dayPlan) return null;

  // Prefer exact type match; fallback to 'long' counting as 'run' and vice-versa.
  const exact = dayPlan.items.findIndex((it) => it.type === mappedType);
  if (exact >= 0) return workoutId(week.num, dayCode, exact);

  if (mappedType === 'run') {
    const long = dayPlan.items.findIndex((it) => it.type === 'long');
    if (long >= 0) return workoutId(week.num, dayCode, long);
  }
  if (mappedType === 'long') {
    const run = dayPlan.items.findIndex((it) => it.type === 'run');
    if (run >= 0) return workoutId(week.num, dayCode, run);
  }

  return null;
}
