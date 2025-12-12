import express from 'express';
import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Upcoming bookings (this week)
    const upcomingBookings = await Booking.countDocuments({
      userId: req.user._id,
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $gte: now, $lte: weekFromNow },
    });

    // Available rooms (no active bookings now)
    const resourcesWithBookings = await Booking.distinct('resourceId', {
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    const totalResources = await Resource.countDocuments();
    const availableRooms = totalResources - resourcesWithBookings.length;

    // Pending approvals (admin only)
    let pendingApprovals = 0;
    if (req.user.role === 'admin') {
      pendingApprovals = await Booking.countDocuments({
        status: 'pending',
      });
    }

    // Total bookings
    const totalBookings = await Booking.countDocuments({
      userId: req.user._id,
    });

    res.json({
      upcomingBookings,
      availableRooms,
      pendingApprovals,
      totalBookings,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

