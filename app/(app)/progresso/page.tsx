import { WEEKS } from '@/lib/plan-data';
import { workoutId } from '@/lib/workout-id';
import { getDailyLogs, getWorkoutLogs } from '@/lib/queries';
import { paceSecToString } from '@/lib/format';
import { DAY_LABELS } from '@/lib/day-helpers';
import { createClient } from '@/lib/supabase/server';
import { stravaConfigured } from '@/lib/strava/tokens';

import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';
import { Sparkline } from '@/components/progress/sparkline';
import { WorkoutIcon } from '@/components/ui/workout-icon';
import { StravaCard } from '@/components/progress/strava-card';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ strava?: string }>;

export default async function ProgressoPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) ?? {};
  const stravaFlash = params.strava ?? null;

  // Load Strava token row (if any) to know connection status
  const supabase = await createClient();
  const { data: stravaToken } = await supabase
    .from('strava_tokens')
    .select('athlete_firstname')
    .maybeSingle();
  const stravaConnected = !!stravaToken;
  const athleteName = (stravaToken?.athlete_firstname as string | null) ?? null;
  const allIds = WEEKS.flatMap((w) =>
    w.days.flatMap((d) =>
      d.items.map((it, i) => ({
        id: workoutId(w.num, d.d, i),
        week: w.num,
        type: it.type,
        label: it.label,
        day: d.d,
      }))
    )
  );
  const idMeta = new Map(allIds.map((x) => [x.id, x]));

  const [logs, daily] = await Promise.all([getWorkoutLogs(), getDailyLogs(60)]);

  // Adesão por semana
  const weekStats = WEEKS.map((w) => {
    const nonRest = w.days.flatMap((d) =>
      d.items
        .map((it, i) => ({ id: workoutId(w.num, d.d, i), type: it.type }))
        .filter((x) => x.type !== 'rest')
    );
    const done = nonRest.filter((x) => logs.find((l) => l.workout_id === x.id)?.status === 'done')
      .length;
    const pct = nonRest.length > 0 ? (done / nonRest.length) * 100 : 0;
    return { num: w.num, total: nonRest.length, done, pct };
  });

  const totalDone = weekStats.reduce((acc, w) => acc + w.done, 0);
  const totalPlan = weekStats.reduce((acc, w) => acc + w.total, 0);
  const overallPct = totalPlan > 0 ? Math.round((totalDone / totalPlan) * 100) : 0;

  // Logs de corrida com pace
  const runLogs = logs
    .filter((l) => {
      const m = idMeta.get(l.workout_id);
      return (
        m && (m.type === 'run' || m.type === 'long') && l.avg_pace_sec_per_km != null
      );
    })
    .sort(
      (a, b) =>
        new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime()
    );

  const bestPaceSec = runLogs.reduce(
    (acc, l) => (l.avg_pace_sec_per_km! < acc ? l.avg_pace_sec_per_km! : acc),
    Infinity
  );
  const firstPaceSec = runLogs[0]?.avg_pace_sec_per_km ?? null;
  const paceDelta =
    firstPaceSec && bestPaceSec !== Infinity ? firstPaceSec - bestPaceSec : null;

  // Pesos
  const weights = daily
    .filter((d) => d.weight_kg != null)
    .map((d) => ({ date: d.date, weight: Number(d.weight_kg) }))
    .reverse();
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const firstWeight = weights[0]?.weight ?? null;
  const weightDelta = currentWeight && firstWeight ? currentWeight - firstWeight : null;

  // Últimos treinos
  const recent = [...logs]
    .sort(
      (a, b) =>
        new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
    )
    .slice(0, 8);

  const hasAnyData =
    weights.length > 0 || runLogs.length > 0 || recent.length > 0 || totalDone > 0;

  return (
    <div className="space-y-3.5">
      <header className="pt-3">
        <Label>progresso</Label>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          os números
          <br />
          <span className="italic text-[var(--color-accent-deep)]">contam.</span>
        </h1>
      </header>

      {stravaConfigured() && (
        <StravaCard
          connected={stravaConnected}
          athleteName={athleteName}
          flash={stravaFlash}
        />
      )}

      {!hasAnyData && (
        <Card variant="soft" className="text-center !py-8">
          <div className="font-serif italic text-base text-[var(--color-ink-soft)] leading-relaxed">
            marca o primeiro treino e<br />os gráficos aparecem aqui.
          </div>
        </Card>
      )}

      {/* Peso */}
      {weights.length > 0 && (
        <Card className="!p-[22px]">
          <div className="flex justify-between items-start gap-3 mb-3.5">
            <div>
              <Label className="mb-1.5">peso</Label>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif tab-num text-[44px] font-medium leading-none tracking-[-0.03em]">
                  {currentWeight}
                </span>
                <span className="text-sm text-[var(--color-muted)]">kg</span>
              </div>
              {weightDelta !== null && (
                <div
                  className={`text-[11px] font-semibold mt-1.5 ${
                    weightDelta < 0
                      ? 'text-[var(--color-done)]'
                      : weightDelta > 0
                        ? 'text-[var(--color-warn)]'
                        : 'text-[var(--color-muted)]'
                  }`}
                >
                  {weightDelta > 0 ? '↑' : weightDelta < 0 ? '↓' : '·'}{' '}
                  {Math.abs(weightDelta).toFixed(1)} kg em {weights.length}{' '}
                  {weights.length === 1 ? 'registro' : 'registros'}
                </div>
              )}
            </div>
            <Sparkline data={weights.map((w) => w.weight)} color="var(--color-accent)" />
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.06em] text-[var(--color-muted)] font-semibold">
            <span>{weights[0].date.slice(5).replace('-', '/')}</span>
            <span>hoje</span>
          </div>
        </Card>
      )}

      {/* Pace */}
      {runLogs.length > 0 && (
        <Card className="!p-[22px]">
          <div className="flex justify-between items-start gap-3 mb-3.5">
            <div>
              <Label className="mb-1.5">melhor pace</Label>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif tab-num text-[44px] font-medium leading-none tracking-[-0.03em]">
                  {paceSecToString(bestPaceSec).replace('/km', '')}
                </span>
                <span className="text-sm text-[var(--color-muted)]">/km</span>
              </div>
              {paceDelta !== null && paceDelta > 0 && (
                <div className="text-[11px] text-[var(--color-done)] font-semibold mt-1.5">
                  ↓ {paceDelta}s vs primeiro registro
                </div>
              )}
            </div>
            <Sparkline
              data={runLogs.map((l) => -(l.avg_pace_sec_per_km ?? 0))}
              color="var(--color-ink)"
            />
          </div>
          <CoachHint className="mt-1 !text-xs">
            ritmo de meia projetado:{' '}
            <strong className="font-bold not-italic">4:38/km</strong> — chega em 1h37.
          </CoachHint>
        </Card>
      )}

      {/* Adesão card preto */}
      {totalPlan > 0 && (
        <div
          className="rounded-[24px] p-[22px] text-[var(--color-paper)]"
          style={{
            background: '#1B1815',
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(255,87,34,.18), transparent 60%), radial-gradient(circle at 80% 100%, rgba(216,64,26,.12), transparent 60%)',
          }}
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.55)] mb-1.5">
                adesão geral
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif tab-num text-[44px] font-medium leading-none tracking-[-0.03em]">
                  {overallPct}
                </span>
                <span className="text-xl text-[rgba(243,238,228,0.55)]">%</span>
              </div>
              <div className="text-[11px] text-[var(--color-accent-soft)] mt-1.5 font-semibold">
                {totalDone} treinos · {totalPlan - totalDone} restantes
              </div>
            </div>
            <Sparkline
              data={weekStats.map((w) => w.pct)}
              color="var(--color-accent)"
              dark
            />
          </div>

          <div className="mt-4 flex gap-1 items-end h-[30px]">
            {weekStats.map((w, i) => (
              <div
                key={i}
                className="flex-1 rounded-[3px]"
                style={{
                  height: `${Math.max(8, w.pct)}%`,
                  background:
                    w.pct >= 90
                      ? 'var(--color-accent)'
                      : w.pct >= 75
                        ? 'rgba(255,87,34,.65)'
                        : 'rgba(243,238,228,.18)',
                  minHeight: 4,
                }}
              />
            ))}
          </div>
          <div className="flex gap-1 mt-1.5">
            {weekStats.map((w, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[9px] uppercase font-semibold text-[rgba(243,238,228,0.5)]"
              >
                s{i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos treinos */}
      {recent.length > 0 && (
        <div>
          <h2 className="font-serif text-[22px] font-medium tracking-[-0.02em] mb-3">
            últimos treinos
          </h2>
          <div className="space-y-2.5">
            {recent.map((l) => {
              const meta = idMeta.get(l.workout_id);
              const date = new Date(l.performed_at);
              const dateLabel = `${String(date.getDate()).padStart(2, '0')} ${date
                .toLocaleDateString('pt-BR', { month: 'short' })
                .replace('.', '')} · ${
                meta?.day ? DAY_LABELS[meta.day] : ''
              }`.trim();

              const metric1 =
                l.avg_pace_sec_per_km != null
                  ? paceSecToString(l.avg_pace_sec_per_km).replace('/km', '/km')
                  : l.distance_km != null
                    ? `${l.distance_km} km`
                    : l.rpe != null
                      ? `RPE ${l.rpe}`
                      : '—';
              const metric2 = [
                l.duration_min != null ? `${l.duration_min}min` : null,
                l.avg_hr != null ? `FC ${l.avg_hr}` : null,
              ]
                .filter(Boolean)
                .join(' · ');

              return (
                <div
                  key={l.id}
                  className="rounded-[24px] bg-[var(--color-card)] p-3.5"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                >
                  <div className="flex items-center gap-3">
                    <WorkoutIcon type={(meta?.type as 'run') ?? 'run'} size={40} />
                    <div className="flex-1 min-w-0">
                      <Label className="mb-0.5">{dateLabel}</Label>
                      <div className="font-serif text-[15px] font-medium leading-[1.1] text-[var(--color-ink)] truncate">
                        {meta?.label ?? l.workout_id}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="tab-num text-sm font-bold text-[var(--color-ink)]">
                        {metric1}
                      </div>
                      {metric2 && (
                        <div className="text-[10px] text-[var(--color-muted)] mt-0.5">
                          {metric2}
                        </div>
                      )}
                    </div>
                  </div>
                  {l.notes && (
                    <div
                      className="mt-2.5 pl-[52px] text-[12px] italic text-[var(--color-ink-soft)] font-serif leading-snug"
                      style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 14" }}
                    >
                      &ldquo;{l.notes}&rdquo;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
