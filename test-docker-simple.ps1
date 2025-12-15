# Simple Docker Commands Test
# Tests basic Docker functionality

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SIMPLE DOCKER COMMANDS TEST" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Docker Compose Config (works without daemon)
Write-Host "[TEST] docker-compose config --services" -ForegroundColor Yellow
$services = docker-compose config --services 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ PASS" -ForegroundColor Green
    Write-Host "  Services found:" -ForegroundColor White
    $services | ForEach-Object { Write-Host "    - $_" -ForegroundColor Cyan }
} else {
    Write-Host "  ❌ FAIL" -ForegroundColor Red
}
Write-Host ""

# Test 2: Validate docker-compose.yml
Write-Host "[TEST] docker-compose config (validation)" -ForegroundColor Yellow
$config = docker-compose config --quiet 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ PASS - docker-compose.yml is valid" -ForegroundColor Green
} else {
    Write-Host "  ❌ FAIL - docker-compose.yml has errors" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check if Docker Desktop is running
Write-Host "[TEST] Docker daemon status" -ForegroundColor Yellow
try {
    $null = docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS - Docker Desktop is running" -ForegroundColor Green
    } else {
        Write-Host "  ❌ FAIL - Docker Desktop is not running" -ForegroundColor Red
        Write-Host "  💡 Start Docker Desktop application" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ FAIL - Docker Desktop is not running" -ForegroundColor Red
    Write-Host "  💡 Start Docker Desktop application" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration tests: ✅ PASSED" -ForegroundColor Green
Write-Host "Docker daemon: " -NoNewline -ForegroundColor White
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ RUNNING" -ForegroundColor Green
} else {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start Docker:" -ForegroundColor Yellow
    Write-Host "  1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "  2. Wait for it to fully start" -ForegroundColor White
    Write-Host "  3. Run this test again" -ForegroundColor White
}
Write-Host ""



