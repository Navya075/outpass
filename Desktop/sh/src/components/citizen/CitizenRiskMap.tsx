import React, { useState } from 'react';
import { DisasterMap } from '../map/DisasterMap';
import { RiskBadge } from '../common/RiskBadge';
import { useHazard } from '../../context/HazardContext';
import { HazardZone } from '../../types/hazard';
import {
  Navigation,
  Info,
  MapPin,
  Shield,
  AlertTriangle,
  Route,
  ChevronDown,
  ChevronUp,
  Layers,
  HeartPulse,
  Truck,
  Building2,
} from 'lucide-react';

interface CitizenRiskMapProps {
  onNavigate: (tabId: string) => void;
}

export const CitizenRiskMap: React.FC<CitizenRiskMapProps> = ({ onNavigate }) => {
  const { selectedZone, setSelectedZone } = useHazard();
  const [showMapOptions, setShowMapOptions] = useState(false);

  // Simplified Map Layer Toggles for Citizen
  const [showFloodAreas, setShowFloodAreas] = useState(true);
  const [showBlockedRoads, setShowBlockedRoads] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showRescueTeams, setShowRescueTeams] = useState(true);

  const handleSelectZone = (zone: HazardZone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">
            LOCAL AREA MAP
          </span>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Risk Map
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            See dangerous areas, safe shelters, hospitals, and blocked roads near you
          </p>
        </div>

        <button
          onClick={() => onNavigate('citizen-evacuate')}
          className="flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          <Navigation className="h-4 w-4" />
          <span>Evacuation Route</span>
        </button>
      </div>

      {/* Main Map & Location Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map + Simple Legend + Optional Map Options */}
        <div className="lg:col-span-2 space-y-4">
          <DisasterMap
            onSelectZone={handleSelectZone}
            selectedZoneId={selectedZone.id}
            heightClass="h-[440px] sm:h-[500px]"
          />

          {/* Simple Citizen Map Legend */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              MAP GUIDE
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-600" />
                <span>High Risk</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span>Moderate Risk</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>Safe Area</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Your Location</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>⛺</span>
                <span>Safe Shelter</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>🏥</span>
                <span>Hospital</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>🚫</span>
                <span>Blocked Road</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span>🚒</span>
                <span>Rescue Team Nearby</span>
              </span>
            </div>
          </div>

          {/* Optional Map Options Container (Keeps advanced layer toggles optional) */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="w-full flex items-center justify-between p-3.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-700" />
                <span>Map Options (Show / Hide Information)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <span>{showMapOptions ? 'Hide' : 'Show'}</span>
                {showMapOptions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </div>
            </button>

            {showMapOptions && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFloodAreas}
                    onChange={(e) => setShowFloodAreas(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">Flood Risk Areas</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBlockedRoads}
                    onChange={(e) => setShowBlockedRoads(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">Blocked Roads</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showShelters}
                    onChange={(e) => setShowShelters(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">Safe Shelters</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHospitals}
                    onChange={(e) => setShowHospitals(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">Hospitals & Clinics</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRescueTeams}
                    onChange={(e) => setShowRescueTeams(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">Rescue Teams Nearby</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Location Details Side Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  SELECTED AREA
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedZone.name}
                </h2>
              </div>
              <RiskBadge level={selectedZone.riskLevel} />
            </div>

            {/* Simple Information Items */}
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500">Risk Level:</span>
                <span className="font-bold text-red-600 capitalize">
                  {selectedZone.riskLevel} ({selectedZone.riskScore}%)
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500">Rainfall Today:</span>
                <span className="font-bold text-blue-700">
                  {selectedZone.environmental.rainfall24hMm} mm
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500">Road Condition:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    selectedZone.accessibilityStatus === 'Impassable'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {selectedZone.accessibilityStatus === 'Impassable'
                    ? 'Blocked / Closed'
                    : 'Safe with Caution'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500">Nearest Safe Shelter:</span>
                <span className="font-bold text-emerald-800">
                  St. Joseph Camp (2.8 km)
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500">Time to Act:</span>
                <span className="font-bold text-amber-700">
                  ~2 hours
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('citizen-evacuate')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Route className="h-4 w-4" />
                <span>View Safe Evacuation Route</span>
              </button>

              <button
                onClick={() => onNavigate('citizen-details')}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
              >
                <Info className="h-4 w-4 text-blue-700" />
                <span>Why is this area at risk?</span>
              </button>
            </div>
          </div>

          {/* Simple Helper Tip */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-blue-950 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-blue-700" />
              <span>Tap Any Area to Check Risk</span>
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Tap any colored region on the map to see its current risk, road conditions, and safe shelters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
