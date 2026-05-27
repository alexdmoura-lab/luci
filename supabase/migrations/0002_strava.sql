-- Luci · Strava integration
-- Stores OAuth tokens + activity cache.

create table if not exists public.strava_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  athlete_id bigint not null,
  athlete_firstname text,
  athlete_lastname text,
  connected_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.strava_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  strava_id bigint not null,
  type text not null,
  name text,
  start_date date not null,
  start_time timestamptz not null,
  distance_m numeric,
  moving_time_s int,
  elapsed_time_s int,
  avg_pace_sec_per_km int,
  avg_hr int,
  max_hr int,
  total_elevation_m numeric,
  -- workout_id if this activity matched a planned workout
  matched_workout_id text,
  raw jsonb,
  imported_at timestamptz default now(),
  unique (user_id, strava_id)
);

create index if not exists idx_strava_activities_user_date
  on public.strava_activities (user_id, start_date desc);

alter table public.strava_tokens enable row level security;
alter table public.strava_activities enable row level security;

drop policy if exists "own strava_tokens" on public.strava_tokens;
create policy "own strava_tokens" on public.strava_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own strava_activities" on public.strava_activities;
create policy "own strava_activities" on public.strava_activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists strava_tokens_touch on public.strava_tokens;
create trigger strava_tokens_touch
  before update on public.strava_tokens
  for each row execute function public.touch_updated_at();
