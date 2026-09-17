import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield, PenTool, ClipboardCheck, Eye, LogIn, FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

const LOGIN_PROFILES = [
  { email: 'alice@example.com', name: 'Alice Thorne', role: 'author' },
  { email: 'bob@example.com', name: 'Bob Jenkins', role: 'reviewer' },
  { email: 'admin@example.com', name: 'Charlie Admin', role: 'admin' },
  { email: 'viewer@example.com', name: 'Diana Reader', role: 'viewer' },
];

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (user: { email: string; name: string }) => {
    const success = await login(user.email);
    if (success) {
      toast({
        title: 'Welcome Back',
        description: `Logged in as ${user.name}`,
        type: 'success',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Authentication Error',
        description: 'Invalid credentials. Unable to log in.',
        type: 'error',
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'author': return PenTool;
      case 'reviewer': return ClipboardCheck;
      case 'admin': return Shield;
      case 'viewer': return Eye;
      default: return LogIn;
    }
  };

  const getRoleDesc = (role: string) => {
    switch (role) {
      case 'author': return 'Can create and edit draft documents, and submit for review.';
      case 'reviewer': return 'Can approve, reject (requires comment), or publish documents.';
      case 'admin': return 'Can archive documents from any state, and manage all files.';
      case 'viewer': return 'Can only view published documents.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative font-sans">
      <div className="w-full max-w-xl relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-md mx-auto">
            <FileCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Controlled Document Approval System
          </h1>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            Select one of the pre-seeded evaluation accounts to explore role-based permissions and test the complete document approval workflow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LOGIN_PROFILES.map((user) => {
            const Icon = getRoleIcon(user.role);
            return (
              <Card
                key={user.email}
                onClick={() => handleLogin(user)}
                className="bg-white border-zinc-200 shadow-2xs hover:border-zinc-300 cursor-pointer transition-colors group rounded-lg"
              >
                <CardHeader className="p-5 flex flex-row items-center gap-3.5">
                  <div className="p-2.5 bg-zinc-100 rounded-md border border-zinc-200 text-zinc-700 group-hover:text-zinc-900 transition-colors shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-bold text-zinc-900 group-hover:text-zinc-900 transition-colors truncate">
                      {user.name}
                    </CardTitle>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-semibold tracking-wider text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {user.role}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <CardDescription className="text-xs leading-relaxed text-slate-500">
                    {getRoleDesc(user.role)}
                  </CardDescription>
                  <div className="mt-3 text-[10px] text-slate-400 font-mono italic truncate">
                    {user.email}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LoginView;
