#!/bin/bash

# Activate the virtual environment if it exists
if [ -d ".venv" ]; then
  echo "Activating virtual environment..."
  source .venv/bin/activate
fi

# Install dependencies if needed
if [ ! -f ".dependencies_installed" ]; then
  echo "Installing dependencies..."
  pip install -r requirements.txt
  touch .dependencies_installed
fi

# Kill any existing Uvicorn processes
echo "Stopping any running Uvicorn processes..."
pkill -f "uvicorn app.main:app" || true

# Start the FastAPI app with Uvicorn
echo "Starting FastAPI API with Uvicorn..."
uvicorn app.main:app --host 0.0.0.0 --port 5001 