import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ForecastDataPoint } from '../../types/hazard';

interface RainfallSoilChartProps {
  data: ForecastDataPoint[];
}

export const RainfallSoilChart: React.FC<RainfallSoilChartProps> = ({ data }) => {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Compound Trigger: Rainfall vs Soil Saturation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Antecedent precipitation saturating pore pressure & triggering slope shear failure
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
          AWS & IN-SITU SENSORS
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#1d4ed8"
              tick={{ fill: '#1d4ed8', fontSize: 11 }}
              unit="mm"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke="#d97706"
              tick={{ fill: '#d97706', fontSize: 11 }}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs font-sans">
                      <p className="font-semibold text-slate-800 mb-1">{label}</p>
                      <p className="text-blue-700 font-semibold">
                        Rainfall Rate: {payload[0]?.value} mm/h
                      </p>
                      <p className="text-amber-700 font-semibold mt-0.5">
                        Soil Moisture Saturation: {payload[1]?.value}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => <span className="text-slate-600 font-medium">{value}</span>}
            />
            <Bar
              yAxisId="left"
              dataKey="rainfallMm"
              name="Rainfall (mm/h)"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="soilSaturationPct"
              name="Soil Saturation (%)"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#d97706' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
