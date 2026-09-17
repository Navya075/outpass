import { Request, Response, NextFunction } from 'express';
import { workflowService, WorkflowService } from '../services/workflowService.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export class WorkflowController {
  constructor(private service: WorkflowService = workflowService) {}

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion } = req.body;
      const document = await this.service.submitDocument(id, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion } = req.body;
      const document = await this.service.approveDocument(id, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion, comment } = req.body;
      const document = await this.service.rejectDocument(id, expectedVersion, comment, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  reopen = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion } = req.body;
      const document = await this.service.reopenDocument(id, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion } = req.body;
      const document = await this.service.publishDocument(id, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };

  archive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) throw new AuthenticationError('Authentication required.');
      const id = req.params.id as string;
      const { expectedVersion } = req.body;
      const document = await this.service.archiveDocument(id, expectedVersion, req.currentUser);

      res.status(200).json({
        success: true,
        document,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const workflowController = new WorkflowController();
