import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { Clock, AlertTriangle, Flame } from 'lucide-react';

export const LeadTimeUrgencyView: React.FC = () => {
  const { zones } = useHazard();

  const timeToActItems = [
    {
      location: 'Meppadi',
      timeToAct: '~1 hour 45 min',
      urgency: 'URGENT',
      urgencyColor: 'bg-red-600 text-white',
      borderClass: 'border-l-4 border-l-red-600',
      reason: 'Heavy rain rate (38 mm/h) and steep saturated hillside. Soil could give way within this window.',
      action: 'Start mandatory evacuation now before roads become impassable.',
    },
    {
      location: 'Chooralmala',
      timeToAct: '~3 hours',
      urgency: 'HIGH',
      urgencyColor: 'bg-amber-500 text-white',
      borderClass: 'border-l-4 border-l-amber-500',
      reason: 'Upper catchment runoff flowing into river channel. Approach bridge is under high stress.',
      action: 'Pre-position extraction boats and advise residents on riverbanks to move to higher ground.',
    },
    {
      location: 'Mundakkai',
      timeToAct: '~4 hours 30 min',
      urgency: 'NORMAL',
      urgencyColor: 'bg-slate-200 text-slate-800',
      borderClass: 'border-l-4 border-l-slate-400',
      reason: 'Moderate soil wetness with intermittent rain. Slope stability remains above critical threshold.',
      action: 'Active monitoring. Prepare community relief shelter at Government School.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            COUNTDOWN TO DANGER
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Time to Act
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Estimated time before conditions may become more dangerous.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs flex items-center gap-2 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
          <span className="text-red-700 font-mono font-bold">
            Most Urgent: Meppadi (~1h 45m remaining)
          </span>
        </div>
      </div>

      {/* Explanatory Banner as specified */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 shadow-2xs">
        <p className="font-semibold text-slate-900">
          <strong>What is "Time to Act"?</strong> Estimated time before conditions may become more dangerous.
        </p>
        <p className="text-slate-600 mt-0.5 leading-relaxed">
          This estimate shows how long responders and residents have to safely evacuate before rainfall and water-logged ground reach dangerous failure levels.
        </p>
      </div>

      {/* Cards: Meppadi (~1h 45m, URGENT), Chooralmala (~3h, HIGH), Mundakkai */}
      <div className="space-y-4">
        {timeToActItems.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 ${item.borderClass}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono">
                  #{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{item.location}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Time to Act:
                  </span>
                  <span className="text-xl font-black font-mono text-red-600">
                    {item.timeToAct}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono ${item.urgencyColor}`}>
                  {item.urgency}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p>
                <strong className="text-slate-800">Why this estimate? </strong>
                {item.reason}
              </p>
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200 text-slate-800">
                <strong className="text-blue-700 uppercase text-[10px] tracking-wider block">Recommended Action:</strong>
                <span className="text-xs font-medium">{item.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
