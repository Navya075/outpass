import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  LifeBuoy,
  Clock,
  Sparkles,
  RotateCcw,
  CheckCheck,
  CheckCircle2,
} from 'lucide-react';

interface GoBagItem {
  id: string;
  name: string;
  description: string;
}

export const CitizenSafetyGuide: React.FC = () => {
  const defaultGoBagItems: GoBagItem[] = [
    { id: 'water', name: 'Water', description: 'Clean drinking water bottles (at least 2 litres per person)' },
    { id: 'food', name: 'Food', description: 'Non-perishable snacks, biscuits, dry fruits, and energy bars' },
    { id: 'flashlight', name: 'Flashlight', description: 'Bright torch or headlamp with spare batteries' },
    { id: 'firstaid', name: 'First Aid', description: 'Bandages, antiseptic liquid, cotton gauze, and pain relief' },
    { id: 'medicines', name: 'Medicines', description: 'Daily prescription medicines (minimum 7-day supply)' },
    { id: 'documents', name: 'Important Documents', description: 'Aadhaar, IDs, ration card, and bank papers in waterproof pouch' },
    { id: 'powerbank', name: 'Phone & Power Bank', description: 'Fully charged mobile phone, power bank, and charging cables' },
  ];

  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({
    water: true,
    flashlight: true,
    firstaid: true,
    powerbank: true,
  });

  const toggleItem = (id: string) => {
    setPackedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePackAll = () => {
    const allPacked: Record<string, boolean> = {};
    defaultGoBagItems.forEach((item) => {
      allPacked[item.id] = true;
    });
    setPackedItems(allPacked);
  };

  const handleReset = () => {
    setPackedItems({});
  };

  const totalItems = defaultGoBagItems.length;
  const packedCount = Object.values(packedItems).filter(Boolean).length;
  const progressPct = Math.round((packedCount / totalItems) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            PRACTICAL & EASY TO FOLLOW
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Safety Guide & Go-Bag
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Essential steps to protect yourself and your family before, during, and after a landslide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs shadow-2xs">
            <span className="text-slate-500 font-medium">Go-Bag Status: </span>
            <strong className="text-emerald-700 font-bold font-mono">
              {packedCount} of {totalItems} Packed ({progressPct}%)
            </strong>
          </div>
        </div>
      </div>

      {/* Three Clear Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. BEFORE A LANDSLIDE */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                PHASE 1 • PREPARATION
              </span>
              <ShieldCheck className="h-4 w-4 text-blue-700" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">
              Before a Landslide
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Keep phone charged</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Keep your mobile phone fully charged and make sure your power bank is ready in case power lines are affected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Pack medicines & important documents</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Place daily medications, Aadhaar cards, property documents, and emergency cash inside a waterproof bag.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Know nearest safe shelter</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Identify your nearest designated safe shelter (St. Joseph Camp, 2.8 km) and check safe walking paths in advance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider block">
              ACTION: Prepare before heavy rain peaks
            </span>
          </div>
        </div>

        {/* 2. DURING A LANDSLIDE */}
        <div className="rounded-xl border border-red-200 bg-red-50/30 p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-red-100 pb-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                PHASE 2 • IMMEDIATE ACTION
              </span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">
              During a Landslide
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-red-100 text-red-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Move away from steep slopes</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Move immediately towards stable, higher ground away from steep hill cuts, mud channels, and natural gullies.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-red-100 text-red-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Follow official evacuation instructions</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    When district authorities or ward leaders advise evacuation, leave without hesitation. Do not delay to save belongings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-red-100 text-red-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Do not cross blocked roads or streams</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Never walk or drive across flooded culverts or muddy streams. Water depth and sudden mud surges are deceptive and fast.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-red-100">
            <span className="text-[10px] text-red-700 font-semibold uppercase tracking-wider block">
              ACTION: Protect lives first
            </span>
          </div>
        </div>

        {/* 3. AFTER A LANDSLIDE */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                PHASE 3 • RECOVERY
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">
              After a Landslide
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Stay away from damaged areas</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Secondary landslides can happen hours or days after the first failure. Do not inspect or re-enter slide zones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Follow official updates</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Check LANDSAFE or listen to local ward officers before returning home or using previously closed roads.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call emergency services if someone needs help</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Dial 112 (Police) or 108 (Ambulance) if anyone in your community is injured, trapped, or unaccounted for.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider block">
              ACTION: Await official clearance
            </span>
          </div>
        </div>
      </div>

      {/* Simple Go-Bag Checklist */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-emerald-600" />
              <span>Emergency Go-Bag Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep these 7 items packed in a sturdy bag near your front door for rapid evacuation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePackAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Pack All</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">
              Packing Progress: <strong className="text-slate-900">{packedCount} of {totalItems} items ready</strong>
            </span>
            <span className="text-emerald-700 font-mono font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 7 Go-Bag Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {defaultGoBagItems.map((item) => {
            const isChecked = !!packedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="mt-0.5">
                  {isChecked ? (
                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isChecked ? 'text-emerald-900' : 'text-slate-900'}`}>
                      {item.name}
                    </span>
                    {isChecked && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        PACKED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
