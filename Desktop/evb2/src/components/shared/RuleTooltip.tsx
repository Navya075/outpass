import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface RuleTooltipProps {
  content: string;
  disabled: boolean;
  children: React.ReactElement<{ className?: string; disabled?: boolean; onClick?: (e: React.MouseEvent) => void }>;
}

export const RuleTooltip: React.FC<RuleTooltipProps> = ({ content, disabled, children }) => {
  if (!disabled) return children;

  // Clone child but force disabled state, styling, and remove click handler
  const disabledChild = React.cloneElement(children, {
    disabled: true,
    className: `${children.props.className || ''} pointer-events-none opacity-50`,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Div handles hover state when child button is disabled/pointer-events-none */}
          <div className="inline-block cursor-not-allowed">
            {disabledChild}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-center">
          <span>{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default RuleTooltip;
