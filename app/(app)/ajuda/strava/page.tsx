import Link from 'next/link';
import {
  Zap,
  Watch,
  ArrowRight,
  Shield,
  Check,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';
import { Card, Label } from '@/components/ui/card';
import { CoachHint } from '@/components/ui/coach-hint';
import { createClient } from '@/lib/supabase/server';
import { stravaConfigured } from '@/lib/strava/tokens';

export const dynamic = 'force-dynamic';

export default async function AjudaStravaPage() {
  // Check if Strava is configured and if user is already connected
  const supabase = await createClient();
  const { data: tokenRow } = await supabase
    .from('strava_tokens')
    .select('athlete_firstname')
    .maybeSingle();
  const isConnected = !!tokenRow;
  const isConfigured = stravaConfigured();

  return (
    <div className="space-y-4 pb-4">
      <Link
        href="/hoje"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        voltar
      </Link>

      <header className="pt-1">
        <Label>ajuda · strava</Label>
        <h1 className="font-serif text-[32px] font-medium leading-[1.02] mt-1.5 tracking-[-0.025em]">
          conecta a strava<br />
          <span className="italic text-[var(--color-accent-deep)]">em 2 minutos.</span>
        </h1>
        <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed max-w-[42ch]">
          quando tu correr, nadar ou levantar peso, a strava registra. o luci puxa
          esses dados e marca o treino como feito sozinho. tu não digita nada.
        </p>
      </header>

      {/* Status atual */}
      {!isConfigured && (
        <Card variant="soft" className="!p-4 border-amber-300 !bg-[var(--color-warn-soft)]">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#8A6A1B]" />
            <div className="text-sm text-[#5C4E1A]">
              a integração ainda não foi configurada no servidor. avisa o admin
              pra preencher as chaves da strava.
            </div>
          </div>
        </Card>
      )}

      {isConnected && (
        <Card variant="soft" className="!p-4 border-emerald-300 !bg-[var(--color-done-soft)]">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-done)]" strokeWidth={2.6} />
            <div className="text-sm text-[var(--color-done)]">
              <strong className="font-bold">tu já tá conectado.</strong> bora pra{' '}
              <Link href="/progresso" className="underline underline-offset-2 font-semibold">
                /progresso
              </Link>{' '}
              importar os treinos.
            </div>
          </div>
        </Card>
      )}

      {/* O que tu precisa */}
      <Section
        label="o que tu precisa"
        title={
          <>
            duas coisas, só.<br />
            <span className="italic text-[var(--color-accent-deep)]">já tens as duas.</span>
          </>
        }
      >
        <Requirement
          icon={<Zap className="w-4 h-4" strokeWidth={2} />}
          title="conta na strava"
          text={
            <>
              se ainda não tem, cria em{' '}
              <a
                href="https://www.strava.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-deep)] font-semibold underline underline-offset-2"
              >
                strava.com/register
              </a>
              . é grátis.
            </>
          }
        />
        <Requirement
          icon={<Watch className="w-4 h-4" strokeWidth={2} />}
          title="treino registrado na strava"
          text={
            <>
              relógio (garmin, apple watch, polar, suunto…) sincronizando com a strava,
              ou um treino manual em{' '}
              <a
                href="https://www.strava.com/upload/manual"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-deep)] font-semibold underline underline-offset-2"
              >
                strava.com/upload/manual
              </a>
              .
            </>
          }
        />
      </Section>

      {/* Passo a passo */}
      <Section
        label="passo a passo"
        title={
          <>
            o caminho.<br />
            <span className="italic text-[var(--color-accent-deep)]">4 cliques.</span>
          </>
        }
      >
        <Step
          num="01"
          title="abre /progresso"
          text="vai pro menu de baixo no ícone de gráfico, ou:"
          cta={
            <Link
              href="/progresso"
              className="tap inline-flex items-center gap-1.5 bg-[var(--color-ink)] text-white font-bold text-sm py-2.5 px-4 rounded-full"
            >
              ir pra /progresso <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </Link>
          }
        />
        <Step
          num="02"
          title="acha o card laranja 'strava'"
          text="é o primeiro card colorido da tela. tem um raio ⚡ no canto."
        />
        <Step
          num="03"
          title="toca em 'conectar strava'"
          text="o app vai te levar pro site da strava."
        />
        <Step
          num="04"
          title="autoriza na strava"
          text={
            <>
              vai aparecer uma tela laranja da strava perguntando se o luci pode ver
              tuas atividades. toca em <strong className="font-bold">autorizar</strong>.
              tu volta automaticamente.
            </>
          }
        />
        <Step
          num="05"
          title="importa as atividades"
          text="de volta no card, agora tem dois botões: 'importar últimos 7 dias' e '30 dias'. escolhe um."
          last
        />
      </Section>

      {/* O que acontece */}
      <Section
        label="o que acontece"
        title={
          <>
            o app casa<br />
            <span className="italic text-[var(--color-accent-deep)]">com o plano.</span>
          </>
        }
      >
        <Card variant="soft" className="!p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="font-serif tab-num text-base font-medium text-[var(--color-accent-deep)] shrink-0">→</span>
            <div className="text-sm text-[var(--color-ink-soft)]">
              pra cada atividade na strava, o luci olha o dia e o tipo (corrida, natação, força).
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-serif tab-num text-base font-medium text-[var(--color-accent-deep)] shrink-0">→</span>
            <div className="text-sm text-[var(--color-ink-soft)]">
              se bate com o treino planejado daquele dia, marca como{' '}
              <strong className="font-bold">feito</strong> com pace, FC e distância
              já preenchidos.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-serif tab-num text-base font-medium text-[var(--color-accent-deep)] shrink-0">→</span>
            <div className="text-sm text-[var(--color-ink-soft)]">
              se tu já tinha registrado manualmente,{' '}
              <strong className="font-bold">o manual ganha</strong>. nada é sobrescrito.
            </div>
          </div>
        </Card>
      </Section>

      {/* Privacidade */}
      <Section
        label="privacidade"
        title={
          <>
            o que a gente vê<br />
            <span className="italic text-[var(--color-accent-deep)]">e o que não.</span>
          </>
        }
      >
        <Card className="!p-4">
          <div className="flex items-start gap-2.5 mb-3">
            <Shield className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-done)]" strokeWidth={2} />
            <div className="text-sm">
              <div className="font-bold mb-0.5">a gente vê:</div>
              <ul className="space-y-1 text-[var(--color-ink-soft)] list-disc pl-4">
                <li>tuas atividades (corridas, natação, força)</li>
                <li>data, duração, distância, pace, FC média</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-accent-deep)]" strokeWidth={2} />
            <div className="text-sm">
              <div className="font-bold mb-0.5">a gente nunca:</div>
              <ul className="space-y-1 text-[var(--color-ink-soft)] list-disc pl-4">
                <li>posta nada na strava em teu nome</li>
                <li>compartilha teus dados com ninguém</li>
                <li>acessa atividades de amigos ou clubes</li>
              </ul>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[var(--color-line)] text-xs text-[var(--color-muted)]">
            podes revogar a qualquer momento. dois caminhos:
            <ul className="mt-1.5 space-y-1 list-disc pl-4">
              <li>
                botão <strong className="font-semibold text-[var(--color-ink-soft)]">desconectar</strong>{' '}
                no card laranja em /progresso
              </li>
              <li>
                ou direto em{' '}
                <a
                  href="https://www.strava.com/settings/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent-deep)] underline underline-offset-2 font-semibold"
                >
                  strava.com/settings/apps
                </a>{' '}
                → revogar acesso
              </li>
            </ul>
          </div>
        </Card>
      </Section>

      {/* O que entra */}
      <Section
        label="tipos importados"
        title={
          <>
            o que <span className="italic text-[var(--color-accent-deep)]">conta.</span>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          <TypeBox emoji="🏃" label="corrida" sub="run · trail run" />
          <TypeBox emoji="🏊" label="natação" sub="swim" />
          <TypeBox emoji="🏋️" label="força" sub="weight training" />
          <TypeBox emoji="🚶" label="caminhada" sub="walk · hike" />
        </div>
        <CoachHint className="!text-[13px] mt-3">
          ciclismo, ioga e outros tipos ficam de fora. não atrapalha o plano.
        </CoachHint>
      </Section>

      {/* FAQ rápido */}
      <Section
        label="dúvidas"
        title={
          <>
            perguntas <span className="italic text-[var(--color-accent-deep)]">comuns.</span>
          </>
        }
      >
        <Faq
          q="e se eu correr 2x no mesmo dia?"
          a="o app casa a primeira atividade com o treino do dia. a segunda fica salva como histórico mas não duplica."
        />
        <Faq
          q="importei agora. e os treinos antigos?"
          a="usa o botão '30 dias'. ele puxa o mês inteiro. pra antes disso, tem que registrar manualmente."
        />
        <Faq
          q="meu garmin não tá sincronizando com a strava."
          a={
            <>
              tem que conectar no app da garmin (garmin connect) → settings → connections →{' '}
              strava. ou direto em{' '}
              <a
                href="https://www.strava.com/settings/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-deep)] underline underline-offset-2 font-semibold"
              >
                strava.com/settings/apps
              </a>
              .
            </>
          }
        />
        <Faq
          q="posso editar depois de importar?"
          a="pode. toca no treino em /plano → ícone de editar → muda pace, FC, nota, etc. o teu valor vira o oficial."
        />
        <Faq
          q="ainda preciso registrar peso e sono?"
          a="sim. strava não mede isso. continua no check-in matinal do /hoje."
        />
      </Section>

      {/* CTA final */}
      <div className="pt-2">
        {isConnected ? (
          <Link
            href="/progresso"
            className="tap block w-full text-center rounded-full py-4 px-6 font-bold text-[15px] text-white"
            style={{
              background: 'var(--color-accent)',
              boxShadow: 'var(--shadow-pop)',
            }}
          >
            importar atividades →
          </Link>
        ) : isConfigured ? (
          <a
            href="/api/strava/connect"
            className="tap block w-full text-center rounded-full py-4 px-6 font-bold text-[15px] text-white no-underline"
            style={{
              background:
                'linear-gradient(135deg, #FC4C02 0%, #E03B00 100%)',
              boxShadow: '0 6px 14px rgba(252,76,2,.28), 0 18px 40px rgba(224,59,0,.18)',
            }}
          >
            conectar strava agora →
          </a>
        ) : (
          <Link
            href="/hoje"
            className="tap block w-full text-center rounded-full py-4 px-6 font-bold text-[15px] bg-[var(--color-ink)] text-white"
          >
            voltar pro hoje
          </Link>
        )}
      </div>
    </div>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-2">
      <Label className="mb-1.5">{label}</Label>
      <h2 className="font-serif text-[22px] font-medium leading-[1.1] tracking-[-0.02em] mb-3.5">
        {title}
      </h2>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Requirement({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
}) {
  return (
    <Card variant="soft" className="!p-4 flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-deep)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[16px] font-medium tracking-[-0.01em]">{title}</div>
        <div className="text-sm text-[var(--color-ink-soft)] mt-1 leading-snug">{text}</div>
      </div>
    </Card>
  );
}

function Step({
  num,
  title,
  text,
  cta,
  last = false,
}: {
  num: string;
  title: string;
  text: React.ReactNode;
  cta?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="relative pl-12">
      {!last && (
        <div className="absolute left-[18px] top-9 bottom-[-12px] w-px bg-[var(--color-line)]" />
      )}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-[var(--color-accent)] text-white font-serif tab-num text-sm font-bold flex items-center justify-center">
        {num}
      </div>
      <Card className="!p-4">
        <div className="font-serif text-[16px] font-medium tracking-[-0.01em]">{title}</div>
        <div className="text-sm text-[var(--color-ink-soft)] mt-1 leading-snug">{text}</div>
        {cta && <div className="mt-3">{cta}</div>}
      </Card>
    </div>
  );
}

function TypeBox({ emoji, label, sub }: { emoji: string; label: string; sub: string }) {
  return (
    <Card className="!p-3.5 text-center">
      <div className="text-2xl">{emoji}</div>
      <div className="font-serif text-[15px] font-medium mt-1">{label}</div>
      <div className="text-[11px] text-[var(--color-muted)] mt-0.5">{sub}</div>
    </Card>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <Card variant="soft" className="!p-4">
      <div className="font-semibold text-sm text-[var(--color-ink)] mb-1.5">{q}</div>
      <div className="text-sm text-[var(--color-ink-soft)] leading-snug">{a}</div>
    </Card>
  );
}
