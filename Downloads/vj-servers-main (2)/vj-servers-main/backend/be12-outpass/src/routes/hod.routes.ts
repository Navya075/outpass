import { Router } from 'express';
import { requireRole } from '../middlewares/role.middleware';
import { getHodAnalytics, getHodTrends, getStudentActivity, getHodOutpasses } from '../controllers/hod.controller';

const router = Router();

/**
 * GET /api/hod/analytics
 * Retrieve department-wide outpass statistics and active student list
 */
router.get('/analytics', requireRole('HOD'), getHodAnalytics);

/**
 * GET /api/hod/trends
 * Retrieve outpass trends, reasons, and peak metrics
 */
router.get('/trends', requireRole('HOD'), getHodTrends);

/**
 * GET /api/hod/student-activity
 * Retrieve student outpass activity statistics and usage flags (High Usage >= 10)
 */
router.get('/student-activity', requireRole('HOD'), getStudentActivity);

/**
 * GET /api/hod/outpasses
 * Retrieve filtered outpass records for HOD details page
 */
router.get('/outpasses', requireRole('HOD'), getHodOutpasses);

export default router;
