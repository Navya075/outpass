import { RiskLevel } from './hazard';

export type AlertSeverity = RiskLevel; // 'low' | 'moderate' | 'high' | 'critical'

export type AlertAudience = 'citizens' | 'rescue' | 'officials' | 'all';

export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'retrying';

export interface AlertChannelStatus {
  channel: 'Push Notification' | 'SMS Broadcast' | 'Civil Defense Siren' | 'Emergency Cell Broadcast';
  status: DeliveryStatus;
  sentCount: number;
  deliveryRatePct: number;
}

export interface BroadcastAlert {
  id: string;
  capIdentifier: string; // e.g. "IN-KL-WYD-2026-09-001"
  title: string;
  headline: string;
  locationName: string;
  district: string;
  hazardType: 'Landslide Early Warning' | 'Flash Flood Cascade' | 'Debris Flow' | 'Road Breach' | 'Severe Rain Alert';
  severity: AlertSeverity;
  riskScore: number;
  audience: AlertAudience;
  message: string;
  recommendedAction: string;
  timestamp: string;
  expiresAt: string;
  senderAgency: string; // e.g. "Kerala SDMA / District Disaster Control"
  channels: AlertChannelStatus[];
  isPinned: boolean;
}
