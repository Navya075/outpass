import { BroadcastAlert, AlertSeverity, AlertAudience } from '../types/alert';
import { MOCK_ALERTS } from '../data/mockAlerts';

class AlertService {
  private alerts: BroadcastAlert[] = [...MOCK_ALERTS];

  public async getAllAlerts(): Promise<BroadcastAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [...this.alerts];
  }

  public async getAlertsForRole(role: 'citizen' | 'rescue' | 'control'): Promise<BroadcastAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (role === 'citizen') {
      return this.alerts.filter((a) => a.audience === 'citizens' || a.audience === 'all');
    }
    if (role === 'rescue') {
      return this.alerts.filter((a) => a.audience === 'rescue' || a.audience === 'all');
    }
    return [...this.alerts];
  }

  public async dispatchBroadcastAlert(params: {
    title: string;
    headline: string;
    locationName: string;
    district: string;
    hazardType: BroadcastAlert['hazardType'];
    severity: AlertSeverity;
    audience: AlertAudience;
    message: string;
    recommendedAction: string;
    senderAgency: string;
  }): Promise<BroadcastAlert> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newAlert: BroadcastAlert = {
      id: `alt-${Date.now()}`,
      capIdentifier: `IN-KL-WYD-${new Date().getFullYear()}-${String(this.alerts.length + 1).padStart(3, '0')}`,
      title: params.title,
      headline: params.headline,
      locationName: params.locationName,
      district: params.district,
      hazardType: params.hazardType,
      severity: params.severity,
      riskScore: params.severity === 'critical' ? 95 : params.severity === 'high' ? 80 : 55,
      audience: params.audience,
      message: params.message,
      recommendedAction: params.recommendedAction,
      timestamp: 'Just now (Broadcasting)',
      expiresAt: 'In 6 hours',
      senderAgency: params.senderAgency,
      channels: [
        { channel: 'Emergency Cell Broadcast', status: 'delivered', sentCount: 16200, deliveryRatePct: 98.8 },
        { channel: 'Push Notification', status: 'delivered', sentCount: 6800, deliveryRatePct: 96.2 },
        { channel: 'SMS Broadcast', status: 'delivered', sentCount: 18400, deliveryRatePct: 94.5 },
        { channel: 'Civil Defense Siren', status: 'delivered', sentCount: 5, deliveryRatePct: 100 },
      ],
      isPinned: params.severity === 'critical',
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

export const alertService = new AlertService();
