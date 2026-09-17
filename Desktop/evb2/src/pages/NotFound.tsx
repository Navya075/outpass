import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto">
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-full text-slate-500 shrink-0 shadow-2xs">
        <AlertCircle className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The link you followed may be broken or the document may have been deleted or archived.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 cursor-pointer text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button size="sm" onClick={() => navigate('/dashboard')} className="bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer gap-1.5 text-xs font-semibold shadow-xs">
          <Home className="h-3.5 w-3.5" />
          Dashboard
        </Button>
      </div>
    </div>
  );
};
export default NotFound;
