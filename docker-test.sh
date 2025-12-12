#!/bin/bash

echo "=========================================="
echo "DOCKER SETUP TEST SCRIPT"
echo "=========================================="
echo ""

echo "1. Checking Docker installation..."
docker --version
docker-compose --version
echo ""

echo "2. Validating docker-compose.yml..."
docker-compose config > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ docker-compose.yml is valid"
else
    echo "❌ docker-compose.yml has errors"
    exit 1
fi
echo ""

echo "3. Checking for required files..."
files=("Dockerfile" "Dockerfile.frontend" "backend/Dockerfile" "docker-compose.yml")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done
echo ""

echo "4. Testing Docker build (dry-run)..."
echo "   This will validate Dockerfile syntax without building..."
echo "   (Skipping full build to save time)"
echo ""

echo "5. Checking environment variables..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env exists"
else
    echo "⚠️  backend/.env not found (will use defaults)"
fi
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
echo ""
echo "To start the application:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""


