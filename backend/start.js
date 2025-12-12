// Quick start script to verify backend setup
import dotenv from 'dotenv';
dotenv.config();

console.log('Backend Configuration:');
console.log('PORT:', process.env.PORT || 3000);
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/eshuri');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:8080');
console.log('\nStarting server...');


