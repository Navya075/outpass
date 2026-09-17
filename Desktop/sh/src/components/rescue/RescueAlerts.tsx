import React, { useState } from 'react';
import { RiskBadge } from '../common/RiskBadge';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, Navigation, MapPin } from 'lucide-react';

interface RescueAlertsProps {
  onNavigate: (tabId: string) => void;
}

export const RescueAlerts: React.FC<RescueAlertsProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'high'>('all');

  const operationalAlerts = [
    {
      id: 'res-alt-1',
      what: 'LANDSLIDE WARNING',
      where: 'Meppadi — Ward 4',
      description: 'Heavy rainfall has increased landslide risk. Soil is saturated and movement has been detected on the upper slope.',
      action: 'Send an available rescue team to assist residents with evacuation.',
      priority: 'URGENT',
      priorityVariant: 'critical' as const,
      timestamp: '10 mins ago',
    },
    {
      id: 'res-alt-2',
      what: 'ROAD BLOCKED',
      where: 'Chooralmala Bridge Approach',
      description: 'River approach washed away by debris dam surge. All vehicular crossing is blocked. 30-meter river gap.',
      action: 'Set up rope zip-line and divert vehicular units via High Ridge Pass.',
      priority: 'URGENT',
      priorityVariant: 'critical' as const,
      timestamp: '25 mins ago',
    },
    {
      id: 'res-alt-3',
      what: 'FLASH FLOOD ADVISORY',
      where: 'Iruvanjippuzha River Lower Bank',
      description: 'Upper mudflow is surging into the river. Water levels are rising rapidly along the tea estate banks.',
      action: 'Alert riverside families and position inflatable rescue boat unit on standby.',
      priority: 'HIGH',
      priorityVariant: 'warning' as const,
      timestamp: '40 mins ago',
    },
    {
      id: 'res-alt-4',
      what: 'POWER LINE DOWN',
      where: 'Mundakkai East Sector — KM 6',
      description: 'Transmission power line brought down by fallen tree. Road is partially blocked by branches.',
      action: 'Approach with caution. Electricity board repair crew has been requested.',
      priority: 'HIGH',
      priorityVariant: 'warning' as const,
      timestamp: '1 hour ago',
    },
  ];

  const filteredAlerts = operationalAlerts.filter((a) => {
    if (filter === 'urgent') return a.priority === 'URGENT';
    if (filter === 'high') return a.priority === 'HIGH' || a.priority === 'URGENT';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            OPERATIONAL DIRECTIVES
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Rescue Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immediate alerts answering what happened, where it happened, and what the team should do.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none"
          >
            <option value="all">All Alerts ({operationalAlerts.length})</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High & Urgent</option>
          </select>
        </div>
      </div>

      {/* Alert Feed — Each answering WHAT, WHERE, WHAT SHOULD THE TEAM DO? */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isUrgent = alert.priority === 'URGENT';
          return (
            <div
              key={alert.id}
              className={`rounded-xl border bg-white p-5 shadow-sm space-y-3 ${
                isUrgent
                  ? 'border-red-200 border-l-4 border-l-red-600'
                  : 'border-amber-200 border-l-4 border-l-amber-500'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      isUrgent ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {alert.priority}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{alert.what}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Formatted fields: WHAT, WHERE, WHAT SHOULD THE TEAM DO? */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    WHERE:
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    <span>{alert.where}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    SITUATION:
                  </span>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    "{alert.description}"
                  </p>
                </div>

                <div className="rounded-lg bg-red-50/70 border border-red-200 p-3 text-red-950">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
                    WHAT SHOULD THE TEAM DO?
                  </span>
                  <p className="text-xs font-bold mt-1">
                    {alert.action}
                  </p>
                </div>
              </div>

              {/* 3 Required Action Buttons: Dispatch Team, View Location, View Mission */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onNavigate('rescue-missions')}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Dispatch Team</span>
                </button>

                <button
                  onClick={() => onNavigate('rescue-map')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>View Location</span>
                </button>

                <button
                  onClick={() => onNavigate('rescue-missions')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                >
                  <Navigation className="h-3.5 w-3.5 text-blue-600" />
                  <span>View Mission</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
