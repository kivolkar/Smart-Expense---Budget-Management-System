import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
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
    .get(protect, getCategories)
    .post(
        protect,
        [
            body('name').notEmpty().withMessage('Category name is required'),
            body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            validateRequest
        ],
        createCategory
    );

router.route('/:id')
    .get(protect, getCategoryById)
    .put(
        protect,
        [
            body('name').optional().notEmpty().withMessage('Category name cannot be empty'),
            body('type').optional().isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
            validateRequest
        ],
        updateCategory
    )
    .delete(protect, deleteCategory);

export default router;
