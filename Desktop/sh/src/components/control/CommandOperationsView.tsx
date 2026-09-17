import React, { useState } from 'react';
import { MOCK_MISSIONS, MOCK_RESCUE_TEAMS, MOCK_VEHICLES } from '../../data/mockMissions';
import { MOCK_SHELTERS, MOCK_ROADS, MOCK_EQUIPMENT } from '../../data/mockResources';
import {
  Workflow,
  Users,
  Truck,
  Home,
  Route,
  Package,
} from 'lucide-react';

export const CommandOperationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operations' | 'teams' | 'vehicles' | 'shelters' | 'roads' | 'supplies'>('operations');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            FIELD RESOURCE DEPLOYMENTS
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Operations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track active operations, teams, vehicles, shelters, roads, and supplies.
          </p>
        </div>

        {/* 4 Core Questions Answered Callout */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-2.5 text-xs text-blue-900 shadow-2xs font-medium">
          <span>WHO IS RESPONDING? • WHERE ARE THEY? • WHAT ARE THEY DOING? • WHAT RESOURCES ARE NEEDED?</span>
        </div>
      </div>

      {/* Tabs as specified: Active Operations, Teams, Vehicles, Shelters, Roads, Supplies */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'operations', label: 'Active Operations', icon: Workflow, count: MOCK_MISSIONS.length },
          { key: 'teams', label: 'Teams', icon: Users, count: MOCK_RESCUE_TEAMS.length },
          { key: 'vehicles', label: 'Vehicles', icon: Truck, count: MOCK_VEHICLES.length },
          { key: 'shelters', label: 'Shelters', icon: Home, count: MOCK_SHELTERS.length },
          { key: 'roads', label: 'Roads', icon: Route, count: MOCK_ROADS.length },
          { key: 'supplies', label: 'Supplies', icon: Package, count: MOCK_EQUIPMENT.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Active Operations — Clear Answers */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_MISSIONS.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{m.objective}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Location: <strong className="text-slate-800">{m.locationName}</strong></p>
                </div>
                <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase font-mono">
                  {m.status.replace('_', ' ')}
                </span>
              </div>

              {/* 4 Answers */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">WHO IS RESPONDING?</span>
                  <strong className="text-blue-700">{m.assignedTeamName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">WHERE ARE THEY?</span>
                  <strong className="text-slate-800">{m.locationName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">WHAT ARE THEY DOING?</span>
                  <strong className="text-slate-800">Evacuating ({m.evacuatedCount} / {m.targetEvacuees})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">RESOURCES NEEDED:</span>
                  <strong className="text-slate-800">{m.assignedVehicles.join(', ')}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Evacuation Progress:</span>
                  <span className="text-emerald-700 font-mono font-bold">{m.progressPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${m.progressPct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Teams */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_RESCUE_TEAMS.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase font-mono">
                  {t.status}
                </span>
              </div>
              <p className="text-slate-500">{t.agency}</p>
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div>Members: <strong className="text-slate-800">{t.memberCount} personnel</strong></div>
                <div>Base: <strong className="text-slate-800">{t.baseLocation}</strong></div>
                <div>Vehicle: <strong className="text-slate-800">{t.assignedVehicle}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Vehicles */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_VEHICLES.map((v) => (
            <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-sm">{v.type}</h4>
                <span className="rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold font-mono">
                  {v.status}
                </span>
              </div>
              <p className="font-mono text-slate-600">Reg: {v.regNumber} • Fuel: {v.fuelLevelPct}%</p>
              <p className="text-slate-500">Assigned: {v.assignedTo || 'Unassigned'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Shelters */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_SHELTERS.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold font-mono">
                  {s.availableBeds} Free
                </span>
              </div>
              <p className="text-slate-500">{s.location}</p>
              <div className="pt-2 border-t border-slate-100">
                <span>Occupancy: <strong>{s.currentOccupancy} / {s.capacityTotal}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Roads */}
      {activeTab === 'roads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ROADS.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900 text-sm">{r.roadName}</h4>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase border font-mono ${
                    r.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-slate-600">{r.hazardCause}</p>
              {r.alternativeRouteName && (
                <p className="text-blue-700 font-semibold">Alternative: {r.alternativeRouteName}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Supplies */}
      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_EQUIPMENT.map((eq) => (
            <div key={eq.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-sm text-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900">{eq.name}</h4>
                <span className="text-[10px] font-bold font-mono text-slate-500">{eq.category}</span>
              </div>
              <p className="font-semibold text-slate-800">
                Available: {eq.availableQuantity} / {eq.totalQuantity} {eq.unit}
              </p>
              <p className="text-slate-500 text-[11px]">Location: {eq.depotLocation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
