import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema } from '../validators/authValidator.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Public Seeded User Login Endpoint
router.post('/login', validateRequest(loginSchema), authController.login);

// Authenticated Stateless Logout Endpoint
router.post('/logout', authenticate, authController.logout);

// Authenticated User Identity Endpoint (queries DB for fresh user state)
router.get('/me', authenticate, authController.me);

export const authRoutes = router;
