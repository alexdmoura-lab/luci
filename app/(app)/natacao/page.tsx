import { SWIM_ZONES } from '@/lib/plan-data';
import { AlertCircle } from 'lucide-react';
import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';

export default function NatacaoPage() {
  return (
    <div className="space-y-4">
      <header className="pt-3">
        <Label>natação</Label>
        <h1 className="font-serif text-[32px] font-medium leading-none mt-1.5 tracking-[-0.025em]">
          sente a <span className="italic text-[var(--color-accent-deep)]">água.</span>
        </h1>
      </header>

      {/* CSS hero — black card */}
      <div
        className="rounded-[24px] p-6 text-center text-[var(--color-paper)]"
        style={{ background: 'var(--color-ink)' }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(243,238,228,0.55)]">
          critical swim speed
        </div>
        <div className="font-serif tab-num text-[72px] font-medium leading-none my-1.5 tracking-[-0.05em]">
          1:52
        </div>
        <div className="text-xs text-[rgba(243,238,228,0.6)]">por 100 m · livre</div>
      </div>

      <div>
        <Label className="mb-2.5">zonas de treino</Label>
        <div className="space-y-2">
          {SWIM_ZONES.map((z) => {
            const center = 'center' in z && z.center;
            const highlight = 'highlight' in z && z.highlight;
            return (
              <div
                key={z.key}
                className="rounded-[24px] bg-[var(--color-card)] p-3.5 flex items-center gap-3.5"
                style={{
                  boxShadow: 'var(--shadow-soft)',
                  background: center
                    ? '#1F4FB8'
                    : highlight
                      ? '#D8E5F2'
                      : 'var(--color-card)',
                  color: center ? '#fff' : 'var(--color-ink)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    background: center ? '#fff' : '#D8E5F2',
                    color: center ? '#1F4FB8' : '#1F4FB8',
                  }}
                >
                  {z.key}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[17px] font-medium tracking-[-0.01em]">
                    {z.label.toLowerCase()}
                  </div>
                  <div
                    className="text-xs font-serif italic mt-0.5"
                    style={{
                      fontVariationSettings: "'SOFT' 100, 'opsz' 14",
                      color: center
                        ? 'rgba(243,238,228,0.8)'
                        : 'var(--color-ink-soft)',
                    }}
                  >
                    {z.desc.toLowerCase()}
                  </div>
                </div>
                <div
                  className="font-serif tab-num text-[18px] font-medium shrink-0"
                  style={{
                    color: center ? '#fff' : '#1F4FB8',
                  }}
                >
                  {z.pace}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CoachHint className="!p-3.5 !text-[13px] rounded-[14px] bg-[var(--color-paper-soft)] border border-[var(--color-line)] !border-l-[3px]">
        sente a água. não força. natação não é teste de força — é gestão de fluxo.
      </CoachHint>

      <Card variant="soft">
        <Label className="mb-2">estrutura</Label>
        <div className="space-y-3 text-sm text-[var(--color-ink-soft)]">
          <div>
            <strong className="font-semibold text-[var(--color-ink)]">terça · qualidade.</strong>{' '}
            séries em CSS, broken sets, sets descendentes.
          </div>
          <div>
            <strong className="font-semibold text-[var(--color-ink)]">sábado · volume.</strong>{' '}
            séries longas 400-800m em E2/E3.
          </div>
          <div className="flex gap-2 items-start mt-2 pt-2 border-t border-[var(--color-line)]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-warn)]" />
            <div>
              <strong className="font-semibold text-[var(--color-ink)]">semana 6:</strong>{' '}
              2ª sessão muda de sábado pra quinta. dá 72h+ de descanso antes do longão de 20km.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
