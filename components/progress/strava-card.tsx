'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, Zap } from 'lucide-react';
import { syncStrava, type SyncResult } from '@/actions/strava-sync';

type Props = {
  connected: boolean;
  athleteName?: string | null;
  flash?: string | null; // ?strava=connected | denied | not_configured | db_error
};

export function StravaCard({ connected, athleteName, flash }: Props) {
  const router = useRouter();
  const [syncing, start] = useTransition();
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSync(days: number) {
    setError(null);
    setResult(null);
    start(async () => {
      const res = await syncStrava(days);
      if (!res.ok) setError(res.error ?? 'erro desconhecido');
      else setResult(res);
      router.refresh();
    });
  }

  const flashMsg = (() => {
    switch (flash) {
      case 'connected':
        return { kind: 'ok' as const, text: 'strava conectada.' };
      case 'denied':
        return { kind: 'warn' as const, text: 'autorização cancelada.' };
      case 'not_configured':
        return {
          kind: 'warn' as const,
          text: 'strava ainda não configurada no servidor.',
        };
      case 'db_error':
      case 'oauth_error':
        return { kind: 'warn' as const, text: 'algo deu errado, tenta de novo.' };
      case 'disconnected':
        return { kind: 'ok' as const, text: 'strava desconectada.' };
      default:
        return null;
    }
  })();

  return (
    <div
      className="rounded-[24px] p-5"
      style={{
        background:
          'linear-gradient(135deg, #FC4C02 0%, #E03B00 100%)',
        color: '#fff',
        boxShadow: '0 6px 14px rgba(252,76,2,.28), 0 18px 40px rgba(224,59,0,.18)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <Zap className="w-4 h-4" strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
              integração
            </div>
            <div className="font-serif text-[17px] font-medium leading-tight">
              strava
            </div>
          </div>
        </div>
        {connected && (
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold bg-white/15 px-2 py-1 rounded-full">
            conectado
          </span>
        )}
      </div>

      {flashMsg && (
        <div
          className={`mb-3 text-xs font-semibold ${
            flashMsg.kind === 'ok' ? 'text-white' : 'text-yellow-100'
          }`}
        >
          {flashMsg.text}
        </div>
      )}

      {!connected ? (
        <>
          <p className="text-sm text-white/85 leading-snug mb-3.5">
            conecta a strava pra puxar pace, FC e distância dos treinos automaticamente.
            o que tu já registrou na mão fica intacto.
          </p>
          <a
            href="/api/strava/connect"
            className="tap inline-flex items-center gap-2 bg-white text-[#E03B00] font-bold text-sm py-3 px-5 rounded-full no-underline"
          >
            conectar strava <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
          </a>
        </>
      ) : (
        <>
          <p className="text-sm text-white/85 mb-3.5">
            {athleteName ? `oi, ${athleteName.toLowerCase()}. ` : ''}
            puxa as atividades dos últimos dias e a gente casa com o plano.
          </p>

          {result && (
            <div className="mb-3 rounded-2xl bg-white/15 backdrop-blur-sm p-3 text-xs leading-relaxed">
              <div>
                <strong className="font-bold">{result.total}</strong> atividades vistas ·{' '}
                <strong className="font-bold">{result.matched}</strong> casadas com o plano
              </div>
              {result.skipped_existing > 0 && (
                <div className="mt-0.5 text-white/70">
                  {result.skipped_existing} já tinham log manual — mantidas.
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-xl bg-red-50 text-red-900 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onSync(7)}
              disabled={syncing}
              className="tap inline-flex items-center gap-1.5 bg-white text-[#E03B00] font-bold text-sm py-2.5 px-4 rounded-full disabled:opacity-60"
            >
              {syncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>importar últimos 7 dias</>
              )}
            </button>
            <button
              onClick={() => onSync(30)}
              disabled={syncing}
              className="tap inline-flex items-center gap-1.5 bg-white/15 text-white font-semibold text-sm py-2.5 px-4 rounded-full disabled:opacity-60"
            >
              30 dias
            </button>
          </div>

          <form action="/api/strava/disconnect" method="POST" className="mt-3">
            <button
              type="submit"
              className="text-[11px] text-white/60 hover:text-white underline underline-offset-2"
            >
              desconectar
            </button>
          </form>
        </>
      )}
    </div>
  );
}
