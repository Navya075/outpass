import { RescueMission, RescueTeam, MissionStatus } from '../types/mission';
import { MOCK_MISSIONS, MOCK_RESCUE_TEAMS } from '../data/mockMissions';
import { RiskLevel } from '../types/hazard';

class MissionService {
  private missions: RescueMission[] = [...MOCK_MISSIONS];
  private teams: RescueTeam[] = [...MOCK_RESCUE_TEAMS];

  public async getAllMissions(): Promise<RescueMission[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...this.missions];
  }

  public async getAllTeams(): Promise<RescueTeam[]> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return [...this.teams];
  }

  public async updateMissionStatus(missionId: string, newStatus: MissionStatus, progressPct: number, evacuatedDelta = 0): Promise<RescueMission | null> {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return null;

    mission.status = newStatus;
    mission.progressPct = progressPct;
    mission.evacuatedCount = Math.min(mission.targetEvacuees, mission.evacuatedCount + evacuatedDelta);

    if (newStatus === 'completed') {
      mission.progressPct = 100;
      mission.evacuatedCount = mission.targetEvacuees;
      const team = this.teams.find((t) => t.id === mission.assignedTeamId);
      if (team) {
        team.status = 'available';
        team.currentMissionId = undefined;
      }
    }

    return { ...mission };
  }

  public async createMission(params: {
    locationName: string;
    district: string;
    priority: RiskLevel;
    objective: string;
    assignedTeamId: string;
    targetEvacuees: number;
    specialInstructions: string;
  }): Promise<RescueMission> {
    const team = this.teams.find((t) => t.id === params.assignedTeamId);
    const teamName = team ? team.name : 'NDRF Auxiliary Unit';

    const newMission: RescueMission = {
      id: `msn-${Date.now()}`,
      code: `MSN-${1045 + this.missions.length}`,
      locationName: params.locationName,
      district: params.district,
      coordinates: [11.545, 76.135],
      priority: params.priority,
      objective: params.objective,
      assignedTeamId: params.assignedTeamId,
      assignedTeamName: teamName,
      targetEvacuees: params.targetEvacuees,
      evacuatedCount: 0,
      status: 'assigned',
      progressPct: 5,
      startTime: 'Just now',
      estimatedCompletion: 'In 3 hours',
      assignedVehicles: ['Tactical Support Vehicle'],
      specialInstructions: params.specialInstructions,
    };

    if (team) {
      team.status = 'on_mission';
      team.currentMissionId = newMission.id;
    }

    this.missions.unshift(newMission);
    return newMission;
  }
}

export const missionService = new MissionService();
