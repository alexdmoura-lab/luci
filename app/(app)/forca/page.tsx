'use client';

import { useState } from 'react';
import { STRENGTH_SESSIONS } from '@/lib/plan-data';
import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';
import { PillTabs } from '@/components/ui/pill-tabs';
import { PillStatic } from '@/components/ui/pill';

export default function ForcaPage() {
  const [active, setActive] = useState<0 | 1>(0);
  const key = active === 0 ? 'A' : 'B';
  const session = STRENGTH_SESSIONS[key];

  return (
    <div className="space-y-4">
      <header className="pt-3">
        <Label>força</Label>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          duas vezes <span className="italic text-[var(--color-accent-deep)]">por semana.</span>
        </h1>
      </header>

      <PillTabs
        tabs={['sessão a', 'sessão b']}
        active={active}
        onChange={(i) => setActive(i as 0 | 1)}
      />

      <div className="space-y-2">
        <div className="text-xs text-[var(--color-muted)] font-semibold pt-1">
          {session.subtitle.toLowerCase()} · {session.when.toLowerCase()}
        </div>
        {session.exercises.map((ex, i) => (
          <Card key={i} className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Label className="mb-1">exercício {String(i + 1).padStart(2, '0')}</Label>
                <div className="font-serif text-[18px] font-medium leading-[1.1] tracking-[-0.01em]">
                  {ex.name.toLowerCase()}
                </div>
                {ex.equip && (
                  <div className="text-[11px] text-[var(--color-muted)] mt-1">{ex.equip}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="font-serif tab-num text-[18px] font-medium text-[var(--color-accent-deep)]">
                  {ex.sets}
                </span>
                <PillStatic variant="paper" size="sm" className="!text-[10px] !px-2 !py-0.5">
                  RIR 2
                </PillStatic>
              </div>
            </div>
            <CoachHint className="mt-2.5 !text-[13px]">{ex.why.toLowerCase()}</CoachHint>
          </Card>
        ))}
      </div>

      <Card variant="soft" className="!p-4 text-[13px] text-[var(--color-ink-soft)] leading-[1.5]">
        <span className="font-serif italic text-[var(--color-accent-deep)] font-medium">
          regra de ouro —
        </span>{' '}
        última rep deve sobrar uma. se chegar na falha, parou de servir pra corrida.
      </Card>

      <Card variant="soft" className="!p-4 text-xs text-[var(--color-ink-soft)] leading-[1.6]">
        <strong className="font-semibold text-[var(--color-ink)]">regras:</strong> 72h entre A e B
        · 24h+ entre força e treino-chave · sessão B leve antes de longão · semana 6 pula B · em
        viagem versão mínima 15min: 3×15 agachamento + 3×10/perna afundo + 3×30s prancha + 3×15
        glute bridge.
      </Card>
    </div>
  );
}
