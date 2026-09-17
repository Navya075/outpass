import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  PhoneCall,
  Shield,
  HeartPulse,
  Flame,
  Radio,
  Users,
  CheckCircle2,
  AlertOctagon,
  Building2,
  MapPin,
  Clock,
  Send,
  Phone,
} from 'lucide-react';

export const CitizenEmergency: React.FC = () => {
  const { currentUser } = useAuth();
  const [isAlertContactsModalOpen, setIsAlertContactsModalOpen] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [activeCall, setActiveCall] = useState<{ name: string; number: string } | null>(null);

  const emergencyCards = [
    {
      name: 'Police',
      number: '112',
      description: 'Police & Emergency Services',
      icon: Shield,
      accentColor: 'text-blue-700 bg-blue-50 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Ambulance',
      number: '108',
      description: 'Medical Emergency & Ambulance',
      icon: HeartPulse,
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      name: 'Fire & Rescue',
      number: '101',
      description: 'Fire & Disaster Rescue',
      icon: Flame,
      accentColor: 'text-amber-700 bg-amber-50 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      name: 'Disaster Helpline',
      number: '1077',
      description: 'District Disaster Control Room',
      icon: Radio,
      accentColor: 'text-rose-700 bg-rose-50 border-rose-200',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
    },
  ];

  const nearbyFacilities = [
    {
      name: 'Meppadi Police Station',
      type: 'Police',
      distance: '1.8 km',
      phone: '+91 4936 282240',
      status: 'Open 24/7',
    },
    {
      name: 'Kerala Fire & Rescue (Meppadi)',
      type: 'Fire Station',
      distance: '2.1 km',
      phone: '+91 4936 282101',
      status: 'Crews Ready',
    },
    {
      name: 'St. Joseph Relief Camp',
      type: 'Shelter',
      distance: '2.8 km',
      phone: '+91 94471 88201',
      status: '338 Beds Available',
    },
  ];

  const handleSimulateCall = (name: string, number: string) => {
    setActiveCall({ name, number });
  };

  const handleDispatchSOS = () => {
    setIsDispatched(true);
    setTimeout(() => {
      setIsDispatched(false);
      setDispatchSuccess(true);
      setTimeout(() => {
        setDispatchSuccess(false);
        setIsAlertContactsModalOpen(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-mono">
            FAST ACCESS TO HELP
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Emergency Help
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Call emergency services directly, notify family, or find the nearest hospital.
          </p>
        </div>

        {/* Top SOS Button */}
        <button
          onClick={() => setIsAlertContactsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          <AlertOctagon className="h-4 w-4" />
          <span>Send SOS to Family</span>
        </button>
      </div>

      {/* 4 Large Clear Emergency Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Official Emergency Numbers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyCards.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${service.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase bg-slate-100 px-2 py-0.5 rounded">
                      24/7 TOLL-FREE
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{service.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                  <p className="text-2xl font-extrabold font-mono text-slate-900 mt-3">
                    {service.number}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSimulateCall(service.name, service.number)}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg ${service.btnColor} py-2.5 text-xs font-bold text-white shadow-2xs transition-colors`}
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>CALL {service.number}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Nearest Hospital & My Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearest Hospital Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-700" />
              <span>Nearest Hospital</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              DOCTOR ON STANDBY
            </span>
          </div>

          {/* Primary Hospital Highlight */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">Meppadi Primary Health Center</h4>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>Main Road, Meppadi (1.2 km away)</span>
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200 shadow-2xs">
                ~4 min
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
                <span className="text-[10px] text-slate-500 block font-medium">Emergency Care</span>
                <span className="font-semibold text-slate-800">24/7 Trauma Unit</span>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
                <span className="text-[10px] text-slate-500 block font-medium">Ambulance</span>
                <span className="font-semibold text-slate-800">2 Vehicles Ready</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleSimulateCall('Meppadi Primary Health Center', '+91 4936 282220')}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Call Hospital (+91 4936 282220)</span>
              </button>
            </div>
          </div>

          {/* Other nearby facilities */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Other Nearby Emergency Facilities
            </span>
            <div className="divide-y divide-slate-100 text-xs">
              {nearbyFacilities.map((fac, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{fac.name}</p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-2">
                      <span className="text-slate-600 font-medium">{fac.distance} away</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{fac.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleSimulateCall(fac.name, fac.phone)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs shrink-0 text-xs"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Emergency Contacts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-700" />
              <span>My Emergency Contacts</span>
            </h3>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
              {currentUser.emergencyContacts.length} Contacts Saved
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These people will be alerted immediately when you trigger an emergency SOS or when official warnings are issued for your ward.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {currentUser.emergencyContacts.map((contact) => (
              <div key={contact.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{contact.name}</p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                      {contact.relationship}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-[11px]">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleSimulateCall(contact.name, contact.phone)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 font-semibold text-blue-700 transition-colors shadow-2xs shrink-0 text-xs"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsAlertContactsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 py-3 text-xs font-bold text-red-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send SOS to Family</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      <Modal
        isOpen={!!activeCall}
        onClose={() => setActiveCall(null)}
        title="Outgoing Call"
        subtitle="Direct emergency connection"
      >
        <div className="p-5 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md animate-pulse">
            <PhoneCall className="h-8 w-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{activeCall?.name}</h4>
            <p className="text-sm font-mono text-slate-500 mt-1">{activeCall?.number}</p>
            <p className="text-xs text-emerald-700 font-medium mt-2">Connecting to helpline dispatcher...</p>
          </div>
          <button
            onClick={() => setActiveCall(null)}
            className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
          >
            End Call
          </button>
        </div>
      </Modal>

      {/* SOS Alert Modal */}
      <Modal
        isOpen={isAlertContactsModalOpen}
        onClose={() => !isDispatched && setIsAlertContactsModalOpen(false)}
        title="Send SOS to Family"
        subtitle="Instant alert to your registered emergency contacts"
      >
        <div className="space-y-4 text-xs">
          {dispatchSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">SOS Sent Successfully!</h4>
              <p className="text-xs text-slate-600">
                Your emergency contacts have been notified with your current location and status via SMS.
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 leading-relaxed">
                This will send an emergency SMS with your live location and status to all <strong>{currentUser.emergencyContacts.length}</strong> emergency contacts:
              </p>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1">
                {currentUser.emergencyContacts.map((c) => (
                  <div key={c.id} className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{c.name} ({c.relationship})</span>
                    <span className="font-mono text-slate-500">{c.phone}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-[11px] text-red-900">
                <strong>SMS Message Preview:</strong>
                <p className="mt-1 font-mono text-[10.5px]">
                  "EMERGENCY: I am {currentUser.fullName} at {currentUser.location.village}, Wayanad. Landslide risk in my area is HIGH. I need help. My coordinates: {currentUser.location.latitude.toFixed(4)}°N, {currentUser.location.longitude.toFixed(4)}°E."
                </p>
              </div>

              <button
                onClick={handleDispatchSOS}
                disabled={isDispatched}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 font-bold text-white shadow-sm transition-all text-xs"
              >
                {isDispatched ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-spin" />
                    <span>Sending SOS to Emergency Contacts...</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="h-4 w-4" />
                    <span>Confirm & Send SOS Now</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
