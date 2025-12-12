# E-shuri - Smart Classroom Resource Booking System

A web application for managing classroom and resource bookings in academic institutions.

## What is This?

E-shuri is a booking system for schools and universities. Students and staff can book classrooms and resources through a website. The system automatically checks availability and prevents double bookings.

## What Problems Does It Solve?

- **Manual Processes**: Eliminates paper forms and spreadsheets
- **Double Bookings**: Automatically prevents scheduling conflicts
- **No Visibility**: Real-time availability checking
- **Poor Management**: Centralized resource management with reports
- **Fragmented Systems**: One system for all departments

## Features

### User Roles

- **Student**: Browse resources, create bookings, view booking history
- **Staff**: All student features plus department management
- **Admin**: Full system control, user management, analytics, audit logs

### Key Features

- Real-time availability checking
- Automatic conflict detection
- Role-based access control (Student, Staff, Admin)
- Activity tracking and audit logs
- Analytics dashboard
- Responsive web design
- Secure JWT authentication

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Tailwind CSS 3.4.17
- React Router 6.30.1

### Backend
- Node.js 18+
- Express 4.18.2
- MongoDB
- Mongoose 8.0.3
- JWT 9.0.2

### DevOps
- Docker & Docker Compose

## Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Willy-Norbert/bestprogramming_27463.git
   cd bestprogramming_27463
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create `.env` in root:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

   Create `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eshuri
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   PORT=3000
   ```

4. **Start MongoDB** (if not using Docker)

5. **Seed database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

### Option 2: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Willy-Norbert/bestprogramming_27463.git
   cd bestprogramming_27463
   ```

2. **Create `backend/.env`**
   ```env
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

This starts:
- MongoDB on port 27017
- Backend API on port 3000
- Frontend on port 8080

## Running the Application

### Development Mode

**Start backend:**
```bash
cd backend
npm run dev
```

**Start frontend** (in new terminal):
```bash
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### Docker

```bash
docker-compose up -d    # Start
docker-compose down     # Stop
docker-compose logs     # View logs
```

## Project Structure

```
├── src/                 # Frontend code
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   └── lib/            # Utilities
├── backend/            # Backend code
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Express middleware
└── docker-compose.yml  # Docker configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Create resource (Admin)
- `PATCH /api/resources/:id` - Update resource (Admin)

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking

### Dashboard & Reports
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/reports/usage` - Usage reports (Admin)
- `GET /api/audit-logs` - Audit logs (Admin)

## Testing

**Frontend:**
```bash
npm run test
npm run test:coverage
```

**Backend:**
```bash
cd backend
npm run test
npm run test:coverage
```

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS

## Available Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
```

### Backend
```bash
npm start            # Production server
npm run dev          # Development server
npm run seed         # Seed database
npm run test         # Run tests
```

## License

[Your License Here]

---

**E-shuri Smart Classroom Resource Booking System** - Streamlining resource management for educational institutions.
