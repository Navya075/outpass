import { prisma } from '../lib/prisma.js';
import { Document, DocumentStatus, Prisma } from '@prisma/client';

export type DocumentWithUsers = Document & {
  author: { id: string; name: string; email: string };
  lastUpdatedBy: { id: string; name: string; email: string };
};

const defaultUserSelect = {
  select: { id: true, name: true, email: true },
};

export class DocumentRepository {
  async create(
    data: {
      title: string;
      body: string;
      authorId: string;
      lastUpdatedById: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<DocumentWithUsers> {
    const client = tx || prisma;
    return client.document.create({
      data: {
        title: data.title,
        body: data.body,
        status: DocumentStatus.DRAFT,
        version: 1,
        authorId: data.authorId,
        lastUpdatedById: data.lastUpdatedById,
      },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers>;
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<DocumentWithUsers | null> {
    const client = tx || prisma;
    return client.document.findUnique({
      where: { id },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers | null>;
  }

  async findPublished(skip: number, take: number): Promise<DocumentWithUsers[]> {
    return prisma.document.findMany({
      where: { status: DocumentStatus.PUBLISHED },
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers[]>;
  }

  async countPublished(): Promise<number> {
    return prisma.document.count({
      where: { status: DocumentStatus.PUBLISHED },
    });
  }

  async findByAuthor(authorId: string, skip: number, take: number): Promise<DocumentWithUsers[]> {
    return prisma.document.findMany({
      where: {
        OR: [{ authorId }, { status: DocumentStatus.PUBLISHED }],
      },
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers[]>;
  }

  async countByAuthor(authorId: string): Promise<number> {
    return prisma.document.count({
      where: {
        OR: [{ authorId }, { status: DocumentStatus.PUBLISHED }],
      },
    });
  }

  async findNonDraft(authorId: string, skip: number, take: number): Promise<DocumentWithUsers[]> {
    return prisma.document.findMany({
      where: {
        OR: [
          { authorId },
          { status: { not: DocumentStatus.DRAFT } },
        ],
      },
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers[]>;
  }

  async countNonDraft(authorId: string): Promise<number> {
    return prisma.document.count({
      where: {
        OR: [
          { authorId },
          { status: { not: DocumentStatus.DRAFT } },
        ],
      },
    });
  }

  async findAll(skip: number, take: number): Promise<DocumentWithUsers[]> {
    return prisma.document.findMany({
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers[]>;
  }

  async countAll(): Promise<number> {
    return prisma.document.count();
  }

  async update(
    id: string,
    data: {
      title?: string;
      body?: string;
      lastUpdatedById: string;
    },
    tx?: Prisma.TransactionClient
  ): Promise<DocumentWithUsers> {
    const client = tx || prisma;
    return client.document.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.body ? { body: data.body } : {}),
        lastUpdatedById: data.lastUpdatedById,
        version: { increment: 1 }, // Refinement 2: Prisma Atomic Increment
      },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers>;
  }

  async updateStatusWithTx(
    id: string,
    newStatus: DocumentStatus,
    lastUpdatedById: string,
    tx: Prisma.TransactionClient
  ): Promise<DocumentWithUsers> {
    return tx.document.update({
      where: { id },
      data: {
        status: newStatus,
        lastUpdatedById,
        version: { increment: 1 }, // Refinement 2: Prisma Atomic Increment
      },
      include: {
        author: defaultUserSelect,
        lastUpdatedBy: defaultUserSelect,
      },
    }) as Promise<DocumentWithUsers>;
  }
}

export const documentRepository = new DocumentRepository();
