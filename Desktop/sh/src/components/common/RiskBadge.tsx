import React from 'react';
import { RiskLevel } from '../../types/hazard';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showPulse = true }) => {
  const config = {
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
      label: 'Low Risk',
    },
    moderate: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-600',
      label: 'Moderate',
    },
    high: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      dot: 'bg-orange-600',
      label: 'High Risk',
    },
    critical: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      dot: 'bg-red-600',
      label: 'Critical',
    },
  }[level];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold tracking-wide',
    lg: 'px-3.5 py-1.5 text-sm font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-2xs`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && level === 'critical' && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
      </span>
      {config.label}
    </span>
  );
};
