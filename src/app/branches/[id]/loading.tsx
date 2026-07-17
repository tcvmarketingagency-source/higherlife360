import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main>
      <div className="h-[50vh] min-h-[360px] w-full animate-pulse bg-crimson" />
      <section className="bg-cream py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-8 w-1/2 animate-pulse bg-ink/10" />
              <div className="h-4 w-full animate-pulse bg-ink/10" />
              <div className="h-4 w-2/3 animate-pulse bg-ink/10" />
              <div className="h-4 w-1/2 animate-pulse bg-ink/10" />
            </div>
            <div className="h-[320px] w-full animate-pulse border border-ink/10 bg-ink/5 lg:h-full" />
          </div>
        </Container>
      </section>
    </main>
  );
}
