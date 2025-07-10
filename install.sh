#!/bin/bash

# Telegram Message Forwarder Installation Script

echo "🚀 Telegram Message Forwarder Setup"
echo "======================================"

# Check Node.js version
echo "📋 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="16.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo "✅ Node.js $NODE_VERSION is installed (requirement: $REQUIRED_VERSION+)"
    else
        echo "❌ Node.js $NODE_VERSION is too old. Please install Node.js $REQUIRED_VERSION or higher"
        exit 1
    fi
else
    echo "❌ Node.js is not installed. Please install Node.js 16.0.0 or higher"
    echo "   Visit: https://nodejs.org/en/download/"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if config.js exists
echo ""
echo "⚙️ Checking configuration..."
if [ ! -f "config.js" ]; then
    echo "📋 Creating config.js from example..."
    cp example-config.js config.js
    echo "✅ Configuration file created"
    echo ""
    echo "⚠️ IMPORTANT: Please edit config.js with your settings:"
    echo "   - Update source and target groups/channels"
    echo "   - Configure forwarding rules"
    echo "   - Set appropriate keywords and delays"
else
    echo "✅ Configuration file already exists"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📖 Next steps:"
echo "   1. Edit config.js with your forwarding rules"
echo "   2. Run: npm start"
echo "   3. Follow authentication prompts"
echo ""
echo "📚 Need help? Check README.md for detailed instructions"
echo ""
echo "🔧 Useful commands:"
echo "   npm start       - Start the forwarder"
echo "   npm run dev     - Start with debugging"
echo "   Ctrl+C          - Stop the forwarder"
echo "" 