import { SWIM_ZONES } from '@/lib/plan-data';
import { AlertCircle } from 'lucide-react';

export default function NatacaoPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl tracking-tight">Zonas de natação</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          CSS = 1:52/100m, calibrado pelos PRs reais (100m 59s · 1500m 28:38).
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {SWIM_ZONES.map((z, i) => {
          const center = 'center' in z && z.center;
          const highlight = 'highlight' in z && z.highlight;
          return (
            <div
              key={z.key}
              className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm ${
                i !== SWIM_ZONES.length - 1 ? 'border-b border-stone-100' : ''
              } ${highlight ? 'bg-sky-50' : ''} ${center ? 'bg-sky-100 border-l-4 border-sky-600' : ''}`}
            >
              <div className="col-span-2 sm:col-span-1">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                  center ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'
                }`}>{z.key}</span>
              </div>
              <div className="col-span-4 sm:col-span-3 font-medium text-stone-900">{z.label}</div>
              <div className={`col-span-3 sm:col-span-2 font-serif italic ${highlight || center ? 'text-sky-700' : 'text-stone-700'}`}>
                {z.pace}/100m
              </div>
              <div className="col-span-12 sm:col-span-6 text-xs text-stone-600">{z.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-stone-100 rounded-xl p-4 text-sm text-stone-700">
        <strong className="font-medium">Como ler:</strong> E1-E4 = endurance (mais leve a mais forte). R1-R2 = ritmo de prova/sprint. CSS é o ponto doce — pace que sustenta ~30min all-out.
      </div>

      <section>
        <h2 className="font-serif text-xl tracking-tight mb-3">Estrutura — 2 sessões/semana</h2>
        <div className="space-y-3">
          <Card title="Terça · qualidade" text="Séries em CSS, broken sets ou sets descendentes. Estímulo aeróbico forte." />
          <Card title="Sábado · volume" text="Séries longas (400-800m) em E2/E3. Volume base." />
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="font-medium text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Exceção semana 6
            </div>
            <div className="text-sm text-amber-900 mt-1">
              A 2ª sessão muda de sábado pra quinta pra dar 72h+ de descanso antes do longão de 20km no domingo.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <div className="font-medium text-stone-900">{title}</div>
      <div className="text-sm text-stone-600 mt-1">{text}</div>
    </div>
  );
}
