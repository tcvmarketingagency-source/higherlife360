'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '@/lib/gsap';

export function HeroTextReveal({ className, children }: { className?: string; children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const split = SplitText.create(ref.current, {
        type: 'words,lines',
        mask: 'lines',
        onSplit: (self) =>
          gsap.from(self.words, {
            opacity: 0,
            yPercent: 110,
            duration: 0.9,
            stagger: 0.045,
            ease: 'power3.out',
            delay: 0.15,
          }),
      });
      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
