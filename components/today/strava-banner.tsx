'use client';

import { useSyncExternalStore, useCallback } from 'react';
import Link from 'next/link';
import { X, ArrowRight, Zap } from 'lucide-react';

const DISMISS_KEY = 'luci:strava-banner-dismissed';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getClientSnapshot() {
  return localStorage.getItem(DISMISS_KEY) === '1';
}

function getServerSnapshot() {
  return true; // hide during SSR to avoid hydration mismatch
}

export function StravaBanner() {
  const dismissed = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    // dispatch storage event to refresh subscribers in this tab
    window.dispatchEvent(new StorageEvent('storage', { key: DISMISS_KEY }));
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="rounded-[24px] p-5 text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FC4C02 0%, #E03B00 100%)',
        boxShadow: '0 6px 14px rgba(252,76,2,.28), 0 18px 40px rgba(224,59,0,.18)',
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Dispensar"
        className="tap absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/90 transition"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2.4} />
      </button>

      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Zap className="w-4 h-4" strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
            novidade
          </div>
          <div className="font-serif text-[17px] font-medium leading-tight">
            conecta a strava
          </div>
        </div>
      </div>

      <p className="text-sm text-white/90 leading-snug mb-3.5 max-w-[36ch]">
        pace, FC e distância importados sem digitar. tu só corre — o app preenche.
      </p>

      <div className="flex gap-2 flex-wrap">
        <Link
          href="/ajuda/strava"
          className="tap inline-flex items-center gap-1.5 bg-white text-[#E03B00] font-bold text-sm py-2.5 px-4 rounded-full no-underline"
        >
          como funciona <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
        </Link>
        <button
          onClick={dismiss}
          className="tap inline-flex items-center bg-white/15 text-white font-semibold text-sm py-2.5 px-4 rounded-full"
        >
          agora não
        </button>
      </div>
    </div>
  );
}
