import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  User,
  Building,
  Truck,
  MapPin,
  Save,
  Check,
  Radio,
  HeartPulse,
  AlertOctagon,
  LogOut,
  Users,
} from 'lucide-react';

export const RescueProfile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [mobileNumber, setMobileNumber] = useState(currentUser.mobileNumber);
  const [designation, setDesignation] = useState(currentUser.designation || 'Assistant Commandant / Team Lead');
  const [agency, setAgency] = useState(currentUser.agency || 'Kerala State Disaster Response Force (SDRF)');
  const [teamName, setTeamName] = useState(currentUser.teamName || 'Alpha Unit 04 (Mountain Tactical Extraction)');
  const [employeeId, setEmployeeId] = useState(currentUser.employeeId || currentUser.badgeNumber || 'SDRF-WYD-401');
  const [operationalRegion, setOperationalRegion] = useState(currentUser.operationalRegion || 'Wayanad High Ranges (Meppadi - Chooralmala Sector)');
  const [teamMembersCount, setTeamMembersCount] = useState(currentUser.teamMembersCount || 24);
  const [vehicleAvailability, setVehicleAvailability] = useState(
    currentUser.vehicleAvailability || '3x All-Terrain 4WD Units, 1x Heavy Transport, 2x Rapid Inflatable Boats'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      mobileNumber,
      designation,
      agency,
      teamName,
      employeeId,
      badgeNumber: employeeId,
      operationalRegion,
      teamMembersCount,
      vehicleAvailability,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>TACTICAL RESPONDER COMMAND CREDENTIALS</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            Rescue Team Profile & Deployment Info
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Personnel details, agency affiliation, operational equipment, and designated response sectors
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? 'Profile Updated!' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personnel Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <User className="h-4 w-4 text-amber-600" />
            <span>1. Personnel & Officer Identification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name & Rank</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official ID / Badge Number</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Tactical Radio / Phone</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Organization & Agency */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Building className="h-4 w-4 text-amber-600" />
            <span>2. Force Affiliation & Unit Credentials</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Organization / Agency</label>
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Team Name / Unit Identifier</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Team Information & Equipment */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Truck className="h-4 w-4 text-amber-600" />
            <span>3. Team Manpower & Equipment Readiness</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Active Team Personnel Count</label>
              <input
                type="number"
                value={teamMembersCount}
                onChange={(e) => setTeamMembersCount(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Vehicles & Transport Fleet</label>
              <input
                type="text"
                value={vehicleAvailability}
                onChange={(e) => setVehicleAvailability(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-amber-50/60 p-3 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <AlertOctagon className="h-3.5 w-3.5 text-amber-700" />
                <span>Heavy Extraction Gear:</span>
              </span>
              <p className="text-xs text-amber-800">Hydraulic Cutters, Mountain Ropes, Concrete Drills</p>
            </div>

            <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-emerald-700" />
                <span>Medical Lifesaving:</span>
              </span>
              <p className="text-xs text-emerald-800">4x Trauma Kits, Defibrillator AED, Portable O₂</p>
            </div>

            <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-blue-700" />
                <span>Tactical Radio Grid:</span>
              </span>
              <p className="text-xs text-blue-800">Satellite Phones, UHF/VHF, Emergency Mesh Link</p>
            </div>
          </div>
        </div>

        {/* Section 4: Operational Region */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <MapPin className="h-4 w-4 text-red-600" />
            <span>4. Assigned Operational Sector</span>
          </h3>

          <div className="text-xs space-y-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Primary Operating Region</label>
              <input
                type="text"
                value={operationalRegion}
                onChange={(e) => setOperationalRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Base Station Staging Ground:</span>
              <span className="font-mono text-slate-900 font-bold">
                Kalpetta Incident Command Staging Post (11.6103° N, 76.0827° E)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Rescue Portal</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Rescue Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
