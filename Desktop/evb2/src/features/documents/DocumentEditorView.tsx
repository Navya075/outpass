import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentDetails, useCreateDocument, useUpdateDocument } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast-provider';
import { ArrowLeft, Save, Eye, ShieldAlert } from 'lucide-react';

const docSchema = zod.object({
  title: zod.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  body: zod.string().min(1, 'Document content body is required'),
});

type DocFormData = zod.infer<typeof docSchema>;

export const DocumentEditorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const isEdit = !!id;

  const { data: doc, isLoading, error } = useDocumentDetails(id, session);

  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocFormData>({
    resolver: zodResolver(docSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  React.useEffect(() => {
    if (doc) {
      setValue('title', doc.title);
      setValue('body', doc.body);
    }
  }, [doc, setValue]);

  const onSubmit = async (data: DocFormData) => {
    if (!session) {
      toast({ title: 'Authentication Required', description: 'Please sign in first.', type: 'error' });
      return;
    }

    try {
      if (isEdit && doc) {
        await updateMutation.mutateAsync({
          id: doc.id,
          title: data.title,
          body: data.body,
          expectedVersion: doc.version,
          session,
        });
        toast({ title: 'Draft Saved', description: 'Document updated successfully.', type: 'success' });
        navigate(`/document/${doc.id}`);
      } else {
        const newDoc = await createMutation.mutateAsync({
          title: data.title,
          body: data.body,
          session,
        });
        toast({ title: 'Draft Created', description: 'New document saved as draft.', type: 'success' });
        navigate(`/document/${newDoc.id}`);
      }
    } catch (err: any) {
      if (err.name === 'VersionConflictError') {
        navigate(`/conflict/${doc?.id}?staleVersion=${doc?.version}`);
      } else {
        toast({
          title: 'Operation Failed',
          description: err.message || 'Something went wrong.',
          type: 'error',
        });
      }
    }
  };

  const isEditable = React.useMemo(() => {
    if (!isEdit) return true;
    if (!doc || !session) return false;
    return doc.authorEmail === session.email && (doc.status === 'draft' || doc.status === 'rejected');
  }, [isEdit, doc, session]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        <div className="h-6 bg-slate-200 w-1/4 rounded animate-pulse" />
        <div className="h-40 bg-slate-200 w-full rounded animate-pulse" />
      </div>
    );
  }

  if (isEdit && (error || !doc)) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-slate-200 shadow-sm rounded-xl text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-rose-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Unable to edit document</h3>
        <p className="text-xs text-slate-500">{error?.message || 'Access Denied.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="cursor-pointer">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isEdit && !isEditable) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-slate-200 shadow-sm rounded-xl text-center space-y-4">
        <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 font-sans">Read-Only Document</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          You are not permitted to edit this document. Only the owner can edit and only when the document is in Draft or Rejected state.
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/document/${doc!.id}`)} className="cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            View Document
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="cursor-pointer">
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(isEdit ? `/document/${doc!.id}` : '/dashboard')} className="gap-1.5 cursor-pointer text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          Cancel and Return
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-2xs">
        <CardHeader className="border-b border-slate-200 p-6">
          <CardTitle className="text-lg font-bold text-slate-900">
            {isEdit ? 'Modify Draft Document' : 'Compose Document Workflow'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-semibold">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title (e.g. API Gateway Specifications)"
                className="bg-white border-slate-200 text-sm text-slate-900"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-slate-700 font-semibold">Content Body</Label>
              <Textarea
                id="body"
                placeholder="Describe your document procedures, rules, or guides..."
                rows={12}
                className="bg-white border-slate-200 text-sm leading-relaxed text-slate-900"
                {...register('body')}
              />
              {errors.body && (
                <p className="text-xs text-rose-600 font-medium">{errors.body.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer text-xs font-semibold shadow-xs"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default DocumentEditorView;
