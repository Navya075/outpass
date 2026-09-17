import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList, useSubmitDocument, useAuditLogs } from '@/hooks/useDocuments';
import { KPICards } from './KPICards';
import { DashboardFilters } from './DashboardFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { RuleTooltip } from '@/components/shared/RuleTooltip';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { Eye, Edit, Send, ArrowRight, ArrowLeft, PlusCircle, ClipboardList, History, Sparkles, Clock, FileText } from 'lucide-react';
import type { Document } from '@/services/mockDb';

export const DashboardView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // TanStack Query
  const { data: documents = [], isLoading, error } = useDocumentsList(session);
  const { data: auditLogs = [] } = useAuditLogs();
  const submitMutation = useSubmitDocument();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Quick Action triggers
  const handleSubmitForReview = async (doc: Document) => {
    if (!session) return;
    try {
      await submitMutation.mutateAsync({
        id: doc.id,
        expectedVersion: doc.version,
        session,
      });
      toast({
        title: 'Document Submitted',
        description: `"${doc.title}" has been placed in the review queue.`,
        type: 'success',
      });
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${doc.id}?staleVersion=${doc.version}`);
      } else {
        toast({
          title: 'Submission Failed',
          description: err.message,
          type: 'error',
        });
      }
    }
  };

  // Filter/Sort logic
  const filteredAndSortedDocs = useMemo(() => {
    let result = [...documents];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (authorFilter !== 'all') {
      result = result.filter((d) => d.authorEmail === authorFilter);
    }

    const [field, direction] = sortBy.split('-');
    result.sort((a, b) => {
      let valA = a[field as keyof Document] ?? '';
      let valB = b[field as keyof Document] ?? '';

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [documents, search, statusFilter, authorFilter, sortBy]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, authorFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedDocs.length / itemsPerPage) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedDocs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedDocs, currentPage]);

  const getEditRule = (doc: Document) => {
    if (!session) return 'Sign in to edit this document.';
    if (session.role !== 'author' && session.role !== 'reviewer' && session.role !== 'admin') {
      return 'Only authors, reviewers, or admins can edit documents.';
    }
    if (doc.authorEmail !== session.email) return 'You can only edit documents you own.';
    if (doc.status !== 'draft' && doc.status !== 'rejected') {
      return `Documents in ${doc.status} state cannot be edited.`;
    }
    return '';
  };

  const getSubmitRule = (doc: Document) => {
    if (!session) return 'Sign in to submit documents.';
    if (doc.authorEmail !== session.email) return 'Only the owner can submit this document.';
    if (doc.status !== 'draft' && doc.status !== 'rejected') {
      return 'Only draft or rejected documents can be submitted for review.';
    }
    return '';
  };

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto mt-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-rose-600">Unable to load dashboard</h3>
        <p className="text-xs text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Personalized Welcome Banner */}
      <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden border border-zinc-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-sm border border-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Controlled Document Approval System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {session?.name || 'User'}
          </h1>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            You are logged in as <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">{session?.role}</span>. Review pending approvals, create document drafts, and inspect chronological security audits.
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {session?.role === 'author' && (
          <button
            onClick={() => navigate('/document/new')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-zinc-400 transition-all text-left flex items-center gap-4 cursor-pointer group"
          >
            <div className="p-3 rounded-lg bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-zinc-900 transition-colors">Create New Draft</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Start drafting a document</p>
            </div>
          </button>
        )}

        {(session?.role === 'reviewer' || session?.role === 'admin') && (
          <button
            onClick={() => navigate('/review')}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-zinc-400 transition-all text-left flex items-center gap-4 cursor-pointer group"
          >
            <div className="p-3 rounded-lg bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-zinc-900 transition-colors">Review Queue</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Evaluate pending requests</p>
            </div>
          </button>
        )}

        <button
          onClick={() => navigate('/audit')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-zinc-400 transition-all text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-zinc-900 transition-colors">Audit Trail</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">View security log trail</p>
          </div>
        </button>

        <button
          onClick={() => { setStatusFilter('published'); setSearch(''); }}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-zinc-400 transition-all text-left flex items-center gap-4 cursor-pointer group"
        >
          <div className="p-3 rounded-lg bg-zinc-100 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-zinc-900 transition-colors">Published Specs</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Filter active published files</p>
          </div>
        </button>
      </div>

      {/* Metric KPIs */}
      {!isLoading && <KPICards documents={documents} session={session} />}

      {/* Main Grid: Document List + Recent Activity Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document List (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">Document Repository</h2>
              <p className="text-xs text-slate-500 mt-0.5">Filter, search, and manage document approval lifecycles.</p>
            </div>
          </div>

          {/* Filters */}
          <DashboardFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            authorFilter={authorFilter}
            setAuthorFilter={setAuthorFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Document Table */}
          {isLoading ? (
            <SkeletonLoader variant="list" count={5} />
          ) : filteredAndSortedDocs.length === 0 ? (
            <EmptyState
              title="No documents found"
              description="No documents match your selected filters."
            />
          ) : (
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-200 hover:bg-transparent">
                      <TableHead className="text-slate-900 font-bold py-3 text-xs">Title</TableHead>
                      <TableHead className="text-slate-900 font-bold text-xs">Status</TableHead>
                      <TableHead className="text-slate-900 font-bold text-xs">Version</TableHead>
                      <TableHead className="text-slate-900 font-bold text-xs">Author</TableHead>
                      <TableHead className="text-right text-slate-900 font-bold text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDocs.map((doc) => {
                      const editRuleErr = getEditRule(doc);
                      const submitRuleErr = getSubmitRule(doc);
                      const initials = getAvatarInitials(doc.authorName);

                      return (
                        <TableRow key={doc.id} className="border-slate-200 hover:bg-slate-50/60 transition-colors">
                          <TableCell className="font-semibold text-slate-900 max-w-[220px]">
                            <div className="flex flex-col">
                              <span className="truncate hover:text-zinc-900 hover:underline transition-colors cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                                {doc.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                Updated {new Date(doc.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={doc.status} />
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">
                            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                              v{doc.version}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                                {doc.authorName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                onClick={() => navigate(`/document/${doc.id}`)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <RuleTooltip content={editRuleErr} disabled={!!editRuleErr}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                                  onClick={() => navigate(`/document/${doc.id}/edit`)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </RuleTooltip>

                              <RuleTooltip content={submitRuleErr} disabled={!!submitRuleErr}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
                                  onClick={() => handleSubmitForReview(doc)}
                                  title="Submit for Review"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </RuleTooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-2 px-2">
                  <span className="text-xs text-slate-500">
                    Showing Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredAndSortedDocs.length} items)
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 cursor-pointer gap-1.5 text-xs"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 cursor-pointer gap-1.5 text-xs"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

        {/* Recent Activity Side Feed (1 Column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/audit')}
              className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0 text-xs">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{log.actorName}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    <span className="font-semibold capitalize text-slate-800">{log.action}ed</span> a document version <span className="font-mono font-bold text-slate-700">v{log.version}</span>
                  </p>
                  {log.comment && (
                    <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                      "{log.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
