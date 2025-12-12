# Script to completely clean git history and remove bot contributors
# This will rewrite all commits with your author information

Write-Host "Cleaning git history..." -ForegroundColor Yellow

# Set your author information
$authorName = "irabaruta"
$authorEmail = "willynorbert53@gmail.com"

# Create a fresh orphan branch
Write-Host "Creating fresh orphan branch..." -ForegroundColor Cyan
git checkout --orphan clean-main

# Remove all files from staging
git rm -rf .

# Add all current files
Write-Host "Staging all files..." -ForegroundColor Cyan
git add .

# Create a single commit with explicit author
Write-Host "Creating clean commit..." -ForegroundColor Cyan
git commit -m "E-shuri Smart Classroom Resource Booking System" --author="$authorName <$authorEmail>"

# Delete old main branch
Write-Host "Removing old main branch..." -ForegroundColor Cyan
git branch -D main

# Rename current branch to main
git branch -m main

Write-Host "`nHistory cleaned! Now push with: git push -f origin main" -ForegroundColor Green
Write-Host "WARNING: This will overwrite all remote history!" -ForegroundColor Red

