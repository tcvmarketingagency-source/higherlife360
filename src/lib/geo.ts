// Haversine formula — great-circle distance between two lat/lng points, in km.
export function distanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearest<T extends { lat: number | null; lng: number | null }>(
  from: { lat: number; lng: number },
  items: T[]
): T | null {
  let nearest: T | null = null;
  let nearestDistance = Infinity;

  for (const item of items) {
    if (item.lat == null || item.lng == null) continue;
    const distance = distanceKm(from, { lat: item.lat, lng: item.lng });
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = item;
    }
  }

  return nearest;
}
