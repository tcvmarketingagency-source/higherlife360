'use client';

import dynamic from 'next/dynamic';
import type { BranchRow } from '@/lib/database.types';

const BranchesMap = dynamic(() => import('./BranchesMap').then((mod) => mod.BranchesMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-crimson" />,
});

export function BranchesMapLoader(props: {
  branches: BranchRow[];
  flyToTarget?: [number, number] | null;
  center?: [number, number];
  zoom?: number;
}) {
  return <BranchesMap {...props} />;
}
