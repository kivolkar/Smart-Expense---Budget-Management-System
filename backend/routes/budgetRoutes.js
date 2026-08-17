import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
} from '../controllers/budgetController.js';
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
    .get(protect, getBudgets)
    .post(
        protect,
        [
            body('category').isMongoId().withMessage('Invalid Category ID format'),
            body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount limit is required'),
            body('startDate').isISO8601().toDate().withMessage('Invalid start date format'),
            body('endDate').isISO8601().toDate().withMessage('Invalid end date format'),
            validateRequest
        ],
        createBudget
    );

router.route('/:id')
    .get(protect, getBudgetById)
    .put(
        protect,
        [
            body('category').optional().isMongoId().withMessage('Invalid Category ID format'),
            body('amount').optional().isNumeric().withMessage('Amount must be a number'),
            body('startDate').optional().isISO8601().toDate().withMessage('Invalid start date format'),
            body('endDate').optional().isISO8601().toDate().withMessage('Invalid end date format'),
            validateRequest
        ],
        updateBudget
    )
    .delete(protect, deleteBudget);

export default router;
