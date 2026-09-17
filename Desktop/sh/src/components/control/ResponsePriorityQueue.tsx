import React, { useState } from 'react';
import { useHazard } from '../../context/HazardContext';
import { HazardZone } from '../../types/hazard';
import { Flame, ShieldAlert, Send, Plus, MapPin, Navigation } from 'lucide-react';

interface ResponsePriorityQueueProps {
  onNavigate: (tabId: string) => void;
}

export const ResponsePriorityQueue: React.FC<ResponsePriorityQueueProps> = ({ onNavigate }) => {
  const { zones, setSelectedZone } = useHazard();
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const priorityItems = [
    {
      zone: zones[0] || { id: 'zone-1', name: 'Meppadi' },
      location: 'Meppadi',
      risk: 'HIGH',
      riskColor: 'text-red-600',
      peopleAtRisk: '2,340',
      responseNeeded: 'Evacuation Team',
      status: 'Waiting',
      statusColor: 'bg-red-50 text-red-700 border-red-200 font-bold',
      priority: 'Urgent',
    },
    {
      zone: zones[1] || { id: 'zone-2', name: 'Chooralmala' },
      location: 'Chooralmala',
      risk: 'HIGH',
      riskColor: 'text-red-600',
      peopleAtRisk: '1,820',
      responseNeeded: 'Rope & Boat Rescue',
      status: 'Team En Route',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      priority: 'Urgent',
    },
    {
      zone: zones[2] || { id: 'zone-3', name: 'Mundakkai' },
      location: 'Mundakkai',
      risk: 'MODERATE',
      riskColor: 'text-amber-600',
      peopleAtRisk: '1,450',
      responseNeeded: 'Medical & Transport',
      status: 'Assigned',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-200',
      priority: 'High',
    },
    {
      zone: zones[3] || { id: 'zone-4', name: 'Attamala' },
      location: 'Attamala',
      risk: 'MODERATE',
      riskColor: 'text-amber-600',
      peopleAtRisk: '840',
      responseNeeded: 'Pre-positioning Supplies',
      status: 'Assigned',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-200',
      priority: 'High',
    },
    {
      zone: zones[4] || { id: 'zone-5', name: 'Vellarimala' },
      location: 'Vellarimala',
      risk: 'LOW',
      riskColor: 'text-emerald-700',
      peopleAtRisk: '620',
      responseNeeded: 'Active Monitoring',
      status: 'Standing By',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      priority: 'Normal',
    },
  ];

  const filteredItems = priorityItems.filter((item) => {
    if (filterPriority === 'urgent') return item.priority === 'Urgent';
    if (filterPriority === 'high') return item.priority === 'High' || item.priority === 'Urgent';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            COMMAND RESPONSE DISPATCH
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Where Help Is Needed Most
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Locations ranked by urgency so command knows where to dispatch teams and resources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none"
          >
            <option value="all">All Priorities ({priorityItems.length})</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High & Urgent</option>
          </select>
        </div>
      </div>

      {/* Main Table — LOCATION, RISK, PEOPLE AT RISK, RESPONSE NEEDED, STATUS */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">LOCATION</th>
                <th className="py-3.5 px-3">RISK</th>
                <th className="py-3.5 px-3">PEOPLE AT RISK</th>
                <th className="py-3.5 px-4">RESPONSE NEEDED</th>
                <th className="py-3.5 px-3">STATUS</th>
                <th className="py-3.5 px-3">PRIORITY</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredItems.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.priority === 'Urgent'
                      ? 'bg-red-50/40 hover:bg-red-50/70'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {row.location}
                  </td>

                  <td className="py-3.5 px-3 font-bold font-mono">
                    <span className={row.riskColor}>{row.risk}</span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {row.peopleAtRisk}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {row.responseNeeded}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded border uppercase font-mono ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        row.priority === 'Urgent'
                          ? 'bg-red-600 text-white'
                          : row.priority === 'High'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>

                  {/* 3 Required Buttons: Send Team, View Location, Assign Mission */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onNavigate('control-ops')}
                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-colors"
                      >
                        Send Team
                      </button>

                      <button
                        onClick={() => {
                          setSelectedZone(row.zone as any);
                          onNavigate('control-map');
                        }}
                        className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-2 py-1 text-[11px] font-medium shadow-2xs transition-colors"
                      >
                        View Location
                      </button>

                      <button
                        onClick={() => onNavigate('control-ops')}
                        className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-blue-700 px-2 py-1 text-[11px] font-semibold shadow-2xs transition-colors"
                      >
                        Assign Mission
                      </button>
                    </div>
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
