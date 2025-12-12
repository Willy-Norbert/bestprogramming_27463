import express from 'express';
import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, all } = req.query;
    const query = {};

    // If admin and all=true, get all bookings, otherwise get user's bookings
    if (all === 'true' && req.user.role === 'admin') {
      // Admin can see all bookings
    } else {
      query.userId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('resourceId', 'name location capacity amenities images tags')
      .populate('userId', 'name username')
      .sort({ createdAt: -1 });

    res.json(
      bookings.map((booking) => ({
        id: booking._id,
        resourceId: booking.resourceId._id,
        resource: {
          id: booking.resourceId._id,
          name: booking.resourceId.name,
          location: booking.resourceId.location,
          capacity: booking.resourceId.capacity,
          amenities: booking.resourceId.amenities,
          images: booking.resourceId.images,
          tags: booking.resourceId.tags,
        },
        user: req.user.role === 'admin'
          ? {
              id: booking.userId._id,
              name: booking.userId.name,
              username: booking.userId.username,
            }
          : undefined,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        attendeesCount: booking.attendeesCount,
        notes: booking.notes,
        createdAt: booking.createdAt,
      }))
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create booking
router.post(
  '/',
  authenticate,
  logAction('create_booking', 'booking'),
  [
    body('resourceId').notEmpty().withMessage('Resource ID is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('attendeesCount').isInt({ min: 1 }).withMessage('Attendees count must be at least 1'),
    body('notes').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { resourceId, startTime, endTime, attendeesCount, notes } = req.body;

      // Validate resource exists
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Validate capacity
      if (attendeesCount > resource.capacity) {
        return res.status(400).json({
          message: `Attendees count (${attendeesCount}) exceeds resource capacity (${resource.capacity})`,
        });
      }

      // Validate time
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end <= start) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      if (start < new Date()) {
        return res.status(400).json({ message: 'Cannot book in the past' });
      }

      // Check for conflicts
      const conflictingBooking = await Booking.findOne({
        resourceId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } },
        ],
      });

      if (conflictingBooking) {
        return res.status(409).json({
          message: 'This time slot is already booked',
          conflictingBooking: {
            id: conflictingBooking._id,
            startTime: conflictingBooking.startTime,
            endTime: conflictingBooking.endTime,
          },
        });
      }

      // Create booking (auto-approve for now, can add rules later)
      const booking = await Booking.create({
        resourceId,
        userId: req.user._id,
        startTime: start,
        endTime: end,
        attendeesCount,
        notes: notes || '',
        status: 'pending', // Can be changed to 'confirmed' based on auto-approval rules
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('resourceId', 'name location capacity amenities images tags');

      res.status(201).json({
        id: populatedBooking._id,
        resourceId: populatedBooking.resourceId._id,
        resource: {
          id: populatedBooking.resourceId._id,
          name: populatedBooking.resourceId.name,
          location: populatedBooking.resourceId.location,
          capacity: populatedBooking.resourceId.capacity,
          amenities: populatedBooking.resourceId.amenities,
          images: populatedBooking.resourceId.images,
          tags: populatedBooking.resourceId.tags,
        },
        startTime: populatedBooking.startTime,
        endTime: populatedBooking.endTime,
        status: populatedBooking.status,
        attendeesCount: populatedBooking.attendeesCount,
        notes: populatedBooking.notes,
        createdAt: populatedBooking.createdAt,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update booking
router.patch(
  '/:id',
  authenticate,
  logAction('update_booking', 'booking'),
  [
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled']),
    body('startTime').optional().isISO8601(),
    body('endTime').optional().isISO8601(),
    body('attendeesCount').optional().isInt({ min: 1 }),
    body('notes').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check permissions
      const isOwner = booking.userId.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      // If updating time, check for conflicts
      if (req.body.startTime || req.body.endTime) {
        const start = new Date(req.body.startTime || booking.startTime);
        const end = new Date(req.body.endTime || booking.endTime);

        if (end <= start) {
          return res.status(400).json({ message: 'End time must be after start time' });
        }

        const conflictingBooking = await Booking.findOne({
          _id: { $ne: booking._id },
          resourceId: booking.resourceId,
          status: { $in: ['pending', 'confirmed'] },
          $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
        });

        if (conflictingBooking) {
          return res.status(409).json({
            message: 'This time slot conflicts with another booking',
          });
        }

        req.body.startTime = start;
        req.body.endTime = end;
      }

      // Update booking
      const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .populate('resourceId', 'name location capacity amenities images tags')
        .populate('userId', 'name username');

      res.json({
        id: updatedBooking._id,
        resourceId: updatedBooking.resourceId._id,
        resource: {
          id: updatedBooking.resourceId._id,
          name: updatedBooking.resourceId.name,
          location: updatedBooking.resourceId.location,
          capacity: updatedBooking.resourceId.capacity,
          amenities: updatedBooking.resourceId.amenities,
          images: updatedBooking.resourceId.images,
          tags: updatedBooking.resourceId.tags,
        },
        startTime: updatedBooking.startTime,
        endTime: updatedBooking.endTime,
        status: updatedBooking.status,
        attendeesCount: updatedBooking.attendeesCount,
        notes: updatedBooking.notes,
        createdAt: updatedBooking.createdAt,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;

