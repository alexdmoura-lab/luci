-- Luci · schema inicial
-- Roda no Supabase Studio (SQL Editor) ou via supabase CLI.

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  workout_id text not null,
  status text not null check (status in ('done', 'partial', 'skipped')),
  distance_km numeric,
  duration_min numeric,
  avg_pace_sec_per_km int,
  avg_hr int,
  rpe int check (rpe between 1 and 10),
  notes text,
  performed_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, workout_id)
);

create table if not exists public.workout_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  workout_id text not null,
  moved_to_day text,
  new_label text,
  new_detail text,
  new_type text,
  reason text,
  created_at timestamptz default now(),
  unique (user_id, workout_id)
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  weight_kg numeric,
  sleep_hours numeric,
  energy int check (energy between 1 and 5),
  meals_done int default 0,
  supplements jsonb default '{}'::jsonb,
  notes text,
  unique (user_id, date)
);

alter table public.workout_logs enable row level security;
alter table public.workout_overrides enable row level security;
alter table public.daily_logs enable row level security;

create policy "own workout_logs" on public.workout_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own workout_overrides" on public.workout_overrides
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own daily_logs" on public.daily_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists workout_logs_touch on public.workout_logs;
create trigger workout_logs_touch
  before update on public.workout_logs
  for each row execute function public.touch_updated_at();
