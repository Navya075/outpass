import React from 'react';
import { MOCK_ROADS } from '../../data/mockResources';
import { DisasterMap } from '../map/DisasterMap';
import { Compass, Route, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RoadAccessibility: React.FC = () => {
  const getSimpleRoadStatus = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'partially_blocked':
        return { label: 'Caution', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'blocked':
        return { label: 'Blocked', color: 'bg-red-50 text-red-700 border-red-200 font-bold' };
      default:
        return { label: 'Open', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roadList = [
    {
      road: 'Meppadi Road',
      status: 'Blocked',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
      alternative: 'Use Route B (High Ridge Pass)',
      details: 'Fallen trees and mud on lower bend. Impassable for four-wheelers.',
    },
    {
      road: 'Chooralmala Bridge Approach',
      status: 'Blocked',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
      alternative: 'Use Pedestrian Suspension Walkway or St. Joseph Ridge',
      details: 'River approach washed away by debris dam surge. 30-meter chasm.',
    },
    {
      road: 'Kalpetta - Meppadi Main Highway',
      status: 'Caution',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      alternative: 'Drive slowly on single lane bypass',
      details: 'Single lane open; debris clearing ongoing by PWD excavator.',
    },
    {
      road: 'Mundakkai Access Road',
      status: 'Caution',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      alternative: 'Follow marked emergency orange cones',
      details: 'Water flowing across culvert at KM 3. Light vehicles permitted with care.',
    },
    {
      road: 'Vythiri - Kalpetta Corridor',
      status: 'Open',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      alternative: 'Direct clear transit route',
      details: 'Fully open for emergency and relief vehicles.',
    },
    {
      road: 'Sultan Bathery Regional Arterial',
      status: 'Open',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      alternative: 'Direct clear transit route',
      details: 'Clear with full lane capacity.',
    },
  ];

  const blockedCount = roadList.filter((r) => r.status === 'Blocked').length;
  const cautionCount = roadList.filter((r) => r.status === 'Caution').length;
  const openCount = roadList.filter((r) => r.status === 'Open').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            TRANSPORTATION NETWORK
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Road Status
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Which routes are open, need caution, or are blocked, with safe alternatives.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200 font-bold">
            {openCount} Open
          </span>
          <span className="rounded-lg bg-amber-50 px-3 py-1 text-amber-800 border border-amber-200 font-bold">
            {cautionCount} Caution
          </span>
          <span className="rounded-lg bg-red-50 px-3 py-1 text-red-700 border border-red-200 font-bold">
            {blockedCount} Blocked
          </span>
        </div>
      </div>

      {/* Map displaying road corridors */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Road Map
        </h3>
        <DisasterMap heightClass="h-[360px] sm:h-[400px]" />
      </div>

      {/* Road Status Table as specified: ROAD, STATUS, ALTERNATIVE */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
          Road Corridors & Alternative Detours
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">ROAD</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4">ALTERNATIVE</th>
                <th className="py-3 px-4">NOTES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {roadList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {item.road}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded border uppercase font-mono ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-blue-700">
                      <Compass className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                      <span>{item.alternative}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {item.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
