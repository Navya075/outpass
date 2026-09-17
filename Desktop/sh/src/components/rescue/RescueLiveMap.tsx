import React, { useState } from 'react';
import { DisasterMap } from '../map/DisasterMap';
import { LayerControls } from '../map/LayerControls';
import { MapLegend } from '../map/MapLegend';
import { RiskBadge } from '../common/RiskBadge';
import { useHazard } from '../../context/HazardContext';
import { HazardZone } from '../../types/hazard';
import {
  Plus,
  Compass,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RescueLiveMapProps {
  onNavigate: (tabId: string) => void;
  onSelectZoneForMission: (zone: HazardZone) => void;
}

export const RescueLiveMap: React.FC<RescueLiveMapProps> = ({
  onNavigate,
  onSelectZoneForMission,
}) => {
  const { selectedZone, setSelectedZone } = useHazard();
  const [showTechnicalData, setShowTechnicalData] = useState(false);

  const leadHours = Math.floor(selectedZone.actionableLeadTimeMinutes / 60);
  const leadMins = selectedZone.actionableLeadTimeMinutes % 60;
  const timeToAct = leadHours > 0 ? `~${leadHours} hour${leadHours > 1 ? 's' : ''} ${leadMins > 0 ? `${leadMins}m` : ''}` : `~${leadMins} mins`;

  const roadStatus =
    selectedZone.accessibilityStatus === 'Impassable'
      ? 'Blocked'
      : selectedZone.accessibilityStatus === 'Poor'
      ? 'Caution'
      : 'Open';

  const isUrgent = selectedZone.actionableLeadTimeMinutes <= 90 || selectedZone.riskScore >= 80;
  const priority = isUrgent ? 'URGENT' : selectedZone.riskScore >= 65 ? 'HIGH' : 'NORMAL';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            WHERE TO RESPOND
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Rescue Live Map
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Where teams are deployed, current danger zones, and road status across the sector.
          </p>
        </div>

        <button
          onClick={() => {
            onSelectZoneForMission(selectedZone);
            onNavigate('rescue-missions');
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Assign Mission for {selectedZone.name}</span>
        </button>
      </div>

      {/* Main Map & Location Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-4">
          <DisasterMap
            onSelectZone={(zone) => setSelectedZone(zone)}
            selectedZoneId={selectedZone.id}
            heightClass="h-[520px] sm:h-[580px]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayerControls />
            <MapLegend />
          </div>
        </div>

        {/* Right 1 Col: Location Inspector (Operational language) */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  SELECTED LOCATION
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedZone.name}
                </h3>
              </div>
              <RiskBadge level={selectedZone.riskLevel} />
            </div>

            {/* Operational details as specified */}
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">RISK:</span>
                <span className="font-bold text-red-600 font-mono text-sm">
                  {selectedZone.riskScore >= 80 ? 'HIGH' : selectedZone.riskScore >= 60 ? 'MODERATE' : 'LOW'} ({selectedZone.riskScore}%)
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">PEOPLE AT RISK:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {selectedZone.exposure.totalPopulation.toLocaleString()} people
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">TIME TO ACT:</span>
                <span className="font-mono font-bold text-amber-700">
                  {timeToAct}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">ROAD STATUS:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
                    roadStatus === 'Blocked'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : roadStatus === 'Caution'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {roadStatus}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">PRIORITY:</span>
                <span
                  className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] font-mono ${
                    priority === 'URGENT'
                      ? 'bg-red-600 text-white'
                      : priority === 'HIGH'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {priority}
                </span>
              </div>
            </div>

            {/* Actions: Assign Mission & Road Status */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onSelectZoneForMission(selectedZone);
                  onNavigate('rescue-missions');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Assign Team to {selectedZone.name}</span>
              </button>

              <button
                onClick={() => onNavigate('rescue-roads')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                <Compass className="h-4 w-4 text-slate-600" />
                <span>Check Road Status</span>
              </button>
            </div>

            {/* Collapsible Technical Data */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowTechnicalData(!showTechnicalData)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                <span>View Technical Data</span>
                {showTechnicalData ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showTechnicalData && (
                <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pore Pressure:</span>
                    <strong className="text-red-700">{selectedZone.environmental.poreWaterPressureKPa} kPa</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inclinometer Creep:</span>
                    <strong className="text-amber-700">{selectedZone.environmental.inclinometerShiftMm} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slope Gradient:</span>
                    <strong className="text-slate-800">{selectedZone.environmental.slopeDegree}°</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rainfall Today:</span>
                    <strong className="text-blue-700">{selectedZone.environmental.rainfall24hMm} mm</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
