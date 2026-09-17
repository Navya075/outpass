import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { 
  useDocumentDetails, 
  useAuditLogs, 
  useSubmitDocument, 
  useReopenDocument, 
  useReviewDocument, 
  usePublishDocument, 
  useArchiveDocument 
} from '@/hooks/useDocuments';
import { WorkflowStepper } from '@/features/workflow/WorkflowStepper';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { RuleTooltip } from '@/components/shared/RuleTooltip';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { ArrowLeft, Clock, History, Calendar, User, FileClock, Check, X, Send, Archive, RefreshCw, ShieldAlert } from 'lucide-react';
import type { Document } from '@/services/mockDb';

export const DocumentDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: doc, isLoading, error, refetch } = useDocumentDetails(id, session);
  const { data: auditLogs = [], isLoading: isLoadingAudit } = useAuditLogs(id, session);

  const [rejectComment, setRejectComment] = useState('');
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const submitMutation = useSubmitDocument();
  const reopenMutation = useReopenDocument();
  const reviewMutation = useReviewDocument();
  const publishMutation = usePublishDocument();
  const archiveMutation = useArchiveDocument();

  const handleAction = async (mutationPromise: Promise<any>, successMsg: string) => {
    try {
      await mutationPromise;
      toast({ title: 'Success', description: successMsg, type: 'success' });
      refetch();
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${id}?staleVersion=${doc?.version}`);
      } else {
        toast({ title: 'Operation Failed', description: err.message, type: 'error' });
      }
    }
  };

  const handleApprove = () => {
    if (!doc || !session) return;
    handleAction(
      reviewMutation.mutateAsync({ id: doc.id, action: 'approve', expectedVersion: doc.version, session }),
      'Document has been approved.'
    );
  };

  const handleReject = async () => {
    if (!doc || !session) return;
    if (!rejectComment.trim()) {
      toast({ title: 'Comment Required', description: 'Please provide a reason for rejecting the document.', type: 'warning' });
      return;
    }
    try {
      await reviewMutation.mutateAsync({ id: doc.id, action: 'reject', comment: rejectComment, expectedVersion: doc.version, session });
      toast({ title: 'Success', description: 'Document was rejected.', type: 'success' });
      setIsRejectOpen(false);
      setRejectComment('');
      refetch();
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${id}?staleVersion=${doc.version}`);
      } else {
        toast({ title: 'Rejection Failed', description: err.message, type: 'error' });
      }
    }
  };

  const handlePublish = () => {
    if (!doc || !session) return;
    handleAction(
      publishMutation.mutateAsync({ id: doc.id, expectedVersion: doc.version, session }),
      'Document published successfully.'
    );
  };

  const getSubmitRule = (doc: Document) => {
    if (!session) return 'Sign in to submit documents.';
    if (doc.authorEmail !== session.email) return 'Only the owner can submit this document.';
    if (doc.status !== 'draft' && doc.status !== 'rejected') return 'Only drafts or rejected files can be submitted.';
    return '';
  };

  const getReopenRule = (doc: Document) => {
    if (!session) return 'Sign in to reopen documents.';
    if (doc.authorEmail !== session.email) return 'Only the owner can reopen this document.';
    if (doc.status !== 'rejected') return 'Only rejected files can be reopened.';
    return '';
  };

  const getReviewRule = (doc: Document) => {
    if (!session) return 'Sign in to review documents.';
    if (session.role !== 'reviewer' && session.role !== 'admin') {
      return 'Only reviewers or administrators can approve/reject documents.';
    }
    if (doc.authorEmail === session.email) {
      return 'Authors cannot review or approve their own documents.';
    }
    if (doc.status !== 'submitted') {
      return 'This document is not currently awaiting review.';
    }
    return '';
  };

  const getPublishRule = (doc: Document) => {
    if (!session) return 'Sign in to publish documents.';
    if (session.role !== 'reviewer' && session.role !== 'admin') {
      return 'Only reviewers or admins can publish approved documents.';
    }
    if (doc.status !== 'approved') return 'Only approved documents can be published.';
    return '';
  };

  const getArchiveRule = (doc: Document) => {
    if (!session) return 'Sign in to archive documents.';
    if (session.role !== 'admin') return 'Only administrators can archive documents.';
    if (doc.status === 'archived') return 'Document is already archived.';
    return '';
  };

  if (isLoading) {
    return <SkeletonLoader variant="details" />;
  }

  if (error || !doc) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-[#E2E8F0] shadow-2xs rounded-2xl text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-[#111827]">Unable to load document</h3>
        <p className="text-xs text-[#64748B]">{error?.message || 'Access Denied.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/documents')} className="cursor-pointer">
          Return to Workspace
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header back button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 cursor-pointer text-[#64748B] hover:text-[#111827]">
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Button>
      </div>

      {/* Workflow Stepper Diagram Map */}
      <WorkflowStepper status={doc.status} />

      {/* Flagship Showcase Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Document Reading Paper */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-[#E2E8F0] shadow-2xs p-8 md:p-12 space-y-6 rounded-3xl">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={doc.status} />
                <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-slate-700 font-bold">
                  Version v{doc.version}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827] leading-tight font-sans">
                {doc.title}
              </h1>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Notion-Style Clean Typography Reading Experience */}
            <div className="text-[#111827] text-base leading-relaxed whitespace-pre-wrap font-sans min-h-[380px]">
              {doc.body}
            </div>
          </Card>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-6 sticky top-6">
          {/* Action Panel */}
          <Card className="bg-white border-[#E2E8F0] shadow-2xs rounded-2xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Workflow Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              {doc.status === 'draft' && (
                <RuleTooltip content={getSubmitRule(doc)} disabled={!!getSubmitRule(doc)}>
                  <Button 
                    className="w-full justify-center bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-2xs rounded-xl h-10 font-semibold text-xs"
                    onClick={() => handleAction(
                      submitMutation.mutateAsync({ id: doc.id, expectedVersion: doc.version, session: session! }),
                      'Document submitted for review.'
                    )}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Review
                  </Button>
                </RuleTooltip>
              )}

              {doc.status === 'rejected' && (
                <div className="space-y-3 w-full">
                  <RuleTooltip content={getReopenRule(doc)} disabled={!!getReopenRule(doc)}>
                    <Button 
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs rounded-xl h-10 font-semibold text-xs"
                      onClick={() => handleAction(
                        reopenMutation.mutateAsync({ id: doc.id, expectedVersion: doc.version, session: session! }),
                        'Document reopened for editing.'
                      )}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reopen Draft to Fix
                    </Button>
                  </RuleTooltip>
                  {session?.email === doc.authorEmail && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-center cursor-pointer rounded-xl h-10 text-xs"
                      onClick={() => navigate(`/document/${doc.id}/edit`)}
                    >
                      <X className="h-4 w-4 mr-2 text-rose-600" />
                      Edit Rejected File
                    </Button>
                  )}
                </div>
              )}

              {doc.status === 'submitted' && (session?.role === 'reviewer' || session?.role === 'admin') && (
                <div className="flex gap-2">
                  <RuleTooltip content={getReviewRule(doc)} disabled={!!getReviewRule(doc)}>
                    <Button 
                      onClick={handleApprove}
                      className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs rounded-xl h-10 text-xs font-semibold"
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Approve
                    </Button>
                  </RuleTooltip>

                  <RuleTooltip content={getReviewRule(doc)} disabled={!!getReviewRule(doc)}>
                    <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex-1 justify-center cursor-pointer shadow-2xs rounded-xl h-10 text-xs font-semibold">
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Return Document to Draft</DialogTitle>
                          <DialogDescription>
                            Specify why this document is being rejected. The author will be notified and comment logged.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-2">
                          <Textarea
                            placeholder="Reason for rejection..."
                            value={rejectComment}
                            onChange={(e) => setRejectComment(e.target.value)}
                            rows={3}
                            className="rounded-xl"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)} className="cursor-pointer rounded-lg">
                            Cancel
                          </Button>
                          <Button variant="destructive" size="sm" onClick={handleReject} className="cursor-pointer rounded-lg">
                            Reject
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </RuleTooltip>
                </div>
              )}

              {doc.status === 'approved' && (session?.role === 'reviewer' || session?.role === 'admin') && (
                <RuleTooltip content={getPublishRule(doc)} disabled={!!getPublishRule(doc)}>
                  <Button 
                    className="w-full justify-center bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-2xs rounded-xl h-10 text-xs font-semibold"
                    onClick={handlePublish}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Publish Document
                  </Button>
                </RuleTooltip>
              )}

              {doc.status !== 'archived' && session?.role === 'admin' && (
                <RuleTooltip content={getArchiveRule(doc)} disabled={!!getArchiveRule(doc)}>
                  <Button 
                    variant="outline"
                    className="w-full justify-center text-amber-800 border-amber-200 bg-amber-50 hover:bg-amber-100 cursor-pointer rounded-xl h-10 text-xs font-semibold"
                    onClick={() => handleAction(
                      archiveMutation.mutateAsync({ id: doc.id, expectedVersion: doc.version, session: session! }),
                      'Document has been archived.'
                    )}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive (Soft Delete)
                  </Button>
                </RuleTooltip>
              )}

              {doc.status === 'published' && (
                <div className="p-3 bg-[#EEFDF8] rounded-xl text-xs text-[#047857] text-center border border-[#6EE7B7] font-semibold">
                  This document is published and locked.
                </div>
              )}
              {doc.status === 'archived' && (
                <div className="p-3 bg-[#F4F4F5] rounded-xl text-xs text-[#3F3F46] text-center border border-[#E4E4E7] font-semibold">
                  This document is archived and terminal.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata Specifications Card */}
          <Card className="bg-white border-[#E2E8F0] shadow-2xs rounded-2xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-xs space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#64748B]" />
                  Author
                </span>
                <span className="text-[#111827] font-bold">{doc.authorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <FileClock className="h-3.5 w-3.5 text-[#64748B]" />
                  Version
                </span>
                <span className="font-mono font-bold text-[#111827]">v{doc.version}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                  Created
                </span>
                <span className="text-[#111827] font-medium">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                  Updated
                </span>
                <span className="text-[#111827] font-medium">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Audit History Timeline (Hidden for Viewer) */}
          {session?.role !== 'viewer' && (
            <Card className="bg-white border-[#E2E8F0] shadow-2xs rounded-2xl">
              <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-4 w-4 text-[#64748B]" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {isLoadingAudit ? (
                  <div className="space-y-3">
                    <div className="h-8 bg-slate-100 rounded animate-pulse" />
                    <div className="h-8 bg-slate-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4 relative pl-4 border-l border-slate-200">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="relative text-xs">
                        <div className="absolute -left-[21px] top-1 bg-white rounded-full border border-slate-300 p-0.5 text-slate-500 shadow-2xs">
                          <Clock className="h-2.5 w-2.5" />
                        </div>
                        
                        <div className="font-bold text-slate-800 capitalize">{log.action}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">by {log.actorName}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {new Date(log.timestamp).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {log.comment && (
                          <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 italic leading-normal">
                            "{log.comment}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default DocumentDetailsView;
