import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md text-xs text-slate-700">
      <div className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-2 flex items-center justify-between">
        <span>Map Legend</span>
        <span className="text-slate-400 font-medium text-[11px]">Risk & Facilities</span>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 font-medium mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-600 animate-pulse shadow-sm" />
          <span className="text-red-700 font-bold">🔴 High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
          <span className="text-slate-700">🟠 Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-700">🟢 Safe</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span>👥</span>
          <span>Rescue Team</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🏠</span>
          <span>Shelter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🚧</span>
          <span>Blocked Road</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>📍</span>
          <span>Incident / Target</span>
        </div>
      </div>
    </div>
  );
};
