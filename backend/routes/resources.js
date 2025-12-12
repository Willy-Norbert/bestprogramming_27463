import express from 'express';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all resources with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { q, capacity, tags, all } = req.query;
    const query = {};

    // Search query
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    // Capacity filter
    if (capacity && capacity !== 'all') {
      query.capacity = { $lte: parseInt(capacity) };
    }

    // Tags filter
    if (tags && tags !== 'all') {
      query.tags = { $in: [tags] };
    }

    const resources = await Resource.find(query).populate('createdBy', 'name username').sort({ createdAt: -1 });

    // Add availability check
    const now = new Date();
    const resourcesWithAvailability = await Promise.all(
      resources.map(async (resource) => {
        const activeBookings = await Booking.countDocuments({
          resourceId: resource._id,
          status: { $in: ['pending', 'confirmed'] },
          startTime: { $gte: now },
        });

        return {
          id: resource._id,
          name: resource.name,
          location: resource.location,
          capacity: resource.capacity,
          amenities: resource.amenities,
          images: resource.images,
          tags: resource.tags,
          available: activeBookings === 0,
        };
      })
    );

    res.json(resourcesWithAvailability);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single resource
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'name username');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check availability
    const now = new Date();
    const activeBookings = await Booking.countDocuments({
      resourceId: resource._id,
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $gte: now },
    });

    res.json({
      id: resource._id,
      name: resource.name,
      location: resource.location,
      capacity: resource.capacity,
      amenities: resource.amenities,
      images: resource.images,
      tags: resource.tags,
      available: activeBookings === 0,
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get resource availability
router.get('/:id/availability', authenticate, async (req, res) => {
  try {
    const { from, to } = req.query;
    const resourceId = req.params.id;

    if (!from || !to) {
      return res.status(400).json({ message: 'from and to parameters are required' });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Get all bookings for this resource in the time range
    const bookings = await Booking.find({
      resourceId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $gte: fromDate, $lte: toDate } },
        { endTime: { $gte: fromDate, $lte: toDate } },
        { startTime: { $lte: fromDate }, endTime: { $gte: toDate } },
      ],
    }).select('startTime endTime status');

    // Generate available slots (simplified - returns booked times)
    res.json({
      bookings: bookings.map((b) => ({
        id: b._id,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
      })),
      availableSlots: [], // Frontend will calculate available slots from bookings
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create resource (admin only)
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  logAction('create_resource', 'resource'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('amenities').optional().isArray(),
    body('tags').optional().isArray(),
    body('images').optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const resource = await Resource.create({
        ...req.body,
        createdBy: req.user._id,
      });

      res.status(201).json({
        id: resource._id,
        name: resource.name,
        location: resource.location,
        capacity: resource.capacity,
        amenities: resource.amenities,
        images: resource.images,
        tags: resource.tags,
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update resource (admin only)
router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  logAction('update_resource', 'resource'),
  [
    body('name').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('capacity').optional().isInt({ min: 1 }),
    body('amenities').optional().isArray(),
    body('tags').optional().isArray(),
    body('images').optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.json({
        id: resource._id,
        name: resource.name,
        location: resource.location,
        capacity: resource.capacity,
        amenities: resource.amenities,
        images: resource.images,
        tags: resource.tags,
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete resource (admin only)
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  logAction('delete_resource', 'resource'),
  async (req, res) => {
    try {
      const resource = await Resource.findByIdAndDelete(req.params.id);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Also delete related bookings
      await Booking.deleteMany({ resourceId: req.params.id });

      res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;

