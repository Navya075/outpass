import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useStorageSync } from '@/services/storageSync';

export const DashboardLayout: React.FC = () => {
  const { session, isLoading } = useAuth();

  // Initialize cross-tab synchronization
  useStorageSync();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-t-zinc-900 border-slate-200 animate-spin" />
        <span className="text-xs text-slate-500 font-medium mt-3">Loading Controlled Systems...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] text-slate-900 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F7FB]">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-8 relative bg-[#F5F7FB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
