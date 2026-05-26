#!/usr/bin/env python
"""
数据库初始化脚本
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

async def main():
    """Initialize database"""
    from back_end.app.database import init_db
    
    try:
        print("🔄 Initializing database...")
        await init_db()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
