import * as React from 'react';

export function HeroQuestion({
  greeting,
  headline,
  className = '',
}: {
  greeting?: React.ReactNode;
  headline: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {greeting && (
        <div className="text-sm text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
          {greeting}
        </div>
      )}
      <h1 className="font-serif text-[32px] sm:text-5xl font-medium tracking-[-0.025em] leading-[1.02] text-[var(--color-ink)] text-pretty m-0">
        {headline}
      </h1>
    </div>
  );
}
