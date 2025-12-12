# PowerShell script to test Docker setup
# Run this script to verify Docker configuration

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "DOCKER SETUP TEST SCRIPT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Docker installation
Write-Host "1. Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "   ✅ Docker Compose installed: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker Compose not found." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Check if Docker is running
Write-Host "2. Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "   💡 Start Docker Desktop and wait for it to fully start." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 3: Validate docker-compose.yml
Write-Host "3. Validating docker-compose.yml..." -ForegroundColor Yellow
try {
    docker-compose config --quiet 2>&1 | Out-Null
    Write-Host "   ✅ docker-compose.yml is valid" -ForegroundColor Green
} catch {
    Write-Host "   ❌ docker-compose.yml has errors" -ForegroundColor Red
    docker-compose config
    exit 1
}
Write-Host ""

# Test 4: Check required files
Write-Host "4. Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "Dockerfile",
    "Dockerfile.frontend",
    "backend/Dockerfile",
    "docker-compose.yml"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file is missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "   ❌ Some required files are missing" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Check .env file
Write-Host "5. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "   ✅ backend/.env exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  backend/.env not found (will use defaults)" -ForegroundColor Yellow
    Write-Host "   💡 Create backend/.env with MONGODB_URI and JWT_SECRET" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Check ports availability (optional)
Write-Host "6. Checking port availability..." -ForegroundColor Yellow
$ports = @(3000, 8080, 27017)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($connection) {
        Write-Host "   ⚠️  Port $port is in use" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Port $port is available" -ForegroundColor Green
    }
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start services: docker-compose up -d" -ForegroundColor White
Write-Host "  2. View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  3. Check status: docker-compose ps" -ForegroundColor White
Write-Host "  4. Test health: curl http://localhost:3000/health" -ForegroundColor White
Write-Host "  5. Stop services: docker-compose down" -ForegroundColor White
Write-Host ""


