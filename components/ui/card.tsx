import * as React from 'react';

type Variant = 'default' | 'soft' | 'ink';

type Props = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  /** Apply a one-shot pulse animation (controlled by parent) */
  pulse?: boolean;
};

const VARIANT_CLS: Record<Variant, string> = {
  default: 'bg-[var(--color-card)] shadow-[var(--shadow-soft)] text-[var(--color-ink)]',
  soft: 'bg-[var(--color-paper-soft)] border border-[var(--color-line)] text-[var(--color-ink)]',
  ink: 'bg-[var(--color-ink)] text-[var(--color-paper)]',
};

export function Card({ variant = 'default', className = '', pulse = false, children }: Props) {
  return (
    <div
      className={`rounded-[24px] p-5 ${VARIANT_CLS[variant]} ${pulse ? 'animate-card-pulse' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/** Pre-styled label (uppercase tiny tracking) */
export function Label({
  children,
  className = '',
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
