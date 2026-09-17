import { UserProfile, UserRole } from '../types/user';

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  citizen: {
    id: 'usr-citizen-01',
    fullName: 'Ananya Nair',
    email: 'ananya.nair@wayanad.res.in',
    mobileNumber: '+91 98471 90214',
    role: 'citizen',
    location: {
      state: 'Kerala',
      district: 'Wayanad',
      village: 'Meppadi (Tea Estate Ward 4)',
      latitude: 11.5518,
      longitude: 76.1264,
    },
    emergencyContacts: [
      { id: 'c-1', name: 'Rajan Nair', relationship: 'Father', phone: '+91 94470 12345', notifyOnAlert: true },
      { id: 'c-2', name: 'Dr. Lekshmi Nair', relationship: 'Sister', phone: '+91 94473 89012', notifyOnAlert: true },
      { id: 'c-3', name: 'K. Balan', relationship: 'Neighbor / Village Warden', phone: '+91 98472 66781', notifyOnAlert: true },
    ],
    notificationPreferences: {
      emergencyAlerts: true,
      landslideWarnings: true,
      floodAlerts: true,
      pushNotifications: true,
      smsAlerts: true,
    },
  },
  rescue: {
    id: 'usr-rescue-01',
    fullName: 'Capt. Rajesh Kumar',
    email: 'rajesh.kumar@sdrf.kerala.gov.in',
    mobileNumber: '+91 94471 20042',
    role: 'rescue',
    badgeNumber: 'SDRF-WYD-401',
    employeeId: 'EMP-SDRF-8821',
    agency: 'Kerala State Disaster Response Force (SDRF)',
    teamName: 'Alpha Unit 04 (Mountain Tactical Extraction)',
    designation: 'Assistant Commandant / Team Lead',
    operationalRegion: 'Wayanad High Ranges (Meppadi - Chooralmala Sector)',
    teamMembersCount: 24,
    vehicleAvailability: '3x All-Terrain 4WD Units, 1x Heavy Transport, 2x Rapid Inflatable Boats',
    rescueEquipment: ['Hydraulic Spreader & Cutters', 'High-Angle Rope Rescue Kits', 'Debris Shovels & Gas Detectors'],
    medicalEquipment: ['4x Advanced Trauma Life Support Kits', 'Defibrillators (AED)', 'Portable Oxygen Cylinders'],
    communicationEquipment: ['Satellite Radios (IsatPhone 2)', 'VHF/UHF Tactical Handhelds', 'Emergency Mesh Repeater'],
    location: {
      state: 'Kerala',
      district: 'Wayanad',
      village: 'Kalpetta Emergency Post',
      addressArea: 'Civil Station Road, Kalpetta Post',
      latitude: 11.6103,
      longitude: 76.0827,
    },
    emergencyContacts: [
      { id: 'rc-1', name: 'SDRF District Control Desk', relationship: 'Operations Room', phone: '1077', notifyOnAlert: true },
      { id: 'rc-2', name: 'NDRF Liaison Officer', relationship: 'NDRF Command', phone: '+91 98110 33490', notifyOnAlert: true },
    ],
    notificationPreferences: {
      emergencyAlerts: true,
      landslideWarnings: true,
      floodAlerts: true,
      pushNotifications: true,
      smsAlerts: true,
    },
  },
  control: {
    id: 'usr-control-01',
    fullName: 'Dr. Meera Namboodiri, IAS',
    email: 'collector.wyd@kerala.gov.in',
    mobileNumber: '+91 94470 00001',
    role: 'control',
    badgeNumber: 'DDMA-CHIEF-01',
    officialId: 'IAS-KL-2014-992',
    agency: 'District Disaster Management Authority (DDMA)',
    department: 'Revenue & Disaster Management Department',
    designation: 'District Collector & Chairperson DDMA',
    controlCenterName: 'District Emergency Operations Center (DEOC Kalpetta)',
    operationalDistrict: 'Wayanad District, Kerala',
    emergencyContactNumber: '04936 204151 / Toll-Free 1077',
    accessLevel: 'Administrator',
    location: {
      state: 'Kerala',
      district: 'Wayanad',
      village: 'Kalpetta Collectorate DEOC',
      addressArea: 'Collectorate Complex, Kalpetta North',
      latitude: 11.6103,
      longitude: 76.0827,
    },
    emergencyContacts: [
      { id: 'cc-1', name: 'State Emergency Operations Center (SEOC Thiruvananthapuram)', relationship: 'State Command', phone: '1070', notifyOnAlert: true },
      { id: 'cc-2', name: 'Indian Army Madras Regiment Col.', relationship: 'Military Liaison', phone: '+91 94470 88990', notifyOnAlert: true },
    ],
    notificationPreferences: {
      emergencyAlerts: true,
      landslideWarnings: true,
      floodAlerts: true,
      pushNotifications: true,
      smsAlerts: true,
    },
  },
};

class AuthService {
  private currentRole: UserRole = 'citizen';
  private currentUser: UserProfile = DEMO_PROFILES.citizen;

  constructor() {
    const savedRole = localStorage.getItem('landsafe_role') as UserRole | null;
    if (savedRole && DEMO_PROFILES[savedRole]) {
      this.currentRole = savedRole;
      this.currentUser = DEMO_PROFILES[savedRole];
    }
  }

  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public switchRole(role: UserRole): UserProfile {
    this.currentRole = role;
    this.currentUser = DEMO_PROFILES[role];
    localStorage.setItem('landsafe_role', role);
    return this.currentUser;
  }

  public login(email: string, _password: string, role: UserRole): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { ...DEMO_PROFILES[role], email };
        this.currentRole = role;
        this.currentUser = user;
        localStorage.setItem('landsafe_role', role);
        resolve(user);
      }, 300);
    });
  }

  public register(userData: Partial<UserProfile>): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: UserProfile = {
          ...DEMO_PROFILES[userData.role || 'citizen'],
          ...userData,
          id: `usr-${Date.now()}`,
        } as UserProfile;
        this.currentUser = newUser;
        this.currentRole = newUser.role;
        localStorage.setItem('landsafe_role', newUser.role);
        resolve(newUser);
      }, 300);
    });
  }

  public updateProfile(updated: Partial<UserProfile>): UserProfile {
    this.currentUser = { ...this.currentUser, ...updated };
    return this.currentUser;
  }
}

export const authService = new AuthService();
