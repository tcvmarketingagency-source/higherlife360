import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main>
      <section className="bg-navy pb-16 pt-40 text-center">
        <Container>
          <div className="mx-auto h-4 w-32 animate-pulse bg-cream/10" />
          <div className="mx-auto mt-4 h-10 w-72 animate-pulse bg-cream/10" />
          <div className="mx-auto mt-4 h-4 w-96 max-w-full animate-pulse bg-cream/10" />
        </Container>
      </section>
      <div className="bg-navy pb-10">
        <Container>
          <div className="mx-auto h-12 w-full max-w-xl animate-pulse border border-gold/20 bg-cream/5" />
        </Container>
      </div>
      <section className="bg-cream py-20">
        <Container>
          <div className="h-[420px] w-full animate-pulse border border-ink/10 bg-ink/5 sm:h-[480px]" />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden border border-ink/10">
                <div className="aspect-[4/3] animate-pulse bg-ink/10" />
                <div className="space-y-2 p-6">
                  <div className="h-4 w-3/4 animate-pulse bg-ink/10" />
                  <div className="h-3 w-1/2 animate-pulse bg-ink/10" />
                  <div className="h-3 w-1/3 animate-pulse bg-ink/10" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
