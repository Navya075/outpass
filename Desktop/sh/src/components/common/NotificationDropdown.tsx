import React from 'react';
import { Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { BroadcastAlert } from '../../types/alert';
import { RiskBadge } from './RiskBadge';

interface NotificationDropdownProps {
  alerts: BroadcastAlert[];
  isOpen: boolean;
  onClose: () => void;
  onViewAllAlerts: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  alerts,
  isOpen,
  onClose,
  onViewAllAlerts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-700" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Live Early Warnings</h4>
        </div>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-800 border border-red-200">
          {alerts.length} Active
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-1">
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-slate-500">
            <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600 mb-1" />
            <p className="text-xs">No active critical warnings.</p>
          </div>
        ) : (
          alerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1">
                <RiskBadge level={alert.severity} size="sm" showPulse={false} />
                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{alert.headline}</p>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{alert.message}</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                <span>📍 {alert.locationName}</span>
                <span className="text-blue-700 font-medium">CAP: {alert.capIdentifier.slice(-7)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 pt-2 px-1">
        <button
          onClick={() => {
            onClose();
            onViewAllAlerts();
          }}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 text-xs font-bold text-blue-700 transition-colors"
        >
          <span>Open Full Alert Center</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
