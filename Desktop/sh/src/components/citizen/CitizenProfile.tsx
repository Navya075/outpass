import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  MapPin,
  Users,
  Bell,
  Shield,
  Save,
  Check,
  Plus,
  Trash2,
  LogOut,
} from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [mobileNumber, setMobileNumber] = useState(currentUser.mobileNumber);
  const [village, setVillage] = useState(currentUser.location.village);
  const [district, setDistrict] = useState(currentUser.location.district);
  const [state, setState] = useState(currentUser.location.state);

  const [contacts, setContacts] = useState(currentUser.emergencyContacts);
  const [notifs, setNotifs] = useState(currentUser.notificationPreferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      mobileNumber,
      location: {
        ...currentUser.location,
        village,
        district,
        state,
      },
      emergencyContacts: contacts,
      notificationPreferences: notifs,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddContact = () => {
    const newC = {
      id: `c-${Date.now()}`,
      name: 'New Contact',
      relationship: 'Family Member',
      phone: '+91 90000 00000',
      notifyOnAlert: true,
    };
    setContacts([...contacts, newC]);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            CITIZEN ACCOUNT & EMERGENCY PREFERENCES
          </span>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl mt-0.5">
            User Profile & Notification Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered disaster zone, emergency contacts, and broadcast reception channels
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{savedSuccess ? 'Profile Saved Successfully!' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <User className="h-4 w-4 text-blue-600" />
            <span>Personal Identification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mobile Number (SMS Enabled)</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Residential Location in Hazard Zone */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <MapPin className="h-4 w-4 text-red-600" />
            <span>Registered Geospatial Location (Early Warning Vector)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Village / Ward / Hamlet</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50/50 p-3 border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">GPS Coordinates:</span>
            <span className="font-mono text-blue-800 font-semibold">
              Lat: {currentUser.location.latitude}° N, Long: {currentUser.location.longitude}° E (Accurate within 5m)
            </span>
          </div>
        </div>

        {/* Section 3: Emergency Contacts */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-600" />
              <span>Personal Emergency Contacts (SOS Dispatches)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddContact}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact, idx) => (
              <div
                key={contact.id}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 items-center text-xs"
              >
                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">Contact Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].name = e.target.value;
                      setContacts(updated);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">Relationship</label>
                  <input
                    type="text"
                    value={contact.relationship}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].relationship = e.target.value;
                      setContacts(updated);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[idx].phone = e.target.value;
                      setContacts(updated);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-900 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={contact.notifyOnAlert}
                      onChange={(e) => {
                        const updated = [...contacts];
                        updated[idx].notifyOnAlert = e.target.checked;
                        setContacts(updated);
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>SOS SMS</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Notification Preferences */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Bell className="h-4 w-4 text-amber-500" />
            <span>Alert & Channel Delivery Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Emergency Warning Broadcasts</p>
                <p className="text-[11px] text-slate-500">Critical slope failure and evacuation orders</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emergencyAlerts}
                onChange={(e) => setNotifs({ ...notifs, emergencyAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Landslide Susceptibility Updates</p>
                <p className="text-[11px] text-slate-500">Rainfall threshold breaches in Wayanad</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.landslideWarnings}
                onChange={(e) => setNotifs({ ...notifs, landslideWarnings: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Flash Flood Cascade Advisories</p>
                <p className="text-[11px] text-slate-500">Downstream river swell and culvert overflow</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.floodAlerts}
                onChange={(e) => setNotifs({ ...notifs, floodAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">SMS Failover Broadcasts</p>
                <p className="text-[11px] text-slate-500">Delivered via telecom network when data connectivity is offline</p>
              </div>
              <input
                type="checkbox"
                checked={notifs.smsAlerts}
                onChange={(e) => setNotifs({ ...notifs, smsAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Logout & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Account</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
