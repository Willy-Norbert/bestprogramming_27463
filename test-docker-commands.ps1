# Comprehensive Docker Commands Test Script
# Tests all Docker operations for E-shuri project

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "DOCKER COMMANDS TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @()

# Test 1: Docker Version
Write-Host "[TEST 1] Docker Version Check..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: $dockerVersion" -ForegroundColor Green
        $testResults += @{Test="Docker Version"; Status="PASS"; Details=$dockerVersion}
    } else {
        Write-Host "  ❌ FAIL: Docker not accessible" -ForegroundColor Red
        $testResults += @{Test="Docker Version"; Status="FAIL"; Details="Docker not accessible"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Docker Version"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 2: Docker Compose Version
Write-Host "[TEST 2] Docker Compose Version Check..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: $composeVersion" -ForegroundColor Green
        $testResults += @{Test="Docker Compose Version"; Status="PASS"; Details=$composeVersion}
    } else {
        Write-Host "  ❌ FAIL: Docker Compose not accessible" -ForegroundColor Red
        $testResults += @{Test="Docker Compose Version"; Status="FAIL"; Details="Not accessible"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Docker Compose Version"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 3: Docker Daemon Status
Write-Host "[TEST 3] Docker Daemon Status..." -ForegroundColor Yellow
try {
    $dockerInfo = docker info 2>&1 | Select-Object -First 1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Docker daemon is running" -ForegroundColor Green
        $testResults += @{Test="Docker Daemon"; Status="PASS"; Details="Running"}
    } else {
        Write-Host "  ❌ FAIL: Docker daemon not running" -ForegroundColor Red
        Write-Host "  💡 Start Docker Desktop application" -ForegroundColor Yellow
        $testResults += @{Test="Docker Daemon"; Status="FAIL"; Details="Not running"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Docker Daemon"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 4: List Running Containers
Write-Host "[TEST 4] List Running Containers..." -ForegroundColor Yellow
try {
    $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Container list retrieved" -ForegroundColor Green
        if ($containers -match "eshuri") {
            Write-Host "  📦 E-shuri containers found:" -ForegroundColor Cyan
            $containers | Select-String "eshuri" | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        } else {
            Write-Host "  ℹ️  No E-shuri containers running" -ForegroundColor Yellow
        }
        $testResults += @{Test="List Containers"; Status="PASS"; Details="OK"}
    } else {
        Write-Host "  ❌ FAIL: Cannot list containers" -ForegroundColor Red
        $testResults += @{Test="List Containers"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="List Containers"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 5: List All Containers
Write-Host "[TEST 5] List All Containers (including stopped)..." -ForegroundColor Yellow
try {
    $allContainers = docker ps -a --format "table {{.Names}}\t{{.Status}}" 2>&1 | Select-String "eshuri"
    if ($allContainers) {
        Write-Host "  ✅ PASS: Found E-shuri containers:" -ForegroundColor Green
        $allContainers | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        $testResults += @{Test="List All Containers"; Status="PASS"; Details="Found containers"}
    } else {
        Write-Host "  ℹ️  No E-shuri containers exist yet" -ForegroundColor Yellow
        $testResults += @{Test="List All Containers"; Status="INFO"; Details="No containers"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="List All Containers"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 6: List Docker Images
Write-Host "[TEST 6] List Docker Images..." -ForegroundColor Yellow
try {
    $images = docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Image list retrieved" -ForegroundColor Green
        if ($images -match "mongo|node|eshuri") {
            Write-Host "  📦 Relevant images found:" -ForegroundColor Cyan
            $images | Select-String "mongo|node|eshuri" | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        }
        $testResults += @{Test="List Images"; Status="PASS"; Details="OK"}
    } else {
        Write-Host "  ❌ FAIL: Cannot list images" -ForegroundColor Red
        $testResults += @{Test="List Images"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="List Images"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 7: Validate docker-compose.yml
Write-Host "[TEST 7] Validate docker-compose.yml..." -ForegroundColor Yellow
try {
    $config = docker-compose config 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: docker-compose.yml is valid" -ForegroundColor Green
        $testResults += @{Test="Compose Config"; Status="PASS"; Details="Valid"}
    } else {
        Write-Host "  ❌ FAIL: docker-compose.yml has errors" -ForegroundColor Red
        Write-Host "  Error: $config" -ForegroundColor Red
        $testResults += @{Test="Compose Config"; Status="FAIL"; Details="Invalid"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Compose Config"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 8: List Docker Networks
Write-Host "[TEST 8] List Docker Networks..." -ForegroundColor Yellow
try {
    $networks = docker network ls --format "table {{.Name}}\t{{.Driver}}" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Network list retrieved" -ForegroundColor Green
        if ($networks -match "eshuri") {
            Write-Host "  🌐 E-shuri network found:" -ForegroundColor Cyan
            $networks | Select-String "eshuri" | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        }
        $testResults += @{Test="List Networks"; Status="PASS"; Details="OK"}
    } else {
        Write-Host "  ❌ FAIL: Cannot list networks" -ForegroundColor Red
        $testResults += @{Test="List Networks"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="List Networks"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 9: List Docker Volumes
Write-Host "[TEST 9] List Docker Volumes..." -ForegroundColor Yellow
try {
    $volumes = docker volume ls --format "table {{.Name}}\t{{.Driver}}" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Volume list retrieved" -ForegroundColor Green
        if ($volumes -match "mongodb_data|eshuri") {
            Write-Host "  💾 E-shuri volumes found:" -ForegroundColor Cyan
            $volumes | Select-String "mongodb_data|eshuri" | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        }
        $testResults += @{Test="List Volumes"; Status="PASS"; Details="OK"}
    } else {
        Write-Host "  ❌ FAIL: Cannot list volumes" -ForegroundColor Red
        $testResults += @{Test="List Volumes"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="List Volumes"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 10: Check Port Availability
Write-Host "[TEST 10] Check Port Availability..." -ForegroundColor Yellow
$ports = @(3000, 8080, 27017)
$portStatus = @()
foreach ($port in $ports) {
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "  ⚠️  Port $port is in use" -ForegroundColor Yellow
            $portStatus += "Port $port: IN USE"
        } else {
            Write-Host "  ✅ Port $port is available" -ForegroundColor Green
            $portStatus += "Port $port: AVAILABLE"
        }
    } catch {
        Write-Host "  ✅ Port $port appears available" -ForegroundColor Green
        $portStatus += "Port $port: AVAILABLE"
    }
}
$testResults += @{Test="Port Availability"; Status="PASS"; Details=($portStatus -join ", ")}
Write-Host ""

# Test 11: Docker Compose Services
Write-Host "[TEST 11] List Docker Compose Services..." -ForegroundColor Yellow
try {
    $services = docker-compose config --services 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: Services defined:" -ForegroundColor Green
        $services | ForEach-Object { Write-Host "    - $_" -ForegroundColor White }
        $testResults += @{Test="Compose Services"; Status="PASS"; Details=($services -join ", ")}
    } else {
        Write-Host "  ❌ FAIL: Cannot list services" -ForegroundColor Red
        $testResults += @{Test="Compose Services"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Compose Services"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Test 12: Docker System Info
Write-Host "[TEST 12] Docker System Information..." -ForegroundColor Yellow
try {
    $systemInfo = docker system df 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ PASS: System information retrieved" -ForegroundColor Green
        Write-Host "  📊 Disk usage:" -ForegroundColor Cyan
        $systemInfo | ForEach-Object { Write-Host "    $_" -ForegroundColor White }
        $testResults += @{Test="System Info"; Status="PASS"; Details="OK"}
    } else {
        Write-Host "  ❌ FAIL: Cannot get system info" -ForegroundColor Red
        $testResults += @{Test="System Info"; Status="FAIL"; Details="Error"}
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="System Info"; Status="FAIL"; Details=$_.Exception.Message}
}
Write-Host ""

# Summary
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$info = ($testResults | Where-Object { $_.Status -eq "INFO" }).Count

Write-Host "Total Tests: $($testResults.Count)" -ForegroundColor White
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "ℹ️  Info: $info" -ForegroundColor Yellow
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All tests passed! Docker is ready to use." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Start services: docker-compose up -d" -ForegroundColor White
    Write-Host "  2. View logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "  3. Check status: docker-compose ps" -ForegroundColor White
} else {
    Write-Host "⚠️  Some tests failed. Please check the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "  - Start Docker Desktop if not running" -ForegroundColor White
    Write-Host "  - Wait for Docker to fully start" -ForegroundColor White
    Write-Host "  - Check Docker Desktop settings" -ForegroundColor White
}

Write-Host ""


