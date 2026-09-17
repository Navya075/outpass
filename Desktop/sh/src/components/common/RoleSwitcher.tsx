import React from 'react';
import { UserRole } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldAlert, Radio } from 'lucide-react';

interface RoleSwitcherProps {
  onRoleChanged?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleChanged }) => {
  const { currentRole, switchRole } = useAuth();

  const roles: { role: UserRole; label: string; icon: React.FC<{ className?: string }> }[] = [
    { role: 'citizen', label: 'Citizen', icon: User },
    { role: 'rescue', label: 'Rescue Team', icon: ShieldAlert },
    { role: 'control', label: 'Control Center', icon: Radio },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg shadow-2xs">
      <span className="hidden xl:inline-block px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
        Demo Mode:
      </span>
      {roles.map((item) => {
        const Icon = item.icon;
        const isActive = currentRole === item.role;
        return (
          <button
            key={item.role}
            onClick={() => {
              switchRole(item.role);
              if (onRoleChanged) onRoleChanged();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isActive
                ? 'bg-blue-700 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
