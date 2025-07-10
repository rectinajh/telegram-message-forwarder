#!/bin/bash

echo "🚀 n8n Telegram Workflow Quickstart"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js installed: $(node -v)"

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please update Node.js."
    exit 1
fi

echo "✅ npx is available"

# Create n8n data directory
mkdir -p ~/.n8n

echo ""
echo "🔧 Preparing to start n8n..."
echo "⏰ The first start may take a few minutes to download dependencies."
echo ""
echo "📝 Next steps after startup:"
echo "1. Your browser will open http://localhost:5678"
echo "2. Follow the steps in n8n-setup.md to configure the workflow"
echo "3. First, create a Telegram Bot (use @BotFather)"
echo "4. Then configure the Telegram Trigger in n8n"
echo ""
echo "⚠️  To stop n8n, press Ctrl+C"
echo ""

# Wait for user confirmation
read -p "Press Enter to continue and start n8n... " -n1 -s
echo ""

# Start n8n
echo "🚀 Starting n8n..."
npx n8n 