import { WEEKS } from '@/lib/plan-data';
import { currentWeekNum } from '@/lib/dates';
import { getOverrides, getWorkoutLogs } from '@/lib/queries';
import { workoutId } from '@/lib/workout-id';
import { PlanClient } from './plan-client';

export const dynamic = 'force-dynamic';

export default async function PlanoPage() {
  const allIds = WEEKS.flatMap((w) =>
    w.days.flatMap((d) => d.items.map((_, i) => workoutId(w.num, d.d, i)))
  );

  const [logs, overrides] = await Promise.all([
    getWorkoutLogs(allIds),
    getOverrides(allIds),
  ]);

  return (
    <PlanClient
      initialWeek={currentWeekNum()}
      logs={logs}
      overrides={overrides}
    />
  );
}
