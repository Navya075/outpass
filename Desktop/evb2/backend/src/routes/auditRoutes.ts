import { Router } from 'express';
import { auditController } from '../controllers/auditController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Require authentication for all audit routes
router.use(authenticate);

// Global Audit Log Activity Feed Endpoint
router.get('/audit-logs', auditController.getGlobalAuditLogs);

// Single Document Audit Log History Endpoint
router.get('/documents/:id/audit-logs', auditController.getDocumentAuditLogs);

export const auditRoutes = router;
