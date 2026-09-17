import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import type { UserSession } from '@/features/auth/useAuth';

export type DocumentStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'published' | 'archived';

export interface Document {
  id: string;
  title: string;
  body: string;
  status: DocumentStatus;
  version: number;
  authorId: string;
  authorName: string;
  authorEmail: string;
  lastUpdatedById: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface AuditLog {
  id: string;
  documentId: string;
  actorId: string;
  actorName: string;
  action: 'create' | 'edit' | 'submit' | 'approve' | 'reject' | 'reopen' | 'publish' | 'archive';
  previousStatus: DocumentStatus | null;
  newStatus: DocumentStatus | null;
  comment: string | null;
  version: number;
  timestamp: string;
}

const mapBackendDocument = (doc: any): Document => ({
  id: doc.id,
  title: doc.title,
  body: doc.body,
  status: doc.status.toLowerCase() as DocumentStatus,
  version: doc.version,
  authorId: doc.authorId,
  authorName: doc.author?.name || 'Unknown Author',
  authorEmail: doc.author?.email || '',
  lastUpdatedById: doc.lastUpdatedById,
  lastUpdatedBy: doc.lastUpdatedBy?.name || doc.lastUpdatedById || 'System',
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const mapBackendAuditLog = (log: any): AuditLog => ({
  id: log.id,
  documentId: log.documentId,
  actorId: log.actorId,
  actorName: log.actor?.name || 'System User',
  action: log.action.toLowerCase() as AuditLog['action'],
  previousStatus: log.previousStatus ? (log.previousStatus.toLowerCase() as DocumentStatus) : null,
  newStatus: log.newStatus ? (log.newStatus.toLowerCase() as DocumentStatus) : null,
  comment: log.comment || null,
  version: log.version,
  timestamp: log.timestamp,
});

export function useDocumentsList(session: UserSession | null) {
  return useQuery<Document[]>({
    queryKey: ['documents', session?.email],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; documents: any[] }>('/documents?page=1&limit=100');
      return (response.documents || []).map(mapBackendDocument);
    },
    enabled: !!session,
  });
}

export function useDocumentDetails(id: string | undefined, session: UserSession | null) {
  return useQuery<Document, Error>({
    queryKey: ['documents', 'detail', id, session?.email],
    queryFn: async () => {
      if (!id) throw new Error('Document ID is required');
      const response = await apiClient.get<{ success: boolean; document: any }>(`/documents/${id}`);
      return mapBackendDocument(response.document);
    },
    enabled: !!id && !!session,
    retry: false,
  });
}

export function useAuditLogs(documentId?: string, session?: UserSession | null) {
  return useQuery<AuditLog[]>({
    queryKey: ['auditLogs', documentId, session?.email],
    queryFn: async () => {
      if (documentId) {
        const response = await apiClient.get<{ success: boolean; auditLogs: any[] }>(`/documents/${documentId}/audit-logs`);
        return (response.auditLogs || []).map(mapBackendAuditLog);
      }
      const response = await apiClient.get<{ success: boolean; auditLogs: any[] }>('/audit-logs?page=1&limit=100');
      return (response.auditLogs || []).map(mapBackendAuditLog);
    },
    enabled: !!session,
  });
}

// Mutations
export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, { title: string; body: string; session: UserSession }>({
    mutationFn: async ({ title, body }) => {
      const response = await apiClient.post<{ success: boolean; document: any }>('/documents', { title, body });
      return mapBackendDocument(response.document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation<
    Document,
    Error,
    { id: string; title: string; body: string; expectedVersion: number; session: UserSession }
  >({
    mutationFn: async ({ id, title, body, expectedVersion }) => {
      const response = await apiClient.patch<{ success: boolean; document: any }>(`/documents/${id}`, {
        expectedVersion,
        title,
        body,
      });
      return mapBackendDocument(response.document);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}

export function useSubmitDocument() {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, { id: string; expectedVersion: number; session: UserSession }>({
    mutationFn: async ({ id, expectedVersion }) => {
      const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/submit`, {
        expectedVersion,
      });
      return mapBackendDocument(response.document);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}

export function useReopenDocument() {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, { id: string; expectedVersion: number; session: UserSession }>({
    mutationFn: async ({ id, expectedVersion }) => {
      const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/reopen`, {
        expectedVersion,
      });
      return mapBackendDocument(response.document);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}

export function useReviewDocument() {
  const queryClient = useQueryClient();
  return useMutation<
    Document,
    Error,
    { id: string; action: 'approve' | 'reject'; comment?: string; expectedVersion: number; session: UserSession }
  >({
    mutationFn: async ({ id, action, comment, expectedVersion }) => {
      if (action === 'approve') {
        const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/approve`, {
          expectedVersion,
        });
        return mapBackendDocument(response.document);
      } else {
        const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/reject`, {
          expectedVersion,
          comment,
        });
        return mapBackendDocument(response.document);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}

export function usePublishDocument() {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, { id: string; expectedVersion: number; session: UserSession }>({
    mutationFn: async ({ id, expectedVersion }) => {
      const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/publish`, {
        expectedVersion,
      });
      return mapBackendDocument(response.document);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}

export function useArchiveDocument() {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, { id: string; expectedVersion: number; session: UserSession }>({
    mutationFn: async ({ id, expectedVersion }) => {
      const response = await apiClient.post<{ success: boolean; document: any }>(`/documents/${id}/archive`, {
        expectedVersion,
      });
      return mapBackendDocument(response.document);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', variables.id] });
    },
  });
}
