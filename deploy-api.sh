#!/bin/bash

# Exit on error
set -e

# Default port if not specified
API_PORT=${API_PORT:-8080}

# Validate port is a number
if ! [[ "$API_PORT" =~ ^[0-9]+$ ]]; then
    echo "❌ Error: '$API_PORT' is not a valid port number."
    echo "Please provide a valid port number."
    exit 1
fi

echo "🚀 Starting deployment of whichcraft-api to Fly.io..."
echo "📡 Using port: $API_PORT"

# Change to the API directory
cd api

# Check if Fly CLI is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI (flyctl) is not installed."
    echo "Please install it by following the instructions at: https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Check if user is authenticated with Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "⚠️ You are not authenticated with Fly.io."
    echo "Please run 'flyctl auth login' to authenticate."
    exit 1
fi

# Set the PORT environment variable in fly.toml configuration
echo "📦 Setting PORT environment variable..."
flyctl secrets set PORT="$API_PORT" --app whichcraft-api

# Deploy the application
echo "📦 Deploying application..."
flyctl deploy --config fly.toml

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your API is now available at: https://whichcraft-api.fly.dev"
    
    # Show app status
    echo "📊 App status:"
    flyctl status
else
    echo "❌ Deployment failed."
    exit 1
fi

echo "🔍 View logs with: flyctl logs"
echo "🛑 To stop the app: flyctl scale count 0"
echo "▶️ To start the app: flyctl scale count 1" 