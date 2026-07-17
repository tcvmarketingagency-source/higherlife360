export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream">
      <h1 className="font-display text-h1 font-semibold text-ink">{title}</h1>
    </main>
  );
}
