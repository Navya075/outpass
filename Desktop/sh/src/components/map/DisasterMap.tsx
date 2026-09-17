import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HazardZone } from '../../types/hazard';
import { useHazard } from '../../context/HazardContext';
import { MOCK_SHELTERS, MOCK_ROADS } from '../../data/mockResources';
import { MOCK_RESCUE_TEAMS } from '../../data/mockMissions';
import { Search, Compass } from 'lucide-react';

interface DisasterMapProps {
  onSelectZone?: (zone: HazardZone) => void;
  selectedZoneId?: string;
  heightClass?: string;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  onSelectZone,
  selectedZoneId,
  heightClass = 'h-[500px] md:h-[600px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { zones, layers, selectZoneById } = useHazard();
  const [searchQuery, setSearchQuery] = useState('');

  // Wayanad Center Coordinates
  const defaultCenter: [number, number] = [11.575, 76.120];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map with smooth view
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality LIGHT basemap (CartoDB Positron)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Layers on State Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Hazard Risk Zones & Polygons
    if (layers.landslide) {
      zones.forEach((zone) => {
        const isSelected = zone.id === selectedZoneId;
        const color =
          zone.riskLevel === 'critical'
            ? '#dc2626' // Red
            : zone.riskLevel === 'high'
            ? '#ea580c' // Orange
            : zone.riskLevel === 'moderate'
            ? '#d97706' // Amber
            : '#059669'; // Green

        if (zone.polygonCoords && zone.polygonCoords.length > 0) {
          const polygon = L.polygon(zone.polygonCoords, {
            color: color,
            weight: isSelected ? 3 : 2,
            opacity: 0.9,
            fillColor: color,
            fillOpacity: isSelected ? 0.35 : 0.18,
            dashArray: zone.riskLevel === 'critical' ? '4, 4' : undefined,
          });

          polygon.on('click', () => {
            selectZoneById(zone.id);
            if (onSelectZone) onSelectZone(zone);
          });

          polygon.bindTooltip(
            `<div class="p-1 font-sans text-slate-900">
              <strong class="text-xs uppercase">${zone.name}</strong><br/>
              <span style="color:${color}; font-weight:bold;">Risk: ${zone.riskScore}% (${zone.riskLevel.toUpperCase()})</span><br/>
              <span class="text-[10px] text-slate-500">Lead time: ${Math.floor(zone.actionableLeadTimeMinutes / 60)}h ${zone.actionableLeadTimeMinutes % 60}m</span>
            </div>`,
            { sticky: true }
          );

          layerGroup.addLayer(polygon);
        }

        // Centroid circle badge
        const markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            ${
              zone.riskLevel === 'critical'
                ? `<span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-red-400 opacity-60"></span>`
                : ''
            }
            <div class="relative flex items-center justify-center h-6 w-6 rounded-full border-2 border-white shadow-md font-sans" style="background-color: ${color}">
              <span class="text-[9px] font-black text-white">${zone.riskScore}</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-hazard-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(zone.coordinates, { icon });
        marker.on('click', () => {
          selectZoneById(zone.id);
          if (onSelectZone) onSelectZone(zone);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 2. Road Network & Blockages
    if (layers.roads) {
      MOCK_ROADS.forEach((road) => {
        const roadColor =
          road.status === 'blocked'
            ? '#dc2626'
            : road.status === 'partially_blocked'
            ? '#d97706'
            : '#059669';

        const polyline = L.polyline(road.coordinatesPath, {
          color: roadColor,
          weight: road.status === 'blocked' ? 5 : 3.5,
          opacity: 0.85,
          dashArray: road.status === 'blocked' ? '6, 6' : road.status === 'partially_blocked' ? '4, 4' : undefined,
        });

        polyline.bindTooltip(
          `<div class="p-1 font-sans text-slate-900">
            <strong>${road.roadName}</strong><br/>
            <span style="color:${roadColor}; font-weight:bold;">Status: ${road.status.toUpperCase()}</span><br/>
            <span class="text-[10px] text-slate-600">${road.hazardCause}</span>
          </div>`,
          { sticky: true }
        );

        layerGroup.addLayer(polyline);
      });
    }

    // 3. Relief Shelters
    if (layers.shelters) {
      MOCK_SHELTERS.forEach((shelter) => {
        const shelterHtml = `
          <div class="flex items-center justify-center h-6 w-6 rounded-md bg-emerald-700 border-2 border-white text-white text-xs shadow-md font-sans">
            🛡️
          </div>
        `;
        const icon = L.divIcon({
          html: shelterHtml,
          className: 'shelter-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(shelter.coordinates, { icon });
        marker.bindPopup(
          `<div class="p-3 text-slate-900 font-sans">
            <span class="text-[9px] font-bold text-emerald-700 uppercase tracking-wide">Designated Safe Zone</span>
            <h4 class="text-sm font-bold text-slate-900 mt-0.5">${shelter.name}</h4>
            <p class="text-xs text-slate-600 mt-1">${shelter.location}</p>
            <div class="mt-2 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
              <div>Beds Available: <strong class="text-emerald-700 font-bold">${shelter.availableBeds}</strong> / ${shelter.capacityTotal}</div>
              <div>Medical Officer: <strong>${shelter.medicalOfficerName}</strong></div>
            </div>
            <p class="text-[11px] text-blue-700 mt-1.5 font-medium">Helpline: ${shelter.contactPhone}</p>
          </div>`
        );
        layerGroup.addLayer(marker);
      });
    }

    // 4. Rescue Teams
    if (layers.teams) {
      MOCK_RESCUE_TEAMS.forEach((team) => {
        const teamHtml = `
          <div class="flex items-center justify-center h-6 w-6 rounded-md bg-blue-700 border-2 border-white text-white text-xs shadow-md font-sans">
            🚑
          </div>
        `;
        const icon = L.divIcon({
          html: teamHtml,
          className: 'team-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(team.currentCoordinates, { icon });
        marker.bindPopup(
          `<div class="p-3 text-slate-900 font-sans">
            <span class="text-[9px] font-bold text-blue-700 uppercase tracking-wide">${team.agency}</span>
            <h4 class="text-sm font-bold text-slate-900 mt-0.5">${team.name}</h4>
            <p class="text-xs text-slate-600 mt-1">Officer: ${team.leaderName}</p>
            <div class="mt-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
              <div>Personnel: <strong>${team.memberCount} rescuers</strong></div>
              <div>Vehicle: <strong>${team.assignedVehicle}</strong></div>
            </div>
          </div>`
        );
        layerGroup.addLayer(marker);
      });
    }

    // 5. Citizen Location (Ananya Nair in Meppadi)
    const citizenPos: [number, number] = [11.5518, 76.1264];
    const citizenHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75"></span>
        <div class="flex items-center justify-center h-6 w-6 rounded-full bg-blue-700 border-2 border-white shadow-md text-white text-[10px]">
          📍
        </div>
      </div>
    `;
    const citizenMarker = L.marker(citizenPos, {
      icon: L.divIcon({
        html: citizenHtml,
        className: 'user-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    });
    citizenMarker.bindTooltip(
      '<div class="p-1 font-sans text-xs"><strong>Your Registered Location</strong> (Meppadi)</div>',
      { permanent: false }
    );
    layerGroup.addLayer(citizenMarker);
  }, [zones, layers, selectedZoneId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const match = zones.find((z) =>
      z.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(match.coordinates, 14, { duration: 1 });
      selectZoneById(match.id);
      if (onSelectZone) onSelectZone(match);
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, 12, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Top Map Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <form
          onSubmit={handleSearch}
          className="flex items-center rounded-lg border border-slate-200 bg-white/95 shadow-sm px-3 py-1.5 pointer-events-auto text-xs"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search village (e.g. Meppadi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-48 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleResetView}
            title="Reset Map Center"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Compass className="h-3.5 w-3.5 text-blue-700" />
            <span className="hidden sm:inline">Center Map</span>
          </button>
        </div>
      </div>

      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />
    </div>
  );
};
