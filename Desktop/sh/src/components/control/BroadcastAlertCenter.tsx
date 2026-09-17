import React, { useState } from 'react';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import { BroadcastAlert, AlertSeverity, AlertChannelStatus } from '../../types/alert';
import { Modal } from '../common/Modal';
import {
  Send,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

export const BroadcastAlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<BroadcastAlert[]>(MOCK_ALERTS);
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState<BroadcastAlert | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlertForUpdate, setSelectedAlertForUpdate] = useState<BroadcastAlert | null>(null);

  // Form State
  const [alertName, setAlertName] = useState('Landslide Warning');
  const [alertArea, setAlertArea] = useState('Meppadi Ward 4');
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('critical');
  const [alertPeople, setAlertPeople] = useState(2340);
  const [alertMessage, setAlertMessage] = useState('Heavy rain has increased landslide risk. Stay away from steep slopes and prepare to evacuate.');
  const [alertAction, setAlertAction] = useState('Move to St. Joseph Safe Shelter immediately.');

  const getTargetedCount = (alert: BroadcastAlert) => {
    if (alert.channels && alert.channels.length > 0) {
      return alert.channels[0].sentCount;
    }
    return 2340;
  };

  // Form submission
  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultChannels: AlertChannelStatus[] = [
      { channel: 'Emergency Cell Broadcast', status: 'delivered', sentCount: alertPeople, deliveryRatePct: 98 },
      { channel: 'SMS Broadcast', status: 'delivered', sentCount: Math.round(alertPeople * 0.95), deliveryRatePct: 95 },
      { channel: 'Push Notification', status: 'delivered', sentCount: Math.round(alertPeople * 0.8), deliveryRatePct: 92 },
    ];

    const newAlert: BroadcastAlert = {
      id: `alt-${Date.now()}`,
      capIdentifier: `IN-KL-WYD-ALERT-${Date.now().toString().slice(-4)}`,
      title: `${alertSeverity.toUpperCase()}: ${alertName}`,
      headline: `${alertName}: ${alertArea}`,
      locationName: alertArea,
      district: 'Wayanad',
      hazardType: 'Landslide Early Warning',
      severity: alertSeverity,
      riskScore: 82,
      audience: 'all',
      timestamp: 'Just now',
      expiresAt: 'In 6 hours',
      message: alertMessage,
      recommendedAction: alertAction,
      senderAgency: 'Wayanad District Disaster Management Authority (DDMA)',
      channels: defaultChannels,
      isPinned: true,
    };

    setAlerts([newAlert, ...alerts]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForUpdate) return;
    setAlerts(
      alerts.map((a) =>
        a.id === selectedAlertForUpdate.id
          ? { ...a, headline: alertName, message: alertMessage, recommendedAction: alertAction }
          : a
      )
    );
    setSelectedAlertForUpdate(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest font-mono">
            PUBLIC SAFETY BROADCAST
          </span>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-0.5">
            Emergency Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send official warnings and evacuation notices to residents and emergency responders.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Main Table: Alert, Area, Severity, People Affected, Status */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active & Recent Alerts
          </h3>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {alerts.length} Alerts Issued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ALERT</th>
                <th className="py-3.5 px-3">AREA</th>
                <th className="py-3.5 px-3">SEVERITY</th>
                <th className="py-3.5 px-3">PEOPLE AFFECTED</th>
                <th className="py-3.5 px-3">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{alert.headline}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{alert.message}</div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {alert.locationName}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono border ${
                        alert.severity === 'critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : alert.severity === 'high'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-900 font-bold">
                    {getTargetedCount(alert).toLocaleString()} people
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
                      Sent
                    </span>
                  </td>

                  {/* Required Action Buttons: View Alert, Update Alert */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAlertForDetails(alert)}
                        className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                      >
                        View Alert
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAlertForUpdate(alert);
                          setAlertName(alert.headline);
                          setAlertMessage(alert.message);
                          setAlertAction(alert.recommendedAction);
                        }}
                        className="rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 transition-colors"
                      >
                        Update Alert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Alert Details (Contains technical delivery codes inside collapsed section) */}
      <Modal
        isOpen={!!selectedAlertForDetails}
        onClose={() => setSelectedAlertForDetails(null)}
        title="Alert Details"
        subtitle={selectedAlertForDetails?.headline}
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Area:</span>
              <strong className="text-slate-900">{selectedAlertForDetails?.locationName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Severity:</span>
              <strong className="text-red-600 uppercase">{selectedAlertForDetails?.severity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">People Affected:</span>
              <strong className="text-slate-900 font-mono">
                {selectedAlertForDetails ? getTargetedCount(selectedAlertForDetails).toLocaleString() : '2,340'} people
              </strong>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">Message:</span>
              <p className="font-medium text-slate-800 mt-1 leading-relaxed">
                "{selectedAlertForDetails?.message}"
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-red-900">
              <span className="text-[10px] font-bold uppercase text-red-700 block">Recommended Action:</span>
              <p className="font-semibold text-xs mt-0.5">
                {selectedAlertForDetails?.recommendedAction}
              </p>
            </div>
          </div>

          {/* Advanced Delivery Information inside Alert Details as requested */}
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 text-[11px] space-y-1 font-mono text-slate-600">
            <span className="font-bold text-slate-700 block text-[10px] uppercase font-sans">
              Delivery Information:
            </span>
            <div>Protocol ID: {selectedAlertForDetails?.capIdentifier}</div>
            <div>Agency: {selectedAlertForDetails?.senderAgency}</div>
            <div>
              Channels: {selectedAlertForDetails?.channels?.map((c) => c.channel).join(', ') || 'SMS, Push'}
            </div>
            <div>
              Delivery Rate: {selectedAlertForDetails?.channels?.[0]?.deliveryRatePct || 98}%
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSelectedAlertForDetails(null)}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-2 font-bold text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Create Alert */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Emergency Alert"
        subtitle="Broadcast to citizens and responders"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alert Title</label>
            <input
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area</label>
              <input
                type="text"
                value={alertArea}
                onChange={(e) => setAlertArea(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity</label>
              <select
                value={alertSeverity}
                onChange={(e) => setAlertSeverity(e.target.value as AlertSeverity)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="critical">Critical (Immediate Evacuation)</option>
                <option value="high">High (Warning)</option>
                <option value="moderate">Moderate (Advisory)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Estimated People Affected</label>
            <input
              type="number"
              value={alertPeople}
              onChange={(e) => setAlertPeople(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message to Public</label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Recommended Action</label>
            <textarea
              value={alertAction}
              onChange={(e) => setAlertAction(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-red-600 hover:bg-red-700 px-5 py-2 font-bold text-white shadow-sm transition-all"
            >
              Send Alert Now
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Update Alert */}
      <Modal
        isOpen={!!selectedAlertForUpdate}
        onClose={() => setSelectedAlertForUpdate(null)}
        title="Update Alert"
        subtitle={`Location: ${selectedAlertForUpdate?.locationName}`}
      >
        <form onSubmit={handleUpdateAlert} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alert Headline</label>
            <input
              type="text"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Updated Message</label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Updated Action</label>
            <textarea
              value={alertAction}
              onChange={(e) => setAlertAction(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 font-medium"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedAlertForUpdate(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 font-bold text-white shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
