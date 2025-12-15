@echo off
echo ========================================
echo Starting MongoDB Service
echo ========================================
echo.

net start MongoDB

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: MongoDB service started!
    echo.
    echo Now restart your backend server.
    echo You should see: "Connected to MongoDB"
    echo.
) else (
    echo.
    echo ERROR: Could not start MongoDB service.
    echo.
    echo This script needs to be run as Administrator.
    echo.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
)

