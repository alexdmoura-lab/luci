export type WorkoutStatus = 'done' | 'partial' | 'skipped';

export type WorkoutLog = {
  id: string;
  user_id: string;
  workout_id: string;
  status: WorkoutStatus;
  distance_km: number | null;
  duration_min: number | null;
  avg_pace_sec_per_km: number | null;
  avg_hr: number | null;
  rpe: number | null;
  notes: string | null;
  performed_at: string;
  created_at: string;
  updated_at: string;
};

export type WorkoutOverride = {
  id: string;
  user_id: string;
  workout_id: string;
  moved_to_day: string | null;
  new_label: string | null;
  new_detail: string | null;
  new_type: string | null;
  reason: string | null;
  created_at: string;
};

export type DailyLog = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  sleep_hours: number | null;
  energy: number | null;
  meals_done: number;
  supplements: Record<string, boolean>;
  notes: string | null;
};
