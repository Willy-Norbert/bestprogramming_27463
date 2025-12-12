import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import bookingsRoutes from '../routes/bookings.js';
import authRoutes from '../routes/auth.js';
import { authenticate } from '../middleware/auth.js';

// Load environment variables for tests
dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jwt-tokens';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshuri_test';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', authenticate, bookingsRoutes);

const MONGODB_URI = process.env.MONGODB_URI;

describe('Bookings API', () => {
  let authToken;
  let testUser;
  let testResource;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Booking.deleteMany({});

    // Create test user (use insertOne to avoid double-hashing)
    const passwordHash = await bcrypt.hash('Test1234', 10);
    await User.collection.insertOne({
      name: 'Test User',
      username: 'bookingtest',
      passwordHash,
      role: 'student',
      active: true,
    });
    testUser = await User.findOne({ username: 'bookingtest' });

    // Create admin user for resource creation (use insertOne to avoid double-hashing)
    const adminPasswordHash = await bcrypt.hash('Admin123', 10);
    await User.collection.insertOne({
      name: 'Admin User',
      username: 'admintest',
      passwordHash: adminPasswordHash,
      role: 'admin',
      active: true,
    });
    const admin = await User.findOne({ username: 'admintest' });

    // Create test resource
    testResource = await Resource.create({
      name: 'Test Classroom',
      location: 'Building 1, Room 101',
      capacity: 30,
      amenities: ['Projector', 'Whiteboard'],
      tags: ['classroom'],
      createdBy: admin._id,
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'bookingtest',
        password: 'Test1234',
      });

    if (loginResponse.status !== 200) {
      console.error('Login failed:', loginResponse.body);
      throw new Error('Failed to login in test setup');
    }
    
    authToken = loginResponse.body.token;
    if (!authToken) {
      console.error('No token in login response:', loginResponse.body);
      throw new Error('No token received from login');
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(10, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(12, 0, 0, 0);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resourceId: testResource._id.toString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendeesCount: 25,
          notes: 'Test booking',
        })
        .expect(201);

      // API returns booking directly, not wrapped
      expect(response.body).toHaveProperty('resourceId');
      expect(response.body.resourceId).toBe(testResource._id.toString());
      expect(response.body.status).toBe('pending');
    });

    it('should reject booking with invalid time range', async () => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(12, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(10, 0, 0, 0); // End before start

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resourceId: testResource._id.toString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendeesCount: 25,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject booking exceeding capacity', async () => {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(14, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(16, 0, 0, 0);

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resourceId: testResource._id.toString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          attendeesCount: 100, // Exceeds capacity of 30
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/bookings', () => {
    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // API returns array directly, not wrapped
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

