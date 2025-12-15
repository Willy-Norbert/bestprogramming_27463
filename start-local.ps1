# Script to start the project locally without Docker

Write-Host "`n=== Starting E-shuri (Local Development) ===" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

# Check for .env files
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    "VITE_API_BASE_URL=http://localhost:3000/api" | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "Created .env file. You may need to edit it." -ForegroundColor Green
}

if (-not (Test-Path "backend/.env")) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    @"
MONGODB_URI=mongodb://localhost:27017/eshuri
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
    Write-Host "Created backend/.env file. Please update JWT_SECRET!" -ForegroundColor Yellow
}

Write-Host "`nStarting services..." -ForegroundColor Cyan
Write-Host "`nBackend will start in a new window..." -ForegroundColor Yellow
Write-Host "Frontend will start in this window...`n" -ForegroundColor Yellow

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; Write-Host 'Starting on http://localhost:3000' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start frontend in current window
Write-Host "Starting frontend..." -ForegroundColor Green
Write-Host "`n=== FRONTEND SERVER ===" -ForegroundColor Cyan
Write-Host "Will be available at: http://localhost:5173`n" -ForegroundColor Green

npm run dev

