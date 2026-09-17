import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList, useReviewDocument, usePublishDocument, useAuditLogs } from '@/hooks/useDocuments';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { RuleTooltip } from '@/components/shared/RuleTooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { FileText, Check, X, BookOpen, Send, Clock, ClipboardList, Search } from 'lucide-react';
import type { Document } from '@/services/mockDb';

export const ReviewQueueView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useDocumentsList(session);
  const reviewMutation = useReviewDocument();
  const publishMutation = usePublishDocument();

  const [activeQueueTab, setActiveQueueTab] = useState<'submitted' | 'approved' | 'rejected'>('submitted');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [rejectComment, setRejectComment] = useState('');
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const queueDocs = useMemo(() => {
    return documents.filter(d => d.status === activeQueueTab);
  }, [documents, activeQueueTab]);

  const filteredQueue = useMemo(() => {
    if (!searchTerm.trim()) return queueDocs;
    const q = searchTerm.toLowerCase();
    return queueDocs.filter(d => d.title.toLowerCase().includes(q) || d.authorName.toLowerCase().includes(q));
  }, [queueDocs, searchTerm]);

  const activeDoc = useMemo(() => {
    return documents.find(d => d.id === selectedId) || null;
  }, [documents, selectedId]);

  const { data: auditLogs = [] } = useAuditLogs(activeDoc?.id);

  React.useEffect(() => {
    if (filteredQueue.length > 0) {
      if (!selectedId || !filteredQueue.some(d => d.id === selectedId)) {
        setSelectedId(filteredQueue[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredQueue, activeQueueTab]);

  const handleApprove = async () => {
    if (!activeDoc || !session) return;
    try {
      await reviewMutation.mutateAsync({
        id: activeDoc.id,
        action: 'approve',
        expectedVersion: activeDoc.version,
        session
      });
      toast({
        title: 'Document Approved',
        description: `"${activeDoc.title}" has been successfully approved.`,
        type: 'success',
      });
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${activeDoc.id}?staleVersion=${activeDoc.version}`);
      } else {
        toast({ title: 'Approval Failed', description: err.message, type: 'error' });
      }
    }
  };

  const handleReject = async () => {
    if (!activeDoc || !session) return;
    if (!rejectComment.trim()) {
      toast({ title: 'Comment Required', description: 'Please provide a reason for rejecting the document.', type: 'warning' });
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        id: activeDoc.id,
        action: 'reject',
        comment: rejectComment,
        expectedVersion: activeDoc.version,
        session
      });
      toast({
        title: 'Document Rejected',
        description: `"${activeDoc.title}" was returned to draft state.`,
        type: 'success',
      });
      setIsRejectOpen(false);
      setRejectComment('');
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${activeDoc.id}?staleVersion=${activeDoc.version}`);
      } else {
        toast({ title: 'Rejection Failed', description: err.message, type: 'error' });
      }
    }
  };

  const handlePublish = async () => {
    if (!activeDoc || !session) return;
    try {
      await publishMutation.mutateAsync({
        id: activeDoc.id,
        expectedVersion: activeDoc.version,
        session
      });
      toast({
        title: 'Document Published',
        description: `"${activeDoc.title}" is now visible to all viewers.`,
        type: 'success',
      });
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${activeDoc.id}?staleVersion=${activeDoc.version}`);
      } else {
        toast({ title: 'Publishing Failed', description: err.message, type: 'error' });
      }
    }
  };

  const getReviewRule = (doc: Document) => {
    if (!session) return 'Sign in to review documents.';
    if (session.role !== 'reviewer' && session.role !== 'admin') {
      return 'Only reviewers or admins can approve/reject documents.';
    }
    if (doc.authorEmail === session.email) {
      return 'You cannot review or approve your own documents.';
    }
    if (doc.status !== 'submitted') {
      return 'This document is not currently in review state.';
    }
    return '';
  };

  const getPublishRule = (doc: Document) => {
    if (!session) return 'Sign in to publish documents.';
    if (session.role !== 'reviewer' && session.role !== 'admin') {
      return 'Only reviewers or admins can publish documents.';
    }
    if (doc.status !== 'approved') {
      return 'Only approved documents can be published.';
    }
    return '';
  };

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-5 bg-[#F5F7FB]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-[#111827]" />
          Review Queue Workspace
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">Outpass-style request management for evaluating, approving, and publishing submissions.</p>
      </div>

      <div className="h-[calc(100vh-13rem)] flex overflow-hidden border border-[#E2E8F0] rounded-2xl bg-white shadow-2xs">
        {/* LEFT COLUMN: Request Queue Sidebar */}
        <div className="w-88 border-r border-[#E2E8F0] flex flex-col h-full bg-[#F5F7FB] shrink-0">
          {/* Outpass Segmented Queue Tab Bar */}
          <div className="p-3 border-b border-[#E2E8F0] space-y-3 bg-white">
            <div className="bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] grid grid-cols-3 gap-1 text-center">
              {(['submitted', 'approved', 'rejected'] as const).map((tabKey) => {
                const count = documents.filter(d => d.status === tabKey).length;
                const isActive = activeQueueTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveQueueTab(tabKey)}
                    className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    {tabKey} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
              <Input
                placeholder="Search queue requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 bg-white border-[#E2E8F0] text-xs rounded-lg"
              />
            </div>
          </div>
          
          {/* Scrollable Request List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-4 space-y-3">
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No items in <span className="font-bold capitalize">{activeQueueTab}</span> queue.
              </div>
            ) : (
              filteredQueue.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full text-left p-4 hover:bg-white transition-colors flex flex-col gap-1.5 cursor-pointer ${
                    selectedId === doc.id ? 'bg-white border-l-4 border-zinc-900 shadow-2xs' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-bold truncate ${
                      selectedId === doc.id ? 'text-zinc-900' : 'text-[#111827]'
                    }`}>
                      {doc.title}
                    </span>
                    <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-semibold text-slate-600">
                      v{doc.version}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#64748B]">
                    <span>by {doc.authorName}</span>
                    <StatusBadge status={doc.status} className="scale-85 origin-right" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Document Detail & Review Reader */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          {activeDoc ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header Bar */}
              <div className="h-14 border-b border-[#E2E8F0] px-6 flex items-center justify-between bg-[#F5F7FB] shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-[#64748B]" />
                  <span className="text-xs font-bold text-[#111827]">Review Reader</span>
                  <span className="text-[10px] text-[#64748B] font-mono">ID: {activeDoc.id}</span>
                </div>
                
                {/* Workflow Actions */}
                <div className="flex items-center gap-2">
                  {activeDoc.status === 'submitted' && (
                    <>
                      <RuleTooltip content={getReviewRule(activeDoc)} disabled={!!getReviewRule(activeDoc)}>
                        <Button
                          size="sm"
                          onClick={handleApprove}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold shadow-2xs rounded-lg"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      </RuleTooltip>

                      <RuleTooltip content={getReviewRule(activeDoc)} disabled={!!getReviewRule(activeDoc)}>
                        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 cursor-pointer text-xs font-semibold shadow-2xs rounded-lg"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-2xl">
                            <DialogHeader>
                              <DialogTitle>Reject Document Request</DialogTitle>
                              <DialogDescription>
                                Specify why you are returning this document to draft state. The author will be notified.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-2">
                              <Textarea
                                placeholder="Write rejection comment here..."
                                value={rejectComment}
                                onChange={(e) => setRejectComment(e.target.value)}
                                rows={4}
                                className="rounded-xl"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)} className="cursor-pointer rounded-lg">
                                Cancel
                              </Button>
                              <Button variant="destructive" size="sm" onClick={handleReject} className="cursor-pointer rounded-lg">
                                Confirm Rejection
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </RuleTooltip>
                    </>
                  )}

                  {activeDoc.status === 'approved' && (
                    <RuleTooltip content={getPublishRule(activeDoc)} disabled={!!getPublishRule(activeDoc)}>
                      <Button
                        size="sm"
                        onClick={handlePublish}
                        className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer text-xs font-semibold shadow-2xs rounded-lg"
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Publish Spec
                      </Button>
                    </RuleTooltip>
                  )}
                </div>
              </div>

              {/* Main Document Content Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Reading Pane */}
                <div className="flex-1 p-8 overflow-y-auto border-r border-[#E2E8F0] bg-white">
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-2xl font-extrabold tracking-tight text-[#111827]">{activeDoc.title}</h1>
                      <StatusBadge status={activeDoc.status} className="mt-1" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-[#64748B] border-b border-slate-100 pb-4">
                      <span>Author: <strong className="text-[#111827]">{activeDoc.authorName}</strong></span>
                      <span>Version: <strong className="text-[#111827]">v{activeDoc.version}</strong></span>
                      <span>Updated: <strong className="text-[#111827]">{new Date(activeDoc.updatedAt).toLocaleDateString()}</strong></span>
                    </div>

                    <div className="text-sm text-[#111827] leading-relaxed whitespace-pre-wrap font-sans min-h-[300px]">
                      {activeDoc.body}
                    </div>
                  </div>
                </div>

                {/* Document Audit History Sidebar */}
                <div className="w-80 p-6 overflow-y-auto space-y-6 bg-[#F5F7FB]">
                  <div>
                    <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Audit Log</h4>
                    <div className="space-y-4 relative pl-4 border-l border-slate-200">
                      {auditLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="relative text-xs">
                          <div className="absolute -left-[21px] top-1 bg-white rounded-full border border-slate-300 p-0.5 text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                          </div>
                          
                          <div className="font-bold text-slate-800 capitalize">{log.action}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">by {log.actorName}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {new Date(log.timestamp).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {log.comment && (
                            <div className="mt-1 p-2.5 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-600 italic shadow-2xs leading-normal">
                              "{log.comment}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <BookOpen className="h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-semibold text-slate-700">No Request Selected</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Select a document request from the queue to view content and execute workflow decisions.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ReviewQueueView;
