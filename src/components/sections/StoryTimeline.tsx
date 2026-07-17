'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

const milestones = [
  {
    year: '2017',
    title: 'Founding',
    text: 'HigherLife began in Pune, Maharashtra, India. The founding vision: to help every person encounter God and live a Higher Life.',
  },
  {
    // PLACEHOLDER: fill in the real year this milestone happened.
    year: 'Year TBD',
    title: 'First Branch',
    text: 'First branch established beyond Pune.',
  },
  {
    // PLACEHOLDER: fill in the real year this milestone happened.
    year: 'Year TBD',
    title: 'Expansion Across India',
    text: 'Expansion across India.',
  },
  {
    // PLACEHOLDER: fill in the real year this milestone happened.
    year: 'Year TBD',
    title: 'Going Global',
    text: 'Went global — first international branch.',
  },
  {
    year: 'Today',
    title: 'A Global Family',
    text: 'A global family of 120+ branches across 10+ countries, with 230,000+ people connected worldwide.',
  },
];

export function StoryTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !fillRef.current) return;

      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );

      const items = containerRef.current.querySelectorAll<HTMLElement>('[data-milestone]');
      items.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl">
      <div aria-hidden className="absolute left-4 top-0 h-full w-px bg-gold/20 sm:left-6" />
      <div
        ref={fillRef}
        aria-hidden
        className="absolute left-4 top-0 h-full w-px origin-top bg-gold sm:left-6"
      />
      <div className="flex flex-col gap-16">
        {milestones.map((milestone) => (
          <div key={milestone.year} data-milestone className="relative pl-12 sm:pl-16">
            <span
              aria-hidden
              className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-gold sm:left-6"
            />
            <p className="font-display text-h4 font-semibold text-gold">{milestone.year}</p>
            <p className="mt-1 font-display text-h4 font-semibold text-cream">{milestone.title}</p>
            <p className="mt-2 max-w-md text-sm text-cream/70">{milestone.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
