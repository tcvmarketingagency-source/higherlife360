import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main>
      <div className="h-[50vh] min-h-[360px] w-full animate-pulse bg-crimson" />
      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-4 w-1/2 animate-pulse bg-ink/10" />
              <div className="h-4 w-1/2 animate-pulse bg-ink/10" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full animate-pulse bg-ink/10" />
              <div className="h-4 w-full animate-pulse bg-ink/10" />
              <div className="h-4 w-2/3 animate-pulse bg-ink/10" />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
