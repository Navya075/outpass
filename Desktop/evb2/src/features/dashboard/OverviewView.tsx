import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList, useAuditLogs } from '@/hooks/useDocuments';
import { KPICards } from './KPICards';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, FileText, PlusCircle, ClipboardList, BookCheck, History, ArrowUpRight } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: documents = [], isLoading } = useDocumentsList(session);
  const { data: auditLogs = [] } = useAuditLogs(undefined, session);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isAuthor = session?.role === 'author';
  const isReviewer = session?.role === 'reviewer';
  const isAdmin = session?.role === 'admin';

  // Items needing attention: rejected drafts or submitted files awaiting review
  const needsAttentionItems = React.useMemo(() => {
    if (isReviewer || isAdmin) {
      return documents.filter((d) => d.status === 'submitted').slice(0, 4);
    }
    return documents
      .filter((d) => d.authorEmail === session?.email && (d.status === 'rejected' || d.status === 'draft'))
      .slice(0, 4);
  }, [documents, session, isReviewer, isAdmin]);

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-8 bg-[#F5F7FB]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 1. Header: Greeting, Subtitle, Date, Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
            Good morning, {session?.name || 'User'}
          </h1>
          <p className="text-xs text-[#64748B] font-sans">
            Here's today's document approval summary for your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono font-medium hidden sm:inline">
            {formattedDate}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-white border border-zinc-900 uppercase tracking-wider shadow-xs">
            Role: {session?.role}
          </span>
        </div>
      </div>

      {/* 2. 4 Outpass Pastel KPI Cards */}
      {!isLoading && <KPICards documents={documents} session={session} />}

      {/* 3. Below KPIs Split Layout: Recent Activity (Left) + Needs Attention (Right) */}
      <div className={`grid grid-cols-1 ${session?.role === 'viewer' ? 'max-w-4xl' : 'lg:grid-cols-2'} gap-8`}>
        {/* Left: Recent Activity / Publications Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-zinc-900">
                {session?.role === 'viewer' ? 'Recent Publications' : 'Recent Activity'}
              </h2>
              <p className="text-xs text-zinc-500">
                {session?.role === 'viewer' ? 'Latest verified public specifications' : 'Latest approvals, edits, and submissions'}
              </p>
            </div>
            {session?.role !== 'viewer' && (
              <button
                onClick={() => navigate('/audit')}
                className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Audit Trail</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
            {session?.role === 'viewer' ? (
              documents.filter((d) => d.status === 'published').length === 0 ? (
                <p className="text-xs text-[#64748B] text-center py-4">No published documents available.</p>
              ) : (
                documents
                  .filter((d) => d.status === 'published')
                  .slice(0, 5)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => navigate(`/document/${doc.id}`)}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-zinc-300 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <h4 className="font-bold text-[#111827] truncate">{doc.title}</h4>
                        <p className="text-[11px] text-[#64748B]">
                          Author: <span className="font-medium text-slate-700">{doc.authorName}</span> • {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                        v{doc.version}
                      </span>
                    </div>
                  ))
              )
            ) : auditLogs.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-4">No recent activity logs available.</p>
            ) : (
              auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 shrink-0 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827] text-xs">{log.actorName}</span>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-xs leading-normal">
                      <span className="font-semibold capitalize text-[#111827]">{log.action}ed</span> v<span className="font-mono font-bold text-[#111827]">{log.version}</span>
                    </p>
                    {log.comment && (
                      <p className="text-[11px] text-[#64748B] italic mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-normal">
                        "{log.comment}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Needs Attention Widget (Hidden for Viewer) */}
        {session?.role !== 'viewer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#111827]">Needs Attention</h2>
                <p className="text-xs text-[#64748B]">Items requiring direct action or review</p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
              {needsAttentionItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  All workflow items are currently up to date!
                </div>
              ) : (
                needsAttentionItems.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F7FB] flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} className="scale-90 origin-left" />
                        <span className="font-mono text-[10px] text-[#64748B]">v{doc.version}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#111827] truncate">{doc.title}</h4>
                      <p className="text-[10px] text-[#64748B]">Author: {doc.authorName}</p>
                    </div>

                    <Button
                      size="sm"
                      className="h-8 px-3 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white shrink-0 cursor-pointer"
                      onClick={() => navigate(doc.status === 'submitted' && (isReviewer || isAdmin) ? '/review' : `/document/${doc.id}`)}
                    >
                      <span>Action</span>
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Quick Actions Bar */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {isAuthor && (
            <button
              onClick={() => navigate('/document/new')}
              className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-zinc-400 cursor-pointer transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                <PlusCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827] group-hover:text-zinc-900">Create Draft</h4>
                <p className="text-[10px] text-[#64748B]">New spec</p>
              </div>
            </button>
          )}

          {isReviewer && (
            <button
              onClick={() => navigate('/review')}
              className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-zinc-400 cursor-pointer transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2.5 rounded-xl bg-[#FFF8E5] text-[#92400E] border border-[#FDE68A]">
                <ClipboardList className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827] group-hover:text-zinc-900">Review Queue</h4>
                <p className="text-[10px] text-[#64748B]">Pending items</p>
              </div>
            </button>
          )}

          <button
            onClick={() => navigate('/published')}
            className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-zinc-400 cursor-pointer transition-all flex items-center gap-3 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#EEFDF8] text-[#047857] border border-[#6EE7B7]">
              <BookCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#111827] group-hover:text-zinc-900">Published Specs</h4>
              <p className="text-[10px] text-[#64748B]">Knowledge base</p>
            </div>
          </button>

          {session?.role !== 'viewer' && (
            <button
              onClick={() => navigate('/audit')}
              className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-zinc-400 cursor-pointer transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <History className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111827] group-hover:text-zinc-900">Audit History</h4>
                <p className="text-[10px] text-[#64748B]">Compliance log</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default OverviewView;
