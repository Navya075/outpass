import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Shield,
  User,
  Building,
  Truck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertOctagon,
  Users,
  Radio,
  HeartPulse,
} from 'lucide-react';

interface RescueRegistrationProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
  onBackToRoles: () => void;
}

export const RescueRegistration: React.FC<RescueRegistrationProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateLanding,
  onBackToRoles,
}) => {
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Personnel Details
  const [fullName, setFullName] = useState('Capt. Rajesh Kumar');
  const [email, setEmail] = useState('rajesh.kumar@sdrf.kerala.gov.in');
  const [mobileNumber, setMobileNumber] = useState('+91 94471 20042');
  const [password, setPassword] = useState('SafePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SafePass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Organization Details
  const [agency, setAgency] = useState('Kerala State Disaster Response Force (SDRF)');
  const [teamName, setTeamName] = useState('Alpha Unit 04 (Mountain Tactical Extraction)');
  const [designation, setDesignation] = useState('Assistant Commandant / Team Lead');
  const [employeeId, setEmployeeId] = useState('SDRF-WYD-401');
  const [operationalRegion, setOperationalRegion] = useState('Wayanad High Ranges (Meppadi - Chooralmala)');

  // Step 3: Team Information
  const [teamMembersCount, setTeamMembersCount] = useState<number>(24);
  const [vehicleAvailability, setVehicleAvailability] = useState('3x All-Terrain 4WD Units, 1x Heavy Transport, 2x Rapid Inflatable Boats');
  const [rescueEquipment, setRescueEquipment] = useState<string[]>([
    'Hydraulic Spreaders & Cutters',
    'High-Angle Mountain Rope Rescue Kits',
    'Debris Gas & Void Detectors',
  ]);
  const [medicalEquipment, setMedicalEquipment] = useState<string[]>([
    '4x Advanced Trauma Life Support Kits',
    'Automated External Defibrillators (AED)',
    'Portable Oxygen Cylinders',
  ]);
  const [communicationEquipment, setCommunicationEquipment] = useState<string[]>([
    'Satellite Handhelds (IsatPhone 2)',
    'VHF/UHF Tactical Radios',
    'Emergency Mesh Repeater',
  ]);

  // Step 4: Operational Area
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('Wayanad');
  const [primaryOperatingRegion, setPrimaryOperatingRegion] = useState('Meppadi - Chooralmala - Mundakkai Basin');

  // Step 5: Submission & Verification
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!email.trim() || !email.includes('@')) newErrors.email = 'Official email is required';
      if (!mobileNumber.trim() || mobileNumber.length < 10) newErrors.mobileNumber = 'Mobile number is required';
      if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!agency.trim()) newErrors.agency = 'Agency is required';
      if (!teamName.trim()) newErrors.teamName = 'Team Name is required';
      if (!designation.trim()) newErrors.designation = 'Designation is required';
      if (!employeeId.trim()) newErrors.employeeId = 'Team ID / Employee ID is required';
    }

    if (step === 3) {
      if (!teamMembersCount || teamMembersCount < 1) newErrors.teamMembersCount = 'Team member count is required';
      if (!vehicleAvailability.trim()) newErrors.vehicleAvailability = 'Vehicle availability is required';
    }

    if (step === 4) {
      if (!state.trim()) newErrors.state = 'State is required';
      if (!district.trim()) newErrors.district = 'District is required';
      if (!primaryOperatingRegion.trim()) newErrors.primaryOperatingRegion = 'Operating region is required';
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
    setSubmitting(true);

    await register({
      fullName,
      email,
      mobileNumber,
      role: 'rescue',
      agency,
      teamName,
      designation,
      employeeId,
      badgeNumber: employeeId,
      operationalRegion,
      teamMembersCount,
      vehicleAvailability,
      rescueEquipment,
      medicalEquipment,
      communicationEquipment,
      location: {
        state,
        district,
        village: primaryOperatingRegion,
        addressArea: `${district} Emergency Post`,
        latitude: 11.6103,
        longitude: 76.0827,
      },
      emergencyContacts: [
        {
          id: 'rc-1',
          name: 'District Emergency Desk',
          relationship: 'Operations Room',
          phone: '1077',
          notifyOnAlert: true,
        },
      ],
      notificationPreferences: {
        emergencyAlerts: true,
        landslideWarnings: true,
        floodAlerts: true,
        pushNotifications: true,
        smsAlerts: true,
      },
    });

    setSubmitting(false);
    setIsSuccess(true);
  };

  const stepTitles = [
    'Personnel Details',
    'Organization & Agency',
    'Team & Equipment',
    'Operational Area',
    'Review & Submit',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-amber-600 selection:text-white">
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-2xs font-black">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-slate-900">LANDSAFE</span>
              <span className="ml-2 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 uppercase">
                Rescue Onboarding
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already have an ID?</span>
            <button
              onClick={onNavigateLogin}
              className="text-amber-700 font-bold hover:underline"
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
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono">
            TACTICAL RESPONDER PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Register Rescue Battalion
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Configure tactical team capacity, specialized gear, and primary operational sector for incident dispatch.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-600 transition-all duration-300 -z-0"
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
                        ? 'bg-amber-600 text-white'
                        : isCurrent
                        ? 'bg-white border-2 border-amber-600 text-amber-700 ring-4 ring-amber-50'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 tracking-tight hidden sm:block ${
                      isCurrent ? 'text-amber-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center text-xs text-slate-500 font-mono font-medium sm:hidden">
            Step {currentStep} of {totalSteps}: <strong className="text-amber-700">{stepTitles[currentStep - 1]}</strong>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Rescue Team Registered!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Welcome, <strong>{fullName}</strong>. Team <strong>{teamName}</strong> ({agency}) has been logged into the DEOC tactical coordination directory.
              </p>

              <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono text-amber-950">
                <p>🎖️ Call Sign / ID: <strong>{employeeId}</strong></p>
                <p>👥 Active Personnel: <strong>{teamMembersCount} Responders</strong></p>
                <p>📍 Tactical Sector: <strong>{primaryOperatingRegion}</strong></p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onSuccess}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-3 font-bold text-xs text-white shadow-sm transition-all"
                >
                  <span>Enter Rescue Operations Dashboard</span>
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
              {/* STEP 1: PERSONNEL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-amber-600" />
                      <span>Step 1 — Personnel Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Identify the designated team commander or operations point of contact.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name (Officer / Lead) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Capt. Rajesh Kumar"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Official Agency Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@sdrf.gov.in"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mobile Number (Tactical Alert Line) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 94471..."
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
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
                          className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pr-9 text-slate-900 text-xs font-mono focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
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
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                      />
                      {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ORGANIZATION */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-amber-600" />
                      <span>Step 2 — Organization & Agency</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Specify the disaster response force affiliation and team credentials.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Organization / Agency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                    >
                      <option value="National Disaster Response Force (NDRF)">National Disaster Response Force (NDRF)</option>
                      <option value="Kerala State Disaster Response Force (SDRF)">Kerala State Disaster Response Force (SDRF)</option>
                      <option value="Kerala Fire & Rescue Services">Kerala Fire & Rescue Services</option>
                      <option value="Indian Army Mountain Rescue Wing">Indian Army Mountain Rescue Wing</option>
                      <option value="Civil Defence & Volunteer Task Force">Civil Defence & Volunteer Task Force</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Team Name / Unit Identifier <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Alpha Unit 04"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                      {errors.teamName && <p className="text-[11px] text-red-600 mt-1">{errors.teamName}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Designation / Role Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Assistant Commandant"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                      {errors.designation && <p className="text-[11px] text-red-600 mt-1">{errors.designation}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Team ID / Employee ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="e.g. SDRF-WYD-401"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-amber-600 focus:outline-none"
                      />
                      {errors.employeeId && <p className="text-[11px] text-red-600 mt-1">{errors.employeeId}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Operational Region
                      </label>
                      <input
                        type="text"
                        value={operationalRegion}
                        onChange={(e) => setOperationalRegion(e.target.value)}
                        placeholder="e.g. Wayanad High Ranges"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: TEAM INFORMATION */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-600" />
                      <span>Step 3 — Team Information & Equipment</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Log manpower and logistical assets available for immediate disaster dispatch.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Number of Team Members <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={teamMembersCount}
                        onChange={(e) => setTeamMembersCount(parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-amber-600 focus:outline-none"
                      />
                      {errors.teamMembersCount && <p className="text-[11px] text-red-600 mt-1">{errors.teamMembersCount}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Vehicle Availability <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicleAvailability}
                        onChange={(e) => setVehicleAvailability(e.target.value)}
                        placeholder="e.g. 3x 4WD, 1x Transport, 2x Boats"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Specialized Equipment Badges */}
                  <div className="space-y-3 pt-2">
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                      <strong className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertOctagon className="h-3.5 w-3.5 text-amber-600" />
                        <span>Rescue & Extraction Equipment:</span>
                      </strong>
                      <p className="text-xs text-slate-600">{rescueEquipment.join(' • ')}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                      <strong className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Medical & Trauma Support:</span>
                      </strong>
                      <p className="text-xs text-slate-600">{medicalEquipment.join(' • ')}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                      <strong className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-blue-600" />
                        <span>Communications & Radio Gear:</span>
                      </strong>
                      <p className="text-xs text-slate-600">{communicationEquipment.join(' • ')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: OPERATIONAL AREA */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      <span>Step 4 — Operational Area</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Define the primary geographic sector for triage assignment and route clearance.
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
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Primary Operating Region / Sector <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={primaryOperatingRegion}
                      onChange={(e) => setPrimaryOperatingRegion(e.target.value)}
                      placeholder="e.g. Meppadi - Chooralmala Sector"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-amber-600 focus:outline-none"
                    />
                    {errors.primaryOperatingRegion && <p className="text-[11px] text-red-600 mt-1">{errors.primaryOperatingRegion}</p>}
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      The rescue live map will orient your battalion to real-time bridge washouts, debris blockages, and priority triage locations in <strong>{district}</strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Step 5 — Review & Submit</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review battalion credentials before requesting operational deployment status.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-2">1. Officer & Force</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <p>Lead: <strong className="text-slate-900">{fullName}</strong></p>
                        <p>Designation: <strong className="text-slate-900">{designation}</strong></p>
                        <p>Agency: <strong className="text-slate-900">{agency}</strong></p>
                        <p>ID / Call Sign: <strong className="text-slate-900 font-mono">{employeeId}</strong></p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-2">2. Tactical Team Readiness</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <p>Personnel: <strong className="text-slate-900">{teamMembersCount} Responders</strong></p>
                        <p>Fleet: <strong className="text-slate-900">{vehicleAvailability}</strong></p>
                        <p className="col-span-2">Sector: <strong className="text-slate-900">{primaryOperatingRegion}, {district}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Verification Notice */}
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900">
                      <strong className="block text-amber-950 font-bold">OPERATIONAL PROTOCOL NOTICE:</strong>
                      <p className="mt-0.5 leading-relaxed">
                        Verification may be required before operational access is granted by the District Emergency Operations Center (DEOC). Demo access is automatically activated for training exercises.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
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
                    className="flex items-center gap-2 rounded-lg bg-amber-700 hover:bg-amber-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>Continue to {stepTitles[currentStep]}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-amber-700 hover:bg-amber-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>{submitting ? 'Registering...' : 'Register Rescue Team Account'}</span>
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
        <p>LANDSAFE • Tactical Rescue Incident Network • NDRF / SDRF Interoperable</p>
      </footer>
    </div>
  );
};
