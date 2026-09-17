import { Router } from 'express';
import { workflowController } from '../controllers/workflowController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  workflowParamSchema,
  rejectWorkflowSchema,
} from '../validators/workflowValidator.js';

const router = Router();

// Require authentication for all workflow routes
router.use(authenticate);

// Transition Endpoints
router.post('/:id/submit', validateRequest(workflowParamSchema), workflowController.submit);
router.post('/:id/approve', validateRequest(workflowParamSchema), workflowController.approve);
router.post('/:id/reject', validateRequest(rejectWorkflowSchema), workflowController.reject);
router.post('/:id/reopen', validateRequest(workflowParamSchema), workflowController.reopen);
router.post('/:id/publish', validateRequest(workflowParamSchema), workflowController.publish);
router.post('/:id/archive', validateRequest(workflowParamSchema), workflowController.archive);

export const workflowRoutes = router;
