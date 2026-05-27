import { WEEKS, RACE_DATE } from '@/lib/plan-data';
import { currentWeekNum, daysUntilRace, todayDayCode, todayISO, nextDayCode } from '@/lib/dates';
import { workoutId } from '@/lib/workout-id';
import { getDailyLog, getOverrides, getWorkoutLogs } from '@/lib/queries';
import { WorkoutCard } from '@/components/plan/workout-card';
import { AdherenceRing } from '@/components/today/adherence-ring';
import { MorningCheckin } from '@/components/today/morning-checkin';
import { PhaseBadge } from '@/components/ui/phase-badge';
import { Countdown } from '@/components/chrome/countdown';
import { plural } from '@/lib/format';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

const COACH_NOTES: Record<string, string> = {
  rest: 'Descanso é treino. Sem culpa.',
  swim: 'Sente a água, não força. Técnica > pressa.',
  run: 'Aquece bem. Os 2 primeiros km contam.',
  long: 'Hoje é o dia mais importante da semana.',
  strength: 'RIR 2. Última rep deve sobrar uma.',
  race: 'Confia no que treinou. Primeiro km segura.',
};

export default async function HojePage() {
  const weekNum = currentWeekNum();
  const week = WEEKS.find((w) => w.num === weekNum)!;
  const day = todayDayCode();
  const tomorrow = nextDayCode(day);
  const todayPlan = week.days.find((d) => d.d === day)!;
  const tomorrowPlan = week.days.find((d) => d.d === tomorrow)!;

  // Pegar todos os IDs da semana pra contar adesão
  const weekIds = week.days.flatMap((d) =>
    d.items.map((_, i) => workoutId(weekNum, d.d, i))
  );
  const nonRestIds = week.days.flatMap((d) =>
    d.items.map((it, i) => ({ id: workoutId(weekNum, d.d, i), type: it.type }))
  ).filter((x) => x.type !== 'rest').map((x) => x.id);

  const [logs, overrides, dailyToday] = await Promise.all([
    getWorkoutLogs(weekIds),
    getOverrides(weekIds),
    getDailyLog(todayISO()),
  ]);

  const logMap = new Map(logs.map((l) => [l.workout_id, l]));
  const overrideMap = new Map(overrides.map((o) => [o.workout_id, o]));

  const doneCount = nonRestIds.filter((id) => logMap.get(id)?.status === 'done').length;

  const days = daysUntilRace();
  const isRest = todayPlan.items.every((i) => i.type === 'rest');
  const firstType = todayPlan.items[0]?.type ?? 'rest';
  const coachNote = week.note || COACH_NOTES[firstType];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-700 mb-1">
              {day} · {todayISO().split('-').reverse().slice(0, 2).join('/')}
            </div>
            <Countdown />
          </div>
          <AdherenceRing total={nonRestIds.length} done={doneCount} size={72} stroke={7} />
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <PhaseBadge phase={`Semana ${weekNum} · ${week.phase}`} color={week.phaseColor} />
            <h1 className="font-serif text-2xl sm:text-3xl tracking-tight mt-2">{week.title}</h1>
          </div>
          <Link href="/plano" className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Semana inteira
          </Link>
        </div>

        {coachNote && (
          <p className="mt-4 text-sm italic text-stone-600 border-l-2 border-orange-300 pl-3">
            {coachNote}
          </p>
        )}
      </section>

      {/* Treino de hoje */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 px-1">
          {isRest ? 'Hoje' : `${plural(todayPlan.items.length, 'Treino', 'Treinos')} de hoje`}
        </h2>
        <div className="space-y-2">
          {todayPlan.items.map((item, i) => {
            const id = workoutId(weekNum, day, i);
            return (
              <WorkoutCard
                key={id}
                workoutId={id}
                item={item}
                log={logMap.get(id)}
                override={overrideMap.get(id)}
              />
            );
          })}
        </div>
      </section>

      {/* Check-in matinal */}
      <MorningCheckin today={dailyToday} />

      {/* Amanhã */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 px-1">
          Amanhã · {tomorrow}
        </h2>
        <div className="space-y-2">
          {tomorrowPlan.items.map((item, i) => {
            const id = workoutId(weekNum, tomorrow, i);
            return (
              <WorkoutCard
                key={id}
                workoutId={id}
                item={item}
                log={logMap.get(id)}
                override={overrideMap.get(id)}
                compact
              />
            );
          })}
        </div>
      </section>

      <p className="text-center text-[11px] text-stone-400 pt-2">
        Faltam <strong>{days}</strong> {plural(days, 'dia', 'dias')} pra <strong>{RACE_DATE.split('-').reverse().join('/')}</strong>.
      </p>
    </div>
  );
}
