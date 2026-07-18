import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';

type HigherLifePathwayTone = 'crimson-deep' | 'charcoal-deep';

// PLACEHOLDER — THE HIGHER LIFE PATHWAY
// ----------------------------------------------------------------------------
// This is HigherLife360's own signature discipleship framework — five marks
// of what we're building in every person, original to us (not borrowed
// wording from any other church). It's built to be confirmed, not assumed:
// please review these five words and the one-line descriptions below and
// tell us if they capture how HigherLife actually disciples people, or if
// you'd like different words/order.
const pathway = [
  {
    number: '01',
    title: 'Encounter',
    text: 'Meet God in worship that is real, not rehearsed — the starting point of everything else.',
  },
  {
    number: '02',
    title: 'Belong',
    text: 'Find a family, not just a seat in a room. Community carries you further than willpower ever could.',
  },
  {
    number: '03',
    title: 'Grow',
    text: 'Go deeper in truth, one step of obedience at a time — discipleship as a direction, not a destination.',
  },
  {
    number: '04',
    title: 'Give',
    text: 'Live open-handed with your time, resources, and love — generosity as a lifestyle, not an event.',
  },
  {
    number: '05',
    title: 'Go',
    text: 'Carry a Higher Life beyond these walls — to your street, your city, and the nations.',
  },
];

export function HigherLifePathway({ tone = 'crimson-deep' }: { tone?: HigherLifePathwayTone }) {
  return (
    <Section tone={tone} className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(232,200,120,0.16), transparent 60%)',
        }}
      />
      <Container className="relative">
        <SectionTitle
          eyebrow="Our Discipleship Pathway"
          title="Five Marks of a"
          titleAccent="Higher Life"
          subtitle="This isn’t a program to complete — it’s the shape of a life we’re inviting you into, one honest step at a time."
        />
        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-5">
          {pathway.map((item) => (
            <div key={item.number} className="text-center sm:text-left">
              <p className="font-display text-h3 font-semibold text-gold/40">{item.number}</p>
              <h3 className="mt-2 font-display text-h4 font-semibold text-cream">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
