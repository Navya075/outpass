import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuditLogs, useDocumentsList } from '@/hooks/useDocuments';
import { useAuth } from '@/features/auth/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Clock, FileText, ArrowRight, ArrowLeft, ArrowUpRight, Search, Filter, History, PlusCircle, Edit3, Send, CheckCircle2, XCircle, RefreshCw, Layers, Archive, ShieldAlert } from 'lucide-react';
import type { AuditLog } from '@/services/mockDb';
import { getWorkflowBadgeStyle } from '@/features/workflow/StatusBadge';

export const AuditTrailExplorerView: React.FC = () => {
  const { session } = useAuth();
  const { data: auditLogs = [], isLoading } = useAuditLogs(undefined, session);
  const { data: documents = [] } = useDocumentsList(session);

  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const docMap = useMemo(() => {
    const map = new Map<string, string>();
    documents.forEach((d) => map.set(d.id, d.title));
    return map;
  }, [documents]);

  const actionsList = ['all', 'create', 'edit', 'submit', 'approve', 'reject', 'reopen', 'publish', 'archive'];

  const filteredLogs = useMemo(() => {
    let result = [...auditLogs];

    if (selectedAction !== 'all') {
      result = result.filter((l) => l.action === selectedAction);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((log) => {
        const docTitle = docMap.get(log.documentId) || '';
        return (
          log.actorName.toLowerCase().includes(q) ||
          docTitle.toLowerCase().includes(q) ||
          (log.comment && log.comment.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [auditLogs, selectedAction, search, docMap]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedAction]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const getActionBadge = (action: AuditLog['action']) => {
    return getWorkflowBadgeStyle(action);
  };

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'create': return PlusCircle;
      case 'edit': return Edit3;
      case 'submit': return Send;
      case 'approve': return CheckCircle2;
      case 'reject': return XCircle;
      case 'reopen': return RefreshCw;
      case 'publish': return Layers;
      case 'archive': return Archive;
      default: return Clock;
    }
  };

  if (session?.role === 'viewer') {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-[#E2E8F0] shadow-2xs rounded-2xl text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-amber-600 mx-auto" />
        <h3 className="text-lg font-bold text-[#111827]">Access Restricted</h3>
        <p className="text-xs text-[#64748B]">Viewers can only access published specifications and their history.</p>
        <Link to="/published">
          <Button variant="outline" size="sm" className="cursor-pointer mt-2">
            View Published Specifications
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-6 bg-[#F5F7FB]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2.5">
          <History className="h-6 w-6 text-[#111827]" />
          Audit Trail Activity Explorer
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">Chronological activity ledger tracking state transitions, comments, and actor identities.</p>
      </div>

      {/* Split Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sticky Left Filter Sidebar */}
        <div className="space-y-4 sticky top-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filter Events
            </h3>

            {/* Search Actor/Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
                <Input
                  placeholder="Actor or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-slate-50 border-slate-200 text-xs h-9 rounded-xl"
                />
              </div>
              {actionsList.map((act) => (
                <button
                  key={act}
                  onClick={() => setSelectedAction(act)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-colors flex items-center justify-between cursor-pointer ${
                    selectedAction === act
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#111827]'
                  }`}
                >
                  <span>{act === 'all' ? 'All Actions' : act}</span>
                  {act !== 'all' && (
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {auditLogs.filter((l) => l.action === act).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <SkeletonLoader variant="list" count={5} />
          ) : filteredLogs.length === 0 ? (
            <EmptyState title="No Audit Records" description="No audit entries match the selected filters." />
          ) : (
            <div className="space-y-4">
              <Card className="bg-white border border-[#E2E8F0] shadow-2xs rounded-2xl">
                <CardContent className="p-0">
                  <div className="relative pl-6 md:pl-8 py-6 space-y-6 border-l border-slate-200 mx-6 md:mx-8">
                    {paginatedLogs.map((log) => {
                      const docTitle = docMap.get(log.documentId) || 'Document';
                      const ActionIcon = getActionIcon(log.action);
                      
                      return (
                        <div key={log.id} className="relative flex flex-col md:flex-row md:items-start gap-4">
                          <div className="absolute -left-[35px] md:-left-[43px] top-1 h-6 w-6 bg-white rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shadow-2xs shrink-0">
                            <ActionIcon className="h-3 w-3 text-zinc-900" />
                          </div>

                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-[#111827]">{log.actorName}</span>
                              <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md border ${
                                getActionBadge(log.action)
                              }`}>
                                {log.action}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                v{log.version}
                              </span>
                              <span className="hidden md:inline text-slate-300 text-xs">•</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(log.timestamp).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>Document:</span>
                              <Link 
                                to={`/document/${log.documentId}`} 
                                className="text-zinc-900 hover:underline font-semibold inline-flex items-center gap-0.5"
                              >
                                {docTitle}
                                <ArrowUpRight className="h-2.5 w-2.5" />
                              </Link>
                            </div>

                            {log.comment && (
                              <div className="mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 max-w-xl text-xs text-slate-700 italic leading-relaxed">
                                "{log.comment}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-2 px-2">
                  <span className="text-xs text-[#64748B]">
                    Page <strong className="text-[#111827]">{currentPage}</strong> of <strong className="text-[#111827]">{totalPages}</strong> ({filteredLogs.length} total)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 cursor-pointer gap-1.5 text-xs rounded-xl"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 cursor-pointer gap-1.5 text-xs rounded-xl"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Next
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default AuditTrailExplorerView;
