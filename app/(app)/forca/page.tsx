'use client';

import { useState } from 'react';
import { STRENGTH_SESSIONS } from '@/lib/plan-data';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function ForcaPage() {
  const [active, setActive] = useState<'A' | 'B'>('A');
  const [open, setOpen] = useState<number | null>(null);
  const session = STRENGTH_SESSIONS[active];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-2xl tracking-tight">Musculação em casa · 2×/sem</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Específica para corredor. Equipamento: halteres + bandas + tapete (~R$ 500).
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        {(['A', 'B'] as const).map((k) => (
          <button
            key={k}
            onClick={() => { setActive(k); setOpen(null); }}
            className={`p-3 rounded-xl text-left transition ${
              active === k ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
            }`}
          >
            <div className="font-serif text-lg font-medium">Sessão {k}</div>
            <div className="text-xs opacity-80">{STRENGTH_SESSIONS[k].subtitle}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-900 text-white px-5 py-4">
          <h3 className="font-serif text-lg font-medium">{session.title}</h3>
          <p className="text-xs text-stone-300 mt-1">{session.subtitle}</p>
          <p className="text-xs text-stone-400 mt-1">{session.when}</p>
        </div>

        <div className="divide-y divide-stone-100">
          {session.exercises.map((ex, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full px-4 py-3 text-left hover:bg-stone-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-medium text-stone-900">{ex.name}</span>
                        <span className="text-sm font-serif italic text-orange-700">{ex.sets}</span>
                      </div>
                      {ex.equip && <div className="text-xs text-stone-500 mt-1">{ex.equip}</div>}
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 bg-stone-50">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Por quê</div>
                    <div className="text-sm text-stone-700">{ex.why}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <strong className="font-medium">Regras:</strong> 72h entre A e B · 24h+ entre força e treino-chave · sessão B sempre leve antes de longão · semana 6 pula B · em viagem, versão mínima 15min: 3×15 agachamento + 3×10/perna afundo + 3×30s prancha + 3×15 glute bridge.
      </div>
    </div>
  );
}
