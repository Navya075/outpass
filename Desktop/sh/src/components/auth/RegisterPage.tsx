import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import {
  Shield,
  User,
  MapPin,
  Phone,
  Bell,
  Lock,
  Mail,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface RegisterPageProps {
  onSuccess: (role: UserRole) => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const { register } = useAuth();

  // Personal Details
  const [fullName, setFullName] = useState('Devika Menon');
  const [mobileNumber, setMobileNumber] = useState('+91 94471 55678');
  const [email, setEmail] = useState('devika.menon@kerala.res.in');
  const [password, setPassword] = useState('SafePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SafePass@2026');

  // Location
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('Wayanad');
  const [village, setVillage] = useState('Meppadi Ward 2');
  const [lat, setLat] = useState(11.5518);
  const [lng, setLng] = useState(76.1264);
  const [geoLocating, setGeoLocating] = useState(false);

  // Emergency Contact
  const [contactName, setContactName] = useState('Suresh Menon');
  const [relationship, setRelationship] = useState('Spouse');
  const [contactPhone, setContactPhone] = useState('+91 94473 11223');

  // Notification Preferences
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [landslideAlerts, setLandslideAlerts] = useState(true);
  const [floodAlerts, setFloodAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Selected registration role
  const [role, setRole] = useState<UserRole>('citizen');
  const [submitting, setSubmitting] = useState(false);

  const handleUseCurrentLocation = () => {
    setGeoLocating(true);
    setTimeout(() => {
      setLat(11.5518);
      setLng(76.1264);
      setVillage('Meppadi (Auto-detected via GPS)');
      setGeoLocating(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await register({
      fullName,
      email,
      mobileNumber,
      role,
      location: {
        state,
        district,
        village,
        latitude: lat,
        longitude: lng,
      },
      emergencyContacts: [
        {
          id: `c-${Date.now()}`,
          name: contactName,
          relationship,
          phone: contactPhone,
          notifyOnAlert: true,
        },
      ],
      notificationPreferences: {
        emergencyAlerts,
        landslideWarnings: landslideAlerts,
        floodAlerts,
        pushNotifications: pushNotifs,
        smsAlerts,
      },
    });

    setSubmitting(false);
    onSuccess(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center mb-8">
        <button
          onClick={onNavigateLanding}
          className="inline-flex items-center gap-2.5 group focus:outline-none mb-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm font-black">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-wider text-slate-900">LANDSAFE</span>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
          Citizen & Responder Registration
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Register your mountain residence coordinates to receive personalized evacuation routes and early warnings
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 text-xs"
        >
          {/* Section 1: Role Type */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Select Account Type</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200">
              {(['citizen', 'rescue', 'control'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-md font-semibold capitalize transition-all ${
                    role === r
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'citizen' ? 'Citizen Resident' : r === 'rescue' ? 'Rescue Personnel' : 'Control Official'}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-blue-700" />
              <span>1. Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Mobile Number (SMS Enabled)</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>2. Residential Location & Geospatial Vector</span>
              </h3>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>{geoLocating ? 'Acquiring GPS...' : 'Use Current Location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Village / Town / Ward</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-blue-700">
              Assigned Coordinates: Lat {lat}° N, Lng {lng}° E (Shortest safe shelter corridor computation)
            </p>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-700" />
              <span>3. Primary Emergency Contact (SOS Failover)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Emergency Phone Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 5: Notification Preferences */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-600" />
              <span>4. Notification Preferences</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span className="text-slate-800">Emergency Alerts</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={landslideAlerts}
                  onChange={(e) => setLandslideAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Landslide Warnings</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={floodAlerts}
                  onChange={(e) => setFloodAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Flash Flood Alerts</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">Push Notifications</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800">SMS Gateways</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 py-3 font-semibold text-white shadow-sm transition-all text-xs"
          >
            <span>{submitting ? 'Registering...' : `Complete Registration & Enter ${role.toUpperCase()}`}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign In Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
