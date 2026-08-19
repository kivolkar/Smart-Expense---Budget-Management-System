import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    updatePassword
} from '../controllers/authController.js';

const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }
    next();
};

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest
], registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
    validateRequest
], loginUser);

router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

router.put('/password', protect, [
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validateRequest
], updatePassword);

export default router;