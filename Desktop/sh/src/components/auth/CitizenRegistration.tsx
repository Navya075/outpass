import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmergencyContact } from '../../types/user';
import {
  Shield,
  User,
  MapPin,
  Phone,
  Bell,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Compass,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface CitizenRegistrationProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
  onBackToRoles: () => void;
}

export const CitizenRegistration: React.FC<CitizenRegistrationProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateLanding,
  onBackToRoles,
}) => {
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('Ananya Nair');
  const [email, setEmail] = useState('ananya.nair@wayanad.res.in');
  const [mobileNumber, setMobileNumber] = useState('+91 98471 90214');
  const [password, setPassword] = useState('SafePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SafePass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Location
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('Wayanad');
  const [village, setVillage] = useState('Meppadi (Tea Estate Ward 4)');
  const [addressArea, setAddressArea] = useState('High Range Valley Road, Near Primary Health Center');
  const [lat, setLat] = useState(11.5518);
  const [lng, setLng] = useState(76.1264);
  const [geoLocating, setGeoLocating] = useState(false);

  // Step 3: Emergency Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: 'c-1',
      name: 'Rajan Nair',
      relationship: 'Father',
      phone: '+91 94470 12345',
      notifyOnAlert: true,
    },
    {
      id: 'c-2',
      name: 'Dr. Lekshmi Nair',
      relationship: 'Sister',
      phone: '+91 94473 89012',
      notifyOnAlert: true,
    },
  ]);

  // Step 4: Alert Preferences
  const [landslideAlerts, setLandslideAlerts] = useState(true);
  const [floodAlerts, setFloodAlerts] = useState(true);
  const [rainfallAlerts, setRainfallAlerts] = useState(true);
  const [evacuationAlerts, setEvacuationAlerts] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Step 5: Review & Confirmation
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Geolocation simulation
  const handleUseCurrentLocation = () => {
    setGeoLocating(true);
    setTimeout(() => {
      setLat(11.5518);
      setLng(76.1264);
      setVillage('Meppadi (Tea Estate Ward 4)');
      setAddressArea('Auto-detected via GPS: 11.5518° N, 76.1264° E');
      setGeoLocating(false);
    }, 600);
  };

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        id: `c-${Date.now()}`,
        name: '',
        relationship: 'Relative',
        phone: '',
        notifyOnAlert: true,
      },
    ]);
  };

  const handleRemoveContact = (id: string) => {
    if (contacts.length <= 1) {
      alert('You must provide at least one emergency contact for rapid SOS failover.');
      return;
    }
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleUpdateContact = (id: string, field: keyof EmergencyContact, value: any) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
      if (!mobileNumber.trim() || mobileNumber.length < 10) newErrors.mobileNumber = 'Valid mobile number is required';
      if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!state.trim()) newErrors.state = 'State is required';
      if (!district.trim()) newErrors.district = 'District is required';
      if (!village.trim()) newErrors.village = 'Village / Town is required';
      if (!addressArea.trim()) newErrors.addressArea = 'Address / Area is required';
    }

    if (step === 3) {
      const invalid = contacts.some((c) => !c.name.trim() || !c.phone.trim());
      if (invalid) newErrors.contacts = 'Please fill out all contact names and phone numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setErrors({ confirmed: 'Please confirm that the information provided is correct.' });
      return;
    }

    setSubmitting(true);
    await register({
      fullName,
      email,
      mobileNumber,
      role: 'citizen',
      location: {
        state,
        district,
        village,
        addressArea,
        latitude: lat,
        longitude: lng,
      },
      emergencyContacts: contacts,
      notificationPreferences: {
        emergencyAlerts: evacuationAlerts,
        landslideWarnings: landslideAlerts,
        floodAlerts,
        pushNotifications: pushNotifs,
        smsAlerts,
      },
    });

    setSubmitting(false);
    setIsSuccess(true);
  };

  const stepTitles = [
    'Personal Details',
    'Location & GPS',
    'Emergency Contacts',
    'Alert Preferences',
    'Review & Confirm',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBackToRoles}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Switch Role</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-2xs font-black">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-slate-900">LANDSAFE</span>
              <span className="ml-2 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 uppercase">
                Citizen Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already registered?</span>
            <button
              onClick={onNavigateLogin}
              className="text-blue-700 font-bold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 flex-1">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">
            CITIZEN SAFETY ONBOARDING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Register Your Residence
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Connect your home location with real-time landslide sensors for personalized evacuation routes and warning notices.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />

            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-2xs ${
                      isCompleted
                        ? 'bg-blue-600 text-white'
                        : isCurrent
                        ? 'bg-white border-2 border-blue-600 text-blue-700 ring-4 ring-blue-50'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 tracking-tight hidden sm:block ${
                      isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center text-xs text-slate-500 font-mono font-medium sm:hidden">
            Step {currentStep} of {totalSteps}: <strong className="text-blue-700">{stepTitles[currentStep - 1]}</strong>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Citizen Account Created Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Welcome, <strong>{fullName}</strong>. Your residence in <strong>{village}, {district}</strong> has been linked to the LANDSAFE high-range early warning system.
              </p>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono text-slate-600">
                <p>📍 Sector: <strong>{village}</strong></p>
                <p>🌐 GPS Coordinates: <strong>{lat}° N, {lng}° E</strong></p>
                <p>🚨 Emergency Contacts: <strong>{contacts.length} registered</strong></p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onSuccess}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-6 py-3 font-bold text-xs text-white shadow-sm transition-all"
                >
                  <span>Enter Citizen Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onNavigateLogin}
                  className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 font-bold text-xs text-slate-700 transition-colors"
                >
                  Sign In with Credentials
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-700" />
                      <span>Step 1 — Personal Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your identity and credentials for authenticated safety access.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Nair"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mobile Number (SMS Alerts) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98471..."
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.mobileNumber && <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pr-9 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span>Step 2 — Location Details</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Specify your residential location to calibrate real-time slope hazard modeling.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
                    >
                      <Compass className={`h-3.5 w-3.5 ${geoLocating ? 'animate-spin' : ''}`} />
                      <span>{geoLocating ? 'Detecting GPS...' : 'Use Current Location'}</span>
                    </button>
                  </div>

                  {/* Important Callout */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex items-start gap-3">
                    <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 leading-relaxed">
                      <strong>Critical Calibration Note:</strong> Your registered location is used by the AI engine to calculate localized soil moisture saturation, slope angle, and turn-by-turn evacuation corridors directly from your doorstep to the nearest open shelter.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                      {errors.district && <p className="text-[11px] text-red-600 mt-1">{errors.district}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Village / Town / Ward <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Meppadi Ward 4"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    {errors.village && <p className="text-[11px] text-red-600 mt-1">{errors.village}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Address / Area / Landmark <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressArea}
                      onChange={(e) => setAddressArea(e.target.value)}
                      placeholder="e.g. Upper Tea Division, Near St. Joseph Chapel"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    {errors.addressArea && <p className="text-[11px] text-red-600 mt-1">{errors.addressArea}</p>}
                  </div>

                  {/* Coordinates Display */}
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-500">Detected Coordinates:</span>
                    <span className="font-bold text-blue-700">
                      Lat {lat.toFixed(4)}° N, Lng {lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: EMERGENCY CONTACTS */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-emerald-700" />
                        <span>Step 3 — Emergency Contacts</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        These contacts will receive immediate automated SMS alerts when red-level evacuation triggers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddContact}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5 text-blue-700" />
                      <span>Add Contact</span>
                    </button>
                  </div>

                  {errors.contacts && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium">
                      {errors.contacts}
                    </div>
                  )}

                  <div className="space-y-3">
                    {contacts.map((contact, idx) => (
                      <div
                        key={contact.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-700 font-mono">
                            Contact #{idx + 1}
                          </span>
                          {contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveContact(contact.id)}
                              className="text-slate-400 hover:text-red-600 p-1"
                              title="Remove contact"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-slate-600 mb-1">Contact Name</label>
                            <input
                              type="text"
                              value={contact.name}
                              onChange={(e) => handleUpdateContact(contact.id, 'name', e.target.value)}
                              placeholder="e.g. Suresh Nair"
                              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 mb-1">Relationship</label>
                            <select
                              value={contact.relationship}
                              onChange={(e) => handleUpdateContact(contact.id, 'relationship', e.target.value)}
                              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 text-xs focus:border-blue-600 focus:outline-none"
                            >
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Spouse">Spouse</option>
                              <option value="Sibling">Sibling</option>
                              <option value="Child">Child</option>
                              <option value="Neighbor">Neighbor / Warden</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-600 mb-1">Mobile Phone Number</label>
                            <input
                              type="text"
                              value={contact.phone}
                              onChange={(e) => handleUpdateContact(contact.id, 'phone', e.target.value)}
                              placeholder="+91 94470..."
                              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 text-xs font-mono focus:border-blue-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: ALERT PREFERENCES */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-600" />
                      <span>Step 4 — Alert Preferences</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select warning notification thresholds and transmission channels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={landslideAlerts}
                        onChange={(e) => setLandslideAlerts(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Landslide Risk Alerts</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Threshold warnings when continuous rainfall triggers high slope failure probability.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={floodAlerts}
                        onChange={(e) => setFloodAlerts(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Flash Flood Alerts</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Cascading stream surge warnings for riverbeds and downstream tea estate valleys.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={rainfallAlerts}
                        onChange={(e) => setRainfallAlerts(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Heavy Rainfall Radar Feeds</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          IMD radar cloudburst telemetry and hourly precipitation spikes exceeding 50mm.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={evacuationAlerts}
                        onChange={(e) => setEvacuationAlerts(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Immediate Evacuation Orders</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          High-priority civil protection alerts broadcasting safe shelter dispatch directives.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={pushNotifs}
                        onChange={(e) => setPushNotifs(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Browser & App Push</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Instant audio chime and visual popups on your registered handheld device.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <strong className="text-xs text-slate-900 block">Cellular SMS Alerts</strong>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Telecom tower broadcast gateway for offline alerts during power grid outages.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & CONFIRM */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Step 5 — Review & Confirm</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify your residential and emergency details before account creation.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Summary Card 1: Personal */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                        <span className="font-bold text-slate-700">1. Citizen Identity</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <p>Name: <strong className="text-slate-900">{fullName}</strong></p>
                        <p>Email: <strong className="text-slate-900">{email}</strong></p>
                        <p>Mobile: <strong className="text-slate-900 font-mono">{mobileNumber}</strong></p>
                      </div>
                    </div>

                    {/* Summary Card 2: Location */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                        <span className="font-bold text-slate-700">2. Registered Location</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <p>Region: <strong className="text-slate-900">{village}, {district}, {state}</strong></p>
                        <p>Address: <strong className="text-slate-900">{addressArea}</strong></p>
                        <p className="font-mono text-[11px] text-blue-700">
                          📍 Coordinates: Lat {lat.toFixed(4)}° N, Lng {lng.toFixed(4)}° E
                        </p>
                      </div>
                    </div>

                    {/* Summary Card 3: Contacts */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                        <span className="font-bold text-slate-700">3. Emergency Contacts ({contacts.length})</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1">
                        {contacts.map((c, i) => (
                          <p key={c.id} className="text-slate-600">
                            #{i + 1}: <strong className="text-slate-900">{c.name}</strong> ({c.relationship}) —{' '}
                            <span className="font-mono text-slate-700">{c.phone}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Summary Card 4: Channels */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-2">
                        <span className="font-bold text-slate-700">4. Active Notification Channels</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {landslideAlerts && (
                          <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                            Landslide
                          </span>
                        )}
                        {floodAlerts && (
                          <span className="rounded bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold">
                            Flash Flood
                          </span>
                        )}
                        {rainfallAlerts && (
                          <span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                            Heavy Rainfall
                          </span>
                        )}
                        {evacuationAlerts && (
                          <span className="rounded bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold">
                            Evacuation Orders
                          </span>
                        )}
                        {pushNotifs && (
                          <span className="rounded bg-slate-200 text-slate-800 px-2 py-0.5 text-[10px] font-bold">
                            Push Chimes
                          </span>
                        )}
                        {smsAlerts && (
                          <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            SMS Broadcast
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                        I confirm that the information provided is correct and understand that LANDSAFE early warning signals are generated to assist rapid evacuation decisions.
                      </span>
                    </label>
                    {errors.confirmed && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.confirmed}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Actions (Back / Continue / Submit) */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToRoles}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Change Role</span>
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>Continue to {stepTitles[currentStep]}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>{submitting ? 'Creating Citizen Account...' : 'Create Citizen Account'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400">
        <p>LANDSAFE • Citizen Public Safety Portal • End-to-End Early Warning</p>
      </footer>
    </div>
  );
};
