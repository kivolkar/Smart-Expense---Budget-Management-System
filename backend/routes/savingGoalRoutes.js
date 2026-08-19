import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal
} from '../controllers/savingGoalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }
    next();
};

router.route('/')
    .get(protect, getGoals)
    .post(
        protect,
        [
            body('name').notEmpty().withMessage('Goal name is required'),
            body('targetAmount').isNumeric().withMessage('Target amount must be a number'),
            body('currentAmount').optional().isNumeric().withMessage('Current amount must be a number'),
            body('targetDate').isISO8601().toDate().withMessage('Invalid target date format'),
            validateRequest
        ],
        createGoal
    );

router.route('/:id')
    .get(protect, getGoalById)
    .put(
        protect,
        [
            body('name').optional().notEmpty().withMessage('Goal name is required'),
            body('targetAmount').optional().isNumeric().withMessage('Target amount must be a number'),
            body('currentAmount').optional().isNumeric().withMessage('Current amount must be a number'),
            body('targetDate').optional().isISO8601().toDate().withMessage('Invalid target date format'),
            body('status').optional().isIn(['active', 'completed', 'abandoned']).withMessage('Invalid status'),
            validateRequest
        ],
        updateGoal
    )
    .delete(protect, deleteGoal);

export default router;
