import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ChevronRight, Bell, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const TopNavbar: React.FC = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Document "Company Security Policy v1" was published by Bob Jenkins.', read: false, time: '2 hours ago' },
    { id: '2', text: 'Document "OAuth2 Migration Guide" was rejected by Bob Jenkins.', read: false, time: '1 day ago' },
    { id: '3', text: 'New document "Review Process Guidelines" submitted for review.', read: true, time: '3 days ago' },
  ]);

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    
    let displayName = name.charAt(0).toUpperCase() + name.slice(1);
    if (displayName.length > 20) displayName = displayName.slice(0, 17) + '...';
    if (name === 'new') displayName = 'Create';
    if (name === 'edit') displayName = 'Edit';
    if (name.startsWith('doc-')) displayName = 'Document Details';

    return {
      to: routeTo,
      label: displayName,
      isLast,
    };
  });

  const getAvatarInitials = (name?: string) => {
    if (!name) return 'CS';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-30 shadow-2xs">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-medium">
        <Link to="/overview" className="text-slate-500 hover:text-slate-900 transition-colors">
          Workspace
        </Link>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.to}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            {crumb.isLast ? (
              <span className="text-slate-900 font-bold">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="text-slate-500 hover:text-slate-900 transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Toolbar: Notifications & Small User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 relative border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer shadow-2xs rounded-xl">
              <Bell className="h-4 w-4 text-zinc-600" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-zinc-900 ring-2 ring-white" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 bg-white border-zinc-200 shadow-xl z-50">
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-xs font-bold text-zinc-900">Notifications</span>
              {notifications.some(n => !n.read) && (
                <button onClick={markAllRead} className="text-[10px] text-zinc-900 hover:underline font-semibold cursor-pointer">
                  Mark read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-xl text-xs leading-normal ${
                    n.read ? 'text-zinc-500' : 'text-zinc-900 bg-zinc-50 border border-zinc-200 font-medium'
                  }`}
                >
                  <p className="mb-1">{n.text}</p>
                  <span className="text-[10px] text-zinc-400">{n.time}</span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Component: Small Dropdown with Single Action (Logout) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-3 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs group"
              title="User Account Options"
            >
              <div className="h-7 w-7 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {getAvatarInitials(session?.name)}
              </div>
              <span className="text-xs font-bold text-zinc-800 group-hover:text-zinc-900 transition-colors hidden sm:inline">
                {session?.name || 'User Profile'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1.5 bg-white border-zinc-200 shadow-lg z-50 rounded-xl">
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-rose-600 font-bold text-xs cursor-pointer focus:bg-rose-50 focus:text-rose-700 py-2.5 px-3 rounded-lg"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default TopNavbar;
