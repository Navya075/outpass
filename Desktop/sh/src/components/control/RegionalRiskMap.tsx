import React, { useState } from 'react';
import { DisasterMap } from '../map/DisasterMap';
import { LayerControls } from '../map/LayerControls';
import { MapLegend } from '../map/MapLegend';
import { RiskBadge } from '../common/RiskBadge';
import { useHazard } from '../../context/HazardContext';
import { Sliders, ChevronDown, ChevronUp, Users, Clock, Route, Compass } from 'lucide-react';

export const RegionalRiskMap: React.FC = () => {
  const { selectedZone, setSelectedZone, timeOffsetHours, setTimeOffsetHours } = useHazard();
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Forecast Time Horizon Slider */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            DISTRICT HAZARD OVERVIEW
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Regional Risk Map
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor risk levels, floods, roads, shelters, and rescue teams across Wayanad.
          </p>
        </div>

        {/* Forecast Timeline Slider */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
          <Sliders className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-slate-700 font-semibold">Forecast:</span>
          <div className="inline-flex rounded-lg bg-slate-50 p-1 border border-slate-200 font-mono font-bold text-xs">
            {[
              { val: 0, label: 'Now' },
              { val: 1, label: '+1 Hour' },
              { val: 3, label: '+3 Hours' },
              { val: 6, label: '+6 Hours' },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setTimeOffsetHours(t.val)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeOffsetHours === t.val
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Column (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <DisasterMap
            onSelectZone={(z) => setSelectedZone(z)}
            selectedZoneId={selectedZone.id}
            heightClass="h-[520px] sm:h-[620px]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayerControls />
            <MapLegend />
          </div>
        </div>

        {/* Selected Sector Inspector Column (1 Col) */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  SELECTED SECTOR
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedZone.name}</h3>
              </div>
              <RiskBadge level={selectedZone.riskLevel} />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">Risk Level:</span>
                <span className="font-bold text-red-600 font-mono text-sm">
                  {selectedZone.riskScore >= 80 ? 'High' : selectedZone.riskScore >= 60 ? 'Moderate' : 'Low'} ({selectedZone.riskScore}%)
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">People at Risk:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {selectedZone.exposure.totalPopulation.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">Time to Act:</span>
                <span className="font-mono font-bold text-amber-700">
                  {timeToAct}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-500 font-medium">Road Status:</span>
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
                <span className="text-slate-500 font-medium">Response Needed:</span>
                <span className="font-bold text-blue-700">
                  {selectedZone.riskScore >= 80 ? 'Evacuation Team' : 'Pre-position Units'}
                </span>
              </div>
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
                    <span className="text-slate-500">Inclinometer Shift:</span>
                    <strong className="text-amber-700">{selectedZone.environmental.inclinometerShiftMm} mm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slope Gradient:</span>
                    <strong className="text-slate-800">{selectedZone.environmental.slopeDegree}°</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rainfall 24h:</span>
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
