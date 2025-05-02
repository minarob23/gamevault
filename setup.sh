#!/bin/bash

# Find available Python binary
if command -v python &> /dev/null; then
    PYTHON=python
elif command -v python3 &> /dev/null; then
    PYTHON=python3
else
    echo "❌ Python is not installed."
    exit 1
fi

echo "📦 Using Python: $PYTHON"

echo "📦 Creating virtual environment..."
$PYTHON -m venv venv || { echo "❌ Failed to create virtual environment"; exit 1; }

source venv/bin/activate || { echo "❌ Failed to activate virtual environment"; exit 1; }

echo "📦 Upgrading pip..."
pip install --upgrade pip

if [ -f requirements.txt ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    echo "✅ Python packages installed."
else
    echo "⚠️  requirements.txt not found. Skipping Python dependency installation."
fi

echo "📦 Installing Node.js dependencies..."
if [ -f package.json ]; then
    npm install
    echo "✅ Node.js packages installed."
else
    echo "⚠️  package.json not found. Skipping npm install."
fi

