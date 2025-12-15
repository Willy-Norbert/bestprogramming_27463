# Master script - Tries Docker first, falls back to local development
# E-shuri Smart Classroom Resource Booking System

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  E-shuri - Smart Classroom Booking" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to test Docker
function Test-Docker {
    try {
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

# Function to start with Docker
function Start-WithDocker {
    Write-Host "Starting with Docker..." -ForegroundColor Green
    
    # Check if backend/.env exists
    if (-not (Test-Path "backend/.env")) {
        Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
        @"
MONGODB_URI=mongodb://mongodb:27017/eshuri
JWT_SECRET=eshuri-secret-key-2024-change-in-production
NODE_ENV=production
PORT=3000
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
        Write-Host "Created backend/.env with default values" -ForegroundColor Green
    }
    
    Write-Host "`nBuilding and starting containers..." -ForegroundColor Cyan
    docker-compose up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
        Write-Host "`nServices are starting. Wait 30 seconds, then check:" -ForegroundColor Yellow
        Write-Host "  Frontend:  http://localhost:8080" -ForegroundColor White
        Write-Host "  Backend:   http://localhost:3000/api" -ForegroundColor White
        Write-Host "  Health:    http://localhost:3000/api/health`n" -ForegroundColor White
        
        Write-Host "Useful commands:" -ForegroundColor Cyan
        Write-Host "  docker-compose ps       - Check status" -ForegroundColor Gray
        Write-Host "  docker-compose logs     - View logs" -ForegroundColor Gray
        Write-Host "  docker-compose logs -f   - Follow logs" -ForegroundColor Gray
        Write-Host "  docker-compose down      - Stop services`n" -ForegroundColor Gray
        
        # Wait and check status
        Write-Host "Waiting 10 seconds, then checking status..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        docker-compose ps
    } else {
        Write-Host "`nDocker failed. Use local development instead.`n" -ForegroundColor Red
        return $false
    }
    return $true
}

# Function to start locally
function Start-Local {
    Write-Host "Starting local development (no Docker)..." -ForegroundColor Green
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
        Write-Host "Install from: https://nodejs.org/" -ForegroundColor Yellow
        return $false
    }
    
    # Install dependencies
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
    
    # Create .env files
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..." -ForegroundColor Yellow
        "VITE_API_BASE_URL=http://localhost:3000/api" | Out-File -FilePath ".env" -Encoding utf8
    }
    
    if (-not (Test-Path "backend/.env")) {
        Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
        @"
MONGODB_URI=mongodb://localhost:27017/eshuri
JWT_SECRET=eshuri-secret-key-2024-change-in-production
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath "backend/.env" -Encoding utf8
    }
    
    Write-Host "`n=== Starting Services ===" -ForegroundColor Cyan
    Write-Host "`nBackend will open in a new window..." -ForegroundColor Yellow
    Write-Host "Frontend will start here...`n" -ForegroundColor Yellow
    
    # Start backend in new window
    $backendScript = @"
cd '$PWD\backend'
Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan
Write-Host 'Starting on http://localhost:3000' -ForegroundColor Green
Write-Host 'Press Ctrl+C to stop' -ForegroundColor Yellow
npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
    
    # Wait for backend
    Write-Host "Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Start frontend
    Write-Host "`n=== FRONTEND SERVER ===" -ForegroundColor Cyan
    Write-Host "Starting on http://localhost:5173`n" -ForegroundColor Green
    
    npm run dev
}

# Main logic
Write-Host "Checking Docker availability..." -ForegroundColor Yellow

if (Test-Docker) {
    Write-Host "Docker is available!" -ForegroundColor Green
    $choice = Read-Host "`nUse Docker? (Y/n)"
    if ($choice -ne "n" -and $choice -ne "N") {
        if (Start-WithDocker) {
            exit 0
        }
    }
}

Write-Host "`nUsing local development mode...`n" -ForegroundColor Yellow
Start-Local

