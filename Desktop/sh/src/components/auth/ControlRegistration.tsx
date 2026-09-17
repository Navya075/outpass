import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ControlAccessLevel } from '../../types/user';
import {
  Radio,
  Shield,
  User,
  Building2,
  Landmark,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  BadgeCheck,
  ShieldAlert,
} from 'lucide-react';

interface ControlRegistrationProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
  onBackToRoles: () => void;
}

export const ControlRegistration: React.FC<ControlRegistrationProps> = ({
  onSuccess,
  onNavigateLogin,
  onNavigateLanding,
  onBackToRoles,
}) => {
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Official Details
  const [fullName, setFullName] = useState('Dr. Meera Namboodiri, IAS');
  const [email, setEmail] = useState('collector.wyd@kerala.gov.in');
  const [mobileNumber, setMobileNumber] = useState('+91 94470 00001');
  const [password, setPassword] = useState('SafePass@2026');
  const [confirmPassword, setConfirmPassword] = useState('SafePass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Organization
  const [department, setDepartment] = useState('District Disaster Management Authority (DDMA) / Revenue Dept');
  const [designation, setDesignation] = useState('District Collector & Chairperson DDMA');
  const [officialId, setOfficialId] = useState('IAS-KL-2014-992');
  const [region, setRegion] = useState('Wayanad District, Northern Kerala');

  // Step 3: Control Center Details
  const [controlCenterName, setControlCenterName] = useState('District Emergency Operations Center (DEOC Kalpetta)');
  const [operationalDistrict, setOperationalDistrict] = useState('Wayanad');
  const [state, setState] = useState('Kerala');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('04936 204151 / Toll-Free 1077');

  // Step 4: Access Level
  const [accessLevel, setAccessLevel] = useState<ControlAccessLevel>('Administrator');

  // Step 5: Submission & Verification
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!email.trim() || !email.includes('@')) newErrors.email = 'Official government email is required';
      if (!mobileNumber.trim() || mobileNumber.length < 10) newErrors.mobileNumber = 'Official mobile number is required';
      if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!department.trim()) newErrors.department = 'Department / Authority is required';
      if (!designation.trim()) newErrors.designation = 'Designation is required';
      if (!officialId.trim()) newErrors.officialId = 'Official Government ID is required';
    }

    if (step === 3) {
      if (!controlCenterName.trim()) newErrors.controlCenterName = 'Control Center Name is required';
      if (!operationalDistrict.trim()) newErrors.operationalDistrict = 'Operational District is required';
      if (!emergencyContactNumber.trim()) newErrors.emergencyContactNumber = 'Emergency helpline is required';
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
      role: 'control',
      department,
      designation,
      officialId,
      badgeNumber: officialId,
      agency: department,
      controlCenterName,
      operationalDistrict,
      emergencyContactNumber,
      accessLevel,
      location: {
        state,
        district: operationalDistrict,
        village: 'Kalpetta Collectorate DEOC',
        addressArea: 'Collectorate Complex, Kalpetta North',
        latitude: 11.6103,
        longitude: 76.0827,
      },
      emergencyContacts: [
        {
          id: 'cc-1',
          name: 'State Emergency Operations Center (SEOC)',
          relationship: 'State Command Desk',
          phone: '1070',
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
    'Official Details',
    'Department & ID',
    'Control Center',
    'Access Level',
    'Review & Submit',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-red-600 selection:text-white">
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-700 text-white shadow-2xs font-black">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-slate-900">LANDSAFE</span>
              <span className="ml-2 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200 uppercase">
                Control Authority
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Have official login?</span>
            <button
              onClick={onNavigateLogin}
              className="text-red-700 font-bold hover:underline"
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
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest font-mono">
            DISASTER MANAGEMENT AUTHORITY ONBOARDING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Request Control Center Access
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Incident command room authorization for District Emergency Operations Centers (DEOC) and State Command Desks.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 transition-all duration-300 -z-0"
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
                        ? 'bg-red-600 text-white'
                        : isCurrent
                        ? 'bg-white border-2 border-red-600 text-red-700 ring-4 ring-red-50'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 tracking-tight hidden sm:block ${
                      isCurrent ? 'text-red-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-center text-xs text-slate-500 font-mono font-medium sm:hidden">
            Step {currentStep} of {totalSteps}: <strong className="text-red-700">{stepTitles[currentStep - 1]}</strong>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-red-600">
                <Radio className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Control Room Authorization Granted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Welcome, <strong>{fullName}</strong>. Your authority account for <strong>{controlCenterName}</strong> is active with <strong>{accessLevel}</strong> privileges.
              </p>

              <div className="rounded-xl bg-red-50/70 p-4 border border-red-200 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono text-red-950">
                <p>🏛️ Authority: <strong>{department}</strong></p>
                <p>🆔 Official Credentials: <strong>{officialId}</strong></p>
                <p>🔑 Access Level: <strong>{accessLevel}</strong></p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onSuccess}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-red-700 hover:bg-red-800 px-6 py-3 font-bold text-xs text-white shadow-sm transition-all"
                >
                  <span>Enter Control Center (EOC) Dashboard</span>
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
              {/* STEP 1: OFFICIAL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-red-600" />
                      <span>Step 1 — Official Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Identify authorized incident commanders and emergency management officials.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name & Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Meera Namboodiri, IAS"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Official Government Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="collector.wyd@kerala.gov.in"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mobile Number (Encrypted Gateway) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 94470..."
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                          className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pr-9 text-slate-900 text-xs font-mono focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                      <Landmark className="h-4 w-4 text-red-600" />
                      <span>Step 2 — Department & Authority Identification</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify state or national disaster management branch credentials.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Department / Authority <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. District Disaster Management Authority (DDMA)"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                    />
                    {errors.department && <p className="text-[11px] text-red-600 mt-1">{errors.department}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Designation / Official Post <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. District Collector"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                      />
                      {errors.designation && <p className="text-[11px] text-red-600 mt-1">{errors.designation}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Official ID / Cadre Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={officialId}
                        onChange={(e) => setOfficialId(e.target.value)}
                        placeholder="e.g. IAS-KL-2014-992"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-red-600 focus:outline-none"
                      />
                      {errors.officialId && <p className="text-[11px] text-red-600 mt-1">{errors.officialId}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      District / Jurisdiction Region
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. Wayanad District"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CONTROL CENTER DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-red-600" />
                      <span>Step 3 — Control Center Facility</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assign the physical or regional emergency room command post.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Control Center Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={controlCenterName}
                      onChange={(e) => setControlCenterName(e.target.value)}
                      placeholder="e.g. District Emergency Operations Center (DEOC Kalpetta)"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                    />
                    {errors.controlCenterName && <p className="text-[11px] text-red-600 mt-1">{errors.controlCenterName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Operational District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={operationalDistrict}
                        onChange={(e) => setOperationalDistrict(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                      />
                      {errors.operationalDistrict && <p className="text-[11px] text-red-600 mt-1">{errors.operationalDistrict}</p>}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-medium focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Emergency Room Dedicated Hotline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={emergencyContactNumber}
                      onChange={(e) => setEmergencyContactNumber(e.target.value)}
                      placeholder="e.g. 04936 204151 / 1077"
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-xs font-mono focus:border-red-600 focus:outline-none"
                    />
                    {errors.emergencyContactNumber && <p className="text-[11px] text-red-600 mt-1">{errors.emergencyContactNumber}</p>}
                  </div>
                </div>
              )}

              {/* STEP 4: ACCESS LEVEL */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-red-600" />
                      <span>Step 4 — Command Access Level</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select operational clearance required for hazard broadcast and multi-agency triage.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {([
                      {
                        level: 'Operator' as ControlAccessLevel,
                        title: 'Level 1: Duty Operator',
                        desc: 'Monitors real-time telemetry, drafts CAP alerts, logs incoming distress calls, and reviews automated AI model probabilities.',
                        badge: 'Standard Clearance',
                      },
                      {
                        level: 'Supervisor' as ControlAccessLevel,
                        title: 'Level 2: Shift Supervisor',
                        desc: 'Authorizes broadcast alerts across telecommunication gateways, deploys field rescue battalions, and signs off on evacuation directives.',
                        badge: 'Operational Clearance',
                      },
                      {
                        level: 'Administrator' as ControlAccessLevel,
                        title: 'Level 3: Incident Commander / District Magistrate',
                        desc: 'Full executive command. Overrides AI lead-time thresholds, declares regional disaster zones, triggers national mutual aid (NDRF/Army).',
                        badge: 'Full Executive Clearance',
                      },
                    ]).map((opt) => {
                      const isSelected = accessLevel === opt.level;
                      return (
                        <div
                          key={opt.level}
                          onClick={() => setAccessLevel(opt.level)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50/60 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>{opt.title}</span>
                              {isSelected && <BadgeCheck className="h-4 w-4 text-red-600" />}
                            </strong>
                            <span className="text-[10px] font-bold font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUBMIT */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Step 5 — Review & Submit Authorization Request</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify official credentials prior to activating control room access.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-2">1. Official Identity & Authority</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <p>Official: <strong className="text-slate-900">{fullName}</strong></p>
                        <p>Designation: <strong className="text-slate-900">{designation}</strong></p>
                        <p>Department: <strong className="text-slate-900">{department}</strong></p>
                        <p>Govt ID: <strong className="text-slate-900 font-mono">{officialId}</strong></p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-2">2. Operations Center & Role</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <p>Facility: <strong className="text-slate-900">{controlCenterName}</strong></p>
                        <p>Hotline: <strong className="text-slate-900 font-mono">{emergencyContactNumber}</strong></p>
                        <p>Jurisdiction: <strong className="text-slate-900">{operationalDistrict}, {state}</strong></p>
                        <p>Access Clearance: <strong className="text-red-700 font-bold">{accessLevel}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Authorization Notice */}
                  <div className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-900">
                      <strong className="block text-red-950 font-bold">STATUTORY DISASTER AUTHORITY NOTICE:</strong>
                      <p className="mt-0.5 leading-relaxed">
                        Control Center access requires authorization under the Disaster Management Act, 2005. Demo command credentials are automatically verified for authorized hackathon evaluators.
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
                    className="flex items-center gap-2 rounded-lg bg-red-700 hover:bg-red-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>Continue to {stepTitles[currentStep]}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-red-700 hover:bg-red-800 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all ml-auto"
                  >
                    <span>{submitting ? 'Requesting Clearance...' : 'Request Control Center Access'}</span>
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
        <p>LANDSAFE • Incident Command & Early Warning Operations Room • DEOC Wayanad</p>
      </footer>
    </div>
  );
};
