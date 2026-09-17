import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { ForecastDataPoint } from '../../types/hazard';

interface RiskEvolutionChartProps {
  data: ForecastDataPoint[];
  zoneName: string;
}

export const RiskEvolutionChart: React.FC<RiskEvolutionChartProps> = ({ data, zoneName }) => {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Dynamic Risk Evolution & Forecast</span>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
              {zoneName}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly progression & +6-Hour predictive AI trajectory
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
            <span className="text-slate-600 font-medium">Risk Probability (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 border-t-2 border-dashed border-red-500" />
            <span className="text-red-600 font-semibold">Failure Threshold (80%)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={{ stroke: '#e2e8f0' }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const item = payload[0].payload as ForecastDataPoint;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs font-sans">
                      <p className="font-semibold text-slate-800 mb-1">Time Horizon: {label}</p>
                      <p className="text-red-600 font-bold text-sm">
                        Risk Score: {val}%
                      </p>
                      <p className="text-slate-600 mt-1">
                        Rainfall: <span className="font-semibold text-blue-700">{item.rainfallMm} mm</span>
                      </p>
                      <p className="text-slate-600">
                        Soil Moisture: <span className="font-semibold text-amber-600">{item.soilSaturationPct}%</span>
                      </p>
                      <p className="text-slate-500 text-[11px] mt-1 border-t border-slate-100 pt-1">
                        Actionable Lead Time: <span className="font-mono font-semibold text-emerald-700">{Math.floor(item.leadTimeMinutes / 60)}h {item.leadTimeMinutes % 60}m</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={80}
              stroke="#dc2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Critical Threshold (80%)',
                fill: '#dc2626',
                position: 'insideTopRight',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="riskProbabilityPct"
              stroke="#dc2626"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#riskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
