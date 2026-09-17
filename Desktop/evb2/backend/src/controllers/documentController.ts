import { Request, Response, NextFunction } from 'express';
import { documentService, DocumentService } from '../services/documentService.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export class DocumentController {
  constructor(private service: DocumentService = documentService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) {
        throw new AuthenticationError('Authentication required.');
      }
      const { title, body } = req.body;
      const document = await this.service.createDocument(title, body, req.currentUser);

      res.status(201).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) {
        throw new AuthenticationError('Authentication required.');
      }
      const id = req.params.id as string;
      const document = await this.service.getDocumentById(id, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  getMany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) {
        throw new AuthenticationError('Authentication required.');
      }
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await this.service.getDocuments(page, limit, req.currentUser);

      res.status(200).json({
        success: true,
        page: result.page,
        limit: result.limit,
        total: result.total,
        documents: result.documents,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) {
        throw new AuthenticationError('Authentication required.');
      }
      const id = req.params.id as string;
      const { title, body, expectedVersion } = req.body;

      const document = await this.service.updateDocument(id, title, body, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const documentController = new DocumentController();
