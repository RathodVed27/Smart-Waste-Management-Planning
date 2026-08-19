import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import type { Coordinates } from '../data/WasteContext';

export interface RoadRouteData { path: Coordinates[]; distanceKm: number; durationMinutes: number; instructions: string[]; }
export const useRoadRoute = (points: Coordinates[]) => {
  const [route, setRoute] = useState<RoadRouteData | null>(null);
  useEffect(() => {
    if (points.length < 2) return;
    const controller = new AbortController();
    const coordinates = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const query = `/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`;
    fetch(`https://routing.openstreetmap.de/routed-car${query}`, { signal: controller.signal })
      .catch(() => fetch(`https://router.project-osrm.org${query}`, { signal: controller.signal }))
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { const result = data.routes?.[0]; if (!result) return; setRoute({ path: result.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]), distanceKm: result.distance / 1000, durationMinutes: Math.max(1, Math.round(result.duration / 60)), instructions: result.legs.flatMap((leg: { steps: { name: string; maneuver: { type: string; modifier?: string } }[] }) => leg.steps.slice(1).map(step => `${step.maneuver.type === 'turn' ? `Turn ${step.maneuver.modifier || ''}` : step.maneuver.type} ${step.name ? `onto ${step.name}` : ''}`.trim())).slice(0, 4) }); })
      .catch(() => setRoute(null));
    return () => controller.abort();
  }, [points.map(point => point.join(',')).join('|')]);
  return route;
};
export const RoadPolyline = ({ points }: { points: Coordinates[] }) => { const route = useRoadRoute(points); return <Polyline positions={route?.path || points} color="#2563eb" weight={6} opacity={.9} />; };
