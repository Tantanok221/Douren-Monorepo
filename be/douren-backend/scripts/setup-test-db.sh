#!/bin/bash

# Setup Test Database Script for Backend Integration Tests
# This script sets up the PostgreSQL test database using Docker

echo "🚀 Setting up test database for backend integration tests..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing test database container if it exists
echo "🧹 Cleaning up existing test database..."
docker-compose -f docker-compose.test.yml down -v

# Start PostgreSQL test database
echo "🐘 Starting PostgreSQL test database..."
docker-compose -f docker-compose.test.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker exec $(docker-compose -f docker-compose.test.yml ps -q postgres-test) pg_isready -U test_user -d douren_test; do
    sleep 1
done

echo "✅ Test database is ready!"
echo "📊 Database connection details:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: douren_test"
echo "   User: test_user"
echo "   Password: test_password"
echo ""
echo "🧪 You can now run integration tests with:"
echo "   npm run test:integration"
echo ""
echo "🛑 To stop the test database:"
echo "   docker-compose -f docker-compose.test.yml down"