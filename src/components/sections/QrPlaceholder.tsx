export function QrPlaceholder({ label = 'QR Code' }: { label?: string }) {
  return (
    <div className="flex h-40 w-40 flex-shrink-0 flex-col items-center justify-center gap-3 border-2 border-dashed border-ink/20 bg-white">
      <div className="grid grid-cols-4 gap-1 opacity-20">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} className="h-3 w-3 bg-ink" />
        ))}
      </div>
      <p className="text-center font-sans text-[10px] uppercase tracking-widest text-ink/70">
        {label}
      </p>
    </div>
  );
}
