export function EnergyDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 mt-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full transition-colors"
          style={{
            background: i <= value ? 'var(--color-accent)' : '#ECE5D5',
          }}
        />
      ))}
    </div>
  );
}
