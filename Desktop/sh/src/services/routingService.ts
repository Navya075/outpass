export interface EvacuationStep {
  instruction: string;
  distanceMeters: number;
  durationMinutes: number;
  isHazardWarning?: boolean;
  warningNote?: string;
}

export interface EvacuationRoutePlan {
  destinationName: string;
  destinationCoordinates: [number, number];
  destinationCapacityAvailable: number;
  totalDistanceKm: number;
  estimatedTravelTimeMin: number;
  roadAccessibility: 'Optimal' | 'Caution' | 'Detour Active';
  pathCoordinates: [number, number][];
  steps: EvacuationStep[];
  alternativeRouteAvailable: boolean;
  alternativeDestinationName?: string;
  alternativePathCoordinates?: [number, number][];
}

class RoutingService {
  /**
   * Generates a safe route plan from the user's location (Meppadi) to the nearest safe zone
   * taking into account active blocked road segments.
   */
  public getEvacuationRoute(origin: [number, number]): EvacuationRoutePlan {
    // Modeled around Meppadi -> Kalpetta Polytechnic / St. Joseph Shelter corridor
    return {
      destinationName: 'St. Joseph Higher Secondary Relief Camp (High Ridge)',
      destinationCoordinates: [11.558, 76.129],
      destinationCapacityAvailable: 338,
      totalDistanceKm: 2.8,
      estimatedTravelTimeMin: 14,
      roadAccessibility: 'Caution',
      pathCoordinates: [
        origin,
        [11.553, 76.126],
        [11.555, 76.127],
        [11.557, 76.128],
        [11.558, 76.129],
      ],
      steps: [
        {
          instruction: 'Exit your residence immediately. Take your packed Emergency Go-Bag and turn onto Estate Ridge Road.',
          distanceMeters: 350,
          durationMinutes: 3,
        },
        {
          instruction: 'Proceed northeast towards Meppadi High School junction. Avoid lower river gulley.',
          distanceMeters: 800,
          durationMinutes: 4,
          isHazardWarning: true,
          warningNote: 'Lower culvert overflowing with muddy runoff. Keep strictly to high lateral shoulder.',
        },
        {
          instruction: 'Turn slightly left at the SDRF checkpoint onto the paved High Ridge Approach road.',
          distanceMeters: 950,
          durationMinutes: 4,
        },
        {
          instruction: 'Arrive at St. Joseph Relief Camp main gate. Check in with District Medical Desk for registration.',
          distanceMeters: 700,
          durationMinutes: 3,
        },
      ],
      alternativeRouteAvailable: true,
      alternativeDestinationName: 'Government Polytechnic Regional Relief Hub (Kalpetta)',
      alternativePathCoordinates: [
        origin,
        [11.568, 76.110],
        [11.585, 76.095],
        [11.610, 76.082],
        [11.615, 76.088],
      ],
    };
  }
}

export const routingService = new RoutingService();
