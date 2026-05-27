import { PROVA_PACING, PROVA_DIA_ANTES, PROVA_DIA } from '@/lib/plan-data';
import { daysUntilRace } from '@/lib/dates';
import { plural } from '@/lib/format';
import { MapPin } from 'lucide-react';
import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';

export const dynamic = 'force-dynamic';

const PACING = [
  { trecho: 'km 1—5', pace: '4:42', tag: 'segura', note: 'aquece. respira. ainda não é a hora.' },
  { trecho: 'km 6—10', pace: '4:38', tag: 'ritmo', note: 'cadência fixa, pé leve.' },
  { trecho: 'km 11—16', pace: '4:36', tag: 'mantém', note: 'aqui a cabeça começa a mentir. ignora.' },
  { trecho: 'km 17—21', pace: '4:30', tag: 'fecha', note: 'tudo que sobrou. e o que não sobrou também.' },
];

const REGRAS = [
  'Acorda 3h antes. Sem alarme atrasado.',
  'Café + pão + banana. Nada novo.',
  'Hidrata em goles. Não chega seco, não chega encharcado.',
  'Tênis usado. Meia testada. Roupa secada ao sol.',
  'Os primeiros 3 km são pra acalmar a cabeça. Confia.',
];

export default function ProvaPage() {
  const days = daysUntilRace();
  const weeks = Math.floor(days / 7);
  const extraDays = days % 7;
  const subtext = weeks > 0
    ? `${weeks} ${plural(weeks, 'semana', 'semanas')}${extraDays > 0 ? ` e ${extraDays} ${plural(extraDays, 'dia', 'dias')}` : ''}`
    : `${days} ${plural(days, 'dia', 'dias')}`;

  return (
    <div className="space-y-4">
      <header className="pt-3">
        <Label>a prova</Label>
        <h1 className="font-serif text-[30px] font-medium leading-[1.02] mt-1.5 tracking-[-0.025em]">
          meia maratona
          <br />
          <span className="italic text-[var(--color-accent-deep)]">de brasília.</span>
        </h1>
      </header>

      {/* Hero countdown card */}
      <div
        className="rounded-[24px] p-[26px] text-[var(--color-paper)]"
        style={{
          background: '#1a0d0a',
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(255,87,34,.18), transparent 60%), radial-gradient(circle at 80% 100%, rgba(216,64,26,.12), transparent 60%)',
        }}
      >
        <div className="flex justify-between items-start gap-3 mb-[18px]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.6)]">
              contagem
            </div>
            <div className="font-serif text-xs text-[rgba(243,238,228,0.7)] mt-1 italic">
              dom · 19 jul · 6h00
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            <MapPin className="w-3 h-3" strokeWidth={2} />
            brasília
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-serif tab-num text-[96px] font-medium leading-[0.85] tracking-[-0.06em]">
            {days}
          </span>
          <div>
            <div className="font-serif text-[22px] italic text-[var(--color-accent-soft)]">
              {plural(days, 'dia.', 'dias.')}
            </div>
            <div className="text-[11px] text-[rgba(243,238,228,0.55)]">{subtext}</div>
          </div>
        </div>

        <div className="mt-[18px] pt-[18px] border-t border-[rgba(243,238,228,0.12)] grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.5)] mb-1">
              distância
            </div>
            <div className="font-serif tab-num text-[22px] font-medium">
              21,1<span className="text-xs text-[rgba(243,238,228,0.6)]">km</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.5)] mb-1">
              alvo
            </div>
            <div className="font-serif tab-num text-[22px] font-medium">1h36</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.5)] mb-1">
              pb
            </div>
            <div className="font-serif tab-num text-[22px] font-medium">1h38</div>
          </div>
        </div>
      </div>

      {/* Pacing strategy */}
      <section>
        <div className="flex justify-between items-baseline gap-2 mb-3">
          <h2 className="font-serif text-[20px] font-medium tracking-[-0.02em] leading-[1.1]">
            estratégia de pace
          </h2>
          <Label className="shrink-0">por trecho</Label>
        </div>

        <div className="space-y-2.5">
          {PACING.map((s, i) => (
            <Card key={i} className="!p-4 flex items-center gap-3.5">
              <div
                className="w-[54px] h-[54px] rounded-[14px] flex flex-col items-center justify-center shrink-0"
                style={
                  i === 3
                    ? { background: 'var(--color-accent)', color: '#fff' }
                    : {
                        background: 'var(--color-accent-soft)',
                        color: 'var(--color-accent-deep)',
                      }
                }
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ opacity: 0.75 }}
                >
                  {s.tag}
                </div>
                <div className="font-serif tab-num text-base font-semibold leading-none mt-0.5">
                  {s.pace}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-serif text-[17px] font-medium tracking-[-0.01em]">
                  {s.trecho}
                </div>
                <CoachHint className="!text-xs !pl-2 mt-1.5">{s.note}</CoachHint>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Regras inegociáveis (card ink) */}
      <div
        className="rounded-[24px] p-[22px]"
        style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.5)] mb-2">
          regras inegociáveis
        </div>
        <h3 className="font-serif text-[20px] font-medium m-0 mb-3.5 tracking-[-0.01em]">
          na manhã da prova
        </h3>
        <div className="space-y-3">
          {REGRAS.map((r, i) => (
            <div key={i} className="flex gap-3.5 items-start">
              <span
                className="font-serif tab-num text-[18px] font-medium opacity-80 shrink-0"
                style={{ color: 'var(--color-accent)', minWidth: 26 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-sm leading-[1.45] flex-1"
                style={{ color: 'rgba(243,238,228,0.92)' }}
              >
                {r}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mantra final */}
      <div className="py-5 text-center">
        <div className="font-serif italic text-[32px] leading-none text-[var(--color-accent)]">
          &ldquo;
        </div>
        <div className="font-serif italic text-[22px] tracking-[-0.01em] text-[var(--color-ink-soft)] leading-[1.25]">
          é hoje. confia no que treinou.
        </div>
        <Label className="mt-3">— 19 . jul . 2026</Label>
      </div>

      {/* Detalhes da véspera + dia (mantido como acordeão visual) */}
      <details className="rounded-[24px] bg-[var(--color-paper-soft)] border border-[var(--color-line)] overflow-hidden">
        <summary className="cursor-pointer p-5 font-serif text-[17px] font-medium flex justify-between items-center">
          véspera + dia da prova
          <span className="text-xs text-[var(--color-muted)] font-sans">expandir</span>
        </summary>
        <div className="px-5 pb-5 space-y-4">
          <div>
            <Label className="mb-2">18/07 · sexta</Label>
            <div className="space-y-1.5">
              {PROVA_DIA_ANTES.map((p, i) => (
                <div key={i} className="text-sm">
                  <strong className="font-semibold text-[var(--color-ink)]">{p.hora}:</strong>{' '}
                  <span className="text-[var(--color-ink-soft)]">{p.item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2">19/07 · prova</Label>
            <div className="space-y-1.5">
              {PROVA_DIA.map((p, i) => (
                <div key={i} className="text-sm">
                  <strong className="font-semibold text-[var(--color-ink)]">{p.hora}:</strong>{' '}
                  <span className="text-[var(--color-ink-soft)]">{p.item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2">pacing detalhado</Label>
            <div className="space-y-1.5">
              {PROVA_PACING.map((p, i) => (
                <div key={i} className="text-sm">
                  <strong className="font-semibold text-[var(--color-ink)]">{p.range}:</strong>{' '}
                  <span className="font-serif italic text-[var(--color-accent-deep)]">
                    {p.pace}
                  </span>{' '}
                  · FC {p.hr} ·{' '}
                  <span className="text-[var(--color-ink-soft)]">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
