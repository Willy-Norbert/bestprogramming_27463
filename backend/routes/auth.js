import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters')
      .matches(/^[a-z0-9_]+$/)
      .withMessage('Username can only contain lowercase letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
    body('role').isIn(['admin', 'staff', 'student']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, username, password, role } = req.body;

      // Check if username exists
      const existingUser = await User.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // Create user
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        username: username.toLowerCase(),
        passwordHash,
        role: role || 'student',
      });

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      // Set HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE || 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: 'User created successfully',
        token, // Include token in response for localStorage fallback
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
          active: user.active,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      console.log('🔐 [AUTH] Login attempt received');
      console.log('📥 [AUTH] Request body:', { username: req.body.username, password: '***' });
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ [AUTH] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, rememberMe } = req.body;

      // Check JWT_SECRET
      if (!process.env.JWT_SECRET) {
        console.error('❌ [AUTH] JWT_SECRET is not set in environment variables!');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Find user
      console.log('🔍 [AUTH] Looking for user with username:', username.toLowerCase());
      const user = await User.findOne({ username: username.toLowerCase() });
      
      if (!user) {
        console.log('❌ [AUTH] User not found:', username.toLowerCase());
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      if (!user.active) {
        console.log('❌ [AUTH] User is inactive:', user._id);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ [AUTH] User found:', { id: user._id, username: user.username, role: user.role });

      // Check password
      console.log('🔑 [AUTH] Verifying password...');
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        console.log('❌ [AUTH] Invalid password for user:', user.username);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ [AUTH] Password verified successfully');

      // Generate token
      const expiresIn = rememberMe ? '30d' : process.env.JWT_EXPIRES_IN || '7d';
      console.log('🎫 [AUTH] Generating JWT token with expiresIn:', expiresIn);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn,
      });
      console.log('✅ [AUTH] JWT token generated successfully');

      // Set HttpOnly cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE || 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
      };
      console.log('🍪 [AUTH] Setting cookie with options:', { ...cookieOptions, secure: cookieOptions.secure });
      res.cookie('token', token, cookieOptions);

      const responseData = {
        message: 'Login successful',
        token, // Include token in response for localStorage fallback
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          avatarUrl: user.avatarUrl,
          active: user.active,
        },
      };
      
      console.log('✅ [AUTH] Login successful for user:', user.username);
      console.log('📤 [AUTH] Sending response with user data');
      
      res.json(responseData);
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error);
      console.error('❌ [AUTH] Error stack:', error.stack);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Logout
router.post('/logout', authenticate, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  console.log('👤 [AUTH] /me endpoint called');
  console.log('✅ [AUTH] User authenticated:', { id: req.user._id, username: req.user.username, role: req.user.role });
  res.json({
    id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    role: req.user.role,
    avatarUrl: req.user.avatarUrl,
    active: req.user.active,
  });
});

export default router;

