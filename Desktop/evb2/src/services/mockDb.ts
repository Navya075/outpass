export type Role = 'viewer' | 'author' | 'reviewer' | 'admin';

export type DocumentStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'published' | 'archived';

export interface UserSession {
  id?: string;
  email: string;
  name: string;
  role: Role;
}

export interface Document {
  id: string;
  title: string;
  body: string;
  status: DocumentStatus;
  version: number;
  authorId?: string;
  authorEmail: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy: string;
  lastUpdatedById?: string;
  [key: string]: any;
}

export interface AuditLog {
  id: string;
  documentId: string;
  actorId?: string;
  actorName: string;
  action: 'create' | 'edit' | 'submit' | 'approve' | 'reject' | 'reopen' | 'publish' | 'archive';
  previousStatus: DocumentStatus | null;
  newStatus: DocumentStatus | null;
  comment: string | null;
  version: number;
  timestamp: string;
}

export const SEEDED_USERS: Record<string, UserSession> = {
  'alice@example.com': { email: 'alice@example.com', name: 'Alice Thorne', role: 'author' },
  'bob@example.com': { email: 'bob@example.com', name: 'Bob Jenkins', role: 'reviewer' },
  'admin@example.com': { email: 'admin@example.com', name: 'Charlie Admin', role: 'admin' },
  'viewer@example.com': { email: 'viewer@example.com', name: 'Diana Reader', role: 'viewer' },
};
