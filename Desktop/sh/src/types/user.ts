export type UserRole = 'citizen' | 'rescue' | 'control';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnAlert: boolean;
}

export interface NotificationPreferences {
  emergencyAlerts: boolean;
  landslideWarnings: boolean;
  floodAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
}

export interface UserLocation {
  state: string;
  district: string;
  village: string;
  addressArea?: string;
  latitude: number;
  longitude: number;
}

export type ControlAccessLevel = 'Operator' | 'Supervisor' | 'Administrator';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  location: UserLocation;
  emergencyContacts: EmergencyContact[];
  notificationPreferences: NotificationPreferences;

  // Rescue Team Specific Details
  agency?: string;
  teamName?: string;
  designation?: string;
  badgeNumber?: string;
  employeeId?: string;
  operationalRegion?: string;
  teamMembersCount?: number;
  vehicleAvailability?: string;
  rescueEquipment?: string[];
  medicalEquipment?: string[];
  communicationEquipment?: string[];

  // Control Center Specific Details
  department?: string;
  officialId?: string;
  controlCenterName?: string;
  operationalDistrict?: string;
  emergencyContactNumber?: string;
  accessLevel?: ControlAccessLevel;
}
