import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HazardZone } from '../../types/hazard';

interface ImpactBreakdownChartProps {
  zones: HazardZone[];
}

export const ImpactBreakdownChart: React.FC<ImpactBreakdownChartProps> = ({ zones }) => {
  const chartData = zones.slice(0, 5).map((z) => ({
    name: z.name.split(' ')[0],
    totalPop: z.exposure.totalPopulation,
    vulnerablePop: z.exposure.vulnerablePopulation,
    buildings: z.exposure.residentialBuildings,
    riskScore: z.riskScore,
  }));

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Comparative Population Exposure & Critical Structures
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown across highest-risk mountain sectors
          </p>
        </div>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          CENSUS & OSM GIS
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
                      <p className="font-semibold text-slate-800 mb-1">{label} Sector</p>
                      <p className="text-blue-700">Total Population: {payload[0]?.value?.toLocaleString()}</p>
                      <p className="text-orange-700">Vulnerable Individuals: {payload[1]?.value?.toLocaleString()}</p>
                      <p className="text-teal-700">Residential Structures: {payload[2]?.value?.toLocaleString()}</p>
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
            <Bar dataKey="totalPop" name="Total Population" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vulnerablePop" name="Vulnerable (Elderly/Children)" fill="#ea580c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="buildings" name="Dwellings / Buildings" fill="#0d9488" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
