import React, { useState } from 'react';
import { MOCK_AI_INSIGHTS } from '../../data/mockHazards';
import { AIInsight } from '../../types/hazard';
import { RiskBadge } from '../common/RiskBadge';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CloudRain,
  Layers,
  Mountain,
  Activity,
  BrainCircuit,
} from 'lucide-react';

export const AIInsightsConsole: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight>(MOCK_AI_INSIGHTS[0]);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI EARLY WARNING INTELLIGENCE</span>
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            AI Insights
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            AI landslide predictions and explanations of why risk is increasing.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs flex items-center gap-2 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-blue-900 font-bold font-mono">
            AI Early Warning Active
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Detected Warnings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Recent AI Detections
          </h3>

          <div className="space-y-3">
            {MOCK_AI_INSIGHTS.map((insight) => {
              const isSelected = selectedInsight.id === insight.id;
              return (
                <div
                  key={insight.id}
                  onClick={() => setSelectedInsight(insight)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <RiskBadge level={insight.severity} size="sm" showPulse={false} />
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {insight.modelConfidencePct}% Confidence
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{insight.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{insight.summary}</p>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="font-sans font-medium text-slate-700">📍 {insight.zoneName}</span>
                    <span>{insight.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Simple Explanations & AI Prediction */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1: AI Prediction Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase font-mono tracking-wider">
                  PREDICTION FOR: {selectedInsight.zoneName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  AI Prediction
                </h3>
              </div>
              <RiskBadge level={selectedInsight.severity} />
            </div>

            {/* AI Prediction 3 Metrics as specified: Current Risk 82%, Expected Risk 92%, Confidence 87% */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Current Risk</span>
                <p className="text-3xl font-extrabold font-mono text-slate-900">82%</p>
                <span className="text-[11px] text-red-600 font-bold">High Risk Area</span>
              </div>

              <div className="rounded-xl bg-red-50/70 border border-red-200 p-3.5 space-y-1">
                <span className="text-xs font-semibold text-red-700 block">Expected Risk (+3h)</span>
                <p className="text-3xl font-extrabold font-mono text-red-600">92%</p>
                <span className="text-[11px] text-red-700 font-bold">Escalating fast</span>
              </div>

              <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3.5 space-y-1">
                <span className="text-xs font-semibold text-blue-800 block">Confidence</span>
                <p className="text-3xl font-extrabold font-mono text-blue-700">87%</p>
                <span className="text-[11px] text-blue-700 font-medium">Multi-sensor match</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              "{selectedInsight.summary}"
            </p>
          </div>

          {/* Section 2: Why Risk Is Increasing as specified */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-3">
              Why Risk Is Increasing
            </h3>

            <p className="text-xs text-slate-600">
              Risk is increasing mainly because of the following four conditions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <CloudRain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Heavy Rainfall</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    142 mm of rain fell in the last 24 hours, continuing to add water weight to the hillside.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">High Soil Wetness</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Ground moisture is at 94%, meaning the soil cannot absorb any more water and is losing cohesion.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Mountain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Steep Slopes</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Hillside slope angle exceeds 38°, making gravity pull water-saturated soil downward rapidly.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-start gap-2.5 text-xs">
                <div className="h-7 w-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Recent Ground Movement</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Sub-surface inclinometer sensors have detected 32 mm of soil creep along the bedrock interface.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Recommended Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Recommended Actions for Responders</span>
            </h3>

            <ul className="space-y-2 text-xs">
              {selectedInsight.recommendedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-slate-800">
                  <span className="text-emerald-600 font-bold text-base leading-none">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Collapsible "View AI Technical Details" for hackathon demo */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Technical Model Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  XGBoost ensemble architecture and SHAP feature attribution weights
                </p>
              </div>

              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
              >
                <span>{showTechnicalDetails ? 'Hide AI Technical Details' : 'View AI Technical Details'}</span>
                {showTechnicalDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {showTechnicalDetails ? (
              <div className="space-y-3 pt-3 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                  <span>Model: XGBoost Classifier v2.4 (Gradient Boosted Decision Trees)</span>
                  <span className="text-blue-700 font-bold">AUC: 0.942</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                    Feature Attribution Weights (SHAP Values)
                  </span>
                  {selectedInsight.contributingFactors.map((factor, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 font-semibold">{factor.factor}</span>
                        <span className="font-mono font-bold text-blue-700">{factor.importancePct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${factor.importancePct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-500">
                Click "View AI Technical Details" to inspect ML model weights and SHAP parameters for hackathon judges.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
