import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${env.PORT}`);
  console.log(`📍 Health Check: http://localhost:${env.PORT}/health`);
  console.log(`🔧 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('🛑 Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
