import { RUN_ZONES } from '@/lib/plan-data';
import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';

const ZONE_COLORS: { bg: string; fg: string }[] = [
  { bg: '#ECE5D5', fg: 'var(--color-muted)' }, // recovery
  { bg: '#DDE8DA', fg: 'var(--color-done)' }, // easy
  { bg: '#F4E9C7', fg: '#8A6A1B' }, // marathon
  { bg: '#FFE5D6', fg: 'var(--color-accent-deep)' }, // HMP — highlight
  { bg: '#F4E9C7', fg: '#8A6A1B' }, // limiar
  { bg: '#FFD0BA', fg: 'var(--color-accent-deep)' }, // 10k
  { bg: '#FFD0BA', fg: 'var(--color-accent-deep)' }, // vo2
];

export default function CorridaPage() {
  return (
    <div className="space-y-4">
      <header className="pt-3">
        <Label>corrida</Label>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          o pace <span className="italic text-[var(--color-accent-deep)]">manda.</span>
        </h1>
      </header>

      {/* Pace alvo hero */}
      <Card className="!p-[22px]">
        <Label>pace alvo · meia maratona</Label>
        <div className="font-serif tab-num text-[56px] font-medium leading-none tracking-[-0.04em] my-2.5">
          4:38
          <span className="text-[22px] text-[var(--color-muted)]">/km</span>
        </div>
        <CoachHint className="!text-[13px]">
          alvo 1h36. stretch 1h34. base honesta. nada de querer correr 4:20 nos primeiros quilômetros.
        </CoachHint>
      </Card>

      <div>
        <Label className="mb-2.5">zonas de treino</Label>
        <div className="space-y-2">
          {RUN_ZONES.map((z, i) => {
            const color = ZONE_COLORS[i] ?? ZONE_COLORS[0];
            const highlight = 'highlight' in z && z.highlight;
            return (
              <div
                key={z.key}
                className="rounded-[24px] bg-[var(--color-card)] p-3.5 flex items-center gap-3.5"
                style={{
                  boxShadow: 'var(--shadow-soft)',
                  background: highlight ? 'var(--color-accent-soft)' : 'var(--color-card)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: color.bg, color: color.fg }}
                >
                  {z.key.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <div className="font-serif text-[17px] font-medium tracking-[-0.01em]">
                      {z.label.toLowerCase()}
                    </div>
                    <div className="text-[10px] uppercase font-semibold tracking-[0.05em] text-[var(--color-muted)]">
                      FC {z.fc}
                    </div>
                  </div>
                  <div
                    className="text-xs text-[var(--color-ink-soft)] font-serif italic mt-0.5"
                    style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 14" }}
                  >
                    {z.desc.toLowerCase()}
                  </div>
                </div>
                <div className="font-serif tab-num text-[18px] font-medium text-[var(--color-accent-deep)] shrink-0">
                  {z.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card variant="soft">
        <Label className="mb-2">estrutura</Label>
        <div className="space-y-3 text-sm text-[var(--color-ink-soft)]">
          <div>
            <strong className="font-semibold text-[var(--color-ink)]">quarta · qualidade.</strong>{' '}
            tempo, intervalos VO2, fartlek. onde mora a adaptação.
          </div>
          <div>
            <strong className="font-semibold text-[var(--color-ink)]">sexta · easy + strides.</strong>{' '}
            5:05-5:15/km, 4-6 strides no final. neuromuscular sem fadiga.
          </div>
          <div>
            <strong className="font-semibold text-[var(--color-ink)]">domingo · longão.</strong>{' '}
            cresce 16 → 17 → 18 → 14 (deload) → 19 → 20 → 15 → prova. block em HMP a partir da semana 2.
          </div>
        </div>
      </Card>
    </div>
  );
}
