import React, { useState } from 'react';
import { useHazard } from '../../context/HazardContext';
import { MetricCard } from '../common/MetricCard';
import { RainfallSoilChart } from '../charts/RainfallSoilChart';
import {
  CloudRain,
  Layers,
  Activity,
  Mountain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const EnvironmentalSensorsView: React.FC = () => {
  const { selectedZone, zones, selectZoneById } = useHazard();
  const [showTechnicalData, setShowTechnicalData] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            WEATHER & SENSORS
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Weather & Ground Conditions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Live rainfall, soil moisture, and ground stability measurements across Wayanad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Select Station:</span>
          <select
            value={selectedZone.id}
            onChange={(e) => selectZoneById(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-blue-500"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} Weather Station
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Core Indicators as specified: Rainfall, Soil Wetness, Ground Movement, Slope Condition */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Rainfall"
          value={`${selectedZone.environmental.rainfall24hMm} mm`}
          variant="critical"
          subtitle={`Current rate: ${selectedZone.environmental.rainfallCurrentMm} mm/h (Heavy)`}
          icon={CloudRain}
        />
        <MetricCard
          label="Soil Wetness"
          value={`${selectedZone.environmental.soilSaturationPct}%`}
          variant="critical"
          subtitle="Ground is heavily saturated"
          icon={Layers}
        />
        <MetricCard
          label="Ground Movement"
          value={`${selectedZone.environmental.inclinometerShiftMm} mm`}
          variant="warning"
          subtitle="Sub-surface creep detected"
          icon={Activity}
        />
        <MetricCard
          label="Slope Condition"
          value={`${selectedZone.environmental.slopeDegree}°`}
          variant="warning"
          subtitle="Steep terrain hillside"
          icon={Mountain}
        />
      </div>

      {/* Rainfall & Soil Moisture Trend Chart */}
      <RainfallSoilChart data={selectedZone.forecast} />

      {/* Collapsible Technical Data as requested: "Technical measurements can appear after clicking: View Technical Data" */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sensor Measurements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Technical telemetry from piezometers, borehole inclinometers, and soil strata
            </p>
          </div>

          <button
            onClick={() => setShowTechnicalData(!showTechnicalData)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <span>{showTechnicalData ? 'Hide Technical Data' : 'View Technical Data'}</span>
            {showTechnicalData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {showTechnicalData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Piezometer Pore Water Pressure</span>
              <p className="text-base font-bold text-red-600">
                {selectedZone.environmental.poreWaterPressureKPa} kPa
              </p>
              <p className="text-[11px] text-slate-500 font-sans">Installed at bedrock interface (4.5m)</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Borehole Inclinometer Shift</span>
              <p className="text-base font-bold text-amber-700">
                {selectedZone.environmental.inclinometerShiftMm} mm creep
              </p>
              <p className="text-[11px] text-slate-500 font-sans">Displacement rate: ~3.1 mm/h</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Soil Classification</span>
              <p className="text-base font-bold text-slate-900 font-sans">
                {selectedZone.environmental.soilType}
              </p>
              <p className="text-[11px] text-slate-500 font-sans">Lateritic clay over gneissic bedrock</p>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-slate-500">
            Click "View Technical Data" above to view detailed geotechnical and sensor readings.
          </div>
        )}
      </div>
    </div>
  );
};
