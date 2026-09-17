import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { RiskEvolutionChart } from '../charts/RiskEvolutionChart';
import { RainfallSoilChart } from '../charts/RainfallSoilChart';
import { Flame, Clock, CloudRain, TrendingUp } from 'lucide-react';

export const RiskEvolutionView: React.FC = () => {
  const { selectedZone, zones, selectZoneById } = useHazard();

  const delta = selectedZone.riskScore - selectedZone.previousRiskScore;
  const isIncreasing = delta > 0;

  const timelinePoints = [
    { label: 'Past (2h ago)', risk: `${selectedZone.previousRiskScore}%`, status: 'Moderate rain', note: 'Rainfall began accumulating' },
    { label: 'Now', risk: `${selectedZone.riskScore}%`, status: 'Heavy rain & saturated soil', note: 'Current active risk level' },
    { label: 'Next 1 Hour', risk: `${Math.min(96, selectedZone.riskScore + 5)}%`, status: 'Risk escalating', note: 'High soil wetness expected' },
    { label: 'Next 3 Hours', risk: `${Math.min(98, selectedZone.riskScore + 10)}%`, status: 'Peak dangerous window', note: 'Evacuation must be completed' },
    { label: 'Next 6 Hours', risk: `${Math.max(45, selectedZone.riskScore - 12)}%`, status: 'Rainfall receding', note: 'Conditions begin stabilizing' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            TRENDS & FORECAST
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Risk Over Time
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How risk is changing and what we expect over the next few hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Select Area:</span>
          <select
            value={selectedZone.id}
            onChange={(e) => selectZoneById(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-none"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} — {z.riskScore}% Risk
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-xl border p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 ${
          isIncreasing ? 'border-red-200 bg-red-50/60' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-black">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 font-mono">
              TREND STATUS
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Risk in {selectedZone.name} is {isIncreasing ? 'increasing' : 'stable'} ({selectedZone.previousRiskScore}% → {selectedZone.riskScore}%).
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Heavy continuous rain has saturated the soil, increasing the likelihood of slope failure.
            </p>
          </div>
        </div>
        <div className="font-mono text-xs font-bold text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-2xs">
          Change: +{delta}% over 2 hours
        </div>
      </div>

      {/* Clean Timeline Points as requested: Past, Now, Next 1 Hour, Next 3 Hours, Next 6 Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {timelinePoints.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-sm"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
              {item.label}
            </span>
            <p className="text-2xl font-bold font-mono text-red-600">{item.risk}</p>
            <p className="text-xs font-bold text-slate-800">{item.status}</p>
            <p className="text-[11px] text-slate-500 leading-snug">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskEvolutionChart data={selectedZone.forecast} zoneName={selectedZone.name} />
        <RainfallSoilChart data={selectedZone.forecast} />
      </div>
    </div>
  );
};
