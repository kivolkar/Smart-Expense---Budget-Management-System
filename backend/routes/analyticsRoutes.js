import express from 'express';
import { getCategoryComparison, getYearlyTrend } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/categories').get(protect, getCategoryComparison);
router.route('/yearly').get(protect, getYearlyTrend);

export default router;
