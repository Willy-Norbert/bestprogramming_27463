# Script to start MongoDB service

Write-Host "`n=== Starting MongoDB ===" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "`n⚠️  This script needs administrator privileges to start MongoDB service." -ForegroundColor Yellow
    Write-Host "`nOption 1: Run PowerShell as Administrator, then run this script" -ForegroundColor White
    Write-Host "Option 2: Start MongoDB service manually:" -ForegroundColor White
    Write-Host "  1. Press Win+R" -ForegroundColor Gray
    Write-Host "  2. Type: services.msc" -ForegroundColor Gray
    Write-Host "  3. Find 'MongoDB Server (MongoDB)'" -ForegroundColor Gray
    Write-Host "  4. Right-click → Start`n" -ForegroundColor Gray
    
    Write-Host "Trying to start without admin privileges..." -ForegroundColor Yellow
}

# Try to start MongoDB service
try {
    $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    
    if ($service) {
        if ($service.Status -eq 'Running') {
            Write-Host "✅ MongoDB service is already running!" -ForegroundColor Green
        } else {
            Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
            Start-Service -Name "MongoDB" -ErrorAction Stop
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
            Write-Host "`nWaiting 3 seconds for MongoDB to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds 3
        }
    } else {
        Write-Host "⚠️  MongoDB service not found with name 'MongoDB'" -ForegroundColor Yellow
        Write-Host "`nTrying alternative method..." -ForegroundColor Yellow
        
        # Try to find MongoDB service with different name
        $mongoServices = Get-Service | Where-Object {$_.DisplayName -like "*MongoDB*"}
        if ($mongoServices) {
            Write-Host "Found MongoDB services:" -ForegroundColor Cyan
            $mongoServices | Format-Table Name, Status, DisplayName
            Write-Host "`nPlease start the service manually from Services (services.msc)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ MongoDB service not found." -ForegroundColor Red
            Write-Host "`nMongoDB might not be installed as a service." -ForegroundColor Yellow
            Write-Host "Try running mongod manually or use MongoDB Atlas instead.`n" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Error starting MongoDB service: $_" -ForegroundColor Red
    Write-Host "`nYou may need to:" -ForegroundColor Yellow
    Write-Host "  1. Run PowerShell as Administrator" -ForegroundColor White
    Write-Host "  2. Or start MongoDB manually from Services (services.msc)" -ForegroundColor White
    Write-Host "  3. Or use MongoDB Atlas (cloud) - see MONGODB_SETUP.md`n" -ForegroundColor White
}

# Check if MongoDB is now accessible
Write-Host "`nTesting MongoDB connection..." -ForegroundColor Cyan
try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "✅ MongoDB is accessible on port 27017!" -ForegroundColor Green
        Write-Host "`nYour backend should now be able to connect." -ForegroundColor Green
        Write-Host "Restart your backend server if it's running.`n" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  MongoDB port 27017 is not accessible yet." -ForegroundColor Yellow
        Write-Host "Wait a few more seconds and restart your backend.`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not test connection. MongoDB might still be starting.`n" -ForegroundColor Yellow
}

