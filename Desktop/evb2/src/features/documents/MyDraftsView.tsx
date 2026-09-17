import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList, useSubmitDocument } from '@/hooks/useDocuments';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { RuleTooltip } from '@/components/shared/RuleTooltip';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { FileEdit, PlusCircle, Eye, Edit, Send, Clock, AlertCircle } from 'lucide-react';
import type { Document } from '@/services/mockDb';

export const MyDraftsView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useDocumentsList(session);
  const submitMutation = useSubmitDocument();

  // Filter personal drafts
  const activeDrafts = useMemo(() => {
    if (!session) return [];
    return documents.filter((d) => d.authorEmail === session.email && d.status === 'draft');
  }, [documents, session]);

  const rejectedDrafts = useMemo(() => {
    if (!session) return [];
    return documents.filter((d) => d.authorEmail === session.email && d.status === 'rejected');
  }, [documents, session]);

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

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-8 bg-[#F5F7FB]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2.5">
            <FileEdit className="h-6 w-6 text-zinc-900" />
            My Personal Drafting Workspace
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">Manage your private specifications, resume editing, or resubmit rejected files.</p>
        </div>
        <Button onClick={() => navigate('/document/new')} className="h-10 px-4 rounded-xl gap-2 cursor-pointer shadow-2xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs">
          <PlusCircle className="h-4 w-4" />
          Create New Draft
        </Button>
      </div>

      {!isLoading && (
        <div className="space-y-10">
          {/* Section 1: Rejected Drafts (Action Required) */}
          {rejectedDrafts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-600" />
                <h2 className="text-base font-bold text-[#111827]">Action Required: Rejected Submissions ({rejectedDrafts.length})</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rejectedDrafts.map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -3 }}
                    className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <StatusBadge status="rejected" />
                        <span className="font-mono text-xs bg-white border border-rose-200 px-2 py-0.5 rounded font-bold text-rose-700">
                          v{doc.version}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111827] line-clamp-1">{doc.title}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed font-sans min-h-[50px]">{doc.body}</p>

                      {/* Reviewer Comment Box */}
                      {doc.rejectionComment && (
                        <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Reviewer Feedback:</span>
                          <p className="text-slate-700 italic">"{doc.rejectionComment}"</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-rose-200/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#64748B]">Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/document/${doc.id}/edit`)}
                          className="h-8 text-xs font-semibold rounded-lg border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit & Fix
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Active Drafts (Continue Editing) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-zinc-900" />
              <h2 className="text-base font-bold text-[#111827]">Continue Editing ({activeDrafts.length})</h2>
            </div>

            {activeDrafts.length === 0 ? (
              <EmptyState
                title="No active drafts"
                description="You have no work-in-progress drafts. Start writing a new specification now."
                action={
                  <Button onClick={() => navigate('/document/new')} size="sm" className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white">
                    Create New Draft
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeDrafts.map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -3 }}
                    className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <StatusBadge status="draft" />
                        <span className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">
                          v{doc.version}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111827] line-clamp-1">{doc.title}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed font-sans min-h-[50px]">{doc.body}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#64748B]">Edited: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/document/${doc.id}/edit`)}
                          className="h-8 text-xs font-semibold rounded-lg border-slate-200 text-slate-700 hover:bg-zinc-50 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1 text-zinc-900" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitForReview(doc)}
                          className="h-8 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default MyDraftsView;
