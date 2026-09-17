import React, { useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentDetails, useAuditLogs } from '@/hooks/useDocuments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, getWorkflowBadgeStyle } from '@/features/workflow/StatusBadge';
import { ShieldAlert, RefreshCcw, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';

export const ConflictErrorScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const staleVersion = Number(searchParams.get('staleVersion') || '0');

  const { data: currentDoc, isLoading } = useDocumentDetails(id, session);
  const { data: auditLogs = [] } = useAuditLogs(id);

  const latestAction = useMemo(() => {
    if (auditLogs.length === 0) return null;
    return auditLogs[0];
  }, [auditLogs]);

  const handleResolve = () => {
    navigate(`/document/${id}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white border border-slate-200 shadow-sm rounded-xl text-center space-y-4">
        <RefreshCcw className="h-8 w-8 text-zinc-900 animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Analyzing document version differences...</p>
      </div>
    );
  }

  if (!currentDoc) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-slate-200 shadow-sm rounded-xl text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Document Not Found</h3>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="cursor-pointer">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      {/* Alert Header */}
      <div className="p-5 border border-rose-200 bg-rose-50/70 rounded-xl flex items-start gap-4 shadow-2xs">
        <div className="p-3 bg-white border border-rose-200 rounded-xl text-rose-600 shrink-0 shadow-2xs">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-rose-900">Stale Update Rejected (Concurrency Lock)</h2>
          <p className="text-xs text-rose-700 leading-relaxed">
            Your action was rejected because another user modified this document while you had it open. To prevent overwriting updates, you must sync with the latest state.
          </p>
        </div>
      </div>

      {/* Comparative Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Stale State Info */}
        <Card className="bg-white border-slate-200 shadow-2xs opacity-75">
          <CardHeader className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Your Session State</span>
              <span className="font-mono text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">v{staleVersion}</span>
            </div>
            <CardTitle className="text-base font-bold text-slate-700 mt-2 truncate">
              {currentDoc.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-xs text-slate-500 italic">
              You loaded this document at version <strong className="text-slate-700">v{staleVersion}</strong>. 
              Any modifications made to this version could not be applied because the document has moved forward.
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 leading-normal line-clamp-6">
              {currentDoc.body}
            </div>
          </CardContent>
        </Card>

        {/* Current Active Server State */}
        <Card className="bg-white border-zinc-200 shadow-sm ring-1 ring-zinc-900/10">
          <CardHeader className="p-6 border-b border-slate-200 bg-zinc-50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-zinc-900">Current Server State</span>
              <span className="font-mono text-xs text-zinc-900 font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">v{currentDoc.version}</span>
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-2 truncate">
              {currentDoc.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {latestAction ? (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-900 shrink-0" />
                  Last Updated: {latestAction.actorName}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-medium">
                  <span className="flex items-center gap-1">Action: <span className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${getWorkflowBadgeStyle(latestAction.action)}`}>{latestAction.action}</span></span>
                  <span>•</span>
                  <span>State: <StatusBadge status={currentDoc.status} className="scale-75 origin-left" /></span>
                </div>
                {latestAction.comment && (
                  <p className="text-[10px] text-slate-600 italic mt-1 border-t border-slate-200 pt-1">
                    "{latestAction.comment}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Document is currently in status <StatusBadge status={currentDoc.status} className="scale-95 ml-1" />
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed font-sans line-clamp-6">
              {currentDoc.body}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolution actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="cursor-pointer text-xs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
        <Button size="sm" onClick={handleResolve} className="bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer text-xs font-semibold shadow-xs">
          <RefreshCcw className="h-3.5 w-3.5 mr-2" />
          Reload Latest Version
        </Button>
      </div>
    </div>
  );
};
export default ConflictErrorScreen;
