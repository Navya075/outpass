import React, { useState } from 'react';
import {
  Shield,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const [stage, setStage] = useState<'request' | 'verify' | 'success'>('request');
  const [identifier, setIdentifier] = useState('ananya.nair@wayanad.res.in');
  const [otpCode, setOtpCode] = useState('742891');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleRequestVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered email or mobile number.');
      return;
    }

    setIsSending(true);
    setError(null);
    setTimeout(() => {
      setIsSending(false);
      setStage('verify');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the verification code sent to your device.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setStage('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <div className="mx-auto w-full max-w-md flex items-center justify-between">
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-2xs font-black">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-lg font-black tracking-wider text-slate-900">LANDSAFE</span>
        </div>

        <button
          onClick={onNavigateLogin}
          className="text-xs font-bold text-blue-700 hover:underline"
        >
          Sign In
        </button>
      </div>

      {/* Main Container */}
      <div className="my-auto sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure disaster portal credential recovery for registered personnel and citizens
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* STAGE 1: REQUEST VERIFICATION */}
          {stage === 'request' && (
            <form onSubmit={handleRequestVerification} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Registered Email or Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or +91 94470..."
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-slate-900 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  We will send a 6-digit verification security code via SMS and registered email.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 py-2.5 font-bold text-white shadow-sm transition-all text-xs mt-2"
              >
                <KeyRound className="h-4 w-4" />
                <span>{isSending ? 'Sending Verification Code...' : 'Send Verification Code'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Remember your password? Sign In
                </button>
              </div>
            </form>
          )}

          {/* STAGE 2: VERIFY CODE & NEW PASSWORD */}
          {stage === 'verify' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-200 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-blue-700" />
                  <span>Verification Code Dispatched</span>
                </p>
                <p className="text-[11px] text-blue-800">
                  Enter the 6-digit token sent to <strong>{identifier}</strong>:
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  6-Digit Verification Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 742891"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 text-center text-sm font-mono tracking-widest font-bold focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 py-2 text-slate-900 text-xs font-mono focus:border-blue-600 focus:outline-none"
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

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 text-xs font-mono focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 py-2.5 font-bold text-white shadow-sm transition-all text-xs mt-2"
              >
                <span>Reset Password & Secure Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStage('request')}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Change Email / Phone
                </button>
                <button
                  type="button"
                  onClick={() => alert('New code sent: 742891')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STAGE 3: SUCCESS SCREEN */}
          {stage === 'success' && (
            <div className="text-center py-4 space-y-4 text-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Password Successfully Reset!
              </h2>
              <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your portal access credentials have been securely updated. You can now log into your operations dashboard.
              </p>
              <button
                onClick={onNavigateLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 py-3 font-bold text-white shadow-sm transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-md text-center text-[11px] text-slate-400 pt-6">
        <p>LANDSAFE • Disaster Management Authority Security Gateway</p>
      </footer>
    </div>
  );
};
