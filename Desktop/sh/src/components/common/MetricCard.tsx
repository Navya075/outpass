import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'teal';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtitle,
  trend,
  trendLabel,
  icon: Icon,
  variant = 'default',
  className = '',
}) => {
  // Clean white surfaces with semantic subtle border tints only when critical or warning
  const cardBorder = {
    default: 'border-slate-200/80 bg-white hover:border-slate-300',
    critical: 'border-red-200 bg-white hover:border-red-300',
    warning: 'border-amber-200 bg-white hover:border-amber-300',
    success: 'border-emerald-200 bg-white hover:border-emerald-300',
    teal: 'border-teal-200 bg-white hover:border-teal-300',
  }[variant];

  const iconStyles = {
    default: 'text-blue-700 bg-blue-50 border-blue-100',
    critical: 'text-red-700 bg-red-50 border-red-100',
    warning: 'text-amber-700 bg-amber-50 border-amber-100',
    success: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    teal: 'text-teal-700 bg-teal-50 border-teal-100',
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-2xs transition-all duration-200 ${cardBorder} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl font-sans">
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-slate-500 font-mono">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconStyles}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(subtitle || trendLabel) && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
          {subtitle && <span className="text-slate-500 font-medium truncate max-w-[170px]">{subtitle}</span>}
          {trendLabel && (
            <span
              className={`font-semibold shrink-0 ${
                trend === 'up'
                  ? 'text-red-700'
                  : trend === 'down'
                  ? 'text-emerald-700'
                  : 'text-slate-600'
              }`}
            >
              {trend === 'up' && '▲ '}
              {trend === 'down' && '▼ '}
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
