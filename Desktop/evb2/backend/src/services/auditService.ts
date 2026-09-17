import { auditRepository, AuditRepository, AuditLogWithActor } from '../repositories/auditRepository.js';
import { documentRepository, DocumentRepository } from '../repositories/documentRepository.js';
import { AuthUserPayload } from '../utils/jwt.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DocumentStatus, Role } from '@prisma/client';

export class AuditService {
  constructor(
    private auditRepo: AuditRepository = auditRepository,
    private documentRepo: DocumentRepository = documentRepository
  ) {}

  async getAuditLogsForDocument(
    documentId: string,
    currentUser: AuthUserPayload
  ): Promise<AuditLogWithActor[]> {
    const doc = await this.documentRepo.findById(documentId);

    if (!doc) {
      throw new NotFoundError(`Document with ID '${documentId}' not found.`);
    }

    // Role-based Audit Visibility Guard (PDF Page 7 & 10):
    // Viewers can ONLY see audit logs for published documents
    if (currentUser.role === Role.VIEWER && doc.status !== DocumentStatus.PUBLISHED) {
      throw new AuthorizationError('You do not have permission to view audit history for this document.');
    }

    return this.auditRepo.findByDocumentId(documentId);
  }

  async getAllAuditLogs(
    page: number,
    limit: number,
    currentUser: AuthUserPayload
  ): Promise<{
    auditLogs: AuditLogWithActor[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    let auditLogs: AuditLogWithActor[] = [];
    let total = 0;

    if (currentUser.role === Role.VIEWER) {
      // Fetch only published document IDs for Viewer isolation
      const publishedDocs = await this.documentRepo.findPublished(0, 1000);
      const publishedDocIds = publishedDocs.map((d) => d.id);

      auditLogs = await this.auditRepo.findGlobal(skip, limit, publishedDocIds);
      total = await this.auditRepo.countGlobal(publishedDocIds);
    } else {
      auditLogs = await this.auditRepo.findGlobal(skip, limit);
      total = await this.auditRepo.countGlobal();
    }

    return {
      auditLogs,
      total,
      page,
      limit,
    };
  }
}

export const auditService = new AuditService();
