# Script to remove bot from GitHub contributors using GitHub API
# Requires: GitHub Personal Access Token with repo permissions

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [string]$Owner = "Willy-Norbert",
    
    [Parameter(Mandatory=$false)]
    [string]$Repo = "bestprogramming_27463"
)

$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
}

Write-Host "Attempting to refresh contributor data..." -ForegroundColor Yellow

# Note: GitHub API doesn't have a direct endpoint to remove contributors
# Contributors are calculated from commit history
# This script will trigger a repository update which may help

$apiUrl = "https://api.github.com/repos/$Owner/$Repo"

try {
    # Get repository info
    $repoInfo = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get
    
    Write-Host "Repository: $($repoInfo.full_name)" -ForegroundColor Green
    Write-Host "`nNote: GitHub contributors are calculated from commit history." -ForegroundColor Yellow
    Write-Host "Since we've already rewritten history, the bot should disappear" -ForegroundColor Yellow
    Write-Host "once GitHub recalculates (can take 24-48 hours)." -ForegroundColor Yellow
    Write-Host "`nTo manually check/remove:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/$Owner/$Repo/settings/access" -ForegroundColor White
    Write-Host "2. Check 'Collaborators' section" -ForegroundColor White
    Write-Host "3. Remove bot if listed there" -ForegroundColor White
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure your token has 'repo' permissions" -ForegroundColor Yellow
}

