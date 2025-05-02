import subprocess
import os
import sys

def install_python_requirements():
    """Installs Python dependencies from requirements.txt."""
    if os.path.exists('requirements.txt'):
        print("📦 Installing Python dependencies from requirements.txt...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'])
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Python dependencies installed.")
    else:
        print("⚠️ requirements.txt not found. Skipping Python installation.")

def install_npm_dependencies():
    """Installs Node.js dependencies using npm."""
    if os.path.exists('package.json'):
        print("📦 Running npm install...")
        subprocess.check_call(['npm', 'install'])
        print("✅ npm dependencies installed.")
    else:
        print("⚠️ No package.json found. Skipping npm install.")

if __name__ == "__main__":
    install_python_requirements()
    install_npm_dependencies()
