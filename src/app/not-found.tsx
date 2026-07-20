import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section tone="navy" className="flex min-h-[70svh] items-center pb-24 pt-40">
      <Container className="text-center">
        <p className="font-display text-hero font-semibold text-gold">404</p>
        <h1 className="mt-4 font-display text-h1 font-semibold text-cream">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-cream/75">
          Let&rsquo;s get you home — there&rsquo;s a Higher Life waiting there.
        </p>
        <div className="mt-10">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
