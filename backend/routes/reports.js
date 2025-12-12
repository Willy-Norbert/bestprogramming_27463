import express from 'express';
import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get usage reports
router.get('/usage', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { from, to, resourceId, format } = req.query;

    const fromDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const query = {
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    if (resourceId) {
      query.resourceId = resourceId;
    }

    const bookings = await Booking.find(query)
      .populate('resourceId', 'name location')
      .populate('userId', 'name username')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

    // Resource usage
    const resourceUsageMap = new Map();
    bookings.forEach((booking) => {
      const resourceId = booking.resourceId._id.toString();
      const resourceName = booking.resourceId.name;
      if (!resourceUsageMap.has(resourceId)) {
        resourceUsageMap.set(resourceId, {
          resourceId,
          resourceName,
          bookingCount: 0,
        });
      }
      resourceUsageMap.get(resourceId).bookingCount++;
    });

    const resourceUsage = Array.from(resourceUsageMap.values()).sort(
      (a, b) => b.bookingCount - a.bookingCount
    );

    // Time range usage (by day)
    const timeRangeUsage = [];
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayBookings = bookings.filter((b) => {
        const bookingDate = new Date(b.startTime);
        return bookingDate >= dayStart && bookingDate <= dayEnd;
      });

      timeRangeUsage.push({
        period: currentDate.toISOString().split('T')[0],
        count: dayBookings.length,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const reportData = {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      pendingBookings,
      resourceUsage,
      timeRangeUsage,
    };

    // If CSV format requested
    if (format === 'csv') {
      const csvRows = [
        ['Date', 'Resource', 'User', 'Start Time', 'End Time', 'Status', 'Attendees'],
      ];

      bookings.forEach((booking) => {
        csvRows.push([
          new Date(booking.startTime).toISOString().split('T')[0],
          booking.resourceId.name,
          booking.userId.name,
          booking.startTime.toISOString(),
          booking.endTime.toISOString(),
          booking.status,
          booking.attendeesCount.toString(),
        ]);
      });

      const csv = csvRows.map((row) => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=usage-report-${Date.now()}.csv`);
      return res.send(csv);
    }

    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

