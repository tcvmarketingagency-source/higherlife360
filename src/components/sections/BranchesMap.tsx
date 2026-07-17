'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BranchRow } from '@/lib/database.types';

// Leaflet's default marker icon paths break under Webpack/Next.js bundling —
// this is the standard documented fix: point the default icon at the CDN
// instead of trying to resolve local package assets through the bundler.
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Gold dot marker matching the brand palette (crimson/gold/cream hex values
// straight from tailwind.config.ts — Leaflet needs raw CSS here, not classes).
const goldIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:#C9A24B;border:2px solid #F5EFE0;box-shadow:0 0 0 2px #5C0A18;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

type MappableBranch = BranchRow & { lat: number; lng: number };

function FlyToTarget({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 11, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export function BranchesMap({
  branches,
  flyToTarget = null,
  center = [20, 10],
  zoom = 2,
}: {
  branches: BranchRow[];
  flyToTarget?: [number, number] | null;
  center?: [number, number];
  zoom?: number;
}) {
  const mappable = branches.filter(
    (branch): branch is MappableBranch => branch.lat != null && branch.lng != null
  );

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToTarget target={flyToTarget} />
      {mappable.map((branch) => (
        <Marker key={branch.id} position={[branch.lat, branch.lng]} icon={goldIcon}>
          <Popup>
            <div className="font-sans">
              <p className="font-semibold text-ink">{branch.name}</p>
              {branch.city && <p className="text-ink/70">{branch.city}</p>}
              {branch.service_times && (
                <p className="mt-1 text-xs text-ink/70">{branch.service_times}</p>
              )}
              <Link
                href={`/branches/${branch.id}`}
                className="mt-2 inline-block text-xs font-semibold uppercase tracking-widest text-crimson hover:text-gold"
              >
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
