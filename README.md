# E-shuri - Smart Classroom Resource Booking System

A web application that helps schools and universities manage classroom and resource bookings easily. No more paper forms or double bookings.

## Table of Contents

- [What is This?](#what-is-this)
- [What Problems Does It Solve?](#what-problems-does-it-solve)
- [What Can It Do?](#what-can-it-do)
- [What Technologies Are Used?](#what-technologies-are-used)
- [How Is The Project Organized?](#how-is-the-project-organized)
- [How Do I Get Started?](#how-do-i-get-started)
- [How Do I Install It?](#how-do-i-install-it)
- [How Do I Configure It?](#how-do-i-configure-it)
- [How Do I Run It?](#how-do-i-run-it)
- [How Do I Use Docker?](#how-do-i-use-docker)
- [What Are The API Endpoints?](#what-are-the-api-endpoints)
- [How Do I Test It?](#how-do-i-test-it)
- [What Design Patterns Are Used?](#what-design-patterns-are-used)
- [Code Quality and Standards](#code-quality-and-standards)
- [Version Control](#version-control)
- [How Do I Deploy It?](#how-do-i-deploy-it)
- [What's Next?](#whats-next)

---

## What is This?

E-shuri is a booking system for schools and universities. Instead of using paper forms or spreadsheets, students and staff can book classrooms and other resources through a website. The system automatically checks if a resource is available and prevents double bookings.

Think of it like booking a hotel room online, but for school resources like classrooms, labs, or equipment.

---

## What Problems Does It Solve?

Schools often struggle with booking resources. Here are the main problems this system fixes:

**Problem 1: Manual Processes**
- People have to fill out paper forms or use spreadsheets
- This takes a lot of time
- Forms can get lost or misplaced

**Problem 2: Double Bookings**
- Two people might book the same room at the same time
- No one knows until they both show up
- This causes conflicts and confusion

**Problem 3: No Visibility**
- Students and staff can't easily check if a room is available
- They have to call or email someone
- This wastes time

**Problem 4: Poor Management**
- Administrators can't track how resources are being used
- Hard to generate reports
- Can't make good decisions about resource allocation

**Problem 5: Fragmented Systems**
- Different departments use different methods
- No central place to see all bookings
- Hard to coordinate

**The Solution:**
This system provides a central website where everyone can see what's available, book resources instantly, and the system automatically prevents conflicts. Administrators can see reports and manage everything from one place.

---

## What Can It Do?

### Different User Types

**Students**
- Browse available resources like classrooms or labs
- Book resources for their needs
- See their own booking history
- Check availability in real-time

**Staff**
- Everything students can do
- Manage resources for their department
- View statistics and reports
- Monitor how resources are being used

**Administrators**
- Full control over the system
- Add, edit, or remove resources
- Manage all users and their permissions
- View detailed analytics and reports
- See complete activity logs

### Main Features

**Real-time Availability**
- See instantly which resources are available
- No need to call or email to check

**Automatic Conflict Prevention**
- The system checks for conflicts before allowing a booking
- Prevents double bookings automatically

**Different Access Levels**
- Students, staff, and administrators have different permissions
- Each person only sees what they're allowed to see

**Activity Tracking**
- Every booking and change is recorded
- Administrators can see who did what and when

**Analytics Dashboard**
- Visual charts showing resource usage
- Helps administrators make better decisions

**Easy Access**
- Works on any device with a web browser
- Available 24 hours a day, 7 days a week

**Secure Access**
- Users must log in
- Passwords are encrypted
- Only authorized people can access the system

**Easy Deployment**
- Can be set up using Docker
- Works the same way everywhere

---

## What Technologies Are Used?

### Frontend (What Users See)

**React 18.3.1**
- The main framework for building the user interface
- Makes the website interactive and responsive

**TypeScript 5.8.3**
- Adds type checking to JavaScript
- Helps catch errors before the code runs
- Makes the code easier to understand and maintain

**Vite 5.4.19**
- The build tool that compiles the code
- Makes development faster
- Creates optimized files for production

**Tailwind CSS 3.4.17**
- A CSS framework for styling
- Makes it easy to create a consistent look
- Speeds up development

**React Router 6.30.1**
- Handles navigation between pages
- Like the pages in a book, but for a website

**Axios 1.13.2**
- A library for making HTTP requests
- Used to communicate with the backend server

**React Hook Form 7.61.1**
- Makes it easy to create and manage forms
- Handles form validation automatically

**Zod 3.25.76**
- Validates data to make sure it's correct
- Prevents bad data from entering the system

**Shadcn UI**
- A collection of pre-built UI components
- Buttons, forms, dialogs, etc.
- Saves time and ensures consistency

### Backend (The Server)

**Node.js 18+**
- The runtime environment that runs JavaScript on the server
- Like an interpreter that understands JavaScript

**Express 4.18.2**
- A web framework for Node.js
- Makes it easy to create API endpoints
- Handles HTTP requests and responses

**MongoDB**
- The database that stores all the data
- Stores users, resources, bookings, etc.
- A NoSQL database, meaning it's flexible

**Mongoose 8.0.3**
- A library that makes it easier to work with MongoDB
- Defines data structures (schemas)
- Provides validation and other helpful features

**JWT 9.0.2**
- JSON Web Tokens for authentication
- When a user logs in, they get a token
- This token proves they're logged in

**Bcrypt 5.1.1**
- Encrypts passwords
- Passwords are never stored in plain text
- Makes the system more secure

**Express Validator 7.0.1**
- Validates data coming from the frontend
- Makes sure the data is correct before processing it

**Helmet 7.1.0**
- Adds security headers to HTTP responses
- Helps protect against common attacks

**CORS 2.8.5**
- Allows the frontend to communicate with the backend
- Handles cross-origin requests

**Express Rate Limit 7.1.5**
- Limits how many requests a user can make
- Prevents abuse and protects the server

### DevOps and Tools

**Docker**
- Packages the application into containers
- Makes deployment easier
- Ensures it works the same everywhere

**Docker Compose**
- Manages multiple containers together
- Starts the database, backend, and frontend together

**Vitest 1.6.1**
- Testing framework for the frontend
- Runs tests to make sure everything works

**Jest 29.7.0**
- Testing framework for the backend
- Tests API endpoints and business logic

**ESLint 9.32.0**
- Checks code for errors and style issues
- Helps maintain code quality

**TypeScript**
- Adds type checking
- Helps prevent bugs

---

## How Is The Project Organized?

Here's how the files are organized:

```
event-template/
├── src/                          # Frontend code
│   ├── components/               # Reusable UI components
│   │   ├── Layout/              # Layout components (header, sidebar, etc.)
│   │   └── ui/                  # Basic UI components (buttons, forms, etc.)
│   ├── contexts/                # Global state management
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and API client
│   ├── pages/                   # Page components (home, dashboard, etc.)
│   ├── types/                   # TypeScript type definitions
│   └── assets/                  # Images and other static files
├── backend/                      # Backend code
│   ├── models/                  # Database schemas (User, Resource, Booking, etc.)
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Middleware functions (authentication, logging)
│   ├── scripts/                 # Utility scripts (seed data, tests)
│   └── __tests__/               # Test files
├── public/                       # Public files (logo, favicon, etc.)
├── docker-compose.yml            # Docker configuration
├── Dockerfile                    # Main Dockerfile
├── Dockerfile.frontend          # Frontend Dockerfile
└── package.json                 # Frontend dependencies
```

---

## How Do I Get Started?

Before you start, you need:

1. **Node.js 18 or higher** - Download from nodejs.org
2. **MongoDB** - Either install locally or use Docker
3. **Docker** (optional) - Makes setup easier

---

## How Do I Install It?

### Option 1: Local Development (Without Docker)

**Step 1: Clone the repository**
```bash
git clone <repository-url>
cd event-template
```

**Step 2: Install frontend dependencies**
```bash
npm install
```

This downloads all the packages needed for the frontend.

**Step 3: Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

This downloads all the packages needed for the backend.

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
- On macOS/Linux: Run `mongod` in a terminal
- On Windows: Start the MongoDB service

**Step 6: Seed the database (optional)**

This adds some sample data to help you test:
```bash
cd backend
npm run seed
```

### Option 2: Docker Deployment (Easier)

**Step 1: Clone the repository**
```bash
git clone <repository-url>
cd event-template
```

**Step 2: Set up environment variables**

Create a file named `.env` in the `backend` directory:
```env
JWT_SECRET=your-secret-key-change-in-production
```

**Step 3: Start everything with Docker**
```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Backend API on port 3000
- Frontend on port 8080

That's it! Everything is running.

---

## How Do I Configure It?

### Frontend Configuration

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

This tells the frontend where to find the backend API.

### Backend Configuration

Create a `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/eshuri
# For Docker, use: mongodb://mongodb:27017/eshuri

JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

**Important Notes:**
- Change `JWT_SECRET` to a random string in production
- For Docker, use `mongodb://mongodb:27017/eshuri` instead of `localhost`
- The `mongodb` hostname works because Docker creates a network

---

## How Do I Run It?

### Development Mode

**Start the backend:**
```bash
cd backend
npm run dev
```

This starts the backend server. You should see it running on port 3000.

**Start the frontend (in a new terminal):**
```bash
npm run dev
```

This starts the frontend. You should see it running on port 5173.

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

**Preview the frontend:**
```bash
npm run preview
```

---

## How Do I Use Docker?

Docker makes it easy to run the entire application with one command. Instead of installing Node.js, MongoDB, and configuring everything, Docker does it all for you.

### What Docker Does

Docker packages the application and all its dependencies into containers. Think of containers like shipping boxes - everything needed is inside, and it works the same way everywhere.

### Docker Services

The `docker-compose.yml` file defines three services:

**1. MongoDB**
- The database
- Runs on port 27017
- Data is stored in a volume so it persists

**2. Backend**
- The API server
- Runs on port 3000
- Connects to MongoDB
- Waits for MongoDB to be ready before starting

**3. Frontend**
- The web application
- Runs on port 8080
- Connects to the backend
- Waits for backend to be ready before starting

### Docker Commands

**Start everything:**
```bash
docker-compose up -d
```

The `-d` flag runs it in the background.

**Stop everything:**
```bash
docker-compose down
```

**Stop and remove all data:**
```bash
docker-compose down -v
```

This removes the database volume too, so you start fresh.

**Rebuild images:**
```bash
docker-compose build
```

Use this if you change the Dockerfile.

**View logs:**
```bash
docker-compose logs
```

**Follow logs (like watching a movie):**
```bash
docker-compose logs -f
```

**Check what's running:**
```bash
docker-compose ps
```

**Start just MongoDB:**
```bash
docker-compose up mongodb
```

**Start backend and MongoDB:**
```bash
docker-compose up backend
```

**Restart services:**
```bash
docker-compose restart
```

### Why Use Docker?

**Benefits:**
- One command to start everything
- No need to install MongoDB locally
- Same environment for everyone
- Easy to reset: just delete and recreate
- Works the same way on any computer
- Production-ready configuration

---

## What Are The API Endpoints?

The backend provides several API endpoints. Here are the main ones:

### Authentication

- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Log in to the system
- `POST /api/auth/logout` - Log out
- `GET /api/auth/me` - Get information about the current user

### Resources

- `GET /api/resources` - Get a list of all resources
- `GET /api/resources/:id` - Get details about a specific resource
- `GET /api/resources/:id/availability` - Check if a resource is available
- `POST /api/resources` - Create a new resource (Admin only)
- `PATCH /api/resources/:id` - Update a resource (Admin only)
- `DELETE /api/resources/:id` - Delete a resource (Admin only)

### Bookings

- `GET /api/bookings` - Get bookings (your own, or all if admin)
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Cancel a booking

### Dashboard

- `GET /api/dashboard/stats` - Get statistics for the dashboard

### Reports (Admin only)

- `GET /api/reports/usage` - Get usage reports

### Audit Logs (Admin only)

- `GET /api/audit-logs` - Get activity logs

### Users

- `GET /api/users` - Get a list of all users (Admin only)
- `PATCH /api/users/me` - Update your own profile
- `PATCH /api/users/me/password` - Change your password

### Health Check

- `GET /api/health` - Check if the server is running

### Testing the API

You can test if the API is working:
```bash
cd backend
npm run test:api
```

This runs a script that tests all the endpoints.

---

## How Do I Test It?

Testing makes sure the code works correctly. There are tests for both the frontend and backend.

### Frontend Testing

**Framework:** Vitest with React Testing Library

**Run tests:**
```bash
npm run test
```

**Run tests with a UI:**
```bash
npm run test:ui
```

**Generate a coverage report:**
```bash
npm run test:coverage
```

This shows how much of the code is tested. The goal is 70% or more.

**Where are the tests?**
- Tests are in `src/__tests__/`

### Backend Testing

**Framework:** Jest with Supertest

**Run tests:**
```bash
cd backend
npm run test
```

**Watch mode (runs tests when you change files):**
```bash
npm run test:watch
```

**Generate a coverage report:**
```bash
npm run test:coverage
```

The goal is 80% or more coverage.

**Where are the tests?**
- Tests are in `backend/__tests__/`

### Types of Tests

**Unit Tests**
- Test individual pieces of code
- Like testing a function to make sure it works correctly
- Example: Testing that a function calculates the total correctly

**Integration Tests**
- Test how different parts work together
- Like testing that the API endpoint returns the right data
- Example: Testing that creating a booking actually saves it to the database

---

## What Design Patterns Are Used?

Design patterns are proven solutions to common programming problems. This project uses 10 different patterns:

### 1. Singleton Pattern

**What it does:** Ensures only one instance of something exists.

**Where it's used:** The API client. Instead of creating multiple connections to the server, there's just one that everyone uses.

**Why it's useful:** Saves memory and ensures consistent behavior.

### 2. Provider/Context Pattern

**What it does:** Provides global state that any component can access.

**Where it's used:** Authentication state and notifications. When you log in, the whole app knows you're logged in.

**Why it's useful:** Avoids passing data through many components.

### 3. Repository Pattern

**What it does:** Separates data access from business logic.

**Where it's used:** Database models. Instead of writing database queries everywhere, you use models that handle it.

**Why it's useful:** Makes it easy to change the database or add features.

### 4. Middleware Pattern

**What it does:** Adds functionality to requests before they reach the main handler.

**Where it's used:** Authentication and audit logging. Before processing a request, it checks if the user is logged in and logs the action.

**Why it's useful:** Keeps the main code clean and reusable.

### 5. Factory Pattern

**What it does:** Creates objects with different configurations.

**Where it's used:** UI components. Buttons can have different styles (primary, secondary, etc.) but are created the same way.

**Why it's useful:** Makes it easy to create variations of components.

### 6. Higher-Order Component (HOC) Pattern

**What it does:** Wraps components to add functionality.

**Where it's used:** Protected routes. Pages that require login are wrapped in a component that checks authentication.

**Why it's useful:** Reusable protection logic.

### 7. Custom Hooks Pattern

**What it does:** Encapsulates reusable logic.

**Where it's used:** Notifications and mobile detection. Instead of writing the same code in multiple places, it's in a hook.

**Why it's useful:** Reduces code duplication.

### 8. Strategy Pattern

**What it does:** Allows different algorithms to be used interchangeably.

**Where it's used:** Conflict detection. Different methods can be used to check for booking conflicts.

**Why it's useful:** Easy to add new conflict detection methods.

### 9. Observer Pattern

**What it does:** Notifies multiple components when something changes.

**Where it's used:** Notifications. When something happens, all components that care about it are notified.

**Why it's useful:** Decouples components from each other.

### 10. Module Pattern

**What it does:** Organizes code into logical units.

**Where it's used:** Everywhere. Code is split into files and modules.

**Why it's useful:** Makes code easier to understand and maintain.

---

## Code Quality and Standards

### Coding Standards

The code follows Google's coding standards:

- Consistent naming: variables use camelCase, components use PascalCase
- Proper indentation: 2 spaces for frontend code
- TypeScript strict mode: catches errors early
- ESLint: checks code for problems
- Meaningful names: variables and functions have clear names
- Error handling: errors are handled properly
- Comments: complex logic is explained

### Code Organization

**Frontend:**
- Components are organized by feature
- Reusable components are separate
- Layout components are separate
- Custom hooks for reusable logic
- Types are defined in one place

**Backend:**
- Models define data structures
- Routes handle API endpoints
- Middleware handles cross-cutting concerns
- Scripts for utilities

### Code Quality Metrics

- TypeScript coverage: about 95% of frontend code
- JavaScript coverage: about 80% of backend code
- No critical ESLint warnings
- No console.log in production code
- Proper error handling
- All forms have input validation

### Project Statistics

**Frontend:**
- About 100+ files
- 50+ components
- 15+ pages
- About 15,000+ lines of code

**Backend:**
- About 20+ files
- 7 API routes
- 4 database models
- 2 middleware files
- About 3,000+ lines of code

---

## Version Control

### Git Configuration

The project uses Git for version control:

- Repository is initialized
- `.gitignore` is configured to exclude unnecessary files
- Main branch is used for production
- Commit messages follow a standard format

### What Gets Ignored

These files are not tracked by Git:
- `node_modules/` - Dependencies (can be reinstalled)
- `.env` files - Environment variables (contain secrets)
- `dist/` - Build outputs (can be regenerated)
- Log files
- Editor-specific files
- Test coverage reports
- Docker override files

### Best Practices

- Regular commits with clear messages
- Separate `.gitignore` for frontend and backend
- No sensitive data in the repository
- Proper branch management

---

## How Do I Deploy It?

Deployment means putting the application on a server so others can use it.

### Before Deploying

Make sure:
- Environment variables are set correctly
- Security middleware is enabled (Helmet, CORS, rate limiting)
- Error handling is in place
- Logging is configured
- Health check endpoint works
- Docker configuration is complete
- Database connection has retry logic
- Passwords are hashed
- JWT authentication works
- Input validation is in place

### Deployment Options

**Option 1: Docker Compose (Easiest)**

Best for a single server:
```bash
docker-compose up -d
```

**Option 2: Kubernetes**

Best for large-scale deployments:
- Deploy containers to a Kubernetes cluster
- Use ConfigMaps for environment variables
- Use Secrets for sensitive data

**Option 3: Cloud Platforms**

**AWS:**
- Use ECS, Elastic Beanstalk, or EC2
- Set up load balancing
- Configure auto-scaling

**Azure:**
- Use Container Instances or App Service
- Configure networking
- Set up monitoring

**GCP:**
- Use Cloud Run or Compute Engine
- Configure IAM
- Set up logging

**Option 4: Traditional Server**

1. Install Node.js and MongoDB on the server
2. Build the frontend: `npm run build`
3. Start the backend: `npm start`
4. Serve the frontend with nginx or similar

### Production Checklist

Before going live, make sure:

- [ ] Set a strong JWT_SECRET (use a random string)
- [ ] Configure production MongoDB URI
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up health check monitoring
- [ ] Test everything thoroughly

---

## What's Next?

Here are some ideas for future improvements:

1. **End-to-End Testing**
   - Use Playwright or Cypress to test complete user workflows
   - Makes sure everything works together

2. **CI/CD Pipeline**
   - Use GitHub Actions to automatically test and deploy
   - Saves time and reduces errors

3. **API Documentation**
   - Use Swagger or OpenAPI to document the API
   - Makes it easier for others to use the API

4. **Performance Monitoring**
   - Add application performance monitoring
   - Helps identify and fix performance issues

5. **Caching**
   - Use Redis to cache frequently accessed data
   - Makes the system faster

6. **Real-time Updates**
   - Use WebSockets for live updates
   - Users see changes immediately

7. **Email Notifications**
   - Send emails when bookings are created or changed
   - Keeps users informed

8. **File Upload Optimization**
   - Optimize images and use a CDN
   - Makes the site load faster

9. **Advanced Search**
   - Add full-text search and better filtering
   - Makes it easier to find resources

10. **Mobile App**
    - Create a React Native mobile app
    - Makes it easier to book on mobile devices

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
cd backend

npm start            # Start production server
npm run dev          # Start development server with auto-reload
npm run seed         # Add sample data to database
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:api     # Test API connections
```

---

## Branding and Design

### Design Rules

- No rounded corners: All UI elements have square corners
- No gradients: Only flat, solid colors
- Brand colors: Use exact colors from the logo
- Textures: School-material icon patterns on white backgrounds

### Updating Logo and Colors

1. **Logo:** Place your logo in `public/logo.svg` or `public/logo.png`
2. **Colors:** Extract color codes from your logo and update `src/index.css`
3. **Watermark:** Update `src/components/LogoWatermark.tsx` to use your logo

---

## Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- When you log in, you get a token
- This token proves you're logged in
- The token is stored securely
- Protected pages check for the token

**Routes:**
- Login: `/auth/login`
- Register: `/auth/register`
- Protected routes require authentication
- Different roles have different permissions

---

## Support

If you have questions or find problems, please open an issue in the repository.

---

**E-shuri Smart Classroom Resource Booking System** - Making resource management easy for schools and universities.
