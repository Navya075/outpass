import React from 'react';
import { useHazard } from '../../context/HazardContext';
import { MetricCard } from '../common/MetricCard';
import { ImpactBreakdownChart } from '../charts/ImpactBreakdownChart';
import {
  Users,
  Building2,
  GraduationCap,
  HeartPulse,
  Route,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const ImpactAssessmentView: React.FC = () => {
  const { zones } = useHazard();

  // Aggregate counts
  const totalPop = zones.reduce((a, b) => a + b.exposure.totalPopulation, 0);
  const totalBuildings = zones.reduce((a, b) => a + b.exposure.residentialBuildings, 0);
  const totalSchools = zones.reduce((a, b) => a + b.exposure.schools, 0);
  const totalHospitals = zones.reduce((a, b) => a + b.exposure.hospitals, 0);
  const totalBridges = zones.reduce((a, b) => a + b.exposure.criticalBridges, 0);
  const totalRoadsKm = zones.reduce((a, b) => a + b.exposure.roadsKm, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            EXPOSURE & INFRASTRUCTURE
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            People & Places at Risk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Total count of people, homes, schools, hospitals, bridges, and roads in danger sectors.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs shadow-2xs">
          <span className="text-slate-500">Total People in Danger Sectors:</span>{' '}
          <strong className="text-red-600 font-mono font-bold">
            {totalPop.toLocaleString()} People
          </strong>
        </div>
      </div>

      {/* 6 Metric Cards as specified: People, Homes, Schools, Hospitals, Bridges, Roads */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          label="People at Risk"
          value={totalPop.toLocaleString()}
          variant="critical"
          subtitle="Residents in danger"
          icon={Users}
        />
        <MetricCard
          label="Homes"
          value={totalBuildings.toLocaleString()}
          variant="default"
          subtitle="Residential dwellings"
          icon={Building2}
        />
        <MetricCard
          label="Schools"
          value={totalSchools}
          variant="teal"
          subtitle="Educational facilities"
          icon={GraduationCap}
        />
        <MetricCard
          label="Hospitals"
          value={totalHospitals}
          variant="success"
          subtitle="Medical centers & clinics"
          icon={HeartPulse}
        />
        <MetricCard
          label="Bridges"
          value={totalBridges}
          variant="critical"
          subtitle="Critical crossings"
          icon={Flame}
        />
        <MetricCard
          label="Roads"
          value={`${Math.round(totalRoadsKm)} km`}
          variant="warning"
          subtitle="23 blocked sections"
          icon={Route}
        />
      </div>

      {/* Chart */}
      <ImpactBreakdownChart zones={zones} />

      {/* Area-by-Area Breakdown Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
          Breakdown by Area
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
              <tr>
                <th className="py-3 px-4">AREA</th>
                <th className="py-3 px-3">RISK</th>
                <th className="py-3 px-3">PEOPLE</th>
                <th className="py-3 px-3">HOMES</th>
                <th className="py-3 px-3">SCHOOLS</th>
                <th className="py-3 px-3">HOSPITALS</th>
                <th className="py-3 px-3">BRIDGES</th>
                <th className="py-3 px-3">ROADS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{zone.name}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border font-mono ${
                        zone.riskLevel === 'critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : zone.riskLevel === 'high'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {zone.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {zone.exposure.totalPopulation.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {zone.exposure.residentialBuildings}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{zone.exposure.schools}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{zone.exposure.hospitals}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{zone.exposure.criticalBridges}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{Math.round(zone.exposure.roadsKm)} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
