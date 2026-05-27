import Link from 'next/link';
import { ChevronRight, Heart, Moon, Scale, Zap } from 'lucide-react';
import { WEEKS, RACE_DATE, type WorkoutType } from '@/lib/plan-data';
import { currentWeekNum, todayDayCode, todayISO, nextDayCode } from '@/lib/dates';
import { workoutId } from '@/lib/workout-id';
import { getDailyLog, getOverrides, getWorkoutLogs } from '@/lib/queries';
import { DAY_LABELS, DAY_INITIALS } from '@/lib/day-helpers';

import { WorkoutCard } from '@/components/plan/workout-card';
import { Card } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { HeroQuestion } from '@/components/ui/hero-question';
import { PhaseBadge } from '@/components/ui/phase-badge';
import { HalfGauge } from '@/components/ui/half-gauge';
import { DayDots, type DayDot } from '@/components/ui/day-dots';
import { StatCard } from '@/components/ui/stat-card';
import { CoachHint } from '@/components/ui/coach-hint';
import { WorkoutIcon } from '@/components/ui/workout-icon';
import { EnergyDots } from '@/components/ui/energy-dots';
import { Countdown } from '@/components/chrome/countdown';
import { MorningCheckin } from '@/components/today/morning-checkin';
import { MorningHero } from './morning-hero';
import { SupplementChecklist } from './supplement-checklist';

export const dynamic = 'force-dynamic';

const COACH_NOTES: Record<WorkoutType, string> = {
  rest: 'descanso é treino. sem culpa.',
  swim: 'sente a água, não força.',
  run: 'quarta. onde mora a adaptação.',
  long: 'hoje é o dia mais importante da semana.',
  strength: 'RIR 2. última rep deve sobrar uma.',
  race: 'é hoje. confia no que treinou.',
};

const GREETING_HEADLINE: Record<WorkoutType, { headline: React.ReactNode }> = {
  rest: { headline: <>descanso. <span className="italic text-[var(--color-accent-deep)]">sério.</span></> },
  swim: { headline: <>sente <span className="italic text-[var(--color-accent-deep)]">a água.</span></> },
  run: { headline: <>quarta-feira.<br/><span className="text-[var(--color-accent-deep)]">onde mora</span> a adaptação.</> },
  long: { headline: <>é hoje. <span className="italic text-[var(--color-accent-deep)]">longão.</span></> },
  strength: { headline: <>força. <span className="italic text-[var(--color-accent-deep)]">sem pressa.</span></> },
  race: { headline: <>dia da <span className="italic text-[var(--color-accent-deep)]">prova.</span></> },
};

export default async function HojePage() {
  const weekNum = currentWeekNum();
  const week = WEEKS.find((w) => w.num === weekNum)!;
  const day = todayDayCode();
  const tomorrow = nextDayCode(day);
  const todayPlan = week.days.find((d) => d.d === day)!;
  const tomorrowPlan = week.days.find((d) => d.d === tomorrow)!;

  const weekIds = week.days.flatMap((d) =>
    d.items.map((_, i) => workoutId(weekNum, d.d, i))
  );
  const nonRest = week.days.flatMap((d) =>
    d.items.map((it, i) => ({ id: workoutId(weekNum, d.d, i), type: it.type, day: d.d }))
  ).filter((x) => x.type !== 'rest');

  const [logs, overrides, dailyToday] = await Promise.all([
    getWorkoutLogs(weekIds),
    getOverrides(weekIds),
    getDailyLog(todayISO()),
  ]);

  const logMap = new Map(logs.map((l) => [l.workout_id, l]));
  const overrideMap = new Map(overrides.map((o) => [o.workout_id, o]));

  const weekDone = nonRest.filter((x) => logMap.get(x.id)?.status === 'done').length;
  const weekPlan = nonRest.length;
  const pct = weekPlan > 0 ? Math.round((weekDone / weekPlan) * 100) : 0;

  // Build day dots for the current week
  const todayIdx = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].indexOf(day);
  const dayDots: DayDot[] = week.days.map((d, idx) => {
    const isToday = d.d === day;
    const allRest = d.items.every((it) => it.type === 'rest');
    if (allRest) return { state: 'rest', label: DAY_LABELS[d.d] };
    const ids = d.items.map((_, i) => workoutId(weekNum, d.d, i));
    const allDone = ids.every((id) => logMap.get(id)?.status === 'done');
    const anyDone = ids.some((id) => logMap.get(id)?.status === 'done');
    const anySkipped = ids.some((id) => logMap.get(id)?.status === 'skipped');
    if (isToday) {
      return { state: 'today', label: DAY_LABELS[d.d], num: DAY_INITIALS[d.d] };
    }
    if (idx < todayIdx) {
      if (allDone || anyDone) return { state: 'past-done', label: DAY_LABELS[d.d] };
      if (anySkipped) return { state: 'past-skip', label: DAY_LABELS[d.d] };
      return { state: 'past-skip', label: DAY_LABELS[d.d] };
    }
    return { state: 'future', label: DAY_LABELS[d.d], num: DAY_INITIALS[d.d] };
  });

  const firstType = todayPlan.items[0]?.type ?? 'rest';
  const todayWorkoutItem = todayPlan.items[0];
  const todayWorkoutId = workoutId(weekNum, day, 0);
  const headline = GREETING_HEADLINE[firstType].headline;
  const coachNote = week.note || COACH_NOTES[firstType];

  // Streak: consecutive days with at least one done workout, ending today/yesterday
  const streak = computeStreak(weekDays(weekNum, week.days, logMap), day);

  const greetingText = getGreeting();

  return (
    <div className="space-y-3.5">
      <section>
        <HeroQuestion
          greeting={
            <>
              {greetingText}, felipe <span>👋</span>
            </>
          }
          headline={headline}
        />
        <div className="mt-3.5">
          <PhaseBadge week={weekNum} phaseColor={week.phaseColor} label={week.phase} />
        </div>
      </section>

      {/* Hero card de treino */}
      <MorningHero
        workoutId={todayWorkoutId}
        item={todayWorkoutItem}
        log={logMap.get(todayWorkoutId) ?? null}
        override={overrideMap.get(todayWorkoutId) ?? null}
        streak={streak}
        weekDone={weekDone}
        weekPlan={weekPlan}
        pct={pct}
        dayDots={dayDots}
        coachNote={coachNote}
      />

      {/* Stats 2x2 */}
      <StatGrid
        weight={dailyToday?.weight_kg ?? null}
        sleep={dailyToday?.sleep_hours ?? null}
        energy={dailyToday?.energy ?? null}
        weekDone={weekDone}
        weekPlan={weekPlan}
      />

      {/* Check-in matinal: peso, sono, energia */}
      <MorningCheckin today={dailyToday} />

      {/* Suplementos do dia */}
      <SupplementChecklist supplements={dailyToday?.supplements ?? {}} />

      {/* Amanhã */}
      <Link href="/plano" className="block">
        <Card variant="soft" className="flex items-center gap-3.5 cursor-pointer">
          <WorkoutIcon type={tomorrowPlan.items[0]?.type ?? 'rest'} size={42} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1">
              amanhã · {DAY_LABELS[tomorrow]}
            </div>
            <div className="font-serif text-[16px] font-medium leading-[1.2] text-[var(--color-ink)]">
              {tomorrowPlan.items[0]?.label ?? 'descanso'}
            </div>
            {tomorrowPlan.items[0]?.detail && (
              <div className="text-[11px] text-[var(--color-muted)] mt-1">
                {tomorrowPlan.items[0].detail}
              </div>
            )}
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--color-muted)]" />
        </Card>
      </Link>

      {/* Countdown */}
      <div className="py-2">
        <Countdown />
      </div>
    </div>
  );
}

function StatGrid({
  weight,
  sleep,
  energy,
  weekDone,
  weekPlan,
}: {
  weight: number | null;
  sleep: number | null;
  energy: number | null;
  weekDone: number;
  weekPlan: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <StatCard
        icon={<Scale className="w-4 h-4" strokeWidth={2} />}
        label="peso"
        value={weight != null ? `${weight}` : '—'}
        sub={weight != null ? 'kg' : 'toque pra registrar'}
      />
      <StatCard
        icon={<Moon className="w-4 h-4" strokeWidth={2} />}
        label="sono"
        value={sleep != null ? `${sleep}h` : '—'}
        sub={sleep != null ? 'horas' : 'toque pra registrar'}
      />
      <StatCard
        icon={<Zap className="w-4 h-4" strokeWidth={2} />}
        label="energia"
        value={energy != null ? <EnergyDots value={energy} /> : <span className="text-[var(--color-muted)]">—</span>}
        sub={energy != null ? `${energy} de 5` : 'toque pra registrar'}
      />
      <StatCard
        icon={<Heart className="w-4 h-4" strokeWidth={2} />}
        label="semana"
        value={
          <span className="tab-num">
            {weekDone}
            <span className="text-[var(--color-muted)] text-base">/{weekPlan}</span>
          </span>
        }
        sub="treinos feitos"
      />
    </div>
  );
}

function getGreeting(now = new Date()): string {
  const h = Number(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hour12: false,
    }).format(now)
  );
  if (h < 5) return 'boa madrugada';
  if (h < 12) return 'bom dia';
  if (h < 18) return 'boa tarde';
  return 'boa noite';
}

function weekDays(
  weekNum: number,
  days: { d: string; items: { type: string }[] }[],
  logMap: Map<string, { status: string }>
) {
  return days.map((d) => {
    const ids = d.items.map((_, i) => workoutId(weekNum, d.d as never, i));
    const anyDone = ids.some((id) => logMap.get(id)?.status === 'done');
    return { day: d.d, done: anyDone };
  });
}

function computeStreak(
  days: { day: string; done: boolean }[],
  todayDay: string
): number {
  const order = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  const todayIdx = order.indexOf(todayDay);
  let streak = 0;
  for (let i = todayIdx; i >= 0; i--) {
    const found = days.find((d) => d.day === order[i]);
    if (found?.done) streak++;
    else break;
  }
  return streak;
}
