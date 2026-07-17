'use client';

import dynamic from 'next/dynamic';

const HeroParticles = dynamic(() => import('./HeroParticles').then((mod) => mod.HeroParticles), {
  ssr: false,
});

export function HeroParticlesCanvas() {
  return <HeroParticles />;
}
