import { z } from 'zod';

export const occSchema = z.object({
  body: z.object({
    expectedVersion: z
      .number({ required_error: 'expectedVersion is required for concurrency control' })
      .int('expectedVersion must be an integer')
      .min(1, 'expectedVersion must be at least 1'),
  }),
});
