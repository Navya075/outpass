import React from 'react';
import { MOCK_SHELTERS } from '../../data/mockResources';
import { Truck, HeartPulse, Home, Package, Droplets, Shield, Utensils } from 'lucide-react';

export const ResourceTracker: React.FC = () => {
  const totalShelterBeds = MOCK_SHELTERS.reduce((acc, s) => acc + s.capacityTotal, 0);
  const totalOccupiedBeds = MOCK_SHELTERS.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvailableBeds = MOCK_SHELTERS.reduce((acc, s) => acc + s.availableBeds, 0);

  const keyResources = [
    {
      category: 'Vehicles Available',
      name: 'All-Terrain 4WD & Troop Carriers',
      count: '9 ready to deploy',
      indicator: 'Available' as const,
      icon: Truck,
      details: '4 units stationed at Kalpetta, 3 at Meppadi, 2 at Vythiri',
    },
    {
      category: 'Medical Kits',
      name: 'First Aid & Trauma Medical Kits',
      count: '42 kits remaining',
      indicator: 'Available' as const,
      icon: HeartPulse,
      details: 'Stocked with bandages, burn dressings, splints, and saline',
    },
    {
      category: 'Food Supplies',
      name: 'Non-perishable Emergency Rations',
      count: '1,200 meal packs (Low in Meppadi)',
      indicator: 'Low' as const,
      icon: Utensils,
      details: 'High-energy biscuits, ready-to-eat porridge, glucose packs',
    },
    {
      category: 'Water',
      name: 'Packaged Drinking Water (20L Cans)',
      count: '380 cans remaining',
      indicator: 'Low' as const,
      icon: Droplets,
      details: 'Additional supply tanker arriving from Kalpetta within 2h',
    },
    {
      category: 'Emergency Equipment',
      name: 'Ropes, Flashlights, Hydraulic Cutters',
      count: '14 sets deployed, 6 available',
      indicator: 'Available' as const,
      icon: Shield,
      details: 'High-angle rescue kits, debris shovels, high-lumen headlamps',
    },
    {
      category: 'Emergency Equipment',
      name: 'Inflatable Rescue Boats (Zodiac)',
      count: '2 boats in use, 1 spare (Critical)',
      indicator: 'Critical' as const,
      icon: Package,
      details: 'Request for 2 additional boats dispatched to NDRF Kozhikode',
    },
  ];

  const getIndicatorBadge = (indicator: 'Available' | 'Low' | 'Critical') => {
    switch (indicator) {
      case 'Available':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            Available
          </span>
        );
      case 'Low':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            Low
          </span>
        );
      case 'Critical':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono animate-pulse">
            Critical
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            SUPPLIES & CAPACITY
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Resources
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Available vehicles, medical kits, food, water, emergency gear, and shelter capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs shadow-2xs">
            <span className="text-slate-500">Shelter Capacity:</span>{' '}
            <strong className="text-emerald-700 font-mono font-bold">
              {totalAvailableBeds} Beds Free ({totalOccupiedBeds} / {totalShelterBeds} Occupied)
            </strong>
          </div>
        </div>
      </div>

      {/* Key Resources Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Essential Response Supplies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyResources.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    </div>
                  </div>
                  {getIndicatorBadge(item.indicator)}
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800">{item.count}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelter Capacity Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-600" />
              <span>Shelter Capacity</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Occupancy and remaining free beds at designated relief centers</p>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {totalAvailableBeds} Free Beds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_SHELTERS.map((shelter) => {
            const pct = Math.round((shelter.currentOccupancy / shelter.capacityTotal) * 100);
            const isNearFull = pct >= 85;

            return (
              <div key={shelter.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{shelter.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{shelter.location}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      isNearFull
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {isNearFull ? 'Near Full' : 'Open'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Occupancy:</span>
                    <span className="text-slate-900 font-bold">
                      {shelter.currentOccupancy} / {shelter.capacityTotal} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isNearFull ? 'bg-red-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-600">
                  <span>Free Beds: <strong className="text-emerald-700">{shelter.availableBeds}</strong></span>
                  <span>Supplies: <strong className="text-slate-800">{shelter.suppliesStatus}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
