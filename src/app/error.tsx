'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section tone="crimson-deep" className="flex min-h-[70vh] items-center pb-24 pt-40">
      <Container className="text-center">
        <p className="text-eyebrow font-semibold uppercase text-gold">Something Went Wrong</p>
        <h1 className="mt-4 font-display text-h1 font-semibold text-cream">
          We hit a snag on our end.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-cream/75">
          Please try again — if the problem continues, come back a little later.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button type="button" variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
