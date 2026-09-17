import { documentRepository, DocumentRepository, DocumentWithUsers } from '../repositories/documentRepository.js';
import { auditRepository, AuditRepository } from '../repositories/auditRepository.js';
import { AuthUserPayload } from '../utils/jwt.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { VersionConflictError } from '../errors/VersionConflictError.js';
import { prisma } from '../lib/prisma.js';
import { AuditAction, DocumentStatus, Role } from '@prisma/client';

export class DocumentService {
  constructor(
    private documentRepo: DocumentRepository = documentRepository,
    private auditRepo: AuditRepository = auditRepository
  ) {}

  /**
   * Refinement 3: Reusable Internal OCC Validation Helper Method
   * Throws VersionConflictError (HTTP 409) if client's expectedVersion != server doc.version
   */
  private validateOCC(doc: { id: string; version: number }, expectedVersion: number): void {
    if (doc.version !== expectedVersion) {
      throw new VersionConflictError(doc.id, expectedVersion, doc.version);
    }
  }

  private canUserViewDocument(doc: DocumentWithUsers, user: AuthUserPayload): boolean {
    switch (user.role) {
      case Role.VIEWER:
        return doc.status === DocumentStatus.PUBLISHED;
      case Role.AUTHOR:
        return doc.status === DocumentStatus.PUBLISHED || doc.authorId === user.id;
      case Role.REVIEWER:
        return doc.status !== DocumentStatus.DRAFT || doc.authorId === user.id;
      case Role.ADMIN:
        return true;
      default:
        return false;
    }
  }

  private canUserModifyDocument(doc: DocumentWithUsers, user: AuthUserPayload): boolean {
    if (doc.authorId !== user.id) {
      return false;
    }
    return doc.status === DocumentStatus.DRAFT || doc.status === DocumentStatus.REJECTED;
  }

  async createDocument(title: string, body: string, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    if (currentUser.role === Role.VIEWER) {
      throw new AuthorizationError('Viewers are not authorized to create documents.');
    }

    // Atomic Transaction: Document Creation + Initial CREATE Audit Log
    return prisma.$transaction(async (tx) => {
      const createdDoc = await this.documentRepo.create(
        {
          title,
          body,
          authorId: currentUser.id,
          lastUpdatedById: currentUser.id,
        },
        tx
      );

      await this.auditRepo.createWithTx(
        {
          documentId: createdDoc.id,
          actorId: currentUser.id,
          action: AuditAction.CREATE,
          newStatus: DocumentStatus.DRAFT,
          version: 1,
        },
        tx
      );

      return createdDoc;
    });
  }

  async getDocumentById(id: string, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    const doc = await this.documentRepo.findById(id);

    if (!doc) {
      throw new NotFoundError(`Document with ID '${id}' not found.`);
    }

    if (!this.canUserViewDocument(doc, currentUser)) {
      throw new AuthorizationError('You do not have permission to view this document.');
    }

    return doc;
  }

  async getDocuments(page: number, limit: number, currentUser: AuthUserPayload): Promise<{
    documents: DocumentWithUsers[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    let documents: DocumentWithUsers[] = [];
    let total = 0;

    switch (currentUser.role) {
      case Role.VIEWER:
        documents = await this.documentRepo.findPublished(skip, limit);
        total = await this.documentRepo.countPublished();
        break;
      case Role.AUTHOR:
        documents = await this.documentRepo.findByAuthor(currentUser.id, skip, limit);
        total = await this.documentRepo.countByAuthor(currentUser.id);
        break;
      case Role.REVIEWER:
        documents = await this.documentRepo.findNonDraft(currentUser.id, skip, limit);
        total = await this.documentRepo.countNonDraft(currentUser.id);
        break;
      case Role.ADMIN:
        documents = await this.documentRepo.findAll(skip, limit);
        total = await this.documentRepo.countAll();
        break;
    }

    return {
      documents,
      total,
      page,
      limit,
    };
  }

  async updateDocument(
    id: string,
    title: string | undefined,
    body: string | undefined,
    expectedVersion: number,
    currentUser: AuthUserPayload
  ): Promise<DocumentWithUsers> {
    const doc = await this.documentRepo.findById(id);

    if (!doc) {
      throw new NotFoundError(`Document with ID '${id}' not found.`);
    }

    if (!this.canUserModifyDocument(doc, currentUser)) {
      if (doc.authorId !== currentUser.id) {
        throw new AuthorizationError('You can only edit your own documents.');
      }
      throw new AuthorizationError(
        `Documents in '${doc.status}' status are read-only and cannot be edited.`
      );
    }

    // Refinement 3: Reusable OCC Validation Check
    this.validateOCC(doc, expectedVersion);

    // Atomic Transaction: Document Content Update + EDIT Audit Log
    return prisma.$transaction(async (tx) => {
      const updatedDoc = await this.documentRepo.update(
        id,
        {
          title,
          body,
          lastUpdatedById: currentUser.id,
        },
        tx
      );

      await this.auditRepo.createWithTx(
        {
          documentId: id,
          actorId: currentUser.id,
          action: AuditAction.EDIT,
          version: updatedDoc.version,
        },
        tx
      );

      return updatedDoc;
    });
  }
}

export const documentService = new DocumentService();
