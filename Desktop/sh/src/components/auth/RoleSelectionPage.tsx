import React from 'react';
import { UserRole } from '../../types/user';
import {
  Shield,
  Users,
  ShieldAlert,
  Radio,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onSelectRole,
  onNavigateLogin,
  onNavigateLanding,
}) => {
  const roles = [
    {
      id: 'citizen' as UserRole,
      title: 'CITIZEN',
      badge: 'Public Safety',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Users,
      iconBg: 'bg-blue-50 border-blue-200 text-blue-700',
      buttonBg: 'bg-blue-700 hover:bg-blue-800 text-white',
      accentBorder: 'hover:border-blue-500',
      description: 'Monitor your local risk, receive warnings and get evacuation assistance.',
      features: [
        'Personalized landslide & rainfall danger level',
        'Turn-by-turn safe evacuation route to open shelters',
        '1-tap family SOS alert and emergency direct dialers',
        'Offline-ready 72h survival go-bag safety guide',
      ],
      targetAudience: 'Residents, plantation workers & local communities in high-risk zones',
    },
    {
      id: 'rescue' as UserRole,
      title: 'RESCUE TEAM',
      badge: 'Tactical Field Ops',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: ShieldAlert,
      iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
      buttonBg: 'bg-amber-700 hover:bg-amber-800 text-white',
      accentBorder: 'hover:border-amber-500',
      description: 'Coordinate emergency missions, teams and resources.',
      features: [
        'Prioritized rescue triage queue with 1-click dispatch',
        'Arterial ghat pass & road blockage clearance status',
        'SDRF / NDRF team rosters & radio callsign monitoring',
        'Heavy machinery, boats & relief shelter capacity tracking',
      ],
      targetAudience: 'NDRF, SDRF, Fire & Rescue forces, and rapid emergency squads',
    },
    {
      id: 'control' as UserRole,
      title: 'CONTROL CENTER',
      badge: 'DEOC / Incident Command',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      icon: Radio,
      iconBg: 'bg-red-50 border-red-200 text-red-700',
      buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white',
      accentBorder: 'hover:border-slate-600',
      description: 'Monitor regional hazards and coordinate disaster response.',
      features: [
        'Multi-hazard regional GIS map with +6h forecast simulations',
        'CAP-CP v1.2 broadcast alert center (Cell Broadcast, SMS)',
        'Actionable lead time urgency matrix & population impact',
        'Explainable AI (XAI) feature attribution & geotechnical feeds',
      ],
      targetAudience: 'District Collectors, Disaster Management Officers & Incident Commanders',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateLanding}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Overview</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-2xs font-black">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-wider text-slate-900">LANDSAFE</span>
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
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">
            LANDSAFE ONBOARDING
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
            How will you use LANDSAFE?
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Select your operational role to enter the customized registration and decision-support workflow.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 flex flex-col justify-between ${role.accentBorder} hover:shadow-md`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${role.iconBg} shadow-2xs`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 mt-5">
                    {role.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Key Capabilities:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {role.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <p className="text-[11px] text-slate-400 mb-4 leading-tight italic">
                    Designed for: {role.targetAudience}
                  </p>
                  <button
                    onClick={() => onSelectRole(role.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-xs shadow-sm transition-all ${role.buttonBg}`}
                  >
                    <span>Continue as {role.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Data Integrity Assurance */}
        <div className="mt-10 mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-500 shadow-2xs flex items-center justify-center gap-2.5">
          <Lock className="h-4 w-4 text-blue-700 shrink-0" />
          <span>
            Strict role-based access control. Tactical responder and control center profiles require administrative credentials.
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400">
        <p>LANDSAFE Disaster Intelligence System • National Early Warning & Response Architecture</p>
      </footer>
    </div>
  );
};
