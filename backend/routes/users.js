import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update own profile (MUST be before /:id route)
router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('avatarUrl').optional().isURL().withMessage('Invalid avatar URL'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, avatarUrl } = req.body;
      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
      }).select('-passwordHash');

      res.json({
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
        active: user.active,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Change password (MUST be before /:id route)
router.patch(
  '/me/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);
      const isValid = await user.comparePassword(currentPassword);

      if (!isValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update user (admin only) - MUST be after /me routes
router.patch(
  '/:id',
  authenticate,
  requireRole('admin'),
  logAction('update_user', 'user'),
  [
    body('role').optional().isIn(['admin', 'staff', 'student']),
    body('active').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { role, active } = req.body;
      const updateData = {};

      if (role !== undefined) updateData.role = role;
      if (active !== undefined) updateData.active = active;

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      }).select('-passwordHash');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;

