import { Request, Response, NextFunction } from 'express';
import { auditService, AuditService } from '../services/auditService.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export class AuditController {
  constructor(private service: AuditService = auditService) {}

  getDocumentAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const documentId = req.params.id as string;

      const auditLogs = await this.service.getAuditLogsForDocument(documentId, req.currentUser);

      res.status(200).json({
        success: true,
        count: auditLogs.length,
        auditLogs,
      });
    } catch (error) {
      next(error);
    }
  };

  getGlobalAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await this.service.getAllAuditLogs(page, limit, req.currentUser);

      res.status(200).json({
        success: true,
        page: result.page,
        limit: result.limit,
        total: result.total,
        auditLogs: result.auditLogs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const auditController = new AuditController();
