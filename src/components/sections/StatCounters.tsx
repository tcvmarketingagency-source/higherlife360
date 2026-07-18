'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
};

export function StatCounters({ stats }: { stats: StatItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const counters = sectionRef.current?.querySelectorAll<HTMLElement>('[data-counter]');
      counters?.forEach((el) => {
        const target = Number(el.dataset.counter);
        const counterObj = { value: 0 };

        gsap.to(counterObj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.floor(counterObj.value).toLocaleString();
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [stats] }
  );

  return (
    // 3-across only from `lg` up — deliberately deferred later than the
    // usual `sm` breakpoint so each stat has real room for a number as long
    // as "230,000+" without crowding its neighbor. Below `lg` these stack
    // vertically, which comfortably fits any width.
    <div ref={sectionRef} className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
      {stats.map((stat) => (
        <div key={stat.label} className="px-2 text-center">
          {/* Deliberately its own clamp, not the shared h1/h2/hero scale —
              this is a dense inline number+suffix, not a headline, and needs
              to stay comfortably narrower than those at every breakpoint. */}
          <p className="whitespace-nowrap font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold text-gold">
            <span data-counter={stat.value}>0</span>
            {stat.suffix}
          </p>
          <p className="mt-3 font-sans text-sm uppercase tracking-widest text-cream/70">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
