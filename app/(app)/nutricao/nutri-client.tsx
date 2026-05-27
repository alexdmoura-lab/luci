'use client';

import { useState, useTransition } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { upsertDailyLog } from '@/actions/daily-log';
import type { DailyLog } from '@/lib/types';
import type { NutriDayKey } from '@/lib/plan-data';

type Dias = Record<NutriDayKey, {
  label: string;
  kcal: string;
  color: 'red' | 'amber' | 'emerald';
  desc: string;
  regra: string;
  meals: { time: string; name: string; items: string }[];
}>;

const dayColors = {
  red: 'border-red-300 text-red-700',
  amber: 'border-amber-300 text-amber-700',
  emerald: 'border-emerald-300 text-emerald-700',
};

export function NutriClient({
  dias,
  suplementos,
  todayLog,
}: {
  dias: Dias;
  suplementos: ReadonlyArray<{ id: string; nome: string; dose: string; priority: string; why: string }>;
  todayLog: DailyLog | null;
}) {
  const [tab, setTab] = useState<'hoje' | 'estrategia' | NutriDayKey | 'suplementos'>('hoje');
  const [exp, setExp] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl tracking-tight">Nutrição</h1>
        <p className="text-sm text-stone-500 mt-0.5">Cardápio cíclico + suplementos + checklist diário.</p>
      </header>

      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto no-scrollbar -mx-4 px-4">
        {[
          { id: 'hoje', label: 'Hoje' },
          { id: 'estrategia', label: 'Estratégia' },
          { id: 'chave', label: 'Treino-chave' },
          { id: 'moderado', label: 'Moderado' },
          { id: 'descanso', label: 'Descanso' },
          { id: 'suplementos', label: 'Suplementos' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${
              tab === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hoje' && (
        <SupplementChecklist suplementos={suplementos} todayLog={todayLog} />
      )}

      {tab === 'estrategia' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-600 rounded-r-xl p-4 text-sm text-amber-900">
            <strong className="font-medium">Regra de ouro:</strong> em dia de treino-chave, come no MANUTENÇÃO. Déficit zero. Perde peso nos outros dias. Meta realista: <strong>3-5 kg em 8 semanas</strong>.
          </div>

          <h2 className="font-serif text-xl tracking-tight">Macros por tipo de dia (~82kg)</h2>
          <div className="space-y-3">
            {(Object.entries(dias) as [NutriDayKey, Dias[NutriDayKey]][]).map(([key, d]) => (
              <div key={key} className={`bg-white rounded-xl border-l-4 ${dayColors[d.color]} border-y border-r border-stone-200 p-4`}>
                <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
                  <h3 className="font-medium text-stone-900">{d.label}</h3>
                  <span className={`text-sm font-medium ${dayColors[d.color].split(' ')[1]}`}>{d.kcal} kcal</span>
                </div>
                <p className="text-xs text-stone-500 mb-2">{d.desc}</p>
                <p className="text-sm text-stone-700"><strong>Objetivo:</strong> {d.regra}</p>
              </div>
            ))}
          </div>

          <div className="bg-stone-900 text-stone-100 rounded-xl p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-3">Princípios não negociáveis</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Proteína 2.0-2.2g/kg/dia (165-180g).', 'Distribui em 4-5 refeições. Whey isolado SL ajuda a bater.'],
                ['Sem álcool', '(ou no máximo 2 doses fim de semana sem treino-chave seguinte).'],
                ['Sono ≥7h30.', 'Mais importante que muito suplemento.'],
                ['Hidratação 35ml/kg base = 2,8L.', '+500ml/h em treino + sódio em treino >60min.'],
                ['Sem glúten/lactose rigoroso.', 'Whey isolado tem <0.1g lactose, ok.'],
              ].map(([bold, rest], i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400">▸</span>
                  <span><strong className="text-white">{bold}</strong> {rest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(tab === 'chave' || tab === 'moderado' || tab === 'descanso') && (
        <DiaDetail d={dias[tab as NutriDayKey]} />
      )}

      {tab === 'suplementos' && (
        <div className="space-y-3">
          {suplementos.map((s) => {
            const open = exp === s.id;
            return (
              <div key={s.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <button onClick={() => setExp(open ? null : s.id)} className="w-full px-4 py-3 text-left hover:bg-stone-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-medium text-stone-900">{s.nome}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                          s.priority === 'ESSENCIAL' ? 'bg-emerald-100 text-emerald-700' :
                          s.priority === 'RECOMENDADO' ? 'bg-amber-100 text-amber-700' :
                          'bg-sky-100 text-sky-700'
                        }`}>{s.priority}</span>
                      </div>
                      <div className="text-sm text-stone-600 mt-1 font-serif italic">{s.dose}</div>
                    </div>
                    {open ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>
                </button>
                {open && (
                  <div className="px-4 pb-3 bg-emerald-50 border-t border-emerald-100">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 mb-1 mt-2">Por quê funciona</div>
                    <div className="text-sm text-emerald-900">{s.why}</div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900 mt-4">
            <strong className="font-medium">Não compre:</strong> BCAA (whey já tem), L-carnitina, glutamina, termogênico, pré-treino blend. Marketing.
          </div>
        </div>
      )}
    </div>
  );
}

function DiaDetail({ d }: { d: Dias[NutriDayKey] }) {
  return (
    <div className="space-y-3">
      <div className={`bg-white rounded-xl border-l-4 ${dayColors[d.color]} border-y border-r border-stone-200 p-5`}>
        <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
          <div>
            <h2 className="font-serif text-xl">{d.label}</h2>
            <p className="text-sm text-stone-500 mt-0.5">{d.desc}</p>
          </div>
          <span className={`text-sm font-medium ${dayColors[d.color].split(' ')[1]}`}>{d.kcal} kcal</span>
        </div>
        <div className="bg-stone-50 rounded p-3 text-sm text-stone-700">
          <strong>Objetivo:</strong> {d.regra}
        </div>
      </div>

      <div className="space-y-2">
        {d.meals.map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-baseline gap-3 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{m.time}</span>
              <span className="font-medium text-stone-900">{m.name}</span>
            </div>
            <div className="text-sm text-stone-700 mt-1">{m.items}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupplementChecklist({
  suplementos,
  todayLog,
}: {
  suplementos: ReadonlyArray<{ id: string; nome: string; dose: string; priority: string }>;
  todayLog: DailyLog | null;
}) {
  const [state, setState] = useState<Record<string, boolean>>(todayLog?.supplements ?? {});
  const [pending, start] = useTransition();

  function toggle(id: string) {
    const next = { ...state, [id]: !state[id] };
    setState(next);
    start(async () => {
      await upsertDailyLog({ supplements: { [id]: next[id] } });
    });
  }

  const dailyEssentials = suplementos.filter((s) => s.priority === 'ESSENCIAL' || s.priority === 'RECOMENDADO');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
          Suplementos · checklist de hoje
        </div>
        <ul className="space-y-1.5">
          {dailyEssentials.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => toggle(s.id)}
                disabled={pending}
                className="w-full flex items-start gap-3 py-2 text-left"
              >
                <span className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  state[s.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300'
                }`}>
                  {state[s.id] && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`text-sm font-medium ${state[s.id] ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-900'}`}>
                    {s.nome}
                  </span>
                  <span className="block text-xs text-stone-500">{s.dose}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-stone-500 text-center">
        Refeições e itens detalhados: abre a aba do dia (treino-chave / moderado / descanso) no topo.
      </p>
    </div>
  );
}
