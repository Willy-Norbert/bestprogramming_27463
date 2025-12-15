# Test Docker setup and configuration

Write-Host "`n=== Docker Test Script ===" -ForegroundColor Cyan

# Test 1: Docker installation
Write-Host "`n[1] Testing Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "  OK Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker not installed!" -ForegroundColor Red
    exit 1
}

# Test 2: Docker Compose
Write-Host "`n[2] Testing Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "  OK Docker Compose: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker Compose not found!" -ForegroundColor Red
    exit 1
}

# Test 3: Docker daemon
Write-Host "`n[3] Testing Docker daemon..." -ForegroundColor Yellow
$result = docker ps 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK Docker daemon is running" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Docker daemon is NOT running" -ForegroundColor Red
    Write-Host "  Action: Start Docker Desktop and wait 2-3 minutes" -ForegroundColor Yellow
    exit 1
}

# Test 4: Check docker-compose.yml
Write-Host "`n[4] Checking docker-compose.yml..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    Write-Host "  OK docker-compose.yml found" -ForegroundColor Green
} else {
    Write-Host "  ERROR: docker-compose.yml not found!" -ForegroundColor Red
    exit 1
}

# Test 5: Check Dockerfiles
Write-Host "`n[5] Checking Dockerfiles..." -ForegroundColor Yellow
if (Test-Path "Dockerfile") {
    Write-Host "  OK Dockerfile found" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Dockerfile not found!" -ForegroundColor Red
}

if (Test-Path "Dockerfile.frontend") {
    Write-Host "  OK Dockerfile.frontend found" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Dockerfile.frontend not found!" -ForegroundColor Red
}

# Test 6: Check environment files
Write-Host "`n[6] Checking environment files..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "  OK backend/.env exists" -ForegroundColor Green
} else {
    Write-Host "  WARNING: backend/.env not found (will be created)" -ForegroundColor Yellow
}

# Test 7: Test docker-compose config
Write-Host "`n[7] Testing docker-compose configuration..." -ForegroundColor Yellow
$configTest = docker-compose config 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK docker-compose.yml is valid" -ForegroundColor Green
} else {
    Write-Host "  ERROR: docker-compose.yml has errors:" -ForegroundColor Red
    Write-Host $configTest -ForegroundColor Red
    exit 1
}

Write-Host "`n=== All Tests Passed ===" -ForegroundColor Green
Write-Host "`nYou can now run: docker-compose up -d --build`n" -ForegroundColor Cyan
