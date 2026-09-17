import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { useAuth } from '../../context/AuthContext';
import {
  Navigation,
  PhoneCall,
  MapPin,
  Map,
  Shield,
  Briefcase,
  AlertCircle,
  Clock,
  CloudRain,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface CitizenHomeProps {
  onNavigate: (tabId: string) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({ onNavigate }) => {
  const { selectedZone, zones } = useHazard();
  const { currentUser } = useAuth();

  // User's home zone (default to Meppadi)
  const userZone = zones.find((z) => z.id === 'zone-meppadi') || selectedZone;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* 1. Greeting & Location Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Hello, {currentUser.fullName}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>{currentUser.location.village}, {currentUser.location.district}</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('citizen-emergency')}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          <PhoneCall className="h-4 w-4" />
          <span>Emergency SOS</span>
        </button>
      </div>

      {/* 2. Main Dominant Card: YOUR CURRENT SAFETY STATUS */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        {/* Status Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              YOUR CURRENT SAFETY STATUS
            </span>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight uppercase">
                HIGH RISK
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
              Heavy rainfall has increased the risk of landslides in your area.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200 uppercase font-mono">
              Action Required
            </span>
          </div>
        </div>

        {/* What Should You Do Directive */}
        <div className="rounded-xl bg-red-50/70 border border-red-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-900 font-mono">
              WHAT SHOULD YOU DO?
            </h3>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            Be ready to leave. Keep your emergency bag ready and stay away from steep slopes.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('citizen-evacuate')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-6 py-3 font-bold text-xs text-white shadow-sm transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>View Safe Route</span>
            </button>

            <button
              onClick={() => onNavigate('citizen-emergency')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 px-5 py-3 font-bold text-xs text-red-700 transition-colors shadow-2xs"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Emergency Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Four Important Citizen Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Rain */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            RAIN
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {userZone.environmental.rainfall24hMm}
            </span>
            <span className="text-xs font-bold text-slate-500">mm</span>
          </div>
          <p className="text-xs font-medium text-blue-700">
            Heavy rain today
          </p>
        </div>

        {/* Metric 2: Risk */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            RISK
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-red-600">
              {userZone.riskScore}%
            </span>
          </div>
          <p className="text-xs font-bold text-red-600">
            High risk
          </p>
        </div>

        {/* Metric 3: Safe Shelter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            SAFE SHELTER
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              2.8
            </span>
            <span className="text-xs font-bold text-slate-500">km</span>
          </div>
          <p className="text-xs font-medium text-emerald-800">
            Nearest safe place
          </p>
        </div>

        {/* Metric 4: Time to Act */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            TIME TO ACT
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              ~2 hours
            </span>
          </div>
          <p className="text-xs font-bold text-amber-700">
            Act soon
          </p>
          <p className="text-[10px] text-slate-400 leading-tight pt-0.5">
            Estimated time before conditions may become more dangerous.
          </p>
        </div>
      </div>

      {/* 4. Three Simple Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quick Action 1: Risk Map */}
        <div
          onClick={() => onNavigate('citizen-map')}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Risk Map</h4>
              <p className="text-[11px] text-slate-500">See safe areas & roads</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Quick Action 2: Evacuation Route */}
        <div
          onClick={() => onNavigate('citizen-evacuate')}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Evacuation Route</h4>
              <p className="text-[11px] text-slate-500">Route to safe shelter</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Quick Action 3: Go-Bag */}
        <div
          onClick={() => onNavigate('citizen-guide')}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Go-Bag</h4>
              <p className="text-[11px] text-slate-500">Emergency packing list</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
