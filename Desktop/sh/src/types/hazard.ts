export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type RiskTrend = 'rapidly_increasing' | 'increasing' | 'stable' | 'decreasing';

export interface EnvironmentalFactors {
  rainfallCurrentMm: number;        // mm in past hour
  rainfall24hMm: number;            // mm in past 24 hours
  rainfallThresholdMm: number;      // critical threshold
  soilSaturationPct: number;        // 0 - 100%
  slopeDegree: number;              // steepness in degrees
  soilType: string;                 // e.g., 'Lateritic clay / sandy loam'
  drainageEfficiency: 'Poor' | 'Moderate' | 'Good';
  poreWaterPressureKPa: number;     // kPa
  inclinometerShiftMm: number;      // ground shift in mm
}

export interface ExposureData {
  totalPopulation: number;
  vulnerablePopulation: number;     // elderly, children, disabled
  residentialBuildings: number;
  schools: number;
  hospitals: number;
  roadsKm: number;
  criticalBridges: number;
  powerSubstations: number;
}

export interface ForecastDataPoint {
  timeLabel: string;
  timestamp: number;
  riskScore: number;
  rainfallMm: number;
  soilSaturationPct: number;
  leadTimeMinutes: number;
}

export interface HazardZone {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  polygonCoords?: [number, number][];
  riskLevel: RiskLevel;
  riskScore: number;             // 0 - 100
  previousRiskScore: number;     // for evolution tracking
  trend: RiskTrend;
  confidenceScore: number;       // e.g. 87%
  actionableLeadTimeMinutes: number; // minutes remaining
  accessibilityStatus: 'Good' | 'Fair' | 'Poor' | 'Impassable';
  environmental: EnvironmentalFactors;
  exposure: ExposureData;
  primarySafeZoneId: string;
  forecast: ForecastDataPoint[];
  lastUpdated: string;
}

export interface AIInsight {
  id: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  title: string;
  summary: string;
  modelConfidencePct: number;
  modelVersion: string;
  contributingFactors: {
    factor: string;
    importancePct: number;
    description: string;
  }[];
  recommendedActions: string[];
  severity: RiskLevel;
}
