import React from 'react';
import { MOCK_RESCUE_TEAMS } from '../../data/mockMissions';
import { Users, Truck, MapPin, Phone, Shield } from 'lucide-react';

export const RescueTeams: React.FC = () => {
  const getSimpleStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono">
            Available
          </span>
        );
      case 'on_mission':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono animate-pulse">
            On Mission
          </span>
        );
      case 'returning':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono">
            Returning
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono">
            Unavailable
          </span>
        );
    }
  };

  const getMissionDescription = (teamId: string) => {
    switch (teamId) {
      case 'team-sdrf-04':
        return 'Evacuate residents — Meppadi Ward 4';
      case 'team-ndrf-02':
        return 'River rescue & patrol — Chooralmala Riverbank';
      case 'team-fire-01':
        return 'Shelter transport — Mundakkai East';
      default:
        return 'None — Standing By';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            FIELD UNITS ROSTER
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Teams
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Available rescue personnel, vehicles, and current mission assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs shadow-2xs">
            <span className="text-slate-500">Total Teams:</span>{' '}
            <strong className="text-blue-700 font-mono font-bold">
              {MOCK_RESCUE_TEAMS.length} Active Teams ({MOCK_RESCUE_TEAMS.reduce((acc, t) => acc + t.memberCount, 0)} Responders)
            </strong>
          </div>
        </div>
      </div>

      {/* Teams Grid — Showing Team Name, Members, Location, Status, Vehicle, Current Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_RESCUE_TEAMS.map((team) => (
          <div
            key={team.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              {/* Top: Team Name & Status */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">{team.agency}</span>
                </div>
                {getSimpleStatusBadge(team.status)}
              </div>

              {/* Required Details: Members, Location, Vehicle, Current Mission */}
              <div className="rounded-lg bg-slate-50 p-3.5 text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Members:</span>
                  <strong className="text-slate-900">{team.memberCount} members</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <strong className="text-slate-800">{team.baseLocation}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-medium text-slate-800">{team.assignedVehicle}</span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Current Mission:
                  </span>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">
                    {getMissionDescription(team.id)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Leader: {team.leaderName}</span>
              <a
                href={`tel:${team.leaderContact}`}
                className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <Phone className="h-3 w-3 text-blue-600" />
                <span>Call Team</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
