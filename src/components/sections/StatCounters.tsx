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
    <div ref={sectionRef} className="grid grid-cols-1 gap-10 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-display text-hero font-semibold text-gold">
            <span data-counter={stat.value}>0</span>
            {stat.suffix}
          </p>
          <p className="mt-2 font-sans text-sm uppercase tracking-widest text-cream/70">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
