import { PROVA_PACING, PROVA_DIA_ANTES, PROVA_DIA } from '@/lib/plan-data';
import { daysUntilRace } from '@/lib/dates';
import { Activity, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { plural } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default function ProvaPage() {
  const days = daysUntilRace();
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-stone-900 to-red-900 text-white rounded-2xl p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-300 mb-2">
          19 de julho de 2026
        </div>
        <h1 className="font-serif text-3xl tracking-tight">Meia maratona</h1>
        <p className="text-sm text-red-100/80 mt-1">
          Faltam <strong className="text-white">{days}</strong> {plural(days, 'dia', 'dias')}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-red-300 text-[10px] uppercase tracking-widest">Meta</div>
            <div className="font-serif text-xl">1h36–1h38</div>
          </div>
          <div>
            <div className="text-red-300 text-[10px] uppercase tracking-widest">Stretch</div>
            <div className="font-serif text-xl">1h34</div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-serif text-xl tracking-tight mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" /> Pacing por trecho
        </h3>
        <div className="space-y-2">
          {PROVA_PACING.map((q, i) => (
            <div key={i} className="bg-white rounded-xl border-l-4 border-red-300 border-y border-r border-stone-200 p-4">
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <span className="font-serif text-lg">{q.range}</span>
                <span className="font-serif italic text-red-700">{q.pace}</span>
                <span className="text-xs text-stone-500">FC {q.hr}</span>
              </div>
              <p className="text-sm text-stone-700">{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-xl tracking-tight mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" /> Véspera · 18/07
        </h3>
        <div className="space-y-2">
          {PROVA_DIA_ANTES.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">{p.hora}</div>
              <div className="text-sm text-stone-800">{p.item}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-xl tracking-tight mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-600" /> Dia da prova · 19/07
        </h3>
        <div className="space-y-2">
          {PROVA_DIA.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border-l-4 border-red-500 border-y border-r border-stone-200 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">{p.hora}</div>
              <div className="text-sm text-stone-800">{p.item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <h3 className="font-medium text-red-900 mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Regras inegociáveis
        </h3>
        <ul className="space-y-2 text-sm text-red-900">
          {[
            'Primeiro km dentro de 4:42 mesmo se sentir "voando"',
            'Negative split sempre vence positive split na meia',
            'Gel sem lactose/glúten no km 7 e km 14',
            '1 copo de água/Gatorade em CADA posto a partir do km 5',
            'NUNCA testa na prova algo que não testou em treino',
            'Se pace cair pra 4:50/km no km 13+, aceita 1h40. Não vale lesão.',
            'Café 90min antes + cafeína 200mg 30min antes',
          ].map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-red-500 shrink-0">▸</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
