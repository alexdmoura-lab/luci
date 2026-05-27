import * as React from 'react';

type PillVariant = 'primary' | 'ink' | 'ghost' | 'soft' | 'paper' | 'done' | 'warn';
type PillSize = 'sm' | 'md' | 'lg' | 'xl';

type CommonProps = {
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
  children: React.ReactNode;
};

const VARIANT_CLS: Record<PillVariant, string> = {
  primary: 'bg-[var(--color-accent)] text-white shadow-[0_4px_12px_rgba(255,87,34,.32)] hover:bg-[var(--color-accent-deep)]',
  ink: 'bg-[var(--color-ink)] text-white',
  ghost: 'bg-transparent text-[var(--color-muted)]',
  soft: 'bg-[var(--color-accent-soft)] text-[var(--color-accent-deep)]',
  paper: 'bg-[var(--color-paper-soft)] text-[var(--color-ink-soft)] border border-[var(--color-line)]',
  done: 'bg-[var(--color-done-soft)] text-[var(--color-done)]',
  warn: 'bg-[var(--color-warn-soft)] text-[#8A6A1B]',
};

const SIZE_CLS: Record<PillSize, string> = {
  sm: 'text-[13px] px-3.5 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-[15px] px-5 py-3',
  xl: 'text-base px-7 py-4',
};

const BASE = 'tap inline-flex items-center gap-1.5 rounded-full font-semibold leading-none whitespace-nowrap border-0 cursor-pointer transition-[transform,box-shadow,background] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none';

export function Pill({
  variant = 'primary',
  size = 'sm',
  className = '',
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE} ${VARIANT_CLS[variant]} ${SIZE_CLS[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PillStatic({
  variant = 'paper',
  size = 'sm',
  className = '',
  children,
}: CommonProps) {
  return (
    <span
      className={`${BASE} ${VARIANT_CLS[variant]} ${SIZE_CLS[size]} ${className} cursor-default`}
    >
      {children}
    </span>
  );
}
