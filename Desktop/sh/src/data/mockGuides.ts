export interface SafetySection {
  id: string;
  stage: 'before' | 'warning' | 'during' | 'after';
  title: string;
  subtitle: string;
  badge: string;
  items: {
    heading: string;
    text: string;
    priority: 'critical' | 'high' | 'medium';
  }[];
}

export interface GoBagItem {
  id: string;
  category: 'Critical Documents' | 'First Aid & Health' | 'Emergency Supplies' | 'Sustenance';
  name: string;
  description: string;
  isRequired: boolean;
}

export const MOCK_SAFETY_GUIDES: SafetySection[] = [
  {
    id: 'sec-before',
    stage: 'before',
    title: 'Pre-Monsoon & Preparedness Phase',
    subtitle: 'Steps to take well before intense rainfall events occur in hilly terrains.',
    badge: 'Proactive Measures',
    items: [
      { heading: 'Recognize Landslide Warning Signs', text: 'Watch for new cracks in plaster, tiles, bricks, or foundations. Notice leaning trees, utility poles, or retaining walls.', priority: 'critical' },
      { heading: 'Inspect Natural Drainage Channels', text: 'Ensure roof runoff and estate drainage furrows do not discharge directly onto steep cut-slopes or unsupported fills.', priority: 'high' },
      { heading: 'Identify Elevated Evacuation Routes', text: 'Locate designated community shelter structures located on stable bedrocks, away from steep valleys.', priority: 'high' },
      { heading: 'Assemble Emergency Go-Bag', text: 'Keep waterproof copies of deeds, Aadhaar/ID, medications, flashlights, and whistles packed near the exit.', priority: 'medium' },
    ],
  },
  {
    id: 'sec-warning',
    stage: 'warning',
    title: 'During Official Warning / Orange-Red Alert',
    subtitle: 'Immediate actions when rainfall exceeds 100mm and risk score surpasses 70%.',
    badge: 'Urgent Action Required',
    items: [
      { heading: 'Heed Official Evacuation Orders Promptly', text: 'Do not wait until mud or boulders are actively moving. Slopes can fail catastrophically in seconds without audible rumble.', priority: 'critical' },
      { heading: 'Evacuate Non-Ambulatory Relatives Early', text: 'Ensure children, pregnant mothers, and elderly persons are transported during daytime hours before darkness falls.', priority: 'critical' },
      { heading: 'Avoid Stream & Valley Crossings', text: 'Never attempt to cross flooded streams, culverts, or bridges where water is rushing brown or turbid with mud.', priority: 'high' },
      { heading: 'Turn Off Gas Cylinders & Mains', text: 'Shut off LPG cylinder valves and electrical master breakers prior to stepping out of your house.', priority: 'medium' },
    ],
  },
  {
    id: 'sec-during',
    stage: 'during',
    title: 'During Slope Failure & Debris Flow',
    subtitle: 'Crucial life-saving reactions if sudden soil or rock movements occur near you.',
    badge: 'Life-Threatening Emergency',
    items: [
      { heading: 'Move Quickly Out of the Path of Debris', text: 'Run perpendicular to the flow path towards high lateral ridges, never down the slope along the gully.', priority: 'critical' },
      { heading: 'If Trapped Indoors, Seek Structural Cover', text: 'Curl into a tight protective ball under sturdy furniture (heavy table or bed) and shield your head and neck.', priority: 'critical' },
      { heading: 'Stay Alert for Secondary Surges', text: 'The initial mudflow is frequently followed by larger boulder dam-burst pulses within 15 to 45 minutes.', priority: 'high' },
    ],
  },
  {
    id: 'sec-after',
    stage: 'after',
    title: 'Post-Event Recovery & Care',
    subtitle: 'Safety protocols after the immediate movement has subsided.',
    badge: 'Post-Impact Caution',
    items: [
      { heading: 'Do NOT Return to Affected Dwellings', text: 'Saturated cut-slopes remain highly unstable for 48-72 hours after rain stops. Wait for official PWD/GSI clearance.', priority: 'critical' },
      { heading: 'Report Trapped or Missing Neighbors', text: 'Notify SDRF/NDRF search posts immediately with exact house numbers and known family members.', priority: 'high' },
      { heading: 'Watch for Downed High-Tension Cables', text: 'Mudslides regularly snap power lines; treat all standing water and mud puddles as potentially electrified.', priority: 'high' },
      { heading: 'Boil All Drinking Water', text: 'Municipal pipelines and wells in landslide sectors suffer severe bacterial and silt contamination.', priority: 'medium' },
    ],
  },
];

export const MOCK_GOBAG_ITEMS: GoBagItem[] = [
  { id: 'gb-1', category: 'Critical Documents', name: 'Aadhaar / ID & Ration Cards', description: 'Store inside sealed waterproof zip pouch', isRequired: true },
  { id: 'gb-2', category: 'Critical Documents', name: 'Property Deeds & Bank Passbooks', description: 'Essential for post-disaster compensation and relief', isRequired: true },
  { id: 'gb-3', category: 'First Aid & Health', name: '7-Day Prescription Medications', description: 'Insulin, BP, asthma inhalers, and cardiac prescriptions', isRequired: true },
  { id: 'gb-4', category: 'First Aid & Health', name: 'Basic First Aid Kit', description: 'Sterile gauze, antiseptic liquid, paracetamol, ORS sachets', isRequired: true },
  { id: 'gb-5', category: 'Emergency Supplies', name: 'High-Lumen Torch / Headlamp', description: 'With spare alkaline batteries or dynamo crank', isRequired: true },
  { id: 'gb-6', category: 'Emergency Supplies', name: 'Emergency Signal Whistle', description: 'Audible up to 500m to guide acoustic search teams if trapped', isRequired: true },
  { id: 'gb-7', category: 'Emergency Supplies', name: 'Fully-Charged Power Bank & Cable', description: '10,000mAh or higher with battery saver turned on', isRequired: true },
  { id: 'gb-8', category: 'Sustenance', name: 'Packaged Drinking Water (2 Liters/person)', description: 'Sealed water bottles', isRequired: true },
  { id: 'gb-9', category: 'Sustenance', name: 'High-Calorie Non-Perishable Food', description: 'Biscuits, dates, nuts, glucose biscuits', isRequired: false },
  { id: 'gb-10', category: 'Emergency Supplies', name: 'Waterproof Rain Poncho / Sturdy Boots', description: 'Protects from continuous downpour and mud debris', isRequired: false },
];
