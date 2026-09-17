import { RiskLevel } from './hazard';

export type MissionStatus = 'assigned' | 'en_route' | 'on_site' | 'evacuating' | 'completed';

export type TeamStatus = 'available' | 'on_mission' | 'returning' | 'unavailable';

export interface RescueMission {
  id: string;
  code: string; // e.g. "MSN-1042"
  locationName: string;
  district: string;
  coordinates: [number, number];
  priority: RiskLevel;
  objective: string;
  assignedTeamId: string;
  assignedTeamName: string;
  targetEvacuees: number;
  evacuatedCount: number;
  status: MissionStatus;
  progressPct: number;
  startTime: string;
  estimatedCompletion: string;
  assignedVehicles: string[];
  specialInstructions: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  agency: string; // NDRF, SDRF, Fire & Rescue, Volunteer
  status: TeamStatus;
  baseLocation: string;
  currentCoordinates: [number, number];
  memberCount: number;
  leaderName: string;
  leaderContact: string;
  assignedVehicle: string;
  currentMissionId?: string;
  capabilities: string[]; // High-angle rope, Inflatable raft, Debris clearance, Trauma triage
}

export interface Vehicle {
  id: string;
  type: 'Ambulance' | 'Rescue Truck' | 'Earthmover / JCB' | 'Inflatable Boat' | 'Recon Drone';
  regNumber: string;
  status: 'Ready' | 'Deployed' | 'Maintenance';
  assignedTo?: string;
  fuelLevelPct: number;
}
