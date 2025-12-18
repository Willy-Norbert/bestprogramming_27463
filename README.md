# E-shuri - Smart Classroom Resource Booking System

A web application for managing classroom and resource bookings in academic institutions.

**Author:** Willy Norbert IRABARUTA  
**Student ID:** 27463

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Installation Guide](#installation-guide)
8. [Running the Application](#running-the-application)
9. [API Documentation](#api-documentation)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Project Report](#project-report)

---

## Project Overview

This project is a complete web application that helps schools and universities manage their classroom and resource bookings. Instead of using paper forms or spreadsheets, students and staff can book resources through a website. The system automatically checks if resources are available and prevents double bookings.

The application has two main parts:
- **Frontend**: The website that users see and interact with
- **Backend**: The server that handles all the business logic and data storage

---

## Problem Statement

Schools and universities face many problems when managing resource bookings:

### Problem 1: Manual Processes
- People have to fill out paper forms or use spreadsheets
- This takes a lot of time and effort
- Forms can get lost or misplaced
- Hard to keep track of all bookings

### Problem 2: Double Bookings
- Two or more people might book the same room at the same time
- No one knows about conflicts until they show up
- This causes confusion and conflicts
- Wastes time for everyone involved

### Problem 3: No Real-Time Information
- Students and staff cannot easily check if a room is available
- They have to call or email someone to find out
- This wastes time and creates delays
- People make bookings without knowing availability

### Problem 4: Poor Management
- Administrators cannot track how resources are being used
- Hard to generate reports and statistics
- Cannot make good decisions about resource allocation
- No way to see usage patterns

### Problem 5: Fragmented Systems
- Different departments use different methods
- No central place to see all bookings
- Hard to coordinate between departments
- Inconsistent booking processes

---

## Solution

This system solves all these problems by providing:

1. **Centralized Booking System**: One place for all resource bookings
2. **Real-Time Availability**: See what's available instantly
3. **Automatic Conflict Detection**: System prevents double bookings automatically
4. **Easy Access**: Available 24/7 from any device with internet
5. **Management Tools**: Administrators can track usage and generate reports
6. **User-Friendly Interface**: Simple and easy to use for everyone

---

## Features

### User Roles

The system has three types of users:

**Students**
- Browse available resources like classrooms, labs, or equipment
- Book resources for their needs
- View their own booking history
- Check availability in real-time
- Cancel their own bookings

**Staff**
- Everything students can do
- Manage resources for their department
- View statistics and reports for their department
- Monitor how resources are being used

**Administrators**
- Full control over the entire system
- Add, edit, or remove resources
- Manage all users and their permissions
- View detailed analytics and reports
- See complete activity logs (audit logs)
- Generate usage reports
- Manage user roles

### Key Features

**Real-Time Availability**
- See instantly which resources are available
- No need to call or email to check
- Calendar view shows all bookings

**Automatic Conflict Prevention**
- System checks for conflicts before allowing a booking
- Prevents double bookings automatically
- Shows error message if time slot is already taken

**Role-Based Access Control**
- Different users have different permissions
- Students can only see and book resources
- Staff have additional management features
- Administrators have full access

**Activity Tracking**
- Every booking and change is recorded
- Administrators can see who did what and when
- Complete audit trail for accountability

**Analytics Dashboard**
- Visual charts showing resource usage
- Statistics about bookings and users
- Helps administrators make better decisions
- Shows popular resources and usage patterns

**Responsive Design**
- Works on computers, tablets, and phones
- Same experience on all devices
- Easy to use on mobile devices

**Secure Authentication**
- Users must log in to access the system
- Passwords are encrypted and secure
- JWT tokens for secure sessions
- Only authorized people can access

---

## Technology Stack

### Frontend Technologies

**React 18.3.1**
- Main framework for building the user interface
- Makes the website interactive and responsive
- Component-based architecture for reusable code

**TypeScript 5.8.3**
- Adds type checking to JavaScript
- Helps catch errors before code runs
- Makes code easier to understand and maintain

**Vite 5.4.19**
- Build tool that compiles the code
- Makes development faster
- Creates optimized files for production

**Tailwind CSS 3.4.17**
- CSS framework for styling
- Makes it easy to create consistent design
- Speeds up development

**React Router 6.30.1**
- Handles navigation between pages
- Manages URL routing

**Axios 1.13.2**
- Library for making HTTP requests
- Used to communicate with the backend server

### Backend Technologies

**Node.js 18+**
- Runtime environment that runs JavaScript on the server
- Allows JavaScript to run outside the browser

**Express 4.18.2**
- Web framework for Node.js
- Makes it easy to create API endpoints
- Handles HTTP requests and responses

**MongoDB**
- Database that stores all the data
- Stores users, resources, bookings, and logs
- NoSQL database, meaning it's flexible

**Mongoose 8.0.3**
- Library that makes it easier to work with MongoDB
- Defines data structures (schemas)
- Provides validation and helpful features

**JWT 9.0.2**
- JSON Web Tokens for authentication
- When user logs in, they get a token
- Token proves they are logged in

**Bcrypt 5.1.1**
- Encrypts passwords
- Passwords are never stored in plain text
- Makes the system secure

### DevOps Tools

**Docker**
- Packages the application into containers
- Makes deployment easier
- Ensures it works the same everywhere

**Docker Compose**
- Manages multiple containers together
- Starts database, backend, and frontend together

---

## Project Structure

Here is how the project files are organized:

```
event-template/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── Layout/              # Layout components (header, sidebar)
│   │   └── ui/                  # Basic UI components (buttons, forms)
│   ├── pages/                   # Page components (home, dashboard, etc.)
│   ├── contexts/                # React contexts (authentication, notifications)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and API client
│   └── assets/                  # Images and static files
├── backend/                      # Backend source code
│   ├── models/                  # Database models (User, Resource, Booking)
│   ├── routes/                  # API route handlers
│   ├── middleware/              # Express middleware (auth, audit)
│   ├── scripts/                 # Utility scripts (seed data, tests)
│   └── __tests__/               # Test files
├── public/                       # Public static files
├── docker-compose.yml            # Docker configuration
├── Dockerfile                    # Main Dockerfile
└── package.json                  # Frontend dependencies
```

---

## Installation Guide

### Prerequisites

Before installing, make sure you have:
- Node.js 18 or higher installed
- MongoDB installed (or use Docker)
- Git installed
- Docker (optional, but recommended)

### Option 1: Local Development

**Step 1: Clone the repository**
```bash
git clone https://github.com/Willy-Norbert/bestprogramming_27463.git
cd bestprogramming_27463
```

**Step 2: Install frontend dependencies**
   ```bash
   npm install
```

This downloads all packages needed for the frontend.

**Step 3: Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

This downloads all packages needed for the backend.

**Step 4: Set up environment variables**

Create a file named `.env` in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

Create a file named `.env` in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/eshuri
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

**Step 5: Start MongoDB**

If you have MongoDB installed locally:
- On Windows: Start the MongoDB service
- On macOS/Linux: Run `mongod` in a terminal

**Step 6: Seed the database (optional)**

This adds sample data to help you test:
```bash
cd backend
npm run seed
```

### Option 2: Docker Deployment (Recommended)

**Step 1: Clone the repository**
```bash
git clone https://github.com/Willy-Norbert/bestprogramming_27463.git
cd bestprogramming_27463
```

**Step 2: Create environment file**

Create `backend/.env`:
```env
JWT_SECRET=your-secret-key-change-in-production
```

**Step 3: Start all services**
```bash
docker-compose up -d
```

This starts:
- MongoDB database on port 27017
- Backend API server on port 3000
- Frontend web application on port 8080

That's it! Everything is running.

---

## Running the Application

### Development Mode

**Start the backend server:**
```bash
cd backend
npm run dev
```

The backend will start on port 3000. You should see a message saying the server is running.

**Start the frontend (in a new terminal):**
   ```bash
   npm run dev
```

The frontend will start on port 5173. You should see a message with the local URL.

**Access the application:**
- Frontend: Open http://localhost:5173 in your browser
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

### Production Build

**Build the frontend:**
```bash
npm run build
```

This creates optimized files in the `dist` folder.

**Start the backend:**
```bash
cd backend
npm start
```

### Docker Commands

```bash
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs       # View logs
docker-compose ps         # Check status
docker-compose restart    # Restart services
```

---

## API Documentation

The backend provides REST API endpoints for the frontend to use.

### Authentication Endpoints

- `POST /api/auth/register` - Create a new user account
  - Requires: username, email, password, name, role
  - Returns: user information and authentication token

- `POST /api/auth/login` - Log in to the system
  - Requires: username, password
  - Returns: user information and authentication token

- `POST /api/auth/logout` - Log out of the system
  - Requires: authentication token

- `GET /api/auth/me` - Get current user information
  - Requires: authentication token
  - Returns: current user details

### Resource Endpoints

- `GET /api/resources` - Get list of all resources
  - Returns: array of all resources

- `GET /api/resources/:id` - Get details about a specific resource
  - Returns: detailed information about the resource

- `GET /api/resources/:id/availability` - Check resource availability
  - Returns: available time slots

- `POST /api/resources` - Create a new resource (Admin only)
  - Requires: name, location, capacity, amenities
  - Returns: created resource

- `PATCH /api/resources/:id` - Update a resource (Admin only)
  - Returns: updated resource

- `DELETE /api/resources/:id` - Delete a resource (Admin only)

### Booking Endpoints

- `GET /api/bookings` - Get bookings
  - Students: get their own bookings
  - Admin: get all bookings
  - Returns: array of bookings

- `POST /api/bookings` - Create a new booking
  - Requires: resourceId, startTime, endTime, attendeesCount
  - Returns: created booking

- `PATCH /api/bookings/:id` - Update a booking
  - Returns: updated booking

- `DELETE /api/bookings/:id` - Cancel a booking

### Dashboard Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
  - Returns: total bookings, resources, users, etc.

### Reports Endpoints (Admin only)

- `GET /api/reports/usage` - Get usage reports
  - Returns: resource usage statistics

### Audit Logs Endpoints (Admin only)

- `GET /api/audit-logs` - Get activity logs
  - Returns: all system activities

### User Endpoints

- `GET /api/users` - Get list of all users (Admin only)
- `PATCH /api/users/me` - Update your own profile
- `PATCH /api/users/me/password` - Change your password

### Health Check

- `GET /api/health` - Check if server is running
  - Returns: server status and database connection status

---

## Testing

The project includes tests to make sure everything works correctly.

### Frontend Testing

**Run tests:**
```bash
npm run test
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Generate coverage report:**
```bash
npm run test:coverage
```

Tests are located in `src/__tests__/`

### Backend Testing

**Run tests:**
```bash
cd backend
npm run test
```

**Watch mode (auto-runs on file changes):**
```bash
npm run test:watch
```

**Generate coverage report:**
```bash
npm run test:coverage
```

Tests are located in `backend/__tests__/`

### Test API Connection

Test if all API endpoints are working:
```bash
cd backend
npm run test:api
```

---

## Deployment

### Docker Compose Deployment (Recommended)

This is the easiest way to deploy the application:

```bash
docker-compose up -d
```

This starts all services in the background.

### Production Checklist

Before deploying to production, make sure:

- [ ] Set a strong JWT_SECRET (use a random string)
- [ ] Configure production MongoDB URI
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test everything thoroughly

### Deployment Options

1. **Docker Compose**: Best for single server deployment
2. **Cloud Platforms**: AWS, Azure, or Google Cloud
3. **Traditional Server**: Install Node.js and MongoDB on server

---

## Project Report

### Project Statistics

**Frontend:**
- Total files: 100+
- Components: 50+
- Pages: 15+
- Lines of code: ~15,000+

**Backend:**
- Total files: 20+
- API routes: 7
- Database models: 4
- Middleware: 2
- Lines of code: ~3,000+

### Code Quality

- TypeScript coverage: ~95% (frontend)
- JavaScript coverage: ~80% (backend)
- ESLint configured with no critical warnings
- Proper error handling throughout
- Input validation on all forms

### Design Patterns Used

The project implements several software design patterns:

1. **Singleton Pattern**: API client instance
2. **Provider/Context Pattern**: React state management
3. **Repository Pattern**: Data access layer
4. **Middleware Pattern**: Authentication and logging
5. **Factory Pattern**: Component variants
6. **Higher-Order Component**: Route protection
7. **Custom Hooks**: Reusable logic
8. **Strategy Pattern**: Conflict detection
9. **Observer Pattern**: Notification system
10. **Module Pattern**: Code organization

### Version Control

- Git repository initialized
- Proper .gitignore configuration
- Regular commits with meaningful messages
- No sensitive data in repository

### Features Implemented

- User authentication with JWT
- Role-based access control (Admin, Staff, Student)
- Resource management (CRUD operations)
- Booking system with conflict detection
- Dashboard with statistics
- Reports and analytics
- Audit logging
- Notification system
- Responsive web design
- Form validation
- Docker containerization

### Testing

- Frontend tests using Vitest
- Backend tests using Jest
- API integration tests
- Test coverage reports generated

### Deployment

- Docker configuration complete
- Multi-stage builds for optimization
- Health checks configured
- Environment variables properly configured
- Production-ready setup

---

## Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code for errors
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Backend Scripts

```bash
npm start            # Start production server
npm run dev          # Start development server with auto-reload
npm run seed         # Add sample data to database
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:api     # Test API connections
```

---

## Support

If you have questions or find problems, please open an issue in the repository.

---

**E-shuri Smart Classroom Resource Booking System**  
**Author:** Willy Norbert IRABARUTA  
**Student ID:** 27463

Streamlining resource management for educational institutions.
