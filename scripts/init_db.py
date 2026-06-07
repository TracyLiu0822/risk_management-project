#!/usr/bin/env python
"""Development-only database initialization helper."""

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "back_end"))


async def main() -> None:
    from app.database import init_db

    await init_db()
    print("Database tables initialized.")


if __name__ == "__main__":
    asyncio.run(main())
