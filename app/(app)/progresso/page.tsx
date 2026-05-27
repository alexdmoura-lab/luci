import { WEEKS } from '@/lib/plan-data';
import { workoutId } from '@/lib/workout-id';
import { getDailyLogs, getWorkoutLogs } from '@/lib/queries';
import { paceSecToString } from '@/lib/format';
import { WeightChart } from '@/components/progress/weight-chart';
import { PaceChart } from '@/components/progress/pace-chart';

export const dynamic = 'force-dynamic';

export default async function ProgressoPage() {
  const allIds = WEEKS.flatMap((w) =>
    w.days.flatMap((d) => d.items.map((it, i) => ({
      id: workoutId(w.num, d.d, i),
      week: w.num,
      type: it.type,
      label: it.label,
    })))
  );
  const idMeta = new Map(allIds.map((x) => [x.id, x]));

  const [logs, daily] = await Promise.all([
    getWorkoutLogs(),
    getDailyLogs(60),
  ]);

  // Adesão por semana (treinos não-rest)
  const weekStats = WEEKS.map((w) => {
    const ids = w.days.flatMap((d) =>
      d.items.map((it, i) => ({ id: workoutId(w.num, d.d, i), type: it.type }))
    ).filter((x) => x.type !== 'rest');
    const done = ids.filter((x) => logs.find((l) => l.workout_id === x.id)?.status === 'done').length;
    return { num: w.num, phase: w.phase, color: w.phaseColor, total: ids.length, done };
  });

  // Logs de corrida com pace pra gráfico
  const runLogs = logs
    .filter((l) => {
      const meta = idMeta.get(l.workout_id);
      return meta && (meta.type === 'run' || meta.type === 'long') && l.avg_pace_sec_per_km;
    })
    .sort((a, b) => new Date(a.performed_at).getTime() - new Date(b.performed_at).getTime())
    .map((l) => ({
      date: l.performed_at.split('T')[0],
      pace: l.avg_pace_sec_per_km!,
      label: idMeta.get(l.workout_id)?.label ?? '',
    }));

  // Pesos
  const weights = daily
    .filter((d) => d.weight_kg != null)
    .map((d) => ({ date: d.date, weight: Number(d.weight_kg) }))
    .reverse();

  // Últimos treinos
  const recent = [...logs]
    .sort((a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl tracking-tight">Progresso</h1>
        <p className="text-sm text-stone-500 mt-0.5">Adesão, peso e evolução de pace.</p>
      </header>

      {/* Adesão por semana */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
          Adesão por semana
        </h2>
        <div className="space-y-2">
          {weekStats.map((w) => {
            const pct = w.total > 0 ? (w.done / w.total) * 100 : 0;
            return (
              <div key={w.num} className="flex items-center gap-3">
                <div className="w-8 text-xs text-stone-500 tabular-nums">S{w.num}</div>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all rounded-full"
                    style={{ width: `${pct}%`, background: barColor(w.color) }}
                  />
                </div>
                <div className="w-16 text-xs text-right text-stone-600 tabular-nums">
                  {w.done}/{w.total}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Peso */}
      {weights.length > 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Peso
            </h2>
            {weights.length >= 2 && (
              <span className="text-xs text-stone-500">
                Δ {(weights[weights.length - 1].weight - weights[0].weight).toFixed(1)} kg
              </span>
            )}
          </div>
          <WeightChart data={weights} />
        </section>
      )}

      {/* Pace */}
      {runLogs.length > 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
            Pace nas corridas
          </h2>
          <PaceChart data={runLogs} />
        </section>
      )}

      {/* Últimos treinos */}
      {recent.length > 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
            Últimos {recent.length} treinos
          </h2>
          <div className="divide-y divide-stone-100">
            {recent.map((l) => {
              const meta = idMeta.get(l.workout_id);
              return (
                <div key={l.id} className="py-2.5 flex items-baseline justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-stone-900 truncate">{meta?.label ?? l.workout_id}</div>
                    <div className="text-xs text-stone-500">
                      {new Date(l.performed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      {l.distance_km != null && ` · ${l.distance_km}km`}
                      {l.avg_pace_sec_per_km != null && ` · ${paceSecToString(l.avg_pace_sec_per_km)}`}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    l.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                    l.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>{l.status === 'done' ? 'feito' : l.status === 'partial' ? 'parcial' : 'pulado'}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {weights.length === 0 && runLogs.length === 0 && recent.length === 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <p className="text-sm text-stone-500">
            Marca o primeiro treino e os gráficos aparecem aqui.
          </p>
        </section>
      )}
    </div>
  );
}

function barColor(c: string): string {
  const map: Record<string, string> = {
    amber: '#d97706', orange: '#ea580c', green: '#16a34a',
    red: '#dc2626', blue: '#2563eb', purple: '#9333ea',
  };
  return map[c] ?? '#1c1917';
}
