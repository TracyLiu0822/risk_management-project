#!/usr/bin/env python
"""
项目初始化脚本 - 设置开发环境
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run command and return success status"""
    try:
        subprocess.run(cmd, shell=True, cwd=cwd, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def setup_backend():
    """Setup backend"""
    print("\n📦 Setting up backend...")
    backend_dir = Path(__file__).parent.parent / "back_end"
    
    # Copy .env if not exists
    env_file = backend_dir / ".env"
    env_example = backend_dir / ".env.example"
    if not env_file.exists() and env_example.exists():
        print("  📋 Copying .env.example to .env...")
        import shutil
        shutil.copy(env_example, env_file)
    
    print("  ✅ Backend setup complete!")

def setup_frontend():
    """Setup frontend"""
    print("\n🎨 Setting up frontend...")
    frontend_dir = Path(__file__).parent.parent / "front_end"
    
    # Copy .env.local if not exists
    env_file = frontend_dir / ".env.local"
    env_example = frontend_dir / ".env.example"
    if not env_file.exists() and env_example.exists():
        print("  📋 Copying .env.example to .env.local...")
        import shutil
        shutil.copy(env_example, env_file)
    
    print("  ✅ Frontend setup complete!")

def main():
    """Main setup function"""
    print("=" * 50)
    print("🚀 Risk Management Platform - Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 10):
        print("❌ Python 3.10+ required!")
        sys.exit(1)
    
    # Check Node version
    node_check = run_command("node --version")
    if not node_check:
        print("⚠️  Node.js not found. Frontend development requires Node.js 18+")
    
    # Setup backend
    try:
        setup_backend()
    except Exception as e:
        print(f"⚠️  Backend setup error: {e}")
    
    # Setup frontend
    try:
        setup_frontend()
    except Exception as e:
        print(f"⚠️  Frontend setup error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Setup complete!")
    print("=" * 50)
    print("\n📖 Next steps:")
    print("  1. Configure .env files with your settings")
    print("  2. Install backend: cd back_end && pip install -r requirements.txt")
    print("  3. Install frontend: cd front_end && npm install")
    print("  4. Start backend: cd back_end && uvicorn app.main:app --reload")
    print("  5. Start frontend: cd front_end && npm run dev")
    print("\n🌐 Access points:")
    print("  - Frontend: http://localhost:3000")
    print("  - Backend API: http://localhost:8000")
    print("  - API Docs: http://localhost:8000/api/docs")

if __name__ == "__main__":
    main()
