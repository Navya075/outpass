import { z } from 'zod';

export const workflowParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
  body: z.object({
    expectedVersion: z
      .number({ required_error: 'expectedVersion is required for concurrency control' })
      .int('expectedVersion must be an integer')
      .min(1, 'expectedVersion must be at least 1'),
  }),
});

export const rejectWorkflowSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
  body: z.object({
    expectedVersion: z
      .number({ required_error: 'expectedVersion is required for concurrency control' })
      .int('expectedVersion must be an integer')
      .min(1, 'expectedVersion must be at least 1'),
    comment: z
      .string({ required_error: 'Rejection comment is required' })
      .trim()
      .min(1, 'Rejection comment cannot be empty'),
  }),
});
