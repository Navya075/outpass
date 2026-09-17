import { documentRepository, DocumentRepository, DocumentWithUsers } from '../repositories/documentRepository.js';
import { auditRepository, AuditRepository } from '../repositories/auditRepository.js';
import { WORKFLOW_TRANSITION_MAP, WorkflowAction } from '../workflow/workflowTransitionMap.js';
import { AuthUserPayload } from '../utils/jwt.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { VersionConflictError } from '../errors/VersionConflictError.js';
import { InvalidWorkflowTransitionError } from '../errors/InvalidWorkflowTransitionError.js';
import { prisma } from '../lib/prisma.js';
import { AuditAction, Role } from '@prisma/client';

export class WorkflowService {
  constructor(
    private documentRepo: DocumentRepository = documentRepository,
    private auditRepo: AuditRepository = auditRepository
  ) {}

  /**
   * Refinement 3: Reusable Internal OCC Validation Helper Method
   */
  private validateOCC(doc: { id: string; version: number }, expectedVersion: number): void {
    if (doc.version !== expectedVersion) {
      throw new VersionConflictError(doc.id, expectedVersion, doc.version);
    }
  }

  /**
   * Centralized Workflow Transition Engine
   */
  private async transitionDocument(
    documentId: string,
    action: WorkflowAction,
    expectedVersion: number,
    currentUser: AuthUserPayload,
    payload?: { comment?: string }
  ): Promise<DocumentWithUsers> {
    const doc = await this.documentRepo.findById(documentId);

    if (!doc) {
      throw new NotFoundError(`Document with ID '${documentId}' not found.`);
    }

    const transitionKey = `${doc.status}_${action}`;
    const rule = WORKFLOW_TRANSITION_MAP[transitionKey];

    // 1. Declarative Transition Map Check
    if (!rule) {
      throw new InvalidWorkflowTransitionError(
        `Cannot ${action.toLowerCase()} document in '${doc.status}' status.`
      );
    }

    // 2. Role Check
    if (!rule.allowedRoles.includes(currentUser.role as Role)) {
      throw new AuthorizationError(
        `Role '${currentUser.role}' is not authorized to ${action.toLowerCase()} this document.`
      );
    }

    // 3. Ownership Check
    if (rule.requiresOwnership && doc.authorId !== currentUser.id) {
      throw new AuthorizationError(`Only the document author can ${action.toLowerCase()} it.`);
    }

    // 4. Self-Review Prevention Guard
    if (rule.prohibitsSelfReview && doc.authorId === currentUser.id) {
      throw new AuthorizationError('Authors cannot review or approve their own documents.');
    }

    // 5. Rejection Comment Validation
    if (rule.requiresComment && (!payload?.comment || !payload.comment.trim())) {
      throw new ValidationError('A comment is required when rejecting a document.');
    }

    // 6. Refinement 3: Reusable OCC Validation Check
    this.validateOCC(doc, expectedVersion);

    // 7. Atomic Transaction: Document Status Update + Atomic Audit Log Creation
    return prisma.$transaction(async (tx) => {
      const updatedDoc = await this.documentRepo.updateStatusWithTx(
        documentId,
        rule.toState,
        currentUser.id,
        tx
      );

      await this.auditRepo.createWithTx(
        {
          documentId,
          actorId: currentUser.id,
          action: action as unknown as AuditAction,
          previousStatus: doc.status,
          newStatus: rule.toState,
          comment: payload?.comment?.trim() || null,
          version: updatedDoc.version,
        },
        tx
      );

      return updatedDoc;
    });
  }

  // Public Service Delegation Methods (Accept expectedVersion for OCC)
  async submitDocument(documentId: string, expectedVersion: number, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.SUBMIT, expectedVersion, currentUser);
  }

  async approveDocument(documentId: string, expectedVersion: number, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.APPROVE, expectedVersion, currentUser);
  }

  async rejectDocument(documentId: string, expectedVersion: number, comment: string, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.REJECT, expectedVersion, currentUser, { comment });
  }

  async reopenDocument(documentId: string, expectedVersion: number, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.REOPEN, expectedVersion, currentUser);
  }

  async publishDocument(documentId: string, expectedVersion: number, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.PUBLISH, expectedVersion, currentUser);
  }

  async archiveDocument(documentId: string, expectedVersion: number, currentUser: AuthUserPayload): Promise<DocumentWithUsers> {
    return this.transitionDocument(documentId, WorkflowAction.ARCHIVE, expectedVersion, currentUser);
  }
}

export const workflowService = new WorkflowService();
