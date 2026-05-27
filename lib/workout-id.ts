import { DayCode, WEEKS, WorkoutItem } from './plan-data';

const DAY_SLUG: Record<DayCode, string> = {
  'SEG': 'seg',
  'TER': 'ter',
  'QUA': 'qua',
  'QUI': 'qui',
  'SEX': 'sex',
  'SÁB': 'sab',
  'DOM': 'dom',
};

const SLUG_TO_DAY: Record<string, DayCode> = Object.fromEntries(
  Object.entries(DAY_SLUG).map(([k, v]) => [v, k as DayCode])
);

export function workoutId(week: number, day: DayCode, index: number): string {
  return `w${week}-${DAY_SLUG[day]}-${index}`;
}

export function parseWorkoutId(id: string): { week: number; day: DayCode; index: number } | null {
  const m = id.match(/^w(\d+)-([a-z]+)-(\d+)$/);
  if (!m) return null;
  const day = SLUG_TO_DAY[m[2]];
  if (!day) return null;
  return { week: Number(m[1]), day, index: Number(m[3]) };
}

export function findWorkout(id: string): { item: WorkoutItem; week: number; day: DayCode } | null {
  const parsed = parseWorkoutId(id);
  if (!parsed) return null;
  const wk = WEEKS.find((w) => w.num === parsed.week);
  if (!wk) return null;
  const day = wk.days.find((d) => d.d === parsed.day);
  if (!day) return null;
  const item = day.items[parsed.index];
  if (!item) return null;
  return { item, week: parsed.week, day: parsed.day };
}
