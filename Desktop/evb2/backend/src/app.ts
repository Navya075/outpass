import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { documentRoutes } from './routes/documentRoutes.js';
import { workflowRoutes } from './routes/workflowRoutes.js';
import { auditRoutes } from './routes/auditRoutes.js';

const app: Express = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) setup for frontend communication
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID assignment middleware
app.use(requestIdMiddleware);

// HTTP request logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
  });
});

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/documents', workflowRoutes);
app.use('/api', auditRoutes);

// Global Error Handler Middleware (Must be registered after routes)
app.use(errorHandler);

export default app;
