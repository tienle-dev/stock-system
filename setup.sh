#!/bin/bash

# Script kiểm tra cài đặt và chạy hệ thống

echo "🔍 Checking system setup..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm: $(npm --version)"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Backend dependencies already installed"
fi
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Frontend dependencies already installed"
fi
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "⚠️  Don't forget to add your API keys to backend/.env"
echo ""
