import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main>
      <div className="bg-crimson-deep pt-24">
        <Container>
          <div className="aspect-video w-full animate-pulse bg-cream/10" />
        </Container>
      </div>
      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-3 w-24 animate-pulse bg-ink/10" />
            <div className="h-10 w-2/3 animate-pulse bg-ink/10" />
            <div className="h-3 w-1/2 animate-pulse bg-ink/10" />
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
