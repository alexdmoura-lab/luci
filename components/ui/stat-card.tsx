import * as React from 'react';

type Props = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: string;
  onClick?: () => void;
  className?: string;
};

export function StatCard({ icon, label, value, sub, accent, onClick, className = '' }: Props) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`tap text-left bg-[var(--color-card)] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-[var(--shadow-soft)] border-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: accent || 'var(--color-accent-soft)',
          color: accent ? '#fff' : 'var(--color-accent-deep)',
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-1.5">
          {label}
        </div>
        <div className="font-serif tab-num text-[26px] font-medium leading-none text-[var(--color-ink)]">
          {value}
        </div>
        {sub && <div className="text-[11px] text-[var(--color-muted)] mt-1">{sub}</div>}
      </div>
    </Comp>
  );
}
