import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { 
  LayoutDashboard, 
  Files, 
  FileEdit, 
  ClipboardList, 
  BookCheck, 
  History, 
  Archive, 
  LogOut, 
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthor = session?.role === 'author';
  const isReviewer = session?.role === 'reviewer';
  const isAdmin = session?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const workspaceNav = [
    { to: '/overview', label: 'Overview', icon: LayoutDashboard },
    ...((isAuthor || isReviewer || isAdmin) ? [{ to: '/documents', label: 'Documents', icon: Files }] : []),
    ...(isAuthor ? [{ to: '/drafts', label: 'My Drafts', icon: FileEdit }] : []),
  ];

  const publishingNav = [
    { to: '/published', label: 'Published Specifications', icon: BookCheck },
    ...(isReviewer ? [{ to: '/review', label: 'Review Queue', icon: ClipboardList }] : []),
  ];

  const adminNav = [
    ...((isAuthor || isReviewer || isAdmin) ? [{ to: '/audit', label: 'Audit Trail', icon: History }] : []),
    ...(isAdmin ? [{ to: '/archived', label: 'Archived Files', icon: Archive }] : []),
  ];

  return (
    <aside className="w-64 border-r border-[#E2E8F0] bg-white flex flex-col h-screen shrink-0 shadow-2xs">
      {/* Navigation Groups */}
      <nav className="flex-1 px-3.5 py-6 space-y-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-6">
          {/* Section 1: Workspace */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Workspace
            </div>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3.5 py-2 rounded-lg text-xs transition-all duration-150 group cursor-pointer",
                      isActive
                        ? "bg-zinc-900 text-white font-semibold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                    )
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Action Shortcut for Authors */}
          {isAuthor && (
            <div className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Quick Action
              </div>
              <NavLink
                to="/document/new"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border border-zinc-200 bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs",
                    isActive ? "bg-zinc-800" : ""
                  )
                }
              >
                <PlusCircle className="h-4 w-4 text-white shrink-0" />
                <span>Create New Draft</span>
              </NavLink>
            </div>
          )}

          {/* Section 2: Publishing */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Publishing
            </div>
            {publishingNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3.5 py-2 rounded-lg text-xs transition-all duration-150 group cursor-pointer",
                      isActive
                        ? "bg-zinc-900 text-white font-semibold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                    )
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
                      <span>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Section 3: Administration */}
          {adminNav.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Administration
              </div>
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between px-3.5 py-2 rounded-lg text-xs transition-all duration-150 group cursor-pointer",
                        isActive
                          ? "bg-zinc-900 text-white font-semibold shadow-xs"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Account / Logout */}
        <div className="pt-4 border-t border-zinc-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-transparent transition-all duration-150 group cursor-pointer w-full text-left"
          >
            <LogOut className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-red-600 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
export default Sidebar;
