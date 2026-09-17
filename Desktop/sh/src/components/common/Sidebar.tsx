import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  MapPin,
  AlertTriangle,
  Navigation,
  PhoneCall,
  BookOpen,
  User,
  ShieldAlert,
  Flame,
  Users,
  Compass,
  Layers,
  Radio,
  BarChart3,
  TrendingUp,
  Clock,
  Send,
  Workflow,
  Cpu,
  Waves,
  Map,
  Shield,
  Phone,
  Info,
  X,
} from 'lucide-react';

export interface NavTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  highlight?: boolean;
  alert?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavTabItem[];
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { currentRole } = useAuth();

  // 1. Citizen Navigation (Grouped per spec)
  const citizenGroups: NavGroup[] = [
    {
      title: 'Risk & Safety',
      items: [
        { id: 'citizen-home', label: 'Home', icon: Home },
        { id: 'citizen-map', label: 'Risk Map', icon: MapPin },
        { id: 'citizen-details', label: 'Risk Details', icon: Info },
        { id: 'citizen-alerts', label: 'Alerts', icon: AlertTriangle, count: 3 },
      ],
    },
    {
      title: 'Emergency & Evacuation',
      items: [
        { id: 'citizen-evacuate', label: 'Evacuation Assistant', icon: Navigation, highlight: true },
        { id: 'citizen-emergency', label: 'Emergency SOS', icon: PhoneCall, alert: true },
      ],
    },
    {
      title: 'Safety',
      items: [
        { id: 'citizen-guide', label: 'Safety Guide & Go-Bag', icon: BookOpen },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'citizen-profile', label: 'Profile & Contacts', icon: User },
      ],
    },
  ];

  // 2. Rescue Team Navigation (Clean operational labels)
  const rescueGroups: NavGroup[] = [
    {
      title: 'Operations',
      items: [
        { id: 'rescue-overview', label: 'Rescue Operations', icon: ShieldAlert },
        { id: 'rescue-map', label: 'Live Risk Map', icon: MapPin },
        { id: 'rescue-priority', label: 'Priority Locations', icon: Flame, highlight: true },
        { id: 'rescue-missions', label: 'Missions', icon: Workflow, count: 4 },
      ],
    },
    {
      title: 'Team & Logistics',
      items: [
        { id: 'rescue-teams', label: 'Teams', icon: Users },
        { id: 'rescue-roads', label: 'Road Status', icon: Compass },
        { id: 'rescue-resources', label: 'Resources', icon: Layers },
        { id: 'rescue-alerts', label: 'Rescue Alerts', icon: AlertTriangle },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'rescue-profile', label: 'Rescue Profile', icon: User },
      ],
    },
  ];

  // 3. Control Center Navigation (Decision-oriented labels)
  const controlGroups: NavGroup[] = [
    {
      title: 'Command',
      items: [
        { id: 'control-overview', label: 'Control Overview', icon: Radio },
        { id: 'control-map', label: 'Regional Risk Map', icon: Map },
        { id: 'control-evolution', label: 'Risk Over Time', icon: TrendingUp },
        { id: 'control-priority', label: 'Where Help Is Needed Most', icon: Flame, highlight: true },
        { id: 'control-impact', label: 'People & Places at Risk', icon: BarChart3 },
      ],
    },
    {
      title: 'Operations',
      items: [
        { id: 'control-leadtime', label: 'Time to Act', icon: Clock },
        { id: 'control-alertcenter', label: 'Emergency Alerts', icon: Send },
        { id: 'control-ops', label: 'Operations', icon: Workflow },
      ],
    },
    {
      title: 'Conditions & AI',
      items: [
        { id: 'control-sensors', label: 'Weather & Ground Conditions', icon: Waves },
        { id: 'control-ai', label: 'AI Insights', icon: Cpu },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'control-profile', label: 'Control Profile', icon: User },
      ],
    },
  ];

  const activeGroups =
    currentRole === 'citizen'
      ? citizenGroups
      : currentRole === 'rescue'
      ? rescueGroups
      : controlGroups;

  const roleBadge =
    currentRole === 'citizen'
      ? { label: 'Citizen Resident', badge: 'Public Safety' }
      : currentRole === 'rescue'
      ? { label: 'Field Operations', badge: 'NDRF / SDRF' }
      : { label: 'District Operations Room', badge: 'DEOC EOC' };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:inset-auto lg:h-full lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between p-3 overflow-y-auto">
          <div className="space-y-4">
            {/* Header role info */}
            <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {roleBadge.badge}
                </span>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 lg:hidden"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs font-black text-slate-900 mt-0.5">{roleBadge.label}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Geospatial Sync: Real-time</span>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-4">
              {activeGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  <div className="px-3 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {group.title}
                    </span>
                  </div>

                  <nav className="space-y-0.5">
                    {group.items.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = currentTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            onSelectTab(tab.id);
                            onClose();
                          }}
                          className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-blue-50 text-blue-800 font-bold shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          } ${tab.alert && !isActive ? 'hover:text-red-700' : ''}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                isActive
                                  ? 'text-blue-700'
                                  : tab.alert
                                  ? 'text-red-600'
                                  : 'text-slate-500 group-hover:text-slate-700'
                              }`}
                            />
                            <span className="truncate">{tab.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {tab.count !== undefined && (
                              <span className="rounded-full bg-red-100 px-1.5 py-0.2 text-[10px] font-bold text-red-800 border border-red-200">
                                {tab.count}
                              </span>
                            )}
                            {tab.badge && (
                              <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800 font-mono border border-blue-200">
                                {tab.badge}
                              </span>
                            )}
                            {tab.highlight && !isActive && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Authority & Helpline footer */}
          <div className="border-t border-slate-200 pt-3 px-2 text-[11px] text-slate-500 space-y-2">
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Disaster Helpline</p>
              <p className="text-xs font-mono font-bold text-blue-800 mt-0.5">Dial 1077 (District) | 112</p>
            </div>
            <p className="text-[9px] text-slate-400 text-center font-mono uppercase">
              NDMA • SDMA • IMD • NDRF • GSI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
