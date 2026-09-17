import React from 'react';
import type { DocumentStatus } from '@/services/mockDb';
import { cn } from '@/lib/utils';
import { Check, XCircle, Archive, Circle } from 'lucide-react';

interface WorkflowStepperProps {
  status: DocumentStatus;
  className?: string;
}

const mainSteps: { status: DocumentStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'submitted', label: 'Submitted' },
  { status: 'approved', label: 'Approved' },
  { status: 'published', label: 'Published' },
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ status, className }) => {
  const isArchived = status === 'archived';
  const isRejected = status === 'rejected';

  // Get index in main timeline
  const activeIndex = mainSteps.findIndex((step) => step.status === status);
  const maxCompletedIndex = isArchived 
    ? -1 
    : isRejected 
      ? 0 // Draft is active/completed, rejected is branch
      : activeIndex;

  return (
    <div className={cn("w-full py-5 px-4 bg-white rounded-xl border border-slate-200 shadow-2xs", className)}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 relative w-full">
        {/* Main timeline */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full relative z-10 md:px-8">
          {mainSteps.map((step, index) => {
            const isCompleted = index < maxCompletedIndex;
            const isActive = index === maxCompletedIndex && !isArchived && !isRejected;
            
            return (
              <React.Fragment key={step.status}>
                {/* Node */}
                <div className="flex flex-col items-center gap-2 group relative">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-emerald-50 border-emerald-600 text-emerald-600 shadow-xs",
                      isActive && "bg-zinc-900 border-zinc-900 text-white shadow-xs scale-105",
                      (!isCompleted && !isActive) && "bg-slate-100 border-slate-300 text-slate-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <Circle className={cn("h-2.5 w-2.5 fill-current", isActive && "h-2 w-2")} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight transition-colors",
                      isActive ? "text-zinc-900 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Line between nodes */}
                {index < mainSteps.length - 1 && (
                  <div className="hidden md:block flex-1 h-[2px] bg-slate-200 mx-4 relative rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-full bg-zinc-900 transition-all duration-500",
                        index < maxCompletedIndex ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Alternate branches: Rejected and Archived overlay */}
        {(isRejected || isArchived) && (
          <div className="w-full border-t border-dashed border-slate-200 pt-4 flex justify-center gap-8">
            {isRejected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <XCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-semibold">Rejected Branch: Awaiting Author Reopen</span>
              </div>
            )}
            
            {isArchived && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-700">
                <Archive className="h-4 w-4 shrink-0" />
                <span className="text-xs font-semibold">Terminal State: Archived</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default WorkflowStepper;
