'use client';

import dynamic from 'next/dynamic';

const LogoRevealScene = dynamic(
  () => import('./LogoRevealScene').then((mod) => mod.LogoRevealScene),
  { ssr: false }
);

export function LogoRevealCanvas({ onSettled }: { onSettled: () => void }) {
  return <LogoRevealScene onSettled={onSettled} />;
}
