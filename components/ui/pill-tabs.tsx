'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
  className?: string;
};

export function PillTabs({ tabs, active, onChange, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState({ left: 4, width: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const buttons = el.querySelectorAll<HTMLButtonElement>('[data-pill-tab]');
    const activeBtn = buttons[active];
    if (activeBtn) {
      setBg({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    }
  }, [active, tabs.length]);

  return (
    <div
      ref={ref}
      className={`relative flex bg-[#ECE5D5] rounded-full p-1 ${className}`}
    >
      <div
        className="absolute top-1 bottom-1 bg-[var(--color-accent)] rounded-full shadow-[0_4px_10px_rgba(255,87,34,.32)] z-0"
        style={{
          left: bg.left,
          width: bg.width,
          transition:
            'left .35s cubic-bezier(.4,.6,.2,1.2), width .35s cubic-bezier(.4,.6,.2,1.2)',
        }}
      />
      {tabs.map((t, i) => (
        <button
          key={i}
          data-pill-tab
          onClick={() => onChange(i)}
          className={`relative z-10 flex-1 px-4 py-[11px] rounded-full font-semibold text-[13px] cursor-pointer transition-colors duration-200 ${
            i === active ? 'text-white' : 'text-[var(--color-ink-soft)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
