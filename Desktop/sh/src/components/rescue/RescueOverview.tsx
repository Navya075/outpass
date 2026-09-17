import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { DisasterMap } from '../map/DisasterMap';
import { RiskBadge } from '../common/RiskBadge';
import { MetricCard } from '../common/MetricCard';
import { MOCK_MISSIONS, MOCK_RESCUE_TEAMS } from '../../data/mockMissions';
import { MOCK_ROADS } from '../../data/mockResources';
import { HazardZone } from '../../types/hazard';
import {
  ShieldAlert,
  Users,
  Workflow,
  Route,
  Flame,
  ArrowRight,
  Plus,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface RescueOverviewProps {
  onNavigate: (tabId: string) => void;
  onSelectZoneForMission: (zone: HazardZone) => void;
}

export const RescueOverview: React.FC<RescueOverviewProps> = ({
  onNavigate,
  onSelectZoneForMission,
}) => {
  const { zones, selectedZone, setSelectedZone } = useHazard();

  const priorityZones = [
    {
      name: 'Meppadi',
      risk: 'HIGH',
      riskScore: 82,
      peopleAtRisk: '420 people',
      timeToAct: '~1 hour',
      roadStatus: 'Blocked',
      roadVariant: 'blocked',
      priority: 'URGENT',
      priorityVariant: 'critical' as const,
    },
    {
      name: 'Chooralmala',
      risk: 'HIGH',
      riskScore: 88,
      peopleAtRisk: '680 people',
      timeToAct: '~40 mins',
      roadStatus: 'Blocked',
      roadVariant: 'blocked',
      priority: 'URGENT',
      priorityVariant: 'critical' as const,
    },
    {
      name: 'Mundakkai',
      risk: 'MODERATE',
      riskScore: 68,
      peopleAtRisk: '310 people',
      timeToAct: '~3 hours',
      roadStatus: 'Caution',
      roadVariant: 'caution',
      priority: 'HIGH',
      priorityVariant: 'warning' as const,
    },
    {
      name: 'Attamala',
      risk: 'MODERATE',
      riskScore: 64,
      peopleAtRisk: '250 people',
      timeToAct: '~4 hours',
      roadStatus: 'Open',
      roadVariant: 'open',
      priority: 'NORMAL',
      priorityVariant: 'default' as const,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            FIELD OPERATIONS COMMAND
          </span>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Rescue Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Where to respond, active missions, and available teams across Wayanad.
          </p>
        </div>

        <button
          onClick={() => onNavigate('rescue-missions')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Assign New Mission</span>
        </button>
      </div>

      {/* Top 5 Metrics as specified */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="HIGH-RISK AREAS"
          value="12"
          variant="critical"
          subtitle="Areas needing attention"
          icon={Flame}
        />
        <MetricCard
          label="PEOPLE NEEDING HELP"
          value="2,340"
          variant="warning"
          subtitle="In danger zones"
          icon={Users}
        />
        <MetricCard
          label="ACTIVE MISSIONS"
          value="8"
          variant="teal"
          subtitle="Teams deployed"
          icon={Workflow}
        />
        <MetricCard
          label="TEAMS AVAILABLE"
          value="5"
          variant="success"
          subtitle="Ready to deploy"
          icon={ShieldAlert}
        />
        <MetricCard
          label="ROADS BLOCKED"
          value="6"
          variant="critical"
          subtitle="Routes impassable"
          icon={Route}
        />
      </div>

      {/* Main Operational Area: Live Map + Priority Alert Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Risk Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>Live Risk Map</span>
            </h3>
            <button
              onClick={() => onNavigate('rescue-map')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Open Full Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <DisasterMap
            onSelectZone={(zone) => setSelectedZone(zone)}
            selectedZoneId={selectedZone.id}
            heightClass="h-[440px]"
          />
        </div>

        {/* Right 1 Col: Urgent Operational Alerts & Target */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>Urgent Rescue Alerts</span>
              </h4>
              <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-700 uppercase text-[10px] tracking-wider">
                    LANDSLIDE WARNING
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">10 min ago</span>
                </div>
                <h5 className="font-bold text-slate-900">Meppadi — Ward 4</h5>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Residents in the area may need evacuation. Heavy rain continues on steep slopes.
                </p>
                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-red-800">
                    ACTION: Send an available rescue team.
                  </span>
                  <button
                    onClick={() => onNavigate('rescue-missions')}
                    className="rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1 text-[11px] font-bold text-white shadow-2xs transition-colors"
                  >
                    Dispatch Team
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 uppercase text-[10px] tracking-wider">
                    ROAD BLOCKED
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">25 min ago</span>
                </div>
                <h5 className="font-bold text-slate-900">Chooralmala Bridge Approach</h5>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bridge approach washed out. Road impassable for heavy vehicles.
                </p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-800">
                    ACTION: Use high-ground ridge bypass.
                  </span>
                  <button
                    onClick={() => onNavigate('rescue-roads')}
                    className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs"
                  >
                    View Detour
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('rescue-alerts')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>View All Rescue Alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2 Columns: Priority Locations Table & Active Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Locations */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-600" />
                <span>Priority Locations</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Where help is needed first</p>
            </div>
            <button
              onClick={() => onNavigate('rescue-priority')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All Locations →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">LOCATION</th>
                  <th className="py-2.5 px-2">RISK</th>
                  <th className="py-2.5 px-2">PEOPLE AT RISK</th>
                  <th className="py-2.5 px-2">TIME TO ACT</th>
                  <th className="py-2.5 px-2">ROAD STATUS</th>
                  <th className="py-2.5 px-3 text-right">PRIORITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {priorityZones.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${row.risk === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-700">{row.peopleAtRisk}</td>
                    <td className="py-3 px-2 font-mono text-amber-700 font-bold">{row.timeToAct}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          row.roadVariant === 'blocked'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : row.roadVariant === 'caution'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {row.roadStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Missions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Workflow className="h-4 w-4 text-teal-600" />
                <span>Active Missions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Current field assignments and progress</p>
            </div>
            <button
              onClick={() => onNavigate('rescue-missions')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Manage Missions →
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                mission: 'Evacuate residents',
                location: 'Meppadi Ward 4',
                team: 'Team Alpha (SDRF)',
                status: 'On the Way',
                statusVariant: 'blue',
                priority: 'Urgent',
                evacuated: '142 of 250 people',
                progress: 57,
              },
              {
                mission: 'River rescue & patrol',
                location: 'Chooralmala Riverbank',
                team: 'Team Bravo (NDRF)',
                status: 'At Location',
                statusVariant: 'amber',
                priority: 'Urgent',
                evacuated: '88 of 120 people',
                progress: 73,
              },
              {
                mission: 'Shelter transport',
                location: 'Mundakkai East',
                team: 'Team Charlie (Fire & Rescue)',
                status: 'Helping Residents',
                statusVariant: 'emerald',
                priority: 'High',
                evacuated: '64 of 80 people',
                progress: 80,
              },
            ].map((m, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.mission}</h4>
                    <p className="text-[11px] text-slate-500">{m.location} • <strong className="text-slate-700">{m.team}</strong></p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                      {m.priority}
                    </span>
                    <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700 font-mono">
                      {m.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Progress:</span>
                    <span className="text-emerald-700 font-mono font-bold">{m.evacuated} ({m.progress}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
