import { Countdown } from '@/components/chrome/countdown';
import { LoginForm } from './login-form';

export default function LoginPage() {
  const greeting = getGreeting();

  return (
    <main className="min-h-screen flex flex-col justify-between px-7 py-9 pt-safe">
      {/* Top — Brand */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center font-serif italic font-semibold text-sm leading-none">
            L
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            luci · meia 26
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          v · 1.0
        </div>
      </div>

      {/* Middle — Hero + form */}
      <div>
        <div className="text-sm text-[var(--color-muted)] mb-3">{greeting},</div>
        <h1 className="font-serif text-[56px] font-medium leading-[0.94] tracking-[-0.035em] m-0">
          felipe.
        </h1>
        <p className="font-serif text-lg italic text-[var(--color-ink-soft)] mt-[18px] leading-[1.35]">
          falta pouco pra <span className="text-[var(--color-accent-deep)]">19 . jul</span>.
          <br />
          entra com teu e-mail.
        </p>

        <LoginForm />
      </div>

      {/* Bottom — Countdown */}
      <Countdown />
    </main>
  );
}

function getGreeting(now = new Date()): string {
  const h = Number(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hour12: false,
    }).format(now)
  );
  if (h < 5) return 'boa madrugada';
  if (h < 12) return 'bom dia';
  if (h < 18) return 'boa tarde';
  return 'boa noite';
}
