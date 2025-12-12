import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import authRoutes from '../routes/auth.js';

// Load environment variables for tests
dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-jwt-tokens';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshuri_test';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const MONGODB_URI = process.env.MONGODB_URI;

describe('Authentication API', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        password: 'Test1234',
        role: 'student',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.role).toBe('student');
    });

    it('should reject registration with invalid password', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser2',
        password: 'weak',
        role: 'student',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject duplicate username', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        password: 'Test1234',
        role: 'student',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      // Duplicate username should return 409 Conflict or 400 Bad Request
      expect([400, 409]).toContain(response.status);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      const passwordHash = await bcrypt.hash('Test1234', 10);
      await User.collection.insertOne({
        name: 'Test User',
        username: 'logintest',
        passwordHash,
        role: 'student',
        active: true,
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'logintest',
          password: 'Test1234',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('logintest');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'logintest',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'Test1234',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});

