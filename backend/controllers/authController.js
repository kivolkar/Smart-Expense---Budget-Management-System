import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate access tokens
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m' 
    });
};

// Helper function to generate refresh tokens
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Save refresh token to database
            user.refreshToken = refreshToken;
            await user.save();

            // Set refresh token in HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Prevents XSS
                secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
                sameSite: 'strict', // Prevents CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                accessToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get new access token from refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'Not authorized, no refresh token' });

        // Verify token
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Refresh token is expired or invalid' });

            // Check if user exists and if the token matches the one in DB
            const user = await User.findById(decoded.id);
            if (!user || user.refreshToken !== token) {
                return res.status(403).json({ message: 'Refresh token is tampered or reused maliciously' });
            }

            // Issue new access token
            const newAccessToken = generateAccessToken(user._id);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private (Needs auth to log out properly, but can be public depending on logic)
export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            // Find user holding the token and remove it
            const user = await User.findOne({ refreshToken: token });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        // Clear the cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
