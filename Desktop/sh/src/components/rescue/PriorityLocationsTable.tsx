import React, { useState } from 'react';
import { useHazard } from '../../context/HazardContext';
import { HazardZone } from '../../types/hazard';
import {
  Flame,
  Plus,
  Compass,
  MapPin,
  Clock,
  Users,
  Shield,
  ArrowUpDown,
} from 'lucide-react';

interface PriorityLocationsTableProps {
  onSelectZoneForMission: (zone: HazardZone) => void;
  onNavigate: (tabId: string) => void;
}

export const PriorityLocationsTable: React.FC<PriorityLocationsTableProps> = ({
  onSelectZoneForMission,
  onNavigate,
}) => {
  const { zones } = useHazard();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'leadtime' | 'people'>('risk');

  // Convert zones to simple operational rows
  const locationRows = zones.map((zone) => {
    const isUrgent = zone.actionableLeadTimeMinutes <= 90 || zone.riskScore >= 80;
    const isHigh = zone.riskScore >= 65 && zone.riskScore < 80;

    const priorityLabel = isUrgent ? 'URGENT' : isHigh ? 'HIGH' : 'NORMAL';
    const riskLabel = zone.riskScore >= 80 ? 'HIGH' : zone.riskScore >= 60 ? 'MODERATE' : 'LOW';

    const hours = Math.floor(zone.actionableLeadTimeMinutes / 60);
    const mins = zone.actionableLeadTimeMinutes % 60;
    const timeToAct = hours > 0 ? `~${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins}m` : ''}` : `~${mins} mins`;

    const roadStatus =
      zone.accessibilityStatus === 'Impassable'
        ? 'Blocked'
        : zone.accessibilityStatus === 'Poor'
        ? 'Caution'
        : 'Open';

    return {
      zone,
      name: zone.name,
      district: zone.district,
      risk: riskLabel,
      riskScore: zone.riskScore,
      peopleAtRisk: `${zone.exposure.totalPopulation.toLocaleString()} people`,
      totalPeopleNum: zone.exposure.totalPopulation,
      timeToAct,
      leadTimeMins: zone.actionableLeadTimeMinutes,
      roadStatus,
      priority: priorityLabel,
    };
  });

  const filteredRows = locationRows
    .filter((row) => {
      if (filterPriority === 'urgent') return row.priority === 'URGENT';
      if (filterPriority === 'high') return row.priority === 'HIGH' || row.priority === 'URGENT';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'leadtime') return a.leadTimeMins - b.leadTimeMins;
      if (sortBy === 'people') return b.totalPeopleNum - a.totalPeopleNum;
      return 0;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            WHERE TO RESPOND FIRST
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Priority Locations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ranked by urgency so teams know where to respond and evacuate first.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <span className="text-slate-500 px-2 font-semibold">Sort By:</span>
            <button
              onClick={() => setSortBy('risk')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                sortBy === 'risk' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risk
            </button>
            <button
              onClick={() => setSortBy('leadtime')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                sortBy === 'leadtime' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Time to Act
            </button>
            <button
              onClick={() => setSortBy('people')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                sortBy === 'people' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              People
            </button>
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Locations ({locationRows.length})</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High & Urgent</option>
          </select>
        </div>
      </div>

      {/* Main Operational Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-3">RISK</th>
                <th className="py-3 px-3">PEOPLE AT RISK</th>
                <th className="py-3 px-3">TIME TO ACT</th>
                <th className="py-3 px-3">ROAD STATUS</th>
                <th className="py-3 px-3">PRIORITY</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRows.map((row) => (
                <tr
                  key={row.zone.id}
                  className={`transition-colors ${
                    row.priority === 'URGENT'
                      ? 'bg-red-50/40 hover:bg-red-50/70'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="text-sm font-black text-slate-900">{row.name}</div>
                    <div className="text-[11px] text-slate-500">{row.district}, Wayanad</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`font-black ${
                        row.risk === 'HIGH' ? 'text-red-600' : row.risk === 'MODERATE' ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {row.risk} ({row.riskScore}%)
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-800 font-semibold">
                    {row.peopleAtRisk}
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-amber-700">
                    {row.timeToAct}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        row.roadStatus === 'Blocked'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : row.roadStatus === 'Caution'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {row.roadStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase font-mono ${
                        row.priority === 'URGENT'
                          ? 'bg-red-600 text-white'
                          : row.priority === 'HIGH'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {row.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        onSelectZoneForMission(row.zone);
                        onNavigate('rescue-missions');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Dispatch Team</span>
                    </button>
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
