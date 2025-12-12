import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get audit logs (admin only)
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { q, action, targetType, limit = 100, skip = 0 } = req.query;
    const query = {};

    // Search query
    if (q) {
      query.$or = [
        { action: { $regex: q, $options: 'i' } },
        { targetType: { $regex: q, $options: 'i' } },
      ];
    }

    // Action filter
    if (action && action !== 'all') {
      query.action = { $regex: action, $options: 'i' };
    }

    // Target type filter
    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }

    const logs = await AuditLog.find(query)
      .populate('actorUserId', 'name username')
      .sort({ timestamp: -1 })
      .limit(parseInt(String(limit)))
      .skip(parseInt(String(skip)));

    const total = await AuditLog.countDocuments(query);

    res.json(
      logs.map((log) => ({
        id: log._id,
        action: log.action,
        actorUserId: log.actorUserId
          ? {
              id: log.actorUserId._id,
              name: log.actorUserId.name || '',
              username: log.actorUserId.username || '',
            }
          : null,
        targetType: log.targetType,
        targetId: log.targetId,
        meta: log.meta,
        timestamp: log.timestamp,
      }))
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

