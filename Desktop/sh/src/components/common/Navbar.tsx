import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHazard } from '../../context/HazardContext';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { MOCK_ALERTS } from '../../data/mockAlerts';
import {
  Shield,
  Bell,
  Menu,
  X,
  ChevronDown,
  Activity,
  LogOut,
  MapPin,
  AlertCircle,
  Home,
  User,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNavigateHome: () => void;
  onNavigateLanding: () => void;
  onNavigateAlerts: () => void;
  onNavigateProfile?: () => void;
  currentPageTitle?: string;
  showEmergencyNotice?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onNavigateHome,
  onNavigateLanding,
  onNavigateAlerts,
  onNavigateProfile,
  currentPageTitle = 'Overview',
  showEmergencyNotice = true,
}) => {
  const { currentUser, currentRole, logout } = useAuth();
  const { unreadAlertsCount, clearAlertCount } = useHazard();
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const roleLabel =
    currentRole === 'citizen'
      ? 'Citizen Portal'
      : currentRole === 'rescue'
      ? 'Rescue Team'
      : 'Control Center';

  return (
    <header className="shrink-0 relative z-30 w-full border-b border-slate-200 bg-white shadow-2xs">
      {/* Top alert bulletin ticker (calm, semantic, not overwhelming) */}
      {showEmergencyNotice && (
        <div className="flex items-center justify-between bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-900 border-b border-red-100">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span className="font-bold text-red-800 uppercase tracking-wide text-[10px] bg-red-100 px-1.5 py-0.2 rounded border border-red-200">
              Emergency Notice
            </span>
            <span className="truncate text-slate-700 font-medium">
              Extreme Landslide Warning active for Meppadi & Chooralmala Sectors (Rainfall 142mm). Emergency teams deployed.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-600 font-mono text-[11px] shrink-0">
            <span>District Control: <strong>1077</strong></span>
            <span>•</span>
            <span>National: <strong>112</strong></span>
          </div>
        </div>
      )}

      {/* Main navigation bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + Hamburger + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs group-hover:bg-blue-800 transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-slate-900 font-sans">
                  LANDSAFE
                </span>
                <span className="rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-bold text-blue-800 border border-blue-200 uppercase">
                  v2.4
                </span>
              </div>
              <p className="text-[9px] font-medium tracking-wider text-teal-700 font-mono uppercase">
                Predict • Understand • Act
              </p>
            </div>
          </button>

          {/* Breadcrumb indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{roleLabel}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{currentPageTitle}</span>
          </div>
        </div>

        {/* Center: Clearly marked Demo Role Switcher (hidden in normal Citizen view) */}
        {currentRole !== 'citizen' && (
          <div className="hidden md:flex items-center">
            <RoleSwitcher />
          </div>
        )}

        {/* Right: Telemetry state, Notifications, User info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location badge where relevant */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs text-slate-700 font-medium">
            <MapPin className="h-3.5 w-3.5 text-teal-700" />
            <span>{currentUser.location.district}, {currentUser.location.state}</span>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAlertsOpen(!isAlertsOpen);
                if (unreadAlertsCount > 0) clearAlertCount();
              }}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Alerts"
            >
              <Bell className="h-5 w-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute 1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              alerts={MOCK_ALERTS}
              isOpen={isAlertsOpen}
              onClose={() => setIsAlertsOpen(false)}
              onViewAllAlerts={onNavigateAlerts}
            />
          </div>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 hover:bg-slate-50 transition-all text-left shadow-2xs"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-800">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] font-medium text-slate-500 capitalize">
                  {roleLabel}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <div className="border-b border-slate-100 p-2.5 text-xs">
                  <p className="font-bold text-slate-900">{currentUser.fullName}</p>
                  <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                  <p className="text-teal-700 text-[10px] mt-1 font-mono">
                    📍 {currentUser.location.village}
                  </p>
                </div>
                <div className="p-1">
                  {currentRole !== 'citizen' && (
                    <div className="md:hidden py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-2">
                        Demo Role Switcher:
                      </p>
                      <RoleSwitcher onRoleChanged={() => setIsUserMenuOpen(false)} />
                    </div>
                  )}
                  {onNavigateProfile && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigateProfile();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      My Profile & Settings
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigateLanding();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors"
                  >
                    <Home className="h-4 w-4 text-blue-700" />
                    LANDSAFE Overview & USPs
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      onNavigateLanding();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4 text-red-600" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
