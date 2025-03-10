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

# Kill any existing Flask processes
echo "Stopping any running Flask processes..."
pkill -f "python app.py" || true

# Start the Flask app
echo "Starting Flask API..."
python app.py 