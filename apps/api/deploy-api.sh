#!/bin/bash

# Exit on error
set -e

# Base directory for the API (the directory containing the Dockerfile)
API_DIR=$(dirname "$(readlink -f "$0")")

# Default port if not specified
API_PORT="${PORT:-8080}"

# Echo with color
function echo_color() {
    GREEN='\033[0;32m'
    NC='\033[0m' # No Color
    echo -e "${GREEN}$1${NC}"
}

echo_color "🚀 Deploying API to Fly.io..."

# Check if Fly CLI is installed
if ! command -v flyctl &> /dev/null; then
    echo "Fly CLI not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in to Fly
if ! flyctl auth whoami &> /dev/null; then
    echo "Not logged in to Fly. Please login first:"
    echo "flyctl auth login"
    exit 1
fi

# Set PORT environment variable for the application
echo "📦 Setting PORT environment variable..."
flyctl secrets set PORT="$API_PORT" --app whichcraft-api

# Copy .env from .env.example if it doesn't exist
if [ ! -f "$API_DIR/.env" ]; then
    echo "Creating .env from .env.example"
    cp "$API_DIR/.env.example" "$API_DIR/.env"
fi

# Deploy the application
echo "📦 Deploying application..."
cd $API_DIR
flyctl deploy --config fly.toml

# Check deployment status
if [ $? -eq 0 ]; then
    echo_color "✅ Deployment successful!"
    echo "🔗 Your API is now available at: https://whichcraft-api.fly.dev"
else
    echo "❌ Deployment failed. Please check the logs."
    exit 1
fi

# Create a temporary file with environment variables for Fly
echo "PORT=$API_PORT" > .fly_env_temp

# Display status
echo_color "📊 Application Status:"
flyctl status

echo_color "📝 Application Logs:"
flyctl logs

echo_color "🎉 Deployment Complete!" 