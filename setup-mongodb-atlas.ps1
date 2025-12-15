# Script to help set up MongoDB Atlas connection

Write-Host "`n=== MongoDB Atlas Setup Helper ===" -ForegroundColor Cyan
Write-Host "`nThis script will help you configure MongoDB Atlas connection.`n" -ForegroundColor Yellow

Write-Host "STEP 1: Create MongoDB Atlas Account" -ForegroundColor Green
Write-Host "  1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
Write-Host "  2. Sign up for free account" -ForegroundColor White
Write-Host "  3. Create a FREE cluster (M0 tier)" -ForegroundColor White
Write-Host "`nPress Enter when you have created the cluster..." -ForegroundColor Yellow
Read-Host

Write-Host "`nSTEP 2: Database User Setup" -ForegroundColor Green
Write-Host "  1. Go to Database Access" -ForegroundColor White
Write-Host "  2. Add new database user" -ForegroundColor White
Write-Host "  3. Save the username and password" -ForegroundColor White
Write-Host "`nEnter your MongoDB Atlas username:" -ForegroundColor Yellow
$username = Read-Host

Write-Host "`nEnter your MongoDB Atlas password:" -ForegroundColor Yellow
$password = Read-Host

Write-Host "`nSTEP 3: Network Access" -ForegroundColor Green
Write-Host "  1. Go to Network Access" -ForegroundColor White
Write-Host "  2. Add IP Address" -ForegroundColor White
Write-Host "  3. Click 'Allow Access from Anywhere' (for development)" -ForegroundColor White
Write-Host "`nPress Enter when network access is configured..." -ForegroundColor Yellow
Read-Host

Write-Host "`nSTEP 4: Get Connection String" -ForegroundColor Green
Write-Host "  1. Go to Database → Connect" -ForegroundColor White
Write-Host "  2. Choose 'Connect your application'" -ForegroundColor White
Write-Host "  3. Copy the connection string" -ForegroundColor White
Write-Host "`nPaste your connection string here (replace <username> and <password> with your credentials):" -ForegroundColor Yellow
$connectionString = Read-Host

# Update the connection string with actual username and password
$connectionString = $connectionString -replace '<username>', $username
$connectionString = $connectionString -replace '<password>', [System.Web.HttpUtility]::UrlEncode($password)

# Ensure database name is in the connection string
if ($connectionString -notmatch '/eshuri') {
    if ($connectionString -match '(\?.*)$') {
        $connectionString = $connectionString -replace '(\?.*)$', '/eshuri$1'
    } else {
        $connectionString = $connectionString + '/eshuri'
    }
}

Write-Host "`nUpdating backend/.env file..." -ForegroundColor Cyan

# Read current .env file
$envPath = "backend/.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $updated = $false
    
    # Update or add MONGODB_URI
    $newContent = $envContent | ForEach-Object {
        if ($_ -match '^MONGODB_URI=') {
            $updated = $true
            "MONGODB_URI=$connectionString"
        } else {
            $_
        }
    }
    
    if (-not $updated) {
        $newContent += "MONGODB_URI=$connectionString"
    }
    
    $newContent | Out-File -FilePath $envPath -Encoding utf8
} else {
    # Create new .env file
    @"
MONGODB_URI=$connectionString
JWT_SECRET=eshuri-secret-key-2024-change-in-production
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath $envPath -Encoding utf8
}

Write-Host "`n✅ Updated backend/.env with MongoDB Atlas connection string!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your backend server (Ctrl+C, then npm run dev)" -ForegroundColor White
Write-Host "  2. You should see: '✅ Connected to MongoDB'" -ForegroundColor White
Write-Host "  3. Try logging in again`n" -ForegroundColor White

