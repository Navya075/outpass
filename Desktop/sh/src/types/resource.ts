export interface ShelterInfo {
  id: string;
  name: string;
  location: string;
  district: string;
  coordinates: [number, number];
  capacityTotal: number;
  currentOccupancy: number;
  availableBeds: number;
  medicalOfficerName: string;
  contactPhone: string;
  suppliesStatus: 'Adequate' | 'Limited' | 'Critical';
  isOpen: boolean;
}

export interface RoadSegment {
  id: string;
  roadName: string;
  connectingLocations: [string, string];
  status: 'open' | 'partially_blocked' | 'blocked';
  hazardCause: string; // e.g. "Debris fall at hairpin curve 4"
  coordinatesPath: [number, number][];
  estimatedClearanceHours: number;
  alternativeRouteName?: string;
  lastUpdated: string;
}

export interface EquipmentStock {
  id: string;
  category: 'Heavy Machinery' | 'Medical Supplies' | 'Search & Rescue' | 'Relief Rations';
  name: string;
  totalQuantity: number;
  deployedQuantity: number;
  availableQuantity: number;
  unit: string;
  depotLocation: string;
  status: 'Sufficient' | 'Low' | 'Critical';
}
