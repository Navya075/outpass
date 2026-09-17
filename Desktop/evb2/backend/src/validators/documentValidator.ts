import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must not exceed 255 characters'),
    body: z
      .string({ required_error: 'Body content is required' })
      .trim()
      .min(1, 'Body content cannot be empty'),
  }),
});

export const updateDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
  body: z.object({
    expectedVersion: z
      .number({ required_error: 'expectedVersion is required for concurrency control' })
      .int('expectedVersion must be an integer')
      .min(1, 'expectedVersion must be at least 1'),
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must not exceed 255 characters')
      .optional(),
    body: z
      .string()
      .trim()
      .min(1, 'Body content cannot be empty')
      .optional(),
  }),
});

export const getDocumentByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
});

export const getDocumentsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10)),
  }),
});
