import React, { useState } from 'react';
import { useHazard } from '../../context/HazardContext';
import { RiskBadge } from '../common/RiskBadge';
import { RiskEvolutionChart } from '../charts/RiskEvolutionChart';
import { RainfallSoilChart } from '../charts/RainfallSoilChart';
import {
  TrendingUp,
  CloudRain,
  Mountain,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

interface CitizenRiskDetailsProps {
  onNavigate: (tabId: string) => void;
}

export const CitizenRiskDetails: React.FC<CitizenRiskDetailsProps> = ({ onNavigate }) => {
  const { selectedZone, zones, selectZoneById } = useHazard();
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">
            COMMUNITY RISK EXPLANATION
          </span>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Why is my area at risk?
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Plain-language explanation of weather and ground conditions in your sector
          </p>
        </div>

        {/* Sector Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Area:</span>
          <select
            value={selectedZone.id}
            onChange={(e) => selectZoneById(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-none shadow-2xs"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.riskLevel.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Main Citizen Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              CURRENT RISK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight mt-1 uppercase">
              HIGH
            </h2>
          </div>
          <RiskBadge level={selectedZone.riskLevel} size="lg" />
        </div>

        {/* Why? */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            WHY?
          </h3>
          <p className="text-base font-bold text-slate-800 leading-relaxed">
            Heavy rainfall has increased the risk in your area.
          </p>
        </div>

        {/* 4 Simple Conditions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              RAINFALL
            </span>
            <p className="text-lg font-black text-blue-700">Heavy</p>
            <p className="text-xs text-slate-500">{selectedZone.environmental.rainfall24hMm} mm today</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              GROUND
            </span>
            <p className="text-lg font-black text-amber-700">Wet / Saturated</p>
            <p className="text-xs text-slate-500">Soaked with rain</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              SLOPE
            </span>
            <p className="text-lg font-black text-slate-900">Steep</p>
            <p className="text-xs text-slate-500">Mountain hillside</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              TREND
            </span>
            <p className="text-lg font-black text-red-600">Risk is increasing</p>
            <p className="text-xs text-slate-500">Rising past 2 hours</p>
          </div>
        </div>

        {/* WHAT THIS MEANS Section */}
        <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-5 space-y-2">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Info className="h-4 w-4 text-blue-700" />
            <span>WHAT THIS MEANS</span>
          </h4>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            Conditions are becoming unsafe. Avoid steep slopes and follow evacuation instructions if an alert is issued.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('citizen-evacuate')}
              className="flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>See Safe Evacuation Route</span>
            </button>
            <button
              onClick={() => onNavigate('citizen-guide')}
              className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
            >
              Safety Guide & Go-Bag
            </button>
          </div>
        </div>
      </div>

      {/* 2. Collapsible Technical Information for Responders */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {showTechnical ? 'Hide Technical Details' : 'View More Details'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed sensor telemetry, rainfall graphs, and technical information
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <span>{showTechnical ? 'Collapse' : 'Expand'}</span>
            {showTechnical ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {showTechnical && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/40 space-y-6">
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono block mb-2">
                Technical Information — For Responders
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Soil Saturation:</span>
                  <p className="text-base font-bold text-slate-900 font-mono">
                    {selectedZone.environmental.soilSaturationPct}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Pore Pressure:</span>
                  <p className="text-base font-bold text-slate-900 font-mono">
                    {selectedZone.environmental.poreWaterPressureKPa} kPa
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Slope Angle:</span>
                  <p className="text-base font-bold text-slate-900 font-mono">
                    {selectedZone.environmental.slopeDegree}°
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Ground Inclinometer:</span>
                  <p className="text-base font-bold text-slate-900 font-mono">
                    +{selectedZone.environmental.inclinometerShiftMm} mm
                  </p>
                </div>
              </div>
            </div>

            {/* Graphs inside collapsible container */}
            <div className="space-y-4">
              <RiskEvolutionChart data={selectedZone.forecast} zoneName={selectedZone.name} />
              <RainfallSoilChart data={selectedZone.forecast} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
