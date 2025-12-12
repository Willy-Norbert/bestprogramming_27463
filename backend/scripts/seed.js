import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eshuri';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create users (using passwords that meet requirements: 8+ chars, uppercase, lowercase, number)
    // Hash passwords before inserting (bypassing pre-save hook to avoid double hashing)
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const staffPassword = await bcrypt.hash('Staff123', 10);
    const studentPassword = await bcrypt.hash('Student123', 10);

    // Use insertMany to bypass Mongoose pre-save hooks
    const usersData = [
      {
        name: 'Admin User',
        username: 'admin',
        passwordHash: adminPassword,
        role: 'admin',
        active: true,
      },
      {
        name: 'Teacher Smith',
        username: 'teacher',
        passwordHash: staffPassword,
        role: 'staff',
        active: true,
      },
      {
        name: 'John Doe',
        username: 'student1',
        passwordHash: studentPassword,
        role: 'student',
        active: true,
      },
      {
        name: 'Jane Smith',
        username: 'student2',
        passwordHash: studentPassword,
        role: 'student',
        active: true,
      },
    ];

    // Insert directly into collection to bypass pre-save hook
    await User.collection.insertMany(usersData);
    
    // Fetch the created users for reference
    const admin = await User.findOne({ username: 'admin' });
    const staff = await User.findOne({ username: 'teacher' });
    const student1 = await User.findOne({ username: 'student1' });
    const student2 = await User.findOne({ username: 'student2' });

    console.log('Created users');

    // Create resources
    const resources = await Resource.create([
      {
        name: 'Main Classroom A',
        location: 'Building 1, Floor 2, Room 201',
        capacity: 30,
        amenities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
        tags: ['classroom'],
        images: [],
        createdBy: admin._id,
      },
      {
        name: 'Computer Lab',
        location: 'Building 1, Floor 1, Room 105',
        capacity: 25,
        amenities: ['Computers', 'Projector', 'AC'],
        tags: ['lab', 'computer'],
        images: [],
        createdBy: admin._id,
      },
      {
        name: 'Science Laboratory',
        location: 'Building 2, Floor 1, Room 101',
        capacity: 20,
        amenities: ['Lab Equipment', 'Safety Equipment', 'AC'],
        tags: ['lab', 'science'],
        images: [],
        createdBy: admin._id,
      },
      {
        name: 'Library Study Room',
        location: 'Library, Floor 1, Room 3',
        capacity: 10,
        amenities: ['Tables', 'Chairs', 'WiFi'],
        tags: ['library', 'study'],
        images: [],
        createdBy: admin._id,
      },
      {
        name: 'Auditorium',
        location: 'Main Building, Ground Floor',
        capacity: 100,
        amenities: ['Stage', 'Sound System', 'Projector', 'AC'],
        tags: ['auditorium', 'events'],
        images: [],
        createdBy: admin._id,
      },
    ]);

    console.log('Created resources');

    // Create sample bookings
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);

    await Booking.create([
      {
        resourceId: resources[0]._id,
        userId: student1._id,
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
        status: 'confirmed',
        attendeesCount: 25,
        notes: 'Mathematics class',
      },
      {
        resourceId: resources[1]._id,
        userId: staff._id,
        startTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000),
        endTime: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000),
        status: 'pending',
        attendeesCount: 20,
        notes: 'Programming workshop',
      },
      {
        resourceId: resources[2]._id,
        userId: student2._id,
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000),
        status: 'confirmed',
        attendeesCount: 15,
        notes: 'Chemistry practical',
      },
    ]);

    console.log('Created sample bookings');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: username=admin, password=Admin123');
    console.log('Staff: username=teacher, password=Staff123');
    console.log('Student: username=student1, password=Student123');
    console.log('Student: username=student2, password=Student123');
    console.log('\n📊 Created:');
    console.log(`  - ${await User.countDocuments()} users`);
    console.log(`  - ${await Resource.countDocuments()} resources`);
    console.log(`  - ${await Booking.countDocuments()} bookings`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

