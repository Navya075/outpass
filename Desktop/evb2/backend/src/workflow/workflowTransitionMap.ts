import { DocumentStatus, Role } from '@prisma/client';

export enum WorkflowAction {
  SUBMIT = 'SUBMIT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REOPEN = 'REOPEN',
  PUBLISH = 'PUBLISH',
  ARCHIVE = 'ARCHIVE',
}

export interface TransitionRule {
  fromState: DocumentStatus;
  action: WorkflowAction;
  toState: DocumentStatus;
  allowedRoles: Role[];
  requiresOwnership?: boolean;
  prohibitsSelfReview?: boolean;
  requiresComment?: boolean;
}

export const WORKFLOW_TRANSITION_MAP: Record<string, TransitionRule> = {
  // 1. Submit Draft or Rejected -> Submitted
  'DRAFT_SUBMIT': {
    fromState: DocumentStatus.DRAFT,
    action: WorkflowAction.SUBMIT,
    toState: DocumentStatus.SUBMITTED,
    allowedRoles: [Role.AUTHOR, Role.REVIEWER, Role.ADMIN],
    requiresOwnership: true,
  },
  'REJECTED_SUBMIT': {
    fromState: DocumentStatus.REJECTED,
    action: WorkflowAction.SUBMIT,
    toState: DocumentStatus.SUBMITTED,
    allowedRoles: [Role.AUTHOR, Role.REVIEWER, Role.ADMIN],
    requiresOwnership: true,
  },

  // 2. Approve Submitted -> Approved (Reviewer only, prohibits self-review)
  'SUBMITTED_APPROVE': {
    fromState: DocumentStatus.SUBMITTED,
    action: WorkflowAction.APPROVE,
    toState: DocumentStatus.APPROVED,
    allowedRoles: [Role.REVIEWER],
    prohibitsSelfReview: true,
  },

  // 3. Reject Submitted -> Rejected (Reviewer only, prohibits self-review, requires comment)
  'SUBMITTED_REJECT': {
    fromState: DocumentStatus.SUBMITTED,
    action: WorkflowAction.REJECT,
    toState: DocumentStatus.REJECTED,
    allowedRoles: [Role.REVIEWER],
    prohibitsSelfReview: true,
    requiresComment: true,
  },

  // 4. Reopen Rejected -> Draft (Author/Owner only)
  'REJECTED_REOPEN': {
    fromState: DocumentStatus.REJECTED,
    action: WorkflowAction.REOPEN,
    toState: DocumentStatus.DRAFT,
    allowedRoles: [Role.AUTHOR, Role.REVIEWER, Role.ADMIN],
    requiresOwnership: true,
  },

  // 5. Publish Approved -> Published (Reviewer / Admin)
  'APPROVED_PUBLISH': {
    fromState: DocumentStatus.APPROVED,
    action: WorkflowAction.PUBLISH,
    toState: DocumentStatus.PUBLISHED,
    allowedRoles: [Role.REVIEWER, Role.ADMIN],
  },

  // 6. Archive Active Document -> Archived (Admin Only)
  'DRAFT_ARCHIVE': {
    fromState: DocumentStatus.DRAFT,
    action: WorkflowAction.ARCHIVE,
    toState: DocumentStatus.ARCHIVED,
    allowedRoles: [Role.ADMIN],
  },
  'SUBMITTED_ARCHIVE': {
    fromState: DocumentStatus.SUBMITTED,
    action: WorkflowAction.ARCHIVE,
    toState: DocumentStatus.ARCHIVED,
    allowedRoles: [Role.ADMIN],
  },
  'APPROVED_ARCHIVE': {
    fromState: DocumentStatus.APPROVED,
    action: WorkflowAction.ARCHIVE,
    toState: DocumentStatus.ARCHIVED,
    allowedRoles: [Role.ADMIN],
  },
  'PUBLISHED_ARCHIVE': {
    fromState: DocumentStatus.PUBLISHED,
    action: WorkflowAction.ARCHIVE,
    toState: DocumentStatus.ARCHIVED,
    allowedRoles: [Role.ADMIN],
  },
};
