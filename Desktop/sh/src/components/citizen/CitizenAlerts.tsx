import React, { useState } from 'react';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import {
  AlertTriangle,
  Navigation,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface CitizenAlertsProps {
  onNavigate: (tabId: string) => void;
}

export const CitizenAlerts: React.FC<CitizenAlertsProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'urgent'>('all');

  const alerts = [
    {
      id: 'alert-1',
      type: 'LANDSLIDE WARNING',
      severity: 'critical',
      summary: 'Heavy rain has increased landslide risk in your area.',
      where: 'Meppadi & Chooralmala',
      whatToDo: 'Stay away from steep slopes and be ready to evacuate.',
      time: '12 mins ago',
    },
    {
      id: 'alert-2',
      type: 'ROAD CLOSURE ALERT',
      severity: 'warning',
      summary: 'Mud and fallen rocks have blocked the lower road.',
      where: 'Chooralmala Bridge & Lower Ghat Road',
      whatToDo: 'Do not attempt to cross. Use the upper safe evacuation route toward St. Joseph Camp.',
      time: '35 mins ago',
    },
    {
      id: 'alert-3',
      type: 'FLASH FLOOD ADVISORY',
      severity: 'warning',
      summary: 'Streams and rivers are rising rapidly due to continuous rain.',
      where: 'Mundakkai Valley & Meppadi Riverbeds',
      whatToDo: 'Move away from low-lying riverbanks immediately to higher ground.',
      time: '1 hour ago',
    },
  ];

  const displayAlerts = filter === 'urgent'
    ? alerts.filter((a) => a.severity === 'critical')
    : alerts;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">
            COMMUNITY WARNINGS
          </span>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Alerts & Safety Notices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Important emergency warnings issued for your area
          </p>
        </div>

        {/* Simple Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'urgent'
                ? 'bg-white text-red-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urgent Only
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {displayAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm space-y-4 transition-all ${
                isCritical
                  ? 'border-red-200 border-l-4 border-l-red-600'
                  : 'border-amber-200 border-l-4 border-l-amber-500'
              }`}
            >
              {/* Top Warning Banner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isCritical ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <h2
                    className={`text-base sm:text-lg font-black tracking-tight ${
                      isCritical ? 'text-red-700' : 'text-amber-800'
                    }`}
                  >
                    {alert.type}
                  </h2>
                </div>
                <span className="text-xs font-medium text-slate-400 font-mono">
                  {alert.time}
                </span>
              </div>

              {/* WHAT HAPPENED */}
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {alert.summary}
              </p>

              {/* WHERE & WHAT TO DO */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-500 uppercase tracking-wider font-mono text-[10px] block">
                      WHERE:
                    </strong>
                    <span className="font-bold text-slate-800">{alert.where}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200/70">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-800 uppercase tracking-wider font-mono text-[10px] block">
                      WHAT TO DO:
                    </strong>
                    <span className="font-bold text-slate-800 leading-relaxed">
                      {alert.whatToDo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('citizen-evacuate')}
                  className="flex items-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Navigation className="h-4 w-4" />
                  <span>View Safe Route</span>
                </button>

                <button
                  onClick={() => onNavigate('citizen-guide')}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  <span>Safety Tips</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
