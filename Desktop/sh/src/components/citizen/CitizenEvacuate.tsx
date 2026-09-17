import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHazard } from '../../context/HazardContext';
import { routingService } from '../../services/routingService';
import { EvacuationRouteMap } from '../map/EvacuationRouteMap';
import { Modal } from '../common/Modal';
import {
  Navigation,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
  Share2,
  CheckCircle2,
  Phone,
  ArrowRight,
  Route,
  Check,
  Building,
} from 'lucide-react';

export const CitizenEvacuate: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedZone } = useHazard();

  const userCoords: [number, number] = [currentUser.location.latitude, currentUser.location.longitude];
  const [isNavigating, setIsNavigating] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const routePlan = routingService.getEvacuationRoute(userCoords);

  const handleCopy = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  // 4 Simple Plain-Language Route Steps
  const simpleSteps = [
    {
      step: 1,
      instruction: 'Leave your home and head towards Estate Ridge Road.',
      note: 'Walk on the upper paved path.',
    },
    {
      step: 2,
      instruction: 'Avoid the lower road near the stream.',
      note: 'Stay away from fast-flowing water and muddy banks.',
      warning: true,
    },
    {
      step: 3,
      instruction: 'Follow the marked safe route.',
      note: 'Continue along the higher ground toward the main junction.',
    },
    {
      step: 4,
      instruction: 'Arrive at the relief camp.',
      note: 'St. Joseph Relief Camp has food, beds, and medical staff.',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">
            SAFE EVACUATION
          </span>
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Evacuation Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Follow this safe route away from danger to the nearest relief shelter
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <Share2 className="h-4 w-4 text-blue-700" />
            <span>Share Route</span>
          </button>

          <button
            onClick={() => setIsNavigating(!isNavigating)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
              isNavigating
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>{isNavigating ? 'Stop Navigation' : 'Start Navigation'}</span>
          </button>
        </div>
      </div>

      {/* Active Navigation Notice if activated */}
      {isNavigating && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 sm:p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-lg">
              ↑
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
                NAVIGATION ACTIVE
              </p>
              <h3 className="text-sm font-bold text-emerald-950">
                In 300 meters: Turn left onto Estate Ridge Road
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-900 font-mono">
            ETA: 14 mins
          </span>
        </div>
      )}

      {/* Origin & Destination Ribbon Cards (Required format) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            YOU ARE HERE
          </span>
          <p className="text-sm font-black text-slate-900">
            {currentUser.location.village.split(' ')[0] || 'Meppadi'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            CURRENT RISK
          </span>
          <p className="text-sm font-black text-red-600 uppercase">
            High
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1 col-span-2 sm:col-span-1 lg:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            GO TO
          </span>
          <p className="text-sm font-black text-emerald-800 truncate">
            {routePlan.destinationName}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            DISTANCE
          </span>
          <p className="text-sm font-black text-slate-900">
            {routePlan.totalDistanceKm} km
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            ESTIMATED TIME
          </span>
          <p className="text-sm font-black text-slate-900">
            14 min
          </p>
        </div>
      </div>

      {/* Road Status Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 px-4 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">ROAD STATUS:</span>
        <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-200">
          Safe with caution
        </span>
      </div>

      {/* Evacuation Map */}
      <EvacuationRouteMap
        routePlan={routePlan}
        userCoords={userCoords}
        heightClass="h-[360px] sm:h-[420px]"
      />

      {/* YOUR ROUTE (4 Simple Steps) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
            YOUR ROUTE
          </h2>
          <span className="text-xs text-slate-500 font-medium">4 Simple Steps</span>
        </div>

        <div className="space-y-3">
          {simpleSteps.map((step) => (
            <div
              key={step.step}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border ${
                step.warning
                  ? 'border-amber-200 bg-amber-50/60'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.warning ? 'bg-amber-600 text-white' : 'bg-blue-700 text-white'
                }`}
              >
                {step.step}
              </div>

              <div className="text-xs space-y-0.5 flex-1">
                <p className="font-bold text-slate-900 text-sm leading-snug">
                  {step.instruction}
                </p>
                <p className={`text-xs ${step.warning ? 'text-amber-800 font-medium' : 'text-slate-500'}`}>
                  {step.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100">
          <button
            onClick={() => setIsNavigating(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Navigation className="h-4 w-4" />
            <span>Start Navigation</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <Share2 className="h-4 w-4 text-blue-700" />
            <span>Share Route</span>
          </button>
        </div>
      </div>

      {/* Share Route Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Evacuation Route"
        subtitle="Send your route to family members so they know where you are going"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Send an SMS text message with your safe destination and route to your family contacts:
          </p>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 font-medium text-slate-800 leading-relaxed">
            "I am leaving Meppadi and heading to St. Joseph Relief Camp. Distance is 2.8 km. I am on the safe route."
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleSendSms}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 font-bold text-white shadow-sm transition-colors text-xs"
            >
              {smsSent ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span>{smsSent ? 'SMS Sent to Your Contacts!' : 'Send SMS to Family Contacts'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2.5 font-bold text-slate-700 transition-colors shadow-2xs text-xs"
            >
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
