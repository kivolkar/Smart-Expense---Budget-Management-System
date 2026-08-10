import express from 'express';
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser); // Alternatively, you can use `protect` middleware here: router.post('/logout', protect, logoutUser)

export default router;
