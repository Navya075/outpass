import { HazardZone, AIInsight, RiskLevel } from '../types/hazard';
import { MOCK_HAZARD_ZONES, MOCK_AI_INSIGHTS } from '../data/mockHazards';

class HazardService {
  private zones: HazardZone[] = [...MOCK_HAZARD_ZONES];
  private insights: AIInsight[] = [...MOCK_AI_INSIGHTS];

  public async getAllZones(): Promise<HazardZone[]> {
    // Simulated micro-delay representing fast cached query
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [...this.zones];
  }

  public async getZoneById(id: string): Promise<HazardZone | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return this.zones.find((z) => z.id === id);
  }

  public async getZonesByRiskLevel(level: RiskLevel): Promise<HazardZone[]> {
    return this.zones.filter((z) => z.riskLevel === level);
  }

  public async getAIInsights(): Promise<AIInsight[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...this.insights];
  }

  /**
   * Forecast engine simulation for the 6-hour control center time slider.
   * Simulates how risk scores shift at +0h (now), +1h, +3h, and +6h based on rain prediction models.
   */
  public getSimulatedForecast(timeOffsetHours: number): HazardZone[] {
    return this.zones.map((zone) => {
      let multiplier = 1.0;
      if (timeOffsetHours === 1) multiplier = 1.08;
      else if (timeOffsetHours === 3) multiplier = 1.15;
      else if (timeOffsetHours === 6) multiplier = 0.94; // storm starts receding

      const projectedScore = Math.min(99, Math.max(15, Math.round(zone.riskScore * multiplier)));
      let projectedLevel: RiskLevel = 'low';
      if (projectedScore >= 80) projectedLevel = 'critical';
      else if (projectedScore >= 70) projectedLevel = 'high';
      else if (projectedScore >= 45) projectedLevel = 'moderate';

      return {
        ...zone,
        riskScore: projectedScore,
        riskLevel: projectedLevel,
        actionableLeadTimeMinutes: Math.max(10, Math.round(zone.actionableLeadTimeMinutes / (multiplier * 0.9))),
      };
    });
  }
}

export const hazardService = new HazardService();
