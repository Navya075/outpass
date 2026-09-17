import React, { useState } from 'react';
import { MOCK_MISSIONS, MOCK_RESCUE_TEAMS } from '../../data/mockMissions';
import { RescueMission, MissionStatus } from '../../types/mission';
import { HazardZone, RiskLevel } from '../../types/hazard';
import { missionService } from '../../services/missionService';
import { RiskBadge } from '../common/RiskBadge';
import { Modal } from '../common/Modal';
import {
  Workflow,
  Plus,
  Navigation,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  Truck,
  ArrowRight,
  Filter,
  Check,
  Eye,
  Edit,
} from 'lucide-react';

interface RescueMissionsProps {
  initialSelectedZone?: HazardZone | null;
  onNavigate: (tabId: string) => void;
}

// 5-step simple operational flow as specified:
// Assigned → On the Way → At Location → Helping Residents → Completed
type SimpleMissionStage = 'Assigned' | 'On the Way' | 'At Location' | 'Helping Residents' | 'Completed';

export const RescueMissions: React.FC<RescueMissionsProps> = ({
  initialSelectedZone,
  onNavigate,
}) => {
  const [missions, setMissions] = useState<RescueMission[]>(MOCK_MISSIONS);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Simple stage mapping helper
  const getSimpleStatus = (status: string): SimpleMissionStage => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'en_route': return 'On the Way';
      case 'on_site': return 'At Location';
      case 'evacuating': return 'Helping Residents';
      case 'completed': return 'Completed';
      default: return 'Assigned';
    }
  };

  const getStatusColor = (stage: SimpleMissionStage) => {
    switch (stage) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Helping Residents': return 'bg-red-50 text-red-700 border-red-200 animate-pulse font-bold';
      case 'At Location': return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'On the Way': return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Modals state
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [selectedMissionDetails, setSelectedMissionDetails] = useState<RescueMission | null>(null);
  const [activeMissionForUpdate, setActiveMissionForUpdate] = useState<RescueMission | null>(null);
  const [activeMissionForAssign, setActiveMissionForAssign] = useState<RescueMission | null>(null);

  // Form states
  const [newMissionName, setNewMissionName] = useState('Evacuate residents');
  const [newLocation, setNewLocation] = useState(initialSelectedZone ? initialSelectedZone.name : 'Meppadi Ward 4');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Normal'>('Urgent');
  const [newTeamId, setNewTeamId] = useState('team-sdrf-04');
  const [newTargetPeople, setNewTargetPeople] = useState(250);

  // Update status state
  const [updateStage, setUpdateStage] = useState<SimpleMissionStage>('On the Way');

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await missionService.createMission({
      locationName: newLocation,
      district: 'Wayanad',
      priority: newPriority === 'Urgent' ? 'critical' : newPriority === 'High' ? 'high' : 'moderate',
      objective: newMissionName,
      assignedTeamId: newTeamId,
      targetEvacuees: newTargetPeople,
      specialInstructions: 'Ensure safe transit along high ridge road.',
    });
    setMissions([created, ...missions]);
    setIsNewMissionModalOpen(false);
  };

  const handleUpdateStatus = (missionId: string, nextStage: SimpleMissionStage) => {
    const rawStatusMap: Record<SimpleMissionStage, MissionStatus> = {
      'Assigned': 'assigned',
      'On the Way': 'en_route',
      'At Location': 'on_site',
      'Helping Residents': 'evacuating',
      'Completed': 'completed',
    };
    const mapped = rawStatusMap[nextStage];
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: mapped,
              progressPct: nextStage === 'Completed' ? 100 : nextStage === 'Helping Residents' ? 75 : nextStage === 'At Location' ? 50 : 25,
            }
          : m
      )
    );
    setActiveMissionForUpdate(null);
  };

  const handleMarkComplete = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? { ...m, status: 'completed', progressPct: 100, evacuatedCount: m.targetEvacuees }
          : m
      )
    );
  };

  const handleAssignTeam = (missionId: string, teamName: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, assignedTeamName: teamName } : m))
    );
    setActiveMissionForAssign(null);
  };

  const filteredMissions = missions.filter((m) => {
    if (statusFilter === 'all') return true;
    const stage = getSimpleStatus(m.status);
    return stage === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            MISSION MANAGEMENT
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Missions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate and track emergency response and evacuation missions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewMissionModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Mission</span>
          </button>
        </div>
      </div>

      {/* Simple Mission Flow Ribbon */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Mission Lifecycle Flow
          </span>
          <span className="text-slate-400 font-medium">Standard 5-Step Process</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { step: '1', label: 'Assigned', desc: 'Team alerted' },
            { step: '2', label: 'On the Way', desc: 'Moving to sector' },
            { step: '3', label: 'At Location', desc: 'On-site assessment' },
            { step: '4', label: 'Helping Residents', desc: 'Evacuating' },
            { step: '5', label: 'Completed', desc: 'Safe at shelter' },
          ].map((flow, i) => (
            <div key={i} className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
              <span className="h-5 w-5 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold mb-1 font-mono">
                {flow.step}
              </span>
              <p className="font-bold text-slate-800 text-xs">{flow.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{flow.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none"
          >
            <option value="all">All Missions ({missions.length})</option>
            <option value="Assigned">Assigned</option>
            <option value="On the Way">On the Way</option>
            <option value="At Location">At Location</option>
            <option value="Helping Residents">Helping Residents</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <span className="text-slate-500 font-medium font-mono">{filteredMissions.length} Missions Shown</span>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMissions.map((mission) => {
          const currentStage = getSimpleStatus(mission.status);
          const isUrgent = mission.priority === 'critical';
          const priorityText = isUrgent ? 'Urgent' : mission.priority === 'high' ? 'High' : 'Normal';

          return (
            <div
              key={mission.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Mission Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase font-mono">
                      {mission.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {mission.objective}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        isUrgent
                          ? 'bg-red-600 text-white'
                          : priorityText === 'High'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {priorityText}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getStatusColor(
                        currentStage
                      )}`}
                    >
                      {currentStage}
                    </span>
                  </div>
                </div>

                {/* Plain fields as specified: MISSION, LOCATION, TEAM, STATUS, PRIORITY */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[10px] block">LOCATION:</span>
                    <strong className="text-slate-900">{mission.locationName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">TEAM:</span>
                    <strong className="text-blue-700">{mission.assignedTeamName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">STATUS:</span>
                    <strong className="text-slate-800">{currentStage}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">PEOPLE HELPED:</span>
                    <strong className="text-emerald-700 font-mono">
                      {mission.evacuatedCount} / {mission.targetEvacuees}
                    </strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Progress:</span>
                    <span className="font-mono text-emerald-700 font-bold">{mission.progressPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${mission.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 4 Required Action Buttons: Assign Team, View Details, Update Status, Mark Complete */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveMissionForAssign(mission)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs text-center"
                >
                  Assign Team
                </button>

                <button
                  onClick={() => setSelectedMissionDetails(mission)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs text-center"
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setActiveMissionForUpdate(mission);
                    setUpdateStage(currentStage);
                  }}
                  className="rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 py-1.5 px-2 text-xs font-bold text-blue-700 transition-colors text-center"
                >
                  Update Status
                </button>

                <button
                  onClick={() => handleMarkComplete(mission.id)}
                  disabled={currentStage === 'Completed'}
                  className={`rounded-lg py-1.5 px-2 text-xs font-bold transition-colors text-center ${
                    currentStage === 'Completed'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  Mark Complete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Details */}
      <Modal
        isOpen={!!selectedMissionDetails}
        onClose={() => setSelectedMissionDetails(null)}
        title="Mission Details"
        subtitle={`Code: ${selectedMissionDetails?.code}`}
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Mission Goal:</span>
              <strong className="text-slate-900">{selectedMissionDetails?.objective}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <strong className="text-slate-900">{selectedMissionDetails?.locationName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Team:</span>
              <strong className="text-blue-700">{selectedMissionDetails?.assignedTeamName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <strong className="text-slate-900">
                {selectedMissionDetails && getSimpleStatus(selectedMissionDetails.status)}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicles:</span>
              <span className="font-mono text-slate-800">{selectedMissionDetails?.assignedVehicles.join(', ')}</span>
            </div>
            {selectedMissionDetails?.specialInstructions && (
              <div className="pt-2 border-t border-slate-200 text-amber-800">
                <strong>Special Notes:</strong> {selectedMissionDetails.specialInstructions}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSelectedMissionDetails(null)}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-2 font-bold text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Update Status */}
      <Modal
        isOpen={!!activeMissionForUpdate}
        onClose={() => setActiveMissionForUpdate(null)}
        title="Update Mission Status"
        subtitle={`Mission: ${activeMissionForUpdate?.objective} (${activeMissionForUpdate?.locationName})`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">Select the current operational stage for this mission:</p>

          <div className="space-y-2">
            {(['Assigned', 'On the Way', 'At Location', 'Helping Residents', 'Completed'] as SimpleMissionStage[]).map(
              (stage) => (
                <div
                  key={stage}
                  onClick={() => setUpdateStage(stage)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    updateStage === stage
                      ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{stage}</span>
                  {updateStage === stage && <Check className="h-4 w-4 text-blue-700" />}
                </div>
              )
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setActiveMissionForUpdate(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => activeMissionForUpdate && handleUpdateStatus(activeMissionForUpdate.id, updateStage)}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 font-bold text-white shadow-sm"
            >
              Save Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Assign Team */}
      <Modal
        isOpen={!!activeMissionForAssign}
        onClose={() => setActiveMissionForAssign(null)}
        title="Assign Rescue Team"
        subtitle={`Location: ${activeMissionForAssign?.locationName}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">Select a team to handle this mission:</p>

          <div className="space-y-2">
            {MOCK_RESCUE_TEAMS.map((team) => (
              <div
                key={team.id}
                onClick={() => activeMissionForAssign && handleAssignTeam(activeMissionForAssign.id, team.name)}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all"
              >
                <div>
                  <h5 className="font-bold text-slate-900">{team.name}</h5>
                  <p className="text-[11px] text-slate-500">
                    {team.memberCount} members • Base: {team.baseLocation} • Vehicle: {team.assignedVehicle}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
                    team.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {team.status === 'available' ? 'Available' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal: Create Mission */}
      <Modal
        isOpen={isNewMissionModalOpen}
        onClose={() => setIsNewMissionModalOpen(false)}
        title="Create New Mission"
        subtitle="Issue instructions to rescue units"
      >
        <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mission Goal</label>
            <input
              type="text"
              value={newMissionName}
              onChange={(e) => setNewMissionName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">People to Evacuate</label>
              <input
                type="number"
                value={newTargetPeople}
                onChange={(e) => setNewTargetPeople(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assign Team</label>
            <select
              value={newTeamId}
              onChange={(e) => setNewTeamId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
            >
              {MOCK_RESCUE_TEAMS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.status === 'available' ? 'Available' : 'Active'})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewMissionModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 font-bold text-white shadow-sm transition-all"
            >
              Deploy Mission
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
