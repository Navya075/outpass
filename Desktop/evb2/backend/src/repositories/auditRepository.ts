import { prisma } from '../lib/prisma.js';
import { AuditLog, AuditAction, DocumentStatus, Prisma } from '@prisma/client';

export type AuditLogWithActor = AuditLog & {
  actor: { id: string; name: string; email: string };
};

const defaultActorSelect = {
  select: { id: true, name: true, email: true },
};

export class AuditRepository {
  async createWithTx(
    data: {
      documentId: string;
      actorId: string;
      action: AuditAction;
      previousStatus?: DocumentStatus | null;
      newStatus?: DocumentStatus | null;
      comment?: string | null;
      version: number;
    },
    tx: Prisma.TransactionClient
  ): Promise<AuditLogWithActor> {
    return tx.auditLog.create({
      data: {
        documentId: data.documentId,
        actorId: data.actorId,
        action: data.action,
        previousStatus: data.previousStatus,
        newStatus: data.newStatus,
        comment: data.comment,
        version: data.version,
      },
      include: {
        actor: defaultActorSelect,
      },
    }) as Promise<AuditLogWithActor>;
  }

  async findByDocumentId(documentId: string): Promise<AuditLogWithActor[]> {
    return prisma.auditLog.findMany({
      where: { documentId },
      orderBy: { timestamp: 'desc' },
      include: {
        actor: defaultActorSelect,
      },
    }) as Promise<AuditLogWithActor[]>;
  }

  async findGlobal(skip: number, take: number, publishedOnlyDocIds?: string[]): Promise<AuditLogWithActor[]> {
    const whereClause = publishedOnlyDocIds
      ? { documentId: { in: publishedOnlyDocIds } }
      : {};

    return prisma.auditLog.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { timestamp: 'desc' },
      include: {
        actor: defaultActorSelect,
      },
    }) as Promise<AuditLogWithActor[]>;
  }

  async countGlobal(publishedOnlyDocIds?: string[]): Promise<number> {
    const whereClause = publishedOnlyDocIds
      ? { documentId: { in: publishedOnlyDocIds } }
      : {};

    return prisma.auditLog.count({
      where: whereClause,
    });
  }
}

export const auditRepository = new AuditRepository();
