import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    console.log('🔐 [MIDDLEWARE] Authentication check for:', req.path);
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('❌ [MIDDLEWARE] JWT_SECRET is not set!');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Try to get token from cookie first
    let token = req.cookies?.token;
    console.log('🍪 [MIDDLEWARE] Cookie token:', token ? 'Present' : 'Missing');

    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
      console.log('🔑 [MIDDLEWARE] Authorization header token:', token ? 'Present' : 'Missing');
    }

    if (!token) {
      console.log('❌ [MIDDLEWARE] No token found in cookie or header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('✅ [MIDDLEWARE] Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [MIDDLEWARE] Token verified, userId:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      console.log('❌ [MIDDLEWARE] User not found for userId:', decoded.userId);
      return res.status(401).json({ message: 'User not found or inactive' });
    }
    
    if (!user.active) {
      console.log('❌ [MIDDLEWARE] User is inactive:', user._id);
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    console.log('✅ [MIDDLEWARE] User authenticated:', { id: user._id, username: user.username, role: user.role });
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ [MIDDLEWARE] Authentication error:', error.message);
    console.error('❌ [MIDDLEWARE] Error stack:', error.stack);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

