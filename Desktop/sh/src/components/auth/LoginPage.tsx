import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  User,
  Radio,
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (role: UserRole) => void;
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
  onNavigateLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgot,
  onNavigateLanding,
}) => {
  const { login, switchRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [identifier, setIdentifier] = useState('ananya.nair@wayanad.res.in');
  const [password, setPassword] = useState('SafePass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleCredentials: Record<UserRole, { identifier: string; label: string; helper: string; icon: any }> = {
    citizen: {
      identifier: 'ananya.nair@wayanad.res.in',
      label: 'Citizen Resident',
      helper: 'Registered residential email or mobile number',
      icon: User,
    },
    rescue: {
      identifier: 'rajesh.kumar@sdrf.kerala.gov.in',
      label: 'Rescue Team',
      helper: 'Official force email or team call sign ID',
      icon: ShieldAlert,
    },
    control: {
      identifier: 'collector.wyd@kerala.gov.in',
      label: 'Control Center (EOC)',
      helper: 'Disaster management official ID / Govt email',
      icon: Radio,
    },
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(roleCredentials[role].identifier);
    setErrorMessage(null);
  };

  const handleDemoQuickLogin = (role: UserRole) => {
    switchRole(role);
    onSuccess(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both your identifier and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await login(identifier, password, selectedRole);
      setLoading(false);
      onSuccess(selectedRole);
    } catch (err) {
      setLoading(false);
      setErrorMessage('Authentication failed. Please verify credentials.');
    }
  };

  const ActiveRoleIcon = roleCredentials[selectedRole].icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <div className="mx-auto w-full max-w-md flex items-center justify-between">
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-2xs font-black">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-lg font-black tracking-wider text-slate-900">LANDSAFE</span>
        </div>

        <button
          onClick={onNavigateRegister}
          className="text-xs font-bold text-blue-700 hover:underline"
        >
          Register
        </button>
      </div>

      {/* Main Login Card */}
      <div className="my-auto sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to LANDSAFE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your disaster intelligence console, evacuation routing, or incident command desk
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-5">
          {/* 1. DEMO QUICK LOGIN (Clearly labelled as requested) */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
            <div className="flex items-center justify-between text-blue-900 font-bold font-mono text-[10px] tracking-wider uppercase">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                <span>DEMO QUICK LOGIN (HACKATHON SHORTCUT)</span>
              </span>
              <span className="rounded bg-blue-200/80 px-1.5 py-0.5 text-[9px] text-blue-900 font-bold">
                1-CLICK
              </span>
            </div>

            <p className="text-[11px] text-blue-800 leading-snug">
              Instant demo sign-in for evaluators. Automatically populates simulated live operational state:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('citizen')}
                className="p-2 rounded-lg bg-white hover:bg-blue-100/50 border border-blue-200 text-center transition-all shadow-2xs hover:border-blue-400 group"
              >
                <User className="h-4 w-4 text-blue-700 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-[11px] font-bold text-slate-900">Citizen Demo</span>
                <span className="block text-[9px] text-slate-500 font-mono">Meppadi Ward</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickLogin('rescue')}
                className="p-2 rounded-lg bg-white hover:bg-amber-100/50 border border-amber-200 text-center transition-all shadow-2xs hover:border-amber-400 group"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-[11px] font-bold text-slate-900">Rescue Demo</span>
                <span className="block text-[9px] text-slate-500 font-mono">SDRF Unit 04</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickLogin('control')}
                className="p-2 rounded-lg bg-white hover:bg-red-100/50 border border-red-200 text-center transition-all shadow-2xs hover:border-red-400 group"
              >
                <Radio className="h-4 w-4 text-red-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="block text-[11px] font-bold text-slate-900">Control Demo</span>
                <span className="block text-[9px] text-slate-500 font-mono">DEOC EOC Room</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 2. "Sign in as" Selector (Citizen / Rescue Team / Control Center) */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[10px] font-mono">
                Sign In As:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                {(['citizen', 'rescue', 'control'] as UserRole[]).map((r) => {
                  const isSelected = selectedRole === r;
                  const label =
                    r === 'citizen' ? 'Citizen' : r === 'rescue' ? 'Rescue Team' : 'Control Center';

                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                        isSelected
                          ? r === 'citizen'
                            ? 'bg-white text-blue-700 shadow-2xs ring-1 ring-slate-200'
                            : r === 'rescue'
                            ? 'bg-white text-amber-700 shadow-2xs ring-1 ring-slate-200'
                            : 'bg-white text-red-700 shadow-2xs ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Header Banner */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-blue-700 shadow-2xs">
                <ActiveRoleIcon className="h-3.5 w-3.5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900">
                  {roleCredentials[selectedRole].label}
                </p>
                <p className="text-[10px] text-slate-500">
                  {roleCredentials[selectedRole].helper}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Email / Mobile Number */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email / Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or mobile"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={onNavigateForgot}
                  className="text-[11px] font-semibold text-blue-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 py-2 text-slate-900 text-xs font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span className="text-slate-600 text-xs font-medium">Remember this terminal</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">256-Bit SSL Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-sm transition-all text-xs mt-3 ${
                selectedRole === 'citizen'
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : selectedRole === 'rescue'
                  ? 'bg-amber-700 hover:bg-amber-800'
                  : 'bg-red-700 hover:bg-red-800'
              }`}
            >
              <span>
                {loading
                  ? 'Authenticating Credentials...'
                  : `Sign In to ${roleCredentials[selectedRole].label}`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            <span>Don't have an operational account? </span>
            <button
              onClick={onNavigateRegister}
              className="text-blue-700 font-bold hover:underline"
            >
              Select Role & Register
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 pt-6">
        <p>LANDSAFE • Disaster Management Authority Security Policy</p>
      </footer>
    </div>
  );
};
