import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { EvacuationRoutePlan } from '../../services/routingService';

interface EvacuationRouteMapProps {
  routePlan: EvacuationRoutePlan;
  userCoords: [number, number];
  heightClass?: string;
}

export const EvacuationRouteMap: React.FC<EvacuationRouteMapProps> = ({
  routePlan,
  userCoords,
  heightClass = 'h-[360px] sm:h-[420px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: userCoords,
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19,
      }
    ).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);

    // 1. Primary Safe Route (Green Polyline with high visibility)
    const primaryLine = L.polyline(routePlan.pathCoordinates, {
      color: '#059669',
      weight: 6,
      opacity: 0.95,
    });
    layerGroup.addLayer(primaryLine);

    // 2. Alternative Route (Detour Dashed Line)
    if (routePlan.alternativePathCoordinates) {
      const altLine = L.polyline(routePlan.alternativePathCoordinates, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 6',
      });
      altLine.bindTooltip('Alternative Detour Route', { sticky: true });
      layerGroup.addLayer(altLine);
    }

    // 3. User Location Marker
    const userMarker = L.marker(userCoords, {
      icon: L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-400 opacity-75"></span>
            <div class="flex items-center justify-center h-7 w-7 rounded-full bg-blue-600 border-2 border-white shadow-md text-white text-xs">
              📍
            </div>
          </div>
        `,
        className: 'user-route-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    });
    userMarker.bindTooltip('<strong>Your Location (Meppadi)</strong>', { permanent: true, direction: 'top' });
    layerGroup.addLayer(userMarker);

    // 4. Safe Zone Shelter Destination Marker
    const shelterMarker = L.marker(routePlan.destinationCoordinates, {
      icon: L.divIcon({
        html: `
          <div class="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-600 border-2 border-white shadow-lg text-white text-sm">
            🛡️
          </div>
        `,
        className: 'shelter-route-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    });
    shelterMarker.bindTooltip(`<strong>${routePlan.destinationName}</strong><br/>Capacity: ${routePlan.destinationCapacityAvailable} beds available`, { permanent: true, direction: 'bottom' });
    layerGroup.addLayer(shelterMarker);

    // 5. Blocked Road Hazard Marker nearby
    const blockedPoint: [number, number] = [11.545, 76.138];
    const blockedMarker = L.marker(blockedPoint, {
      icon: L.divIcon({
        html: `
          <div class="flex items-center justify-center h-6 w-6 rounded-full bg-red-600 border-2 border-white text-white text-xs shadow-md">
            ⛔
          </div>
        `,
        className: 'hazard-point-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    });
    blockedMarker.bindTooltip('<strong>HAZARD DETOUR</strong><br/>Lower culvert washed out', { permanent: false });
    layerGroup.addLayer(blockedMarker);

    // Fit map bounds to encompass the entire route
    map.fitBounds(primaryLine.getBounds(), { padding: [40, 40] });
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [routePlan, userCoords]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute top-3 left-3 z-[400] rounded-lg border border-emerald-200 bg-emerald-50/95 px-3 py-1.5 shadow-sm backdrop-blur-sm text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
        Safe Evacuation Corridor Active (Est. {routePlan.estimatedTravelTimeMin} mins)
      </div>
      <div ref={containerRef} className={`w-full ${heightClass}`} />
    </div>
  );
};
