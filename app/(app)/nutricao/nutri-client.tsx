'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { upsertDailyLog } from '@/actions/daily-log';
import type { NutriDayKey } from '@/lib/plan-data';
import type { DailyLog } from '@/lib/types';

import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';
import { PillTabs } from '@/components/ui/pill-tabs';
import { PillStatic } from '@/components/ui/pill';

type Dias = Record<NutriDayKey, {
  label: string;
  kcal: string;
  color: 'red' | 'amber' | 'emerald';
  desc: string;
  regra: string;
  meals: { time: string; name: string; items: string }[];
}>;

const MEAL_COLORS = [
  'var(--color-accent)',
  'var(--color-done)',
  'var(--color-phase-base)',
  'var(--color-phase-deload)',
  'var(--color-phase-polish)',
  'var(--color-phase-taper)',
  'var(--color-phase-peak)',
];

const TABS = ['hoje', 'cardápios', 'suplementos', 'prova'] as const;

export function NutriClient({
  dias,
  suplementos,
  todayLog,
}: {
  dias: Dias;
  suplementos: ReadonlyArray<{ id: string; nome: string; dose: string; priority: string; why: string }>;
  todayLog: DailyLog | null;
}) {
  const [tab, setTab] = useState(0);
  const [diaTab, setDiaTab] = useState(0);
  const diaKey: NutriDayKey = (['chave', 'moderado', 'descanso'] as NutriDayKey[])[diaTab];
  const dia = dias[diaKey];

  return (
    <div className="space-y-4">
      <header className="pt-3">
        <Label>nutrição</Label>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          comer é <span className="italic text-[var(--color-accent-deep)]">treinar.</span>
        </h1>
      </header>

      <PillTabs tabs={TABS as unknown as string[]} active={tab} onChange={setTab} />

      {tab === 0 && <HojeView todayLog={todayLog} suplementos={suplementos} />}

      {tab === 1 && (
        <div className="space-y-4">
          <PillTabs
            tabs={['treino-chave', 'moderado', 'descanso']}
            active={diaTab}
            onChange={setDiaTab}
          />
          <Card className="!p-5">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-2">
              <h2 className="font-serif text-[20px] font-medium tracking-[-0.02em]">
                {dia.label.toLowerCase()}
              </h2>
              <span className="text-sm font-semibold text-[var(--color-accent-deep)] tab-num">
                {dia.kcal} kcal
              </span>
            </div>
            <CoachHint className="!text-[13px]">{dia.regra.toLowerCase()}</CoachHint>
          </Card>

          <div className="space-y-2">
            {dia.meals.map((m, i) => (
              <Card key={i} className="!p-3.5 flex items-stretch gap-3.5">
                <div
                  className="w-1 rounded-full self-stretch min-h-[38px]"
                  style={{ background: MEAL_COLORS[i % MEAL_COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif tab-num text-base font-medium">{m.time}</span>
                    <Label>{m.name.toLowerCase()}</Label>
                  </div>
                  <div className="text-[13px] text-[var(--color-ink-soft)] mt-1">{m.items}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-2">
          {suplementos.map((s) => (
            <Card key={s.id} className="!p-4">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[17px] font-medium tracking-[-0.01em]">
                    {s.nome.toLowerCase()}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-1 font-serif italic">
                    {s.dose}
                  </div>
                </div>
                <PillStatic
                  variant={
                    s.priority === 'ESSENCIAL'
                      ? 'done'
                      : s.priority === 'RECOMENDADO'
                        ? 'warn'
                        : 'soft'
                  }
                  size="sm"
                  className="!text-[10px] !px-2 !py-0.5"
                >
                  {s.priority.toLowerCase()}
                </PillStatic>
              </div>
              <CoachHint className="mt-2.5 !text-[13px]">{s.why}</CoachHint>
            </Card>
          ))}
          <Card variant="soft" className="!p-4 text-[13px] text-[var(--color-ink-soft)] leading-[1.5]">
            <strong className="font-semibold text-[var(--color-ink)]">não compre:</strong> BCAA
            (whey já tem), L-carnitina, glutamina, termogênico, pré-treino blend. marketing.
          </Card>
        </div>
      )}

      {tab === 3 && (
        <div
          className="rounded-[24px] p-[22px]"
          style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.55)]">
            na manhã da prova
          </div>
          <h3 className="font-serif text-[22px] font-medium m-0 mt-1.5 mb-3.5 tracking-[-0.02em]">
            nada de novo.
          </h3>
          <div className="space-y-3.5 text-[13px] leading-[1.5] text-[rgba(243,238,228,0.88)]">
            <div>
              <strong
                className="font-serif italic font-medium"
                style={{ color: 'var(--color-accent-soft)' }}
              >
                3h antes —
              </strong>{' '}
              café da manhã. pão, banana, café preto, 500ml água.
            </div>
            <div>
              <strong
                className="font-serif italic font-medium"
                style={{ color: 'var(--color-accent-soft)' }}
              >
                1h antes —
              </strong>{' '}
              gel + 200ml. nada sólido.
            </div>
            <div>
              <strong
                className="font-serif italic font-medium"
                style={{ color: 'var(--color-accent-soft)' }}
              >
                na corrida —
              </strong>{' '}
              gel km 7, gel km 14. água a cada posto.
            </div>
            <div>
              <strong
                className="font-serif italic font-medium"
                style={{ color: 'var(--color-accent-soft)' }}
              >
                chegou —
              </strong>{' '}
              banana imediato. água com sal. comer de verdade em 1h.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ESSENTIAL_SUPP_IDS = ['whey', 'creatina', 'cafeina', 'beta', 'vitd', 'eletro'];

function HojeView({
  todayLog,
  suplementos,
}: {
  todayLog: DailyLog | null;
  suplementos: ReadonlyArray<{ id: string; nome: string; dose: string; priority: string }>;
}) {
  const [state, setState] = useState<Record<string, boolean>>(todayLog?.supplements ?? {});
  const [, start] = useTransition();

  function toggle(id: string) {
    const next = { ...state, [id]: !state[id] };
    setState(next);
    start(async () => {
      await upsertDailyLog({ supplements: { [id]: next[id] } });
    });
  }

  const list = suplementos.filter((s) => ESSENTIAL_SUPP_IDS.includes(s.id));
  const doneCount = list.filter((s) => state[s.id]).length;

  return (
    <div className="space-y-4">
      <Card className="!p-5">
        <div className="flex justify-between items-baseline mb-3.5">
          <div>
            <Label>do dia</Label>
            <div className="font-serif text-[17px] font-medium mt-0.5">suplementos</div>
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">
            {doneCount} de {list.length}
          </div>
        </div>
        <ul className="space-y-2.5">
          {list.map((s) => {
            const filled = !!state[s.id];
            return (
              <li key={s.id}>
                <button
                  onClick={() => toggle(s.id)}
                  className="tap w-full flex items-start gap-3 py-1.5 text-left"
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition mt-0.5 ${
                      filled
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-paper-soft)] border-[var(--color-line)]'
                    }`}
                  >
                    {filled && <Check className="w-3.5 h-3.5" strokeWidth={2.6} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        filled
                          ? 'text-[var(--color-muted)] line-through decoration-[var(--color-line)]'
                          : 'text-[var(--color-ink)]'
                      }`}
                    >
                      {s.nome.toLowerCase()}
                    </span>
                    <span className="block text-xs text-[var(--color-muted)] mt-0.5">{s.dose}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <CoachHint className="!p-3.5 !text-[13px] rounded-[14px] bg-[var(--color-paper-soft)] border border-[var(--color-line)] !border-l-[3px]">
        os cardápios completos por tipo de dia estão na aba <strong className="not-italic font-bold">cardápios</strong>.
      </CoachHint>
    </div>
  );
}
