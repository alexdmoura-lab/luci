import { RUN_ZONES } from '@/lib/plan-data';

export default function CorridaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl tracking-tight">Zonas de corrida</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Calibradas: melhor 10K recente 4:47/km · melhor meia 1h38 (4:37/km) · FCmax ~182.
        </p>
      </header>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {RUN_ZONES.map((p, i) => (
          <div
            key={p.key}
            className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm ${
              i !== RUN_ZONES.length - 1 ? 'border-b border-stone-100' : ''
            } ${('highlight' in p && p.highlight) ? 'bg-orange-50' : ''}`}
          >
            <div className="col-span-3 sm:col-span-2 font-medium">{p.label}</div>
            <div className={`col-span-4 sm:col-span-2 font-serif italic ${('highlight' in p && p.highlight) ? 'text-orange-700' : 'text-stone-700'}`}>
              {p.value}
            </div>
            <div className="col-span-3 sm:col-span-2 text-xs text-stone-500 self-center">FC {p.fc}</div>
            <div className="col-span-12 sm:col-span-6 text-xs text-stone-600">{p.desc}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-serif text-xl tracking-tight mb-3">Estrutura — 3 corridas/semana</h2>
        <div className="space-y-3">
          {[
            { title: 'Quarta · qualidade', text: 'Tempo run, intervalos VO2, ou fartlek. É onde mora a adaptação.' },
            { title: 'Sexta · easy + strides', text: 'Volume de recuperação ativa. Pace 5:05-5:15. 4-6 strides no final pra manter neuromuscular.' },
            { title: 'Domingo · longão', text: 'Treino mais importante da semana. Cresce 16 → 17 → 18 → 14 (deload) → 19 → 20 → 15 → prova. Inclui block em HMP a partir da semana 2.' },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="font-medium text-stone-900">{c.title}</div>
              <div className="text-sm text-stone-600 mt-1">{c.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
