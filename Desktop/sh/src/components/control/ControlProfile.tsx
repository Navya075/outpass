import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ControlAccessLevel } from '../../types/user';
import {
  Radio,
  User,
  Building2,
  Landmark,
  KeyRound,
  Save,
  Check,
  BadgeCheck,
  ShieldAlert,
  LogOut,
  PhoneCall,
  Clock,
} from 'lucide-react';

export const ControlProfile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [mobileNumber, setMobileNumber] = useState(currentUser.mobileNumber);
  const [department, setDepartment] = useState(currentUser.department || 'District Disaster Management Authority (DDMA)');
  const [designation, setDesignation] = useState(currentUser.designation || 'District Collector & Chairperson DDMA');
  const [officialId, setOfficialId] = useState(currentUser.officialId || currentUser.badgeNumber || 'IAS-KL-2014-992');
  const [controlCenterName, setControlCenterName] = useState(
    currentUser.controlCenterName || 'District Emergency Operations Center (DEOC Kalpetta)'
  );
  const [operationalDistrict, setOperationalDistrict] = useState(currentUser.operationalDistrict || 'Wayanad District, Kerala');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(
    currentUser.emergencyContactNumber || '04936 204151 / Toll-Free 1077'
  );
  const [accessLevel, setAccessLevel] = useState<ControlAccessLevel>(currentUser.accessLevel || 'Administrator');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      mobileNumber,
      department,
      designation,
      officialId,
      badgeNumber: officialId,
      controlCenterName,
      operationalDistrict,
      emergencyContactNumber,
      accessLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5" />
            <span>DISASTER OPERATIONS COMMAND CREDENTIALS</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Control Center Profile & Authorization
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official cadre details, emergency room operational facilities, and command access clearance
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-red-700 hover:bg-red-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? 'Profile Updated!' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Official Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <User className="h-4 w-4 text-red-600" />
            <span>1. Official Identity & Cadre</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Name & Honorific</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Designation / Role Title</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Govt ID / Cadre</label>
              <input
                type="text"
                value={officialId}
                onChange={(e) => setOfficialId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Phone / Hotline</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Department & Authority */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Landmark className="h-4 w-4 text-red-600" />
            <span>2. Government Department & Authority</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Department / Branch</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Jurisdiction District</label>
              <input
                type="text"
                value={operationalDistrict}
                onChange={(e) => setOperationalDistrict(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Control Center Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Building2 className="h-4 w-4 text-red-600" />
            <span>3. Incident Command Room Facility</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Control Center Name</label>
              <input
                type="text"
                value={controlCenterName}
                onChange={(e) => setControlCenterName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Emergency Operations Hotline</label>
              <input
                type="text"
                value={emergencyContactNumber}
                onChange={(e) => setEmergencyContactNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-red-50/60 p-3 border border-red-200 flex items-center justify-between text-xs text-red-950">
            <span className="font-medium">Primary Facility Address:</span>
            <span className="font-mono font-bold">
              District Collectorate Complex, Kalpetta North, Wayanad, PIN: 673122
            </span>
          </div>
        </div>

        {/* Section 4: Access Level */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <KeyRound className="h-4 w-4 text-red-600" />
            <span>4. Command Access Level & Authorization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['Operator', 'Supervisor', 'Administrator'] as ControlAccessLevel[]).map((lvl) => {
              const isSelected = accessLevel === lvl;
              return (
                <div
                  key={lvl}
                  onClick={() => setAccessLevel(lvl)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-600 bg-red-50/60 shadow-xs ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{lvl}</strong>
                    {isSelected && <BadgeCheck className="h-4 w-4 text-red-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lvl === 'Operator'
                      ? 'Telemetry & alert drafting'
                      : lvl === 'Supervisor'
                      ? 'Alert broadcast & team dispatch'
                      : 'Full incident command authority'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Command Room</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-red-700 hover:bg-red-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Control Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
