import * as React from 'react';

export function CoachHint({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-serif italic text-sm leading-[1.45] text-[var(--color-ink-soft)] border-l-2 border-[var(--color-accent)] pl-2.5 ${className}`}
      style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 14" }}
    >
      {children}
    </div>
  );
}
