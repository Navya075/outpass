import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { DisasterMap } from '../map/DisasterMap';
import { MetricCard } from '../common/MetricCard';
import { RiskEvolutionChart } from '../charts/RiskEvolutionChart';
import { ImpactBreakdownChart } from '../charts/ImpactBreakdownChart';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { HazardZone } from '../../types/hazard';
import {
  Radio,
  Flame,
  Users,
  AlertTriangle,
  ShieldAlert,
  Route,
  Home,
  ArrowRight,
  Send,
  Building2,
  Workflow,
  Compass,
} from 'lucide-react';

interface ControlOverviewProps {
  onNavigate: (tabId: string) => void;
  onSelectZone: (zone: HazardZone) => void;
}

export const ControlOverview: React.FC<ControlOverviewProps> = ({
  onNavigate,
  onSelectZone,
}) => {
  const { zones, selectedZone, setSelectedZone } = useHazard();

  const urgentHelpLocations = [
    {
      location: 'Meppadi',
      risk: 'HIGH',
      peopleAtRisk: '2,340',
      responseNeeded: 'Evacuation Team',
      status: 'Waiting',
      statusVariant: 'waiting',
      zoneId: 'zone-1',
    },
    {
      location: 'Chooralmala',
      risk: 'CRITICAL',
      peopleAtRisk: '1,820',
      responseNeeded: 'Boat & Rope Rescue',
      status: 'Team En Route',
      statusVariant: 'en_route',
      zoneId: 'zone-2',
    },
    {
      location: 'Mundakkai',
      risk: 'HIGH',
      peopleAtRisk: '1,450',
      responseNeeded: 'Medical Support',
      status: 'Assigned',
      statusVariant: 'assigned',
      zoneId: 'zone-3',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm text-white font-black">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Emergency Control Center
              </h1>
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-red-700 border border-red-200">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                DISTRICT COMMAND
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Wayanad District Emergency Operations Center (DEOC) • Real-time situation and resource coordination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('control-alertcenter')}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Top 6 Metrics as specified */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="CRITICAL AREAS"
          value="6"
          variant="critical"
          subtitle="Immediate action needed"
          icon={Flame}
        />
        <MetricCard
          label="PEOPLE AT RISK"
          value="12,450"
          variant="warning"
          subtitle="In danger sectors"
          icon={Users}
        />
        <MetricCard
          label="ACTIVE ALERTS"
          value="8"
          variant="critical"
          subtitle="Warnings issued"
          icon={AlertTriangle}
        />
        <MetricCard
          label="TEAMS DEPLOYED"
          value="18"
          variant="success"
          subtitle="NDRF & SDRF units"
          icon={ShieldAlert}
        />
        <MetricCard
          label="ROADS BLOCKED"
          value="23"
          variant="critical"
          subtitle="Routes impassable"
          icon={Route}
        />
        <MetricCard
          label="SHELTERS OPEN"
          value="12"
          variant="teal"
          subtitle="3,400 beds available"
          icon={Home}
        />
      </div>

      {/* Current Situation Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white font-bold">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Current Situation Overview
            </h4>
            <p className="text-xs text-amber-950 mt-0.5">
              Heavy continuous monsoon downpour (142 mm). Ground in Meppadi and Chooralmala is heavily saturated. 6 sectors have entered high risk.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('control-priority')}
          className="rounded-lg bg-white border border-amber-300 hover:bg-amber-100/60 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-2xs transition-colors"
        >
          View Response Priorities →
        </button>
      </div>

      {/* Main Section: Regional Risk Map + Urgent Response Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Regional Risk Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Regional Risk Map</span>
            </h3>
            <button
              onClick={() => onNavigate('control-map')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Map & Filters</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <DisasterMap
            onSelectZone={(zone) => {
              setSelectedZone(zone);
              onSelectZone(zone);
            }}
            selectedZoneId={selectedZone.id}
            heightClass="h-[460px]"
          />
        </div>

        {/* Right 1 Col: Where Help Is Needed Most */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Where Help Is Needed Most
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Top urgent response locations</p>
              </div>
              <button
                onClick={() => onNavigate('control-priority')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentHelpLocations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.location}</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-mono">
                      {item.risk} RISK
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>People at risk: <strong className="text-slate-900">{item.peopleAtRisk}</strong></span>
                    <span className="text-blue-700 font-medium">{item.responseNeeded}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Status: <strong className="text-slate-800">{item.status}</strong></span>
                    <button
                      onClick={() => onNavigate('control-ops')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Send Team</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts Teaser */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>Active Alerts</span>
              </h4>
              <button
                onClick={() => onNavigate('control-alertcenter')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Manage ({MOCK_ALERTS.length}) →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {MOCK_ALERTS.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{alert.headline}</span>
                    <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Columns: People & Places at Risk & Risk Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People & Places at Risk Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-700" />
                <span>People & Places at Risk</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Overview of exposure across the district</p>
            </div>
            <button
              onClick={() => onNavigate('control-impact')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Full Details →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-red-600 block">12,450</span>
              <span className="text-slate-500 text-[11px]">People at Risk</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-900 block">520</span>
              <span className="text-slate-500 text-[11px]">Homes</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-900 block">4</span>
              <span className="text-slate-500 text-[11px]">Schools</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-900 block">2</span>
              <span className="text-slate-500 text-[11px]">Hospitals</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-900 block">3</span>
              <span className="text-slate-500 text-[11px]">Bridges</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <span className="text-xl font-bold font-mono text-slate-900 block">6</span>
              <span className="text-slate-500 text-[11px]">Roads Blocked</span>
            </div>
          </div>
        </div>

        {/* Risk Over Time Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Risk Over Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">How risk is changing over the next few hours ({selectedZone.name})</p>
            </div>
            <button
              onClick={() => onNavigate('control-evolution')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Hourly Timeline →
            </button>
          </div>

          <RiskEvolutionChart data={selectedZone.forecast} zoneName={selectedZone.name} />
        </div>
      </div>
    </div>
  );
};
