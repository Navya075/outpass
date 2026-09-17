import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList, useSubmitDocument } from '@/hooks/useDocuments';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { Eye, Edit, Send, ArrowRight, ArrowLeft, Search, PlusCircle, Files, List, LayoutGrid } from 'lucide-react';
import type { Document, DocumentStatus } from '@/services/mockDb';

export const DocumentsView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: documents = [], isLoading, error } = useDocumentsList(session);
  const submitMutation = useSubmitDocument();

  const isViewer = session?.role === 'viewer';
  const isAuthor = session?.role === 'author';
  const isReviewer = session?.role === 'reviewer';
  const shouldHideArchived = isAuthor || isReviewer;

  // Controls
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeTab, setActiveTab] = useState<string>(isViewer ? 'published' : 'all');
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allStatusTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All Files' },
    { id: 'draft', label: 'Draft' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'approved', label: 'Approved' },
    { id: 'published', label: 'Published' },
    { id: 'archived', label: 'Archived' },
  ];

  const statusTabs = isViewer
    ? [{ id: 'published', label: 'Published' }]
    : shouldHideArchived
      ? allStatusTabs.filter((tab) => tab.id !== 'archived')
      : allStatusTabs;

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
        toast({ title: 'Submission Failed', description: err.message, type: 'error' });
      }
    }
  };

  const filteredAndSortedDocs = useMemo(() => {
    let result = [...documents];

    if (isViewer) {
      result = result.filter((d) => d.status === 'published');
    } else if (shouldHideArchived) {
      result = result.filter((d) => d.status !== 'archived');
      if (activeTab !== 'all') {
        result = result.filter((d) => d.status === activeTab);
      }
    } else if (activeTab !== 'all') {
      result = result.filter((d) => d.status === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
      );
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
  }, [documents, activeTab, search, authorFilter, sortBy]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, authorFilter, sortBy]);

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

  const getWorkflowStageText = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return 'Drafting Phase';
      case 'submitted': return 'Awaiting Review';
      case 'approved': return 'Approved for Publishing';
      case 'rejected': return 'Returned for Revisions';
      case 'published': return 'Active Specification';
      case 'archived': return 'Archived Retention';
      default: return status;
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto mt-12 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-lg font-bold text-rose-600">Unable to load repository</h3>
        <p className="text-xs text-slate-500">{error.message}</p>
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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2.5">
            <Files className="h-6 w-6 text-[#111827]" />
            Documents Repository
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">Central workspace repository for browsing and managing all system documents.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-zinc-900 text-white shadow-2xs font-bold' : 'text-[#64748B] hover:text-[#111827]'
              }`}
              title="Table View (Default)"
            >
              <List className="h-4 w-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'cards' ? 'bg-zinc-900 text-white shadow-2xs font-bold' : 'text-[#64748B] hover:text-[#111827]'
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Cards</span>
            </button>
          </div>

          {session?.role === 'author' && (
            <Button onClick={() => navigate('/document/new')} className="h-10 px-4 rounded-xl gap-2 cursor-pointer shadow-2xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs">
              <PlusCircle className="h-4 w-4" />
              Create Document
            </Button>
          )}
        </div>
      </div>

      {/* Large Segmented Status Tabs */}
      <div className="bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto">
        {statusTabs.map((tab) => {
          const count = tab.id === 'all'
            ? (shouldHideArchived ? documents.filter(d => d.status !== 'archived').length : documents.length)
            : documents.filter(d => d.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="capitalize">{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isActive ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Large Clean Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#64748B]" />
          <Input
            placeholder="Search documents by title or content body..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 bg-white border-[#E2E8F0] text-[#111827] shadow-2xs h-11 rounded-2xl text-sm placeholder:text-[#64748B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-[160px]">
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="bg-white border-[#E2E8F0] shadow-2xs text-xs h-11 rounded-2xl">
                <SelectValue placeholder="Author Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                <SelectItem value="alice@example.com">Alice Thorne</SelectItem>
                <SelectItem value="bob@example.com">Bob Jenkins</SelectItem>
                <SelectItem value="admin@example.com">Charlie Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[170px]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white border-[#E2E8F0] shadow-2xs text-xs h-11 rounded-2xl">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="version-desc">Highest Version</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Primary Workspace View (Default: Professional Table View) */}
      {isLoading ? (
        <SkeletonLoader variant="list" count={6} />
      ) : filteredAndSortedDocs.length === 0 ? (
        <EmptyState title="No documents found" description="No documents match your filter or search query." />
      ) : (
        <div className="space-y-4">
          {(isViewer ? 'cards' : viewMode) === 'table' ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow className="border-[#E2E8F0] hover:bg-transparent">
                    <TableHead className="w-1/3 text-[#111827] font-bold py-4">Document</TableHead>
                    <TableHead className="text-[#111827] font-bold">Status</TableHead>
                    <TableHead className="text-[#111827] font-bold">Version</TableHead>
                    <TableHead className="text-[#111827] font-bold">Author</TableHead>
                    <TableHead className="text-[#111827] font-bold">Updated</TableHead>
                    <TableHead className="text-[#111827] font-bold">Workflow Stage</TableHead>
                    <TableHead className="text-right text-[#111827] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocs.map((doc) => {
                    const editRuleErr = getEditRule(doc);
                    const submitRuleErr = getSubmitRule(doc);
                    const initials = getAvatarInitials(doc.authorName);
                    const stageText = getWorkflowStageText(doc.status);

                    return (
                      <TableRow key={doc.id} className="border-[#E2E8F0] hover:bg-zinc-50 transition-colors">
                        <TableCell className="font-bold text-[#111827] max-w-[260px] py-4">
                          <span className="truncate block hover:text-zinc-900 hover:underline cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                            {doc.title}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-normal truncate block mt-0.5">
                            {doc.body.slice(0, 65)}...
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={doc.status} />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-[#64748B]">
                          <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md font-bold text-zinc-700">
                            v{doc.version}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                              {doc.authorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-[#64748B]">
                          {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-700">
                          {stageText}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-slate-600 hover:text-zinc-900 cursor-pointer"
                              onClick={() => navigate(`/document/${doc.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                            {(doc.status === 'draft' || doc.status === 'rejected') && doc.authorEmail === session?.email && (
                              <RuleTooltip content={editRuleErr} disabled={!!editRuleErr}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2.5 text-xs text-slate-600 hover:text-zinc-900 cursor-pointer"
                                  onClick={() => navigate(`/document/${doc.id}/edit`)}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1" />
                                  Edit
                                </Button>
                              </RuleTooltip>
                            )}
                            {doc.status === 'draft' && doc.authorEmail === session?.email && (
                              <RuleTooltip content={submitRuleErr} disabled={!!submitRuleErr}>
                                <Button
                                  size="sm"
                                  className="h-8 px-2.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
                                  onClick={() => handleSubmitForReview(doc)}
                                >
                                  <Send className="h-3.5 w-3.5 mr-1" />
                                  Submit
                                </Button>
                              </RuleTooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Cards View */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedDocs.map((doc) => {
                const initials = getAvatarInitials(doc.authorName);

                return (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StatusBadge status={doc.status} />
                        <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold text-slate-700">
                          v{doc.version}
                        </span>
                      </div>
                      <h3 
                        className="text-base font-bold text-[#111827] hover:text-zinc-900 hover:underline cursor-pointer transition-colors line-clamp-1"
                        onClick={() => navigate(`/document/${doc.id}`)}
                      >
                        {doc.title}
                      </h3>
                      <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed font-sans min-h-[48px]">
                        {doc.body}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#111827] truncate block max-w-[110px]">
                            {doc.authorName}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            {new Date(doc.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 rounded-xl text-xs font-semibold text-zinc-900 border-zinc-200 bg-zinc-100 hover:bg-zinc-200 cursor-pointer"
                        onClick={() => navigate(`/document/${doc.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        View Specification
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2 px-2">
              <span className="text-xs text-[#64748B]">
                Page <strong className="text-[#111827]">{currentPage}</strong> of <strong className="text-[#111827]">{totalPages}</strong> ({filteredAndSortedDocs.length} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer gap-1.5 text-xs rounded-xl"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer gap-1.5 text-xs rounded-xl"
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
    </motion.div>
  );
};
export default DocumentsView;
