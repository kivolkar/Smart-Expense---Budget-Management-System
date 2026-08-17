import express from 'express';
import { body, query, validationResult } from 'express-validator';
import upload from '../middleware/uploadMiddleware.js';
import {
    getTransactionSummary,
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

const paymentMethods = ['cash', 'credit_card', 'debit_card', 'upi', 'bank_transfer'];

// This route must sit ABOVE /:id so Express doesn't mistake 'summary' for a transaction ID!
router.route('/summary').get(protect, getTransactionSummary);

router.route('/')
    .get(
        protect,
        [
            query('startDate').optional().isISO8601().toDate().withMessage('Invalid startDate format'),
            query('endDate').optional().isISO8601().toDate().withMessage('Invalid endDate format'),
            query('type').optional().isIn(['income', 'expense']).withMessage('Invalid flow type filter'),
            query('paymentMethod').optional().isIn(paymentMethods).withMessage('Invalid paymentMethod filter'),
            query('category').optional().isMongoId().withMessage('Invalid category ID filter'),
            validateRequest
        ],
        getTransactions
    )
    .post(
        protect,
        upload.single('receipt'), // Multer intercepts binary file before validator reads JSON
        [
            body('amount').isNumeric().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
            body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            body('category').isMongoId().withMessage('Invalid Category ID'),
            body('paymentMethod').isIn(paymentMethods).withMessage('Invalid payment method'),
            body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
            validateRequest
        ],
        createTransaction
    );

router.route('/:id')
    .get(protect, getTransactionById)
    .put(
        protect,
        upload.single('receipt'),
        [
            body('amount').optional().isNumeric().withMessage('Amount must be a number'),
            body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            body('category').optional().isMongoId().withMessage('Invalid Category ID'),
            body('paymentMethod').optional().isIn(paymentMethods).withMessage('Invalid payment method'),
            body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
            validateRequest
        ],
        updateTransaction
    )
    .delete(protect, deleteTransaction);

export default router;
