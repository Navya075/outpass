import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createDocumentSchema,
  updateDocumentSchema,
  getDocumentByIdSchema,
  getDocumentsQuerySchema,
} from '../validators/documentValidator.js';

const router = Router();

// Require authentication for all document routes
router.use(authenticate);

// Create new Draft Document
router.post('/', validateRequest(createDocumentSchema), documentController.create);

// List Visible Documents with Pagination
router.get('/', validateRequest(getDocumentsQuerySchema), documentController.getMany);

// Get Single Document by ID
router.get('/:id', validateRequest(getDocumentByIdSchema), documentController.getById);

// Partial Content Update (PATCH title/body)
router.patch('/:id', validateRequest(updateDocumentSchema), documentController.update);

export const documentRoutes = router;
