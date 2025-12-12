# Multi-stage build for production optimization

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
RUN npm ci

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend/ .

# Stage 3: Production runtime
FROM node:18-alpine

WORKDIR /app

# Install production dependencies for backend
COPY --from=backend-builder /app/backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy built backend
COPY --from=backend-builder /app/backend ./backend

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Install serve for frontend
RUN npm install -g serve

# Expose ports
EXPOSE 3000 8080

# Create startup script
RUN echo '#!/bin/sh\n\
cd /app/backend\n\
node server.js &\n\
cd /app/frontend\n\
serve -s dist -l 8080\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]

