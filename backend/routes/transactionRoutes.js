import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionController.js';
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
    .get(protect, getTransactions)
    .post(
        protect,
        [
            body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
            body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            body('category').isMongoId().withMessage('Invalid Category ID'),
            body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
            validateRequest
        ],
        createTransaction
    );

router.route('/:id')
    .get(protect, getTransactionById)
    .put(
        protect,
        [
            body('amount').optional().isNumeric().withMessage('Amount must be a number'),
            body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            body('category').optional().isMongoId().withMessage('Invalid Category ID'),
            body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
            validateRequest
        ],
        updateTransaction
    )
    .delete(protect, deleteTransaction);

export default router;
