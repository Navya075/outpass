import React from 'react';
import { useHazard, MapLayerConfig } from '../../context/HazardContext';
import { Mountain, Droplets, Radar, Route, Home, ShieldAlert } from 'lucide-react';

export const LayerControls: React.FC = () => {
  const { layers, toggleLayer } = useHazard();

  const layerItems: { key: keyof MapLayerConfig; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'landslide', label: 'Landslides', icon: Mountain },
    { key: 'flood', label: 'Floods', icon: Droplets },
    { key: 'roads', label: 'Roads & Blockages', icon: Route },
    { key: 'shelters', label: 'Shelters', icon: Home },
    { key: 'teams', label: 'Rescue Teams', icon: ShieldAlert },
    { key: 'radar', label: 'Rainfall Radar', icon: Radar },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs text-xs">
      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2 flex items-center justify-between font-mono">
        <span>Map Options</span>
        <span className="text-slate-400 font-sans font-medium text-[11px]">Show / Hide</span>
      </div>

      <div className="space-y-1">
        {layerItems.map((item) => {
          const Icon = item.icon;
          const isEnabled = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                isEnabled
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${isEnabled ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  isEnabled ? 'bg-blue-700' : 'bg-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
