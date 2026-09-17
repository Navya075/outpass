import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/useAuth';
import { ToastProvider } from '@/components/ui/toast-provider';

// Pages & Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleProtectedRoute from '@/components/layout/RoleProtectedRoute';
import Login from '@/pages/Login';
import Overview from '@/pages/Overview';
import Documents from '@/pages/Documents';
import MyDrafts from '@/pages/MyDrafts';
import ReviewQueue from '@/pages/ReviewQueue';
import PublishedDocs from '@/pages/PublishedDocs';
import AuditHistory from '@/pages/AuditHistory';
import ArchivedDocs from '@/pages/ArchivedDocs';
import DocumentDetails from '@/pages/DocumentDetails';
import DocumentEditor from '@/pages/DocumentEditor';
import ConflictErrorScreen from '@/pages/ConflictErrorScreen';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Authenticated flow */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected dashboard shell */}
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/published" element={<PublishedDocs />} />
                <Route path="/audit" element={<AuditHistory />} />
                <Route path="/document/:id" element={<DocumentDetails />} />
                <Route path="/conflict/:id" element={<ConflictErrorScreen />} />

                {/* Author features */}
                <Route element={<RoleProtectedRoute allowedRoles={['author', 'reviewer', 'admin']} />}>
                  <Route path="/drafts" element={<MyDrafts />} />
                  <Route path="/document/new" element={<DocumentEditor />} />
                  <Route path="/document/:id/edit" element={<DocumentEditor />} />
                </Route>

                {/* Reviewer / Admin features */}
                <Route element={<RoleProtectedRoute allowedRoles={['reviewer', 'admin']} />}>
                  <Route path="/review" element={<ReviewQueue />} />
                  <Route path="/archived" element={<ArchivedDocs />} />
                </Route>
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};
export default App;
