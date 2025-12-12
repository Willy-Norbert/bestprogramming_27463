import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import resourceRoutes from './routes/resources.js';
import bookingRoutes from './routes/bookings.js';
import dashboardRoutes from './routes/dashboard.js';
import reportRoutes from './routes/reports.js';
import auditRoutes from './routes/audit.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

// Log environment check (without exposing secrets)
console.log('🔧 [SERVER] Environment check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  - PORT:', process.env.PORT || '3000 (default)');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET - This will cause authentication to fail!');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ NOT SET - Using default');
console.log('  - COOKIE_SECURE:', process.env.COOKIE_SECURE || 'false (default)');
console.log('  - COOKIE_SAME_SITE:', process.env.COOKIE_SAME_SITE || 'lax (default)');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshuri';

// Middleware - CORS before helmet
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Configure helmet to work with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.use('/health', healthRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit-logs', auditRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Ensure JSON response
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server even if MongoDB isn't connected yet
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Connect to MongoDB with retry logic
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`💡 To seed database, run: npm run seed`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n📋 To fix this:');
    console.log('   1. Start MongoDB locally:');
    console.log('      Windows: mongod');
    console.log('      macOS: brew services start mongodb-community');
    console.log('      Linux: sudo systemctl start mongod');
    console.log('\n   2. OR use MongoDB Atlas (cloud):');
    console.log('      - Create free account at https://www.mongodb.com/cloud/atlas');
    console.log('      - Create cluster and get connection string');
    console.log('      - Update MONGODB_URI in backend/.env');
    console.log('\n   Current MONGODB_URI:', MONGODB_URI);
    console.log('\n⏳ Retrying connection every 5 seconds...\n');
    
    // Retry connection every 5 seconds
    setTimeout(connectMongoDB, 5000);
  }
};

connectMongoDB();

export default app;

