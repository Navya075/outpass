import React from 'react';
import { UserRole } from '../../types/user';
import {
  Shield,
  Radio,
  Users,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Droplets,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onNavigateLogin: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onNavigateLogin,
  onSelectRole,
}) => {
  const workflowStages = [
    { step: '01', title: 'SENSE', desc: 'Rainfall, terrain slope, soil moisture saturation & historical data', icon: Droplets, color: 'text-blue-700 bg-blue-50' },
    { step: '02', title: 'PREDICT', desc: 'XGBoost multi-hazard probability modeling with SHAP explanations', icon: Cpu, color: 'text-teal-700 bg-teal-50' },
    { step: '03', title: 'EVOLVE', desc: 'Dynamic temporal tracking & rapid risk acceleration detection', icon: TrendingUp, color: 'text-amber-700 bg-amber-50' },
    { step: '04', title: 'ASSESS', desc: 'Impact estimation on population, dwellings, roads & bridges', icon: Users, color: 'text-orange-700 bg-orange-50' },
    { step: '05', title: 'PRIORITIZE', desc: 'Response priority triage ranking (Urgency Levels 1, 2, 3)', icon: Flame, color: 'text-red-700 bg-red-50' },
    { step: '06', title: 'ACT', desc: 'Personalized safe evacuation routing & multi-channel alerts', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
  ];

  const innovations = [
    { num: '1', title: 'Risk Evolution Intelligence', desc: 'Track how hazard risk is changing dynamically over time, not just static 24-hour snapshot probabilities.' },
    { num: '2', title: 'Actionable Lead Time', desc: 'Convert predicted probabilities into the exact estimated minutes remaining before critical slope failure threshold.' },
    { num: '3', title: 'Impact-Aware Risk', desc: 'Combine raw hazard severity with vulnerable population, dwellings, and critical infrastructure exposure.' },
    { num: '4', title: 'Response Prioritization', desc: 'Rank where emergency teams should act first using risk, exposure, lead time, and route accessibility.' },
    { num: '5', title: 'Multi-Hazard & Cascading', desc: 'Connect landslides and flash floods to capture downstream culvert blockages and secondary hazards.' },
    { num: '6', title: 'Communication-Resilient Alerts', desc: 'Deliver role-specific warnings through Push notifications, SMS fallbacks, and localized sirens.' },
    { num: '7', title: 'Personalized Evacuation', desc: 'Generate live turn-by-turn safe routes avoiding blocked passes, directly to active shelters with bed capacity.' },
    { num: '8', title: 'Confidence-Aware Warnings', desc: 'Communicate ML prediction confidence intervals alongside risk scores to support responsible command decisions.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Banner Ticker */}
      <div className="bg-red-50 border-b border-red-200 text-[11px] font-semibold text-red-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="font-bold uppercase tracking-wider text-red-700">DISASTER INTELLIGENCE PLATFORM:</span>
          <span className="truncate text-red-900">
            Addressing critical early warning and evacuation gaps exposed by the 2024 Wayanad Landslides.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-red-800 font-mono text-[10px]">
          <span>GSI • IMD • NDMA • KSDMA COMPATIBLE</span>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm font-black">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">LANDSAFE</span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 uppercase">
                Production Ready
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wider text-slate-500 font-mono">
              PREDICT • UNDERSTAND • ACT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="text-xs font-semibold text-slate-700 hover:text-blue-700 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-6">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>AI-Powered Landslide Early Warning & Disaster Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Predict Hazard Evolution. Understand Impact. <span className="text-blue-700">Act in Time.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          An operational disaster-management platform designed for emergency authorities, first responders, and vulnerable citizens. Transforming continuous environmental signals into actionable lead time and personalized evacuation corridors.
        </p>

        {/* Primary Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 px-7 py-3.5 font-bold text-sm text-white shadow-sm transition-all"
          >
            <span>Get Started — Select Role</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onNavigateLogin}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-7 py-3.5 font-bold text-sm text-slate-700 transition-colors shadow-2xs"
          >
            Sign In to Existing Account
          </button>
        </div>

        {/* 3 Dedicated Role Overview Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          {/* Card 1: Citizen */}
          <div
            onClick={() => onSelectRole('citizen')}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-600 font-mono">
                  Role 1
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Citizen Portal</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Answers the vital question: <em>"Am I safe, and what should I do right now?"</em> Live threat gauge, personalized turn-by-turn evacuation route to safe shelter, and 1-tap SOS beacon.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Onboard as Citizen</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Rescue Team */}
          <div
            onClick={() => onSelectRole('rescue')}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-600 font-mono">
                  Role 2
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Rescue Operations</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tactical incident management for NDRF/SDRF commanders. Live situational map, prioritized response queue, road blockages, team tracking, and resource allocation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Onboard Rescue Battalion</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 3: Control Center */}
          <div
            onClick={() => onSelectRole('control')}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-red-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-700">
                  <Radio className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-600 font-mono">
                  Role 3
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Control Center (EOC)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Flagship command room dashboard. Multi-hazard GIS map with +6h time-slider forecast simulations, population consequence breakdown, and broadcast alert dispatcher.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>Onboard Control Center</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 6-Stage Core Workflow Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-slate-200 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 font-mono">
            END-TO-END DISASTER LIFECYCLE
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-1">
            Sense → Predict → Evolve → Assess → Prioritize → Act
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            The core architecture translating real-world environmental physics into timely field actions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {workflowStages.map((wf) => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.step}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{wf.step}</span>
                  <div className={`p-1.5 rounded-lg ${wf.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{wf.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug">{wf.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 Core Innovations / USPs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-700 font-mono">
            SCIENTIFIC CONTRIBUTIONS & ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-1">
            8 Pillars of Disaster Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Engineered to overcome systemic weaknesses of traditional static rainfall thresholds
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {innovations.map((inv) => (
            <div
              key={inv.num}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 hover:border-blue-300 shadow-sm transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 font-mono text-xs font-bold text-blue-700">
                {inv.num}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{inv.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{inv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Institutional Stakeholders */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 border-t border-slate-200 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono mb-4">
          DESIGNED IN ACCORDANCE WITH NATIONAL DISASTER FRAMEWORKS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 text-xs font-semibold font-mono">
          <span>NDMA (National)</span>
          <span>•</span>
          <span>KSDMA (Kerala State)</span>
          <span>•</span>
          <span>IMD (Meteorology)</span>
          <span>•</span>
          <span>NDRF & SDRF (First Responders)</span>
          <span>•</span>
          <span>District Collectorate</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Shield className="h-4 w-4 text-blue-700" />
          <span className="font-bold text-slate-900">LANDSAFE</span>
          <span>— Team AXIOM (PSID: SH-304)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          "Predict. Understand. Act." • AI-Powered Early Warning & Emergency Response
        </p>
      </footer>
    </div>
  );
};
