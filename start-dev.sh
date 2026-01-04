#!/bin/bash

# Verified Care - Development Startup Script
# Run with: ./start-dev.sh

echo "🚀 Starting Verified Care Development Environment..."
echo ""

# Load Node.js
source ~/.nvm/nvm.sh
nvm use 20

echo ""
echo "📁 Project: ~/Desktop/Verified-Care-Project"
echo ""

# Check what to start
case "$1" in
  web)
    echo "🌐 Starting Frontend on http://localhost:3001"
    pnpm dev:web
    ;;
  api)
    echo "⚡ Starting API on http://localhost:4000"
    pnpm dev:api
    ;;
  db)
    echo "🗄️  Opening Prisma Studio on http://localhost:5555"
    pnpm db:studio
    ;;
  all)
    echo "🌐 Frontend: http://localhost:3001"
    echo "⚡ API: http://localhost:4000"
    pnpm dev
    ;;
  *)
    echo "Usage: ./start-dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  web   - Start frontend only (port 3001)"
    echo "  api   - Start API only (port 4000)"
    echo "  db    - Open Prisma Studio (port 5555)"
    echo "  all   - Start everything"
    echo ""
    echo "Quick start:"
    echo "  ./start-dev.sh web"
    echo ""
    ;;
esac
