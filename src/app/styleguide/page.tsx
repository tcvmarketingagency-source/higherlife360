import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';

// Internal dev reference page — kept out of search results.
export const metadata: Metadata = {
  title: 'Style Guide',
  robots: { index: false, follow: false },
};

const colors = [
  { name: 'Navy', hex: '#0F1523', className: 'bg-navy', light: true },
  { name: 'Navy Elevated', hex: '#1B2438', className: 'bg-navy-elevated', light: true },
  { name: 'Cream', hex: '#F5F1E8', className: 'bg-cream', light: false },
  { name: 'Cream Card', hex: '#FFFFFF', className: 'bg-cream-card', light: false },
  { name: 'Gold', hex: '#E8A33D', className: 'bg-gold', light: false },
  { name: 'Gold Light', hex: '#F2B85E', className: 'bg-gold-light', light: false },
  { name: 'Gold Deep', hex: '#855708', className: 'bg-gold-deep', light: true },
  { name: 'Ink', hex: '#0F1523', className: 'bg-ink', light: true },
  { name: 'Slate', hex: '#3D4459', className: 'bg-slate', light: true },
  { name: 'Muted', hex: '#8D96A8', className: 'bg-muted', light: true },
];

export default function StyleguidePage() {
  return (
    <main>
      <Section tone="navy" className="pb-24 pt-40 text-center">
        <Container>
          <p className="mb-3 text-eyebrow font-semibold uppercase text-accent">HigherLife360</p>
          <h1 className="font-display text-hero font-semibold text-cream">Design System</h1>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionTitle
            eyebrow="Palette"
            title="Colors"
            subtitle="A strict 3-color system — dark navy, warm cream, and gold — plus derived shades."
          />
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {colors.map((color) => (
              <div key={color.hex} className="overflow-hidden border border-ink/10">
                <div className={`flex h-24 items-end p-3 ${color.className}`}>
                  <span
                    className={`font-sans text-xs uppercase tracking-widest ${
                      color.light ? 'text-cream/70' : 'text-ink/70'
                    }`}
                  >
                    Aa
                  </span>
                </div>
                <div className="bg-white p-3">
                  <p className="font-sans text-sm font-medium text-ink">{color.name}</p>
                  <p className="font-sans text-xs uppercase text-ink/70">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream" className="pt-0">
        <Container>
          <SectionTitle
            eyebrow="Type"
            title="Typography"
            subtitle="Cormorant Garamond for display, Inter for body copy."
          />
          <div className="mt-14 space-y-10 border-t border-ink/10 pt-10">
            <div>
              <p className="font-display text-hero font-semibold">Hero Heading</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-display · text-hero
              </p>
            </div>
            <div>
              <p className="font-display text-h1 font-semibold">Heading One</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-display · text-h1
              </p>
            </div>
            <div>
              <p className="font-display text-h2 font-semibold">Heading Two</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-display · text-h2
              </p>
            </div>
            <div>
              <p className="font-display text-h3 font-semibold">Heading Three</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-display · text-h3
              </p>
            </div>
            <div>
              <p className="font-display text-h4 font-semibold">Heading Four</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-display · text-h4
              </p>
            </div>
            <div>
              <p className="text-eyebrow font-semibold uppercase text-accent">Eyebrow Label</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-sans · text-eyebrow
              </p>
            </div>
            <div>
              <p className="text-body-lg">
                Body large — for lede paragraphs and pull quotes that need a touch more presence.
              </p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-sans · text-body-lg
              </p>
            </div>
            <div>
              <p className="max-w-2xl text-body">
                Body copy — the workhorse text style for paragraphs across the site, set in Inter
                for clarity and warmth against the cream background.
              </p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
                font-sans · text-body
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy-elevated">
        <Container>
          <SectionTitle
            eyebrow="Actions"
            title="Buttons"
            subtitle="Primary in gold, secondary as a gold outline — for dark backgrounds."
            className="text-cream"
          />
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
            <Button variant="primary">Plan a Visit</Button>
            <Button variant="secondary">Watch Online</Button>
          </div>
        </Container>
      </Section>

      <Section tone="cream" className="pt-0">
        <Container>
          <div className="border-t border-ink/10 pt-14 text-center">
            <p className="mb-8 font-sans text-xs uppercase tracking-widest text-ink/70">
              Outline — for cream backgrounds
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Button variant="primary">Give Now</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="transparent" className="bg-gold pt-0">
        <Container>
          <div className="pt-14 text-center">
            <p className="mb-8 font-sans text-xs uppercase tracking-widest text-navy">
              Inverse — for gold backgrounds
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Button variant="inverse">Partner With Us</Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
