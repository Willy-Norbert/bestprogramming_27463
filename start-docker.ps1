# Script to wait for Docker Desktop and start the project

Write-Host "`n=== E-shuri Docker Startup ===" -ForegroundColor Cyan
Write-Host "`nWaiting for Docker Desktop to start..." -ForegroundColor Yellow

$maxAttempts = 30
$attempt = 0
$dockerReady = $false

while ($attempt -lt $maxAttempts -and -not $dockerReady) {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts - Checking Docker..." -ForegroundColor Gray
    
    try {
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "`nDocker Desktop is ready!`n" -ForegroundColor Green
            break
        }
    } catch {
        # Docker not ready yet
    }
    
    if (-not $dockerReady) {
        Start-Sleep -Seconds 2
    }
}

if (-not $dockerReady) {
    Write-Host "`nDocker Desktop did not start in time." -ForegroundColor Red
    Write-Host "Please start Docker Desktop manually and wait for it to fully load." -ForegroundColor Yellow
    Write-Host "Then run: docker-compose up -d --build`n" -ForegroundColor White
    exit 1
}

Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Services Started Successfully ===" -ForegroundColor Green
    Write-Host "`nApplication URLs:" -ForegroundColor Yellow
    Write-Host "  Frontend:  http://localhost:8080" -ForegroundColor White
    Write-Host "  Backend:   http://localhost:3000/api" -ForegroundColor White
    Write-Host "  Health:    http://localhost:3000/api/health" -ForegroundColor White
    
    Write-Host "`nUseful commands:" -ForegroundColor Yellow
    Write-Host "  docker-compose ps       - Check status" -ForegroundColor Gray
    Write-Host "  docker-compose logs    - View logs" -ForegroundColor Gray
    Write-Host "  docker-compose down    - Stop services`n" -ForegroundColor Gray
} else {
    Write-Host "`nError starting containers. Check logs with: docker-compose logs`n" -ForegroundColor Red
}

