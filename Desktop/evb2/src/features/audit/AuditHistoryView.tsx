import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuditLogs, useDocumentsList } from '@/hooks/useDocuments';
import { useAuth } from '@/features/auth/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Clock, User, FileText, ArrowRight, ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import type { AuditLog } from '@/services/mockDb';
import { getWorkflowBadgeStyle } from '@/features/workflow/StatusBadge';

export const AuditHistoryView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: auditLogs = [], isLoading } = useAuditLogs();
  const { data: documents = [] } = useDocumentsList(session);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const docMap = useMemo(() => {
    const map = new Map<string, string>();
    documents.forEach((d) => map.set(d.id, d.title));
    return map;
  }, [documents]);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return auditLogs;
    const q = search.toLowerCase();
    return auditLogs.filter((log) => {
      const docTitle = docMap.get(log.documentId) || '';
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        docTitle.toLowerCase().includes(q) ||
        (log.comment && log.comment.toLowerCase().includes(q))
      );
    });
  }, [auditLogs, search, docMap]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const getActionBadge = (action: AuditLog['action']) => {
    return getWorkflowBadgeStyle(action);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Global Audit Trail</h2>
        <p className="text-xs text-slate-500 mt-0.5">Chronological system ledger tracking all document transitions and security audits.</p>
      </div>

      {/* Filters search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Filter audit events by actor, document title, comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200 text-slate-800 text-sm shadow-2xs"
        />
      </div>

      {/* Audit List Timeline */}
      {isLoading ? (
        <SkeletonLoader variant="list" count={5} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState title="No audit entries" description="We could not find any audit records matching your criteria." />
      ) : (
        <div className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-2xs">
            <CardContent className="p-0">
              <div className="relative pl-6 md:pl-8 py-6 space-y-6 border-l border-slate-200 mx-6 md:mx-8">
                {paginatedLogs.map((log) => {
                  const docTitle = docMap.get(log.documentId) || 'Deleted Document';
                  
                  return (
                    <div key={log.id} className="relative flex flex-col md:flex-row md:items-start gap-4">
                      {/* Timeline Node Dot Icon */}
                      <div className="absolute -left-[35px] md:-left-[43px] top-1 h-5 w-5 bg-white rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shadow-2xs shrink-0">
                        <Clock className="h-3 w-3" />
                      </div>

                      {/* Log details */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{log.actorName}</span>
                          <span className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-md border ${
                            getActionBadge(log.action)
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
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

                        {/* Title link */}
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

                        {/* Comments */}
                        {log.comment && (
                          <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 max-w-xl text-xs text-slate-700 italic">
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
              <span className="text-xs text-slate-500">
                Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredLogs.length} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer gap-1.5 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer gap-1.5 text-xs"
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
  );
};
export default AuditHistoryView;
