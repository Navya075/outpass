import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { SEEDED_USERS } from '@/services/mockDb';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { 
  X, 
  UserCog, 
  Settings, 
  History, 
  BookCheck, 
  LogOut, 
  Database, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Info,
  LayoutDashboard,
  Files,
  FileEdit
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const { session, logout, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleDevSwitch = async (email: string) => {
    const success = await login(email);
    if (success) {
      toast({
        title: 'Context Switched',
        description: `Swapped user context to ${email}.`,
        type: 'info',
      });
      onClose();
      navigate('/dashboard');
    }
  };

  const getAvatarInitials = (name?: string) => {
    if (!name) return 'CS';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const isAuthor = session?.role === 'author';
  const isReviewer = session?.role === 'reviewer';
  const isAdmin = session?.role === 'admin';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slide-Over Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between font-sans"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Drawer Header & Close Button */}
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-zinc-900" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Controlled Systems</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 1. Profile Header */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100 border border-zinc-200">
                  <div className="h-14 w-14 rounded-full bg-zinc-900 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-xs">
                    {getAvatarInitials(session?.name)}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 truncate">{session?.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{session?.email}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white text-zinc-900 border border-zinc-200 shadow-2xs">
                        {session?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Workspace Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Information</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Workspace</span>
                      <span className="font-bold text-slate-900">Controlled Systems</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Session Status</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        Active Session
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Cross-Tab Sync</span>
                      <span className="font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded text-[11px] border border-zinc-200">
                        Tab Listener Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Persistence Store</span>
                      <span className="font-semibold text-slate-700">Browser LocalStorage</span>
                    </div>
                  </div>
                </div>

                {/* 3. Quick Navigation Shortcuts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Shortcuts</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => { onClose(); navigate('/overview'); }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-500" />
                      <span>Overview</span>
                    </button>

                    <button
                      onClick={() => { onClose(); navigate('/documents'); }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                    >
                      <Files className="h-4 w-4 text-slate-500" />
                      <span>Documents</span>
                    </button>

                    {(isAuthor || isReviewer || isAdmin) && (
                      <button
                        onClick={() => { onClose(); navigate('/drafts'); }}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                      >
                        <FileEdit className="h-4 w-4 text-slate-500" />
                        <span>My Drafts</span>
                      </button>
                    )}

                    <button
                      onClick={() => { onClose(); navigate('/published'); }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                    >
                      <BookCheck className="h-4 w-4 text-slate-500" />
                      <span>Published Specifications</span>
                    </button>

                    <button
                      onClick={() => { onClose(); navigate('/audit'); }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
                    >
                      <History className="h-4 w-4 text-slate-500" />
                      <span>Audit Trail</span>
                    </button>


                  </div>
                </div>

                {/* 4. Quick Actions (Dev Context Switch) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions & Developer Tools</h4>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-xs font-semibold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <UserCog className="h-4 w-4 text-zinc-900" />
                            <span>Switch Context (Dev Tool)</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Context Switch</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-xl z-50">
                        <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase font-bold">Available Profiles</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(SEEDED_USERS).map((user) => (
                          <DropdownMenuItem
                            key={user.email}
                            onClick={() => handleDevSwitch(user.email)}
                            className="flex items-center justify-between cursor-pointer focus:bg-slate-100 py-2"
                          >
                            <div>
                              <p className="font-bold text-xs text-slate-900">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{user.role}</p>
                            </div>
                            {session?.email === user.email && (
                              <Check className="h-4 w-4 text-zinc-900 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 5. Developer Section Status */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Architecture</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Database className="h-3.5 w-3.5 text-zinc-900" />
                      <span>Mock Database: Seeded In-Memory Store</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Optimistic Concurrency: ExpectedVersion Lock</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Info className="h-3.5 w-3.5 text-purple-600" />
                      <span>Storage Listener: Cross-Tab Event Sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Account Section: Logout */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <Button
                variant="destructive"
                className="w-full h-11 rounded-xl justify-center font-bold text-xs shadow-2xs cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default ProfileDrawer;
