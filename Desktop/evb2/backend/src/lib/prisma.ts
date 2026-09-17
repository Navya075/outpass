import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

// Declare global variable to prevent multiple PrismaClient instances in development reloads
declare global {
  var globalPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.globalPrisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalThis.globalPrisma = prisma;
}
